import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

const root = new URL("../", import.meta.url);

export function getVercelEnvironment() {
  const localPath = new URL(".env.local", root);
  const local = existsSync(localPath) ? parseEnv(readFileSync(localPath, "utf8")) : {};
  const linkPath = new URL(".vercel/project.json", root);
  const link = existsSync(linkPath) ? JSON.parse(readFileSync(linkPath, "utf8")) : {};
  // Match vercel-env.mjs: an updated local token must not be shadowed by the shell.
  const token = local.VERCEL_TOKEN ?? process.env.VERCEL_TOKEN;
  const orgId = (local.VERCEL_ORG_ID ?? process.env.VERCEL_ORG_ID)?.trim() || undefined;
  const projectId = (local.VERCEL_PROJECT_ID ?? process.env.VERCEL_PROJECT_ID)?.trim() || undefined;
  const hasExplicitTarget = orgId !== undefined || projectId !== undefined;
  const targetOrg = hasExplicitTarget ? orgId : link.orgId;
  const targetProject = hasExplicitTarget ? projectId : link.projectId;

  if (!token?.trim()) {
    throw new Error("VERCEL_TOKEN is missing from .env.local or the environment.");
  }
  if (!targetOrg?.trim() || !targetProject?.trim()) {
    throw new Error("Set both VERCEL_ORG_ID and VERCEL_PROJECT_ID in .env.local, or link an existing project first.");
  }

  return {
    ...process.env,
    VERCEL_TOKEN: token,
    VERCEL_ORG_ID: targetOrg,
    VERCEL_PROJECT_ID: targetProject,
  };
}

export function executeVercel(args, { captureOutput = false } = {}) {
  // --scope performs a user lookup that project-scoped tokens cannot authorize.
  // Explicit IDs let the deploy command use the project's own permissions.
  const result = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["--yes", "vercel@62.7.0", ...args],
    {
      cwd: fileURLToPath(root),
      stdio: captureOutput ? ["inherit", "pipe", "inherit"] : "inherit",
      encoding: "utf8",
      env: getVercelEnvironment(),
    },
  );

  if (result.error) {
    throw new Error(`Unable to start Vercel CLI: ${result.error.code}`);
  }
  return result;
}

export function runVercel(args) {
  return executeVercel(args).status ?? 1;
}
