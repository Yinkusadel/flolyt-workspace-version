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
- **Used by:** service + hook ready (`src/services/api/rooms/mark-falsifier-met.ts` / `src/features/rooms/use-mark-falsifier-met.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Idempotent — a second call succeeds without moving the timestamp; when it first fired is the record.

### GET /rooms/{roomId}/log

- **Purpose:** The room's full activity log, oldest first — read as how the room got here, not as a feed.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response `data`:** `{ roomId, roomTitle, totalEntries, humanEntries, agentEntries, systemEntries, entries: [{ occurredAtUtc, actorKind, actorId, actorLabel, action, consequence, dissent }] }`.
- **Used by:** service + hook ready (`src/services/api/rooms/get-room-log.ts` / `src/features/rooms/use-get-room-log.ts`), not wired into a page yet — target is the room's log/history screen.
- **Status:** service/hook ready, not wired.
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
- **Used by:** service + hook ready (`src/services/api/rooms/get-room-evidence.ts` / `src/features/rooms/use-get-room-evidence.ts`), not wired into a page yet — evidence tab.
- **Status:** service/hook ready, not wired.
- **Notes:** Includes what the workspace already believed about this leak, not only what this room learned. `gaps` is derived from insufficient-evidence rows, not hand-written, and counts how many claims one connection would resolve. `window` is pre-rendered text, dash where there is none. `grade` enum includes at least `InsufficientEvidence`.

### POST /rooms/{roomId}/falsifiers

- **Purpose:** Names a condition that would change this room's recommendation, and what it would change it to.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ condition: string, thenWhat: string }`.
- **Response:** `{ data: roomId, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/create-falsifier.ts` / `src/features/rooms/use-create-falsifier.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
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
- **Used by:** service + hook ready (`src/services/api/rooms/update-room-view.ts` / `src/features/rooms/use-update-room-view.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.

### DELETE /rooms/views/{viewId}

- **Purpose:** Removes a saved view.
- **Auth:** Bearer token; author only.
- **Request:** path `viewId`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/delete-room-view.ts` / `src/features/rooms/use-delete-room-view.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Author-only because deleting someone else's would break every link anybody has to it.

### GET /rooms

- **Purpose:** Rooms in this workspace, newest first, filterable — every filter is a query param so a filtered view is a shareable link.
- **Auth:** Bearer token.
- **Request:** query `includeArchived` (default false), `q`, `state`, `currency`, `stage`, `condition`, `owner` (uuid), `minAmountAtRisk` (double).
- **Response `data`:** `{ rooms: [{ id, title, conversationId, grid, stage, stageLabel, condition, conditionLabel, currency, population, amountAtRiskAtOpen, currentAmountAtRisk, ownerMemberId, status, createdAtUtc, archivedAtUtc, openingNumber, isRecovering, outcomeKind, restricted: { reason, restrictedBy, restrictedAtUtc, peopleInside } | null, mergedIntoRoomId, absorbedRoomIds, lastActivityAtUtc, stoppedBecause, isStale, ownerName, agents: [{ key, displayName, role }], pendingDecisions, needsYou }], total, open, recovering, stale, archived, amountBehindStale: [{ currency, amount }] }`.
- **Used by:** service + hook ready (`src/services/api/rooms/get-rooms.ts` / `src/features/rooms/use-get-rooms.ts`), not wired into a page yet — rooms list/index page.
- **Status:** service/hook ready, not wired.
- **Notes:** Open only unless `includeArchived` or an explicit `state` set. `state` values (`open`/`recovering`/`stale`/`archived`) **overlap and don't sum to total** — recovering/stale are both subsets of open. `minAmountAtRisk` compares within each room's own currency, never across — pair with `currency`. `isStale` = untouched 14 days. `stoppedBecause` (`never-assigned`/`owner-left`/`owner-overloaded`/`unknown`) is a real answer, not a gap. `amountBehindStale` is per-currency, never one figure. Each room carries both its opening figure and the live leakage-map figure; the live one is `null` (not stale) when its cell has become unavailable. **Updated 2026-09-08:** each row now also carries what the list draws without a second call — `ownerName` (null when unowned), `agents` (key/displayName/role), `pendingDecisions` (pending plays on the room, counted the way the inbox counts them), `needsYou` (one of them waits on the caller). On a restricted room those four are `null`, `[]`, `0` and `false` — they are the inside of it. **Updated 2026-10-10 (revenue threat Rooms, phase 5):** visible rows also carry nullable `threatConfirmationId` and `systemOpenedBy`. A non-null `threatConfirmationId` marks an automatic opening and is also the investigation ID to pass to `GET /threats/{investigationId}/room-opening`. Restricted rows omit both fields. Not yet typed in `get-rooms.ts`.

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
- **Used by:** service + hook ready (`src/services/api/rooms/get-room-close-preview.ts` / `src/features/rooms/use-get-room-close-preview.ts`), not wired into a page yet — precedes the close-room flow.
- **Status:** service/hook ready, not wired.
- **Notes:** *New endpoint, added 2026-09-08.* The `dissent` listed is exactly what the outcome will snapshot; `predictions` are the falsifiers the outcome will carry — both read by the same code the close uses. `outcomes` lists all five endings with `available: false` and the close's own refusal reason where one applies (e.g. money recovered on a room that said no holdout was possible). `delta` is the leak cell now against the opening figure — **not** a recovery claim; `null` with `deltaUnavailableBecause` when the cell can't be read. `suggestedWindow` places the declared measurement window on the calendar from the first approved play, and says whether it has elapsed. `measurementMustBeSupplied` is `true` today across the board: nothing links plays to campaigns yet, so contacted/held-back/converted counts must be entered rather than computed, and the screen must say so — `computedMeasurement` is the auto-derived figure where `linkedCampaigns` exist, otherwise it's the manual-entry fallback.

### POST /rooms/{roomId}/close

- **Purpose:** Ends a room against one of five outcomes: money recovered, no action needed, superseded, disproven, unmeasurable.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ kind: string, note, dissent, measurement: RoomMeasurement | null, supersededByRoomId, revisitCondition, unmeasuredReason, outstanding: [{ toUserId, description, class, proposedDueAtUtc }] | null }` where `RoomMeasurement` = `{ contacted, heldBack, convertedContacted, convertedHeldBack, recovered, currency, excluded, excludedReason, windowStartUtc, windowEndUtc, source, contactedRate, heldBackRate, liftPoints }`.
- **Response `data`:** `{ kind, amountAtOpen, amountAtArchive, delta, currency, populationAtOpen, populationAtArchive, unmeasuredReason, note, measurement, predictions: [falsifier], dissent: [{ wording, by, recordedAtUtc, borneOut }], supersededByRoomId, revisitCondition, measuredAtUtc }`.
- **Used by:** service + hook ready (`src/services/api/rooms/close-room.ts` / `src/features/rooms/use-close-room.ts`), not wired into a page yet — the close-room flow.
- **Status:** service/hook ready, not wired.
- **Notes:** The five outcomes are unordered, no default — a room that looked, found something real, and decided it wasn't worth fixing has still concluded. Claiming "money recovered" requires a held-back group; without one, close is refused and pointed at "unmeasurable." The leak cell is re-read either way — if it no longer exists, the outcome says so rather than reporting the leak as reduced to nothing. Every logged objection carries into the outcome verbatim. **Updated 2026-09-08:** request body gained `outstanding` — a list of follow-up items to hand off out of the room on close, each `{ toUserId, description, class ("other" seen as a value so `class` is likely an open/enum string, proposedDueAtUtc }`.

### GET /rooms/{roomId}/decision

- **Purpose:** What the room decided, its revisions, what would change it, and every recorded objection.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response `data`:** `{ roomId, openingNumber, statement, guardrails, draftedByLabel, decidedByUserId, decidedByLabel, decidedAtUtc, revisions: [{ number, summary, byUserId, byLabel, atUtc }], whatWouldChangeThis: [falsifier], dissent: [{ id, wording, byUserId, byLabel, recordedAtUtc, withdrawn, borneOut, aboutProposalId }], recipients: [{ userId, what, class }] }`.
- **Used by:** service + hook ready (`src/services/api/rooms/get-room-decision.ts` / `src/features/rooms/use-get-room-decision.ts`), not wired into a page yet — decision tab.
- **Status:** service/hook ready, not wired.
- **Notes:** `whatWouldChangeThis` is the room's falsifiers rendered here rather than modelled twice — same list checked automatically at close. **Updated 2026-09-08:** response gained `recipients` — who the decision goes to and what they specifically get told (`what`) plus a `class` grouping.

### POST /rooms/{roomId}/decision

- **Purpose:** Writes or revises the decision.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ summary: string, draftedByLabel, guardrails, statement, recipients: [{ userId, what, class }] | null }`.
- **Response:** `{ data: revisionNumber, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/save-room-decision.ts` / `src/features/rooms/use-save-room-decision.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Revisions are append-only and each must state what it changed. Omitting a section leaves it as-is, doesn't blank it. **Updated 2026-09-08:** request body gained `recipients` — same shape as the GET response, so a revision can set who this decision is being sent to and what they're told.

### POST /rooms/{roomId}/decision/decide

- **Purpose:** Marks the decision made — by whom, when.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ summary: string, statement }`.
- **Response:** `{ data: revisionNumber, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/decide-room-decision.ts` / `src/features/rooms/use-decide-room-decision.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Deciding resolves nothing — recorded dissent stays exactly as it was. Only the eventual close-result settles an objection.

### POST /rooms/{roomId}/decision/dissent

- **Purpose:** Records an objection to the decision.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ wording: string, aboutProposalId: uuid | null }`.
- **Response:** `{ data: dissentId, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/create-dissent.ts` / `src/features/rooms/use-create-dissent.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Does NOT block the decision and nothing tallies it — rooms aren't democracies, no threshold. Stays attached permanently, checked at close, withdrawable only by its author.

### DELETE /rooms/dissent/{dissentId}

- **Purpose:** Author withdraws their own objection.
- **Auth:** Bearer token; author only (not the decision owner, not an admin).
- **Request:** path `dissentId`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/withdraw-dissent.ts` / `src/features/rooms/use-withdraw-dissent.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** A state change, not a delete — wording stays, marked withdrawn, so "permanent" and "withdrawable" stay compatible.

### POST /rooms/dissent/{dissentId}/judge

- **Purpose:** Records whether the eventual result bore an objection out.
- **Auth:** Bearer token.
- **Request:** path `dissentId`; body `{ borneOut: boolean }`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/judge-dissent.ts` / `src/features/rooms/use-judge-dissent.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Null until judged — "unjudged" and "shown-to-be-wrong" are different, and the second is the useful state.

### GET /rooms/dissent

- **Purpose:** Every objection across every room the caller can see, newest first.
- **Auth:** Bearer token.
- **Request:** query `includeWithdrawn` (default false), `take` (int32, default 50).
- **Response `data`:** `{ dissent: [{ id, wording, roomId, roomTitle, byUserId, byLabel, recordedAtUtc, roomStatus, withdrawn, borneOut }], returned, truncated }`.
- **Used by:** service + hook ready (`src/services/api/rooms/get-all-dissent.ts` / `src/features/rooms/use-get-all-dissent.ts`), not wired into a page yet — a cross-room dissent register screen.
- **Status:** service/hook ready, not wired.
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
- **Used by:** service + hook ready (`src/services/api/rooms/create-conflict.ts` / `src/features/rooms/use-create-conflict.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
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
- **Used by:** service + hook ready (`src/services/api/rooms/get-convening-proposals.ts` / `src/features/rooms/use-get-convening-proposals.ts`), not wired into a page yet — this is the convening/proposals inbox, not yet an identified screen in the built 42.
- **Status:** service/hook ready, not wired.
- **Notes:** *New endpoint, added 2026-09-08.* Three lists and `withheld` is not an appendix — `waiting` needs a decision, `decided` is history, `withheld` is signals that mapped to a condition and then couldn't proceed (a missing source behind the cell, no owner on the stage, the weekly cap, or a room already open). A workspace seeing only proposals can't tell a quiet week from one where every detection died on a missing source, and those call for opposite responses. `raisedThisWeek` against `weeklyCap` is sent so a queue gone quiet because it hit its cap doesn't read as nothing happening.

### POST /rooms/convening/{proposalId}/accept

- **Purpose:** Opens the suggested room.
- **Auth:** Bearer token.
- **Request:** path `proposalId`.
- **Response:** `{ data: roomId, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/accept-convening-proposal.ts` / `src/features/rooms/use-accept-convening-proposal.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** *New endpoint, added 2026-09-08.* Any member may accept — the proposal already chose an owner from stage ownership, and requiring that one specific person would leave the queue sitting while they're away. Accepting doesn't make the accepter accountable — the room opens in the named owner's name. **Can refuse:** the leakage map moves every fifteen minutes and a proposal can sit for days, so the cell is re-read and a room isn't opened on a figure that's since gone.

### POST /rooms/convening/{proposalId}/decline

- **Purpose:** Declines the suggested room.
- **Auth:** Bearer token.
- **Request:** path `proposalId`; body `{ why: string }` (required).
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/decline-convening-proposal.ts` / `src/features/rooms/use-decline-convening-proposal.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** *New endpoint, added 2026-09-08.* The decline is kept, not deleted — a category declined every time is a row in the map that shouldn't be there, and that's only legible if the declines survive with their reasons. Nothing is suggested twice — one proposal per detector fingerprint, ever.

### GET /rooms/{roomId}/guardrails

- **Purpose:** What this room may not do, and what that has already prevented.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response `data`:** `{ roomId, guardrails: [{ label, setting, appliesToThisRoomOnly, setBy, setByLabel, overridable, overrideNote, key, setAtUtc }], stopped: [{ guardrail, whatWasStopped, affected, whatHappenedInstead }], stopsComputedFrom, stopsAbsentBecause, sendTimeStopsAvailable }`.
- **Used by:** service + hook ready (`src/services/api/rooms/get-room-guardrails.ts` / `src/features/rooms/use-get-room-guardrails.ts`), not wired into a page yet — guardrails tab/section.
- **Status:** service/hook ready, not wired.
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
- **Used by:** service + hook ready (`src/services/api/rooms/get-room-runs.ts` / `src/features/rooms/use-get-room-runs.ts`), not wired into a page yet — runs/activity tab.
- **Status:** service/hook ready, not wired.
- **Notes:** *New endpoint, added 2026-09-08.* A failed run is a row like any other — not hidden, not a banner: its cause is named (e.g. `"COGS source missing"`), which makes it fixable, and the room keeps working with one agent blind. Don't sort by severity or lift failures into their own section. `agents` is the room's roster with a state each, since "idle" is an agent with nothing in flight rather than a run, and a table of runs alone can't show it. States are the kit's seven plus `awaiting-approval`, a run parked on a person rather than a machine — folding that into `queued` would make one word mean both "waiting for a machine" and "waiting for you." `rowsReadAvailable` is always false — nothing counts rows an agent read, sent so a client renders "unavailable" rather than a zero. `waitingOn` is usually null — runs don't depend on other runs in this system, so the kit's "waits on run X" concept isn't reproduced rather than being faked.

### POST /rooms/{roomId}/agents

- **Purpose:** Puts an agent in the room.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ agentKey: string, role: string, whatItWillDo: string, reads: string[] | null }`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/add-room-agent.ts` / `src/features/rooms/use-add-room-agent.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
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
- **Used by:** service + hook ready (`src/services/api/rooms/get-merge-candidates.ts` / `src/features/rooms/use-get-merge-candidates.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
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
- **Used by:** service + hook ready (`src/services/api/rooms/get-room-subscriptions.ts` / `src/features/rooms/use-get-room-subscriptions.ts`), not wired into a page yet — likely a workload/subscriptions screen, possibly a manager view.
- **Status:** service/hook ready, not wired.
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
- **Used by:** service + hook ready (`src/services/api/rooms/set-room-notify-level.ts` / `src/features/rooms/use-set-room-notify-level.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Muting a room you own is refused — that's resigning from it, and somebody has to take it (reassign first).

### POST /rooms/{roomId}/unwatch

- **Purpose:** Stop watching a room.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/unwatch-room.ts` / `src/features/rooms/use-unwatch-room.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
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
- **Used by:** service + hook ready (`src/services/api/rooms/get-room-cohort.ts` / `src/features/rooms/use-get-room-cohort.ts`), not wired into a page yet — cohort tab.
- **Status:** service/hook ready, not wired.
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
- **Used by:** service + hook ready (`src/services/api/rooms/add-room-person.ts` / `src/features/rooms/use-add-room-person.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** The widest of the available options and should be presented as such — they'll see evidence, decision, plays, and every customer in the cohort. If someone should see the finding but not the customers, that's a handoff or read-only view, not membership.

### PUT /rooms/{roomId}/people/{userId}

- **Purpose:** Changes a member's role and their largest approvable play.
- **Auth:** Bearer token.
- **Request:** path `roomId`, `userId`; body `{ role: string, maxApprovalReach: int32 | null }`.
- **Response:** `{ data: memberCount, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/update-room-person.ts` / `src/features/rooms/use-update-room-person.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
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
- **Used by:** service + hook ready (`src/services/api/rooms/get-room-plays.ts` / `src/features/rooms/use-get-room-plays.ts`), not wired into a page yet — plays/proposals tab.
- **Status:** service/hook ready, not wired.
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
- **Used by:** service + hook ready (`src/services/api/rooms/reopen-room.ts` / `src/features/rooms/use-reopen-room.ts`), not wired into a page yet — reopen action on a closed/archived room.
- **Status:** service/hook ready, not wired.
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
(investigation controls) and `/rooms/settings/investigations` (investigation settings).

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
- **Response `data`:** 100 partitions per page plus `nextCursor`. ⚠️ Partition fields not shown (DTO, not entity).
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
- **Response `data`:** `{ items, nextPage }`. ⚠️ Item fields named: `evidenceStillValid`, `retirement`, `reusable`, `review.decision`, `outcomeStatus`, `qualifications`.
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Follow `nextPage` until null. `items` excludes Rooms the administrator cannot access. `evidenceStillValid=false` overrides a historical `PROMOTED`. Show retired/superseded status separately from `evidenceStillValid` and `review.decision`; a valid outcome does not mean the procedure remains approved for reuse. `reusable` is false for restricted source Rooms. A promoted lesson is a historical recommendation, not an approved action, guaranteed recovery or new tool. Keep `outcomeStatus` and `qualifications` visible. Backend scans up to 250 candidates, never across scope or restricted-Room boundaries.

### GET /threats/operator-metrics

- **Purpose:** Administrator diagnostics over a completed window.
- **Auth:** Bearer token; administrator.
- **Request:** query `fromUtc`, `toUtc` (completed half-open UTC window, at most 31 days).
- **Response `data`:** ⚠️ not shown beyond `ledgerMovements` and per-currency series.
- **Used by:** service + hook ready, not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** More than 2,000 records in any series requires a narrower window. Reversed or oversized windows are rejected. Counts are decisions/attempts, not distinct businesses. `ledgerMovements` includes corrections posted in the window and is not a lifetime balance. Never sum across currencies. No inferred false-positive rate or invented model cost.
