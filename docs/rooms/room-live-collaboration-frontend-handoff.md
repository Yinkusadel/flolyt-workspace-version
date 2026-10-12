# Room live collaboration: frontend integration and acceptance

Phase 3 of [the Room collaboration plan](room-live-collaboration-plan.md).
Phase 2 backend delivery is committed as `5f8d5ef8`. This document is the React/Vite handoff;
the frontend repository and deployment are separate. The reference code below is an executable
example, not an installed frontend feature. Actual UI and multi-instance acceptance still need
to be run in the target environment.

## Expected experience

Open one Room and show its existing conversation. Each teammate's committed message appears
in that thread. A Maestro handoff creates one card naming the specialist, followed by a working
indicator and the specialist's response. Concurrent specialists have separate answer buffers
and attribution. Completing one run leaves the Room subscription open for other specialists
and future messages. Navigating away disconnects the viewer; durable work continues.

Render concise Markdown with emphasis, bullets and supported tables intact. Use the final
structured response's `actions` and `suggestedFollowUpPrompts` for clickable controls; a
follow-up sends its prompt as a new user message into the same conversation. Do not infer
financial outcomes from handoff status, Room metadata, run completion or delivery gaps.

## Bootstrap and subscription

1. Fetch `GET /api/v3/rooms/{roomId}` with the viewer's bearer token. Use `data.conversationId`
   and `conversationPermissions`; do not create a replacement conversation.
2. Fetch `GET /api/v3/conversations/{conversationId}`. Render the returned timeline order.
   Keep `messageId`, `runId`, attribution, steering and handoff metadata.
3. Open `GET /api/v3/rooms/{roomId}/stream?after=0` with the same token and
   `Accept: text/event-stream`. The overlapping replay deliberately covers the bootstrap race.
4. Apply every parsed frame to the Room state. Persist the last successfully applied durable
   `eventId` together with that state. `room_stream_ready.head` is diagnostic, never a resume cursor.
5. On a transient disconnect, retain state and reconnect using `Last-Event-ID` or `after`
   with the last applied ID. Use bounded exponential backoff with jitter (for example 1–15 seconds).
   There must be one active subscription per mounted Room view; abort the old one before replacing it.

Use a bearer-capable fetch streaming client/SSE parser; native browser `EventSource` cannot set
an Authorization header. Keep tokens in headers. The parser must support arbitrary network
chunk boundaries, multiline `data:` fields, CRLF/LF and comments. Parse complete SSE frames,
not individual network reads. Do not automatically retry the POST message when the GET disconnects.

If the browser has lost its local state, bootstrap again and use `after=0`; a cursor alone is
insufficient to reconstruct prior messages. Store cursors per workspace, Room and conversation,
and clear protected state on sign-out, workspace change and denied access.

The stream is a durable envelope rather than the flattened POST stream. See the
[wire format and event table](revenue-threat-room-frontend-handoff.md#room-wide-live-feed-live-collaboration-phase-2).
Control frames have no durable ID. The durable ID is `{conversationId without hyphens}:{sequence}`.
JavaScript clients should compare its numeric suffix using `BigInt`, rather than trust a JSON
number beyond the safe integer range; send the full ID as a string.

## Reconciliation rules

| Item | Identity and update rule |
| --- | --- |
| Public transcript message | Upsert by `messageId`. Bootstrap and `message_committed` identify the same row. Preserve enriched history fields, such as author names, when an event omits them. |
| Assistant draft | Buffer by `runId`, with `agentKey`/`agentLabel`. Append unique `response_chunk` messages. `final_response.data.payload.markdown` replaces the buffer rather than appending. |
| Authoritative answer | An assistant `message_committed` replaces that run's draft. If bootstrap already contains the committed answer, ignore replayed chunks/final output for that run. A committed answer can arrive before its runtime final event. |
| Handoff | History uses `handoff.runId`; reconciled events use `data.targetRunId`; runtime events use `data.payload.targetRunId`. All are the target run ID. Upsert one card, update its status from that run's `run_state`, and retain terminal history status during replay. |
| Steering | Upsert by `data.messageId` (`steering:{noteId without hyphens}`). Replace queued receipts with delivered/not-delivered; do not regress a terminal history receipt during replay. |
| Run state | Update that run only. Replayed starts must not reopen a finished run. `Done` means execution finished, not that a verified financial outcome occurred. |
| Delivery gap | Show a subdued delivery notice for that run. Continue waiting for committed messages and durable state. Missing incremental chunks cannot be reconstructed. Do not resend the request. |
| Investigation card | Preserve history cards and use the existing investigation progress stream. The Room conversation feed does not replace investigation approval/progress endpoints. |

Deduplicate by applied cursor on a single ordered Room subscription. Keep its state and cursor
together: a reducer failure must not advance the cursor. Unknown additive event types may be ignored
after validating the envelope. Repeated tool/proposal/action events should update their existing
controls, not create extra assistant messages. Render action availability from its eligibility
and existing approval contracts; receipt of an SSE event grants no new permissions.

Avoid rendering both the initiating POST stream and the Room stream into the same buffers.
The simplest Room integration sends POST messages with `Accept: application/json`, then uses the
Room GET feed as the rendering source. POST returns the conversation/run receipt (usually 202
when a run is queued; an immediate reply can return 200). Merge receipts by run ID; do not treat
them as assistant answers. Omit `activeRunId` for a new turn; include it only for intentional
steering, using the established steering flow.

For a teammate comment that should not call AI, send `replyMode: "none"` with the existing
conversation ID. It is committed as a public participant message and returns 200 without a new
run. Use `replyMode: "auto"` (the default) when a selected agent should respond. The Room GET
stream remains the same for both modes.

Preserve the history endpoint's causal timeline: user message → its handoff cards → Maestro
acknowledgement → attributed specialist responses. For live updates, anchor handoffs to their
`sourceRunId` user message, and hold a child response below the source acknowledgement once that
acknowledgement exists. Use each message's own `timestamp`, not the envelope's `atUtc` (which is
publication time). Journal sequence orders delivery, not historical display time. Do not reorder
the entire history solely by timestamps; legacy handoffs can have earlier recorded timestamps.
Independent specialist buffers can update concurrently even when their displayed rows are anchored.

## Reference state reducer

[room-live-state.mjs](examples/room-live-state.mjs) shows immutable state updates suitable for
`setState(previous => applyRoomEvent(previous, frame.event, JSON.parse(frame.data)))`.
Initialize with `createRoomState(conversationId, conversation.messages)` after bootstrap.
It covers cursor checks, history overlap, multiplexing, handoff normalization, steering receipts,
delivery gaps and revoked access. Use `state.messages` for authoritative transcript rows and
only uncommitted entries in `state.runs` for provisional answers. A run's `markdown` is a buffer,
not an additional transcript row. It does not implement the network parser, timeline layout,
member-name enrichment, proposal controls or investigation progress UI.

Run the dependency-free reference checks from the backend repository root:

```powershell
node --test docs/examples/room-live-state.test.mjs
```

## Reconnect, access and proxy behavior

| Condition | Client behavior |
| --- | --- |
| EOF, network loss or slow-reader closure | Retain state/cursor and reconnect with backoff. No agent cancellation request. |
| 401 | Refresh authentication through the normal login flow; retry only with valid credentials. Never loop against invalid credentials. |
| 403/404 before SSE | Stop retrying and clear protected Room state. Missing and inaccessible Rooms intentionally look alike. |
| `room_access_revoked` | Immediately stop rendering, abort the subscription, clear protected state and require an authorized reload. Ignore buffered frames afterward. |
| 400 invalid/ahead cursor | Clear the cursor, re-authorize/bootstrap, and replay from zero once. If the problem persists, show a reconnect error; avoid a retry loop. |
| 5xx | Retain state, retry with backoff and show reconnecting status. Do not mistake transport failure for a failed agent. |

Leaving a Room must abort fetch and release the reader. React effect cleanup must also run during
development Strict Mode remounts. The backend rechecks access on each page, not every already
buffered frame; revocation is observed on a subsequent read. The feed polls idle work about once
per second and emits heartbeats about every ten empty polls. It has no automatic end when a run
completes. Configure the deployed proxy to avoid buffering and to allow an idle timeout longer
than heartbeat cadence. Server write/flush limits close only a slow viewer.

## API acceptance in Postman

Use a real existing Room and two active members who can view its conversation. Set collection
variables `baseUrl`, `roomId`, `conversationId`, `tokenA`, `tokenB`, and optionally a last event ID.
Use bearer authentication on every request. Model-backed scenarios incur normal test usage.

1. As A, GET `/api/v3/rooms/{{roomId}}`; copy `data.conversationId`. GET its conversation history.
2. Open the Room GET stream in two tabs, one per member. Expect `room_stream_ready` and replayed
   `message_committed` events with matching stable IDs, without new agent runs from opening GET.
3. As A, POST `/api/v3/conversations/messages` with `Accept: application/json` and this body:

   ```json
   {
     "conversationId": "{{conversationId}}",
     "message": "Ask RIA to assess revenue performance and Sentinel to assess churn-risk drivers. Hand off each investigation to its specialist, keep currencies separate, and ground recommendations in evidence."
   }
   ```

4. Both GET tabs should receive the user message, handoff cards, specialist activity and answers
   with distinct run IDs. Check readiness first: an unavailable specialist may correctly decline
   the handoff. A prompt cannot guarantee the model schedules parallel work; if needed, send two
   explicit specialist requests (`agentKey: "flolyt.revenue-intelligence"` and
   `agentKey: "flolyt.sentinel"`) before either completes, using this same conversation ID.
   Do not send a shared `activeRunId`, which would steer instead of create independent runs.
5. After one specialist's terminal event, confirm the GETs remain connected and the other
   specialist can still deliver its response. Then send a teammate message as B with
   `replyMode: "none"`. It should appear
   in both tabs without opening another Room subscription.
6. Record A's last applied durable `id`, disconnect A, and let B's work finish. Reconnect A with
   `Last-Event-ID` set to that full ID. Expect strictly later event IDs and the committed answer;
   B remains connected. Re-fetch history and match message IDs, run attribution and handoff cards.
7. Remove B's membership/access using an administrator test account. Expect B's stream to emit
   `room_access_revoked` and close on a subsequent page. A's authorized feed and durable agent work
   continue. B's subsequent details/stream requests must not expose the Room.

Verify specialist keys against the workspace roster before running explicit requests. Response
quality and measured data depend on workspace capabilities; the acceptance goal here is delivery,
identity, chronology and isolation, not a particular monetary conclusion.

## Acceptance matrix and evidence

Record the deployment revision, Room/conversation IDs, redacted event IDs, run IDs and observed
result. Do not capture bearer tokens or private tool results in shared acceptance artifacts.

| Scenario | Required outcome | Current evidence |
| --- | --- | --- |
| Two users, teammate POST | Both receive one committed message with the same stable ID. | Independent PostgreSQL journal readers and reference reducer checks; live UI pending. |
| Parallel Sentinel/RIA | Separate buffers/cards; one run completing leaves others connected. | API stream, concurrent journal and reference reducer checks; model-backed UI pending. |
| History/subscription race | No lost message; replay adds no duplicate answer or handoff. | Journal replay and reducer checks; browser bootstrap race pending. |
| Disconnect/reconnect | Only unapplied IDs resume; GET disconnect never cancels durable work. | API initial-write/flush disconnect and replay checks; proxy/network acceptance pending. |
| Journal outage | Execution finishes; explicit gap and committed answer recover after delivery is available. | PostgreSQL executor/outage and recovery tests; deployment fault injection pending. |
| Removed membership | Subsequent feed access stops; protected state is cleared. | PostgreSQL current-access and API revocation checks; two-account UI pending. |
| Private/restricted/foreign Room | Details/feed denied consistently; no transcript leakage. | PostgreSQL access regressions; deployed role checks pending. |
| Separate application instances | Viewer on instance A receives committed work from B using the same PostgreSQL store. | Shared-database journal design and independent reader tests; actual two-node acceptance pending. |
| Slow viewer | Its write/flush times out; another viewer and execution remain healthy. | Bounded endpoint implementation; deployed throttled-client acceptance pending. |
| Room idle, later message | Feed survives run completion and delivers later work. | API stream continuity checks; proxy idle/reconnect acceptance pending. |

For the two-node check, address viewer instance A directly (or pin routing) and ensure the worker
actually executes on B, confirmed by instance logs/run ID. Both must use the same database and
deployment version. Do not call a load-balanced success alone proof of cross-instance execution.
For slow-reader acceptance, throttle one client while watching another; distinguish network
buffering from a backend write timeout. Automated checks are prerequisites, not a claim that
frontend or staging acceptance has already passed.
