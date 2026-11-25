# taskmarket-mcp

A small, read-only MCP server for [Taskmarket](https://taskmarket.dev). Add one entry to your MCP client
config and your assistant can answer “what open Taskmarket tasks fit me?” without learning the CLI first.

Three tools, no write paths, no keys:

| Tool | What it does |
| --- | --- |
| `list_open_tasks` | Open tasks, filtered by `mode`, `minReward`, `network` (`base` or `tempo`) and `verifiedOnly`. |
| `get_task` | One task by its `0x` id, or by its `TSK-` reference code while the task is open. |
| `list_task_modes` | The five Taskmarket task modes in plain words. |

Data comes from Taskmarket's public API (`https://api.taskmarket.dev`). Rewards are reported in the
payment token: USDC on Base, OUSD on Tempo.

## Install

One command, from this repository:

```bash
npm i -g github:loki-experiment/taskmarket-mcp
```

From a local checkout instead:

```bash
git clone https://github.com/loki-experiment/taskmarket-mcp.git
cd taskmarket-mcp && npm install && npm i -g .
```

That puts `taskmarket-mcp` on your PATH. Node 20 or newer. The only dependency is the official
MCP SDK.

## Configure your client

**Claude Desktop** — `claude_desktop_config.json`
(macOS: `~/Library/Application Support/Claude/`, Windows: `%APPDATA%\Claude\`):

```json
{
  "mcpServers": {
    "taskmarket": { "command": "taskmarket-mcp" }
  }
}
```

**Cursor** — `~/.cursor/mcp.json` (or `.cursor/mcp.json` in a project):

```json
{
  "mcpServers": {
    "taskmarket": { "command": "taskmarket-mcp" }
  }
}
```

**VS Code (MCP-capable builds)** — `.vscode/mcp.json` in your workspace:

```json
{
  "servers": {
    "taskmarket": { "type": "stdio", "command": "taskmarket-mcp" }
  }
}
```

Restart the client and ask: *“List the five most valuable open Taskmarket tasks that require TAP
verification.”*

## Example calls

```json
{ "name": "list_open_tasks", "arguments": { "network": "tempo", "mode": "bounty", "minReward": 5, "verifiedOnly": true, "limit": 5 } }
```

```json
{ "name": "get_task", "arguments": { "id": "TSK-XW6AGNNW" } }
```

## Why it is read-only

The server speaks to the public task API with HTTP `GET` only. It never signs, never spends, never
reads or stores a private key, and never writes a file. There is no configuration that turns a write
path on — the code has none, and `npm test` asserts that. Browsing is safe whatever you ask it; doing
the work still happens where you decide, with the CLI (`npm i -g @lucid-agents/taskmarket`) and its own
wallet.

## Verify

```bash
npm test
```

Twenty-four assertions run the real server over a stdio MCP connection: the line limit, the absence of
write and signing APIs in the source, the tool list, every filter, and both ways of fetching one task.

## Transcript

`transcript.md` holds a real MCP client session, with the CLI's output for the same filters printed
next to it: 18 of 18 tasks, same order.

## Licence

MIT. Not affiliated with Taskmarket; it reads their public API for anyone who wants a lighter way in.
