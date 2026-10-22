# Rooms domain endpoints

Everything under `/api/v3/rooms/*` (was `/api/flolyt/rooms/*` until the 2026-10-10 V3 migration; request bodies, response contracts and access checks are unchanged), pasted 2026-09-01 from the Scalar/OpenAPI reference doc
(prose descriptions + example request/response payloads, same source format as [[lifecycle]]'s
corrected pass). Corresponds to the already-built `/rooms` section — see
[[flolyt_rooms_rebuild]] (42 screens, status/outcome-branch architecture) — so every entry below
is a candidate to wire against an existing mocked screen, not a page waiting to be built.

**Status: 62/62 operations fully documented as of the 2026-09-08 re-paste pass — every operation
in the live index has been pasted with detail. 53 previously known (48 confirmed unchanged, 5
updated with new fields: `GET /rooms`, `POST /close`, `GET`+`POST /decision`, `GET /rooms/{roomId}/plays`),
plus 9 newly discovered and documented: `close-preview`, `convening` (GET/accept/decline),
`guardrails` (GET/POST/DELETE), `runs`, and the top-level `GET /plays` + `GET /plays/{proposalId}`
pair. One path bug caught and fixed: `GET_ALL_PLAYS` was wired to `/rooms/plays`, corrected to
top-level `/plays`. Service+hook scaffolded for all 62, 0/62 wired into a page. The one open data
gap (`conflicts[].readings[]`'s truncated example) was resolved the same day by pulling that
endpoint's response schema instead of its example — the only hidden field was `chosen: boolean`.**

## Per-endpoint entries

Every GET below returns `{ data: <shape below>, messages: string[], succeeded: boolean }` — the
envelope is omitted from each `Response:` line for brevity; only the `data` shape is shown.
Mutations show their real top-level shape including the envelope.

### GET /rooms/{roomId}

- **Purpose:** Direct Room loading (live collaboration Phase 1): open a Room from a link, invitation or investigation card. Source: `docs/rooms/revenue-threat-room-frontend-handoff.md`, "Direct Room loading".
- **Auth:** Bearer token, active workspace member with access. Missing, foreign or inaccessible Rooms return 404 `Room not found.`; a restricted Room may stay discoverable in the index while its details and thread are inaccessible.
- **Request:** path `roomId`.
- **Response `data`** (real response, 2026-10-12, the user's Room "Dormant Accounts"): `{ id, title: "Dormant Accounts", conversationId, status: "open", ownerMemberId, viewerRole: "decision-owner" (nullable), createdAtUtc, archivedAtUtc: null, stage: "engage", mechanism: "dormant_accounts", currency: "USD", market: null, lifecycleClass: "InFlight", leadAgentKey: null, agents: [], mergedIntoRoomId: null, conversationPermissions: { canView, canContribute, canAdminister } }`. These are core metadata, NOT current exposure or verified financial outcomes. The conversation flags apply to the conversation only; they grant no proposal approval, Room management or tool execution.
- **UPDATED by the backend 2026-10-12 (the header-fields ticket is DONE):** the response now ALSO carries `population: 37`, `amountAtRiskAtOpen: 2618.985`, `currentAmountAtRisk: null`, `currentAmountComputedAtUtc: null`, `ownerName: "Chad Sado"`, `stageLabel: "ENGAGE"`, `conditionLabel: "dormant_accounts"` (same text as the key on this Room), `openingNumber: 1`, `isRecovering: false`, `threatConfirmationId: null` (decides the threat tabs and "Opened by Flolyt"), `systemOpenedBy: null`, `restricted: null`. Same names and values as a `GET /rooms` list row. Still not here: the viewer's own notify level (from `GET /rooms/subscriptions`), a state chip like "Worsened" (from `threat-monitoring`), tab count badges.
- **Used by:** the Room page (`src/pages/rooms/room/index.tsx`): the header (`room-header.tsx`), the topbar breadcrumb (the real title), the threat-tab gating, the not-found card. Service + hook: `src/services/api/rooms/get-room.ts` / `src/features/rooms/use-get-room.ts` (`GET_ROOM` in `apiConfig.ts`).
- **Status:** wired 2026-10-12 against the real response (layout checked on mocks of it; a faked 404 for the not-found state).

### GET /rooms/{roomId}/stream

- **Purpose:** The Room-wide live feed (live collaboration Phase 2): every participant's committed public messages plus concurrent agent events, kept open while viewing a Room. Full integration in `docs/rooms/room-live-collaboration-frontend-handoff.md` and the "Room-wide live feed" section of the new handoff.
- **Auth:** Bearer token in a header with `Accept: text/event-stream` (native `EventSource` cannot do this: use a fetch-streaming SSE parser). 404 before SSE for missing/foreign/inaccessible; 400 for a cursor from another conversation or ahead of the journal.
- **Request:** path `roomId`; `after` (cursor) or `Last-Event-ID` header. Bootstrap with `GET /rooms/{roomId}` + `GET /api/v3/conversations/{conversationId}`, then connect with `after=0` and reconcile the overlapping replay. Never resume from `room_stream_ready.head`.
- **Events** (durable envelope: read payloads via `data.payload`, text via `data.message`): `room_stream_ready`, `message_committed` (upsert by `messageId`), `steering_updated`, `run_state` (Queued/Running/AwaitingApproval/Done/Failed/Cancelled), `stream_delivery_gap`, `agent_handoff`, `run_started`/`progress`/`response_chunk`/`final_response`/`error`/`run_cancelled`, `room_heartbeat`, `room_access_revoked`. Deduplicate by durable `eventId` (`{conversationId without hyphens}:{sequence}`, compare the suffix with `BigInt`); one buffer per `runId`; a committed assistant message replaces its run's draft; render from the Room feed, not also from the initiating POST stream (send POST with `Accept: application/json`).
- **Sending:** `POST /api/v3/conversations/messages` `{ conversationId, message, replyMode: "auto" | "none", agentKey? }`; `none` = a teammate comment, no AI run, 200 without `runId`; JSON with a run returns 202 + receipt (merge by `runId`, not an answer).
- **REAL CAPTURE 2026-10-13** (Dormant Accounts, 100 frames read from Node with a bearer token): the envelope matches the handoff (`sequence`, `eventId` `{conversationId without hyphens}:{n}`, `eventType`, `runId`, `agentKey`, `agentLabel`, `atUtc`, `data`). `room_stream_ready` and `room_heartbeat` carry NO `id:` line (heartbeat data is `{}`; about one per 10 s). Seen: `message_committed` (data: `role, runId, content, agentKey, messageId, timestamp, authorUserId, structuredResponse`; there is NO `authorName`, so the UI resolves it from `GET /rooms/{roomId}/people`), `run_started` (`message`: "<Agent> is working."), `progress` (`data.payload.stage`: queued / analyzing / reading / complete; `payload.message` is internal text like `conversation_id:...`: never shown), `response_chunk`, `final_response` (`data.payload` = the structured response; a committed assistant message can arrive BEFORE its final), `run_state` (`Done`), and an UNDOCUMENTED additive `suggested_action` (`data.payload`: `[{ type: "navigate", label, payload: { route } }]`, ignored by the reducer). Replay returned all 95 events then live; `Last-Event-ID: <full eventId>` resumes after it, a bare `after=<number>` works, a cursor ahead of the journal or from another conversation answers 400 with a message. NOT yet seen live: `agent_handoff`, `steering_updated`, `stream_delivery_gap`, `room_access_revoked`, `run_cancelled`, `error` (built from the docs and the reference tests).
- **Used by:** the Room thread (`src/features/rooms/live/*` + `use-room-live-thread.ts`). **Status:** BUILT 2026-10-13: TS port of the backend reducer (`room-live-state.ts`, its 9 tests ported, plus 5), SSE parser, fetch-streaming client with backoff and `Last-Event-ID`, timeline selectors. The reference reducer and test are in `docs/rooms/examples/` (`node --test`). Run all feed tests with `npm run test:rooms-live` (28).

### PUT /rooms/{roomId}/owner

- **Purpose:** Hands the room to another member. Ownership exists so a leak can't sit open with everyone assuming someone else has it.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ ownerMemberId: uuid }`.
- **Response:** `{ data: roomId, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/update-room-owner.ts` / `src/features/rooms/use-update-room-owner.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Refused on an archived room — ownership of finished work is a matter of record, not reassignable.

### POST /rooms/{roomId}/falsifiers/{index}/met

- **Purpose:** Records that a condition the room named in advance has come true.
- **Auth:** Bearer token.
- **Request:** path `roomId`, `index` (int32).
- **Response:** `{ data: roomId, messages, succeeded }`.
- **Used by:** the "Mark as met" button on the Decision tab (`index` = the falsifier's position in `whatWouldChangeThis`).
- **Status:** wired and LIVE-VERIFIED 2026-10-11 (two falsifiers marked met on a real Room).
- **Notes:** Idempotent — a second call succeeds without moving the timestamp; when it first fired is the record.

### GET /rooms/{roomId}/log

- **Purpose:** The room's full activity log, oldest first — read as how the room got here, not as a feed.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response `data`:** `{ roomId, roomTitle, totalEntries, humanEntries, agentEntries, systemEntries, entries: [{ occurredAtUtc, actorKind, actorId, actorLabel, action, consequence, dissent }] }`.
- **REAL RESPONSE 2026-10-14** (Dormant Accounts): `totalEntries: 53`, `humanEntries: 48`, `agentEntries: 5`, `systemEntries: 0`; entries OLDEST FIRST with `occurredAtUtc`, `actorKind` ("Human" / "Agent"), `actorId`, `actorLabel`, `action`, `consequence` (may be null), `dissent` (the dissent's WORDS as a string, null otherwise: the earlier DTO had it as a boolean). Data quirks to ticket: a person's `actorLabel` is `chad@yopmail.com · Administrator` (email + role, not the full name); owner handovers put raw user ids in `consequence` ("owner 01a0f8e0… → 01a0fc86…"); restrict entries carry the raw reason key ("Restricted the room · pricing-before-announcement"); an agent's failed start is an ordinary entry ("Could not start Revenue Intelligence"), no field marks a failure.
- **Used by:** the Log tab, `src/pages/rooms/room/log/index.tsx` (service + hook `get-room-log.ts` / `use-get-room-log.ts`; Export CSV through `use-export-room-log.ts`, file name `room-log-<roomId>.csv`).
- **Status:** BUILT 2026-10-14 from the real response (mock-verified). Not shown: the design's pink tint on a failed run (no field).
- **Notes:** Every entry names its actor and whether human/agent/platform — nothing happens anonymously. `consequence` is what followed the action, not whether the action succeeded. Counts are broken out human vs agent.

### GET /rooms/{roomId}/log/export

- **Purpose:** The room's log as a CSV download.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response:** file result (`contentType`, `fileDownloadName`, `lastModified`, `entityTag`, `enableRangeProcessing`) — not the JSON envelope.
- **Used by:** service + hook ready (`src/services/api/rooms/export-room-log.ts` / `src/features/rooms/use-export-room-log.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Every field quoted, since log text is human-written and routinely contains commas.

### GET /rooms/{roomId}/evidence

- **Purpose:** Every claim in the room with grade/source/window/n — strongest and freshest first — plus what would change the recommendation and the gaps the agents flagged themselves.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response `data`:** `{ roomId, roomTitle, totalClaims, claims: [{ claimId, statement, grade, source, window, n, missingSource, gaps, createdAtUtc }], gaps: [{ missingSource, claimsBlocked }], falsifiers: [{ condition, thenWhat, addedAtUtc, metAtUtc }] }`.
- **REAL RESPONSE 2026-10-14** (Dormant Accounts): `totalClaims: 0`, `claims: []`, `gaps: []`, three `falsifiers` (`condition`, `thenWhat`, `addedAtUtc`, `metAtUtc`; two met). NEVER seen with real data: any claim, any gap, the `grade` values (docs: "at least `InsufficientEvidence`"), `window` text, the per-claim `gaps` field (typed `unknown`). Ticket candidate: zero claims although Compass's run says "recorded a claim".
- **Used by:** the Evidence tab, `src/pages/rooms/room/evidence/index.tsx` (service + hook `get-room-evidence.ts` / `use-get-room-evidence.ts`).
- **Status:** BUILT 2026-10-14. The falsifiers section is verified against the real response; the CLAIMS TABLE, the grade filter pills and "One connection away" are built from the docs and a synthetic mock ONLY: RE-VERIFY when a Room has claims. Left out: the design's "Trace: N tool calls" (no field) and "Connect" on a gap (no route).
- **Notes:** Includes what the workspace already believed about this leak, not only what this room learned. `gaps` is derived from insufficient-evidence rows, not hand-written, and counts how many claims one connection would resolve. `window` is pre-rendered text, dash where there is none. `grade` enum includes at least `InsufficientEvidence`.

### POST /rooms/{roomId}/falsifiers

- **Purpose:** Names a condition that would change this room's recommendation, and what it would change it to.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ condition: string, thenWhat: string }`.
- **Response:** `{ data: roomId, messages, succeeded }`.
- **Used by:** the "If... then..." add form on the Decision tab ("What would change this").
- **Status:** wired and LIVE-VERIFIED 2026-10-11 (two falsifiers added on a real Room).
- **Notes:** Both halves required — a condition with no stated consequence is a caveat, not a test.

### GET /rooms/views

- **Purpose:** Saved filter views — yours and any shared with the team.
- **Auth:** Bearer token.
- **Request:** none.
- **Response `data`:** `[{ id, name, filter: { query, state, currency, stage, condition, owner, minAmountAtRisk, includeArchived }, sharedWithTeam, mine, createdBy, createdAtUtc, roomCount }]`.
- **Used by:** service + hook ready (`src/services/api/rooms/get-room-views.ts` / `src/features/rooms/use-get-room-views.ts`), not wired into a page yet — rooms list's saved-views control.
- **Status:** service/hook ready, not wired.
- **Notes:** `roomCount` is run live, never remembered/stale. `mine` gates edit/delete — a shared view is visible to everyone, editable only by its author.

### POST /rooms/views

- **Purpose:** Saves the current filters under a name.
- **Auth:** Bearer token.
- **Request:** body `{ name: string, filter: {...}, sharedWithTeam?: boolean (default false) }`.
- **Response:** `{ data: viewId, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/create-room-view.ts` / `src/features/rooms/use-create-room-view.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.

### PUT /rooms/views/{viewId}

- **Purpose:** Renames, re-filters, or re-shares a saved view.
- **Auth:** Bearer token; author only.
- **Request:** path `viewId`; body same shape as create.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** wired 2026-10-10 into the Rooms list's saved-view chips (`src/pages/rooms/saved-views.tsx`, `EditViewDialog`: rename, re-share, optionally replace the filters with the ones applied now). Author-only (`mine`).
- **Status:** wired, not yet submitted live.

### DELETE /rooms/views/{viewId}

- **Purpose:** Removes a saved view.
- **Auth:** Bearer token; author only.
- **Request:** path `viewId`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** wired 2026-10-10 into the Rooms list's saved-view chips (`DeleteViewDialog`). Author-only (`mine`).
- **Status:** wired, not yet submitted live.
- **Notes:** Author-only because deleting someone else's would break every link anybody has to it.

### GET /rooms

- **Purpose:** Rooms in this workspace, newest first, filterable — every filter is a query param so a filtered view is a shareable link.
- **Auth:** Bearer token.
- **Request:** query `includeArchived` (default false), `q`, `state`, `currency`, `stage`, `condition`, `owner` (uuid), `minAmountAtRisk` (double).
- **Response `data`:** `{ rooms: [{ id, title, conversationId, grid, stage, stageLabel, condition, conditionLabel, currency, population, amountAtRiskAtOpen, currentAmountAtRisk, ownerMemberId, status, createdAtUtc, archivedAtUtc, openingNumber, isRecovering, outcomeKind, restricted: { reason, restrictedBy, restrictedAtUtc, peopleInside } | null, mergedIntoRoomId, absorbedRoomIds, lastActivityAtUtc, stoppedBecause, isStale, ownerName, agents: [{ key, displayName, role }], pendingDecisions, needsYou }], total, open, recovering, stale, archived, amountBehindStale: [{ currency, amount }] }`.
- **Used by:** service + hook ready (`src/services/api/rooms/get-rooms.ts` / `src/features/rooms/use-get-rooms.ts`), not wired into a page yet — rooms list/index page.
- **Status:** service/hook ready, not wired.
- **Notes:** Open only unless `includeArchived` or an explicit `state` set. `state` values (`open`/`recovering`/`stale`/`archived`) **overlap and don't sum to total** — recovering/stale are both subsets of open. `minAmountAtRisk` compares within each room's own currency, never across — pair with `currency`. `isStale` = untouched 14 days. `stoppedBecause` (`never-assigned`/`owner-left`/`owner-overloaded`/`unknown`) is a real answer, not a gap. `amountBehindStale` is per-currency, never one figure. Each room carries both its opening figure and the live leakage-map figure; the live one is `null` (not stale) when its cell has become unavailable. **Updated 2026-09-08:** each row now also carries what the list draws without a second call — `ownerName` (null when unowned), `agents` (key/displayName/role), `pendingDecisions` (pending plays on the room, counted the way the inbox counts them), `needsYou` (one of them waits on the caller). On a restricted room those four are `null`, `[]`, `0` and `false` — they are the inside of it. **Updated 2026-10-10 (revenue threat Rooms, phase 5):** visible rows also carry nullable `threatConfirmationId` and `systemOpenedBy`. A non-null `threatConfirmationId` marks an automatic opening and is also the investigation ID to pass to `GET /threats/{investigationId}/room-opening`. Restricted rows omit both fields. Typed in `get-rooms.ts`. **Seen in a live response 2026-10-10 (not in the original doc):** each row also carries `currentAmountComputedAtUtc` (nullable ISO time, null whenever `currentAmountAtRisk` is null), the time behind the design's "live · 09:14 UTC" caption. A null `currentAmountAtRisk` is shown only as "Live figure unavailable": the doc's explanation (the cell became unavailable) is not stated by the API per row, so it is not claimed.

### POST /rooms ⚠️ superseded — see [leakage.md](leakage.md)

- **Corrected 2026-09-22:** this entry was a guess made before the full leakage spec existed. The
  real path is `POST /api/v3/leakage/cells/{grid}/{row}/{condition}/{currency}/room` (path params,
  not `/rooms`), and the real body nests settlement fields under a `settlement` object rather than
  the flat `{ grid, rowKey, conditionKey, currency, title }` shown below — see
  [leakage.md](leakage.md#post-apiv3leakagecellsgridrowconditioncurrencyroom) for the confirmed
  request/response shape. The old `src/services/api/rooms/open-room-on-leakage-cell.ts` /
  `src/features/rooms/use-open-room-on-leakage-cell.ts` were deleted; the corrected service/hook
  live under `src/services/api/leakage/` / `src/features/leakage/` instead.
- **Purpose (as originally guessed):** Opens a war room on one cell of the leakage map, snapshotting population/revenue-at-risk so the outcome can later be measured against the same figure.
- **Request (as originally guessed):** body `{ grid: string, rowKey: string, conditionKey: string, currency: string, title: string | null }`.
- **Response:** `{ data: roomId, messages, succeeded }` — this part held up.
- **Status:** superseded by leakage.md, not wired.
- **Notes:** Refused on a cell with no figure behind it (fix is connecting the source, not opening a room). If a room is already open on the same coordinate, this joins that one instead of opening a duplicate.

### GET /rooms/{roomId}/close-preview

- **Purpose:** What closing this room would record, before anybody closes it — a dry run of `POST /close`'s own logic.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response `data`:** `{ roomId, title, openingNumber, currency, openedAtUtc, openDays, people, agents, plays, playsApproved, populationAtOpen, amountAtOpen, currentPopulation, currentAmountAtRisk, delta, deltaUnavailableBecause, outcomes: [{ kind, available, whyNot, needs }], plan: { holdoutPercent, noHoldoutBecause, measuredOverDays, primaryMeasure, revenueBasis }, settlesWhen: string[], suggestedWindow: { startUtc, endUtc, days, hasElapsed }, expectedHeldBack, measurementMustBeSupplied, measurementMustBeSuppliedBecause, predictions: [falsifier], dissent: [{ wording, by, recordedAtUtc, borneOut }], linkedCampaigns: [{ campaignId, name, proposalId, playSummary, holdoutPercent, treatment, holdout, firstEnrolledAtUtc }], computedMeasurement: RoomMeasurement | null, measurementUnavailableBecause, incrementalRevenue, holdoutHonoured, measurementWindowElapsed, conversionsOutsideMarket }`.
- **REAL RESPONSE 2026-10-17** (Dormant Accounts, then Attrition CAD; read-only GET, nothing closed): 200 in about 0.2 to 0.7 s. `openDays: 14`, `people: 2`, `agents: 2`, `plays: 0`, `playsApproved: 0`, `populationAtOpen: 37`, `amountAtOpen: 2618.985` (USD); `currentPopulation`, `currentAmountAtRisk` and `delta` are all `null` with `deltaUnavailableBecause: "the leak cell no longer exists"` (so the design's "open -> now" figures and "cell change" have no now-value). `outcomes[]`: all FIVE `available: true`, `whyNot: null`; `needs` is set for `money-recovered` ("a measurement: contacted, held back, converted in each group, recovered, and the window - with something held back, or there is nothing to measure against"), `superseded` ("the room that took this over") and `unmeasurable` ("why no honest number attaches"), null for `no-action-needed` and `disproven`. `plan: null`, `settlesWhen: []`, `suggestedWindow: null`, `expectedHeldBack: null` (so held back / measured over / primary measure / revenue basis / suggested window have NO data). `measurementMustBeSupplied: true` with the reason text "None of this room's plays produced a campaign, so who was contacted, who was held back and who converted are entered at close rather than counted. The measurement is recorded as supplied and never rendered as derived." `linkedCampaigns: []`, `computedMeasurement`, `measurementUnavailableBecause`, `incrementalRevenue`, `holdoutHonoured`, `measurementWindowElapsed` all null, `conversionsOutsideMarket: 0`. `predictions[]` = falsifiers `{ condition, thenWhat, addedAtUtc, metAtUtc }` (3 on Dormant, 2 met-dated); `dissent[]` = `{ wording, by, recordedAtUtc, borneOut }` (11 on Dormant; `by` is `email · role`, the same label problem as the Log; `borneOut` null/true/false; withdrawn ones are included). NEW field NOT in the docs: `recoveredImpact` `{ amount: null, currency: null, basis: "unavailable", method: null, statedBy: null, missingSource: "a holdout to measure against", wouldUnlock: "a recovery this room could close as money recovered", toolCalls: [], annualised: null, isMeasured: false, isAvailable: false }`. Attrition CAD: same shape, `people: 1`, `agents: 0`, `populationAtOpen: 9`, `amountAtOpen: 606.1545` (CAD), no predictions or dissent.
- **Used by:** the Close room page `/rooms/:roomId/close` (`src/pages/rooms/close/`), reached from the "Close room" button in the Room header.
- **Status:** WIRED 2026-10-17 against the real response above (mock-verified UI).
- **Notes:** *New endpoint, added 2026-09-08.* The `dissent` listed is exactly what the outcome will snapshot; `predictions` are the falsifiers the outcome will carry — both read by the same code the close uses. `outcomes` lists all five endings with `available: false` and the close's own refusal reason where one applies (e.g. money recovered on a room that said no holdout was possible). `delta` is the leak cell now against the opening figure — **not** a recovery claim; `null` with `deltaUnavailableBecause` when the cell can't be read. `suggestedWindow` places the declared measurement window on the calendar from the first approved play, and says whether it has elapsed. `measurementMustBeSupplied` is `true` today across the board: nothing links plays to campaigns yet, so contacted/held-back/converted counts must be entered rather than computed, and the screen must say so — `computedMeasurement` is the auto-derived figure where `linkedCampaigns` exist, otherwise it's the manual-entry fallback.

### POST /rooms/{roomId}/close

- **Purpose:** Ends a room against one of five outcomes: money recovered, no action needed, superseded, disproven, unmeasurable.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ kind: string, note, dissent, measurement: RoomMeasurement | null, supersededByRoomId, revisitCondition, unmeasuredReason, outstanding: [{ toUserId, description, class, proposedDueAtUtc }] | null }` where `RoomMeasurement` = `{ contacted, heldBack, convertedContacted, convertedHeldBack, recovered, currency, excluded, excludedReason, windowStartUtc, windowEndUtc, source, contactedRate, heldBackRate, liftPoints }`.
- **Response `data`:** `{ kind, amountAtOpen, amountAtArchive, delta, currency, populationAtOpen, populationAtArchive, unmeasuredReason, note, measurement, predictions: [falsifier], dissent: [{ wording, by, recordedAtUtc, borneOut }], supersededByRoomId, revisitCondition, measuredAtUtc }`.
- **Used by:** the Close room page (`src/pages/rooms/close/index.tsx`), behind a confirm modal.
- **Status:** WIRED 2026-10-17. A REAL close of Dormant Accounts as `no-action-needed` (no measurement) WORKED on 2026-10-17 (the Rooms list shows "Closed: No action needed"); we did not capture its response body. Every other ending (money-recovered with a measurement, superseded, unmeasurable, disproven) has never run for real: the request body is mock-verified only. Sends `kind`, `measurement` (money-recovered only, rates null), optional `note`, `dissent` (the person's own objection as PLAIN TEXT: its shape is unconfirmed), `supersededByRoomId`, `unmeasuredReason`, `revisitCondition` and `outstanding` rows with `class: "other"`. **Schema read in Scalar 2026-10-17:** `kind` is the only required top-level field; `dissent` is `null | string` (so plain text is right); `measurement` is nullable and, WHEN SENT, requires contacted, heldBack, convertedContacted, convertedHeldBack, recovered, currency, source (a non-null string, so the page now asks "Where did these counts come from?"), windowStartUtc and windowEndUtc, while excluded, excludedReason and the three rates are nullable; an obligation needs `description` and `toUserId` (`class` defaults to "other", `proposedDueAtUtc` nullable). So closing with any ending except "Money recovered" (measurement null) is valid with just `kind`. The page logs every form change, the body it would send and the request/response with a 🚪 marker (`close-log.ts`). STILL OPEN: whether the rates must be sent or are computed.
- **Notes:** The five outcomes are unordered, no default — a room that looked, found something real, and decided it wasn't worth fixing has still concluded. Claiming "money recovered" requires a held-back group; without one, close is refused and pointed at "unmeasurable." The leak cell is re-read either way — if it no longer exists, the outcome says so rather than reporting the leak as reduced to nothing. Every logged objection carries into the outcome verbatim. **Updated 2026-09-08:** request body gained `outstanding` — a list of follow-up items to hand off out of the room on close, each `{ toUserId, description, class ("other" seen as a value so `class` is likely an open/enum string, proposedDueAtUtc }`.

### GET /rooms/{roomId}/decision

- **Purpose:** What the room decided, its revisions, what would change it, and every recorded objection.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response `data`:** `{ roomId, openingNumber, statement, guardrails, draftedByLabel, decidedByUserId, decidedByLabel, decidedAtUtc, revisions: [{ number, summary, byUserId, byLabel, atUtc }], whatWouldChangeThis: [falsifier], dissent: [{ id, wording, byUserId, byLabel, recordedAtUtc, withdrawn, borneOut, aboutProposalId, aboutProposalTitle }], recipients: [{ userId, userName, what, class }] }` (`userName` and `aboutProposalTitle` are nullable, added 2026-10-16 per ticket #50, wired in the Decision tab, not yet seen on a real item).
- **Used by:** the Decision tab on `/rooms/:roomId?tab=decision` (`src/pages/rooms/room/decision/`). Service + hook: `src/services/api/rooms/get-room-decision.ts` / `src/features/rooms/use-get-room-decision.ts`.
- **Status:** wired 2026-10-11. Real response for a Room with no decision (2026-10-11): `{ roomId, openingNumber: 1, statement: "", guardrails: null, draftedByLabel: null, decidedByUserId: null, decidedByLabel: null, decidedAtUtc: null, revisions: [], whatWouldChangeThis: [], dissent: [], recipients: [] }`. Filled state unseen.
- **Backend gaps:** (`userName` and `aboutProposalTitle` now provided, see above); `draftedByLabel` stays null when a person drafts through the UI (ask for a default to the author's label).
- **Real filled response (2026-10-11):** `statement`, `guardrails` set; `draftedByLabel: null`; after Mark decided `decidedByUserId`/`decidedByLabel` (`chad@yopmail.com · Administrator`)/`decidedAtUtc` set; `revisions[]` with `byLabel` the same combined string; `whatWouldChangeThis[]` items with `metAtUtc` set once met; `dissent[]` items with `withdrawn: false`, `borneOut: null`, `aboutProposalId: null`; `recipients: []`. Revising after deciding is allowed.
- **Notes:** `whatWouldChangeThis` is the room's falsifiers rendered here rather than modelled twice — same list checked automatically at close. **Updated 2026-09-08:** response gained `recipients` — who the decision goes to and what they specifically get told (`what`) plus a `class` grouping.

### POST /rooms/{roomId}/decision

- **Purpose:** Writes or revises the decision.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ summary: string, draftedByLabel, guardrails, statement, recipients: [{ userId, what, class }] | null }`.
- **Response:** `{ data: revisionNumber, messages, succeeded }`.
- **Used by:** the "Draft the decision" / "Revise..." dialog on the Decision tab (`src/pages/rooms/room/decision/revise-dialog.tsx`).
- **Status:** wired and LIVE-VERIFIED 2026-10-11 (first draft plus two revisions on a real Room).
- **Notes:** Revisions are append-only and each must state what it changed. Omitting a section leaves it as-is, doesn't blank it. **Updated 2026-09-08:** request body gained `recipients` — same shape as the GET response, so a revision can set who this decision is being sent to and what they're told.

### POST /rooms/{roomId}/decision/decide

- **Purpose:** Marks the decision made — by whom, when.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ summary: string, statement }`.
- **Response:** `{ data: revisionNumber, messages, succeeded }`.
- **Used by:** the "Mark decided as <name>" form on the Decision tab (shown once a draft exists and the decision is not yet decided).
- **Status:** wired and LIVE-VERIFIED 2026-10-11 (status became Decided; `decidedByLabel` and `decidedAtUtc` set). The backend still allows revising afterwards.
- **Notes:** Deciding resolves nothing — recorded dissent stays exactly as it was. Only the eventual close-result settles an objection.

### POST /rooms/{roomId}/decision/dissent

- **Purpose:** Records an objection to the decision.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ wording: string, aboutProposalId: uuid | null }`.
- **Response:** `{ data: dissentId, messages, succeeded }`.
- **Used by:** the "Record an objection" form on the Decision tab (`aboutProposalId` always null for now).
- **Status:** wired and LIVE-VERIFIED 2026-10-11 (two objections recorded on a real Room).
- **Notes:** Does NOT block the decision and nothing tallies it — rooms aren't democracies, no threshold. Stays attached permanently, checked at close, withdrawable only by its author.

### DELETE /rooms/dissent/{dissentId}

- **Purpose:** Author withdraws their own objection.
- **Auth:** Bearer token; author only (not the decision owner, not an admin).
- **Request:** path `dissentId`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** the judge dialog on the Dissent tab (`src/pages/rooms/dissent/judge-dialog.tsx`), shown only when the signed-in `user.id` equals the row's `byUserId` (assumes those ids are the same; unverified).
- **Status:** wired 2026-10-11, NOT yet submitted against the real backend (mutation unverified).
- **Notes:** A state change, not a delete — wording stays, marked withdrawn, so "permanent" and "withdrawable" stay compatible.

### POST /rooms/dissent/{dissentId}/judge

- **Purpose:** Records whether the eventual result bore an objection out.
- **Auth:** Bearer token.
- **Request:** path `dissentId`; body `{ borneOut: boolean }`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** the judge dialog on the Dissent tab (Borne out / Shown wrong, each with a confirm step), offered on every unjudged, non-withdrawn row; the backend decides who may judge and its refusal shows as a toast.
- **Status:** wired 2026-10-11, NOT yet submitted against the real backend (mutation unverified). Whether a judgement can be undone is unknown, so the confirm copy does not promise it.
- **Notes:** Null until judged — "unjudged" and "shown-to-be-wrong" are different, and the second is the useful state.

### GET /rooms/dissent

- **Purpose:** Every objection across every room the caller can see, newest first.
- **Auth:** Bearer token.
- **Request:** query `includeWithdrawn` (default false), `take` (int32, default 50).
- **Response `data`:** `{ dissent: [{ id, wording, roomId, roomTitle, byUserId, byLabel, recordedAtUtc, roomStatus, withdrawn, borneOut }], returned, truncated }`.
- **Used by:** the Dissent tab on `/rooms?tab=dissent` (`src/pages/rooms/dissent/`). Service + hook: `src/services/api/rooms/get-all-dissent.ts` / `src/features/rooms/use-get-all-dissent.ts` (hook keeps previous data while "Show 50 more" raises `take`).
- **Status:** wired 2026-10-11. The live account had zero dissent (`dissent: []`), so rows were layout-checked on mocked data only.
- **Backend gaps:** `judgedAtUtc` and `withdrawnAtUtc` on rows (design's "Judged 2 Oct" / "By its author, 26 Sep" left out); allowed values for `roomStatus` (optional; shown as readable text in a grey chip); `aboutProposalId` not requested (design's "about a play" left out).
- **Notes:** The column that matters is `borneOut` — a dissent shown to have been wrong, on the record, is more useful than a culture where nothing gets written down.

### GET /rooms/{roomId}/cited-dissent

- **Purpose:** Prior objections about this same leak, to surface beside a play being considered.
- **Auth:** Bearer token.
- **Request:** path `roomId`; query `proposalId` (uuid), `take` (int32, default 10).
- **Response `data`:** `{ cited: [{ id, wording, byUserId, byLabel, recordedAtUtc, fromRoomId, fromRoomTitle, fromRoomStatus, fromRoomOutcomeKind, borneOut, tier }], returned, truncated, citedReadings: [{ conflictId, fromRoomId, fromRoomTitle, label, recommends, because, longRunEffect, chosenInstead, why, resolvedAtUtc }] }`.
- **Used by:** service + hook ready (`src/services/api/rooms/get-cited-dissent.ts` / `src/features/rooms/use-get-cited-dissent.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Matched on the room's coordinate, not wording — `tier` distinguishes "same-action" (exact) from "same-leak" (weaker). Withdrawn objections aren't cited; ones that turned out wrong are, with outcome shown. Results depend on caller — a restricted room's objections stay inside it. Bounded, `truncated` flags overflow.

### POST /rooms/{roomId}/proposals/{proposalId}/collision-check

- **Purpose:** Who else is planning to contact the same people this play would reach, workspace-wide.
- **Auth:** Bearer token.
- **Request:** path `roomId`, `proposalId`.
- **Response `data`:** `{ total, colliding, wouldBreach, clear, others: [{ roomId, roomTitle, restricted, overlap, theirSendAtUtc, ourSendAtUtc, gapHours, verdict }], notResolvable }`.
- **Used by:** service + hook ready (`src/services/api/rooms/check-proposal-collision.ts` / `src/features/rooms/use-check-proposal-collision.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Checked workspace-wide (a per-room check would let two rooms each believe they're clear). `colliding` counts distinct people, not summed rows. `wouldBreach` is the only fact here (read from what's already sent); everything else is projection. A restricted room's row carries its overlap count with no title. Verdicts: `would-breach`, `same-window`, `clear`, `unscheduled`. Enforces nothing itself — caps/opt-out live in the send pipeline. POST because the answer must never be cached.

### GET /rooms/{roomId}/conflicts

- **Purpose:** Conflicts in a room — two agent readings that disagree, both supported, waiting on a person.
- **Auth:** Bearer token.
- **Request:** path `roomId`; query `includeResolved` (default true).
- **Response `data`:** `{ roomId, conflicts: [{ id, roomId, summary, raisedByLabel, raisedByAgentKey, raisedAtUtc, readings: [{ key, label, recommends, because, evidenceClaimIds, expectedReach, expectedEffect, currency, effectUnavailableBecause, longRunEffect, chosen }], waitingOnUserId, escalatedToUserId, escalationReason, escalatedAtUtc, thirdReadings: [{ question, askedByUserId, askedByLabel, askedAtUtc, runId }], chosenReadingKey, resolvedByUserId, resolvedByLabel, resolvedAtUtc, resolutionNote, isResolved, comparableEffect }], open }`.
- **Used by:** service + hook ready (`src/services/api/rooms/get-room-conflicts.ts` / `src/features/rooms/use-get-room-conflicts.ts`), not wired into a page yet — conflicts tab.
- **Status:** service/hook ready, not wired.
- **Notes:** Both readings always returned, resolved or not — the losing one is the record of what was argued, cited when the same leak recurs. `comparableEffect` says whether the two effect figures can be read against each other; when false, one is unpriced or they're in different currencies. A null `expectedEffect` is unpriced, never zero — `effectUnavailableBecause` says why. `waitingOnUserId` is a required uuid, never null. **Resolved 2026-09-08:** the response's own JSON-example view had truncated each `readings[]` item with `"...": "[Additional Properties Truncated]"`; pulling the endpoint's full response *schema* (not the example) instead of the example view showed the only hidden field is `chosen: boolean` — true on whichever reading was picked when the conflict resolves, redundant with but simpler to check than comparing against `chosenReadingKey`.

### POST /rooms/{roomId}/conflicts

- **Purpose:** Raises a conflict between at least two supported readings.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ summary: string, readings: [{ key, label, recommends, because, evidenceClaimIds, expectedReach, expectedEffect, currency, effectUnavailableBecause, longRunEffect }] }`.
- **Response:** `{ data: conflictId, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/create-conflict.ts` / `src/features/rooms/use-create-conflict.ts`), not wired into a page yet. The design has no create form (conflicts are normally raised by an agent, "Raised by Arbiter").
- **Status:** LIVE-VERIFIED through Scalar 2026-10-12: a PERSON (the Room's decision owner, an administrator) raised a conflict with two readings and EMPTY `evidenceClaimIds`; response `200 { data: "01a130be-e243-71df-85f7-2db56801bb86", messages: ["Conflict raised."], succeeded: true }`. So the route is not agent-only for that role, and readings do not need real evidence claims. Other roles untested. The test conflict now exists on the user's Room "Dormant Accounts" (`01a0fc76-a89c-7d41-899a-bba0214c9923`).
- **Notes:** Refused with only one reading — that's a recommendation, not a dispute. Waits on the room's decision owner.

### POST /rooms/conflicts/{conflictId}/choose

- **Purpose:** Settles a conflict by naming one of the readings actually argued.
- **Auth:** Bearer token.
- **Request:** path `conflictId`; body `{ readingKey: string, why: string }`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/choose-conflict-reading.ts` / `src/features/rooms/use-choose-conflict-reading.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Deliberately no way to record a compromise — a figure between two recommendations is one nobody proposed and nobody can defend later. `why` required since both sides are supported.

### POST /rooms/conflicts/{conflictId}/third-reading

- **Purpose:** Sends a conflict back with a question instead of resolving it.
- **Auth:** Bearer token.
- **Request:** path `conflictId`; body `{ question: string, runId: uuid | null }`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/request-third-reading.ts` / `src/features/rooms/use-request-third-reading.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Conflict stays OPEN while the run happens — render as still waiting. `runId` optional; null is honest (question recorded either way).

### POST /rooms/conflicts/{conflictId}/escalate

- **Purpose:** Moves who decides a conflict — only that.
- **Auth:** Bearer token.
- **Request:** path `conflictId`; body `{ toUserId: uuid, why: string }`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/escalate-conflict.ts` / `src/features/rooms/use-escalate-conflict.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Room's owner/members/work untouched; conflict + evidence + both readings travel since they're one record. `why` required — the receiver needs to know which part they're being asked to decide.

### POST /rooms/new/estimate

- **Purpose:** Live cohort count as somebody types a room's targeting rules, before opening it.
- **Auth:** Bearer token.
- **Request:** body `{ rules: [CreateSegmentRuleInput], currency: string }` where a rule = `{ field, operator, value, logicOperator, order }`.
- **Response `data`:** `{ matched, reachable, amountAtRisk, currency, outsideCurrency, dropOut: [{ key, label, customers, why }], computedAtUtc }`.
- **Used by:** service + hook ready (`src/services/api/rooms/estimate-new-room-cohort.ts` / `src/features/rooms/use-estimate-new-room-cohort.ts`), not wired into a page yet — new-room wizard.
- **Status:** service/hook ready, not wired.
- **Notes:** `reachable` (not `matched`) is the figure the eventual room carries — opening on the larger number but sending to the smaller produces a campaign that "worked" being reviewed as one that failed. `dropOut` rows are positive counts, not subtractions. `amountAtRisk` is null when nobody in the cohort has ordered in this market — null is unpriced, never zero. Nothing persisted — abandoning the wizard leaves nothing behind.

### POST /rooms/new/similar

- **Purpose:** Rooms already open about something similar, to catch duplicates before opening a new one.
- **Auth:** Bearer token.
- **Request:** body `{ rules: [CreateSegmentRuleInput], currency: string, limit: int32 | null }`.
- **Response `data`:** `{ candidateMatched, rooms: [{ roomId, title, population, sharedCustomers, shareOfCandidate, doubleCountedAmount, currency, ownerMemberId, ownerName, state, openedAtUtc, suggestion }], restrictedOverlaps, computedAtUtc }`.
- **Used by:** service + hook ready (`src/services/api/rooms/get-similar-rooms.ts` / `src/features/rooms/use-get-similar-rooms.ts`), not wired into a page yet — new-room wizard.
- **Status:** service/hook ready, not wired.
- **Notes:** Meant to be called repeatedly (at the name, at the audience, before opening). `suggestion` is a reading aid only — nothing branches on it. `restrictedOverlaps` is a count only — restricted rooms are never named/owned/measured here. It's `null` (not 0) for a small cohort — null means "not asked," since answering for a handful of people would identify them. `doubleCountedAmount` is null wherever the other room's cohort doesn't price people individually.

### POST /rooms/new

- **Purpose:** Opens a room on a cohort somebody described (rather than a leakage-map cell).
- **Auth:** Bearer token.
- **Request:** body `{ title, conditionKey, currency, rules: [CreateSegmentRuleInput], settlesWhen: string[], measuredOverDays: int32, primaryMeasure, revenueBasis, holdoutPercent: int32 | null, noHoldoutBecause, wouldProveUsWrong, people: [{ userId, role, maxApprovalReach }], agents: [{ key, role, whatItWillDo, reads: string[] }] | null, linkToRoomId: uuid | null, linkReason, openDespiteOverlapWith: uuid[] }`.
- **Response:** `{ data: roomId, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/create-room.ts` / `src/features/rooms/use-create-room.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** `conditionKey` is picked from the map's vocabulary, not typed — the title is the person's own words. One currency always. `settlesWhen` accepts a measured outcome, a disproof, or "no action worth taking" — no deadline option, since a date isn't an answer. Null `holdoutPercent` means the room declared at open that it can't be measured (requires a reason). Measurement plan is stated, not enforced. Runs a final duplicate check and **can refuse**: if most of the cohort is already in a visible room, caller must join it, link via `linkToRoomId`, or acknowledge via `openDespiteOverlapWith` (room ids, not a flag — so acknowledging one overlap doesn't skip past a second unseen one).

### POST /rooms/{roomId}/link

- **Purpose:** Records that two open rooms overlap and both are staying open (not a merge).
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ otherRoomId: uuid, why: string }`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/link-room.ts` / `src/features/rooms/use-link-room.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** NOT a merge — both rooms keep their own owner, decision, and close; the link is written into both rooms because the underlying problem is that neither owner could see the other. Each side records what its own cohort says the shared people are worth, and the two are deliberately not reconciled — they measured the same customers over different windows, so they can legitimately disagree.

### DELETE /rooms/{roomId}/link/{otherRoomId}

- **Purpose:** Removes a link from both sides.
- **Auth:** Bearer token.
- **Request:** path `roomId`, `otherRoomId`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/unlink-room.ts` / `src/features/rooms/use-unlink-room.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Not a claim the two never overlapped — says they're no longer being worked as related.

### GET /rooms/convening

- **Purpose:** What the product noticed and thinks is worth convening work about.
- **Auth:** Bearer token.
- **Request:** query `includeDecided` (boolean).
- **Response `data`:** `{ waiting: [ConveningProposal], decided: [ConveningProposal], withheld: [{ id, alertCategory, title, conditionKey, reason, detail, raisedAtUtc }], withheldNotShown, raisedThisWeek, weeklyCap }` where `ConveningProposal` = `{ id, alertCategory, alertSeverity, title, description, conditionKey, rowLabel, currency, amountAtRisk, customerCount, ownerUserId, outcome, roomId, raisedAtUtc }`.
- **Used by:** the Convening tab on `/rooms?tab=convening` (`src/pages/rooms/convening/`), and the tab bar's count badge. Service + hook: `src/services/api/rooms/get-convening-proposals.ts` / `src/features/rooms/use-get-convening-proposals.ts`.
- **Status:** wired 2026-10-11. Live account had empty `waiting`/`decided`, so those two lists were layout-checked on mocked data only; `withheld` was seen real.
- **Backend gaps (tickets raised):** `conditionLabel` and `ownerName` on proposals (Condition and Proposed owner cells are left empty); `declineReason` and `decidedByName` on `decided` items; allowed values for `alertSeverity` and `outcome` (chips are plain grey until known). Observed real values: `reason` = `no-figure-behind-the-cell` | `no-stage-owner`; `alertCategory` = `churn_trajectory` | `dormancy`. Money/counts may arrive as number or string.
- **Notes:** *New endpoint, added 2026-09-08.* Three lists and `withheld` is not an appendix — `waiting` needs a decision, `decided` is history, `withheld` is signals that mapped to a condition and then couldn't proceed (a missing source behind the cell, no owner on the stage, the weekly cap, or a room already open). A workspace seeing only proposals can't tell a quiet week from one where every detection died on a missing source, and those call for opposite responses. `raisedThisWeek` against `weeklyCap` is sent so a queue gone quiet because it hit its cap doesn't read as nothing happening.

### POST /rooms/convening/{proposalId}/accept

- **Purpose:** Opens the suggested room.
- **Auth:** Bearer token.
- **Request:** path `proposalId`.
- **Response:** `{ data: roomId, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/accept-convening-proposal.ts` / `src/features/rooms/use-accept-convening-proposal.ts`), wired to "Open room" on each waiting card.
- **Status:** wired 2026-10-11, NOT yet submitted against the real backend (mutation unverified).
- **Notes:** *New endpoint, added 2026-09-08.* Any member may accept — the proposal already chose an owner from stage ownership, and requiring that one specific person would leave the queue sitting while they're away. Accepting doesn't make the accepter accountable — the room opens in the named owner's name. **Can refuse:** the leakage map moves every fifteen minutes and a proposal can sit for days, so the cell is re-read and a room isn't opened on a figure that's since gone.

### POST /rooms/convening/{proposalId}/decline

- **Purpose:** Declines the suggested room.
- **Auth:** Bearer token.
- **Request:** path `proposalId`; body `{ why: string }` (required).
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/decline-convening-proposal.ts` / `src/features/rooms/use-decline-convening-proposal.ts`), wired to "Decline..." on each waiting card (reason required).
- **Status:** wired 2026-10-11, NOT yet submitted against the real backend (mutation unverified).
- **Notes:** *New endpoint, added 2026-09-08.* The decline is kept, not deleted — a category declined every time is a row in the map that shouldn't be there, and that's only legible if the declines survive with their reasons. Nothing is suggested twice — one proposal per detector fingerprint, ever.

### GET /rooms/{roomId}/guardrails

- **Purpose:** What this room may not do, and what that has already prevented.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response `data`:** `{ roomId, guardrails: [{ label, setting, appliesToThisRoomOnly, setBy, setByLabel, overridable, overrideNote, key, setAtUtc }], stopped: [{ guardrail, whatWasStopped, affected, whatHappenedInstead }], stopsComputedFrom, stopsAbsentBecause, sendTimeStopsAvailable }`.
- **REAL RESPONSE 2026-10-13** (Dormant Accounts): ONE guardrail, `Opt-out` (`setting: "excluded permanently, before any audience is built"`, `setBy: "legal"`, `overridable: "never"` (the docs said `"no"`; both are treated as unliftable), `overrideNote`, `key: null`, `setAtUtc: null`), `stopped: []`, `stopsAbsentBecause: "not-yet-computed"`, `sendTimeStopsAvailable: false`. The design's other rows (quiet hours, frequency cap, discount ceiling, room-set ones) are NOT in the response. Never seen live: a `by-its-author` guardrail, a "set elsewhere" one, a non-empty `stopped`.
- **Used by:** the guardrails section of the People & guardrails tab (`src/pages/rooms/room/people-guardrails/guardrails-section.tsx`). Service + hook: `get-room-guardrails.ts` / `use-get-room-guardrails.ts`.
- **Status:** BUILT 2026-10-13 from the real response + the docs. Room-set rows ("Lift" only for the author, `setBy === me`), set-elsewhere rows and the stops list are docs-only.
- **Notes:** *New endpoint, added 2026-09-08.* Two kinds on one list, and the difference is the point: `overridable: "no"` guardrails (opt-out, quiet hours, frequency cap) are conditions the send pipeline checks and refuses — NOT permissions an administrator holds; render as unliftable by anyone, including the workspace owner. `overridable: "by-its-author"` means a person in this room set it and only they can lift it — `key` is present only on that kind, since a control with nothing to call can't be offered. `sendTimeStopsAvailable` is always false today: the two audience exclusions are real and computed, while throughput splits and quiet-hours holds happen during sending and nothing records them — render that honestly rather than implying there were none. `stopsAbsentBecause` distinguishes a cohort not yet computed from one that lives in a segment and never will be.

### POST /rooms/{roomId}/guardrails

- **Purpose:** Puts a constraint on this room.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ label: string, setting: string }` (both required).
- **Response:** `{ data: key, messages, succeeded }` — `key` is the identifier needed to lift the guardrail later.
- **Used by:** service + hook ready (`src/services/api/rooms/create-room-guardrail.ts` / `src/features/rooms/use-create-room-guardrail.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** *New endpoint, added 2026-09-08.* Any member may add one — the person who knows why a discount is wrong isn't always the owner. Both a name and a setting are required — a name alone leaves the scope to be argued about later. **Stated, not enforced:** nothing in the send pipeline reads a room guardrail, because plays aren't room-scoped yet. ❌ **Doc/example mismatch:** the prose says this "returns the key needed to lift it," but the live Test Request example shows `"data": null` — typed `string | null` in the service until a real call confirms which is right; treat the returned key as possibly absent.

### DELETE /rooms/{roomId}/guardrails/{key}

- **Purpose:** Removes a guardrail.
- **Auth:** Bearer token.
- **Request:** path `roomId`, `key`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/delete-room-guardrail.ts` / `src/features/rooms/use-delete-room-guardrail.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** *New endpoint, added 2026-09-08.* Only the person who set it may remove it — no owner or administrator carve-out. A constraint somebody else can quietly remove is not one they set.

### GET /rooms/{roomId}/runs

- **Purpose:** What the agents in this room have been doing.
- **Auth:** Bearer token.
- **Request:** path `roomId`; query `limit` (int32, optional).
- **Response `data`:** `{ roomId, agents: [{ key, displayName, role, state, currentRunId }], runs: [{ runId, agentKey, agentName, startedAtUtc, finishedAtUtc, turns, state, waitingOn, failedBecause, result, cancelledByUserId, cancelReason }], noAgentsNamed, rowsReadAvailable }`.
- **REAL RESPONSE 2026-10-13** (Dormant Accounts): `agents[]` = Revenue Intelligence `lead`, Compass `supporting`, Oracle `supporting`, all `state: "idle"`; `runs[]` newest first, 9 runs all `state: "done"` (lowercase; `result` "recorded a claim" / "concluded the investigation" on two, null on the rest), `agentKey: "flolyt"` / `agentName: "Flolyt"` for the coordination run, `rowsReadAvailable: false`, `noAgentsNamed: false`. NEVER seen live: failed, cancelled, awaiting-approval, running rows.
- **Used by:** the Agents & runs tab, `src/pages/rooms/room/agents-runs/` (roster, runs table, investigation card, "Add an agent" button). Service + hook: `src/services/api/rooms/get-room-runs.ts` / `src/features/rooms/use-get-room-runs.ts` (the tab reads `limit=50`).
- **Status:** BUILT 2026-10-13. Left out: "Approve or reject" on a waiting run (no route documented), "Connect source" on a failed run (no field), the rows-read count (unavailable). The live feed refreshes this tab on `run_started` / `run_state` / `run_cancelled` / `error` (debounced).

### GET /rooms/{roomId}/investigation (REAL RESPONSE 2026-10-13; was "unspecified")

- **Purpose:** The Room's investigation: where it stands, its turn budget and the steps taken.
- **Auth:** Bearer token. **404** with the server's own text ("This room has no lead agent, so nothing investigates it.") when the Room has no lead agent.
- **Response `data`:** `{ roomId, openingNumber, status ("concluded" seen), turnBudget, turnsUsed, turnsLeft, now, summary, stoppedBecause, startedAtUtc, endedAtUtc, canPause, steps: [{ runId, agentKey, agentLabel, kind ("lead" | "coordinate" | "ask" seen), question, askedByAgentKey, startedAtUtc, endedAtUtc, outcome, tool }] }`.
- **Used by:** the investigation card on the Agents & runs tab (`src/services/api/rooms/get-room-investigation.ts` / `src/features/rooms/use-get-room-investigation.ts`). `canPause` is not used: no pause route is documented.
- **Open ticket #57:** the `coordinate` and `ask` steps keep `endedAtUtc` and `outcome` null although their runs are `done` and the investigation is `concluded` (both runs ended after the conclusion). The card shows "No end time recorded" for such a step and never claims it is still running.
- **Notes:** *New endpoint, added 2026-09-08.* A failed run is a row like any other — not hidden, not a banner: its cause is named (e.g. `"COGS source missing"`), which makes it fixable, and the room keeps working with one agent blind. Don't sort by severity or lift failures into their own section. `agents` is the room's roster with a state each, since "idle" is an agent with nothing in flight rather than a run, and a table of runs alone can't show it. States are the kit's seven plus `awaiting-approval`, a run parked on a person rather than a machine — folding that into `queued` would make one word mean both "waiting for a machine" and "waiting for you." `rowsReadAvailable` is always false — nothing counts rows an agent read, sent so a client renders "unavailable" rather than a zero. `waitingOn` is usually null — runs don't depend on other runs in this system, so the kit's "waits on run X" concept isn't reproduced rather than being faked.

### POST /rooms/{roomId}/agents

- **Purpose:** Puts an agent in the room.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ agentKey: string, role: string, whatItWillDo: string, reads: string[] | null }`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/add-room-agent.ts` / `src/features/rooms/use-add-room-agent.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Roles (backend answer 2026-10-13, exact lowercase values):** PEOPLE `decision-owner` (accountable for the Room's decisions), `participant` (contributes to the investigation and work), `approver` (provides approval or specialist sign-off), `observer` (follows the work without deciding). AGENTS `lead` (leads the investigation, only one per Room), `supporting` (contributes alongside the lead), `automatic` (represents the arbitration role for agent disagreements; looks system-assigned, so NOT offered in the add dialog unless the backend says otherwise). Required body fields per the Scalar schema: `agentKey`, `role`, `whatItWillDo`; `reads` optional. (An earlier note here said "Lead and Support": superseded.)
- **Notes:** Exactly one agent may hold the `lead` role — two agents owning the reading is a conflict to raise while the work happens, not something to configure. `reads` is a statement of what the agent is told to look at, not a grant — actual tool access is decided by the persona's tool set.

### DELETE /rooms/{roomId}/agents/{agentKey}

- **Purpose:** Takes an agent out of the room.
- **Auth:** Bearer token.
- **Request:** path `roomId`, `agentKey`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/remove-room-agent.ts` / `src/features/rooms/use-remove-room-agent.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** The arbiter cannot be removed — it's what raises a conflict when two agents disagree; without one, a room settles disagreements by whichever agent spoke last.

### GET /rooms/{roomId}/merge-candidates

- **Purpose:** Other rooms working on the same people, as a precursor to merging.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response `data`:** `{ roomId, population, candidates: [{ roomId, title, ownerMemberId, conditionKey, stageLabel, theirPopulation, sharedCustomers, oursForShared, theirsForShared, countedTwiceAtLeast, currency, sameCondition, theirOpenedAtUtc, alreadyMerged, alreadyLinked }], notYetComputed, absentBecause }`.
- **REAL RESPONSE 2026-10-14** (Dormant Accounts): `population: 0`, `candidates: []`, `notYetComputed: true`, `absentBecause: "not-yet-computed"`. A second Room now exists ("Attrition — CAD", `01a13b36-ed6a-7854-8189-c2e42ae3fa21`, CAD, population 9, opened 2026-10-14); Dormant Accounts is USD, so a pair would be cross-currency (headcounts only, money figures null per the docs). Never seen with a real candidate.
- **REAL RESPONSE 2026-10-16 (ticket #60, Dormant Accounts):** `population: 37`, `candidates: []`, `notYetComputed: false`, `absentBecause: "comparison_scope_unavailable"`, plus `membership` (same shape as cohort) and NEW `comparison` `{ availability: "unavailable", basis: "source-scoped-subject-overlap", computedAtUtc: null, limitations: [{ code: "comparison_scope_unavailable", message: "The market, grain or dated evidence basis needed for comparable overlaps is unavailable." }] }`. So no overlap can be computed for this Room (market is null). Attrition (CAD) NOT checked yet.
- **Used by:** the Cohort & overlaps tab, "Other rooms working on the same people" (`cohort-overlaps/overlaps-section.tsx`), with link / unlink / merge / unmerge.
- **Status:** BUILT 2026-10-16; overlap cards, cross-currency note, link dialog, merge dialog (owner choice), unlink and unmerge confirms are mock-verified only (request bodies checked) because no real candidate exists. Merge sends `{ roomId: candidate, survivingRoomId: this room, ownerMemberId }` for "Merge into this room". Not shown (not sent): the other owner's name, who/when/why a link was made, when a room was merged. REAL RESPONSE note: Attrition (CAD) still unchecked. **Ticket text (not yet confirmed raised):** "For Room 01a0fc76-a89c-7d41-899a-bba0214c9923 (opened 2026-10-02), GET /rooms/{roomId}/cohort returns notYetComputed: true (absentBecause: not-yet-computed) with all counts 0, and GET /rooms/{roomId}/merge-candidates returns population 0, candidates [], notYetComputed: true. The docs say this means the Room opened between computing passes; it has been 12 days. (1) Is the cohort computation running for this Room and what triggers it? (2) Will the second Room 01a13b36-ed6a-7854-8189-c2e42ae3fa21 (opened 2026-10-14) be computed, so overlaps and the cross-currency card can be tested?" (The 52 s Scalar time seen once was the user's own network, not the backend: the next call took 4 s.)
- **Notes:** `countedTwiceAtLeast` is a floor, not a total — per shared person it takes the smaller of the two contributions (the two cells may draw on different orders), render as "at least." Cross-currency pairs return null money figures — only headcount stands, currencies never blended. Restricted rooms are absent here (unlike the collision check) — merging needs an owner and a decision taken in front of both people. Doesn't recommend merging — linking is an equally valid answer, and the collision check already stops the two rooms sending to the same people.

### POST /rooms/{roomId}/merge

- **Purpose:** Folds this room into another.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ survivingRoomId: uuid, ownerMemberId: uuid }`.
- **Response:** `{ data: survivingRoomId, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/merge-room.ts` / `src/features/rooms/use-merge-room.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Nothing is deleted — both decision docs, threads, and logs survive; the merged room stays readable at its own id, only a pointer changes so its figures stop double-counting. `ownerMemberId` must be one of the two current owners; the other becomes a named participant (source `owned-the-merged-room`) and keeps hearing about the room. Merging into an already-merged room is refused rather than chained.

### POST /rooms/{roomId}/unmerge

- **Purpose:** Separates a merged room again.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/unmerge-room.ts` / `src/features/rooms/use-unmerge-room.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Cheap, since merging moved nothing. The owner is NOT restored — reassigning is a separate act somebody has to choose.

### GET /rooms/subscriptions

- **Purpose:** What a person has signed up to hear about, across all rooms.
- **Auth:** Bearer token.
- **Request:** query `userId` (uuid, optional — pass to read somebody else's).
- **Response `data`:** `{ userId, watching, owned, reachingTheirDigest, muted, autoAddedThisMonth, askingWhetherStillWanted, rooms: [{ roomId, title, restricted, reason, notifyLevel, amountAtRisk, currency, sinceUtc, lastOpenedAtUtc, ownsIt, canMute, asksWhetherStillWanted }] }`.
- **Used by:** the My load tab on `/rooms?tab=my-load` (`src/pages/rooms/my-load/`). Service + hook: `src/services/api/rooms/get-room-subscriptions.ts` / `src/features/rooms/use-get-room-subscriptions.ts` (hook takes `{ enabled }`). The "Showing" picker lists active human `GET /workspace/members`; "You" sends no `userId`, anyone else sends `?userId=<member id>` (URL `?person=`).
- **Status:** wired 2026-10-11. Live response seen for the caller only (1 owned room, `reason: "owns-it"`, `canMute: false`); a plain member row, a restricted row and reading someone else's load are unverified. Assumed: a workspace member's `id` is the `userId` this route wants.
- **Backend question (to raise):** what do `title` and `amountAtRisk` hold for a restricted room, for the caller inside it and for one they can't see (e.g. someone else's `userId`)? The UI shows whatever is sent, with a lock icon on `restricted`.
- **Backend gap:** no "keep watching" action (design's button held, `❌` comment in `load-table.tsx`); `POST /watch` is only documented as re-adding someone who unwatched.
- **Notes:** Reading someone else's (via `userId`) is the point of the screen — a lead seeing that somebody carries 22 rooms before assigning a 23rd is the best overload predictor in the workspace. Muted rooms count in BOTH `watching` and `muted` — muting doesn't hide, stays searchable, still counts toward load. `canMute` is false on a room they own — render the reason, not a missing control. `asksWhetherStillWanted` = 30 days without opening it; it only asks, nobody is auto-unsubscribed by time. `reachingTheirDigest` is a count only — no digest is assembled or sent yet.

### POST /rooms/{roomId}/watch

- **Purpose:** Follow a room.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ reason: string | null, notifyLevel: string | null } | null`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/watch-room.ts` / `src/features/rooms/use-watch-room.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Somebody who previously unwatched is not re-added by an automatic reason (a mention or a rule) — "a mention adds you once" — but an explicit call to this endpoint does add them back.

### POST /rooms/{roomId}/notify-level

- **Purpose:** Sets notification level for a watched room.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ notifyLevel: string }` — enum `everything` | `decisions-only` | `nothing`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** the Notifications dropdown on the My load tab, live only when viewing your own load (the route has no `userId`, so it can only change the caller's own level); disabled where `canMute` is false.
- **Status:** wired 2026-10-11, NOT yet submitted against the real backend (mutation unverified).
- **Notes:** Muting a room you own is refused — that's resigning from it, and somebody has to take it (reassign first).

### POST /rooms/{roomId}/unwatch

- **Purpose:** Stop watching a room.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** the "Unwatch" button on a "Still want this?" row of the My load tab (own load only, never on an owned room).
- **Status:** wired 2026-10-11, NOT yet submitted against the real backend (mutation unverified).
- **Notes:** Refused on a room you own. Remembered, so a later mention doesn't re-add you.

### POST /rooms/{roomId}/opened

- **Purpose:** Records that somebody opened the room, for the 30-day "still wanted" decay check.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response:** `{ data: boolean, messages, succeeded }` — `false` when there was nothing to stamp.
- **Used by:** service + hook ready (`src/services/api/rooms/mark-room-opened.ts` / `src/features/rooms/use-mark-room-opened.ts`), not wired into a page yet — should fire on every room-detail page mount.
- **Status:** service/hook ready, not wired.
- **Notes:** The only input the 30-day decay rule has — nothing else in the product records that a person looked at something. Idempotent and cheap: stamps at most once a day, writes nothing on repeat views same-day.

### GET /rooms/{roomId}/cohort

- **Purpose:** The people behind a room — counts plus a random 12-person sample, no paging or export.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response `data`:** `{ roomId, totalCount, reachableCount, suppressedCount, cappedCount, markets: [{ timeZoneId, customerCount }], sample: [{ customerId, name, acquiredAtUtc, firstOrder, currency, daysSinceFirstOrder, timeZoneId, contactability, suppressionReason }], sampledFromPool, exportable, computedAtUtc, notYetComputed, absentBecause }`.
- **REAL RESPONSE 2026-10-14** (Dormant Accounts, opened 2026-10-02): `totalCount: 0`, every count 0, `markets: []`, `sample: []`, `sampledFromPool: false`, `exportable: false`, `computedAtUtc: null`, `notYetComputed: true`, `absentBecause: "not-yet-computed"`. The docs say this state means the Room opened between computing passes; it is 12 days later, so it is a BACKEND QUESTION (ticket below). Nothing else on this endpoint has ever been seen with data.
- **REAL RESPONSE 2026-10-16 (ticket #60, backend says repaired; user pasted from Scalar):** computed now: `totalCount: 37`, `computedAtUtc: 2026-10-16T12:55:05Z`, `notYetComputed: false`, `absentBecause: null`, BUT `reachableCount`, `suppressedCount`, `cappedCount` are all `null`, `markets: []`, `sample: []`, `sampledFromPool: true`, `exportable: false`. NEW fields not in the docs: `membership` `{ availability: "complete", totalCount, resolvedCount, subjectType/grain "account", unit "accounts", businessUnit null, market null, currency "USD", lifecycleClass "InFlight", provenance { basis "linked-finding-evidence", snapshotId, asOfUtc, openingNumber, computedAtUtc, publicationId null, publicationRevision null }, limitations [] }` and `subjectSample[]` (12 items: `key`, `reference`, `sourceIds[]`, `evidenceIds[]`, `capabilityResolutionIds[]`, `evidenceCount`, `capabilityResolutionCount`; NO name, market or any person detail). The design's tiles (reachable/suppressed/capped), "Where they are" and "Twelve at random" have no data in this response.
- **Used by:** the Cohort & overlaps tab, "The people behind this room" (`src/pages/rooms/room/cohort-overlaps/people-section.tsx`).
- **Status:** BUILT 2026-10-16 from the real response above (user: build whatever the schema supports even when null today). Total, computed time and `membership` caption are real; Reachable / Suppressed / Capped tiles, the split bar, "Where they are" and the sample table are built but show an empty state until the backend fills `reachableCount`/`suppressedCount`/`cappedCount`/`markets`/`sample`. `subjectSample` is NOT shown (ids only). Reshuffle = refetch (unverified that it draws a new sample).
- **Notes:** The sample of 12 is a sanity check, not evidence — reshuffle gives a fresh draw. Deliberately no paging/export — a sample answers "is this cohort what I think it is," a different question from a customer list. Suppressed outranks capped — an opt-out doesn't expire, a cap does. `notYetComputed` means the room opened between passes and has no cohort yet — render that, never zeros. `computedAtUtc` can be up to 15 minutes stale — show it.

### GET /rooms/{roomId}/people

- **Purpose:** Who is in a room and what each is here for.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response `data`:** `{ roomId, people: [{ userId, role, maxApprovalReach, addedAtUtc, addedBy, source }], restricted: { reason, restrictedBy, restrictedAtUtc, peopleInside } | null, agents: [{ key, displayName, role, whatItWillDo, reads, addedAtUtc }], leadAgentKey, everyoneSeesEverything }`.
- **Used by:** service + hook ready (`src/services/api/rooms/get-room-people.ts` / `src/features/rooms/use-get-room-people.ts`), not wired into a page yet — people/members tab.
- **Status:** service/hook ready, not wired.
- **Notes:** Everyone in this list reads every message, finding, and customer in the cohort (`everyoneSeesEverything`) — a role changes only who a proposal routes to and what they may approve, never what they can see. No partial membership.

### POST /rooms/{roomId}/people

- **Purpose:** Adds somebody to the room.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ userId: uuid, role: string, maxApprovalReach: int32 | null, source: string | null }`.
- **Response:** `{ data: memberCount, messages, succeeded }`.
- **Used by:** the add dialog in the thread and on the People & guardrails tab (`add-to-room-dialog.tsx`; it now sends `maxApprovalReach` when filled in, a whole number 0 to 2147483647, else null).
- **Status:** WIRED 2026-10-13 (one real add seen; the reach value is mock-verified only). OPEN QUESTION for the backend: the unit of `maxApprovalReach` (the design hints "people reached") and what `null` means for an approver (no limit, or cannot approve).
- **Notes:** The widest of the available options and should be presented as such — they'll see evidence, decision, plays, and every customer in the cohort. If someone should see the finding but not the customers, that's a handoff or read-only view, not membership.

### PUT /rooms/{roomId}/people/{userId}

- **Purpose:** Changes a member's role and their largest approvable play.
- **Auth:** Bearer token.
- **Request:** path `roomId`, `userId`; body `{ role: string, maxApprovalReach: int32 | null }`.
- **Response:** `{ data: memberCount, messages, succeeded }`.
- **Used by:** the People table (`people-guardrails/people-card.tsx`): the role select and the inline approval-limit field both call it with `{ role, maxApprovalReach }`.
- **Status:** WIRED 2026-10-13, mock-verified only (never run against the real backend).
- **Notes:** Visibility never changes — it never was tied to role.

### DELETE /rooms/{roomId}/people/{userId}

- **Purpose:** Removes someone from the room.
- **Auth:** Bearer token.
- **Request:** path `roomId`, `userId`.
- **Response:** `{ data: memberCount, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/remove-room-person.ts` / `src/features/rooms/use-remove-room-person.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** The owner cannot be removed this way — reassign the room first.

### POST /rooms/{roomId}/restrict

- **Purpose:** Closes a room to everyone not already inside it.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ reason: string }` — enum `pricing-before-announcement` | `individual-employment` | `active-legal-matter` | `acquisition`, no others.
- **Response:** `{ data: memberCount, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/restrict-room.ts` / `src/features/rooms/use-restrict-room.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Fixed reason list, by design — an arbitrary-reason restrict is how a shared workspace quietly becomes several private ones. The room stays LISTED — name, reason, who restricted it, and headcount inside remain visible to everyone; invisible-but-existing rooms are indistinguishable from ones that don't exist.

### DELETE /rooms/{roomId}/restrict

- **Purpose:** Opens a restricted room back up to the workspace.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response:** `{ data: memberCount, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/unrestrict-room.ts` / `src/features/rooms/use-unrestrict-room.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.

### GET /rooms/{roomId}/plays

- **Purpose:** What this room has proposed, and what each proposal is waiting on.
- **Auth:** Bearer token.
- **Request:** path `roomId`; query `includeDecided` (default true).
- **Response `data`:** `{ plays: [{ proposalId, roomId, roomTitle, summary, toolName, reach, effect, currency, figuresAreStated, state, decisionOwnerMemberId, waitingHours, deferredBecause, proposedAtUtc, campaignId }], pending, done, rejected, deferred, waitingOnPeople, returnedObligations: [{ id, chainId, roomId, roomTitle, description, class, origin, fromUserId, fromName, toUserId, toName, toTeam, state, proposedDueAtUtc, dueAtUtc, isOverdue, daysOverdue, isPastAskedDate, firstCreatedAtUtc, askedAtUtc, acceptedAtUtc, doneAtUtc, lastMovedAtUtc, blocks: [{ text, amount, currency, reference }], readCount, repeatCount, toHasLeft }] }`.
- **Backend SAMPLE 2026-10-13 (hand-written, NOT a live capture: ids are `1111…`, currency EUR on a USD Room):** each play also carries `basis` (e.g. `"estimated"`) and `decisionOwnerName` (full name). `returnedObligations` still has no real item. **2026-10-16:** backend says ticket #55 is done: `decisionOwnerName` is a nullable string on each play (same full-name lookup as Room people; missing, blank or other-workspace profiles return null). The Plays table already shows "—" for null. NOT yet seen on a real play; the user keeps #55 open until one exists.
- **Used by:** the Plays tab, `src/pages/rooms/room/plays/` (counters, "Include decided", plays table, collision card on the selected play, cited objections/readings, obligations table); also the tab's `pending` badge. Service + hook: `src/services/api/rooms/get-room-plays.ts` / `src/features/rooms/use-get-room-plays.ts`.
- **Status:** BUILT 2026-10-13 from the documented shape + the sample; NOT verified against a live response (no play exists on the user's Room yet). Left out: "About this leak", "Hand off obligations", the campaign link on a done play.
- **Notes:** Every row carries who decides, how long it's waited, reach, and value. `reach`/`effect` are stated by the proposer and verified by nothing — `figuresAreStated` must be rendered, since a stated reach read as a checked one is how a play meant for 100k people reaches 5x that. **Updated 2026-09-08:** each play row gained `campaignId`, and the response gained `returnedObligations` — the follow-up items handed off via `close`'s `outstanding` field that came back to this room/list (looks like the same shape used by handoff-style obligation chains elsewhere in the product).

### GET /plays

- **Purpose:** Every play across every room, same columns as a single room's board.
- **Auth:** Bearer token.
- **Request:** query `includeDecided` (default true).
- **Response `data`:** same shape as `GET /rooms/{roomId}/plays`'s `data`.
- **Used by:** service + hook ready (`src/services/api/rooms/get-all-plays.ts` / `src/features/rooms/use-get-all-plays.ts`), not wired into a page yet — cross-room plays/proposals dashboard.
- **Status:** service/hook ready, not wired.
- **Notes:** `waitingOnPeople` is how many distinct people the pending plays sit with — surfaces a bottleneck when e.g. 14 plays are waiting and 6 sit with one person. ❌ **Path correction, 2026-09-08:** this is `/api/flolyt/plays` (now `/api/v3/plays`, see the 2026-10-10 migration note at the top) — a **top-level** path, not `/api/flolyt/rooms/plays` as the original pass assumed. `apiConfig.ts`'s `GET_ALL_PLAYS` was pointing at the wrong URL and has been fixed to a new `PLAYS_BASE_URL` (`/api/flolyt/plays`); this would have 404'd if wired before the correction.

### GET /plays/{proposalId}

- **Purpose:** One play in full — the approval screen.
- **Auth:** Bearer token.
- **Request:** path `proposalId`.
- **Response `data`:** `{ proposalId, roomId, roomTitle, conversationId, summary, toolName, rationale, proposedByAgentKey, proposedByAgentName, proposedAtUtc, state, decisionOwnerMemberId, decisionOwnerName, waitingHours, decidedBy, decidedByLabel, decidedAtUtc, deferredBecause, reach, effect, currency, figuresAreStated, plannedSendAtUtc, audienceSegmentId, argumentsJson, finalArgumentsJson, executionResultJson, campaignId, drift, reachesCustomers, measurement: { holdoutPercent, noHoldoutBecause, measuredOverDays, primaryMeasure, revenueBasis }, ifItFails: [falsifier], guardrails: [{ key, label, setting, setByLabel }], dissent: [{ id, wording, byUserId, byLabel, recordedAtUtc, withdrawn, borneOut }] }`.
- **404:** for a play that doesn't exist, is in another workspace, or sits in a restricted room the caller can't see — deliberately the same answer for all three.
- **Used by:** service + hook ready (`src/services/api/rooms/get-play.ts` / `src/features/rooms/use-get-play.ts`), not wired into a page yet — single-play approval screen.
- **Status:** service/hook ready, not wired.
- **Notes:** *New endpoint, added 2026-09-08.* `argumentsJson` is exactly what will happen if approved; `finalArgumentsJson` is populated when the approver edited it before approving. `drift` is what's changed since the play was described, or null — an approval covers the send that was on the card, so a non-null `drift` means the person would be answering a different question than the one shown. `reachesCustomers` flags that a sent message can't be recalled after delivery. `figuresAreStated` must be rendered — reach/effect are asserted by the proposer, verified by nothing.

### POST /rooms/{roomId}/reopen

- **Purpose:** Opens a closed room again, as a second opening of the same room.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ why: string, ownerMemberId: uuid | null }`.
- **Response:** `{ data: openingNumber, messages, succeeded }`.
- **Used by:** the "Reopen room" button in the Room header when the Room is archived (`src/pages/rooms/room/reopen-dialog.tsx`): a required reason and an optional owner from the workspace's active human members.
- **REAL RUN 2026-10-17 (user, Dormant Accounts, closed as "No action needed"):** REFUSED with the toast text "That leak cannot be read right now: the selected market, lifecycle class, and currency are no longer measured." Consistent with close-preview's `deltaUnavailableBecause: "the leak cell no longer exists"`: a Room whose leak cell is gone can be closed but not reopened. QUESTION for the backend (raise as a ticket): is that intended, and how is a mistaken close undone? The refusal also proves a real CLOSE of that Room worked (kind `no-action-needed`).
- **Status:** WIRED 2026-10-17, mock-verified only (never run for real). Sends `ownerMemberId: null` when no new owner is chosen (unconfirmed: presumably keeps the current owner) and the workspace member's `id` otherwise (unconfirmed that it is the member id the route wants).
- **Notes:** The id doesn't change, so every link ever pasted still resolves. The previous opening is kept whole (its outcome, population, predictions); the working surfaces (log, evidence, decision, plays) start empty. Population is re-read from the cell as it stands now, not carried forward — measuring a second opening against the first one's world measures against nothing real.

---

# Revenue threat Room (backend phases 5 to 9)

Added 2026-10-10 from [../rooms/revenue-threat-room-frontend-handoff.md](../rooms/revenue-threat-room-frontend-handoff.md). Plan: [../rooms/revenue-threat-room-build-plan.md](../rooms/revenue-threat-room-build-plan.md).
All paths are under `/api/v3/rooms` unless noted. The handoff gives field names and rules in prose, **not full
JSON examples**, so every `Response` below lists only what the handoff names. Fields marked ⚠️ are
unverified shapes: get a Scalar "Show Schema" capture before building UI on them.
The 16 `/rooms` routes are **scaffolded** (2026-10-10): `API_ENDPOINTS.ROOMS` constant plus a service in `src/services/api/rooms/` and a hook in `src/features/rooms/`, file names are the route in kebab-case (e.g. `get-room-threat-monitoring.ts` / `use-get-room-threat-monitoring.ts`). None are wired into a page. The `conversations/messages` change is types only (`ConversationReplyMode`, `SendConversationMessageRequest`, `SendConversationMessageAcceptedData`, message `authorUserId`/`authorName` in `ai-conversation-types.ts`); the stream hook does not send `replyMode` yet.

Rendering rules that apply to every entry below: money is per currency and never summed; the opening
baseline never changes; exposure reduction is never verified/recovered revenue; unknown amounts are
`null`, not zero.

Also named in the handoff but **not specified** (ask the user, do not guess): `/rooms/{roomId}/investigation`
(investigation controls). `/rooms/settings/investigations` is now specified (2026-10-11), see the
"Investigation settings" entries just before "Phase 9".

### GET /rooms/settings/investigations

- **Purpose:** The workspace's turn budget per room investigation, with the default and the bounds.
- **Auth:** Bearer token. `canEdit` is true for administrators (it describes THIS section only; the other Admin sections have no such flag).
- **Request:** none.
- **Response `data`** (real response): `{ turnBudget: 12, defaultTurnBudget: 12, minTurnBudget: 2, maxTurnBudget: 50, updatedAtUtc: null, canEdit: true }`. `updatedAtUtc` is null until the budget is changed. (Scalar's example shows all `1`s; those are placeholders.)
- **Used by:** not wired (Admin tab not built, waiting on backend confirmations). Service + hook NOT scaffolded yet.
- **Status:** documented, not wired.

### PUT /rooms/settings/investigations

- **Purpose:** Sets the turn budget (2 to 50) for investigations that start from now; a working one keeps the budget it started with.
- **Auth:** Bearer token; administrators only.
- **Request:** body `{ turnBudget: int32 }` (required; the schema allows integer or numeric string).
- **Response `data`:** the same object as the GET. 400 on a bad value.
- **Used by:** not wired. **Status:** documented, not wired, mutation never submitted.

## Phase 5: automatic opening

### GET /threats/{investigationId}/room-opening

- **Purpose:** State of an automatically opened threat Room, plus its immutable baseline and draft plan.
- **Auth:** Bearer token, active workspace membership. 404 for missing, foreign or restricted openings.
- **Request:** path `investigationId` (equals a Room row's `threatConfirmationId`).
- **Response `data`:** `{ state, reason, roomId, conversationId, systemActor, routingReason, baseline, plan }`. `state` is `PENDING | READY | PENDING_HUMAN_ROUTING | PENDING_LEGACY_REVIEW | BLOCKED | PAUSED`. **Full schema captured 2026-10-10 via Scalar "Show Schema"** and typed in `src/services/api/rooms/get-threat-room-opening.ts`. `baseline` (nullable while pending): `{ id, companyId, caseId, roomId, confirmationId, openingState, evidenceHash, assessmentIds, assessmentConfidence, openedAtUtc, evidence, policyFingerprint, calculationBatchId, calculations[], rangeAvailability }`. `openingState` has `scope { sector, mechanism, subjectType, grain, stateDimension, stateValue, businessUnit, market, currency, lifecycleClass (Realized|InFlight|Latent|null), issueKey }`, `cellId, caseId, publicationId, revision, snapshotId, coverageId, asOfUtc, horizon (TimeSpan string), exposure (nullable: { currency, market, lifecycleClass, gross, expected, net, candidateCount }), state, signalIds, observationIds, blocker, updatedAtUtc, evidence { confidence, oldestObservationUtc, hasSourceLineage }, measuredZero`. `baseline.evidence` has the same gross/expected/net plus `confidence, horizonDays, facts[]`. `calculations[]` is `{ candidateId, estimate }`, the estimate carrying impact, probability, confidence, threatScore, severity(+policy), ramp, recoveryRate, `grossExposure/expectedLoss/netExpectedLoss`, nullable `grossRange/expectedRange/netRange { lower, upper, basis Empirical|Calibrated|Assumption, version, probabilityMass }`, currency, horizon, mode, assumptions[], caveats[], context, asOfUtc. `plan` (nullable): `{ id, companyId, roomId, ownerId, status, actions: string[], successCriterion }`. Money/ratio fields are `number | string`: display-format only, never do math.
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Never show a ready collaboration Room before `READY`. Attribute the opening to `systemActor` (Flolyt orchestration), not the assigned person. `routingReason` is detail-level only. Baseline amounts always carry currency, market and lifecycle and are labelled "estimated exposure"; no Opportunity subtraction, no cross-currency sum, never "customers/accounts". `rangeAvailability=PER_CANDIDATE_NOT_AGGREGATED` forbids summing intervals; `NOT_AVAILABLE` means no range. `plan` is proposed work, not approved or executed. Pending openings are not a global inbox; operators get IDs from the triage/confirmation audit, ready Rooms supply the ID on the row. The existing `conversationId` already holds a system synthesis message (a status message, no suggested prompts). No new SSE event, email or model response at opening.

## Phase 6: typed plans

### GET /{roomId}/resolution-plan

- **Purpose:** Typed resolution plan with live action statuses.
- **Auth:** Bearer token, active member with Room access. Restricted and foreign Rooms not exposed.
- **Request:** path `roomId`.
- **Response `data`:** `{ contractVersion: "1.0", revision, plan, live action statuses }`. ⚠️ Status row fields named in prose: `proposalState`, `obligationState`, `ownerAvailable`, `referencesAvailable`, `obligationOwnerMismatch`. Plan fields from the PUT example: `diagnosis, objective, successCriteria, verificationPlan, actions[]`.
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** New automatic Rooms start at revision 1; older Phase 5 Rooms return revision 0 (owner can create the first typed revision; the original opening draft stays historical). Render proposal/obligation state from the status rows only, never from an action description or revision. `ownerAvailable=false` or `referencesAvailable=false` means the plan needs review; `obligationOwnerMismatch=true` forces `referencesAvailable=false` ("linked obligation was reassigned, plan needs revision"; the historical action owner is unchanged). No plan value is verified revenue.

### PUT /{roomId}/resolution-plan

- **Purpose:** Revise the typed plan (creates a new immutable revision).
- **Auth:** Bearer token; active Room owner or workspace administrator with Room access. Every action owner must be active with Room access.
- **Request:** path `roomId`; body `{ expectedRevision, diagnosis, objective, successCriteria, verificationPlan, actions: [{ id, kind, description, ownerId, expectedCompletionUtc, successCriterion, dependsOn: string[], proposalId?, obligationId? }] }`.
- **Response:** ⚠️ not shown (presumably the new revision).
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** `kind` is `HUMAN_ACTION | AGENT_PROPOSAL | TOOL_ACTION | DATA_REMEDIATION | WAIT_AND_MONITOR`. `AGENT_PROPOSAL` and `TOOL_ACTION` require `proposalId`, which must reference an existing proposal in this Room's conversation. `obligationId` (optional) must belong to this Room and the action owner. Dependencies reference action ids in the same revision and must be acyclic. A stale `expectedRevision` fails: reload before editing. Revising never approves a proposal or runs a tool; create/decide proposals and obligations through their existing APIs.

## Phase 7: monitoring

### GET /{roomId}/threat-monitoring

- **Purpose:** Versioned monitoring projection: how expected exposure has moved since opening.
- **Auth:** Bearer token, active member with Room access. 404 for missing, foreign or restricted Rooms.
- **Request:** path `roomId`.
- **Response `data`:** `{ state, reason, revision, notifiedRevision, currentExpectedLoss, changeFromOpening, currency, market, lifecycleClass, checkedAtUtc, pendingState, pendingReadings, updates[] (latest 20) }`. ⚠️ `state` values named in prose: `WORSENED`, `DATA_DEGRADED`, `RESOLVED_CANDIDATE`; full enum and `updates[]` shape not given.
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Keep the opening baseline separate. `changeFromOpening` is a signed exposure change, never preserved/recovered revenue. `DATA_DEGRADED` amounts are `null`, not zero. Show `pendingState` as "awaiting confirmation" when it differs from the accepted state. `RESOLVED_CANDIDATE` needs independent verification and does not close the Room. A candidate needs two distinct comparable published readings backed by successful measurement. Updates are also concise system messages in the Room conversation and Room log; refetch monitoring and conversation history while viewing (no background SSE). Monitoring never calls an LLM.

## Phase 6: messages and runs (existing routes, changed behaviour)

These live outside `/rooms`; recorded here because the Room flow depends on them. Mirror into the conversations/agent-runs docs when wired.

### POST /api/v3/conversations/messages (changed)

- **Request:** `{ conversationId, message, replyMode: "auto" | "none", agentKey? }`. `replyMode` defaults to `auto`.
- **Response:** with `Accept: text/event-stream`, the durable run stream; `run_queued` carries `agentKey` and `runId`. JSON with a run returns **202** + `{ runId, conversationId, agentKey, routingReason }` (consume the run, do not expect a completed answer). `replyMode: "none"` saves a human message with no run: SSE emits `message_saved` and ends; JSON returns **200** with no `runId` (null fields omitted).
- **Status:** documented. Not in `ai-conversation-types.ts` yet.
- **Notes:** Routing uses one seat: stored mention `@[agent:<key>]`, then `agentKey`, then a relevant eligible rostered supporter (pack-declared intents), else the Room lead. Multiple agent mentions require choosing one. Unknown, off-roster or disabled agents are refused. Selecting an agent grants no roster membership or authority. `none`: no typing indicator, no `final_response` wait, refresh timeline after `message_saved`. History now includes `authorUserId` and `authorName` for new human messages (old ones unattributed). Reconnect via `GET /api/v3/runs/{runId}/stream`; disconnecting never cancels work; never resend the prompt to reconnect.

### GET /api/v3/conversations/{conversationId}/preferences (new 2026-10-13, backend ticket #51)

- **Purpose:** The caller's saved composer reply mode for this conversation.
- **Auth:** Bearer token. No user id is accepted; only the caller's own preference is readable.
- **Response `data`:** `{ replyMode: "auto" | "none" }`, `auto` when nothing is saved.
- **Errors:** 404 for a missing, archived, foreign-workspace or inaccessible conversation.
- **Used by:** NOT built yet. Plan: the Room thread composer (`src/pages/rooms/room/thread/composer.tsx`) reads it on open, replacing the browser-only `flolyt-room-thread-mode:<conversationId>` memory (keep that only as a fallback).
- **Notes:** A UI default, never a routing override: every message still sends its `replyMode` explicitly. A failed load keeps `auto`. For a new conversation (no id yet) use `auto`. `none` sends exist only for Room conversations.

### PUT /api/v3/conversations/{conversationId}/preferences (new 2026-10-13, backend ticket #51)

- **Request:** `{ replyMode: "auto" | "none" }`.
- **Response:** success returns the saved value. 400 for an invalid or null mode; 404 as above.
- **Used by:** NOT built yet (same place as the GET).
- **Notes:** Creates no message, run or inbox notification. Concurrent saves by the same user: last committed value wins. If saving fails, tell the person it was not saved across devices.

### Room people names and human mentions (new 2026-10-13, from the merged handoff)

- `GET /rooms/{roomId}/people` now adds a nullable `displayName` to every `people[]` row (IDs, roles and ordering unchanged). Not in `get-room-people.ts` types yet.
- Message and steering `authorName` now resolves the same workspace full name for every viewer, the author included. Missing, blank or other-workspace profiles are null: never show an id or assume an email is a name.
- A person mention is written `@[human:<userId>]` in the message text; show a chip `@Ada Lovelace` and keep the id apart from the label. Plain `@Name`, emails and usernames are NOT parsed. Pick people from the workspace roster or Room people. The server queues notifications for eligible workspace people; self-mentions and people outside a restricted Room are skipped. A mention does not invite anyone or grant access. Agent mentions stay `@[agent:<key>]`.

## Phase 8: verification and independently accepted value

### POST /{roomId}/verification-plans

- **Purpose:** Preregister the verification method and a future measurement window.
- **Auth:** Bearer token; Room owner or administrator.
- **Request:** path `roomId`; body `{ id (client UUID, idempotency key), method, sourceId, fromUtc, toUtc }`.
- **Response:** ⚠️ not shown.
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Supported methods named: `campaign_holdout` (`sourceId` = campaign UUID; cohort enrolled but untouched before registration; at least 30 treatment and 30 control subjects; whole UTC-day window, exclusive end; business-unit scopes refused) and `source_condition_review` (`sourceId` may be an empty string). Window at most 90 days, starting within 30. Dispatch must occur after registration and before `fromUtc`; dispatch during observation makes the result unverified. Unsupported methods keep `methodVersion=unsupported` and cannot claim value. Intervention authors (including the intervention source's creator) are pinned at registration and excluded from review. Plan DTOs in the history include nullable `boundResolutionPlanId` and `boundResolutionPlanRevision` (null = this verification cannot support lessons).

### GET /{roomId}/verifications

- **Purpose:** Paged verification plans and results, with matching append-only reversals.
- **Auth:** Bearer token, Room access.
- **Request:** path `roomId`; query `plansPage`, `resultsPage` (default 1), `pageSize` (default 25, max 100), `asOfUtc`.
- **Response `data`:** plans, results, `asOfUtc`, `nextPlansPage`, `nextResultsPage`. ⚠️ Result DTO fields named: `status, observedIncrementalReceipts, acceptedAmount, method/version, reviewer, scope, window, evidence, qualifications, measuredSubjects, evidenceReferences (max 20), evidenceReferenceCount`. No raw subject inputs.
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Keep the returned `asOfUtc` while following the two `next*Page` cursors independently; history after that anchor is excluded, reversals stay current. Start a fresh first-page fetch to refresh. A reversal overrides the display of its original result while retaining it: never sum both as positive.

### POST /{roomId}/verifications

- **Purpose:** Independent administrator review and deterministic verification after the window.
- **Auth:** Bearer token; an authorized administrator different from the intervention owner, author and source creator.
- **Request:** path `roomId`; body `{ id (new UUID, reuse on transport retry), planId, confounderReview }`.
- **Response:** verification result DTO (see GET). Server reads evidence and computes amounts.
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Needs a completed window and a written review. Only `acceptedAmount` is accepted value; point estimate and exposure delta are not. `PARTIALLY_VERIFIED` shows its qualifications. `VERIFIED` with `acceptedAmount=0` is a resolved condition with no money claim. `UNVERIFIED` and `FAILED` carry no money. A second id for the same cohort/window does not attribute twice. Early review, self-review, foreign or restricted Rooms fail. Monetary evidence requires an explicit `RealizedRevenue` semantic mapping and pinned datasource/query fingerprint; API-entered conversion values and posted orders cannot establish recovery; unreconciled refunds are refused.

### POST /{roomId}/verifications/reverse

- **Purpose:** Append a correction/reversal to an accepted result.
- **Auth:** Bearer token; administrator.
- **Request:** path `roomId` (authoritative); body `{ verificationId, reason }`.
- **Response:** ⚠️ not shown.
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** The original stays readable; the verified balance decreases once; replay does not decrease it again. After reversal the case's `valueAttributions` holds only current entries, while `historicalValueAttributions` and `valueCorrections` retain originals and reasons. A previously verified/closed case returns to resolved and needs fresh verification before closure. The Room is unchanged. Refetch both verification and case views.

### POST /{roomId}/verified-case/close

- **Purpose:** Close only the verified case (not the Room).
- **Auth:** Bearer token; administrator.
- **Request:** path `roomId`; body `{ verificationId, reason }`.
- **Response:** ⚠️ not shown.
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Needs a fresh confirmed measured-zero condition. Missing/stale evidence and reversed results block closure. A `source_condition_review` accepts zero money only after two comparable healthy publications and a fresh resolved-candidate monitor.

### GET /value/verified-threats

- **Purpose:** Verified value balances, one partition per market/currency/lifecycle/value-kind.
- **Auth:** Bearer token; administrator only.
- **Request:** query `after` (cursor).
- **Response `data`:** `{ contractVersion, balances: [], nextCursor }` (real response, 2026-10-11, admin account, no data yet). 100 per page. ⚠️ The list property is `balances`, NOT `partitions` (`get-verified-threat-balances.ts` still says `partitions`: wrong, fix when wiring). ⚠️ Item fields still unseen (list was empty, Scalar has no "Show Schema" toggle): backend ticket needed to document them.
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Follow `nextCursor`. Never build a global FX-less total. Excludes existing stated Room claims. Use for strong value claims only.

## Phase 9: recurrence, lessons, diagnostics

### POST /threats/recurrences

- **Purpose:** Administrator accepts a fresh recurrence of a closed case.
- **Auth:** Bearer token; administrator.
- **Request:** `{ previousCaseId, expectedRevision, reason }`.
- **Response:** new case ID (retry returns the same ID). ⚠️ envelope shape not shown.
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** The previous Room must be closed. Acceptance does not guarantee a Room: evidence, triage, readiness and confirmation gates run again. Old revision or non-admin fails. Case responses gain `episodeNumber` and `previousEpisodeId`; group episodes by `stableFindingId` but navigate and act by case/Room id; never replace an old Room's history with the new episode.

### POST /threats/lessons

- **Purpose:** Propose an outcome-linked lesson from an accepted verification.
- **Auth:** Bearer token; Room owner or administrator.
- **Request:** `{ roomId, verificationId, resolutionPlanId }`.
- **Response:** lesson ID (idempotent on repeat). ⚠️ envelope shape not shown.
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Server loads evidence and procedure. `resolutionPlanId` must match the plan pinned at verification registration (`boundResolutionPlanId`); a different revision is rejected. Older unbound verifications and condition-only/manual procedures return an explanatory failure; do not suggest re-verifying retrospectively. All procedure actions must reference adapter-supported proposals.

### POST /threats/lessons/review

- **Purpose:** Independent review of a proposed lesson.
- **Auth:** Bearer token; administrator who is not the proposer, resolution author, action owner or an excluded intervention author.
- **Request:** `{ lessonId, decision: "PROMOTED" | "REJECTED", reason }`.
- **Response:** ⚠️ not shown.
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.

### POST /threats/lessons/retire

- **Purpose:** Retire a lesson, optionally superseding it.
- **Auth:** Bearer token; administrator with access to the source Room (and the replacement Room when supplied).
- **Request:** `{ lessonId, reason, replacementLessonId: string | null }`.
- **Response:** retirement ID (identical repeat returns the same ID). ⚠️ envelope not shown.
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** The replacement must be a different, currently reusable, same-scope lesson. Retirement does not reverse monetary evidence or erase the original review.

### GET /threats/lessons

- **Purpose:** Administrator lesson review list.
- **Auth:** Bearer token; administrator.
- **Request:** query `page` (default 1); pages of 25, ordered by creation time then ID.
- **Response `data`:** `{ items: [], nextPage: null }` (real response, 2026-10-11, admin account, no lessons yet). ⚠️ Item fields named in the handoff: `evidenceStillValid`, `retirement`, `reusable`, `review.decision`, `outcomeStatus`, `qualifications`; everything else about an item (id, title, procedure) is unseen. Backend ticket needed to document the item.
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Follow `nextPage` until null. `items` excludes Rooms the administrator cannot access. `evidenceStillValid=false` overrides a historical `PROMOTED`. Show retired/superseded status separately from `evidenceStillValid` and `review.decision`; a valid outcome does not mean the procedure remains approved for reuse. `reusable` is false for restricted source Rooms. A promoted lesson is a historical recommendation, not an approved action, guaranteed recovery or new tool. Keep `outcomeStatus` and `qualifications` visible. Backend scans up to 250 candidates, never across scope or restricted-Room boundaries.

### GET /threats/operator-metrics

- **Purpose:** Administrator diagnostics over a completed window.
- **Auth:** Bearer token; administrator.
- **Request:** query `fromUtc`, `toUtc` (completed half-open UTC window, at most 31 days).
- **Response `data`** (real response, 2026-10-11, window 2026-09-11 to 2026-10-11): `{ contractVersion: "1.0", fromUtc, toUtc, triageDecisions: 10, decisionsByResultAndReason: [{ state: "WATCH:LEGACY_SCOPE_REQUIRES_REVIEW", count: 10 }], publications: 1, processedPublications: 1, publicationProcessingP95Seconds: 2.5143687, verificationAttempts: 0, verificationsByStatus: [], acceptedRecurrences: 0, ledgerMovements: [], limitations: [string, ...] }`. `limitations` is backend text meant to be shown with the results. ⚠️ Item shapes of `verificationsByStatus` and `ledgerMovements` still unseen (both empty); ticket needed.
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** More than 2,000 records in any series requires a narrower window. Reversed or oversized windows are rejected. Counts are decisions/attempts, not distinct businesses. `ledgerMovements` includes corrections posted in the window and is not a lifetime balance. Never sum across currencies. No inferred false-positive rate or invented model cost.
