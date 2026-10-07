import { executeVercel, runVercel } from "./vercel-cli.mjs";
import { waitForDeployment } from "./deploy-status.mjs";

let deploymentId;
try {
  const args = process.argv.slice(2);
  if (args.some((arg) => ["--dry", "--help", "-h", "--no-wait"].includes(arg))) {
    process.exitCode = runVercel(["deploy", "--prod", ...args]);
  } else {
    // Submit once; retry only read-only status requests, never the deployment.
    const result = executeVercel(
      ["deploy", "--prod", ...args, "--no-wait", "--format", "json"],
      { captureOutput: true },
    );
    let output;
    try { output = JSON.parse(result.stdout); } catch { /* CLI errors are printed to stderr. */ }
    // CLI JSON is flat in a terminal and wrapped when running in agent mode.
    deploymentId = output?.deployment?.id ?? output?.id;
    if (!deploymentId) {
      throw new Error("Vercel CLI did not return a deployment ID. Check the error and dashboard before retrying deployment.");
    }
    console.log(`Submitted deployment: ${deploymentId}`);
    console.log(`Check status without deploying again: npm run deploy:status -- ${deploymentId}`);
    await waitForDeployment(deploymentId, { waitForAlias: !args.includes("--skip-domain") });
  }
} catch (error) {
  console.error(error.message);
  if (deploymentId) console.error(`Recheck without deploying again: npm run deploy:status -- ${deploymentId}`);
  process.exitCode = 1;
}
