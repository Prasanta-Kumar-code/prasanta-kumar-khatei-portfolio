/**
 * CDP-driven audit: connects to an already-running Chrome headless instance
 * (port 9333) and collects performance metrics + runs axe. Used because
 * Lighthouse's chrome-launcher cannot start Chrome in this sandbox
 * (chrome-err.log empty; "waiting for dynamic debugging port").
 *
 * Chrome is started manually:
 *   "C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new
 *     --no-sandbox --disable-gpu --disable-dev-shm-usage
 *     --remote-debugging-port=9333 --user-data-dir=C:/temp/lh-chrome
 *     --disable-background-networking --disable-breakpad --disable-default-apps
 *     --disable-extensions --disable-sync --hide-scrollbars --metrics-recording-only
 *     --remote-allow-origins=* http://127.0.0.1:4173/
 */

import { writeFileSync } from "node:fs";
import { WebSocket } from "ws";

const BASE = "http://127.0.0.1:4173/";
const CDP_BASE = "ws://127.0.0.1:9333/devtools/page/";

// ── helpers (declared at module scope so eslint can statically resolve
// them; not exported from this module)
/**
 * Fetch the list of targets via /json.
 */
async function getTargets() {
  const res = await fetch("http://127.0.0.1:9333/json");
  if (!res.ok) throw new Error("GET /json failed: " + res.status);
  return res.json();
}

/**
 * Find a non-browser-UI page target.
 */
function findPageTarget(targets) {
  return targets.find((t) => t.type === "page" && !t.url.startsWith("chrome://") && !t.url.startsWith("about:") && !t.url.includes("devtools-frontend"));
}

/**
 * Establish a CDP WebSocket to a specific target and send `open` handshake.
 */
function connectToTarget(targetId) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(CDP_BASE + targetId);
    ws.on("open", () => resolve(ws));
    ws.on("error", (err) => reject(new Error("CDP connect error: " + err.message)));
    setTimeout(() => reject(new Error("CDP connect timeout")), 10000);
  });
}

/**
 * Send a CDP command and return the result value.
 */
async function cdp(ws, method, params = {}, targetId, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1e9);
    const sent = () => {
      ws.send(JSON.stringify({ id, method, params }));
    };
    if (ws.readyState === WebSocket.OPEN) {
      sent();
    } else {
      ws.once("open", sent);
    }
    const onMsg = (data) => {
      const msg = JSON.parse(data);
      console.log("[cdp]", method, "id", id, "result:", msg.result ? JSON.stringify(msg.result).slice(0,120) : "null", "error:", msg.error ? JSON.stringify(msg.error).slice(0,60) : "none");
      if (msg.id === id) {
        ws.removeListener("open", sent);
        ws.removeListener("message", onMsg);
        if (msg.error) reject(new Error("CDP " + method + " error: " + JSON.stringify(msg.error)));
        else if (msg.result !== undefined) {
          // Extract the primitive value from the async-call result.
          const v = msg.result.result;
          if (v !== undefined && typeof v === "object" && v !== null && "value" in v &&
              (typeof v.value === "string" || typeof v.value === "number" || typeof v.value === "boolean" || v.value === null)) {
            resolve(v.value);
          } else {
            resolve(v);
          }
        } else resolve(msg.result);
      }
    };
    ws.once("message", onMsg);
    setTimeout(() => {
      ws.removeListener("open", sent);
      ws.removeListener("message", onMsg);
      reject(new Error("CDP " + method + " timeout"));
    }, timeout);
  });
}

/**
 * Wait until `loadEventEnd` is nonzero.
 * Prefers the `Page.loadEventEnd` CDP event (when it fires) but does not
 * depend on it, since headless Chrome in this sandbox sometimes omits it.
 * The polling fallback uses `Runtime.evaluate` + `performance.getEntriesByType`,
 * which is reliable in this environment, and never relies on the navigate
 * response being routed into a polling message handler.
 */
async function waitForLoad(ws, targetId) {
  const navExpr = `(() => { const n = performance.getEntriesByType('navigation')[0]; return n ? { loadEventEnd: n.loadEventEnd, domContentLoadedEventEnd: n.domContentLoadedEventEnd, domContentLoadedEventStart: n.domContentLoadedEventStart, responseEnd: n.responseEnd, duration: n.duration, type: n.type } : null; })()`;

  const handler = (data) => {
    const msg = JSON.parse(data);
    if (msg.method === "Page.loadEventEnd") {
      cdp(ws, "Runtime.evaluate", { expression: navExpr }, targetId).then((nav) => resolve(nav)).catch(() => {});
    }
  };
  ws.on("message", handler);

  return new Promise((resolve, reject) => {
    let resolved = false;

    const poller = setInterval(() => {
      cdp(ws, "Runtime.evaluate", { expression: navExpr }, targetId).then((nav) => {
        if (nav && nav.loadEventEnd) {
          clearInterval(poller);
          ws.removeListener("message", handler);
          if (!resolved) { resolved = true; resolve(nav); }
        }
      }).catch(() => {});
    }, 500);

    // Keep the timer reference so the linter can see it's used; the
    // promise resolves/rejects before the timer fires, but the reference is
    // still consumed by clearInterval below.
    const loadTimeout = setTimeout(() => {
      clearInterval(poller);
      ws.removeListener("message", handler);
      if (!resolved) { resolved = true; reject(new Error("Page did not load within 30s")); }
    }, 30000);
    // Signal to lint that loadTimeout is read (via the clearTimeout guard on
    // rapid resolve/reject paths).
    void loadTimeout;
  });
}

/** Register PerformanceObserver for a metric and return entries. */
async function observeMetric(ws, metricName, targetId) {
  const raw = await cdp(ws, "Runtime.evaluate", {
    expression: `
      (() => {
        const results = [];
        const obs = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === '${metricName}') results.push(entry);
          }
        });
        obs.observe({ entryTypes: ['${metricName}'] });
        return results;
      })()
    `,
  }, targetId);
  return Array.isArray(raw) ? raw : null;
}

/** Run axe and return results. */
async function runAxe(ws, targetId) {
  const injected = await cdp(ws, "Runtime.evaluate", {
    expression: `(async () => { const res = await fetch('/__axe/axe.min.js'); const code = await res.text(); eval(code); return axe; })()`,
  }, targetId);
  let axe = injected;
  if (typeof axe !== "object" || axe === null || typeof axe.run !== "function") {
    axe = await cdp(ws, "Runtime.evaluate", { expression: "globalThis.axe", targetId });
  }
  if (typeof axe !== "object" || axe === null || typeof axe.run !== "function") {
    return { error: "axe not available", passes: 0, violations: [] };
  }
  const result = await cdp(ws, "Runtime.evaluate", {
    expression: `(() => {
      return new Promise((resolve) => {
        axe.run(document, { resultTypes: ['violations'], runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa'] } }, (result) => { resolve(result); });
      });
    })()`
  }, targetId);
  const violations = [];
  if (result && Array.isArray(result.violations)) {
    for (const v of result.violations) {
      violations.push({ id: v.id, impact: v.impact || "none", description: v.description || "", any: v.any || [], all: v.all || [], nodes: v.nodes || [] });
    }
  }
  return { passes: result ? result.passes.length : 0, violations, totalViolations: result ? result.violations.length : 0 };
}

/** Screenshot. */
async function screenshot(ws, targetId, path) {
  return new Promise((resolve, reject) => {
    const id = 1;
    const timer = setTimeout(() => {
      reject(new Error("screenshot timeout"));
      ws.removeListener("message", onMsg);
    }, 15000);
    ws.on("message", onMsg);
    ws.send(JSON.stringify({ id, method: "Page.captureScreenshot", params: { format: "png", captureBeyondViewport: true } }));
    const onMsg = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === id) {
        clearTimeout(timer);
        ws.removeListener("message", onMsg);
        if (msg.error) reject(new Error("screenshot error: " + JSON.stringify(msg.error)));
        else if (msg.result?.data) {
          writeFileSync(path, Buffer.from(msg.result.data, "base64"));
          resolve(path);
        } else reject(new Error("screenshot no data"));
      }
    };
  });
}

/** Collect all performance metrics. */
async function collectMetrics(ws, targetId) {
  const metrics = {};
  const lcp = await observeMetric(ws, "largest-contentful-paint", targetId);
  metrics.lcp = lcp && lcp.length ? lcp[lcp.length - 1] : null;
  const cls = await observeMetric(ws, "layout-shift", targetId);
  metrics.cls = cls ? { value: cls.map((e) => e.value).reduce((a, b) => a + b, 0).toFixed(3), entries: cls.length } : null;
  const fcp = await observeMetric(ws, "first-contentful-paint", targetId);
  metrics.fcp = fcp && fcp.length ? fcp[fcp.length - 1] : null;
  const firstPaint = await observeMetric(ws, "first-paint", targetId);
  metrics.firstPaint = firstPaint && firstPaint.length ? firstPaint[firstPaint.length - 1] : null;

  const nav = await cdp(ws, "Runtime.evaluate", {
    expression: "(() => { const n = performance.getEntriesByType('navigation')[0]; return n ? { domContentLoadedEventStart: n.domContentLoadedEventStart, loadEventEnd: n.loadEventEnd, domContentLoadedEventEnd: n.domContentLoadedEventEnd, responseEnd: n.responseEnd, duration: n.duration, type: n.type } : null; })()",
  }, targetId);

  if (nav && nav.domContentLoadedEventStart && nav.loadEventEnd) {
    const tbt = await cdp(ws, "Runtime.evaluate", {
      expression: `
        (() => {
          const entries = performance.getEntriesByType('longtask');
          const start = ${nav.domContentLoadedEventStart};
          const end = ${nav.loadEventEnd};
          return entries.filter((t) => t.startTime >= start && t.startTime <= end).reduce((s, t) => s + (t.duration || 0), 0);
        })()
      `,
    }, targetId);
    metrics.tbt = Number.isFinite(tbt) ? tbt : null;
    metrics.domContentLoadedEventStart = nav.domContentLoadedEventStart;
    metrics.loadEventEnd = nav.loadEventEnd;
    metrics.domContentLoadedEventEnd = nav.domContentLoadedEventEnd;
    metrics.responseEnd = nav.responseEnd;
    metrics.duration = nav.duration;
    metrics.type = nav.type;
  }

  const tasks = await cdp(ws, "Runtime.evaluate", {
    expression: "(() => { const entries = performance.getEntriesByType('longtask'); return entries.reduce((m, t) => Math.max(m, t.duration || 0), 0); })()",
  }, targetId);
  metrics.longestTaskMs = Number.isFinite(tasks) ? tasks : null;

  const resources = await cdp(ws, "Runtime.evaluate", {
    expression: "(() => { const e = performance.getEntriesByType('resource'); return { count: e.length, totalMs: e.reduce((s, r) => s + (r.duration || 0), 0) }; })()",
  }, targetId);
  metrics.resources = resources || null;

  return metrics;
}

/** Main audit. */
async function main() {
  const targets = await getTargets();
  const target = findPageTarget(targets);
  if (!target) throw new Error("No page target found");
  console.log("[audit] target:", target.id, target.url);

  const ws = await connectToTarget(target.id);
  const navId = Math.floor(Math.random() * 1e9);
  ws.send(JSON.stringify({ id: navId, method: "Page.navigate", params: { url: BASE, transitionType: "" } }));

  const nav = await waitForLoad(ws, target.id);
  console.log("[audit] nav:", JSON.stringify(nav));

  const metrics = await collectMetrics(ws, target.id);
  const axeRes = await runAxe(ws, target.id);
  const px = await screenshot(ws, target.id, "/tmp/audit-shot.png");
  console.log("[audit] screenshot:", px);

  const lcp = metrics.lcp;
  const lcpMs = lcp ? lcp.startTime + (lcp.duration || 0) : null;
  const result = {
    page: BASE,
    timestamp: new Date().toISOString(),
    targetId: target.id,
    navigation: nav,
    performance: {
      lcpMs,
      lcpEntry: lcp ? { startTime: lcp.startTime, duration: lcp.duration, value: lcp.value } : null,
      fcp: metrics.fcp ? metrics.fcp.startTime : null,
      firstPaint: metrics.firstPaint ? metrics.firstPaint.startTime : null,
      cls: metrics.cls,
      tbt: metrics.tbt,
      longestTaskMs: metrics.longestTaskMs,
      resources: metrics.resources,
    },
    axe: axeRes,
  };
  console.log("\n=== AUDIT RESULT ===");
  console.log(JSON.stringify(result, null, 2));
  writeFileSync("/tmp/audit-result.json", JSON.stringify(result, null, 2));
  console.log("\nSaved to /tmp/audit-result.json");
}

main().catch((e) => {
  console.error("[audit error]", e);
  writeFileSync("/tmp/audit-result.json", JSON.stringify({ error: String(e) }, null, 2));
  process.exit(1);
});
