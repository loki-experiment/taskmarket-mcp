# transcript.md — a real MCP session, next to the CLI

Captured 2026-11-25T08:48Z on Node v22.23.2 with `@modelcontextprotocol/sdk` 1.32.x.

The client is `scripts/transcript.mjs`: the official SDK's `Client` + `StdioClientTransport` — the same
stdio JSON-RPC transport Claude Desktop, Cursor and other MCP hosts use. Every block below is pasted from a
real run against the published server, not written by hand. Re-run it yourself with `npm run transcript`.

## 1. The server lists its tools

```
- list_open_tasks: List open Taskmarket tasks.
- get_task: Get one Taskmarket task by its 0x id (or by its TSK- reference code while it is open), including the full description.
- list_task_modes: List the five Taskmarket task modes in plain words.
```

## 2. `list_task_modes` — the five modes in plain words

```json
{
  "modes": [
    {
      "mode": "bounty",
      "plainWords": "Many workers submit; the requester picks one or more winners."
    },
    {
      "mode": "claim",
      "plainWords": "One worker reserves the task and does it."
    },
    {
      "mode": "pitch",
      "plainWords": "Workers pitch; the requester selects one."
    },
    {
      "mode": "benchmark",
      "plainWords": "Entries are ranked on a metric."
    },
    {
      "mode": "auction",
      "plainWords": "Workers bid on the price."
    }
  ],
  "paidIn": [
    {
      "network": "base",
      "token": "USDC",
      "chainId": 8453
    },
    {
      "network": "tempo",
      "token": "OUSD",
      "chainId": 4217
    }
  ]
}
```

## 3. `list_open_tasks` — tempo, bounty, reward ≥ 5, verified only, 5 rows

```json
{
  "tasks": [
    {
      "id": "0xcd2c9d57d36a17de7c5e51f469cad4891ef0a9f5a2c7f5397c726cd0830ecaf6",
      "referenceCode": "TSK-B0QTHHPD",
      "title": "Maths degree for 2030, 6 of 6: the 3-year map, and what a graduate can do. $6 shared by all who enter (first 30)",
      "reward": 6,
      "token": "OUSD",
      "network": "tempo",
      "mode": "bounty",
      "expiresAt": "2026-11-25T12:11:18.648Z",
      "submissions": 43,
      "tags": [
        "quick",
        "text"
      ],
      "verificationRequired": [
        "tap:identity:verified"
      ]
    },
    {
      "id": "0x3490288b25fd61ef4dc06a51ba1250ab7c967a7868f724faf237fbe3b9c0c91f",
      "referenceCode": "TSK-4C0RZ8CJ",
      "title": "Moon cargo mission, 6 of 6: name the lander and write its 60-word mission summary. $6 shared by all who enter (first 30)",
      "reward": 6,
      "token": "OUSD",
      "network": "tempo",
      "mode": "bounty",
      "expiresAt": "2026-11-25T09:10:59.254Z",
      "submissions": 47,
      "tags": [
        "quick",
        "text"
      ],
      "verificationRequired": [
        "tap:identity:verified"
      ]
    },
    {
      "id": "0x6401c9a9de89787406d226742e50e461178917b6c53084035e47736d84f41d51",
      "referenceCode": "TSK-5A5FJXTN",
      "title": "Design a physical progress-tracking board: an art installation you update by hand ($5 bounty)",
      "reward": 5,
      "token": "OUSD",
      "network": "tempo",
      "mode": "bounty",
      "expiresAt": "2026-12-08T19:01:48.986Z",
      "submissions": 60,
      "tags": [
        "design",
        "physical",
        "prototype",
        "text"
      ],
      "verificationRequired": [
        "tap:identity:verified"
      ]
    },
    {
      "id": "0x3f6d7b4406bb6d263939514f5612b08e6cec5e9ee9d053d1a601650d446c3947",
      "referenceCode": "TSK-BRK611AN",
      "title": "Build and host Taskmarket's live market visualizer (50 OUSD)",
      "reward": 50,
      "token": "OUSD",
      "network": "tempo",
      "mode": "bounty",
      "expiresAt": "2026-12-01T18:52:41.163Z",
      "submissions": 54,
      "tags": [
        "growth",
        "visualizer",
        "data",
        "dashboard"
      ],
      "verificationRequired": [
        "tap:identity:verified"
      ]
    },
    {
      "id": "0xc5a730d4e1ab1669b28889f67f06e130433ca163d4981e4787e430060e4fb9ba",
      "referenceCode": "TSK-ZJ31CCTJ",
      "title": "Suggest a growth hack for Taskmarket (5 OUSD split among authors of adopted ideas)",
      "reward": 5,
      "token": "OUSD",
      "network": "tempo",
      "mode": "bounty",
      "ex
```

## 4. `list_open_tasks` — base, 5 rows

```json
{
  "tasks": [
    {
      "id": "0x3530b68f364cf93cb8a53a7b5a0e6109f1a4a6634786ae3ef262bb2d7a527013",
      "referenceCode": "TSK-JNEHTD5J",
      "reward": 1,
      "token": "USDC",
      "network": "base",
      "mode": "bounty",
      "expiresAt": "2026-11-30T14:27:36.713Z",
      "submissions": 26,
      "tags": [],
      "verificationRequired": []
    },
    {
      "id": "0x842f03f9c78d890050f8946f46a616b653e21f6cabb08930691425018c2d01f3",
      "referenceCode": "TSK-2DYP3ZP0",
      "reward": 9,
      "token": "USDC",
      "network": "base",
      "mode": "bounty",
      "expiresAt": "2026-11-26T11:23:31.732Z",
      "submissions": 100,
      "tags": [],
      "verificationRequired": []
    },
    {
      "id": "0x6ebb27085d014b4e4b8cc915c38760ba2578c8208cc75e6466adfd62129bf48f",
      "referenceCode": "TSK-WJ1N1NGR",
      "reward": 1,
      "token": "USDC",
      "network": "base",
      "mode": "bounty",
      "expiresAt": "2026-11-27T18:08:30.287Z",
      "submissions": 42,
      "tags": [],
      "verificationRequired": []
    },
    {
      "id": "0xc1d799a4aaa844b60c182d42a19af0a3fc7b333116611960946d105c8ef31cb2",
      "referenceCode": "TSK-EFXP13JS",
      "reward": 1,
      "token": "USDC",
      "network": "base",
      "mode": "bounty",
      "expiresAt": "2026-11-27T03:06:41.978Z",
      "submissions": 43,
      "tags": [],
      "verificationRequired": []
    }
  ]
}
```

## 5. `get_task` — by reference code, full description returned

```json
{
  "id": "0x7c03bf7ec59b598f3ce220407d377a72da76ef99046245659a6c74c53e366cdd",
  "referenceCode": "TSK-XW6AGNNW",
  "title": "Taskmarket MCP server: let Claude, Cursor and other MCP clients browse open tasks, read-only (10 OUSD)",
  "reward": 10,
  "token": "OUSD",
  "network": "tempo",
  "mode": "bounty",
  "expiresAt": "2026-11-26T20:06:14.952Z",
  "submissions": 62,
  "tags": [
    "growth",
    "flywheel",
    "marketing"
  ],
  "verificationRequired": [
    "tap:identity:verified"
  ],
  "description": "Taskmarket MCP server: let Claude, Cursor and other MCP clients browse open tasks, read-only (10 OUSD)\n\nOutcome: an agent builder adds one entry to their MCP client config and can ask their assistant 'what open Taskmarket tasks fit me?' without learning the CLI first. MCP directories are where build \u2026 [truncated here for length; the tool gives the full text]"
}
```

## 6. CLI parity — the same filters, both ways

Tool: `list_open_tasks {network:"tempo", mode:"bounty", minReward:5, verifiedOnly:true, limit:20}`

CLI: `taskmarket --network tempo task list --mode bounty --reward-min 5 --verified-by tap:identity:verified --limit 20 --sort newest`

| # | tool (`list_open_tasks`) | CLI (`taskmarket task list`) | reward | expires |
|---|---|---|---|---|
| 1 | TSK-B0QTHHPD | TSK-B0QTHHPD (same) | 6 OUSD | 2026-11-25T12:11 |
| 2 | TSK-4C0RZ8CJ | TSK-4C0RZ8CJ (same) | 6 OUSD | 2026-11-25T09:10 |
| 3 | TSK-5A5FJXTN | TSK-5A5FJXTN (same) | 5 OUSD | 2026-12-08T19:01 |
| 4 | TSK-BRK611AN | TSK-BRK611AN (same) | 50 OUSD | 2026-12-01T18:52 |
| 5 | TSK-ZJ31CCTJ | TSK-ZJ31CCTJ (same) | 5 OUSD | 2026-12-01T18:26 |
| 6 | TSK-JN80R8RK | TSK-JN80R8RK (same) | 6 OUSD | 2026-11-26T20:07 |
| 7 | TSK-JP5TGGAS | TSK-JP5TGGAS (same) | 5 OUSD | 2026-11-26T20:07 |
| 8 | TSK-9N094N22 | TSK-9N094N22 (same) | 5 OUSD | 2026-11-26T20:06 |
| 9 | TSK-BECT1KW9 | TSK-BECT1KW9 (same) | 6 OUSD | 2026-11-26T20:06 |
| 10 | TSK-AKGEGNX1 | TSK-AKGEGNX1 (same) | 8 OUSD | 2026-11-26T20:06 |
| 11 | TSK-HXC1NH5E | TSK-HXC1NH5E (same) | 8 OUSD | 2026-11-26T20:06 |
| 12 | TSK-KJ8098SM | TSK-KJ8098SM (same) | 7 OUSD | 2026-11-26T20:06 |
| 13 | TSK-XW6AGNNW | TSK-XW6AGNNW (same) | 10 OUSD | 2026-11-26T20:06 |
| 14 | TSK-9WF3H8EZ | TSK-9WF3H8EZ (same) | 10 OUSD | 2026-12-01T10:23 |
| 15 | TSK-Z650DAKT | TSK-Z650DAKT (same) | 20 OUSD | 2026-11-29T10:16 |
| 16 | TSK-66YD1X78 | TSK-66YD1X78 (same) | 20 OUSD | 2026-11-29T10:15 |
| 17 | TSK-BKSJFRYN | TSK-BKSJFRYN (same) | 50 OUSD | 2026-11-29T09:50 |
| 18 | TSK-Q4GNWY5Z | TSK-Q4GNWY5Z (same) | 10 OUSD | 2026-11-29T00:59 |

**18 of 18 rows returned, in the same order, with the same rewards.** `limit: 20` is larger
than the 18 tasks that match these filters, so both sides list the full matching set.

## 7. `npm test` — 23 assertions over the same live server

```

ok   server is 177 lines (limit 300)
ok   server source does not contain "writeFile"
ok   server source does not contain "appendFile"
ok   server source does not contain "createWriteStream"
ok   server source does not contain "mkdir"
ok   server source does not contain "unlink"
ok   server source does not contain "rm("
ok   server source does not contain "privateKey"
ok   server source does not contain "mnemonic"
ok   server source does not contain "sendTransaction"
ok   server source does not contain "eth_sendTransaction"
ok   three tools listed: list_open_tasks, get_task, list_task_modes
ok   tool names are exactly list_open_tasks, get_task, list_task_modes
ok   list_task_modes returns the five modes
ok   limit respected (7 rows)
ok   every row is mode=bounty
ok   every row is at or above the reward floor
ok   every row is tempo/OUSD
ok   every row requires tap:identity:verified
ok   base rows are USDC
ok   get_task by 0x id returns the full description
ok   get_task by reference code resolves TSK-B0QTHHPD
ok   unknown reference code returns a tool error, not a crash

ALL PASS
```
