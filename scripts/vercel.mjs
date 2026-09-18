import { spawnSync } from "node:child_process";

const token = process.env.VERCEL_TOKEN;
const args = process.argv.slice(2);

if (!token) {
  console.error("VERCEL_TOKEN is missing from .env.local.");
  process.exit(1);
}

if (args.length === 0) {
  console.error("Usage: npm run vercel -- <command> [arguments]");
  process.exit(1);
}

const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(
  npxCommand,
  ["vercel", ...args, "--scope", "open-build", "--token", token],
  { stdio: "inherit" },
);

if (result.error) {
  console.error(`Unable to start Vercel CLI: ${result.error.code}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
