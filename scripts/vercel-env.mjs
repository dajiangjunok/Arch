import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";

const usage = "Usage: npm run vercel:env -- <production|preview|development> <KEY...|--fellowship> [--dry-run]";
const fellowshipKeys = [
  "STRIPE_PRICE_FELLOWSHIP_SINGLE_WEEK",
  "STRIPE_PRICE_FELLOWSHIP_TWO_WEEKS",
  "STRIPE_PRICE_FELLOWSHIP_FULL_PROGRAM",
  "ARCH_TICKET_AMOUNT_FELLOWSHIP_SINGLE_WEEK",
  "ARCH_TICKET_AMOUNT_FELLOWSHIP_TWO_WEEKS",
  "ARCH_TICKET_AMOUNT_FELLOWSHIP_FULL_PROGRAM",
];

async function main() {
  const [target, ...args] = process.argv.slice(2);
  if (target === "--help") {
    console.log(usage);
    return;
  }
  if (!["production", "preview", "development"].includes(target)) throw new Error(usage);
  const dryRun = args.includes("--dry-run");
  const keys = [...new Set(args.flatMap((arg) => {
    if (arg === "--dry-run") return [];
    if (arg === "--fellowship") return fellowshipKeys;
    if (!/^[A-Z_][A-Z0-9_]*$/.test(arg)) throw new Error(`Invalid variable name or option: ${arg}`);
    if (arg.startsWith("VERCEL_")) throw new Error("VERCEL_* tokens and system variables are not application configuration.");
    return [arg];
  }))];
  if (!keys.length) throw new Error(usage);

  // Read the file directly so shell variables cannot override the chosen values.
  const local = parseEnv(readFileSync(new URL("../.env.local", import.meta.url), "utf8"));
  const project = JSON.parse(readFileSync(new URL("../.vercel/project.json", import.meta.url), "utf8"));
  if (!project.projectId || !project.orgId) throw new Error("Missing projectId or orgId in .vercel/project.json.");
  const variables = keys.map((key) => {
    if (!local[key]?.trim()) throw new Error(`${key} is missing or empty in .env.local.`);
    return {
      key,
      value: local[key],
      type: target === "development" || key.startsWith("NEXT_PUBLIC_") ? "encrypted" : "sensitive",
      target: [target],
    };
  });
  console.log(`Project: ${project.projectName || project.projectId}; environment: ${target}`);
  for (const key of keys) console.log(`${dryRun ? "Would sync" : "Syncing"}: ${key}`);
  if (dryRun) return;
  if (!local.VERCEL_TOKEN) throw new Error("VERCEL_TOKEN is missing from .env.local.");

  async function request(method, upsert = false) {
    const url = new URL(`https://api.vercel.com/v10/projects/${encodeURIComponent(project.projectId)}/env`);
    url.searchParams.set("teamId", project.orgId);
    if (upsert) url.searchParams.set("upsert", "true");
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${local.VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      ...(method === "POST" ? { body: JSON.stringify(variables) } : {}),
      signal: AbortSignal.timeout(30000),
    });
    const data = await response.json();
    // Vercel error payloads can contain submitted values. Never log raw responses.
    if (!response.ok) throw new Error(`Vercel ${method} failed (HTTP ${response.status}).`);
    if (data.failed?.length) throw new Error(`Vercel rejected ${data.failed.length} variable(s); some updates may have succeeded.`);
    return data;
  }

  const result = await request("POST", true);
  const updated = Array.isArray(result.created) ? result.created : [result.created];
  if (keys.some((key) => !updated.some((entry) => entry?.key === key && entry.target?.includes(target)))) {
    throw new Error("Vercel did not acknowledge every requested variable. Check configuration before deploying.");
  }
  const saved = await request("GET");
  if (keys.some((key) => !saved.envs?.some((entry) => entry.key === key && entry.target?.includes(target)))) {
    throw new Error("Could not verify every variable in the target environment.");
  }
  console.log(`Synced ${keys.length} variables from .env.local. Values are not displayed.`);
  console.log("Redeploy the application to apply the updated values.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
