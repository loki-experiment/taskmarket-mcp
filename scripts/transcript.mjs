#!/usr/bin/env node
/**
 * transcript.mjs — drive the server exactly as an MCP host does.
 *
 * Uses the official SDK's Client + StdioClientTransport (the same stdio
 * transport Claude Desktop, Cursor and other MCP hosts speak) to list the
 * tools and call each one, then prints the raw JSON results. No writes.
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: process.execPath,
  args: [new URL("../index.js", import.meta.url).pathname],
  stderr: "inherit",
});

const client = new Client({ name: "transcript-client", version: "1.0.0" });
await client.connect(transport);

const { tools } = await client.listTools();
console.log("== tools/list ==");
for (const tool of tools) console.log(`- ${tool.name}: ${tool.description.split(".")[0]}.`);

const calls = [
  ["list_task_modes", {}],
  ["list_open_tasks", { network: "tempo", mode: "bounty", minReward: 5, verifiedOnly: true, limit: 5 }],
  ["list_open_tasks", { network: "base", limit: 5 }],
  ["get_task", { id: process.argv[2] || "TSK-XW6AGNNW" }],
];

for (const [name, args] of calls) {
  console.log(`\n== tools/call ${name} ${JSON.stringify(args)} ==`);
  const result = await client.callTool({ name, arguments: args });
  console.log(result.content[0].text);
}

await client.close();
