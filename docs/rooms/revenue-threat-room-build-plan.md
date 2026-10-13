# Revenue threat Room: build plan

Written 2026-10-10. Source contract: [revenue-threat-room-frontend-handoff.md](revenue-threat-room-frontend-handoff.md)
(backend phases 5 to 9). Endpoint source of truth stays [`docs/endpoints/rooms.md`](../endpoints/rooms.md);
this doc is the umbrella plan, not a build log. Nothing below is built unless marked `[x]`.

## CURRENT STATE (read this first; updated 2026-10-11, end of session 2)

Everything below this section is the history of how we got here. Where an older section disagrees
with this one, this one wins.

### SESSION 3 UPDATE (2026-10-12): read this before the 2026-10-11 summary below, it supersedes it
**Branch `revenue-threat-room`, last pushed commit `fee69c4`.** The "Room detail page is BLOCKED" line
below is OUT OF DATE: the backend added `GET /rooms/{roomId}` and the page is built as follows.
- **Built and pushed:** Room page shell + real HEADER (title/chips/owner line/three figures/Watching menu,
  breadcrumb "Rooms / <title>", "Room not found." state, threat tabs gated by `threatConfirmationId`);
  Decision tab; Conflicts tab incl. the Raise a conflict form (no close on outside click); header alignment
  fix (the "At risk now" null state shares the figures' line height; the note keeps its text and sits on
  the same line). Tabs still placeholders: Briefing, Plays, Evidence, Agents & runs, People & guardrails,
  Cohort & overlaps, Log, and the two threat tabs.
- **Watching menu semantics (explained to the user):** it writes a PERSONAL notification preference only
  (`GET /rooms/subscriptions`, `PATCH`-style `/rooms/{roomId}/notify-level`, `/watch`, `/unwatch`). Owners
  cannot mute ("Nothing" disabled) and "Stop watching" is hidden for owners BY DESIGN, so the owner never
  sees it; it shows for non-owner watchers. Whether the backend would allow an owner to unwatch is
  unchecked. UNVERIFIED live: no real click on any Watching write yet.
- **"A change in this figure isn't a recovery claim." is my own adaptation** of the docs' close-room `delta`
  note (`docs/endpoints/rooms.md`, "not a recovery claim"), NOT a design line. User asked to keep it; if a
  design/doc source is never found, treat it as an unverified label.
- **Live thread: CONCLUSIONS 2026-10-12 (still NOT BUILT, user waiting on the backend files):**
  - Transport is plain **SSE**, NOT SignalR. Backend handoffs: revenue-threat-room-frontend-handoff.md lines
    78 and 366 ("No SignalR connection is required"). SignalR appears only in the older chat-panel handoff.
    It is still live (long-lived push connection, events within about a second, heartbeats, resumable by
    `eventId` / `Last-Event-ID`); send is a plain `POST /conversations/messages`.
  - The Room feed is a DIFFERENT wire format from the per-run stream the chat panel uses (durable envelope,
    `message_committed`, `room_stream_ready`, `room_access_revoked`, Room-wide across all runs). Only the
    presentational pieces (Markdown, handoff/steering cards) may be reused.
  - **The Room thread gets its OWN stream client, reducer, state and send hook in the Rooms feature folder;
    the AI chat panel code is NOT modified** (re-check the chat panel after the build).
  - **WAITING ON: the backend's `docs/examples/room-live-state.mjs` and `docs/examples/room-live-state.test.mjs`**
    (backend repo; not in this repo; not derivable from Scalar or by testing). The user will get them from their
    boss via a ticket and copy them into `docs/rooms/examples/`. Ticket text: "Please share
    `docs/examples/room-live-state.mjs` and `docs/examples/room-live-state.test.mjs` from the backend repo
    (referenced in the Room live collaboration frontend handoff). The frontend will port that reducer for
    `GET /api/v3/rooms/{roomId}/stream`." Fallback if refused: build from the handoff reconciliation table plus
    real frame captures, flagging every inferred rule.
  - **Test setup agreed:** the user lets me send messages freely on "Dormant Accounts" (credits OK). The Room
    has NO agents, so an agent may decline; if nothing replies, ask the user to add one. Second account:
    `hitsugaya@yopmail.com`, a member of Chad's workspace (still check it is on the Room's people; do not add
    it myself). Sign-in is passwordless: request the OTP, ask the user to paste the code from yopmail (do not
    ask for a code in advance), then save a storageState. Use two Playwright contexts on a throwaway port,
    never port 3000.
  - **First slice, offered and waiting for "build":** panel shell (400px right panel, sidebar to a 56px rail
    while open, drawer under 1100px, "Open thread" button), roster strip from the Room's `agents`, history from
    `GET /conversations/{id}`, composer UI with the mode switcher; capture the real `/stream` frames in the
    same pass. Live feed + agent message variants wait for the reducer files.
- **THREAD SLICE 1: BUILT 2026-10-12 (`npx tsc -b` and `npm run build` clean; checked on a deleted mock harness with the real response shapes).**
  Files: `src/pages/rooms/room/thread/{index,thread-message,composer,use-media-query}`, `src/components/sidebar-override-context.tsx`
  (+ `forceCollapsed` on `sidebar.tsx`/`app-layout.tsx`), `use-get-room-thread.ts`, `use-send-room-message.ts`, `send-room-message.ts`.
  What it does: 400px docked panel on the right (open by default, remembered in `flolyt-room-thread-open`), the app sidebar shown as the
  56px rail while docked WITHOUT touching its saved preference (`flolyt-sidebar-collapsed`), overlay drawer + floating "Thread" button under
  1100px, "Open thread" in the header when the panel is closed, history from `GET /conversations/{conversationId}` (people teal-less plain
  bubbles, agent blue-outlined Markdown bubbles, handoff cards reused read-only from the chat panel, follow-up chips send a new `auto`
  message, `context`/`error` roles never shown, day separators), roster strip from the Room's `agents` + a people count from
  `/rooms/{roomId}/people`, composer (mode switcher with explaining popover remembered per conversation, `@` agent picker, Enter sends;
  `@Name` is sent as the stored mention `@[agent:key]`; `replyMode: "none"` for "Post to the people"), a read-only note when
  `conversationPermissions.canContribute` is false, a skeleton/empty/error state each. Decision's two columns now follow a CONTAINER
  (`@5xl`, set on the tab area) instead of the viewport so it stacks when the thread takes width.
  **INTERIM, replace when the feed lands:** `useGetRoomThread` polls every 5 s (`refetchInterval`); a 202 receipt shows an "<agent> is working
  on this" line until a reply with that `runId` appears (3 min cap). **Not built:** the SSE feed + reducer, the Live indicator, agent state
  dots, approval card, steering receipt, delivery-gap notice, unread count on "Open thread".
  **UNVERIFIED LIVE (mocks only):** the real `POST /conversations/messages` receipt envelope (the service accepts bare or `data`-wrapped
  fields until a capture), a real send, and the real Room conversation with messages. The chat panel code was not modified.
  **Ticket candidates:** the history has no `replyMode` per message, so a saved people-only note can't be tagged; `/rooms/{roomId}/people`
  has user ids but no names, so the roster can't show people.
- **THREAD SLICE 2 BUILT 2026-10-13 (all four items below; `npx tsc -b` + `npm run build` clean; checked on a deleted mock harness, mocks only, NOT live):**
  saved reply mode (`conversation-preferences.ts`, `use-conversation-reply-mode.ts`: read once, adopted once per conversation, a refetch never
  overwrites a pick; failed save toasts "wasn't saved for your other devices"; browser copy kept as the first paint), `displayName` on room
  people, one `@` picker over `GET /rooms/{roomId}/people` (agents then named people, self excluded, null-name people left out; picking an agent
  switches to "Ask the agents", picking a person keeps the mode), sent as `@[agent:key]` / `@[human:userId]`, stored mentions shown as name chips
  (unknown -> "an agent" / "a teammate"), roster = agents + named people with the first-appearance colours. UNVERIFIED LIVE: the preferences
  routes, the real `/people` `displayName`, a real `@[human:id]` send and the notification it queues. (Original plan entry below, now done.)
- **(DONE in slice 2) THREAD SLICE 1 pushed (`d5a3422`) + backend answers 2026-10-13:** The handoff was merged:
  `revenue-threat-room-frontend-handoff.md` is now the newer version (the `-new` file is gone; it also links `room-conversation-archive-repair.md`,
  not in this repo, ask the user if it is needed). Slice 1 later fixes already done: author colours are handed out by first appearance in the
  thread (up to 4 authors never share one), a "You" tag + right-aligned own messages (compares `authorUserId` to `useAuth().user.id`, UNVERIFIED
  that those ids are equal), tool-call `context` lines stay hidden (technical logs, not the shimmering `progress` line, which comes with the feed).
  **Next implementation batch (all documented in `docs/endpoints/rooms.md`, section "Room people names and human mentions" + the two
  `/conversations/{id}/preferences` entries):**
  1. Saved reply mode: `GET`/`PUT /conversations/{conversationId}/preferences` replace the browser-only mode memory (keep it as a fallback;
     keep sending `replyMode` explicitly on every message; failed load keeps `auto`; failed save says it was not saved across devices).
  2. People names: add `displayName` (nullable) to `get-room-people.ts`; show people in the panel roster; null stays unnamed (no id/email fallback).
  3. Human mentions in the `@` picker next to agents: show `@Ada Lovelace`, send `@[human:<userId>]`; render stored `@[human:id]` as a chip
     using Room people (and the workspace roster as a fallback). Plain `@Name` is not a mention.
  4. `authorName` is now the full name for every viewer: drop any email expectation.
  Still waiting on the backend: `room-live-state.mjs` + test (feed/reducer). Real-agent send needs an agent on the Room.
- **ADD PEOPLE/AGENTS DIALOG: BUILT 2026-10-13 (`thread/add-to-room-dialog.tsx`, `UserPlus` in the thread header; `npx tsc -b` + `npm run build` clean; mock-harness verified only: the real POSTs, the real role/refusal behaviour and `members.id == userId` are UNVERIFIED live). Person roles offered: participant/approver/observer (decision-owner left out); agent roles lead/supporting (lead hidden when the Room already has one); `maxApprovalReach` and `source` not sent; `reads` = the agent's own `reads` from `GET /workspace/agents` (null when empty; meaning unverified until a real add); closes only via Cancel/X. Plan as written:** `UserPlus` icon in the thread panel header opens a dialog with People and Agents tabs.
  People: workspace members (`GET /workspace/members`, minus people already in the Room), `role` = `participant` / `approver` / `observer` (and `decision-owner`: confirm whether it is one per Room), optional `maxApprovalReach`, `POST /rooms/{roomId}/people`
  (widest access: say so). Agents: `GET /workspace/agents` filtered to `isEnabled`, `state === "ready"` AND `detailedState === "ready"` (not "reading"/"not_ready"; the second check was added 2026-10-13 after Compass slipped through with an unavailable data capability), minus agents
  already on the Room; `role` is `lead` or `supporting` (`automatic` is the arbitration seat, not offered); `whatItWillDo` is required free text, prefill from the agent's
  `description`; `POST /rooms/{roomId}/agents` (only one Lead). User decision: for now anyone who can contribute to the thread sees the icon; show the
  backend's own refusal message. STILL OPEN with the backend: who may add, error behaviour for a bad role, whether a not-ready agent can be added, whether `decision-owner` is one per Room and who may assign it.
- **PLAYS TAB: BUILT 2026-10-13 (`src/pages/rooms/room/plays/`; `npx tsc -b` + `npm run build` clean; mock harness only, from the documented shape + the backend's hand-written sample: `basis` and `decisionOwnerName` now exist and are shown). UNVERIFIED LIVE: everything (no real play yet), `wouldBreach`/`clear` are drawn as counts when numbers and as Yes/No when booleans, the obligation state values, the collision check auto-runs a POST on each selected play. Earlier hold notes:**  (user's decisions): leave out "About this leak" and "Basis"; do NOT fill the "Decides" column from Room people (empty
  cell + `❌` comment, ticket for `decisionOwnerName`); "Readings argued before" comes from `citedReadings` in `GET /rooms/{roomId}/cited-dissent`.
  Waiting for a real play (the list is empty) and a decision on whether to build "Obligations from this room" from the schema alone.
- **THREAD SLICE 3 BUILT 2026-10-13 (`npx tsc -b` + `npm run build` clean; mock harness only, then deleted):** the panel header roster is now overlapping
  avatars (people solid, agents dashed, up to 6 then "+N", names in a tooltip, "N people · N agents" beside them) and opens a members dialog
  (`thread/members-dialog.tsx`: All / People / Agents tabs from `GET /rooms/{roomId}/people`, read only, roles via `humanize`, "Add people or agents"
  in the footer closes it first then opens the add dialog). Agent suggestions are a labelled "Suggested follow-ups" block (`thread/suggested-followups.tsx`,
  chat-panel look, small radius, numbered rows held to 2 lines, hover copy icon always visible on touch, only the LATEST agent reply shows it). Both
  dialogs have a FIXED body height (`h-[min(26rem,..vh)] flex-none`: DialogBody's own `flex-1` overrides a plain height, measured 630px on every tab).
- **MENTION LOOK BUILT 2026-10-13 (composer):** a mention in the draft is drawn in the app blue (coloured text only, no pill) by a mirror layer behind the
  transparent textarea (identical metrics, scroll synced; nothing moves), Backspace after/inside a mention or Delete before it removes the WHOLE
  mention, and sending swaps each mention for its stored token. A mention = any `@Label` that exactly names a Room agent/person, not glued to a word
  (`findMentions` in `thread/mentions.ts`, the single source for colour, deletion and send). Mock-harness verified (7 checks), not by hand in a real browser.
- **REDUCER FILES RECEIVED 2026-10-13: the live feed is UNBLOCKED.** `docs/rooms/examples/room-live-state.mjs` (101 lines) + `room-live-state.test.mjs` (9 tests)
  are in the repo and PASS here (`node --test docs/rooms/examples/room-live-state.test.mjs`, 9/9). Read in full. Key rules: state = `{ conversationId, cursor, messages: Map by messageId,
  handoffs: Map by TARGET runId, runs: Map by runId, otherHistory, transport }`; `createRoomState(conversationId, history)` seeds from the history; `applyRoomEvent(state, type, event)`
  THROWS on a wrong conversation / bad envelope / bad cursor (the caller must not advance the cursor then), skips events at or below the cursor (BigInt compare on the numeric
  suffix of `eventId`), never treats `room_stream_ready.head` as a cursor, `room_access_revoked` clears everything and ignores later frames, a committed assistant message beats
  chunks/final for that run, `final_response` replaces chunks, handoff and steering status never regress from terminal, `stream_delivery_gap` only flags the run, `heartbeat`
  changes nothing. NOT in the reference (still to build): the SSE network parser (CRLF/LF, multiline `data:`, comments, chunk boundaries), reconnect with backoff + jitter and
  `Last-Event-ID`, timeline order (history order, anchor handoffs under their source message, use each message's own `timestamp`), member names, approval cards, the UI.
  Also answers an earlier ticket question: the history/feed EXCLUDE internal tool/context messages, which explains the skipped `messageId` indexes (:6, :9).
  PLAN (not built): (1) TypeScript port of the reducer + its tests under the Rooms feature (own files, chat panel untouched); (2) fetch-streaming SSE client; (3) swap the 5 s
  polling for history-bootstrap + feed; (4) UI for what the feed adds (Live indicator, working line from `progress`/`run_started`, handoff lane, steering receipt, delivery-gap
  notice); (5) capture real frames from the Room (Revenue Intelligence is now the lead agent, so real runs exist) before trusting any assumption.
- **LIVE FEED BUILT 2026-10-13 (the 5 s polling is GONE; `npx tsc -b`, `npm run build` and `npm run test:rooms-live` (28 tests) pass).** Files: `src/features/rooms/live/{room-live-state.ts, sse-parser.ts, room-feed-client.ts, room-timeline.ts}` (+ `*.test.mjs`), `src/features/rooms/use-room-live-thread.ts`, `thread/live-run.tsx`; the panel, roster (agent state dots) and steering receipt were updated, `use-get-room-thread.ts` no longer polls and `use-send-room-message.ts` no longer refetches. How it works: history is read once as the bootstrap, then ONE feed (`after=0`, overlap deduped by `messageId`) drives the state; reconnect with `Last-Event-ID` and bounded backoff with jitter; 401 refreshes through the app's own axios client (its lock), 403/404 stop, 400 replays from zero once; revoked clears everything and stops. UI: a "Live / Reconnecting / Not live" badge, agent state dots, a working line in plain words from `progress` (internal text never shown), the streamed draft replaced by the committed answer, handoff cards anchored under their source message, delivery-gap notice, steering receipt, suggestions only on the latest reply.
  **VERIFIED:** the reducer/parser/client by their tests; the REAL captured frames replayed through parser + reducer from real history (18 messages deduped, 6 runs committed, no errors, cursor 95); `Last-Event-ID`/`after`/400 behaviour live; the UI on a local mock server with a scripted feed (live message, run streaming, commit replacing the draft, gap, handoff, drop then resume, revoke). **NOT verified live:** `agent_handoff`, `steering_updated`, `stream_delivery_gap`, `room_access_revoked`, `run_cancelled`, `error` events from the real backend; a real send from the new UI; two accounts at once; Strict-Mode remount in a real browser; an approval flow (no approval controls are drawn: the feed carries none).
  **KNOWN LIMITS / FOLLOW-UPS:** the feed is replayed from zero on every open (bounded 100 per read, fine for small Rooms; persist state + cursor later if a Room gets long); a streamed draft sits at the end (not anchored under its source message); unknown `suggested_action` events are ignored; no unread count.
- **AGENTS & RUNS TAB BUILT 2026-10-13 (`src/pages/rooms/room/agents-runs/`; `npx tsc -b`, `npm run build` and the 28 feed tests pass; mock harness fed the REAL runs and investigation responses plus synthetic failed/cancelled/waiting/running rows).** Layout: a full-width "Add an agent" row at the TOP (user's call: title and text left, button right on one line; opens the thread's add dialog on its Agents tab), then the Roster (a card per agent: state chip, role, what it will do and Reads from `/people`, Remove with a confirm, the arbiter's Remove disabled with the documented reason), then the Runs table (state, start, turns, result by case, "Unavailable" rows read, failures stay in line) beside the Investigation card (status, `now`, summary, turns bar, steps; `canPause` unused). Anyone who can contribute sees Add/Remove, the backend refuses where it must. No Approve/Reject or Connect-source links (no route/field).
- **PEOPLE & GUARDRAILS TAB BUILT 2026-10-13 (`src/pages/rooms/room/people-guardrails/`; `npx tsc -b` + `npm run build` pass; mock harness with the REAL guardrails response plus synthetic rows; 12 checks).** The documented banner (everyone listed sees everything); People table (name or "Name not available" so they stay manageable, owner chip, role select participant/approver/observer through `PUT`, inline approval limit saved with the role, "Added" = source words or "Added by <name>" + date, Remove, the owner cannot be removed, "Hand ownership to…" through `PUT /owner`, "Add someone" opens the add dialog); Guardrails (Absolute = unliftable with "Never liftable", Set elsewhere, Set in this room with "Stated, not enforced", Lift only for the author, add form, "Already prevented" with the not-yet-computed reason and the send-time note); the Restrict box AT THE BOTTOM of the tab ONLY (user's call: the header gets no Restrict button): four fixed reasons, a confirm step, and the restricted state with "Open it back up". The add dialog now has the optional "Largest play they can approve" field (it sends `maxApprovalReach`). Left out: the team after a role ("Approver · Pricing", no field), "Change in settings" link (no route), "No limit"/"Can't approve" wording (null's meaning undocumented). `use-update-room-owner`, `use-restrict-room` and `use-unrestrict-room` now also refresh the single-Room query.
- **Other Room work still open:** Restrict... dialog, Close room page, Plays tab (empty list, no create route),
  Briefing (no summary endpoint; `/investigation` deferred), Admin tab (backend answers), threat tabs.

**Summary:** the new `/rooms` page is a tab shell with four built tabs (Rooms, Convening, Dissent,
My load) and a fifth (Admin) ON HOLD for backend answers. The Room detail page is still BLOCKED on
`GET /api/v3/rooms/{roomId}`. Everything is on the wire with `npx tsc -b` and `npm run build` clean,
but NONE of the mutations (assign owner, saved views, accept/decline convening, judge/withdraw dissent,
notify-level, unwatch) has been submitted against the real backend yet.

**Branch:** `revenue-threat-room` (off `add-onboarding`), pushed, see `git log` for the latest commit.
Session 2 commits: C2 Convening tab, C3 Dissent tab, rooms filter card native selects replaced,
shared `SearchableSelect` disabled-hover fix, C4 My load tab, then docs/memory for the Admin hold.

### Shared pieces added or changed in session 2 (reuse these)
- `src/pages/rooms/convening/format.ts`: `humanize` (any API token to words), `toNumber`, `formatMoney`,
  `formatDay`, `formatDayTime`, `daysWaiting`. Dissent and My load import from it.
- `SearchableSelect` (`src/components/ui/searchable-select.tsx`): trigger hover border is now
  `enabled:hover:` so a disabled select has no hover effect. It has no empty value, so "Any" is a real
  sentinel item that maps back to "" (see `filter-card.tsx`).
- `use-get-all-dissent.ts` keeps previous data while "Show 50 more" raises `take`;
  `use-get-room-subscriptions.ts` takes `{ enabled }`.
- Never use a native `<select>`; leftovers not touched: `src/components/ui/calendar.tsx` month/year selects.

### What is done
- **Step 0 and 1:** the 16 new `/rooms` routes are documented and scaffolded (service + hook each).
  `room-opening` is fully typed from the Scalar schema. `replyMode`/author types added.
- **Step A:** shared helpers moved out of the Rooms feature to `src/lib/initials.ts`,
  `src/lib/format-activity.ts`, `src/lib/actor-types.ts`.
- **Step B:** the old Rooms section (mock Room pages, old wired index, wizard, plays-at-scale) is in
  `src/oldpages/rooms`. `/rooms/:roomId` is a "being rebuilt" stub (`src/pages/rooms/room-stub.tsx`).
  Routes `/rooms/new`, `/rooms/subscriptions`, `/plays` were removed.
- **Step C1:** the new Rooms list is live in `src/pages/rooms/`: `index.tsx`, `use-rooms-filters.ts`
  (all filters in the URL), `stat-tiles.tsx`, `filter-card.tsx`, `saved-views.tsx` (create, apply,
  edit and delete on the user's own views), `rooms-table.tsx`, `modals/assign-owner-modal.tsx`, `labels.ts`.
  Built from `flolyt-figma-designs/New-pages-pattern/Flolyt Rooms-png/Rooms · index.png`.

### UI behaviour settled during C1 (keep it this way)
- Filter card is **hidden by default**, with an animated "Show filters / Hide filters" button at the
  right of the header (fixed width; a count badge sits on its corner while hidden and filters are active).
- State tiles: the selected tile is the primary blue, **one block that slides** (transform, ~320ms)
  to the clicked tile; unselected tiles float up 4px with a soft shadow on hover; the selected tile
  does not lift. The resize watcher must be created once (a rebuilt watcher fires immediately and
  switched the animation off). Verified in a real browser on a throwaway harness page.
- Saved-view chips: the active one is solid blue; hover reveals pencil and trash buttons (author only)
  with tooltips, same reveal as the prompt box's toggle chips.
- `<main>` in `app-layout.tsx` has `scrollbar-gutter-stable` so showing or hiding content does not
  shift the page sideways.
- A null live figure reads only "Live figure unavailable". The API row now has
  `currentAmountComputedAtUtc`, shown as "live · HH:MM UTC" under the live amount.

### C2 Convening tab: BUILT 2026-10-11 (`npx tsc -b` and `npm run build` clean)
- `src/pages/rooms/index.tsx` is now the tab shell (`?tab=rooms|convening|dissent|my-load|admin`, count
  badge on Convening); the old list moved to `rooms-list-tab.tsx`. Dissent, My load and Admin show a
  "being rebuilt" card until C3 to C5. The list-header "Convening queue · N waiting" button was dropped
  on purpose: the tab itself carries the count.
- `src/pages/rooms/convening/`: cap card, waiting cards (accept, inline decline with required reason),
  Withheld column, Decided table with "Show decided".
- Built from the live API, not the design's copy: readable raw values for chips (`humanize`), plain grey
  chips for severity and outcome, "—" for null amount/customers/owner, no withheld links.
- Layout checked on a throwaway mocked harness (desktop + mobile, deleted); accept/decline never submitted live.

### Backend gaps on `GET /rooms/convening` (tickets raised by the user, mark DONE when fixed)
- [ ] `conditionLabel` on proposals: Condition cell is empty meanwhile.
- [ ] `ownerName` on proposals: Proposed owner cell is empty meanwhile.
- [ ] `declineReason` + `decidedByName` on `decided` items: Decided table has neither.
- [ ] Allowed values for `alertSeverity` and `outcome`: chips are plain grey; add tones once known.

### C3 Dissent tab: BUILT 2026-10-11 (`npx tsc -b` and `npm run build` clean)
- `src/pages/rooms/dissent/`: ledger table (Turned out / Objection / Room), "Include withdrawn", "Show 50 more"
  (`take` +50 while `truncated`), one "Judge..." button per unjudged row opening a dialog with Borne out,
  Shown wrong and (author only) Withdraw, each with a confirm step and neutral copy (undo behaviour unknown).
- Design colors kept for the boolean outcomes (green Borne out, amber Shown wrong); `roomStatus` is a plain
  grey readable chip. Layout checked on a mocked harness (deleted); the live account had no dissent, so
  judge and withdraw are unverified.
- Backend gaps (user is raising): [ ] `judgedAtUtc`, [ ] `withdrawnAtUtc` on `GET /rooms/dissent` rows;
  [ ] optional: allowed values for `roomStatus`. "about a play" (`aboutProposalId`) deliberately left out.
- Author check assumes `useAuth().user.id` equals the row's `byUserId`: confirm on first real objection.

### C4 My load tab: BUILT 2026-10-11 (`npx tsc -b` and `npm run build` clean)
- `src/pages/rooms/my-load/`: "Showing" picker (`SearchableSelect`: "You" + active human members, you
  not listed twice), six count tiles from the API, table (Room, Why they're here, Notifications, At risk,
  Since, Last opened). Person in the URL as `?person=<member id>`.
- Own load: Notifications dropdown (everything / decisions-only / nothing) via `POST /notify-level`,
  disabled with a reason where `canMute` is false; Unwatch on "Not opened in 30 days" rows.
  Someone else's load is read-only (notify-level has no `userId`).
- Held / left out: "Keep watching" (no endpoint); design's restricted-room "Title hidden / Hidden" copy
  (UI shows what the API sends, lock icon on `restricted`). Layout checked on a mocked harness (deleted).
- Backend (to raise): [ ] what `title`/`amountAtRisk` hold for restricted rooms; [ ] a "keep watching"
  action. Unverified: member `id` == `userId` for the picker; notify-level and unwatch never submitted live.

### C5 Admin tab: ON HOLD 2026-10-11 (user confirming gaps with the backend; nothing built)
Design: `Admin · value, lessons, settings.png`, four sections, each with its OWN endpoint (no shared flag):
| Section | Endpoint | What we know / lack |
|---|---|---|
| Verified value | `GET /rooms/value/verified-threats` | real: `{ contractVersion, balances: [], nextCursor }`; item fields unseen. Scaffolded service wrongly says `partitions`, fix to `balances` |
| Lessons | `GET /rooms/threats/lessons` (+ review, retire, propose) | real: `{ items: [], nextPage: null }`; item fields and review/retire response envelopes unseen |
| Operator diagnostics | `GET /rooms/threats/operator-metrics?fromUtc&toUtc` | real full response in rooms.md; only `verificationsByStatus` / `ledgerMovements` item shapes unseen |
| Investigation turn budget | `GET` + `PUT /rooms/settings/investigations` | fully specified + real response; `canEdit` = administrator, this section only |
Decisions made: do NOT hide the Admin tab (no whole-tab admin flag exists; `canEdit` only governs the
budget section); each section handles its own refusal as an error card; budget Save live only when
`canEdit`; Verified value and Lessons show real states only (skeleton/empty/error/paging, no assumed rows,
a "N returned, details not shown yet" fallback if items ever appear); diagnostics uses the app's date
picker with UTC dates, checks: completed window, at most 31 days, From before To; show `limitations`
text; drop the design's "Response shape not yet confirmed" badges; "Last changed" shown only when
`updatedAtUtc` is non-null; also needs service/hook for settings and the `balances` fix.
Backend tickets to raise: (1) item fields for `balances`, lessons `items`, and metrics `verificationsByStatus`
/ `ledgerMovements`; (2) responses of lessons review/retire/propose; (3) optional: an explicit administrator flag.
Resume: user says "build" after the backend confirms.

### Not done / next
1. **C5 Admin** tab: on hold, see the section above.
2. **Verify C1 live** (counts vs filters, restricted/merged/stale rows, Min. at risk, saved view
   save/edit/delete, "Opened by Flolyt" on a real auto-opened Room). Saved login had expired, so
   nothing was checked against the real API in a browser by me. Mutations (assign owner, view
   create/edit/delete) have never been submitted live.
3. **Room page: header PARTLY UNBLOCKED (2026-10-12), tabs NOT blocked.** `GET /api/v3/rooms/{roomId}`
   now exists (see "NEW HANDOFFS 2026-10-12"): the identity half of the header can be built; the figures
   strip (people, at risk open/now), owner name, labels, opening number and threat-tab gating
   (`threatConfirmationId`) are not in it. We still do NOT build on a "pick the Room out of the list"
   workaround. Tab bodies have their own per-room endpoints and are built one at a time.
4. Still unspecified: `/rooms/{roomId}/investigation`. (`/rooms/settings/investigations` is now
   specified, see the C5 section and rooms.md.) Scalar schemas still missing for most other new routes
   (monitoring, plan, verification, lessons items, ...). Scalar has no "Show Schema" toggle for the user,
   so item shapes of empty lists must come from the backend or a real row.
5. **Open backend tickets (user raising):** convening (`conditionLabel`, `ownerName`, `declineReason` +
   `decidedByName`, allowed values for `alertSeverity`/`outcome`), dissent (`judgedAtUtc`,
   `withdrawnAtUtc`, optional `roomStatus` values), subscriptions (restricted-room title/amount, a
   "keep watching" action), admin (item fields for balances/lessons/metrics arrays, lesson mutation
   responses, optional admin flag), single-Room endpoint. Mark DONE in the sections above when fixed.
6. **First real-use checks:** accept/decline a proposal, judge/withdraw an objection (and that
   `useAuth().user.id` equals a dissent `byUserId`), notify-level and unwatch on My load, picking another
   person on My load (member `id` assumed equal to the `userId` the route wants).

### Room page SHELL: BUILT 2026-10-11 (`npx tsc -b` and `npm run build` clean; layout checked on a deleted harness)
- `src/pages/rooms/room/index.tsx` (`RoomPage`, mounted at `/rooms/:roomId` in `route.tsx`; `room-stub.tsx`
  deleted): placeholder header card ("Waiting for GET /api/v3/rooms/{roomId}" + the room id in mono),
  nine tabs in design order, active tab in `?tab=` (default Briefing), each tab body a "being built" card.
- Shared tab bar `src/components/ui/underline-tabs.tsx` (`UnderlineTabs`, optional `badge` per tab), now
  used by both the Rooms page and the Room page; Rooms page re-checked, looks identical.
- The page fires `POST /rooms/{roomId}/opened` once per load (silent, idempotent daily stamp; keyed on the
  room id so tab switches don't re-fire). Unverified until really called with a login.
- Breadcrumb unchanged: topbar already shows "Rooms / Room" for `/rooms/<id>`.
- NEXT: Decision tab (ask the user for the real `GET /rooms/{roomId}/decision` response for the real Room
  `01a0fc76-a89c-7d41-899a-bba0214c9923` first), then the order below. Held for the endpoint: real
  header, header buttons (both variants), threat tabs, count badges, a unified not-found/restricted card.

### Room HEADER v1: BUILT 2026-10-12 (`npx tsc -b` and `npm run build` clean; layout checked on mocks of the real response)
- `src/pages/rooms/room/room-header.tsx` + `room/index.tsx`, from `GET /rooms/{roomId}` (service/hook
  `get-room.ts` / `use-get-room.ts`). Plain header, no card: title with chips (Recovering, Opening N, "Opened by
  Flolyt" when `threatConfirmationId`, Archived, Restricted), owner line (`ownerName` or italic Unowned, stage
  label, condition label as sent, market, currency), People / At risk at open / At risk now ("Live figure
  unavailable" when null, plus "Live figure computed HH:MM UTC" when known) with "A change in this figure isn't
  a recovery claim." Topbar breadcrumb = "Rooms / <title>". Loading = shaped skeleton; a 404 = "Room not found."
  card (backend message, Retry, Back to Rooms) with no tabs and no `opened` call. Auto-opened Rooms get
  Opening & monitoring and Plan & verification IN FRONT of the nine tabs (placeholders; default tab stays Briefing).
- **Watching menu** (the only header action in v1): the viewer's row from `GET /rooms/subscriptions`;
  "Watching · <level>" with Everything / Decisions only / Nothing (`POST /notify-level`) and Stop watching
  (`POST /unwatch`); an OWNER cannot mute, so "Nothing" is disabled with the reason and Stop watching is hidden;
  not watching shows a Watch button (`POST /watch`). Unverified live: all three writes from this menu.
- **Held for later steps:** "Restrict..." (dialog with the four fixed reasons, `POST/DELETE /restrict`),
  "Close room" (its own full page, `Room · Close.png`), "Open thread" (arrives with the thread panel), the
  "Worsened" chip (`threat-monitoring`), a "Merged into" notice (`mergedIntoRoomId`), restricted-room details
  (`restricted` shape on this route unseen beyond null). The design's "Live from the leakage map" wording was
  NOT used (the source of the live figure is not documented).

### Decision tab: BUILT 2026-10-11 (`npx tsc -b` and `npm run build` clean; layout checked on a deleted mock harness)
- `src/pages/rooms/room/decision/` (mounted in `room/index.tsx` for `?tab=decision`): decision card (status
  chip, "Revision N" from the highest `revisions[].number`, statement, Guardrails / Drafted by / Decided by,
  recipients as `class · what`), Mark-as-decided form (`POST /decision/decide`, button "Mark decided as
  <signed-in name>"), "Revise..." / "Draft the decision" dialog (`POST /decision`: new append-only
  revision, required "what changed", only changed fields sent), Revisions list (newest first),
  Objections panel (list from the same GET, Withdraw for own objections with confirm via
  `DELETE /rooms/dissent/{id}`, Record objection via `POST /decision/dissent`), What would change this
  (`POST /falsifiers`, `POST /falsifiers/{index}/met`).
- The user's real Room started fully empty (`statement` is `""`, not null; no revisions, objections,
  falsifiers or recipients). The user then created data through the UI (see "Live-verified" below); we
  never write to their Room ourselves and have no login.
- Left out, with `❌` comments: "Hand off obligations..." (no documented endpoint; the nearest is
  `outstanding` on `POST /close`, which is sent at close; `returnedObligations` in the plays response is
  a possible lead); recipient names (`userName` ticket); an "Agent" chip on Drafted by; "About: <play>"
  on objections and the "About a play" dropdown (need the Room's plays, `GET /rooms/{roomId}/plays`,
  items unseen; real response was `{ plays: [], pending, done, rejected, deferred, waitingOnPeople,
  returnedObligations: [] }`).
- Backend tickets (`GET /rooms/{roomId}/decision` unless noted): [ ] `userName` on `recipients`;
  [ ] optional `aboutProposalTitle` on `dissent` items; [ ] default `draftedByLabel` to the author's
  label when a person (not an agent) drafts. Question, not a ticket yet: what the design's "Hand off
  obligations..." calls.
- **Live-verified by the user 2026-10-11** on the real Room: draft (first revision), revise (revisions 2
  to 6), record objection, add falsifier, **mark as met** (two falsifiers show "Met 11 Oct, 18:46 UTC")
  and **mark as decided** (status became "Decided", `decidedByLabel` = `chad@yopmail.com ·
  Administrator`, decided-at shown) all wrote and read back correctly. The Withdraw button showed on the
  user's own objections, which confirms `useAuth().user.id` equals the objection's `byUserId`.
  The backend ALLOWS revising after the decision is marked decided (revision 6 was written afterwards).
  Real labels are combined strings (`byLabel` / `decidedByLabel` = `chad@yopmail.com · Administrator`);
  the "Mark decided as <name>" button uses the signed-in `user.name` instead ("Chad Sado"), so the two
  differ. STILL UNTESTED: **Withdraw** (clicking it and its confirm step), and the empty-`summary`
  refusal paths.
- Observed live: `draftedByLabel` stays `null` because our dialog never sends one and the backend does not
  default it, so "Drafted by" shows "—" even though each revision names its author in `byLabel`. Options
  put to the user: (1) leave it, (2) send the signed-in name on the first draft only, (3) backend
  default via ticket (recommended, with (1) meanwhile). Awaiting the user's choice.
- Objections and "What would change this" are `CollapsiblePanel`s (`decision/collapsible-panel.tsx`):
  collapsed by default (the count badge shows how many), the list scrolls inside `max-h-80`, and the
  input form sits outside the scroll area so it never scrolls with the list. Checked with 30 mock items.
  Each panel has its own color on its border, header and input footer: Objections amber, What would
  change this teal (`tone` prop); the "Record objection" and "Add" buttons use the primary blue. A met
  falsifier shows only the amber "Met <date>" badge (the row background tint was removed on request).

**Decision tab: COME BACK TO (nothing left out)**
1. "Hand off obligations..." (design: greyed until decided, "each one names a person and a proposed
   date"): left out entirely, no disabled button. No documented endpoint; nearest are `outstanding` on
   `POST /rooms/{roomId}/close` (sent at close) and `returnedObligations` in the plays response. Ask the
   backend/designer what it calls.
2. "About a play (optional)" dropdown on Record objection and the "About: <play>" line on each objection:
   the API already accepts `aboutProposalId` (uuid or null) on `POST /decision/dissent` and returns it on
   `dissent` items, but the form always sends null. Needs the Room's plays with titles
   (`GET /rooms/{roomId}/plays`, items unseen: the real response was empty). Add both together once the
   Plays tab exists or the user creates a play: searchable select with "The decision as a whole" first.
3. Recipient names on the "Who hears about it" chips (`class · what` only today): ticket `userName`.
   A recipient section only renders when `recipients` is non-empty, and there is no UI to SET recipients
   yet (the revise dialog omits them, which leaves them as-is); decide where recipients get edited.
4. "Drafted by": see the `draftedByLabel` options above. The design's "Agent" chip is not in the API.
5. Withdraw never clicked yet (button, confirm dialog, `DELETE /rooms/dissent/{id}`).
6. The Revise dialog does not send `draftedByLabel` or `recipients`; revise-after-decided is allowed by the
   backend, so decide whether the UI should warn that a decided decision is being revised.
7. Decision tab header is the shared Room placeholder: the "Revision N" chip is derived from the highest
   `revisions[].number` (display only) until a field exists.
8. Layout was checked on mock data (30 items, empty, full, mobile); the filled real-data layout was seen
   in the user's screenshots and looked right. Count badge on the Decision tab: none (n/a).

### NEW HANDOFFS 2026-10-12 (read these; they change earlier conclusions)
Two documents changed in `docs/rooms/`: `revenue-threat-room-frontend-handoff.md` was REPLACED by its newer,
longer version (it keeps every earlier line and adds direct Room loading, the Room-wide live feed, resolution-plan
routes, verification bodies, lessons/retire and conversation initiation; a temporary `-new` copy was merged
back into it on 2026-10-12 so there is one handoff, not two) and `room-live-collaboration-frontend-handoff.md`
(NEW: the React/Vite integration + acceptance for the live thread). They reference files NOT in this repo
(`room-live-collaboration-plan.md`, `conversation-threat-convergence-plan.md`, `examples/room-live-state.mjs`
and its test): ask the user for them.
1. **`GET /api/v3/rooms/{roomId}` now EXISTS** (real response in `docs/endpoints/rooms.md`). It gives title,
   `conversationId`, status, `ownerMemberId`, `viewerRole`, stage/mechanism keys, currency, market,
   lifecycleClass, leadAgentKey, agents, `mergedIntoRoomId`, `conversationPermissions`. It does NOT give
   people, at-risk open/now, owner name, labels, `openingNumber`/`isRecovering`, `threatConfirmationId`.
   So the REAL header can be built now for the identity half, with the figures strip and the threat-tab
   gating still waiting (ask the backend, or decide how to source them).
2. **The live thread is meant to be shown INSIDE the Room view** ("Open one Room and show its existing
   conversation"), with a Room-wide SSE feed: this corrects my earlier "Open thread just links to
   `/conversations/:id`". Layout (side panel vs a Thread tab) is not prescribed: user to choose. See the
   "Live thread plan" below.
3. Evidence for an earlier assumption: the same uuid `01a0f8e0-889e-7e5b-9b14-c5eb4c3a844c` is the user's
   `ownerMemberId`, dissent `byUserId`, revision `byUserId` and subscriptions `userId`, so a workspace
   member `id` is the user id (supports the My load picker assumption; verify with a second member).
4. Briefing: the handoff says "the briefing remains the investigation summary; use its existing route", but
   NO endpoint named briefing/summary exists in any doc. Candidate sources: `runs[].result` of
   `GET /rooms/{roomId}/runs`, the first system message of the Room conversation, and the unspecified
   `/rooms/{roomId}/investigation`; the rest of the Briefing is composed from existing tab endpoints.

#### Live thread plan (NOT BUILT; plan with the user, then wait for "build")
Read the existing chat panel code and `docs/chat-panel/` first (sibling repo `flolyt-dashboard`
`src/features/ai-agent` is the source pattern); reuse its message rendering (Markdown, handoff cards,
steering), replacing the per-run stream with the Room-wide feed. Steps: (1) service + hook for
`GET /rooms/{roomId}`; (2) bootstrap: Room + conversation history; (3) fetch-streaming SSE client with a
bearer token (CRLF/LF, multiline data, comments, chunk boundaries), backoff with jitter (1-15 s), one
subscription per mounted Room view, abort on unmount (Strict Mode), cursor stored per workspace/Room/
conversation and cleared on sign-out; (4) port the reference reducer (cursor checks, `messageId` upsert,
per-run buffers, handoff/steering/delivery-gap/revocation); (5) timeline UI keeping the causal order
(user message, its handoffs, Maestro acknowledgement, attributed specialist replies; use each message's own
`timestamp`, not the envelope `atUtc`); (6) composer: the mode switcher below, `@[agent:key]` mentions
(one responder), POST with `Accept: application/json`, `replyMode`; (7) 401 / 403-404 / 400 cursor / 5xx
handling and `room_access_revoked`; (8) acceptance with two real accounts. Risks: touches the working
chat panel (regression check), model usage in testing, proxy buffering and idle timeout, no second account
to test collaboration. Still to ask the user: the backend's reducer + test files (`room-live-state.mjs`).

#### Room page layout with the thread: DECIDED 2026-10-12 (user's choice, not built)
- **A side panel, not a tab.** The Room page becomes two areas: LEFT = the Room header + tab bar + the
  active tab; RIGHT = the live thread panel, always showing so people can converse while checking tabs.
- **The main app sidebar collapses when the thread is open** to make room. It must be a temporary
  override: `src/components/sidebar.tsx` stores its own collapsed state in local storage
  (`SIDEBAR_COLLAPSED_KEY`); opening the thread must not overwrite that saved preference, and closing the
  thread restores it. Needs a way for the Room page to ask the app layout to collapse the sidebar.
- **Decision tab spacing (open to a better layout):** it is two columns today (card + revisions | objections
  + falsifiers, right column 380px). With the sidebar collapsed and a ~400px thread, the content area is
  roughly 900px, which makes two columns cramped. Proposed: switch Decision (and later tabs) to a CONTAINER
  query on the tab area instead of the viewport, so below ~1000px of tab width it stacks to one column
  with the two collapsed panels (Objections, What would change this) directly under the decision card and
  Revisions last; collapsed by default they cost only two header rows.
- **Small screens:** a side-by-side panel cannot fit; below an `xl` width the thread becomes an overlay
  drawer opened from the header's "Open thread" button, and above it the panel is open by default and
  remembered per browser.
- The conversation is one reusable component (messages, handoff cards, composer with the mode switcher),
  so the same component serves the panel (and could serve `/conversations/:id`).

#### Live thread DESIGN: APPROVED by the user 2026-10-12 ("exactly something like that, perfect")
Reference mockup, self-contained HTML (light + dark, interactive): `docs/rooms/design/room-thread-panel-mockup.html`
(also published privately at https://claude.ai/artifact/4VMDfhc4N4ZXAij8TytpoA). It uses the app's own tokens
(ink/paper/line/ultra/teal/amber/rose, Instrument Sans, IBM Plex Mono, 3-8px radii). Build to it; the
decisions it encodes:
- Layout: Room header + tabs + tab on the left, a 400px thread panel docked right, always open on wide
  screens; the app sidebar becomes a 56px rail while it is open (full sidebar again when closed); a header
  "Open thread" button (with an unread count) reopens it; below 1100px it is a drawer opened from a floating
  "Thread" button; below 640px the sidebar is hidden. Decision shown stacked to one column in the narrow area.
- Panel header: title, Room name, a "Live" pulsing connection indicator (also the reconnecting state), a
  close button, and a ROSTER strip: people as solid initial circles, agents as DASHED ultra circles with
  3-letter initials and a state dot (running pulse, awaiting approval amber, idle grey) from `run_state`.
- Timeline: day separators; a "New" divider; a system notice card for the automatic opening; people messages
  (name, time, a teal "people only" tag and teal bubble for `replyMode: "none"`); agent messages (dashed
  avatar, name, Lead tag, white bubble with a blue outline, Markdown, clickable follow-up chips from
  `suggestedFollowUpPrompts`); handoff card (from -> to, brief, a four-step lane Queued / Running / Needs
  approval / Done with an animated current step); inline approval card (Approve / Reject; nothing runs until
  a person decides); steering note (dashed, right-aligned, with a Queued / Delivered receipt); a quiet
  "delivery gap" notice; a shimmering "<agent> is ..." working line from `progress` events; @mention chips.
  NOT in it on purpose (the backend has no such events): typing indicators, presence, reactions.
- Composer: a box whose border, mode button and Send button take the mode color (blue "Ask the agents",
  teal "Post to the people"); the mode button opens an explaining popover (icon, name, one-line
  explanation, check on the selected row, "Remembered for this thread on this browser"); the Send button
  names the mode; typing `@` opens an agent picker (roster from the Room's `agents`) and switches to
  "Ask the agents"; Enter sends, Shift+Enter for a new line; the mode is remembered per conversation id in
  local storage (try/catch, default "Ask the agents").

### ISSUES AND DEFERRED LOG (Room page, keep adding; mark DONE, never delete)
- [ ] **REMINDER: RE-VERIFY THE PEOPLE & GUARDRAILS TAB AGAINST THE REAL BACKEND** (built 2026-10-13; the real `guardrails` response held only Opt-out): run once for real and confirm the role change and approval-limit `PUT`, Remove, "Hand ownership to…" (`PUT /owner`), add/lift a room guardrail (and whether `POST /guardrails` returns a key or `null`), Restrict / open back up (`POST`/`DELETE /restrict`), the real `source` words in the "Added" column, a `by-its-author` guardrail, a "set elsewhere" one and a non-empty `stopped`. Ticket to raise: what is the unit of `maxApprovalReach` and what does `null` mean for an approver. Then mark DONE here and in `docs/endpoints/rooms.md`.
- [ ] **REMINDER: RE-VERIFY THE AGENTS & RUNS TAB WHEN REAL DATA EXISTS** (built 2026-10-13 from the REAL runs + investigation responses, which held only `done` runs): confirm against real data the rows for `failed` (cause in `failedBecause`), `cancelled` (`cancelledByUserId` name + `cancelReason`), `awaiting-approval`, `running` and `queued`, the roster `state` values, the `automatic` (arbiter) card and its undeletable rule, and the investigation `status` values other than `concluded` (running / paused / stopped, `stoppedBecause`). Then mark DONE here and in `docs/endpoints/rooms.md`. Ticket #57 (steps that stay open) is waiting on the backend.
- [ ] **REMINDER: RE-VERIFY THE PLAYS TAB WHEN REAL DATA EXISTS** (user's request 2026-10-13; built from the documented shape + the backend's hand-written sample). When a real play exists on a Room, paste `GET /rooms/{roomId}/plays` (Show Schema on) and re-check: (1) the real `basis` values and that `decisionOwnerName` is filled; (2) whether `wouldBreach` / `clear` in the collision check are counts or booleans (the card handles both); (3) the real `state` values of plays and of `returnedObligations` (unknown ones are plain grey chips); (4) what `notResolvable` means (its note is worded neutrally); (5) a real `returnedObligations` item (`fromName`, `toName`, `blocks`); (6) that the auto-run collision POST per selected play is acceptable; (7) a real `cited-dissent` response for a play. Then mark this DONE here and in `docs/endpoints/rooms.md` (GET /rooms/{roomId}/plays "Status").
- [x] **DONE 2026-10-12: the backend added all of these fields to `GET /rooms/{roomId}`** (real response in
  `docs/endpoints/rooms.md`): the header can now be built in full from that one call, and `threatConfirmationId`
  can gate the two threat tabs. (Original gap, kept for the record:) Header figures: the single-Room `GET /rooms/{roomId}` lacks people, at-risk open/now, owner name,
  `stageLabel`/`conditionLabel`, `openingNumber`, `isRecovering`, `threatConfirmationId`,
  `systemOpenedBy`, `restricted`. All are on the `GET /rooms` list row (real response 2026-10-12). Decision:
  do NOT read them from the list; leave them out with `❌` comments; ticket written (below). On the
  user's Room `conditionLabel` equals the raw key (`dormant_accounts`) and `stageLabel` is `ENGAGE`.
- [x] Threat-tab gating needs `threatConfirmationId`: now on `GET /rooms/{roomId}` (null on the user's Room, an
  ordinary one). The two threat tabs themselves (Opening & monitoring, Plan & verification) are still unbuilt.
- [ ] `/rooms/{roomId}/investigation`: DEFERRED by the user. Real response for the user's Room: HTTP 404,
  `{ data: null, messages: ["This room has no lead agent, so nothing investigates it. Staff one and the
  investigation starts within the minute."], succeeded: false }`. The route works; the page must show that
  message as a STATE (no lead agent), not an error; the success shape is unseen and needs a Room with a
  lead agent (staffing one starts an investigation = model credits; ask before doing it).
- [ ] `GET /rooms/{roomId}/runs` real response never captured (the user pasted the list by mistake; it
  would be empty for a Room with no agents anyway).
- [ ] Briefing has no summary endpoint (see "NEW HANDOFFS"); candidates: `runs[].result`, the first system
  message of the conversation, `/investigation`.
- [x] **FIXED by the backend 2026-10-12.** `GET /api/v3/conversations/01a0fc76-a891-7262-ae7e-935bfa25d226` now
  returns 200: `{ data: { id, title: "Dormant Accounts", messages: [], createdAt, lastMessageAt, activeRunId: null,
  ownerUserId, ownerName: null, isOwn: true, visibility: "Workspace", canContribute: true, canAdminister: true,
  threatInvestigationsTruncated: false } }`. New fields beyond our `AiConversationDetailDto`: `ownerUserId`,
  `ownerName` (null), `isOwn`, `visibility`, `canContribute`, `canAdminister`, `threatInvestigationsTruncated`
  (additive; types not updated yet). `messages` is EMPTY: a Room opened by a PERSON starts with no first message
  (no system synthesis, unlike an automatic Room), so the thread opens as an empty conversation and the user
  starts it with the Room's own `conversationId` (not yet tried). Original problem, kept for the record:
  `GET /api/v3/conversations/{id}` returned 404 for the user's Room's own `conversationId` (2026-10-12).
  Room `01a0fc76-a89c-7d41-899a-bba0214c9923` ("Dormant Accounts", opened 2026-10-02, owner/decision-owner,
  `conversationPermissions` all true) returns `conversationId` `01a0fc76-a891-7262-ae7e-935bfa25d226`;
  `GET /conversations/{that id}` answers HTTP 404 `{ data: null, messages: ["Conversation not found."],
  succeeded: false }`, with and without the `X-Flolyt-Agent-Contract: v3` header. `GET /conversations`
  (the list) is EMPTY for this account (so the list tells us nothing about Room conversations).
  Suspected: older Rooms have a `conversationId` but no stored conversation. NOT yet tried: a people-only
  `POST /conversations/messages` (`replyMode: "none"`) into that id (writes one message into the real Room,
  no model cost). Ticket text is in the chat; the thread UI must treat this as a state ("this Room has no
  thread yet"), and the live thread cannot be tested on this Room until a conversation exists.
- [x] **Conflicts tab BUILT 2026-10-12** (`npx tsc -b` and `npm run build` clean; layout checked on a deleted
  mock harness with the user's REAL `GET /rooms/{roomId}/conflicts` response plus mock escalated/settled
  conflicts): `src/pages/rooms/room/conflicts/` = `index.tsx` (tab, "N open · N settled", "Raise a conflict...",
  open list, "Settled" section with "Show settled conflicts"), `conflict-card.tsx` (open card with Open / Waiting
  on you chips, escalation note, the amber "These effects can't be compared" banner when `comparableEffect` is
  false, two reading cards, then the three action areas; settled card with Chosen / Not chosen), `reading-card.tsx`,
  `conflict-actions.tsx` (Choosing panel with a required reason, "Ask for a third reading", Escalate with a people
  picker), `raise-conflict-dialog.tsx` (the create form: summary + 2 to 5 readings; a reading is priced with a
  3-letter currency, or says why it cannot be). The Conflicts tab bar now shows the response's `open` count as a
  badge. Real response matched the documented schema exactly; the user raised a test conflict via Scalar, so a
  person CAN raise one with empty `evidenceClaimIds`.
  Left out with `❌` comments: the "Run in progress" chip on a third-reading question (no run state in the
  conflict response; docs do not say the POST starts a run; `runId` sent as null), supporting-claim LINKS (Evidence
  tab not built; plain count shown), an evidence-claim picker on the raise form (sends `[]`), the design's phrase
  "Both readings are supported by evidence" (false when `evidenceClaimIds` is empty, so not shown).
  Refinements 2026-10-12: the "These effects can't be compared" note is NOT in the card any more: it sits behind an
  info icon beside "Raise a conflict..." (the Leakage Map's notes pattern: amber with a count, hidden by default,
  slides open), and its sentence is built from the readings' own fields (the unpriced reading's
  `effectUnavailableBecause`, or the differing currencies), because the API returns only the boolean
  `comparableEffect`. The "Ask for a third reading" question list shows about three questions (`max-h-52`) and
  scrolls the rest, the question box stays fixed, and the Escalate card no longer stretches (`items-start`).
  Each OPEN conflict card is collapsible (decided 2026-10-12): it starts COLLAPSED to its header (Open / Waiting
  chips, title, "Raised by", escalation note); the whole header toggles, the readings, choose panel, third reading
  and Escalate live in the body. All start collapsed, including the first. SETTLED cards collapse the same way
  (header = title + "Settled by", body = the two readings and the reason), also collapsed by default. A
  per-READING collapse was tried and reverted: the user meant the conflict card, not each reading.
  Shared pieces added: `src/components/ui/collapse.tsx` (moved from the Leakage Map, which re-exports it) and
  `src/components/ui/notes-toggle.tsx` (the Leakage Map still has its own private copy; it could adopt this one).
  UNVERIFIED live: choose, third reading, escalate and the raise form's UI (the raise POST itself worked via Scalar);
  "Waiting on you" depends on `user.id` equalling `waitingOnUserId` (same uuid as the user's other ids).
- [ ] The live thread (placement decided above), the reducer files from the backend repo, `replyMode` and
  the mode switcher, the reply-mode preference ticket.
- [ ] Decision tab leftovers: see its COME BACK TO list.
- [ ] A second workspace member is needed to test collaboration and the My load picker.

**Ticket text (user to raise): "Add the Room header fields to `GET /api/v3/rooms/{roomId}`".** The Room page
header needs these fields; today they are only on each item of `GET /api/v3/rooms` (`data.rooms[]`).
Please add them, unchanged, to `data` of `GET /api/v3/rooms/{roomId}`, and leave the list as it is.
| Field | Type (from the real list response) | Currently on | Move/add to |
|---|---|---|---|
| `population` | int (37) | list item | single-Room `data` |
| `amountAtRiskAtOpen` | number or null (2618.985) | list item | single-Room `data` |
| `currentAmountAtRisk` | number or null | list item | single-Room `data` |
| `currentAmountComputedAtUtc` | date-time or null | list item | single-Room `data` |
| `ownerName` | string or null ("Chad Sado") | list item | single-Room `data` |
| `stageLabel` | string ("ENGAGE") | list item | single-Room `data` |
| `conditionLabel` | string ("dormant_accounts") | list item | single-Room `data` |
| `openingNumber` | int (1) | list item | single-Room `data` |
| `isRecovering` | bool | list item | single-Room `data` |
| `threatConfirmationId` | uuid or null | list item | single-Room `data` (decides the threat tabs and "Opened by Flolyt") |
| `systemOpenedBy` | string or null | list item | single-Room `data` |
| `restricted` | object or null (shape unseen) | list item | single-Room `data` (restricted info) |
The single-Room response already has `conversationId`, `status`, `ownerMemberId`, `viewerRole`, `stage`,
`mechanism`, `currency`, `market`, `lifecycleClass`, `leadAgentKey`, `agents`, `mergedIntoRoomId`,
`conversationPermissions`, `createdAtUtc`, `archivedAtUtc`.

### Room thread and collaboration (IMPORTANT, found 2026-10-11, NOT BUILT)
**What the designs show:** no Room tab has a chat box, thread or composer. "Open thread" appears ONLY on
the two auto-opened (threat) Room headers; the ordinary header on every other screen (Briefing, Decision,
Conflicts, Plays, Evidence, Agents & runs, People & guardrails, Cohort, Log) has only Watching / Restrict /
Close room. The user stressed the designs are a quick reference made from the endpoints, not a finished
app design, so the endpoints win.
**What the endpoints say (handoff "Messages and streaming" + `rooms.md`):**
- A Room's thread IS an ordinary AI conversation: every Room has a `conversationId` (nullable on the
  `GET /rooms` row; confirmed present on auto-opened Rooms via `room-opening`; also expected from the
  missing `GET /rooms/{roomId}`). The auto-opening synthesis is saved as the first message of it.
  Responses and specialist handoffs stay in that conversation (a shared people-and-agents timeline).
- Talk in it with `POST /api/v3/conversations/messages` `{ conversationId, message, replyMode }`:
  `replyMode: "auto"` (default) starts an agent run (routing: stored `@[agent:<key>]` mention, then
  `agentKey`, then a relevant rostered supporter, else the Room lead; several mentions need one chosen;
  unknown/off-roster/disabled agents refused); `replyMode: "none"` is people talking to people: saved with
  NO run and no model call, SSE emits `message_saved` and ends, JSON returns 200 without `runId`; show no
  typing indicator, refresh the shared timeline afterwards. JSON with a run returns 202 + `runId`
  (consume the run, do not expect a finished answer). History carries `authorUserId` / `authorName` on
  newly saved human messages (older ones unattributed). Never create another conversation to reconnect.
- The app already has the route `/conversations/:id` (`AiConversationDetailRoute`) and the chat panel;
  the handoff says to "navigate using existing Room and conversation routes".
**Decisions:**
1. Every Room (not only auto-opened) gets an "Open thread" action to `/conversations/:conversationId`,
   in the header, once the single-Room endpoint supplies `conversationId` (header is a placeholder now).
2. `replyMode` is NOT handled in our code: only the types exist (`ai-conversation-types.ts`:
   `ConversationReplyMode`, `replyMode` on the request, optional `authorUserId`/`authorName`); no
   composer sends it and nothing reacts to `message_saved`. Today every message goes out as `auto`, so a
   person cannot leave a message for teammates without an AI reply starting. Needed, as its OWN task
   (plan with the user first, then wait for "build"; touches the working shared chat panel so it needs a
   regression check): (a) a composer choice "to the agents" vs "to the people"; (b) the `none` path: no
   typing indicator, handle `message_saved` / the 200 without `runId`, refresh the timeline; (c) show
   `authorName` on people's messages; (d) `@[agent:key]` mentions and the multi-mention choice; (e)
   regression-check the existing chat panel and the changed JSON 202 path. Order: after the Room tabs, or
   earlier if the user prefers.
**UX decided 2026-10-11 (Room conversation composer; not built):** one conversation, one shared timeline,
so NO separate side comment panel: a MODE SWITCHER in the message box instead.
- The box shows the current mode as a button; clicking it opens a small popover that EXPLAINS each mode
  before you pick (reference: the user's screenshot of Claude Code's "Modes" picker: a title, one row per
  mode with an icon, a name and a one-line explanation, a check on the selected row, optional keyboard
  hint). Two rows: **Ask the agents** ("Your message starts an agent run and the answer comes back in
  this conversation. Mention an agent with @ to choose who answers.") and **Post to the people** ("Saved
  for the people in this Room. No agent runs and no model cost."). The Send button names the mode.
- Default: **Ask the agents** (today's behaviour). Typing `@` and picking an agent switches to it.
  People-only messages show the author's name and no typing indicator; agent replies stay distinct.
- Only in a Room's conversation (author fields exist for Room threads; a personal AI conversation has no
  other people). Open: how the app knows a conversation belongs to a Room.
- Remembering the choice: the backend stores nothing today (`replyMode` is sent per message), so remember
  it per conversation id in the browser (local storage, try/catch, falls back to the default). Precedent:
  only the sidebar collapsed state uses local storage; the Rooms filters are in the URL and saved views are
  on the backend. A synced preference needs a backend ticket (below); keep the browser memory meanwhile.
- **Backend ticket (user to raise):** "Add a saved reply mode for room conversations. `POST
  /api/v3/conversations/messages` takes `replyMode` (`"auto"` ask the agents, `"none"` people only) on
  every message and nothing stores the choice. Please add a per-user, per-conversation preferred reply mode,
  e.g. `GET` and `PUT /api/v3/conversations/{conversationId}/preferences` with `{ replyMode: "auto" |
  "none" }`, defaulting to `"auto"`; only the caller's own preference readable or writable."

**Other human-agent interactions seen in the designs (all structured, none free-form chat):** Conflicts:
"Ask for a third reading" (send back with a question, starts a run), choose reading A/B with a required
reason, Escalate to another person; Agents & runs: add/remove agent, approve or reject an agent's request;
Plays: a "Decides" person per play and an Obligations table between people; People & guardrails: roles,
add person, hand ownership; Log: records all of it, including a "Commented on the free-delivery play"
entry for which no tab has a comment box.
**Also found:** Closing is its OWN full page (`Room · Close.png`: "Back to the room", "Close: <title>",
four numbered steps), not a tab, so it needs its own route.
**Open questions:** does every Room (not only auto-opened) have a non-null `conversationId`? how does
`/conversations/:id` render a Room conversation? should an auto-opened Room's header really differ?

### Room detail page plan (agreed 2026-10-11)
**Approach:** the header is the only thing blocked. Build the Room page with a PLACEHOLDER header card
("Waiting for `GET /api/v3/rooms/{roomId}`"), then wire the tabs one at a time from their own per-room
endpoints (`docs/endpoints/rooms.md`). Whatever we leave out is recorded here and in `❌` comments so it
is implemented when the backend answers. Earlier wording "the Room page and every tab is blocked" was
too broad: the data of each tab does not depend on the missing endpoint; only the header and shell do.

**Shell (first step):** route `/rooms/:roomId` (replaces `room-stub.tsx`; list rows already link to it),
placeholder header, tab bar with the active tab in the URL (`?tab=`), per-tab "being built" cards,
topbar breadcrumb stays the generic "Room" (not the uuid) until the title is known.

**Tabs everywhere (decision):** the handoff never mentions hiding tabs, so EVERY Room gets all nine
ordinary tabs: Briefing, Decision, Conflicts, Plays, Evidence, Agents & runs, People & guardrails,
Cohort & overlaps, Log. The designs' threat-room screens (`Threat room · Opening & monitoring.png`,
`Threat room · Plan & verification.png`) show a shorter bar without Conflicts, People & guardrails and
Cohort & overlaps; treated as designer simplification (design is an idea source). Auto-opened Rooms
(`threatConfirmationId` non-null) additionally get two tabs IN FRONT: Opening & monitoring, Plan &
verification. Until the endpoint exists the bar shows the nine ordinary tabs only. Open question for
the designer/backend: should an auto-opened Room hide those three tabs? Hiding is a small change.

**Header variants (wait for the endpoint):** ordinary Room: Watching · <level> dropdown, Restrict...,
Close room. Auto-opened Room: "Opened by Flolyt" chip (blue, lightning) and a state chip ("Worsened"),
buttons "Open thread" (to `/conversations/:conversationId`) and "Close room". Earlier note that the
header always has "Open thread" was wrong: it only appears on the auto-opened variant. The header also
needs the viewer's notify level (subscriptions), restricted state, and role for Restrict/Close.

**Tab order of work:** Decision first (best documented), then Conflicts, Plays, Evidence, People &
guardrails, Cohort & overlaps, Log, Agents & runs; Briefing LAST (no endpoint of its own, composed from
conflicts/decision/plays/evidence/runs/investigation; `/investigation` unspecified); threat tabs after
the endpoint (they need `threatConfirmationId`; room-opening takes it as the investigation id; designs
carry "Response shape not yet confirmed" badges). Close flow: `Room · Close.png`, `close-preview` + `close`.
Count badges ("Conflicts 1", "Plays 2") are added when those tabs are built.

**Not-found / restricted:** each tab's own call returns the 404 for a missing, foreign or restricted Room,
so each tab shows its own error card until the shell can show one. The new designs have no such screen;
the old build had a "Room not found. Back to Rooms" card (`oldpages/rooms/room/room-layout.tsx`) and a
restricted gate (`oldpages/rooms/room/states/restricted.tsx`, mock data) to carry over with real data.

**Testing:** the user's account has a real Room ("Dormant Accounts",
`01a0fc76-a89c-7d41-899a-bba0214c9923`, from the My load response). Before each tab, ask the user for
the real response of that tab's endpoint for that Room (the docs have shapes, but real wins). A real
login must be supplied by the user; never bypass auth. Mutations stay unverified until really submitted.

### What the single-Room endpoint has to provide (answer given at end of session 1)
Mostly the header, plus a few things the shell needs on EVERY tab. Ask for the same fields as a
`GET /rooms` row (so `RoomListRowDto` can be reused), including: `title`, `status`, `isRecovering`,
`openingNumber`, `ownerMemberId`/`ownerName`, `stage`/`stageLabel`, `condition`/`conditionLabel`,
`currency`, `population`, `amountAtRiskAtOpen`, `currentAmountAtRisk`, `currentAmountComputedAtUtc`,
`restricted`, `mergedIntoRoomId`/`absorbedRoomIds`, `archivedAtUtc`, plus the two the shell cannot
live without: **`threatConfirmationId`** (decides whether the threat tabs exist and is the id for
`room-opening`) and **`conversationId`** (the header's "Open thread"). Same 404 for missing,
foreign or restricted-for-you as the other Room routes. Things the header shows that this call would
NOT cover, and where they come from instead: "Watching · everything" (the viewer's own notify level:
`GET /rooms/subscriptions`), the tab count badges "Conflicts 1" / "Plays 2" (the conflicts and plays
endpoints, or ask for counts on the Room), whether the viewer may Restrict or Close (roles come from
`GET /people`), and the "Worsened" chip (`threat-monitoring`).

### How we work (user's conventions seen these sessions)
- Plan first, then build ONLY after the user says "build"; answered questions are not a go-ahead.
- The design is an idea source; the API response wins. A designed field the API lacks stays as an EMPTY
  cell with a `❌ Backend does NOT provide: <field>` comment; nulls show "—"; unknown enums show the
  readable raw value in a plain grey chip. The user raises backend tickets: give ticket text that names
  the exact endpoint and field.
- Always name the endpoint when explaining; no native `<select>`.
- Never push unless asked in that turn; hand over the full commit command at the end of each task,
  single-line conventional commit, no AI attribution.
- When talking about a design, link the PNG and name the section.
- Don't build on a guessed response shape; flag truncated Scalar captures and ask for "Show Schema".
- No frontend business math; no bare-text loading/empty states (skeleton or bordered card).
- Verify with `npx tsc -b` and `npm run build`. For animation or layout, test on a throwaway harness
  page on a spare port with Playwright, then delete it and kill the server. The user's own dev server
  runs on port 3000: never kill it. Auth is never bypassed; the saved login in memory expires.
- Use the Write/Edit tools for long files; long shell heredocs failed twice. Never chain a risky
  command with `&&` and then write follow-ups as separate statements (a failed `git mv` once let
  later writes overwrite the live Rooms index).
- Windows: renaming a folder a dev server watches fails; moving the files one by one works.


## What the audit found (before any code)

1. **The V3 prefix migration is already done in code.** `ROOMS_BASE_URL`, `PLAYS_BASE_URL` and
   `AGENT_RUNS_BASE_URL` in `src/config/apiConfig.ts` all point at `/api/v3/...`. Only the prose in
   `docs/endpoints/rooms.md` still says `/api/flolyt/rooms` (header, line 3, and the `/plays` note on
   line 616). Fix the docs, not the code.
2. **No old Room endpoint conflicts with the new ones.** The handoff says request bodies, response
   contracts and access checks are preserved for the existing 62 operations. The new routes are all
   additive, so nothing existing needs removing. Two existing entries get *additive* fields (below).
3. **Two routes are named in the handoff but never specified:** `/rooms/{roomId}/investigation` and
   `/rooms/settings/investigations`. Ask the user for them, do not guess (see
   [[endpoint_docs_convention]]). Neither blocks anything below.
4. **`replyMode` is not in our conversation code yet.** `src/features/ai-conversations/ai-conversation-types.ts`
   has `agentKey` but no `replyMode`, and the JSON path now returns 202 + `runId` instead of a
   completed answer. That is a behaviour change to a shared hook, so it is its own step with its own
   regression check on the existing chat panel.
5. **Unreachable-route risk** ([[flag_unreachable_routes]]): the opening card, verification panel,
   lessons screen and metrics screen all need an in-app entry point. Each phase below names one.

## Step 0: docs only (no code)

- [x] Fix `/api/flolyt/...` to `/api/v3/...` in `docs/endpoints/rooms.md` (header + plays note).
- [x] Add a "Revenue threat Room (phases 5 to 9)" section to `rooms.md` for the 17 specified entries
      in the standard entry format. Mark all as `documented`.
- [x] Update `GET /rooms` entry: new nullable `threatConfirmationId`, `systemOpenedBy`; restricted
      rows omit them.
- [x] Update `docs/endpoints/README.md` Rooms row counts.
- [ ] Ask the user to confirm: any Scalar "Show Schema" captures for the new response shapes. The
      handoff gives field *names* for most responses but no full JSON examples. Per
      [[feedback_stop_on_truncated_endpoint_fields]], request/response bodies we can't see in full
      get flagged, not invented. Known thin ones: room-opening `baseline`/`plan`, threat-monitoring
      `updates[]`, verification `evidence`/`qualifications`, lessons list items, operator-metrics.

## Step 1: endpoint scaffolding (the "update or add" question): DONE 2026-10-10, `npx tsc -b` clean

Add only; update two existing. Service + hook per [[api_endpoint_style]], one file each under
`src/services/api/rooms/` and `src/features/rooms/`.

**Update (additive types only):**
- `get-rooms.ts` response type: `threatConfirmationId`, `systemOpenedBy` (both nullable).
- `POST /conversations/messages` request: add `replyMode: 'auto' | 'none'`; response gains optional
  `runId`, `agentKey`, `routingReason` on 202. Do not touch the SSE parser yet (Step 4).

**Add to `API_ENDPOINTS.ROOMS`:**

| Group | Constant | Method + route |
|---|---|---|
| Opening | `GET_THREAT_ROOM_OPENING` | GET `/threats/{investigationId}/room-opening` |
| Plan | `GET_RESOLUTION_PLAN`, `REVISE_RESOLUTION_PLAN` | GET / PUT `/{roomId}/resolution-plan` |
| Monitoring | `GET_THREAT_MONITORING` | GET `/{roomId}/threat-monitoring` |
| Verification | `CREATE_VERIFICATION_PLAN` | POST `/{roomId}/verification-plans` |
| | `GET_VERIFICATIONS`, `CREATE_VERIFICATION` | GET / POST `/{roomId}/verifications` |
| | `REVERSE_VERIFICATION` | POST `/{roomId}/verifications/reverse` |
| | `CLOSE_VERIFIED_CASE` | POST `/{roomId}/verified-case/close` |
| | `GET_VERIFIED_THREAT_BALANCES` | GET `/value/verified-threats` |
| Recurrence | `ACCEPT_THREAT_RECURRENCE` | POST `/threats/recurrences` |
| Lessons | `GET_THREAT_LESSONS`, `PROPOSE_THREAT_LESSON` | GET / POST `/threats/lessons` |
| | `REVIEW_THREAT_LESSON`, `RETIRE_THREAT_LESSON` | POST `/threats/lessons/review`, `/retire` |
| Metrics | `GET_THREAT_OPERATOR_METRICS` | GET `/threats/operator-metrics` |

Conventions to apply while scaffolding:
- Monitoring, verification and lesson-list GETs are paged or cursored: type `nextPage`,
  `nextPlansPage`/`nextResultsPage`, `asOfUtc`, `nextCursor` explicitly.
- Mutation ids that are client-generated UUIDs for idempotency (`verification-plans` `id`,
  `verifications` `id`): the hook must generate once per user intent and reuse on retry, not per
  render.
- Verify with `npx tsc -b` / `npm run build`, not bare `tsc --noEmit` ([[feedback_verify_with_real_build_command]]).

## Step 2: opening card (Phase 5), the first visible piece

Needs only `GET /rooms` additions + `room-opening`. Smallest slice that proves the contract.

- Entry point: a Room row with non-null `threatConfirmationId` in the `/rooms` index, and the
  existing inbox invitation (already carries the Room attachment, no inbox change).
- Render states `PENDING | READY | PENDING_HUMAN_ROUTING | PENDING_LEGACY_REVIEW | BLOCKED | PAUSED`
  with `reason`; no collaboration Room shown before `READY`.
- Attribution: "opened by Flolyt orchestration" from `systemActor`, never the assigned person.
- Baseline: every amount shown with currency, market, lifecycle, labelled "estimated exposure".
  No subtraction, no cross-currency sum, no "customers/accounts" wording, no range summing
  ([[feedback_no_frontend_business_math]]).
- Load the existing `conversationId` thread; the system synthesis is a status message, so no
  suggested-prompt chips under it.
- Legacy Room action scope-reconciliation message: show as-is, never auto-join.

## Step 3: resolution plan + monitoring (Phases 6 and 7, read side first)

- Plan panel in the Room: `GET resolution-plan`; render `proposalState` / `obligationState` from the
  live action-status rows only; `ownerAvailable=false`, `referencesAvailable=false`,
  `obligationOwnerMismatch=true` all show a "plan needs review" state.
- Plan editor (`PUT`) behind owner/admin: carry `expectedRevision`; on stale-revision failure, reload
  and tell the user, never retry blindly. Revision 0 means "no typed plan yet, owner can create".
- Monitoring panel: state, `currentExpectedLoss`, signed `changeFromOpening`, `pendingState` as
  "awaiting confirmation", `DATA_DEGRADED` amounts as unknown (null, never 0), `RESOLVED_CANDIDATE`
  still needs verification. Poll/refetch while the Room is open (no SSE this phase).
- Opening baseline stays visually separate from monitoring numbers.

## Step 4: messages and streaming (Phase 6 write side)

Highest regression risk, so it goes after the read-only work.

- Send `replyMode` on Room conversation messages. `none` = save-only: no typing indicator, no
  `final_response` wait, refresh timeline on `message_saved`.
- Handle `run_queued` carrying `agentKey` + `runId`; JSON path returns 202 + `runId`, follow
  `/runs/{runId}/stream`. Reconnect without resending the prompt.
- Show `authorName` on human messages in Room history; old messages stay unattributed.
- Re-run the existing chat panel and home composer after this change: they share the hook.
  Cross-check against [[flolyt_chat_panel_build]] verification notes.

## Step 5: verification panel (Phase 8)

Separate panel, never merged into monitoring. Roles matter, so gate by owner/admin and show
refusals plainly.

- Register plan (`campaign_holdout` needs campaign id + future whole-UTC-day window; at most 90 days,
  start within 30). `source_condition_review` allows empty `sourceId`.
- Results list from `GET verifications` (retain `asOfUtc` across both paging cursors; reversals
  render as overriding the original, never summed).
- Review form (`confounderReview` required, reviewer must differ from intervention author/owner).
- Money rule: only `acceptedAmount` is value. `PARTIALLY_VERIFIED` shows qualifications;
  `VERIFIED` with 0 is "resolved, no money claim"; `UNVERIFIED`/`FAILED` show none.
- Reverse + close-case actions; refetch both verification and case views after a reversal.
- Verified balances (admin): one card per market/currency/lifecycle/value-kind partition,
  follow `nextCursor`, no global total.
- Mutation flows are unverified until a real submit happens
  ([[feedback_mutation_flows_need_live_submit]]); a mocked pass will not catch the backend's
  independence and timing rules.

## Step 6: lessons, recurrence, metrics (Phase 9, admin-only, additive)

- Recurrence: accept action on a closed case (needs `expectedRevision`); new-case navigation via
  `episodeNumber` / `previousEpisodeId`, group by `stableFindingId`, act by case/Room id.
- Lessons review screen (admin): list with `evidenceStillValid`, `reusable`, `retirement`,
  `review.decision`, `outcomeStatus`, `qualifications` shown as separate facts. Propose / review /
  retire actions. `boundResolutionPlanId` null on a verification means "cannot support lessons":
  disable propose with the explanation, do not suggest re-verifying.
- Operator metrics (optional): window picker capped at 31 days, per-currency series, no summing,
  no inferred false-positive rate.
- Each needs an entry point (admin nav or Room header link), decided with the user before building.

## Status and handover (2026-10-10)

- **Branch:** `revenue-threat-room` (off `add-onboarding`). Pushed through step 1 plus the full `room-opening` types.
- **Step 0 DONE** (docs), **step 1 DONE** (16 services+hooks, `replyMode` and authorship types, `GET /rooms` fields; `npx tsc -b` clean).
- **`room-opening` response fully typed** from the Scalar schema, see the entry in `docs/endpoints/rooms.md`.
- **Stopped at:** step 2 as first written is SUPERSEDED, see "Revised approach" below. Awaiting go-ahead for Step A (decouple shared code), then B (archive), then C (rebuild). Nothing in the UI is built.
- **Corrected counts:** 16 new `/rooms` routes (76 operations total in code). Docs claimed 62 original but code has 60; the 2-operation gap is unexplained (compare against the live Scalar index to resolve).

### Step 2 decisions already agreed in discussion

- The "card" is a summary block at the top of the Room **detail** page for auto-opened Rooms, not an open-room request. The Room opens by itself.
- The list needs no extra call: `threatConfirmationId` non-null on a `GET /rooms` row = "Opened by Flolyt" marker. `threatConfirmationId` IS the `{investigationId}`.
- Call `room-opening` once, only when a Room with a `threatConfirmationId` is opened. Skeleton while loading, real error state, no mock fallback.
- Headline amounts: `baseline.openingState.exposure` (only object carrying currency+market+lifecycle together), labelled "Estimated exposure". Per-candidate `calculations[]` in an expandable section, ranges never summed. `evidence.facts[]` held for a later detail view.
- Handle null `baseline`/`plan`/`exposure` (pending). Other states than READY get a plain status message; no screen to reach pending openings (their ID source is the unanswered triage/audit question).
- Opening `plan.actions` are plain strings, distinct from the typed resolution plan (Phase 6).
- Tabs (plan, monitoring, verification) come in steps 3 to 5, not step 2. Admin lessons/metrics are separate routes (step 6).

### Everything needed to start step 2

Nothing else is required. Remaining open items do not block it: the unspecified `/investigation` and `/settings/investigations` routes, the Scalar schemas for the other 15 routes (needed before steps 3 to 6, not step 2), and the 60 vs 62 count.

## Revised approach (2026-10-10, supersedes step 2 as first written)

Found while reading the existing pages, which the plan above had not done:

1. **The Room detail page is entirely mock.** `src/pages/rooms/room/room-layout.tsx` resolves
   `:roomId` with `getRoom()` from the hardcoded table in `room/data.ts` (ids like
   `second-order-never-happened`). A real Room UUID from `GET /rooms` is not in that table, so every
   live Room opens to "Room not found". Only the list (`/rooms`), subscriptions, the opened stamp,
   owner reassignment and wizard steps 1 to 2 are wired (see `wiring-roadmap.md` Phase 1). Phase 2
   (Decision/Evidence/Log) and the thread/steering panels are unwired.
2. **The opening "card" therefore had nowhere to render.** It cannot be shown until the detail page
   loads a real Room. Note: there is no single-Room GET; the list row (`GET /rooms`) carries title,
   owner, status and amounts.
3. **Shared utilities live inside the Rooms feature**, which blocks archiving it:
   - `pages/rooms/format.ts` (`initialsFromName`, `agentInitialsFromName`, `formatRoomActivity`) is
     imported by 6 inbox files, `onboarding/agents/agent-card.tsx` and `playbooks/data.ts`.
   - `pages/rooms/types.ts` (`Actor`, `PersonRef`, `AgentRef`, `Tone` are shared; `RoomListRow`,
     `RoomStatus` are Rooms-only) is imported by `business-memory/data.ts` and `playbooks/data.ts`.
   - `pages/rooms/data.ts` (`REPEAT_DECAY`) is imported by `business-memory/data.ts`.
   - `pages/app-layout.tsx` calls `getRoom()` from `rooms/room/data.ts` to title the topbar
     breadcrumb for `/rooms/:id`. That reads mock data too, so a real Room has no breadcrumb title.
   Root cause: helpers began inside Rooms and were borrowed later; the earlier lifecycle archive
   moved files into Rooms instead of into a shared place.

### Design placement (agreed discussion, from the room detail screenshot)

Layout today: header (title, subtitle, "N agents" chip, avatars, "at risk" chip, Close room), then
three panes: **Live thread** (left), **Decision / Evidence / Log** tabs (centre), **Plays** (right).

- The backend's system synthesis message lives in the Room's conversation, so it appears as the
  first entry of Live thread once the thread is wired to the real `conversationId`. Not our card.
- The attribution + baseline goes in a **slim strip between the header and the three panes**, shown
  only for auto-opened Rooms (`threatConfirmationId` non-null): "Opened automatically by Flolyt",
  state, headline `baseline.openingState.exposure` per currency/market/lifecycle, labelled
  "at opening", plus a "View baseline" side panel (full baseline, per-candidate calculations with
  ranges/assumptions/caveats, draft plan).
- Not inside a pane: left is narrow conversation, centre Decision is the decision doc (empty on a
  fresh auto-opened Room), right Plays are proposals not the opening's draft plan.
- Conflict to avoid: the header's "at risk" chip is the live list figure; the baseline is the frozen
  opening estimate. Label the strip "at opening". For auto-opened Rooms the header subtitle must not
  say "customers/accounts" (handoff rule); the mock subtitle currently does.

## New design adopted (2026-10-10): `flolyt-figma-designs/New-pages-pattern/Flolyt Rooms-png/`

The user had all Room endpoints sent out for design (17 screens, reviewed in full). **Decision: use
this as the source of truth and build section by section, end to end, instead of the old mock.**
It supersedes the earlier "slim strip" placement above (the threat Room has its own tab now).

Why it is better than the old mock: it covers screens the old design never had (threat Room tabs,
Convening, Dissent ledger, My load, Admin) and the earlier gaps (link/merge, owner reassignment);
it drops the unbacked Live thread for an "Open thread" button; and it already carries the data
rules ("Stated, not checked", "Unavailable" not zero, per-currency money, "Response shape not yet
confirmed" badges on the same shapes we flagged with a red cross in code). The header's
"at risk at open / now" strip plus a separate Opening baseline tab removes the earlier at-risk
chip vs baseline conflict. Sample names in the PNGs (Kemi, Tolu) are placeholder data.

### Screen to endpoint map (inferred from the screens; verify each when its section is built)

| Screen (PNG) | Intended endpoints |
|---|---|
| Rooms index | `GET /rooms` (+ "Opened by Flolyt" chip from `threatConfirmationId`), `/rooms/views` (+POST/PUT/DELETE), `GET /rooms/convening` (queue badge), `PUT /{id}/owner` (Assign owner) |
| Convening queue | `GET /rooms/convening`, accept, decline |
| Dissent ledger | `GET /rooms/dissent`, judge, withdraw |
| My load, subscriptions | `GET /rooms/subscriptions`, `watch`, `notify-level`, `unwatch`, `opened` (person picker "Showing: Kemi": check the param) |
| Admin | `GET /value/verified-threats`, `GET/POST /threats/lessons` (+review, retire), `GET /threats/operator-metrics`, investigation turn budget (`/rooms/settings/investigations`, UNSPECIFIED) |
| Room header (all tabs) | list row fields; Watching dropdown (`watch`/`notify-level`/`unwatch`), `restrict`, Close, "Open thread" to `/conversations/:conversationId` |
| Room: Briefing | NO endpoint named; looks composed from conflicts, decision, plays, evidence, runs, close-preview. Confirm before building |
| Room: Decision & dissent | `GET/POST /decision`, `decide`, `decision/dissent`, `DELETE dissent`, falsifiers (create, `met`), `cited-dissent` |
| Room: Conflicts | `GET/POST /conflicts`, `choose`, `third-reading`, `escalate` |
| Room: Plays & collisions | `GET /{id}/plays`, `GET /plays/{id}`, `collision-check`, `cited-dissent`, obligations (`returnedObligations` in plays) |
| Room: Evidence | `GET /evidence`, falsifiers; "Connect source" links to datasources |
| Room: Agents & runs | `GET /runs`, `POST/DELETE /agents`, investigation controls (`/{id}/investigation`, UNSPECIFIED) |
| Room: People & guardrails | `GET/POST/PUT/DELETE /people`, `owner`, `GET/POST/DELETE /guardrails`, `restrict`/`unrestrict` |
| Room: Cohort & overlaps | `GET /cohort`, `merge-candidates`, `merge`, `unmerge`, `link`, `unlink` |
| Room: Log | `GET /log`, `log/export` |
| Room: Close | `GET /close-preview`, `POST /close`; `POST /reopen` |
| Threat room: Opening & monitoring | `GET /threats/{investigationId}/room-opening`, `GET /{id}/threat-monitoring` |
| Threat room: Plan & verification | `GET/PUT /resolution-plan`, `POST /verification-plans`, `GET/POST /verifications`, `reverse`, `verified-case/close` |

Threat tabs (Opening & monitoring, Plan & verification) appear first in the tab bar only for
auto-opened Rooms (`threatConfirmationId` non-null). Ordinary Rooms show Briefing first.

### User answers to the watch-outs (2026-10-10)

- **Unspecified `/investigation` and `/settings/investigations` routes:** user will send a Room id
  later, or we add a UI test that triggers the call and inspect the real response.
- **No single-Room endpoint: BLOCKER for the Room page.** The header fields (title, owner, stage,
  condition, currency, people, at risk open/now, status, opening number, `threatConfirmationId`,
  `conversationId`, restricted info) all exist on a `GET /rooms` row, so picking the Room from the
  list would technically work. **User decided NOT to build on that workaround**: they will ask the
  backend for a proper `GET /api/v3/rooms/{roomId}`. Until it exists, do not build the Room shell or
  any Room tab. Suggested ask: same fields as a list row (`RoomListRowDto`), plus the same 404 for
  missing/foreign/restricted, and the restricted-room shape. When the spec arrives, add it to
  `docs/endpoints/rooms.md` and scaffold it.
- **Briefing tab:** understood as the Room's front page that repeats items from other tabs
  (Decision, Conflicts, Plays, Evidence); built last. Only its Investigation box and Arbiter's
  conclusion have an unclear source (likely the unspecified investigation route).
- **Navigation:** Convening, Dissent, My load and Admin become tabs inside the Rooms page itself
  (not sidebar entries, not a top bar). Routes still flat, kebab-case, under the existing
  convention; confirm exact paths when built.
- **After archiving the old Rooms section:** start with the new Rooms list page (design:
  `Rooms · index.png`), a fresh build from the new design, not a copy of the old list. The archive
  step B needs no stub question any more: `/rooms` is rebuilt first.

### Rebuild order, updated for the blocker

1. Step A (decouple shared code), step B (archive `pages/rooms`).
2. **Rooms list** from the new design (unblocked: `GET /rooms` is wired and typed).
3. Convening, Dissent, My load and Admin as tabs inside the Rooms page (each unblocked by its own
   endpoints, except Admin's turn budget which needs the unspecified route).
4. **BLOCKED until the get-one-Room endpoint exists:** Room shell, threat tabs and every Room tab.

### Watch-outs raised on review

1. **Shell mismatch:** the PNGs show a dark top bar (Rooms, Convening, Dissent, My load, Admin);
   our app is a sidebar layout. Decide how Convening/Dissent/My load/Admin appear (flat top-level
   kebab-case routes per the URL convention).
2. **No single-Room GET.** The header (owner, people, at risk open/now) matches the list row, so
   the shell would read it from `GET /rooms`. Needs a decision or a backend answer.
3. **Briefing has no named endpoint** (see map).
4. **Two unspecified routes** appear in the design: Admin's "Investigation turn budget" and the
   "Investigation" cards on Briefing and Agents & runs.
5. **"Customers" wording** on Convening and Cohort vs the handoff rule that threat findings are
   not customers/accounts (the threat tab already respects it). Check each field's meaning when wired.
6. Several sections carry the design's own "Response shape not yet confirmed" badge (monitoring,
   resolution plan, verification, admin value/diagnostics): these need live manual testing, not
   just types.

### Rebuild order with this design (replaces Step C above)

1. Step A (decouple shared code), then B (archive `pages/rooms`).
2. Rooms index, then the Room shell (header + tab bar).
3. Threat tabs: Opening & monitoring, then Plan & verification.
4. Remaining tabs one at a time (Decision, Conflicts, Plays, Evidence, Agents & runs, People &
   guardrails, Cohort & overlaps, Log, Close, Briefing last since its source is unclear).
5. Top-level pages: Convening, Dissent ledger, My load, Admin.

### New working method: archive and rebuild section by section (user's call)

Same pattern as the Leakage V3 rebuild. Design follows the endpoints, not the old mock. Archived
copy is a reference to copy sections back from where they fit.

**Step A: decouple shared code (before any move).**
1. Move shared helpers to `src/lib/` (format helpers next to `format-measured-value.ts`) and shared
   types (`Actor`, `PersonRef`, `AgentRef`, `Tone`) to a shared types file; repoint inbox,
   onboarding, playbooks and business-memory imports.
2. Stop business-memory depending on the Rooms mock `data.ts` (`REPEAT_DECAY`).
3. Give the breadcrumb a real Room title source (small shared hook over the Rooms list/Room data),
   so `app-layout.tsx` no longer imports `getRoom`.
4. Verify with `npx tsc -b` / `npm run build`.

**Step B: archive.** Move `src/pages/rooms` to `src/oldpages/rooms`, update `src/oldpages/README.md`
(the earlier archive note says Rooms stayed live, update it), repoint `route.tsx`, `/rooms` shows a
stub meanwhile. Open decision: stub only, or restore the list immediately. Recommended: restore the
list straight away (it is the one piece already live against the real API).

**Step C: rebuild order.**
1. Rooms list (copy back from archive, already wired).
2. Room detail shell: resolve a real Room from the list data, header only, real breadcrumb title.
3. Opening strip + "View baseline" panel (original step 2, using `room-opening`, fully typed).
4. Then, flow by flow and endpoint by endpoint: Live thread on the real conversation (incl. step 4
   `replyMode`), plan + monitoring tabs (step 3), Decision/Evidence/Log, Plays, verification panel
   (step 5), admin lessons/metrics routes (step 6), and the older Room endpoints (people, guardrails,
   runs, close/reopen, merge, etc.) as each is reached.

Steps 3 to 6 above (plan/monitoring, messages, verification, lessons) are unchanged in content but
now land in the rebuilt Room, after Step C.2.

**Step A DONE 2026-10-10** (`npx tsc -b` and `npm run build` pass, not yet committed):
- `pages/rooms/format.ts` removed; its helpers now live in `src/lib/initials.ts`
  (`initialsFromName`, `agentInitialsFromName`) and `src/lib/format-activity.ts`
  (`formatRoomActivity`). Inbox (6 files), onboarding agent-card, playbooks, business-memory and
  the Rooms files import from there.
- `Actor`, `AgentRef`, `PersonRef`, `Tone` now live in `src/lib/actor-types.ts`;
  `pages/rooms/types.ts` re-exports them for the rest of the Rooms section until it is archived.
  Playbooks and business-memory import `AgentRef` from the lib.
- business-memory no longer imports the Rooms mock roster: `REPEAT_DECAY` is defined locally.
- `app-layout.tsx` no longer imports `getRoom`; the `/rooms/:id` breadcrumb shows a generic "Room"
  until the rebuilt Room page supplies its real title via `usePageBreadcrumb` (needs the
  single-Room endpoint).
- **Found for Step B:** files under `src/oldpages` (ai-teammates, campaigns, customer-health,
  experiments, replies, and others) still import from `@/pages/rooms/...`. When `pages/rooms` moves to
  `src/oldpages/rooms`, those imports must be repointed to `@/oldpages/rooms/...` (or the new lib
  files) so the project still compiles.

**Step B DONE 2026-10-10** (`npx tsc -b` and `npm run build` pass; not visually checked because the saved login expired and auth is never bypassed; not yet committed):
- All 46 files of `src/pages/rooms` moved with `git mv` to `src/oldpages/rooms`. A whole-folder
  rename failed ("Permission denied") because a vite dev server was watching it, so the files were
  moved one by one instead.
- 156 import lines repointed from `@/pages/rooms` to `@/oldpages/rooms`.
- New stub `src/pages/rooms/index.tsx`: `/rooms` and `/rooms/:roomId` show "being rebuilt" cards.
  Routes `/rooms/new`, `/rooms/subscriptions` and `/plays` removed; their breadcrumb branches removed.
- Services and hooks (`src/services/api/rooms`, `src/features/rooms`) are untouched and live.
- `src/oldpages/README.md` updated.
- **Dead ends until the Room page exists** (they now land on the Room stub): leakage-map "Open
  Room" links, inbox attached-room card, conversation response actions, home carousel,
  `map-suggested-action-target.ts`. Business-memory's "Open a room on the recurrence" link points at
  the removed `/rooms/new` and also lands on the stub.

**Step C1 BUILT 2026-10-10** (`npx tsc -b` and `npm run build` pass; NOT yet checked in a browser or against the real API because the saved login expired; not committed): new Rooms list at `/rooms` from `Rooms · index.png`, files in `src/pages/rooms/`: `index.tsx` (page, skeleton, empty/error states), `use-rooms-filters.ts` (all filters in the URL: q, state, currency, stage, condition, owner, min, archived), `stat-tiles.tsx` (4 state tiles that double as the state filter + "Behind stale rooms" per currency), `filter-card.tsx` (native selects; options derived from the workspace's own rooms; Min. at risk locked until a currency is chosen), `saved-views.tsx` (`GET/POST /rooms/views`, apply on click), `rooms-table.tsx` (restricted, merged, stale, unowned, recovering, "Opened by Flolyt" rows), `modals/assign-owner-modal.tsx` (copied back from the archive, `PUT /owner`), `room-stub.tsx`, `labels.ts`. Two queries: the whole workspace (counts, option lists, merge-target names) and the filtered list. `formatWholeMoney` added to `src/lib/format-measured-value.ts`.
- **Updated 2026-10-10 after a live response:** the API row has `currentAmountComputedAtUtc`, so the "live · HH:MM UTC" caption is now shown under the live amount; a null live figure reads only "Live figure unavailable" (the longer "cell is no longer computed" wording was a reason the API does not state).
- **Deliberately left out of the design:** the "Convening queue · N waiting" button (that page does not exist yet, add it with step C2); the creator name on shared saved views (`createdBy` format unknown); saved view edit/delete (added later the same day at the user's request: a hover-revealed pencil and trash on the user's own view chips, like the prompt box's toggle chips; the active view chip is now filled with the primary blue; both mutations still need a live submit); the red colour on a live figure above its opening figure (would compare two API fields).
- **Judgement calls:** row titles use the app's link style (ultra + hover underline) not the design's black; `restrictedBy` is only shown if it reads as a name, not an id; restricted reason keys are mapped to the four labels.
- **To verify live:** counts vs filters (do `total/open/...` describe the workspace?), `Opened by Flolyt` chips on real auto-opened rooms, restricted rows, merged rows, `Min. at risk` with a currency, saved view apply and save.

**Next: C2 Convening (then C3 Dissent, C4 My load, C5 Admin), as tabs inside the Rooms page.** Awaiting user go-ahead and a browser check of C1.

## Open questions for the user

1. Specs for `/rooms/{roomId}/investigation` and `/rooms/settings/investigations`.
2. Full response examples (or Scalar "Show Schema") for the thin shapes listed in Step 0.
3. Where do the verification panel and lessons screen live: new tabs on the Room, or standalone
   routes? (Flat kebab-case route convention applies either way, [[flolyt_flat_url_pattern]].)
4. Per [[archive_mock_data_branch]]: confirm whether any of this should be cherry-picked to
   `archive/mock-data` before API connection. Most of it is live-wired from the start, so likely n/a.
5. Is there a Phase 6 "multiplayer routing" follow-up we should expect? The handoff defers it.

## Suggested order

Step 0 (docs) -> Step 1 (scaffold) -> Step 2 (opening card) -> Step 3 (plan + monitoring) ->
Step 4 (messages) -> Step 5 (verification) -> Step 6 (lessons/metrics). One step at a time,
verified on the real backend before the next ([[feedback_build_incrementally_from_live_evidence]]).
