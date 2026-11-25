#!/usr/bin/env node
/**
 * smoke.mjs — assertions over the real server, spoken over stdio MCP.
 * Run with `npm test`. Requires network access for the public API.
 */
import { readFile } from "node:fs/promises";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const serverPath = new URL("../index.js", import.meta.url).pathname;
const assert = (ok, message) => {
  if (!ok) {
    console.error(`FAIL ${message}`);
    process.exitCode = 1;
    throw new Error(message);
  }
  console.log(`ok   ${message}`);
};

// 1. Static promises the task asks for: small file, no write paths, no key handling.
const source = await readFile(serverPath, "utf8");
const lines = source.trimEnd().split("\n").length;
assert(lines <= 300, `server is ${lines} lines (limit 300)`);
for (const banned of ["writeFile", "appendFile", "createWriteStream", "mkdir", "unlink", "rm(", "privateKey", "mnemonic", "sendTransaction", "eth_sendTransaction"]) {
  assert(!source.includes(banned), `server source does not contain "${banned}"`);
}

// 2. Live behaviour over stdio.
const transport = new StdioClientTransport({ command: process.execPath, args: [serverPath], stderr: "inherit" });
const client = new Client({ name: "smoke", version: "1.0.0" });
await client.connect(transport);

const { tools } = await client.listTools();
assert(tools.length === 3, `three tools listed: ${tools.map((t) => t.name).join(", ")}`);
assert(
  ["list_open_tasks", "get_task", "list_task_modes"].every((n) => tools.some((t) => t.name === n)),
  "tool names are exactly list_open_tasks, get_task, list_task_modes",
);

const call = async (name, args) => {
  const result = await client.callTool({ name, arguments: args });
  const body = JSON.parse(result.content[0].text);
  return { body, isError: Boolean(result.isError) };
};
const modes = await call("list_task_modes", {});
assert(modes.body.modes.length === 5, "list_task_modes returns the five modes");

const filtered = await call("list_open_tasks", { network: "tempo", mode: "bounty", minReward: 5, verifiedOnly: true, limit: 7 });
const rows = filtered.body.tasks;
assert(rows.length > 0 && rows.length <= 7, `limit respected (${rows.length} rows)`);
assert(rows.every((r) => r.mode === "bounty"), "every row is mode=bounty");
assert(rows.every((r) => r.reward >= 5), "every row is at or above the reward floor");
assert(rows.every((r) => r.network === "tempo" && r.token === "OUSD"), "every row is tempo/OUSD");
assert(rows.every((r) => r.verificationRequired.includes("tap:identity:verified")), "every row requires tap:identity:verified");

const baseRows = await call("list_open_tasks", { network: "base", limit: 5 });
assert(baseRows.body.tasks.every((r) => r.network === "base" && r.token === "USDC"), "base rows are USDC");

const one = await call("get_task", { id: rows[0].id });
assert(one.body.id === rows[0].id && one.body.description.length > 40, "get_task by 0x id returns the full description");

const byCode = await call("get_task", { id: rows[0].referenceCode });
assert(byCode.body.id === rows[0].id, `get_task by reference code resolves ${rows[0].referenceCode}`);

const bad = await call("get_task", { id: "TSK-DOESNOTEXIST" });
assert(bad.isError && typeof bad.body.error === "string", "unknown reference code returns a tool error, not a crash");

await client.close();
console.log("\nALL PASS");
