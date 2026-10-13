# Revenue threat Room opening: Phase 5 frontend handoff

## Direct Room loading (live collaboration Phase 1)

Room details and the live feed require an unarchived conversation. Independent archiving is blocked
while its Room is open. See [archive consistency and targeted repair](room-conversation-archive-repair.md)
for the confirmed historical incident, reopening/adoption behavior and API acceptance.

Use `GET /api/v3/rooms/{roomId}` when opening a Room from a link, invitation or investigation card.
The standard result wrapper contains `id`, `title`, `conversationId`, `status`, `ownerMemberId`,
nullable `viewerRole`, timestamps, `stage`, `mechanism`, `currency`, nullable `market` and
`lifecycleClass`, `leadAgentKey`, `agents`, `mergedIntoRoomId` and `conversationPermissions`.
These core metadata fields do not establish verified financial outcomes. Header exposure fields
are described below.

### Room header fields (issue #52)

The single-Room `data` now also contains the following fields, using the same projection as an
authorized `GET /api/v3/rooms` list item. The list retains its existing values and structure,
with only the requested additive `restrictedByName` field on restriction descriptors.

| Field | JSON type | Meaning |
| --- | --- | --- |
| `population` | integer | Population recorded for the current opening; its business grain is defined by the Room. |
| `amountAtRiskAtOpen` | number | Opening exposure in the Room's currency. Matches the existing non-nullable list field. |
| `currentAmountAtRisk` | number or null | Available current leakage-cell exposure; never substitutes the opening amount. |
| `currentAmountComputedAtUtc` | date-time or null | Computation time of the available current cell; null when current exposure is unavailable. |
| `ownerName` | string or null | Owner's full name, falling back to email; null if the owner cannot be resolved or is unassigned. |
| `stageLabel` | string | Stored stage label, matching the list. |
| `conditionLabel` | string | Known condition's display label, otherwise its stored key. |
| `openingNumber` | integer | Current opening number. |
| `isRecovering` | boolean | Open Room with a previous closing/opening history; not a claim of recovered revenue. |
| `threatConfirmationId` | UUID or null | Existing confirmation identity used to select threat investigation tabs. |
| `systemOpenedBy` | string or null | System opening attribution used for the "Opened by Flolyt" chip. |
| `restricted` | object or null | Same redaction semantics as the list; successful details reads return null. |

The restriction descriptor on a redacted list item and on `GET /api/v3/rooms/{roomId}/people`
has this shape (illustrative values):

```json
{
  "reason": "pricing-before-announcement",
  "restrictedBy": "01234567-89ab-cdef-0123-456789abcdef",
  "restrictedAtUtc": "2026-10-12T09:00:00Z",
  "peopleInside": 3,
  "restrictedByName": "Chad Sado"
}
```

Use `restrictedByName` for display and retain `restrictedBy` for identity. Full name falls back
to email; a missing/deleted user yields null, so render a neutral "Unknown person" label rather
than exposing an ID. Restriction actor names are resolved from current user records, including
historical actors; they are not frozen into the Room document. Authorized list/detail header rows
still return `restricted: null`, even when the Room has a restriction. Use the authorized people
response for restriction metadata inside the Room. An excluded viewer still gets 404 from details;
the added fields never bypass Room or conversation access checks.

Frontend acceptance: compare all header fields between the list item and details for the same
Room without intervening updates. A missing/unavailable current measurement must return both
current amount and computation time as null. Test a system-opened Room, a reopened Room, a
restricted Room as an allowed viewer and an excluded viewer, and missing actor names. Monetary
exposure remains per currency and does not establish a verified financial outcome.

Backend validation: the API build passed, along with 56 API/OpenAPI/Room stream checks and
68 PostgreSQL Room/header/index/people/lifecycle regressions. Header parity includes available,
missing and unavailable current measurements, automatic Room attribution, owner name fallbacks,
restriction actor names and denied access. No frontend deployment or live UI acceptance has run.

Load the collaboration history with `GET /api/v3/conversations/{conversationId}`. Continue to use
`POST /api/v3/conversations/messages` with that same ID for replies. The permission flags
`canView`, `canContribute` and `canAdminister` refer only to the conversation. They do not grant
proposal approval, Room management or tool execution; backend checks still apply to each action.
Missing, foreign and inaccessible Rooms return 404 with `Room not found.`. A restricted Room
may remain discoverable in the index while its details and thread are inaccessible.

The briefing remains the investigation summary; use its existing route and the dedicated plan,
evidence and verification reads for those tabs. The Room-wide SSE subscription is specified below.
See [Room live collaboration plan](room-live-collaboration-plan.md) for the review phases.

## Room-wide live feed (live collaboration Phase 2)

For the complete React/Vite integration sequence, tested reference reducer and Postman/deployment
acceptance matrix, see [Room live collaboration frontend handoff](room-live-collaboration-frontend-handoff.md).

Keep `GET /api/v3/rooms/{roomId}/stream` connected while viewing a Room. Use the usual bearer
authentication and `Accept: text/event-stream`. This subscription carries every participant's
committed public messages and concurrent agent events. It stays connected when Maestro or a
specialist finishes, and can deliver later work without another POST or reload. Existing POST
message and per-run streams remain compatible; opening this feed does not enqueue any agent work.

Bootstrap with Room details and conversation history, then connect with `after=0` and reconcile
the replay. Persisted history rows now have `messageId`. Do not append a second message when its ID
already exists. This deliberately overlapping bootstrap avoids losing a message committed between
the history read and subscription. On reconnect, send `Last-Event-ID` from the last event you
successfully applied, or its value as `after`. Never advance to `room_stream_ready.head`: it may
include events you have not received. A cursor from another conversation or ahead of the current
journal returns 400; missing/foreign/inaccessible Rooms return 404 before starting SSE.

Example frame:

```text
id: 0123456789abcdef0123456789abcdef:42
event: response_chunk
data: {"sequence":42,"eventId":"0123456789abcdef0123456789abcdef:42","eventType":"response_chunk","conversationId":"01234567-89ab-cdef-0123-456789abcdef","runId":"01234567-89ab-cdef-0123-456789abcdee","agentKey":"sentinel","agentLabel":"Sentinel","atUtc":"2026-10-11T09:00:00Z","data":{"eventType":"response_chunk","phase":"streaming","message":"**Main finding** ...","runId":"01234567-89ab-cdef-0123-456789abcdee","agentKey":"sentinel","agentLabel":"Sentinel"}}
```

The Room feed wraps runtime events in a durable envelope; it does not have the flattened wire
shape of the POST message stream. Read runtime payloads through `data.payload`, text through
`data.message`, and final structured responses directly from `data.payload` on `final_response`.

| Event | Rendering |
| --- | --- |
| `room_stream_ready` | Transport ready; contains Room/conversation IDs and current journal head, no replay cursor. |
| `message_committed` | Upsert by `data.messageId`; authoritative role/content/timestamp/structured response/run/author. Replace the provisional answer for that run. |
| `steering_updated` | Upsert by `data.messageId`; display steering text and queued/delivered/not-delivered receipt. |
| `run_state` | Update only the named run. `Queued`, `Running`, `AwaitingApproval`, `Done`, `Failed`, `Cancelled`. |
| `stream_delivery_gap` | Some live updates were unavailable for this run. Keep watching for the authoritative committed answer; do not resend the prompt or treat this as an agent failure. |
| `agent_handoff` | Upsert the card by target run ID. A reconciled handoff has direct `data.targetRunId`; a runtime handoff has `data.payload.targetRunId`. |
| `run_started`, `progress`, `response_chunk`, `final_response`, `error`, `run_cancelled` | Route to the provisional message/activity for the envelope's run and agent. Never mark the whole Room finished. |
| `room_heartbeat` | Keep connection alive; no message or cursor change. |
| `room_access_revoked` | Stop rendering/reading; clear protected Room state and require authorized reload. |

Deduplicate durable `eventId` on replay. Keep a separate draft/buffer for each `runId` so concurrent
Sentinel/RIA output cannot concatenate into one answer. A final-response event and a later committed
assistant message describe the same answer; the committed message wins. If using the initiating
POST stream as well, reconcile its output by run ID rather than displaying both copies. Handoffs
may be observed from both lifecycle reconciliation and the existing runtime producer; upsert cards.

Database polling is server-side (one-second idle cadence); clients receive SSE continuously. Viewers
read immutable pages; recovery scans are shared and throttled per conversation across instances,
and do not wait for a busy writer. Journal outages do not fail agent execution: an explicit
`stream_delivery_gap` and the committed transcript recover the answer, although lost incremental
chunks cannot be recreated. Live and recovered handoff text uses the same safe limits as history.
Replay is bounded to 100 events per read, with immediate catch-up. History/system rows exclude internal
tool/context messages. Disconnects, slow readers and membership revocation never cancel durable
agent work. No new SignalR dependency is required by the frontend. Older runtime chunks emitted
before this deployment cannot be reconstructed; their committed responses remain available.

Postman check: open this GET in one tab, POST a teammate message or a Sentinel/RIA delegation in
another, and observe message/activity/chunk/final events without the GET closing. Repeat with two
viewers. Disconnect, post again, then reconnect using the last applied event ID and verify replay.
Remove membership/Room access while watching: expect `room_access_revoked` and closure. The Phase 3
handoff supplies the frontend integration and deployment acceptance matrix.

Postman: fetch Room details using an active member's token, copy `data.conversationId`, then fetch
that conversation and send a message into it. Confirm a different workspace, removed membership,
private conversation or excluded restricted-Room viewer cannot fetch the details. Repeated GETs
must not enqueue agent runs or open new Rooms.

Automatic Rooms use the existing Room, inbox and conversation surfaces. Do not build a second conversation or trigger another investigation to render the opening.

## V3 route migration

Room routes now live exclusively under `/api/v3/rooms` and appear in the V3 Scalar/OpenAPI document. Update previous `/api/flolyt/rooms` calls to this prefix. Threat routes use `/api/v3/rooms/threats`; verified balances use `/api/v3/rooms/value/verified-threats`. Investigation controls use `/api/v3/rooms/{roomId}/investigation`, and investigation settings use `/api/v3/rooms/settings/investigations`. Previous registrations are removed. Request bodies, response contracts and access checks are preserved. Inbox, proposal and conversation APIs keep their current routes.

## Discovery and opening state

GET /api/v3/rooms adds nullable threatConfirmationId and systemOpenedBy on visible Room rows. Existing clients remain compatible. A non-null threatConfirmationId identifies an automatic opening and is also the investigation ID for the current confirmation policy. Restricted rows omit these fields.

GET /api/v3/rooms/threats/{investigationId}/room-opening uses the existing result wrapper and requires active workspace membership. Missing/foreign/restricted openings return 404. Its data contains:

| Field | Render/use |
|---|---|
| state | PENDING, READY, PENDING_HUMAN_ROUTING, PENDING_LEGACY_REVIEW, BLOCKED or PAUSED |
| reason | Explain why work is pending; do not show a ready collaboration Room before READY |
| roomId / conversationId | Navigate using existing Room and conversation routes |
| systemActor | Attribute automatic opening to Flolyt orchestration, not the assigned person |
| routingReason | Audited ownership rule/fallback; useful in details, not the main answer |
| baseline | Immutable opening evidence and scoped gross/expected/net estimates |
| plan | DRAFT next steps; these are proposed work, not approved or executed actions |

Pending openings are not a new global user-facing inbox in this phase. Operators obtain their investigation IDs from the existing triage/confirmation audit. A Room row supplies the ID once ready.

## Rendering

Show a concise automatic-opening card and the existing specialist roster. The selected specialist leads; Maestro coordinates. Load the existing conversationId: it already contains a brief system synthesis saved atomically with the Room. It is a status message, not an assistant answer requiring suggested follow-up prompts. Continue normal user/agent interaction in that thread.

Display all baseline amounts with their currency, market and lifecycle. Label them estimated exposure. Do not subtract Opportunity, combine currencies, label findings as customers/accounts, or turn reduced exposure into verified recovered/preserved value. baseline.calculations retains individual calculation ranges where available. rangeAvailability=PER_CANDIDATE_NOT_AGGREGATED does not authorize summing intervals; NOT_AVAILABLE means no supported range is supplied. The baseline never changes when a later refresh arrives.

The existing inbox invitation carries the Room attachment and the expected human role. Render it through the existing inbox flow. One delivery intent creates one message, even after retries. This phase does not introduce a new SSE event, email notification or model response at opening; existing conversation streaming is used when subsequent turns run.

No frontend change is required for the backend to create Rooms and invitations. The optional opening-state card, attribution and baseline details require consuming these additive fields. Full typed resolution plans and multiplayer routing are Phase 6 work.

Legacy Room actions may return a scope-reconciliation message when confirmed work already covers the same mechanism and currency. Show that message; do not automatically join an arbitrary Room. Legacy cells cannot distinguish geographic markets or business units. Different currencies are evaluated independently.

## Phase 6: collaboration and resolution

### Typed plans

- GET /api/v3/rooms/{roomId}/resolution-plan returns contractVersion 1.0, revision, plan and live action statuses.
- PUT the same route revises the plan. Supply expectedRevision from GET. A stale revision fails; reload before editing.
- New automatic Rooms start at revision 1. Existing Phase 5 Rooms without a typed plan return revision 0; their owner can create the first typed revision. The original opening draft remains historical.
- Only an active Room owner or workspace administrator with Room access may revise. Restricted and foreign Rooms are not exposed. Each action owner must be active and have Room access.

Example PUT body (replace the owner id with an active workspace member):

~~~json
{
  "expectedRevision": 1,
  "diagnosis": "Account activity declined; the causal driver still needs validation.",
  "objective": "Identify the cause and propose a scoped intervention.",
  "successCriteria": "Improve comparable account activity while preserving source quality.",
  "verificationPlan": "Independently compare the same scope and time windows before claiming revenue value.",
  "actions": [{
    "id": "review_evidence",
    "kind": "HUMAN_ACTION",
    "description": "Review the pinned evidence with the lead specialist.",
    "ownerId": "00000000-0000-0000-0000-000000000001",
    "expectedCompletionUtc": "2026-10-15T12:00:00Z",
    "successCriterion": "Record the supported cause, uncertainty and next action.",
    "dependsOn": []
  }]
}
~~~

Supported kinds: HUMAN_ACTION, AGENT_PROPOSAL, TOOL_ACTION, DATA_REMEDIATION, WAIT_AND_MONITOR. Dependencies reference action ids in the same revision and must be acyclic. AGENT_PROPOSAL and TOOL_ACTION require proposalId; it must reference an existing proposal in this Room's conversation. Optional obligationId must belong to this Room and action owner. Create and decide proposals/obligations through their existing APIs. Plan dependencies describe intended sequencing; revising a plan does not approve proposals or change the existing execution workflow.

Render proposalState and obligationState from the live action-status rows. Do not derive approval/completion from an action description or a plan revision. ownerAvailable=false or referencesAvailable=false means the plan needs review. Each revision remains a separate immutable record. No plan value is verified preserved/recovered revenue. The opening baseline is unchanged.

### Messages and streaming

Use POST /api/v3/conversations/messages with the existing Room conversationId and an explicit replyMode:

The composer preference is persisted per authenticated user and conversation. On opening a conversation, call `GET /api/v3/conversations/{conversationId}/preferences`; its result envelope contains `data: { "replyMode": "auto" }` when unset. When the user changes the toggle, call `PUT` on the same URL with `{ "replyMode": "auto" }` or `{ "replyMode": "none" }`; success returns the saved value. No user ID is accepted. Other users' choices are independent, and shared conversation permissions do not expose their preferences. Missing, archived, foreign-workspace or inaccessible conversations return 404; invalid modes return 400.

Continue sending the composer's current `replyMode` explicitly with every message. The preference is a UI default, not a routing override: omitted message mode still defaults to `auto`. Saving a preference creates no message, run or inbox notification. Existing human-only message restrictions remain: `none` sends are supported only for Room conversations. For a new conversation, use `auto` until a conversation ID exists. On a failed preference load, retain the safe `auto` default; do not treat that failure as permission to send to an inaccessible thread. If saving fails, show that it was not saved across devices. Concurrent saves by the same user use the last committed value.

API acceptance for composer preferences:

1. As user A, GET preferences on an accessible Room conversation: expect 200 with `data.replyMode = auto`.
2. PUT `{ "replyMode": "none" }`, then GET using a new session/device with user A's credentials: expect `none`.
3. As user B, GET the same conversation's preferences: expect `auto` unless B has saved a choice. A's preference stays unchanged when B saves theirs.
4. Send a message explicitly using `none`: expect the existing human-only save. Send one using `auto`: expect normal agent routing, regardless of the saved choice.
5. PUT an invalid or null mode: expect 400. GET/PUT a missing, archived, foreign-workspace or restricted inaccessible conversation: expect 404. Check that saving preferences added no transcript messages or agent runs.

~~~json
{ "conversationId": "<room-conversation-id>", "message": "What should we investigate first?", "replyMode": "auto" }
~~~

With Accept: text/event-stream, the normal durable run stream is used. run_queued includes the selected agentKey and runId. Responses and specialist handoffs remain in this conversation; existing multiplexing and GET /api/v3/runs/{runId}/stream reconnect apply. Disconnecting a reader does not cancel work. Never create another conversation or restart the message merely to reconnect.

All JSON message requests now use the same durable routing as SSE, including requests without replyMode or agentKey (replyMode defaults to auto). JSON returns 202 plus runId, conversationId, agentKey and routingReason when a run starts. Follow the existing run endpoints for status/stream. Frontend clients expecting a completed JSON answer must instead consume the returned run; no-reply requests still return 200.

Routing uses one seat: an explicit stored mention @[agent:<key>] first, then explicit agentKey, then a relevant eligible rostered supporter based on pack-declared intents, otherwise the Room lead. Multiple agent mentions require selecting one responder. Unknown, off-roster or disabled agents are refused. Selecting an agent does not add it to the roster or grant it authority. Existing run/tool authorization and approval checks remain authoritative.

For human coordination:

~~~json
{ "conversationId": "<room-conversation-id>", "message": "I will review the evidence tomorrow.", "replyMode": "none" }
~~~

The message is saved with no AgentRun or model call. SSE emits message_saved and ends; JSON returns 200 without a runId (null fields are omitted). Do not show an AI typing indicator or await final_response. GET conversation history includes authorUserId and authorName for newly saved human messages. Old messages without author metadata remain unattributed. Refresh the shared timeline after message_saved; it is not a synthetic assistant response.

Person labels: `GET /api/v3/rooms/{roomId}/people` adds nullable `displayName` to every `people[]` row. Conversation message and steering `authorName` resolves the same workspace full name for all viewers, including the author. Missing, blank or other-workspace profiles resolve to null; do not show an ID or assume an email is a person's name. Existing IDs, roles and ordering are unchanged.

Human mentions: show `@Ada Lovelace` as a chip, but send `@[human:<userId>]` in the message text (for example `Please review this, @[human:aaaaaaaa-0000-0000-0000-000000000001].`). Select the person from the workspace roster or Room people and retain the ID separately from the display label. Plain `@Ada Lovelace`, emails and usernames are not parsed mentions. The server parses the body and queues notifications for eligible workspace people; self-mentions and people outside a restricted Room are skipped. Mentioning somebody does not invite them or grant access. Agent mentions use `@[agent:<key>]` and follow the responder routing rules above.

### Postman acceptance checks

1. Open a confirmed threat Room and read its typed plan. Revise with the current expectedRevision; GET shows the next revision. Reusing the old revision must fail.
2. Try a foreign proposal, an owner without Room access, an unknown dependency or a cycle. No revision should be created.
3. Link a pending proposal in this Room. It must remain pending until its existing approval API accepts it; editing the plan must not execute tools.
4. Send replyMode=auto with SSE. Confirm the selected lead/supporter appears on run_queued and responds in the same conversation.
5. Address a rostered specialist using its stored mention. Confirm one selected run. Try an off-roster/disabled agent and confirm refusal.
6. Send replyMode=none. Confirm message_saved, no run, no final_response, and a human-authored message in GET conversation history.
7. Revoke the user's workspace membership or Room access and retry reads/writes. They must be refused. Reconnect an AI run through its stream endpoint without resending the prompt.

Phase 6 review corrections: resolution-plan action status includes obligationOwnerMismatch. When true, referencesAvailable is false; show that the linked obligation was reassigned and the plan needs revision. The historical action owner remains unchanged. Agent discussion context includes every validated action, its dependencies and its full success criterion; no later actions are silently omitted.

## Phase 7: continuous monitoring

GET /api/v3/rooms/{roomId}/threat-monitoring returns a versioned projection with state, reason, revision, notifiedRevision, currentExpectedLoss, changeFromOpening, currency, market, lifecycleClass, checkedAtUtc, pendingState/pendingReadings and the latest 20 immutable updates. It requires an active workspace member with access to the Room. Missing/foreign/restricted Rooms return 404.

Keep the opening baseline separate. Render changeFromOpening as a signed exposure change, never preserved/recovered revenue. DATA_DEGRADED amounts are unknown (null), not zero. Show pendingState as awaiting confirmation when it differs from the accepted state. RESOLVED_CANDIDATE still needs independent verification; it does not close the Room.

Updates are concise system messages in the existing conversation and entries in the Room log. Refresh monitoring/conversation history while viewing the Room to discover background updates; this phase does not add a background SSE subscription. Existing agent SSE remains unchanged. Worsening/degradation notifications are delivered through the existing workspace-message workflow after access revalidation.

### API verification

1. Open an automatically confirmed threat Room and GET its threat-monitoring endpoint. Record its Room/conversation IDs and opening baseline. New Rooms are enrolled automatically; existing baselines are discovered by the bounded sweep.
2. Publish a newer Leakage V2 snapshot through the existing compute flow with comparable scope, cohort, horizon and calculation policy. Use currency-specific policy thresholds and sufficiently fresh source evidence. Allow the publication consumer and monitoring workers to run.
3. Increase expected exposure materially (for example NGN 5m to NGN 8m). After the configured cooldown, expect WORSENED, +NGN 3m from opening, one system update in the same conversation, and the original NGN 5m baseline unchanged. Re-reading/retrying must not duplicate updates or Rooms.
4. Publish improvement twice with distinct revisions. Before the second reading, it remains pending confirmation; cooldown coalesces notifications. No verified revenue should appear.
5. Let evidence exceed MaximumAgeHours without publishing, or publish missing/unpriced/incompatible evidence. Expect DATA_DEGRADED and null change amounts, never a resolved case or fabricated zero.
6. Test with a removed member or another workspace: monitoring data must not be visible. Close the Room: the next monitoring check stops its schedule.

Configuration reuses RevenueIntelligence threat triage currency materiality, RelativeMaterialIncrease, CooldownMinutes, MaximumAgeHours and evidence-quality thresholds. No new tenant allowlist is required. Monitoring itself does not invoke an LLM; enabled re-investigation still follows the existing assessment rollout and governance policy.

Phase 7 review clarification: a resolution candidate requires two distinct comparable published readings backed by successful measurement, not merely an empty map. Missing/stale data, changed physical sources, changed populations or calculation semantics produce `DATA_DEGRADED`. Notification-policy changes do not invalidate the opening baseline. Old snapshots without population proof cannot support a measured-zero resolution. The API response shape is unchanged by these fixes.

## Phase 8: verification and independently accepted value

The existing monitoring response is unchanged. Add a separate verification panel. Exposure reduction must never render as verified preserved/recovered revenue.

Routes (existing authenticated Room route family):

| Method | Route | Purpose |
|---|---|---|
| POST | /api/v3/rooms/{roomId}/verification-plans | Preregister method and future measurement window as owner/admin. |
| GET | /api/v3/rooms/{roomId}/verifications | Paged plans and results, with matching append-only reversals. |
| POST | /api/v3/rooms/{roomId}/verifications | Independent administrator review and deterministic verification after the window. |
| POST | /api/v3/rooms/{roomId}/verifications/reverse | Append a correction/reversal as an administrator. |
| POST | /api/v3/rooms/{roomId}/verified-case/close | Close only the verified case, subject to fresh resolution evidence. |
| GET | /api/v3/rooms/value/verified-threats?after={cursor} | Admin-only verified balances, 100 partitions per page. |

Registration body: id (client-generated UUID for idempotency), method, sourceId, fromUtc, toUtc. For campaign_holdout, sourceId is the campaign UUID and the cohort must be enrolled but untouched before registration; fromUtc/toUtc define a future observation window. Dispatch must occur after registration completes and before fromUtc; dispatch during observation makes the result unverified. For source_condition_review, sourceId may be an empty string; the server uses pinned source/monitoring evidence. Window length is at most 90 days, starting within 30 days. Unsupported methods retain methodVersion=unsupported and cannot claim value.

Verification body: id (new UUID; reuse it for transport retries), planId, confounderReview. Use a different authorized administrator from the intervention owner/author. A completed window and a written review are required; the server reads evidence and computes amounts. The response has status, observedIncrementalReceipts, acceptedAmount, method/version, reviewer, scope, window, evidence and qualifications. Only acceptedAmount is accepted value; the point estimate and exposure delta are not. Show PARTIALLY_VERIFIED with its qualifications. VERIFIED with acceptedAmount=0 is a resolved condition with no money claim. UNVERIFIED/FAILED have no accepted money.

Reversal body: verificationId, reason. Closure body: verificationId, reason. Route roomId is authoritative. A reversal overrides the current display of its original verification while retaining its history; do not sum both as positive results. Closure needs a fresh confirmed measured-zero condition and does not close the Room.

Use verified balances for strong value claims, keep each market/currency/lifecycle/value-kind partition separate, and follow nextCursor without creating a global FX-less total. These balances exclude existing stated Room claims. The new panels reconcile via GET after mutations; this phase introduces no background SSE subscription.

API validation sequence:

1. Register a supported holdout plan before dispatch, with a real source-linked customer cohort, at least 30 treatment and 30 control subjects, and a future window. Retrospective or unscoped setup must fail.
2. Execute the approved intervention before fromUtc, preserving the control cohort; observe receipts during [fromUtc, toUtc) and wait until toUtc. Review from an independent authorized administrator. Early review, self-review, foreign Room IDs and restricted-Room outsiders must fail.
3. Check acceptedAmount and qualifications. Replay the same verification id: it must not add value. Submit another id for the same cohort/window: it must not attribute the outcome twice. Contaminated controls, missing action timing, unsupported methods, missing currency/value and uncertainty must not produce verified money.
4. Reverse an accepted result; the original remains readable and the verified balance decreases once. Replaying reversal must not decrease it again.
5. A source_condition_review can accept zero money only after two comparable healthy publications and a fresh resolved-candidate monitor. Close the case with that accepted result; the Room remains open. Missing/stale evidence and reversed results must block closure.

Anchor involvement here is its separately executed deterministic holdout method, not an agent-generated verdict or a new chat response. Broader source adapters remain unready until implemented.

Phase 8 financial-evidence boundary: campaign events establish treatment and control, but API-entered conversion values and posted orders cannot establish recovery. The monetary adapter reads the connected financial source directly, pins its datasource and query-mapping fingerprint before intervention, requires explicit currency and payment-status filtering, and requires every cohort identity to resolve. Missing coverage or changed mappings remain UNVERIFIED. Amounts use the pinned market/currency only. This customer-day adapter requires whole UTC-day windows (exclusive end); other grains need another adapter. Normal purchase-feed consumers retain their existing posted-order behavior. Tests deliberately enter inflated conversion amounts and verify that only independent source receipts determine attribution.

The verified monetary reader requires an explicit RealizedRevenue semantic mapping. Generic transaction Amount/TPV, inferred fallback currencies, and unsupported amount semantics cannot be promoted to recovered revenue. This restriction applies only to independent verification.

### Phase 8 review corrections (contract 1.1)

- campaign_holdout method 1.1.0 uses the same revenue-per-subject difference for its point estimate and uncertainty bound. Legacy holdout routes retain their existing estimator. The adapter refuses business-unit scopes and customer grains it cannot isolate. It refuses unreconciled refunds/reversals rather than accepting gross inflows as recovery.
- Registration is the beginning of the intervention period. All treatment dispatch must precede the whole-UTC-day observation interval [fromUtc, toUtc). Receipts before fromUtc do not enter the measurement. Adjacent observation windows do not overlap for attribution reservations.
- GET verifications accepts plansPage, resultsPage (default 1), pageSize (default 25; maximum 100), and asOfUtc. Retain the returned asOfUtc while following nextPlansPage and nextResultsPage independently. New history after that anchor is excluded from subsequent pages; reversals remain current. Start a new first-page fetch to refresh.
- POST and GET verification results return explicit DTOs: no raw subject inputs. measuredSubjects reports their count; evidenceReferences is capped at 20 and evidenceReferenceCount reports the full count retained in the audit record. Verified balance responses also use DTOs.
- After reversal, case valueAttributions contains only currently valid entries. historicalValueAttributions and valueCorrections retain the original values and correction reasons. A case previously verified/closed returns to resolved and needs fresh verification before closure; the Room is unchanged. Refresh both verification and case views after a reversal.

Regression checks: equal conversion rates with higher revenue, dispatch after observation starts, business-unit scope refusal, separate positive refund rows, adjacent windows, removal of reviewer access during evidence collection, concurrent review, reversal after case closure, and paging past 50 entries without exposing subject inputs.

The intervention source?s creator is also excluded from independent review, even when that person is a workspace administrator and differs from the Room owner. This exclusion is pinned at registration alongside the other intervention authors.

## Phase 9: lessons, recurrence and operator diagnostics

New additive endpoints under `/api/v3/rooms` (authenticated):

| Method / route | Request | Meaning |
|---|---|---|
| POST `/threats/recurrences` | `previousCaseId`, `expectedRevision`, `reason` | Administrator accepts a fresh recurrence of a closed case. Returns the new case ID; retry returns the same ID. The previous Room must be closed. |
| POST `/threats/lessons` | `roomId`, `verificationId`, `resolutionPlanId` | Room owner/admin proposes an outcome-linked lesson, with server-loaded evidence and procedure. Returns lesson ID. |
| POST `/threats/lessons/review` | `lessonId`, `decision` (`PROMOTED` / `REJECTED`), `reason` | Independent administrator review. Proposer, resolution author and action owners cannot promote their own work. |
| GET `/threats/lessons?page=1` | Pages of 25, ordered by creation time and ID | Administrator review list. `evidenceStillValid=false` overrides historical promotion after evidence reversal. Follow `nextPage` until null; `items` excludes Rooms the administrator cannot access. |
| GET `/threats/operator-metrics?fromUtc=...&toUtc=...` | Completed half-open UTC window, at most 31 days | Administrator diagnostics. Over 2,000 records in any series requires a narrower window. |

Case responses add `episodeNumber` and `previousEpisodeId`. Group related episodes by `stableFindingId`, but use case/Room IDs for navigation and actions. Do not replace an old Room's history with the new episode. Recurrence acceptance does not guarantee a Room: the standard evidence, triage, readiness and confirmation gates run again.

A promoted lesson is a historical recommendation with qualifications, not an approved action, guaranteed recovery or newly executable tool. Keep `outcomeStatus` and `qualifications` visible. Do not treat an invalidated lesson as usable because its historical review says `PROMOTED`. Existing Room conversations receive up to three qualifying prior lessons through backend context; no change to normal SSE rendering is required.

Metrics count decisions/attempts, not distinct threatened businesses. `ledgerMovements` includes corrections posted during the requested window and is not a lifetime balance. Never sum across currencies. There is no inferred false-positive rate or invented model cost.

Postman checks:

1. With an accepted Phase 8 verification, propose a lesson referencing the resolution plan that preceded observation. Repeating the request returns the same lesson ID. Self-promotion must fail; independent review must succeed.
2. Reverse the verification using the Phase 8 endpoint. The lesson list must retain the history and show `evidenceStillValid=false`; it must no longer be supplied to later Room turns.
3. Close a verified case and its Room. Publish new, positive, source-backed evidence after closure. Accept recurrence using that current revision. Retry and concurrent calls return one new case, episode 2, linked to episode 1. An old revision or nonadministrator must fail. Publish again: the current case remains episode 2.
4. Query operator metrics for a completed short window. Check tenant isolation, denominators and separate currency partitions. Request a reversed/oversized time window and confirm rejection.

Frontend work is additive: recurrence navigation, an administrator lesson-review screen, and optional operator diagnostics. Existing chat and Room rendering continue to work without these screens.

Lesson review and listing require source-Room access. Restricted-Room lessons are never injected into another conversation, even after promotion.

### Phase 9 review corrections: binding and retirement

A lesson now requires the exact procedure pinned when verification was registered. The server derives proposal links from the supported evidence adapter; clients cannot attach an arbitrary older plan to a successful result. All procedure actions must reference adapter-supported proposals. Older unbound verifications and condition-only/manual procedures remain valid records but are not eligible for lesson creation; the API returns an explanatory failure. Do not suggest re-verifying an already executed intervention retrospectively.

Add `POST /api/v3/rooms/threats/lessons/retire` with `{ "lessonId": "...", "reason": "...", "replacementLessonId": null }`. Supply a different, currently reusable same-scope lesson ID to supersede the original. Requires active administrator access to the source Room (and replacement Room when supplied). Repeated identical retirement returns the same ID. Retirement does not reverse monetary evidence or erase the original review.

Lesson list items now include `retirement` and `reusable`. Show retired/superseded status separately from `evidenceStillValid` and the historical `review.decision`. A still-valid outcome does not mean its procedure remains approved for reuse. Promotion also rejects the intervention authors excluded by the verification plan.

Additional Postman checks: reject a different resolution-plan revision, reject an excluded intervention author, retire a promoted lesson and confirm it disappears from later Room context while its verification remains valid. The backend can scan beyond the first 25 records within a 250-candidate budget, but never crosses scope or restricted-Room boundaries. It supplies complete bounded action/verification steps; frontend SSE rendering is unchanged.

Verification-history plan DTOs add `boundResolutionPlanId` and `boundResolutionPlanRevision` (nullable). These identify the only resolution procedure eligible for a subsequent lesson; null means this verification cannot currently support procedure learning. `reusable` is also false for restricted source Rooms, even when the requesting administrator can read the lesson.

## Conversation initiation foundation (convergence Phase 1)

Acceptance corrections: diagnostic prompts can now select a specialist without naming it, using the existing governed same-conversation handoff and multiplexed SSE. Render each child by its run ID and agent attribution; keep the stream open through specialist completion as already specified. There is no new transport or endpoint for this routing. Brief overview responses remain with Maestro. An unavailable specialist is reported as a refusal, not a queued card.

Overview findings retain exposure by currency and lifecycle class, with gross and expected estimates separate. Render missing expected values as unpriced. When current-period coverage is unconfirmed, every agent's answer withholds decline claims and prioritizes checking source freshness and the revenue refresh. Detailed gaps remain in caveats; supported structured diagnostic findings can supplement the overview. These changes fit the existing public response contract. A handoff remains queued while the backend recovers a temporary enqueue failure; use the existing run status and SSE lifecycle, without displaying a second handoff card.

The backend adds GET /api/v3/rooms/threats/candidates?conversationId={id}, POST /api/v3/rooms/threats/initiations and GET /api/v3/rooms/threats/initiations/{id}. These are initiation/status APIs; they do not open a Room or produce an SSE event. Existing Maestro Room tools still use their earlier flow until convergence Phase 2.

Example published-finding authorization (copy IDs/revision from candidates):

~~~json
{
  "id": "<client-generated-uuid>",
  "conversationId": "<source-conversation-id>",
  "reason": "Investigate the attrition exposure in this market.",
  "findingId": "<exact-scoped-finding-id>",
  "publicationId": "<current-publication-uuid>",
  "expectedRevision": 1
}
~~~

Reuse the id/body for transport retries. The response is the standard result wrapper. EVIDENCE_REQUIRED means no assessment or Room started; ASSESSMENT_QUEUED means the runtime accepted shared assessment work, not that it finished or confirmed the threat. WATCH/IGNORE carry the existing policy reason; SHADOW has not dispatched an assessment. SUPERSEDED/POLICY_CHANGED require reviewing current evidence/policy and authorizing a new request. Do not display a Room-ready card from an initiation response. Candidate output is bounded to 100 scopes per page and scope-ordered. Pass nextCursor as after on the next GET, preserving conversationId; stop when nextCursor is null. Access is checked on every page. POST initiation uses the decision rate limiter (429 on throttling). See [conversation-threat-convergence-plan.md](conversation-threat-convergence-plan.md) for the phase boundaries and API acceptance steps.

## Conversation initiation: Phase 2 additions

Use the existing agent proposal approval UI for `investigate_revenue_threat`. Its arguments are
`conversationId`, `findingId`, `publicationId`, `expectedRevision`, concise `reason` and optional
`requestedOwnerId`. Approval requests investigation; show its returned initiation state rather
than announcing that a Room is already open. It has no customer reach or promised monetary effect.
This tool always produces an approval card, even if RoomConvening is configured as Direct.
An ordinary agent run cannot supply human consent by itself.

The initiation API accepts optional `requestedOwnerId`. Selecting oneself is permitted for an
active member; selecting another active member requires administrator authority. Candidate entries
include `legacyCaseIds` for explicit reconciliation; these are case IDs, never permission to inspect
a restricted Room.

Additional V3 endpoints:

- `POST /api/v3/rooms/threats/initiations/{id}/evidence` queues connected-source evidence refresh
  once for that initiation. No body. Continue showing evidence-required until the user reviews a
  published candidate and approves a new initiation; the old approval never upgrades itself.
- `POST /api/v3/rooms/threats/initiations/{id}/reconcile` is administrator-only. Body:
  `{ "initiationId": "...", "legacyCaseId": "...", "reason": "...", "roomId": null }`.
  Use null Room only for detected, unowned legacy work with no Room. Adopting an existing Room
  requires its exact scoped coordinate and active owner; ambiguous or inaccessible Rooms are refused.
- `GET /api/v3/rooms/threats/initiations/{id}` includes `caseId`, access-checked `roomId` and
  `requestedOwnerId`, plus the shared opening's state once assessment is dispatched. `READY` permits
  navigation to the Room. `ACCESS_REQUIRED` must not render a link. Pending routing/reconciliation,
  paused and blocked states are progress or review states, not successful openings.

Room responses continue in the destination Room's conversation. Phase 3 adds the source-conversation
progress feed described below; the Phase 2 additions alone did not introduce that feed.

### Conversation investigation progress — Phase 3

While a user views a conversation, subscribe with their bearer token to
`GET /api/v3/rooms/threats/conversations/{conversationId}/stream` alongside the existing response
stream. Keep this subscription after Maestro completes: users may approve a proposal later, and
several participants may watch the same conversation. No SignalR connection is required.
The feed does not start or cancel durable investigations.

Each `threat_investigations` SSE event contains:

```json
{
  "eventType": "threat_investigations",
  "conversationId": "source-conversation-uuid",
  "items": [{
    "initiationId": "consent-uuid",
    "findingId": "canonical-finding-id",
    "scopeLabel": "dormant accounts · NG / NGN · InFlight",
    "scope": {
      "sector": "financial-services", "mechanism": "dormant_accounts",
      "subjectType": "account", "grain": "account", "stateDimension": "account_activity",
      "stateValue": "dormant", "businessUnit": null, "market": "NG",
      "currency": "NGN", "lifecycleClass": "InFlight"
    },
    "conversationId": "source-conversation-uuid",
    "state": "READY",
    "reason": "Existing scoped Room retained; its original opening evidence remains pinned.",
    "message": "The investigation Room is available. Opening this Room does not establish a verified revenue outcome.",
    "acceptedAtUtc": "2026-10-10T10:00:00+00:00",
    "roomId": "accessible-room-uuid",
    "roomConversationId": "destination-conversation-uuid",
    "roomUrl": "/api/v3/rooms/accessible-room-uuid"
  }],
  "truncated": false
}
```

Treat each event as a replacement snapshot of visible investigation cards, keyed by `initiationId`.
Update the existing card instead of appending a new assistant answer. Use `acceptedAtUtc` to place
it after the triggering prompt/approval; status changes must not move it above that prompt.
The server supplies concise `message` text. Render state and reason as supporting detail. Use
`scopeLabel` as the card heading, and retain `findingId` and structured `scope` to distinguish
multiple investigations after reload. Market, currency and lifecycle class stay separate; the
card contains no priced exposure or verified-value claim. These fields are additive to Phase 3.
Show navigation only when the server provides a Room id/link; `roomUrl` is an API resource, so map
`roomId` to the frontend Room route. Use `roomConversationId` for the destination chat stream.
An accessible Room means investigation can continue, not a verified revenue result.

`GET /api/v3/conversations/{id}` now has `role: threat_investigation` rows carrying the same typed
`threatInvestigation` object. Hydrate those on initial load, then reconcile with SSE using the same
id. Do not render them as model findings or feed them back as user prompts. They do not duplicate
the Room's specialist replies. GET the progress route without `/stream` for a one-time snapshot.

The feed emits a snapshot immediately, then changes within the server's two-second persisted-state
check, with heartbeats when idle. It closes after fifteen minutes: reconnect with backoff while
the conversation is visible; each reconnect supplies current state. Browser polling is unnecessary.
This feed streams progress cards; specialist prose uses the existing destination Room stream.
On `conversation_access_revoked`, clear conversation data and close the subscription. On a Room
access change, replacement cards remove `roomId`, `roomConversationId` and `roomUrl`; remove stale
links immediately. Do not retain links from an earlier snapshot.

The latest 100 initiation cards are included. Show an older-activity notice when event `truncated`
or conversation `threatInvestigationsTruncated` is true; do not present the bounded list as complete
history. Older ordinary messages are unaffected. This phase adds no progress pagination.

Use neutral pending/review styling for `REQUESTED`, `ASSESSMENT_QUEUED`, `ASSESSING`,
`CONFIRMATION_PENDING`, `NEEDS_HUMAN_REVIEW`, `SHADOW`, `EVIDENCE_REQUIRED`, `WATCH`, `SUPERSEDED`,
`POLICY_CHANGED`, `PENDING_LEGACY_REVIEW`, `PENDING_HUMAN_ROUTING`, `PAUSED` and `BLOCKED`.
`CONFIRMED` still awaits governed opening. `ACCESS_REQUIRED` has no Room link. `IGNORE` means
no investigation under the current policy. Use success styling only for an accessible `READY`
Room, with no financial-outcome claim.

Postman Phase 2 acceptance: authorize an exact current candidate, inspect the initiation, review a
legacy blocker explicitly if needed, and let the normal workers assess/confirm/open. Repeat the
same request and concurrent evidence/reconciliation calls: one consent, refresh and Room should
persist. Check one baseline, draft plan, monitor and invitation. Change the publication before
opening: the old consent must be superseded. After a successful opening, refreshing evidence must
retain the original baseline and existing Room. Revoke source or destination access: no Room link
may be disclosed. Try a different market/currency or an ambiguous legacy Room: refuse adoption.

Review regressions: refresh a reconciled scope and confirm the mapping remains usable for Room
monitoring without upgrading old consent. Start conflicting human work on the old legacy case and
confirm review is required again. Repeat reconciliation for a new publication and retain both audit
records. Make the destination conversation private for a non-owner: expect `ACCESS_REQUIRED` and
no Room link. If evidence is published during legacy cohort creation, only the saved cohort remains;
no thread or Room opens, and the response directs the user to scoped investigation approval.
