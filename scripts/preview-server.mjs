import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { createGzip } from "node:zlib";

const root = join(process.cwd(), "out");
const axeBundle = join(process.cwd(), "node_modules", "axe-core", "axe.min.js");
// PORT=0 is exported by some hosts/sandboxes; ignore non-positive values.
const rawPort = Number(process.env.PORT);
const port = Number.isInteger(rawPort) && rawPort > 0 ? rawPort : 4173;

if (!existsSync(root)) {
  console.error("No build found at ./out - run `npm run build` first.");
  process.exit(1);
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
};

function send(req, res, status, file, contentType) {
  const isStaticAsset = file.includes("_next" + "\\") || file.includes("_next" + "/");
  const cacheControl = isStaticAsset
    ? "public, max-age=31536000, immutable"
    : "public, max-age=0, must-revalidate";

  const headers = {
    "Content-Type": contentType,
    "Cache-Control": cacheControl,
    Vary: "Accept-Encoding",
  };

  const acceptsGzip = /gzip/.test(String(req.headers["accept-encoding"] || ""));
  const compressible = /^(text\/|application\/json|application\/xml|image\/svg)/.test(contentType);

  if (acceptsGzip && compressible && statSync(file).size > 1024) {
    headers["Content-Encoding"] = "gzip";
    res.writeHead(status, headers);
    createReadStream(file).pipe(createGzip({ level: 6 })).pipe(res);
    return;
  }

  res.writeHead(status, headers);
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const url = new URL(req.url || "/", "http://localhost");
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === "/__axe/axe.min.js" && existsSync(axeBundle)) {
    return send(req, res, 200, axeBundle, "text/javascript; charset=utf-8");
  }

  if (pathname.endsWith("/")) pathname += "index.html";
  const target = normalize(join(root, pathname));
  if (!target.startsWith(root)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  if (existsSync(target) && statSync(target).isFile()) {
    return send(req, res, 200, target, types[extname(target)] || "application/octet-stream");
  }

  // SPA-style fallback for extension-less requests.
  const withExt = target + ".html";
  if (existsSync(withExt)) return send(req, res, 200, withExt, types[".html"]);

  const notFound = join(root, "404.html");
  if (existsSync(notFound)) return send(req, res, 404, notFound, types[".html"]);
  res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
}).listen(port, "127.0.0.1", () => {
  console.log("Serving ./out at http://127.0.0.1:" + port);
});
