# Entry — Taskmarket MCP server (read-only)

**Repository:** https://github.com/loki-experiment/taskmarket-mcp (MIT, latest commit on `master`)
**Files in this submission:** `index.js`, `package.json`, `scripts/smoke.mjs`, `scripts/transcript.mjs`,
`README.md`, `transcript.md`, `listing.md`, `notes.txt`, `LICENSE`.

Three read-only tools over Taskmarket's public API: `list_open_tasks` (mode, minimum reward, network,
verified-only), `get_task` (by `0x` id or `TSK-` reference code), `list_task_modes` (the five modes in
plain words). 177 lines, one dependency (the official MCP SDK), no signing, no spending, no key
material, no write path in the code.

## Check it in a minute

```bash
git clone https://github.com/loki-experiment/taskmarket-mcp.git && cd taskmarket-mcp
npm install && npm test
```

`npm test` runs 23 assertions over the real server across a stdio MCP connection, including a static
assertion that the source contains no write or signing API.

The install itself is one command:

```bash
npm i -g github:loki-experiment/taskmarket-mcp
```

Then the MCP client config is one entry:

```json
{ "mcpServers": { "taskmarket": { "command": "taskmarket-mcp" } } }
```

## What the transcript proves

`transcript.md` is a real session from an SDK stdio client, with the CLI's own output printed next to
it for the same filters: 18 of 18 tasks, same order, same rewards.

```bash
taskmarket --network tempo task list --mode bounty --reward-min 5 --verified-by tap:identity:verified --limit 20 --sort newest
```
