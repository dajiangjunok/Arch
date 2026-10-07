import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { pathToFileURL } from "node:url";
import { getVercelEnvironment } from "./vercel-cli.mjs";

export async function waitForDeployment(reference, {
  env = getVercelEnvironment(),
  fetchImpl = fetch,
  log = console.log,
  pollMs = 5000,
  retryMs = 2000,
  timeoutMs = 15 * 60 * 1000,
  maxFailures = 5,
  waitForAlias = true,
} = {}) {
  const idOrUrl = reference?.replace(/^https:\/\//, "").replace(/\/$/, "");
  if (!idOrUrl || !/^(dpl_[a-zA-Z0-9]+|[a-zA-Z0-9-]+\.vercel\.app)$/.test(idOrUrl)) {
    throw new Error("Provide a deployment ID (dpl_...) or its .vercel.app URL.");
  }
  const url = new URL(`https://api.vercel.com/v13/deployments/${encodeURIComponent(idOrUrl)}`);
  url.searchParams.set("teamId", env.VERCEL_ORG_ID);
  const deadline = Date.now() + timeoutMs;
  let failures = 0;
  let previousState;

  while (Date.now() < deadline) {
    let deployment;
    try {
      const response = await fetchImpl(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${env.VERCEL_TOKEN}` },
        signal: AbortSignal.timeout(Math.min(15000, Math.max(1, deadline - Date.now()))),
      });
      if (!response.ok) {
        const error = new Error(`Vercel status query returned HTTP ${response.status}.`);
        error.retryable = response.status === 429 || response.status >= 500;
        throw error;
      }
      deployment = await response.json();
      failures = 0;
    } catch (error) {
      if (error.retryable === false) throw error;
      failures += 1;
      if (failures >= maxFailures) {
        throw new Error("Could not confirm deployment status after repeated connection failures. The cloud deployment may still succeed.");
      }
      const code = error.cause?.code;
      const reason = typeof code === "string" && /^[A-Z_]+$/.test(code) ? code : "temporary request failure";
      log(`Status query interrupted (${reason}); retrying ${failures}/${maxFailures - 1}.`);
      await delay(Math.min(retryMs * 2 ** (failures - 1), 10000, Math.max(0, deadline - Date.now())));
      continue;
    }

    if (deployment.projectId !== env.VERCEL_PROJECT_ID) {
      throw new Error("The deployment does not belong to the configured VERCEL_PROJECT_ID.");
    }
    const state = deployment.readyState;
    if (["ERROR", "CANCELED"].includes(state)) {
      throw new Error(`Cloud deployment ${deployment.id} ended with ${state}. Check its build logs in Vercel.`);
    }
    if (deployment.aliasError) {
      throw new Error(`Domain assignment failed for deployment ${deployment.id}. Check the Vercel dashboard.`);
    }
    const needsAlias = waitForAlias && deployment.target === "production";
    if (state === "READY" && (!needsAlias || deployment.aliasAssigned === true)) {
      const hostname = needsAlias && deployment.alias?.length ? deployment.alias[0] : deployment.url;
      log(`READY: https://${hostname}`);
      return deployment;
    }
    const label = state === "READY" ? "Assigning production domains" : state || "Waiting for deployment";
    if (label !== previousState) log(`Deployment ${deployment.id}: ${label}`);
    previousState = label;
    await delay(Math.min(pollMs, Math.max(0, deadline - Date.now())));
  }
  throw new Error("Timed out waiting for deployment status. The cloud deployment has not been canceled.");
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  waitForDeployment(process.argv[2]).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
