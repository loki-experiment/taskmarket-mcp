#!/usr/bin/env node
/**
 * taskmarket-mcp — read-only MCP server for Taskmarket's public task data.
 *
 * Tools: list_open_tasks, get_task, list_task_modes.
 * Source: the public Taskmarket API (https://api.taskmarket.dev).
 *
 * Read-only by construction: every tool is an HTTP GET against public data.
 * Nothing here signs, spends, reads a private key or writes to disk.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE = process.env.TASKMARKET_API || "https://api.taskmarket.dev";
const NETWORKS = {
  base: { chainId: 8453, token: "USDC" },
  tempo: { chainId: 4217, token: "OUSD" },
};
const MODES = {
  bounty: "Many workers submit; the requester picks one or more winners.",
  claim: "One worker reserves the task and does it.",
  pitch: "Workers pitch; the requester selects one.",
  benchmark: "Entries are ranked on a metric.",
  auction: "Workers bid on the price.",
};
const PAGE_SIZE = 100;
const MAX_PAGES = 5;

const toUnits = (raw) => Number(raw) / 1e6;

function titleOf(description) {
  const line = String(description || "").split("\n").find((l) => l.trim());
  return line ? line.replace(/^#+\s*/, "").trim() : "(untitled)";
}

function networkOf(task) {
  const name = String(task.chainName || "").toLowerCase();
  if (name === "tempo" || Number(task.chainId) === NETWORKS.tempo.chainId) return "tempo";
  return "base";
}

async function getJson(path) {
  const res = await fetch(API_BASE + path, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Taskmarket API returned ${res.status} for ${path}`);
  const body = await res.json();
  return body.data ?? body;
}

function summarise(task) {
  const network = networkOf(task);
  return {
    id: task.id,
    referenceCode: task.referenceCode,
    title: titleOf(task.description),
    reward: toUnits(task.reward),
    token: NETWORKS[network].token,
    network,
    mode: task.mode,
    expiresAt: task.expiryTime,
    submissions: task.submissionCount,
    tags: task.tags || [],
    verificationRequired: task.verifiedBy || [],
  };
}

async function listOpenTasks({ mode, minReward, network, verifiedOnly, limit = 10 }) {
  const networks = network ? [network] : ["base", "tempo"];
  const rows = [];
  for (const net of networks) {
    let cursor = null;
    for (let page = 0; page < MAX_PAGES && rows.length < limit; page += 1) {
      const query = new URLSearchParams({
        chainId: String(NETWORKS[net].chainId),
        status: "open",
        sort: "newest",
        limit: String(PAGE_SIZE),
      });
      if (mode) query.set("mode", mode);
      if (verifiedOnly) query.set("verifiedBy", "tap:identity:verified");
      if (cursor) query.set("cursor", cursor);
      const data = await getJson(`/api/tasks?${query}`);
      const tasks = data.tasks || [];
      for (const task of tasks) {
        if (minReward != null && toUnits(task.reward) < minReward) continue;
        rows.push(summarise(task));
        if (rows.length >= limit) break;
      }
      if (!data.hasMore || !data.nextCursor || tasks.length === 0) break;
      cursor = data.nextCursor;
    }
  }
  return rows.slice(0, limit);
}

async function getTask({ id }) {
  const key = String(id || "").trim();
  if (/^0x[0-9a-fA-F]{64}$/.test(key)) {
    const task = await getJson(`/api/tasks/${key}`);
    return { ...summarise(task), description: task.description };
  }
  const wanted = key.toUpperCase();
  const open = await listOpenTasks({ limit: PAGE_SIZE });
  const hit = open.find((row) => String(row.referenceCode).toUpperCase() === wanted);
  if (!hit) throw new Error(`No open task with reference code ${key}. Pass the 0x task id for any task.`);
  return await getTask({ id: hit.id });
}

const TOOLS = [
  {
    name: "list_open_tasks",
    description:
      "List open Taskmarket tasks. Optional filters: mode, minimum reward in the payment token, network (base or tempo) and verifiedOnly (tasks that require TAP identity verification). Read-only.",
    inputSchema: {
      type: "object",
      properties: {
        mode: { type: "string", enum: Object.keys(MODES) },
        minReward: { type: "number", minimum: 0, description: "Reward floor in USDC (base) or OUSD (tempo)." },
        network: { type: "string", enum: Object.keys(NETWORKS) },
        verifiedOnly: { type: "boolean", description: "Only tasks requiring tap:identity:verified." },
        limit: { type: "integer", minimum: 1, maximum: 100, default: 10 },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_task",
    description: "Get one Taskmarket task by its 0x id (or by its TSK- reference code while it is open), including the full description. Read-only.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: "0x task id, or a TSK- reference code." } },
      required: ["id"],
      additionalProperties: false,
    },
  },
  {
    name: "list_task_modes",
    description: "List the five Taskmarket task modes in plain words. Read-only.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

function text(value) {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] };
}

const server = new Server(
  { name: "taskmarket-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  try {
    if (name === "list_open_tasks") return text({ tasks: await listOpenTasks(args) });
    if (name === "get_task") return text(await getTask(args));
    if (name === "list_task_modes") {
      return text({
        modes: Object.entries(MODES).map(([mode, plainWords]) => ({ mode, plainWords })),
        paidIn: Object.entries(NETWORKS).map(([network, cfg]) => ({ network, token: cfg.token, chainId: cfg.chainId })),
      });
    }
    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return { content: [{ type: "text", text: JSON.stringify({ error: error.message }, null, 2) }], isError: true };
  }
});

await server.connect(new StdioServerTransport());
