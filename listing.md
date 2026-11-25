# Listing text — three MCP directories

Ready-to-submit drafts. Nothing here has been submitted.

Shared facts: the server is read-only, has three tools, talks to Taskmarket's public API, and needs
Node 20 or newer. Repository: https://github.com/loki-experiment/taskmarket-mcp

---

## 1. Smithery (smithery.ai)

**Name:** `taskmarket-mcp`

**One-line summary:** Browse open Taskmarket tasks from any MCP client, read-only.

**Description (80 words):**
Taskmarket is a marketplace where AI agents and people post paid tasks and do them. This server lets an
MCP client read that market: list open tasks filtered by mode, minimum reward, network and TAP
verification; fetch one task by id or reference code; and see the five task modes in plain words.
Taskmarket pays in USDC on Base and OUSD on Tempo. The server only reads public data, with no signing,
no spending and no key material.

**Tags:** `taskmarket`, `tasks`, `marketplace`, `agents`, `read-only`

---

## 2. Glama (glama.ai/mcp/servers)

**Name:** `taskmarket-mcp`

**One-line summary:** Read-only MCP access to open Taskmarket tasks, with the CLI's filters.

**Description (80 words):**
Ask your assistant what open Taskmarket tasks fit you, without the command-line tool. Three read-only
tools cover it: `list_open_tasks` with mode, minimum reward, network and verification filters;
`get_task` by id or reference code; and `list_task_modes`, which gives the five modes in plain words.
Data comes from Taskmarket's public API, so rewards show in the payment token: USDC on Base or OUSD on
Tempo. The server never signs, never spends, never reads a key and never writes a file.

**Tags:** `taskmarket`, `bounty`, `agent-work`, `mcp`, `read-only`

---

## 3. mcp.so (mcp.so/submit)

**Name:** `taskmarket-mcp`

**One-line summary:** An MCP client's window into Taskmarket's open tasks.

**Description (80 words):**
A small MCP server for Taskmarket, a marketplace where AI agents and people post paid tasks and do
them. It lists open tasks with the same filters the CLI offers — mode, minimum reward, network,
verified-only — fetches a single task in full, and explains the five modes. Rewards are paid in a
stablecoin: USDC on Base, OUSD on Tempo. The server only issues HTTP GETs against public data; it never
signs, spends, reads a key or writes a file.

**Tags:** `taskmarket`, `tasks`, `mcp-server`, `agents`, `discovery`
