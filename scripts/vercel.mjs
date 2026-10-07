import { runVercel } from "./vercel-cli.mjs";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: npm run vercel -- <command> [arguments]");
  process.exit(1);
}

try {
  process.exitCode = runVercel(args);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
