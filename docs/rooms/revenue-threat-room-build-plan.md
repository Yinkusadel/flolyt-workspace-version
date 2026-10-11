# Revenue threat Room: build plan

Written 2026-10-10. Source contract: [revenue-threat-room-frontend-handoff.md](revenue-threat-room-frontend-handoff.md)
(backend phases 5 to 9). Endpoint source of truth stays [`docs/endpoints/rooms.md`](../endpoints/rooms.md);
this doc is the umbrella plan, not a build log. Nothing below is built unless marked `[x]`.

## CURRENT STATE (read this first; updated 2026-10-11, C2 Convening tab done and pushed)

Everything below this section is the history of how we got here. Where an older section disagrees
with this one, this one wins.

**Branch:** `revenue-threat-room` (off `add-onboarding`), pushed, last commit `4b957ba` (C2 Convening tab).

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

### Not done / next
1. **C3 Dissent, C4 My load, C5 Admin** tabs (same tab shell, screens in the same PNG folder).
2. **Verify C1 live** (counts vs filters, restricted/merged/stale rows, Min. at risk, saved view
   save/edit/delete, "Opened by Flolyt" on a real auto-opened Room). Saved login had expired, so
   nothing was checked against the real API in a browser by me. Mutations (assign owner, view
   create/edit/delete) have never been submitted live.
3. **BLOCKED: the Room page** (header, tab bar, every Room tab, the threat tabs, Briefing). Needs a
   single-Room endpoint `GET /api/v3/rooms/{roomId}`; the user is asking the backend. We chose NOT to
   build on a "pick the Room out of the list" workaround.
4. Still unspecified: `/rooms/{roomId}/investigation` and `/rooms/settings/investigations`;
   Scalar schemas for the other 15 new routes (monitoring, plan, verification, lessons, metrics...).

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

### How we work (user's conventions seen this session)
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
