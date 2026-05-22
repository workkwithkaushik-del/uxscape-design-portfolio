/**
 * Post-build script that constructs Vercel Build Output API v3 structure
 * from the TanStack Start vite build output.
 *
 * Key: we use the standard nodejs22.x runtime (which fully supports
 * node:stream and crypto needed by React 19 SSR) and use a highly robust
 * adapter that bridges Node's req/res streams with Web Fetch Requests.
 *
 * Output:
 *   .vercel/output/config.json
 *   .vercel/output/static/               → client assets
 *   .vercel/output/functions/ssr.func/
 *       index.mjs                        → Node.js serverless handler
 *       dist/server/                     → copied server bundle (all deps bundled)
 *       .vc-config.json                  → function config (nodejs22.x)
 */

import { execSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  writeFileSync,
  existsSync,
  unlinkSync,
} from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, ".vercel", "output");
const STATIC = join(OUT, "static");
const FUNC = join(OUT, "functions", "ssr.func");

// ── 1. Create a temporary vite config that wraps the real one ────────
const tmpConfig = join(ROOT, "vite.config.vercel-build.ts");
writeFileSync(
  tmpConfig,
  `import baseConfigFn from "./vite.config";
import { mergeConfig } from "vite";

export default async (env) => {
  const base = await (typeof baseConfigFn === "function" ? baseConfigFn(env) : baseConfigFn);
  return mergeConfig(base, {
    ssr: { noExternal: true },
  });
};
`
);

// ── 2. Run vite build with the temporary config ─────────────────────
console.log("\n🔨 Running vite build (with bundled SSR deps)...\n");
try {
  execSync(`npx vite build --config vite.config.vercel-build.ts`, {
    stdio: "inherit",
    cwd: ROOT,
  });
} finally {
  try { unlinkSync(tmpConfig); } catch {}
}

// ── 3. Verify dist output exists ────────────────────────────────────
const distClient = join(ROOT, "dist", "client");
const distServer = join(ROOT, "dist", "server");

if (!existsSync(distClient) || !existsSync(distServer)) {
  console.error("❌ dist/client or dist/server not found after build.");
  process.exit(1);
}

// ── 4. Clean & create output directories ────────────────────────────
console.log("\n📦 Constructing .vercel/output ...\n");
execSync(`rm -rf "${OUT}"`, { cwd: ROOT });
mkdirSync(STATIC, { recursive: true });
mkdirSync(FUNC, { recursive: true });

// ── 5. Copy client assets to static ─────────────────────────────────
cpSync(distClient, STATIC, { recursive: true });
console.log("   ✔ Copied dist/client → .vercel/output/static");

// ── 6. Copy server bundle into the function ─────────────────────────
const funcServer = join(FUNC, "dist", "server");
mkdirSync(funcServer, { recursive: true });
cpSync(distServer, funcServer, { recursive: true });
console.log("   ✔ Copied dist/server → function bundle");

// ── 7. Write the Node.js serverless function handler ────────────────
const wrapperCode = `
import { Readable } from "node:stream";
import server from "./dist/server/server.js";

export default async function handler(req, res) {
  try {
    // 1. Construct the absolute URL
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
    const url = new URL(req.url, \`\${protocol}://\${host}\`);

    // 2. Map Node headers to Fetch Headers
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => headers.append(key, v));
        } else {
          headers.set(key, value);
        }
      }
    }

    // 3. Create Web Request Options
    const requestOptions = {
      method: req.method,
      headers,
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      requestOptions.body = req;
      requestOptions.duplex = "half";
    }

    const request = new Request(url.toString(), requestOptions);

    // 4. Call standard Fetch handler
    const response = await server.fetch(request, {}, {});

    // 5. Map Web Response back to Node res
    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "transfer-encoding") {
        res.setHeader(key, value);
      }
    });

    if (response.body) {
      Readable.fromWeb(response.body).pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    console.error("SSR Function execution failed:", error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
`;
writeFileSync(join(FUNC, "index.mjs"), wrapperCode.trim() + "\n");
console.log("   ✔ Wrote index.mjs (Node-to-Fetch bridge handler)");

// ── 8. Write .vc-config.json for the function ───────────────────────
const vcConfig = {
  runtime: "nodejs22.x",
  handler: "index.mjs",
  launcherType: "Nodejs",
  supportsResponseStreaming: true,
};
writeFileSync(join(FUNC, ".vc-config.json"), JSON.stringify(vcConfig, null, 2) + "\n");
console.log("   ✔ Wrote .vc-config.json (nodejs22.x)");

// ── 9. Build the routing config ─────────────────────────────────────
const routingConfig = {
  version: 3,
  routes: [
    {
      src: "/assets/(.*)",
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
    { handle: "filesystem" },
    { src: "/(.*)", dest: "/ssr" },
  ],
};

writeFileSync(join(OUT, "config.json"), JSON.stringify(routingConfig, null, 2) + "\n");
console.log("   ✔ Wrote config.json (routing)");

console.log("\n✅ .vercel/output ready for deployment!\n");
