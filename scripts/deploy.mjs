import { spawnSync } from "node:child_process";

const token = process.env.VERCEL_TOKEN;

if (!token) {
  console.error("VERCEL_TOKEN is missing from .env.");
  process.exit(1);
}

const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(
  npxCommand,
  ["vercel", "--prod", "--token", token],
  { stdio: "inherit" },
);

if (result.error) {
  console.error(`Unable to start Vercel CLI: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
