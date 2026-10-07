import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * Daily activity check.
 *
 * Runs once a day from the "Daily activity commit" workflow. It probes the live
 * GitHub Pages deployment and records the result in public/status.json, which
 * the workflow then commits. That gives the repository one meaningful commit per
 * day and leaves a rolling uptime log that is itself served at /status.json.
 *
 * Idempotent per calendar day: re-running on a day that already has an entry
 * leaves the file untouched, so a manual re-run does not create a second commit.
 */

const SITE_URL =
  process.env.SITE_URL ??
  "https://prasanta-kumar-code.github.io/prasanta-kumar-khatei-portfolio/";

/** Keep the file small; it is fetched by the browser like any other asset. */
const HISTORY_LIMIT = 30;
const PROBE_TIMEOUT_MS = 15_000;

const statusPath = join(process.cwd(), "public", "status.json");

function today() {
  return new Date().toISOString().slice(0, 10);
}

function readPrevious() {
  if (!existsSync(statusPath)) return { history: [] };

  try {
    const parsed = JSON.parse(readFileSync(statusPath, "utf8"));
    return { history: Array.isArray(parsed.history) ? parsed.history : [] };
  } catch {
    // A malformed file must not wedge the daily job; rebuild it from scratch.
    console.warn(`Ignoring unreadable ${statusPath}; rebuilding from scratch.`);
    return { history: [] };
  }
}

async function probe() {
  const startedAt = Date.now();

  try {
    const response = await fetch(SITE_URL, {
      redirect: "follow",
      headers: { "user-agent": "portfolio-daily-check" },
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });

    return {
      ok: response.ok,
      status: response.status,
      latencyMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      latencyMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const day = today();
const { history } = readPrevious();

if (history.some((entry) => entry.day === day)) {
  console.log(`status.json already records ${day}; nothing to do.`);
  process.exit(0);
}

const result = await probe();
const okChecks = history.filter((entry) => entry.ok).length + (result.ok ? 1 : 0);
const totalChecks = history.length + 1;

const status = {
  site: SITE_URL,
  day,
  checkedAt: new Date().toISOString(),
  uptimeDays: totalChecks,
  successRate: Number(((okChecks / totalChecks) * 100).toFixed(1)),
  lastCheck: result,
  history: [...history, { day, ...result }].slice(-HISTORY_LIMIT),
};

mkdirSync(dirname(statusPath), { recursive: true });
writeFileSync(statusPath, `${JSON.stringify(status, null, 2)}\n`, "utf8");

console.log(
  `Recorded ${day}: ${result.ok ? "reachable" : "unreachable"} ` +
    `(http ${result.status}, ${result.latencyMs}ms).`,
);
