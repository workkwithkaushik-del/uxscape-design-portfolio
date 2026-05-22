/**
 * Post-build script that constructs Vercel Build Output API v3 structure
 * from the TanStack Start vite build output.
 *
 * Key: we set VITE_SSR_NO_EXTERNAL=1 and use a temporary vite config
 * that adds ssr.noExternal:true ONLY for the production build, so dev
 * mode is unaffected.
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
//    This adds ssr.noExternal:true only for the production build so
//    all npm packages are bundled into the server chunks (required for
//    serverless — no node_modules at runtime).
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
console.log("\\n🔨 Running vite build (with bundled SSR deps)...\\n");
try {
  execSync(`npx vite build --config vite.config.vercel-build.ts`, {
    stdio: "inherit",
    cwd: ROOT,
  });
} finally {
  // Always clean up the temp config
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
console.log("\\n📦 Constructing .vercel/output ...\\n");
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
import server from "./dist/server/server.js";

export default async function handler(request) {
  return server.fetch(request, {}, {});
}
`;
writeFileSync(join(FUNC, "index.mjs"), wrapperCode.trim() + "\n");
console.log("   ✔ Wrote index.mjs (Node.js serverless handler)");

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
