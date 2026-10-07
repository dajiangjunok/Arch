import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { waitForDeployment } from "../scripts/deploy-status.mjs";

const env = { VERCEL_TOKEN: "test-token", VERCEL_ORG_ID: "team_test", VERCEL_PROJECT_ID: "prj_test" };
const ready = {
  id: "dpl_test", projectId: "prj_test", readyState: "READY", target: "production",
  aliasAssigned: true, alias: ["example.com"], url: "example.vercel.app",
};
const options = { env, log() {}, pollMs: 0, retryMs: 0 };
const response = (data, status = 200) => new Response(JSON.stringify(data), { status });
const reset = () => new TypeError("fetch failed", { cause: { code: "ECONNRESET" } });

test("connection resets retry the same read-only deployment query", async () => {
  const calls = [];
  const result = await waitForDeployment("dpl_test", {
    ...options,
    fetchImpl: async (url, init) => {
      calls.push({ url: String(url), method: init.method });
      if (calls.length < 3) throw reset();
      return response(ready);
    },
  });
  assert.equal(result.id, "dpl_test");
  assert.equal(calls.length, 3);
  assert.ok(calls.every((call) => call.method === "GET" && call.url === "https://api.vercel.com/v13/deployments/dpl_test?teamId=team_test"));
});

test("waits for both build completion and production domain assignment", async () => {
  const states = [
    { ...ready, readyState: "BUILDING", aliasAssigned: false },
    { ...ready, aliasAssigned: false },
    ready,
  ];
  await waitForDeployment("https://example.vercel.app/", { ...options, fetchImpl: async () => response(states.shift()) });
  assert.equal(states.length, 0);
});

test("retries rate limits and server failures", async () => {
  const statuses = [429, 503, 200];
  await waitForDeployment("dpl_test", { ...options, fetchImpl: async () => response(ready, statuses.shift()) });
  assert.equal(statuses.length, 0);
});

test("permission errors stop immediately", async () => {
  let calls = 0;
  await assert.rejects(waitForDeployment("dpl_test", {
    ...options, fetchImpl: async () => { calls++; return response({}, 403); },
  }), /HTTP 403/);
  assert.equal(calls, 1);
});

test("cloud failures, canceled builds, wrong projects and alias failures are never success", async () => {
  for (const [data, message] of [
    [{ ...ready, readyState: "ERROR" }, /ended with ERROR/],
    [{ ...ready, readyState: "CANCELED" }, /ended with CANCELED/],
    [{ ...ready, projectId: "prj_other" }, /does not belong/],
    [{ ...ready, aliasError: { code: "domain_error" } }, /Domain assignment failed/],
  ]) {
    await assert.rejects(waitForDeployment("dpl_test", { ...options, fetchImpl: async () => response(data) }), message);
  }
});

test("exhausted retries report an unconfirmed deployment without claiming cloud failure", async () => {
  let calls = 0;
  await assert.rejects(waitForDeployment("dpl_test", {
    ...options, maxFailures: 3, fetchImpl: async () => { calls++; throw reset(); },
  }), /cloud deployment may still succeed/);
  assert.equal(calls, 3);
});

test("status timeout does not cancel the deployment", async () => {
  await assert.rejects(waitForDeployment("dpl_test", {
    ...options, timeoutMs: 0, fetchImpl: async () => assert.fail("must not issue a request"),
  }), /has not been canceled/);
});

test("deploy submits only once when the status connection fails", () => {
  const dir = mkdtempSync(join(tmpdir(), "arch-deploy-test-"));
  try {
    mkdirSync(join(dir, "scripts"));
    mkdirSync(join(dir, "bin"));
    for (const name of ["deploy.mjs", "deploy-status.mjs", "vercel-cli.mjs"]) {
      writeFileSync(join(dir, "scripts", name), readFileSync(new URL(`../scripts/${name}`, import.meta.url)));
    }
    writeFileSync(join(dir, ".env.local"), Object.entries(env).map(([key, value]) => `${key}=${value}`).join("\n"));
    const logPath = join(dir, "cli-calls.jsonl");
    writeFileSync(join(dir, "bin", "npx"), `#!/usr/bin/env node
import { appendFileSync } from 'node:fs';
appendFileSync(${JSON.stringify(logPath)}, JSON.stringify(process.argv.slice(2)) + '\\n');
console.log(JSON.stringify(process.env.TEST_CLI_FORMAT === 'flat' ? { id: 'dpl_test' } : { deployment: { id: 'dpl_test' } }));
`, { mode: 0o700 });
    const preload = join(dir, "fetch.mjs");
    writeFileSync(preload, `
let calls = 0;
globalThis.fetch = async () => {
  if (++calls === 1) throw new TypeError('fetch failed', { cause: { code: 'ECONNRESET' } });
  return new Response(${JSON.stringify(JSON.stringify(ready))});
};
`);
    for (const format of ["flat", "wrapped"]) {
      writeFileSync(logPath, "");
      const result = spawnSync(process.execPath, ["--import", preload, join(dir, "scripts/deploy.mjs")], {
        encoding: "utf8", timeout: 10000,
        env: { ...process.env, PATH: `${join(dir, "bin")}:${process.env.PATH}`, VERCEL_TOKEN: "stale-shell-token", TEST_CLI_FORMAT: format },
      });
      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /ECONNRESET/);
      assert.match(result.stdout, /READY: https:\/\/example.com/);
      const calls = readFileSync(logPath, "utf8").trim().split("\n").map(JSON.parse);
      assert.deepEqual(calls, [["--yes", "vercel@62.7.0", "deploy", "--prod", "--no-wait", "--format", "json"]]);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
