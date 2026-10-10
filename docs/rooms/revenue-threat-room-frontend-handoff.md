# Revenue threat Room opening: Phase 5 frontend handoff

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
