# Rooms — full wiring roadmap

Written 2026-09-08. Covers everything under `/rooms` (42 mocked screens, see
[[flolyt_rooms_rebuild]]) against the 62 documented endpoints in
[`docs/endpoints/rooms.md`](../endpoints/rooms.md), plus 2 workspace endpoints that turn out to
be load-bearing here. Today: **0/62 wired outside the new-room wizard's steps 1–2** (see
[`docs/rooms/create-room.md`](create-room.md) for that sub-doc, which stays the source of truth
for wizard-specific decisions — this doc is the umbrella plan for everything else, plus the
wizard's remaining 3 steps).

This is a plan, not a build log. Nothing below has been wired yet unless marked `[x]`.

## Critical gaps — surfaced by this review, not guessed

These need a decision or a backend answer before their phase can be called complete. Building
around them (with the gap visibly flagged in the UI, per
[[feedback_backend_gap_comment_convention]]) is fine; silently faking them is not.

1. **No approve / reject / edit endpoint for a play proposal.** The doc has `GET /plays/{id}`
   (read the approval screen) and the collision-check, but nothing that records a decision on a
   proposal — no `POST /plays/{id}/approve`, `/reject`, `/edit`, or similar. The three modals
   that already exist (`approve-reauth-modal.tsx`, `reject-play-modal.tsx`, `edit-play-modal.tsx`)
   are pure local UI today — `toast.success(...)` and nothing else. This blocks the single most
   important action in the whole feature (a war room exists to get a play approved). **Needs a
   backend answer before Phase 3 can be called done** — build the screens and modals against
   everything that *is* documented, wire the read side, and leave the submit calls stubbed with a
   visible "not yet available" state rather than a fake success toast.
2. **No endpoint for the live thread or steering actions.** `ThreadPanel` (the running
   agent-chat log + "Ask, or redirect the agent…" input) and `SteeringPanel` (turn/queued
   redirects/cost/elapsed + implied pause/redirect actions) have nothing backing them anywhere in
   `rooms.md` — not a GET to read the thread, not a POST to send a message or a redirect. This is
   plausibly a separate real-time channel (SSE/WebSocket) that hasn't been documented yet, since
   "agent narrates as it works" doesn't fit a request/response shape well. **Flag to the backend
   team explicitly** — until there's an answer, both panels stay on mock data, clearly out of
   scope for the wiring pass rather than silently skipped.
3. **`ClosedRoom` links to `/rooms/:id/reopen`, but no `reopen` route exists** in
   `route.tsx`'s room-children list (`close-out-route.tsx:41`). Independent of any endpoint —
   `POST /rooms/{roomId}/reopen` is documented and ready — this is just a routing bug: a page
   needs to exist at that path. Catch this in Phase 6 regardless of endpoint order.
4. **Two operations have no obvious screen anywhere in the built 42:**
   - `POST /rooms/{roomId}/link` / `DELETE /rooms/{roomId}/link/{otherRoomId}` — `merge-route.tsx`
     talks about linking ("linking, rather than merging, fixes that") but has no actual link
     button; `GET /rooms/{roomId}/merge-candidates` returns `alreadyLinked` per candidate, which
     only makes sense if a link action exists somewhere. Recommendation: add "Link instead" as a
     second action next to "Merge" on the merge-candidates screen — same screen, one more choice.
   - `POST /rooms/{roomId}/owner` (reassign owner) — no button calls this anywhere yet (the index's
     "Assign an owner" on the first-room banner is UI-only). Needs a home: likely the room header
     (workspace) and the index's unowned-room rows.
5. **Two brand-new screens are needed, not just wiring on an existing one:**
   - **Convening / proposals inbox** (`GET /rooms/convening`, accept/decline) — the product's own
     room-suggestion queue. Nothing in the 42 screens shows this. Needs a route + a nav entry
     point (sidebar, or a tab on the Rooms index).
   - **Cross-room dissent register** (`GET /rooms/dissent`) — "every objection across every room."
     Same situation: documented, nothing renders it.
6. **`POST /rooms/{roomId}/guardrails`'s response is ambiguous** (prose says it returns the
   lift-key, the live example shows `null`) — already typed `string | null` per `rooms.md`; note
   carries into the guardrails UI as "may not get a key back," not a blocker.
7. **Step 3 of the wizard (people/agents) is answered, contradicting `create-room.md`'s "open
   question."** `docs/endpoints/workspace.md` has `GET /api/flolyt/workspace/members` (unified
   human+agent roster) and `GET /api/flolyt/workspace/agents` (the 13 specialist agents) — both
   already wired (service+hook exist, `Status: wired`, just no screen consumes them yet). These
   are the right source for Step 3's people/agent pickers, and very likely for the room People
   tab's invite-modal candidate list too. Will update `create-room.md` once Step 3 is actually
   built — **now itself on hold, see gap #8**.
8. **No `GET /rooms/{roomId}` single-room read endpoint exists.** Confirmed by grepping all 62
   operations — there is no endpoint that resolves a bare `:roomId` to the room's own identity
   (title, status, currency, population, `currentAmountAtRisk`, `ownerName`, `agents[]`,
   `humans`). `RoomLayout`'s current pattern (`getRoom(roomId)` once, provide as context to every
   subpage via `useRoomContext()`) has nothing real to call. Some per-tab endpoints carry
   `roomTitle` (`log`, `evidence`, `plays`) and some don't (`decision` has no `roomTitle` at all),
   so there's no reliable single source even by piecing tabs together — and none carry the
   richer identity fields the shared `WorkspaceHeader` needs (agents chip, avatar stack, at-risk
   chip). **This blocks Phase 2 more than it looked from the per-endpoint review alone** — either
   the backend needs a room-detail endpoint, or the shared chrome has to be re-architected to
   source identity from the `GET /rooms` list row the user navigated from (fragile on a direct
   deep link / refresh) instead of a `RoomLayout`-level fetch. Doesn't block Phase 1 — nothing
   there needs to resolve a single room's full identity.
9. **Team decision (2026-09-08): rooms open by chat request, not a manual wizard.** An agent
   opens the room from a chat conversation; there isn't meant to be a manual "open a room
   yourself" multi-step flow. This puts the whole of Phase 8 on hold — see that phase's own
   section for the specific open questions (keep `/rooms/new` as a fallback vs. remove it; does
   the chat flow still call `POST /rooms/new` under the hood). Nothing here is decided yet, and
   nothing should be built against the old wizard-completion plan until it is.

## Phase plan

Ordered by what makes the feature *usable* soonest — read a room and see what's in it (Phase 1–2)
before the deeper single-purpose screens (guardrails, runs, merge). Each phase should get its own
section (or a new file, if it grows) in this doc as it starts, per
[[feedback_per_feature_build_plan_docs]] — decisions, corrections, and the "why" as they happen,
not just a checkbox flip.

### Phase 1 — Rooms index, saved views, subscriptions — **[x] wired 2026-09-08**

- `index.tsx` (R01–R05, all 5 states) → `GET /rooms`, using `q`/`state`/`includeArchived`. R01/R02
  detection uses a separate `includeArchived: true` call (workspace-wide total), independent of
  whichever tab is active — see `room-list-adapter.ts` for the DTO → view-row mapping.
- Saved views: `GET`/`POST /rooms/views` wired (read on the search view + a new "Save this view"
  modal). **`PUT`/`DELETE` stay unwired** — the mocked build never had an edit/delete affordance
  either, so there's nothing to wire them to yet.
- `subscriptions.tsx` → `GET /rooms/subscriptions`, `POST /notify-level`, `POST /unwatch` (all
  wired). `POST /watch` has no call site yet — nothing in the built screens *starts* watching a
  room from scratch (only mute/unmute an existing subscription, or stop watching one).
- `POST /rooms/{roomId}/opened` fires on every room-detail mount (`room-layout.tsx`), fire-and-forget.
- `PUT /rooms/{roomId}/owner` — built a minimal `AssignOwnerModal` (new file,
  `modals/assign-owner-modal.tsx`), sourced from `GET /workspace/members` (human, active only) —
  no "suggested owner" endpoint exists, so it's a plain searchable picker, not a curated list.
  Wired from the index's "No owner" chip (main table + stale table) and the first-room banner.

**Decisions made this pass:**
- **Owner avatars render neutral, no department color** — `GET /rooms` gives only
  `ownerMemberId`/`ownerName`, no department. User confirmed: don't join against
  `GET /workspace/members` just for color: `OwnerCell` renders a plain `PersonAvatar`, bypassing
  `ActorAvatar`/`PersonDot` (both require a full `PersonRef` with `department`). Added a new
  `OwnerRef` type (`types.ts`) for this bare id/initials/name shape.
- **`RoomListRow.market` was dropped** — no field on `GET /rooms` backs the mock's "Market"
  column (NG/GH/KE/UK codes); `currency` is not the same thing. Column removed from the search
  view rather than left blank.
- **The stale tab's per-row "why it stopped" and "suggested" text is now generic, derived from
  `stoppedBecause`'s real 4-value enum**, not the mock's invented per-row narrative (dates, team
  names) — see `room-list-adapter.ts`'s `STOPPED_BECAUSE_LABEL`/`STOPPED_BECAUSE_SUGGESTION`.
- **The index's row `stateLabel`/`stateTone` is derived from real fields** (`status`,
  `isRecovering`, `needsYou`, `ownerMemberId`, `agents.length`, and — for closed rooms —
  `outcomeKind`), not asserted. Flagged as an assumption pending live confirmation, particularly
  the "closed but no `outcomeKind`" fallback and whether `open`/`recovering`/`stale`/`archived`
  counts in the response are workspace-wide regardless of the request's own `state` filter (the
  `StateTabs` UI needs them to be, to show all 4 tab counts while only one tab is being fetched).
- **`atRisk` renders "unavailable" in amber when `currentAmountAtRisk` is `null`**, plain ink
  otherwise — no magnitude-based color tone (rose/amber by size) was invented, since nothing in
  the response states a severity threshold; that would have been frontend business judgment, not
  a read of real data.
- **The sidebar's "Rooms" badge is now live** (`GET /rooms`, default open-only, count of
  `needsYou`), overridden at render time in the nav-item loop rather than restructuring the
  shared `NAV_SECTIONS` array other domains still read statically from.
- `data.ts`'s dead mock exports (`ROOM_INDEX`, `getRoomIndex`, `getRoomListRow`,
  `getRoomListCounts`, `getRoomsNeedingApproval`, `SAVED_VIEWS`, `SavedView`) were deleted — the
  named `PersonRef`/`AgentRef` constants (`IFEOMA`, `REPEAT_DECAY`, etc.) stay, since dozens of
  other still-mocked feature domains import them as a shared identity roster.
- **The empty state's "What is happening while you wait" per-source read-progress table was
  removed entirely, not left mocked.** User hit R01 live (a genuinely empty workspace) and asked
  whether it called an endpoint — it didn't. Checked `docs/endpoints/datasources.md` in full:
  `GET /datasources/connected` gives real connected/not-connected status + a running sync record
  count, but nothing gives a rows-read-of-total fraction, a "first full read" ETA, or which
  agents are waiting on a source (that's rooms/agent knowledge the datasources domain wouldn't
  have). Partial-wiring the two real fields and leaving the other three invented was rejected —
  user said remove the table outright. Deleted from `index.tsx`, plus the now-dead
  `EMPTY_STATE_SOURCES`/`SourceReadRow` mock export from `index-content.ts`. **General lesson:**
  reaching a previously-unreachable mock state during live testing can surface fake data that was
  always there but never visible — worth a second pass over `EmptyState`-style branches
  elsewhere once they become reachable too, not just the screens actively being wired.
- **`npx tsc -b` and `npm run build` both clean.** Not yet exercised against a live authenticated
  session — user is testing this pass directly.

### Phase 2 — Room workspace core: Decision / Evidence / Log
- `room-home-route.tsx` / `RoomEvidenceRoute` / `RoomLogRoute` (`workspace.tsx`'s `CenterPanel`)
  → `GET/POST /rooms/{roomId}/decision`, `POST .../decision/decide`; `GET
  /rooms/{roomId}/evidence`, `POST .../falsifiers`, `POST .../falsifiers/{index}/met`; `GET
  /rooms/{roomId}/log`, `GET .../log/export`.
- `ThreadPanel` + `SteeringPanel` stay mocked — see gap #2.

### Phase 3 — Plays: board, single-play approval, collision, cross-room dashboard
- `plays-board-route.tsx` → `GET /rooms/{roomId}/plays`.
- `one-proposal-route.tsx` → `GET /plays/{proposalId}`; `cited-dissent` panel →
  `GET /rooms/{roomId}/cited-dissent`.
- `collision-route.tsx` → `POST /rooms/{roomId}/proposals/{proposalId}/collision-check`.
- `plays-at-scale/index.tsx` (cross-room dashboard) → `GET /plays`.
- Approve / reject / edit actions: see gap #1 — read side wires fully, submit side stays flagged
  until there's a backend endpoint.

### Phase 4 — Conflicts and dissent
- `conflict-route.tsx` → `GET/POST /rooms/{roomId}/conflicts`, `POST
  /rooms/conflicts/{conflictId}/choose`, `/third-reading`, `/escalate`.
- `dissent-route.tsx` → `POST /rooms/{roomId}/decision/dissent`, `DELETE
  /rooms/dissent/{dissentId}`, `POST /rooms/dissent/{dissentId}/judge`.
- New screen: cross-room dissent register (`GET /rooms/dissent`) — see gap #5.

### Phase 5 — Guardrails, runs, people
- `guardrails-route.tsx` → `GET/POST/DELETE` guardrails. Render "stated, not enforced" honestly
  per the endpoint's own notes.
- `runs-route.tsx` → `GET /rooms/{roomId}/runs`.
- `people-route.tsx` + `invite-people-modal.tsx` → `GET/POST/PUT/DELETE /rooms/{roomId}/people`,
  `POST/DELETE /rooms/{roomId}/agents`; invite-modal candidate list sources from
  `GET /workspace/members` + `GET /workspace/agents` (gap #7).

### Phase 6 — Cohort, close, reopen, restrict
- `cohort-route.tsx` → `GET /rooms/{roomId}/cohort`.
- `close-out-route.tsx` → `GET /rooms/{roomId}/close-preview` (prefill the 5-outcome form) +
  `POST /rooms/{roomId}/close` (submit).
- Reopen: add the missing route (gap #3), wire to `POST /rooms/{roomId}/reopen`.
- Restrict/unrestrict: `POST/DELETE /rooms/{roomId}/restrict` — confirm where the "Restrict"
  action itself lives (not obviously present in the current room header) before wiring.

### Phase 7 — Merge, unmerge, link
- `merge-route.tsx` → `GET /rooms/{roomId}/merge-candidates`, `POST /rooms/{roomId}/merge`,
  `POST /rooms/{roomId}/unmerge`.
- Add the missing "Link instead" action (gap #4) → `POST /rooms/{roomId}/link`,
  `DELETE /rooms/{roomId}/link/{otherRoomId}`.

### Phase 8 — New-room wizard, steps 3–5 — **ON HOLD, likely dropped**

**2026-09-08 team decision: rooms will be opened by requesting one in chat — an agent opens the
room from that conversation. There is not meant to be a manual multi-step "open a room yourself"
wizard.** This changes the shape of Phase 8 entirely; do not build steps 3–5 against the plan
below until this is resolved. Open questions to settle before touching this phase again:

- Does `/rooms/new` (the wizard UI, steps 1–2 already wired per `create-room.md`) get removed
  outright, or does it stay as a rarely-used manual fallback behind the chat-first flow? The
  index's own copy already hints at this ("You do not need to create a room to get value. Most
  people here never create one.") — a chat-based open may just be the *primary* path the index's
  "New room" button should point at, rather than deleting the wizard.
- If a chat-driven open still calls `POST /rooms/new` under the hood (agent fills the same body
  the wizard would have submitted), the wizard's per-step field mapping already documented in
  `create-room.md` stays useful as a reference for what the chat flow needs to collect/infer —
  just not as UI to build.
- `POST /rooms` (open-room-on-leakage-cell) is a separate entry point from a leakage-map cell,
  not part of the wizard — unaffected by this decision either way, still needed wherever "open a
  war room" is offered from the leakage map.

Original plan, kept for reference until the above is settled:
- Step 3 (people/agents) → `GET /workspace/members` + `GET /workspace/agents` (gap #7 resolves
  the doc's open question).
- Step 4 (settle) → plain fields on `POST /rooms/new`'s body, no supporting GET needed.
- Step 5 (review/duplicate/submit) → `POST /rooms/new/similar` (final check), `POST /rooms/new`
  (submit), `POST /rooms/{roomId}/link` if the user picks "link instead of open."

### Phase 9 — Convening / proposals inbox (new screen)
- `GET /rooms/convening`, `POST /rooms/convening/{proposalId}/accept`, `/decline`.
- Needs a new route + a nav/entry-point decision (sidebar item, or a tab on the Rooms index) —
  see gap #5.

## Screen-by-screen coverage tracker

| Screen / route | Endpoint(s) | Phase | Status |
|---|---|---|---|
| `/rooms` (index, 5 states) | `GET /rooms` | 1 | **[x] wired** |
| Saved views (on index) | `GET/POST /rooms/views` | 1 | **[x] wired** (PUT/DELETE still unwired — no edit affordance) |
| `/rooms/subscriptions` | `GET /rooms/subscriptions`, notify-level/unwatch | 1 | **[x] wired** (`POST /watch` has no call site — nothing starts a fresh watch) |
| Room mount (opened stamp) | `POST /rooms/{id}/opened` | 1 | **[x] wired** |
| Owner reassignment | `PUT /rooms/{id}/owner` | 1 | **[x] wired** — new `AssignOwnerModal` |
| `/rooms/:id` (Decision) | `GET/POST /rooms/{id}/decision`, `.../decide` | 2 | not wired |
| `/rooms/:id/evidence` | `GET /rooms/{id}/evidence`, falsifiers create/met | 2 | not wired |
| `/rooms/:id/log` | `GET /rooms/{id}/log`, `.../log/export` | 2 | not wired |
| Thread panel / Steering panel | none documented | 2 | **blocked — gap #2** |
| `/rooms/:id/plays` | `GET /rooms/{id}/plays` | 3 | not wired |
| `/rooms/:id/plays/:playId` | `GET /plays/{id}`, cited-dissent | 3 | not wired |
| Approve/reject/edit a play | none documented | 3 | **blocked — gap #1** |
| `/rooms/:id/collision` | `POST .../collision-check` | 3 | not wired |
| `/plays` (cross-room) | `GET /plays` | 3 | not wired |
| `/rooms/:id/conflict/:conflictId` | `GET/POST /rooms/{id}/conflicts`, choose/third-reading/escalate | 4 | not wired |
| `/rooms/:id/decision/dissent` | dissent create/withdraw/judge | 4 | not wired |
| Cross-room dissent register | `GET /rooms/dissent` | 4 | **new screen — gap #5** |
| `/rooms/:id/guardrails` | `GET/POST/DELETE` guardrails | 5 | not wired |
| `/rooms/:id/runs` | `GET /rooms/{id}/runs` | 5 | not wired |
| `/rooms/:id/people` + invite modal | people CRUD, agents add/remove, workspace members/agents | 5 | not wired |
| `/rooms/:id/cohort` | `GET /rooms/{id}/cohort` | 6 | not wired |
| `/rooms/:id/close` | `GET .../close-preview`, `POST .../close` | 6 | not wired |
| Reopen a closed room | `POST /rooms/{id}/reopen` | 6 | **route missing — gap #3** |
| Restrict / unrestrict | `POST/DELETE /rooms/{id}/restrict` | 6 | not wired, action UI unconfirmed |
| `/rooms/:id/merge` | merge-candidates, merge, unmerge | 7 | not wired |
| Link / unlink | `POST /rooms/{id}/link`, `DELETE .../link/{other}` | 7 | **no button yet — gap #4** |
| `/rooms/new` steps 1–2 | leakage-map vocab, estimate, similar, currency | 8 | **[x] wired**, but whole wizard's future is in question — see gap #8 |
| `/rooms/new` step 3 (people) | `GET /workspace/members`, `/workspace/agents` | 8 | **on hold — gap #8** |
| `/rooms/new` step 4 (settle) | none (form-only) | 8 | **on hold — gap #8** |
| `/rooms/new` step 5 (review/submit) | `POST /rooms/new/similar`, `POST /rooms/new`, `POST .../link` | 8 | **on hold — gap #8** |
| Open room from leakage-map cell | `POST /rooms` | 8 | not wired, call site outside `/rooms` — unaffected by gap #8 |
| Convening / proposals inbox | `GET /rooms/convening`, accept/decline | 9 | **new screen — gap #5** |

## Open questions

- Backend: is there (or can there be) a `GET /rooms/{roomId}` single-room read, for the shared
  workspace chrome to resolve identity from (gap #8)?
- Backend: what covers the live thread and steering actions (gap #2)? A separate real-time
  endpoint set, or not built yet?
- Backend: what's the actual endpoint for approve/reject/edit on a play proposal (gap #1)? This
  blocks the single highest-value action in the feature.
- Product/design: where should "Restrict this room" live in the UI — it's documented on the
  backend but no current screen has a visible entry point for it.
- Product/design: confirm the "Link instead" placement on the merge-candidates screen (gap #4) is
  the right call before building it.
- Product/design: sidebar vs. Rooms-index-tab for the new convening inbox and the cross-room
  dissent register (gap #5) — both are net-new nav surfaces, not just new routes.
