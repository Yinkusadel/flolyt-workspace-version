# App-shell endpoints

Five routes pasted 2026-09-04 alongside the lifecycle batch under the same Scalar "Lifecycle" tag,
but genuinely cross-cutting — not scoped to `/lifecycle/*`, each its own top-level path with no
shared base. [`lifecycle.md`](lifecycle.md) flagged these as "file under their own domain doc when
we get to those surfaces" back on 2026-08-31; this is that doc. No `API_ENDPOINTS` group exists for
these yet (checked `src/config/apiConfig.ts` 2026-09-04) — add one (`APP_SHELL` or similar) when
wiring starts.

**Auth:** Bearer JWT, every route · **Envelope:** `Result<T>` (`succeeded`, `data`, `messages`).

Status: 5 endpoints documented from the real spec (2026-09-04), 0 wired, no service/hook files yet.

## Endpoints

### GET /api/flolyt/search

- **Purpose:** Finds what already exists — rooms, customers, campaigns, business memory, evidence —
  and offers to *ask* instead when it can't find something, since search can't create what doesn't
  exist yet.
- **Auth:** Bearer token.
- **Request:** query `q` (string, required).
- **Response `data`:** `{ query, groups: [{ group, hits: [{ id, title, detail, status, occurredAtUtc }], hasMore }], shownCount, askInstead: string[] }`. `detail`/`status`/`occurredAtUtc` nullable per the spec's example.
- **Used by:** not wired.
- **Status:** documented.
- **Notes:** Memory and evidence are the same claims split by the question they answer — what the
  workspace believes generally, vs what one specific piece of work rests on. Superseded/rejected
  claims never surface (same filter definition-retrieval uses). Customers match on name, email, or
  external id; rooms match the condition key as well as the title. Groups are capped — `hasMore`
  rather than an exact remainder, since an exact count would mean visiting every match just to
  print the least useful number on screen.

### GET /api/flolyt/home

- **Purpose:** The workspace home. One skeleton, split on how the workspace makes money — same
  rule the leakage map follows.
- **Auth:** Bearer token.
- **Response `data`:** `{ revenueModel, decisionsWaiting, openRoomCount, customerCount, needsDecision: [{ proposalId, title, ask, population, amountAtRisk, currency, roomId, waitingSinceUtc }], openRooms: [{ roomId, title, conditionLabel, population, amountAtRisk, currency, ownerMemberId, lastActivityUtc }], stageDistribution: [{ stage, customerCount, lifetimeRevenue, percentOfBase }], movements: [{ fromStage, toStage, movedCount }], conditionTotals: [{ conditionKey, label, amountAtRisk, currency }], preservedThisQuarter }`.
- **Used by:** not wired.
- **Status:** documented.
- **Notes:** Both revenue-model branches share `decisionsWaiting`/`openRoomCount`/
  `preservedThisQuarter` (decisions ordered by exposure, not arrival). A **consumer** workspace
  additionally gets `stageDistribution`+`movements` (where the customer base sits, what moved
  stages in the last 30 days); an **account-based** workspace gets `conditionTotals` (the leakage
  map's column totals, per currency, never blended). `preservedThisQuarter` only counts rooms
  archived with a measured before-and-after — a room closed without one contributes nothing, "the
  difference between a number and a claim."

### GET /api/flolyt/inbox

- **Purpose:** Grouped by consequence, not by time — needs a decision / mentions / finished /
  systems. A decision waiting on you outranks a just-finished agent run regardless of timestamps.
- **Auth:** Bearer token.
- **Response `data`:** `{ items: [{ group, sourceId, actorLabel, summary, context, occurredAtUtc, roomId, eventCount }], counts: [{ group, count }], total }`. `group` ∈ (seen) `"NeedsYou"` — full enum not yet confirmed from one example. `context`/`roomId` nullable.
- **Used by:** not wired.
- **Status:** documented.
- **Notes:** Four rules: (1) an agent narrating its own tool calls never appears here — the room
  log/tool-call audit exist for that; (2) an undecided proposal never ages out — a reminder that
  scrolls away is an action nobody took and nobody was reminded of; (3) finished work is digested
  **per room** — eleven runs in one room send one line about the eleven, not eleven items crowding
  everything else; (4) read/dismissed system alerts are gone — an interruption already answered is
  noise.

### GET /api/flolyt/command-bar

- **Purpose:** The command bar's front door — what the workspace will reason over (shown before
  the question is asked) and what's worth asking, grouped Diagnose / Forecast / Act.
- **Auth:** Bearer token.
- **Response `data`:** `{ willReasonOver: [{ kind, label, status, lastSyncedAtUtc, recordCount, problem, contributingConnections, blocks }], suggestions: [{ key, group, prompt, annotation, action, available, missingSources, blocker, surface, roomTarget: { grid, rowKey, rowLabel, conditionKey, currency, amountAtRisk } }] }`. `kind` ∈ enum incl. `"Unknown"`; `status` ∈ enum incl. `"NotConnected"`; `group` ∈ `Diagnose`/`Forecast`/`Act`; `action` ∈ enum incl. `"Answer"`.
- **Used by:** not wired.
- **Status:** documented.
- **Notes:** Every suggestion states what it reads and what it does. A suggestion whose source is
  missing comes back `available: false` with `missingSources` named — **never hidden**, since
  hiding it teaches nobody what connecting that source would buy. Only one suggestion kind opens a
  war room (`roomTarget`) — a room needs a leakage coordinate to snapshot and be measured against;
  the rest answer inline in the shared, durable workspace conversation, not a private chat.
  `willReasonOver` is the same row shape as `GET /sources` below — see that entry's notes, this is
  the same underlying data surfaced as the command bar's "will reason over" strip.

### GET /api/flolyt/sources

- **Purpose:** What this workspace can and can't reason over — the room sources rail, and
  `command-bar`'s `willReasonOver` strip (same question, same row shape).
- **Auth:** Bearer token.
- **Response `data`:** `{ sources: [{ kind, label, status, lastSyncedAtUtc, recordCount, problem, contributingConnections, blocks }], connectedCount, totalCount }`.
- **Used by:** not wired.
- **Status:** documented.
- **Notes:** A row is a **data domain**, not a connection — two warehouses both carrying engagement
  events are one row; a connected warehouse carrying nothing usable does not read as healthy. Every
  domain is returned, including ones nothing supplies — a missing row and a not-connected row are
  different statements and only one is actionable. `blocks` is derived from the leakage map's own
  account of what's unavailable, not written down separately. **No `read_only` status** — every
  source Flolyt connects is read-only, so that flag would distinguish nothing (don't invent one
  client-side).
