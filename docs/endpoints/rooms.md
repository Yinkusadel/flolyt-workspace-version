# Rooms domain endpoints

Everything under `/api/flolyt/rooms/*`, pasted 2026-09-01 from the Scalar/OpenAPI reference doc
(prose descriptions + example request/response payloads, same source format as [[lifecycle]]'s
corrected pass). Corresponds to the already-built `/rooms` section — see
[[flolyt_rooms_rebuild]] (42 screens, status/outcome-branch architecture) — so every entry below
is a candidate to wire against an existing mocked screen, not a page waiting to be built.

**Status: 52/52 operations documented, service+hook scaffolded for all 52, 0/52 wired into a page.**

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
- **Response `data`:** `{ rooms: [{ id, title, conversationId, grid, stage, stageLabel, condition, conditionLabel, currency, population, amountAtRiskAtOpen, currentAmountAtRisk, ownerMemberId, status, createdAtUtc, archivedAtUtc, openingNumber, isRecovering, outcomeKind, restricted: { reason, restrictedBy, restrictedAtUtc, peopleInside } | null, mergedIntoRoomId, absorbedRoomIds, lastActivityAtUtc, stoppedBecause, isStale }], total, open, recovering, stale, archived, amountBehindStale: [{ currency, amount }] }`.
- **Used by:** service + hook ready (`src/services/api/rooms/get-rooms.ts` / `src/features/rooms/use-get-rooms.ts`), not wired into a page yet — rooms list/index page.
- **Status:** service/hook ready, not wired.
- **Notes:** Open only unless `includeArchived` or an explicit `state` set. `state` values (`open`/`recovering`/`stale`/`archived`) **overlap and don't sum to total** — recovering/stale are both subsets of open. `minAmountAtRisk` compares within each room's own currency, never across — pair with `currency`. `isStale` = untouched 14 days. `stoppedBecause` (`never-assigned`/`owner-left`/`owner-overloaded`/`unknown`) is a real answer, not a gap. `amountBehindStale` is per-currency, never one figure. Each room carries both its opening figure and the live leakage-map figure; the live one is `null` (not stale) when its cell has become unavailable.

### POST /rooms

- **Purpose:** Opens a war room on one cell of the leakage map, snapshotting population/revenue-at-risk so the outcome can later be measured against the same figure.
- **Auth:** Bearer token.
- **Request:** body `{ grid: string, rowKey: string, conditionKey: string, currency: string, title: string | null }`.
- **Response:** `{ data: roomId, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/open-room-on-leakage-cell.ts` / `src/features/rooms/use-open-room-on-leakage-cell.ts`), not wired into a page yet — "open a war room" action from the leakage map.
- **Status:** service/hook ready, not wired.
- **Notes:** Refused on a cell with no figure behind it (fix is connecting the source, not opening a room). If a room is already open on the same coordinate, this joins that one instead of opening a duplicate.

### POST /rooms/{roomId}/close

- **Purpose:** Ends a room against one of five outcomes: money recovered, no action needed, superseded, disproven, unmeasurable.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ kind: string, note, dissent, measurement: RoomMeasurement | null, supersededByRoomId, revisitCondition, unmeasuredReason }` where `RoomMeasurement` = `{ contacted, heldBack, convertedContacted, convertedHeldBack, recovered, currency, excluded, excludedReason, windowStartUtc, windowEndUtc, source, contactedRate, heldBackRate, liftPoints }`.
- **Response `data`:** `{ kind, amountAtOpen, amountAtArchive, delta, currency, populationAtOpen, populationAtArchive, unmeasuredReason, note, measurement, predictions: [falsifier], dissent: [{ wording, by, recordedAtUtc, borneOut }], supersededByRoomId, revisitCondition, measuredAtUtc }`.
- **Used by:** service + hook ready (`src/services/api/rooms/close-room.ts` / `src/features/rooms/use-close-room.ts`), not wired into a page yet — the close-room flow.
- **Status:** service/hook ready, not wired.
- **Notes:** The five outcomes are unordered, no default — a room that looked, found something real, and decided it wasn't worth fixing has still concluded. Claiming "money recovered" requires a held-back group; without one, close is refused and pointed at "unmeasurable." The leak cell is re-read either way — if it no longer exists, the outcome says so rather than reporting the leak as reduced to nothing. Every logged objection carries into the outcome verbatim.

### GET /rooms/{roomId}/decision

- **Purpose:** What the room decided, its revisions, what would change it, and every recorded objection.
- **Auth:** Bearer token.
- **Request:** path `roomId`.
- **Response `data`:** `{ roomId, openingNumber, statement, guardrails, draftedByLabel, decidedByUserId, decidedByLabel, decidedAtUtc, revisions: [{ number, summary, byUserId, byLabel, atUtc }], whatWouldChangeThis: [falsifier], dissent: [{ id, wording, byUserId, byLabel, recordedAtUtc, withdrawn, borneOut, aboutProposalId }] }`.
- **Used by:** service + hook ready (`src/services/api/rooms/get-room-decision.ts` / `src/features/rooms/use-get-room-decision.ts`), not wired into a page yet — decision tab.
- **Status:** service/hook ready, not wired.
- **Notes:** `whatWouldChangeThis` is the room's falsifiers rendered here rather than modelled twice — same list checked automatically at close.

### POST /rooms/{roomId}/decision

- **Purpose:** Writes or revises the decision.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ summary: string, draftedByLabel, guardrails, statement }`.
- **Response:** `{ data: revisionNumber, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/save-room-decision.ts` / `src/features/rooms/use-save-room-decision.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** Revisions are append-only and each must state what it changed. Omitting a section leaves it as-is, doesn't blank it.

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
- **Response `data`:** `{ roomId, conflicts: [{ id, roomId, summary, raisedByLabel, raisedByAgentKey, raisedAtUtc, readings: [{ key, label, recommends, because, evidenceClaimIds, expectedReach, expectedEffect, currency, effectUnavailableBecause, longRunEffect, ... }], waitingOnUserId, escalatedToUserId, escalationReason, escalatedAtUtc, thirdReadings: [{ question, askedByUserId, askedByLabel, askedAtUtc, runId }], chosenReadingKey, resolvedByUserId, resolvedByLabel, resolvedAtUtc, resolutionNote, isResolved, comparableEffect }], open }`.
- **Used by:** service + hook ready (`src/services/api/rooms/get-room-conflicts.ts` / `src/features/rooms/use-get-room-conflicts.ts`), not wired into a page yet — conflicts tab.
- **Status:** service/hook ready, not wired.
- **Notes:** Both readings always returned, resolved or not — the losing one is the record of what was argued, cited when the same leak recurs. `comparableEffect` says whether the two effect figures can be read against each other; when false, one is unpriced or they're in different currencies. A null `expectedEffect` is unpriced, never zero — `effectUnavailableBecause` says why.

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
- **Response `data`:** `{ plays: [{ proposalId, roomId, roomTitle, summary, toolName, reach, effect, currency, figuresAreStated, state, decisionOwnerMemberId, waitingHours, deferredBecause, proposedAtUtc }], pending, done, rejected, deferred, waitingOnPeople }`.
- **Used by:** service + hook ready (`src/services/api/rooms/get-room-plays.ts` / `src/features/rooms/use-get-room-plays.ts`), not wired into a page yet — plays/proposals tab.
- **Status:** service/hook ready, not wired.
- **Notes:** Every row carries who decides, how long it's waited, reach, and value. `reach`/`effect` are stated by the proposer and verified by nothing — `figuresAreStated` must be rendered, since a stated reach read as a checked one is how a play meant for 100k people reaches 5x that.

### GET /rooms/plays

- **Purpose:** Every play across every room, same columns as a single room's board.
- **Auth:** Bearer token.
- **Request:** query `includeDecided` (default true).
- **Response `data`:** same shape as `GET /{roomId}/plays`.
- **Used by:** service + hook ready (`src/services/api/rooms/get-all-plays.ts` / `src/features/rooms/use-get-all-plays.ts`), not wired into a page yet — cross-room plays/proposals dashboard.
- **Status:** service/hook ready, not wired.
- **Notes:** `waitingOnPeople` is how many distinct people the pending plays sit with — surfaces a bottleneck when e.g. 14 plays are waiting and 6 sit with one person.

### POST /rooms/{roomId}/reopen

- **Purpose:** Opens a closed room again, as a second opening of the same room.
- **Auth:** Bearer token.
- **Request:** path `roomId`; body `{ why: string, ownerMemberId: uuid | null }`.
- **Response:** `{ data: openingNumber, messages, succeeded }`.
- **Used by:** service + hook ready (`src/services/api/rooms/reopen-room.ts` / `src/features/rooms/use-reopen-room.ts`), not wired into a page yet — reopen action on a closed/archived room.
- **Status:** service/hook ready, not wired.
- **Notes:** The id doesn't change, so every link ever pasted still resolves. The previous opening is kept whole (its outcome, population, predictions); the working surfaces (log, evidence, decision, plays) start empty. Population is re-read from the cell as it stands now, not carried forward — measuring a second opening against the first one's world measures against nothing real.
