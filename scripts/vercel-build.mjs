/**
 * Post-build script that constructs Vercel Build Output API v3 structure
 * from the TanStack Start vite build output.
 *
 * Expected input:
 *   dist/client/         → static assets (JS, CSS, images, PDF, etc.)
 *   dist/server/server.js → SSR entry (Web Fetch API: export default { fetch })
 *   dist/server/assets/  → server-side JS chunks
 *
 * Output:
 *   .vercel/output/config.json
 *   .vercel/output/static/          → client assets
 *   .vercel/output/functions/ssr.func/
 *       index.mjs                   → edge function wrapper
 *       dist/server/                → copied server bundle
 *       .vc-config.json             → function config
 */

import { execSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  writeFileSync,
  existsSync,
  readdirSync,
  statSync,
  readFileSync,
} from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT = join(ROOT, ".vercel", "output");
const STATIC = join(OUT, "static");
const FUNC = join(OUT, "functions", "ssr.func");

// ── 1. Run vite build ──────────────────────────────────────────────
console.log("\n🔨 Running vite build...\n");
execSync("npx vite build", { stdio: "inherit", cwd: ROOT });

// ── 2. Verify dist output exists ────────────────────────────────────
const distClient = join(ROOT, "dist", "client");
const distServer = join(ROOT, "dist", "server");

if (!existsSync(distClient) || !existsSync(distServer)) {
  console.error("❌ dist/client or dist/server not found after build.");
  process.exit(1);
}

// ── 3. Clean & create output directories ────────────────────────────
console.log("\n📦 Constructing .vercel/output ...\n");
execSync(`rm -rf "${OUT}"`, { cwd: ROOT });
mkdirSync(STATIC, { recursive: true });
mkdirSync(FUNC, { recursive: true });

// ── 4. Copy client assets to static ─────────────────────────────────
cpSync(distClient, STATIC, { recursive: true });
console.log("   ✔ Copied dist/client → .vercel/output/static");

// ── 5. Copy server bundle into the function ─────────────────────────
const funcServer = join(FUNC, "dist", "server");
mkdirSync(funcServer, { recursive: true });
cpSync(distServer, funcServer, { recursive: true });
console.log("   ✔ Copied dist/server → function bundle");

// ── 6. Write the Edge Function wrapper ──────────────────────────────
const wrapperCode = `
import server from "./dist/server/server.js";

export default async function handler(request) {
  return server.fetch(request, {}, {});
}

export const config = { runtime: "edge" };
`;
writeFileSync(join(FUNC, "index.mjs"), wrapperCode.trim() + "\n");
console.log("   ✔ Wrote index.mjs (edge function wrapper)");

// ── 7. Write .vc-config.json for the function ───────────────────────
const vcConfig = {
  runtime: "edge",
  entrypoint: "index.mjs",
};
writeFileSync(join(FUNC, ".vc-config.json"), JSON.stringify(vcConfig, null, 2) + "\n");
console.log("   ✔ Wrote .vc-config.json");

// ── 8. Build the routing config ─────────────────────────────────────
// Collect all static file paths for exact/prefix matching
function collectFiles(dir, prefix = "") {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = prefix ? `${prefix}/${name}` : name;
    if (statSync(full).isDirectory()) {
      entries.push(...collectFiles(full, rel));
    } else {
      entries.push(`/${rel}`);
    }
  }
  return entries;
}

const config = {
  version: 3,
  routes: [
    // Serve known static assets directly (assets/, PDFs, etc.)
    {
      src: "/assets/(.*)",
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
    // Let Vercel handle static files first, then fall through to SSR
    { handle: "filesystem" },
    // Everything else → SSR function
    { src: "/(.*)", dest: "/ssr" },
  ],
};

writeFileSync(join(OUT, "config.json"), JSON.stringify(config, null, 2) + "\n");
console.log("   ✔ Wrote config.json (routing)");

console.log("\n✅ .vercel/output ready for deployment!\n");
