# Inbox — build plan

**Steps 1–7 wired and live-verified 2026-09-18** (drafts, step 8, stays blocked — see below).
`src/pages/inbox/` was fully rebuilt against the real endpoints in the same session that wrote
the audit below; the audit section is kept as-is since it's still the record of what changed and
why, not just history.

## What's live as of 2026-09-18

Verified against `ichigo@yopmail.com`'s real inbox (117 items: 2 `Proposal`, 28 `Finished`, 87
`Notification`; groups `NeedsYou`/`Finished`/`Systems` populated, `Mentions` present at 0) via a
logged-in Playwright pass, zero console errors throughout:

- **List pane** — real grouped sections (dynamic on whatever `group` values come back, not a
  fixed 3-bucket layout), per-`kind` row styling, tab badges (`Unread`, `Approvals`) computed from
  a parallel `filter: "All"` fetch so they stay stable across tab switches, `Approvals`/`Mentions`
  tabs confirmed server-filtering correctly (`Mentions` showed the real "No mentions" empty state,
  not the old hard-stubbed one).
- **Read-on-select** — confirmed live: the `Unread` badge decremented by one on each real row
  click (`POST /inbox/read` firing correctly).
- **Approval view** — confirmed live against a real room-less proposal (`room: null`): the
  "Raised outside any room" fallback rendered, `Customers` fell back to `framing.reach` correctly,
  `At risk` showed `—`. Accept/Hold/Reject render correctly (wired to the `ai-proposals` domain,
  see the correction below) and the Snooze menu opens with 3 preset durations — **none of the
  four actions were actually clicked**, to avoid deciding/snoozing a real pending proposal in a
  live account without being asked to.
- **Compose** — multi-recipient picker confirmed loading real workspace members (excluding
  already-added ones as you add more) and a real room-attach picker (this account had 0 open
  rooms, so it correctly showed "No results" rather than erroring). Send itself wasn't fired, for
  the same reason as above.
- **Notice view** — confirmed live for `Finished`/`Notification` kind items, including a much
  larger real sample (117 full items pasted by the user 2026-09-18) — see findings below.
- **Thread view + reply — now live-verified 2026-09-19**, once the user sent themselves a real
  test message via compose (`"hi guys"` / `"how are you doing"` / `"hellooooo"`). Confirmed: the
  `isMe()` sender-matching heuristic (`human:{guid}` ref vs bare `auth-context` user id) works
  correctly on real data — all three messages, sent by the signed-in user to themselves, rendered
  as "mine" (right-aligned) — this was previously an unverified assumption. The thread landed in
  the `Mentions` group, not `NeedsYou`, for this self-thread case. No console errors.

**Two bugs found live and fixed, both reported directly by the user from screenshots:**
1. **The `href`-based "Open" link looked like part of the app's topbar**, not tied to the notice
   below it, because it sat at the far right of the header row. Moved into the message body,
   right under the context line, next to where `AttachedRoomCard` renders.
2. **Own thread messages showed a `"You"` label and a separate timestamp row above the bubble**
   (compared against a WhatsApp-style reference screenshot). Fixed: `"You"` is gone entirely for
   own messages (the bubble side + color already say whose it is); the other sender's name is
   still shown above their bubble (useful once a thread has more than two participants); the
   timestamp moved inline to the bottom-right of the bubble text itself (CSS `float`), same for
   both sides.

**Findings from the larger real sample (117 items, pasted 2026-09-18):**
- **`href` includes routes that don't resolve in this app** (`/analytics`, `/customers`,
  `/intelligence/suggested-actions` — checked against `src/route/`, no matches). Initially left
  as-is to match `GET /home`'s identical, already-documented `cards[].href` situation
  (`docs/home/build-plan.md`) — but **corrected 2026-09-19 per the user**, who gave real mappings
  for the two backend paths that do have a home in this app:
  `/settings/billing/credits` → `/plan-and-billing`, `/data-platform/datasources/{id}` →
  `/data-sources?tab=connected` (both confirmed live). `resolveInboxHref()`
  (`src/pages/inbox/kind.ts`) applies these two and returns `null` for anything else — an
  unmapped href now hides the "Open" link entirely instead of pointing at a 404, unlike `GET
  /home`'s cards which still render regardless. If more mappable paths turn up, add them there.
- **This account's `Systems` group is almost entirely unread, high-volume, near-duplicate
  `DatasourcePipeline` progress logs** (87 `Notification`-kind items, e.g. repeated schema-sync
  steps). `POST /inbox/read-all` ("mark all read") is still unwired — **explicitly deferred by the
  user 2026-09-18** despite this real-world noise; revisit if it comes up again.
- **`context` is a genuinely useful short label** (`"Analytics ready"`, `"Customer import
  complete"`) distinct from the longer `summary` — currently rendered as a secondary line under
  the message bubble in `NoticeView`; a future pass could promote it to a more prominent subtitle.
  Not changed this pass — flagged as a polish idea, not a defect.
- Every real `Finished`-kind item in the sample has `roomId: null` and `eventCount: 1` — the
  doc's "digested per room" rule simply doesn't apply when there's no room to digest under, which
  is consistent, not a discrepancy from the endpoint's documented behavior.

**One real bug found and fixed during this pass:** `formatRoomActivity()` already returns a full
phrase for some cases (`"Yesterday"`, `"just now"`), not just a bare count — the approval/notice
headers were unconditionally appending `" ago"`, producing `"Yesterday ago"`. Fixed by dropping
the appended `" ago"` in both files, matching how the list pane already used the formatter bare.

**One known, unfixed minor gap:** the compose recipient picker doesn't exclude the signed-in user
from their own "add a teammate" list (confirmed live — `"Ichigo Kursaki"`, the logged-in account,
appeared as a pickable option). Not fixed because excluding it needs matching the signed-in
user's `auth-context` id against a workspace member's `ref` (`human:{guid}`), and the exact ref
format isn't confirmed (same open question as the thread `isMe()` check below) — guessing wrong
would silently hide the wrong person instead. Low-priority since picking yourself is harmless, just
odd.

**`GET /inbox`'s `group` enum is now confirmed, not guessed:** `NeedsYou`, `Mentions`, `Finished`,
`Systems` (see [docs/endpoints/inbox.md](../endpoints/inbox.md)) — and `kind` and `group` are
confirmed independent axes: a `Notification`-kind item landed in the `Systems` group, not a
`Notification` group.

**Assumption still unverified, flagged for whenever a `Message`-kind item shows up live:** thread
messages carry no "who am I" field, so `ThreadView`'s `isMe()` check matches a message's `sender`
(a `human:{guid}` ref) against `useAuth().user.id` (a bare guid) via `sender === userId ||
sender.endsWith(":" + userId)`. Untested — could misattribute bubble alignment if the ref format
turns out different.

## Endpoints

11/11 documented, 9/11 wired (`read-all` + the 3 draft endpoints are the exceptions — see
"Implementation roadmap" below). Full contracts in [docs/endpoints/inbox.md](../endpoints/inbox.md).
`GET /sources`'s path was also corrected as part of the original pass (path only, see
[app-shell.md](../endpoints/app-shell.md)) — unrelated to inbox itself, noted here only because it
landed in the same commit.

## The core finding: design to the endpoint's kind/group taxonomy, not the old mock

The mock's model is a binary split: `kind: "thread" | "notice"`, with `noticeType: "approval" |
"agent"` as a third cut inside `"notice"`. The real `GET /inbox` has a flat 8-value `kind` enum
(`Proposal, Assignment, Investigation, Obligation, Finished, Notification, Message, Mention`) and
groups items by consequence (`group`, seen so far: `"NeedsYou"` — full enum unconfirmed) rather
than by type. `Proposal` → mock's approval notices, `Message` → mock's thread rows;
`Assignment/Investigation/Obligation/Finished/Notification` all currently collapse into mock's
single generic `"agent"` bucket and need real per-kind handling. **The list pane has no grouped
sections at all today** — that's the biggest structural gap versus the real endpoint's own stated
design ("grouped by consequence, not by time").

## Screen-by-screen audit

### List pane (`index.tsx` + `list-pane.tsx`) → `GET /inbox`

**Matches:** `unread` ↔ `!isRead` (inverted); filter values `all/unread/mentions/approvals` ↔
`All/Unread/Mentions/Approvals` (case only); `countUnread`/`countApprovals` (client-computed) ↔
`unread`/`counts[]` (server-computed).

**Gaps:**
- No grouped sections (see above) — the real endpoint's whole premise.
- `filterInboxItems`'s `mentions` branch is hard-stubbed to `[]` ("not modeled yet") — real
  `mentionsYou` exists per item natively, this mock limitation disappears once wired.
- `href`/`roomId` (real, per-item deep links) vs every mock notice hardcoding `<Link to="/rooms">`.
- Read/snooze key on `{kind, sourceId}` together, not `sourceId` alone.

### Thread view (`thread-view.tsx`) → `GET /inbox/threads/{threadId}` + `POST .../messages`

**Matches:** `text` ↔ `body`; `timestamp` ↔ `sentAtUtc` (needs relative-time formatting);
`person.name` ↔ `senderName`.

**Gaps:**
- Mock inlines full history on the list item; real needs a separate fetch per thread.
- **No avatar data in the real DTO at all** — `senderName` is a bare string, `initials`/`team`
  (which `PersonAvatar` needs) has to come from a roster lookup elsewhere, not this endpoint.
- `attachedRoom: {label, subtitle}` (pre-formatted) vs real `room: {id, title, status, stageLabel,
  conditionLabel, currency, amountAtRisk}` (structured fields) — formatting moves client-side.
- Mock's header assumes one counterpart; real `participants: string[]` supports multi-person
  threads with no single "the other person."
- Departed-member handling (`"Someone no longer here"`) documented on the real endpoint, no mock
  equivalent.
- `isAgent` flag exists on real messages; mock has no notion an agent could post into a thread.

### Approval view (`approval-view.tsx`) → `GET /inbox/approvals/{proposalId}`

**Matches:** `evidence[].text` ↔ `evidence[].statement`; `evidenceLabel` ("4 findings") ↔
`evidenceCount` (needs formatting); `evidence[].tier` (`measured/corroborated/indicative`) ↔
`evidence[].badge` (`Measured/Corroborated/Indicative`) — same 3 values, casing only.

**Gaps:**
- `atRisk`/`customers` are pre-formatted strings in mock; real gives raw `room.currency` +
  `room.amountAtRisk` + `room.population` — format client-side, same rule as everywhere else.
- **`figuresAreStated` has no mock equivalent, and the endpoint doc says it must be rendered** — a
  stated-not-verified reach/effect needs a visible caveat; nothing does this today.
- Mock's `objection` is singular; real `dissent` is an array.
- Real evidence rows carry `source`, `window`, `n`, `gaps[]` mock doesn't show at all.
- Mock always assumes a room exists; real documents `room: null` (proposal raised outside any
  room) with no fallback UI here.
- **Corrected finding (see below): the action model itself was wrong, not just missing fields.**

### Compose view (`compose-view.tsx`) → `POST /inbox/threads` (+ drafts, see flagged issue below)

**Matches:** `body` ↔ `body`; "Send" ↔ `POST /inbox/threads` with `asDraft: false`.

**Gaps:**
- **Mock only supports one recipient.** `recipient` is a single object; "Add a teammate…" is
  decorative copy with no add function. Real `recipients: string[]` is explicitly multi-recipient
  — the endpoint doc says outright *"a message addressed to three people is one conversation all
  three are in, not three threads."* Needs a real multi-select `To` field: add a person, add
  another, remove one — not swap-one-for-another.
- Room-attach picker is non-functional (toggles one hardcoded label); real needs a real `roomId`
  from an actual room search.
- Recipient picker itself isn't an inbox concern — pull from the teams domain (already
  documented/wired separately); room search pulls from the rooms domain likewise.

### Notice view (`notice-view.tsx`) → no dedicated endpoint

Closest match structurally — there's no separate "notice detail" GET in the real spec.
`Assignment/Investigation/Obligation/Finished/Notification` rows likely render entirely from
fields already on the `GET /inbox` list item (`summary`, `actorLabel`, `context`, `eventCount`),
no click-through fetch needed. Just needs real per-kind icon/copy variants instead of one generic
`"agent"` bucket.

## Correction: proposal actions live in the `ai-proposals` domain, not `/inbox`

Original read of `GET /inbox/approvals/{proposalId}` was that it's read-only with no accept/reject
call anywhere in the inbox domain, and that the mock's "Open the room to approve" (link-out only,
no inline action) confirmed that was the intended design. **That was wrong; checking
`src/services/api/ai-proposals/` corrected it:**

- Real accept/hold/reject actions exist, just under a different base:
  `POST /api/flolyt/ai/proposals/{id}/accept` (optional `editedArgumentsJson`),
  `POST /api/flolyt/ai/proposals/{id}/defer` (required `because`),
  `POST /api/flolyt/ai/proposals/{id}/reject`. See
  [docs/endpoints/ai-proposals.md](../endpoints/ai-proposals.md).
- **This isn't just a documented endpoint — it's already fully wired**, just somewhere the new
  mock rebuild didn't carry forward from: `src/oldpages/everyday/inbox/states/normal-state.tsx`
  (the archived, pre-redesign inbox) had a real "Needs a decision from you" section calling
  `useGetAiProposals()` unscoped ("everything waiting on me across every conversation") and
  rendering each one with `<ProposalCard>` — the same component the chat panel uses — with
  working Accept / Hold / Reject buttons via `useDecideAiProposal()`
  (`src/features/ai-proposals/use-decide-ai-proposal.ts`).
- `GET /inbox/approvals/{proposalId}`'s fields line up closely with `AiProposalDto`
  (`proposalId`↔`id`, `toolName`↔`toolName`, `effectiveArgumentsJson`↔`argumentsJson`/
  `finalArgumentsJson`, `state`↔`status`) — it's the same proposal entity, just a richer *read*
  (adds room/evidence/dissent) for the inbox's detail pane. The **action** should still go through
  the existing `ai-proposals` accept/defer/reject endpoints with that same `proposalId`.
- **So the new approval view should not just link out to `/rooms`** — that was a regression from
  the old inbox's real inline decide flow, not a confirmed design choice. Reuse `<ProposalCard>`
  (or at least `useDecideAiProposal()`) for real inline Accept / Hold / Reject.
- The old inbox's section layout (`Needs a decision from you` / `Someone mentioned you` /
  `Systems`) is also a useful sanity check for what `GET /inbox`'s `group` values are likely meant
  to render as — matches the "grouped by consequence" gap flagged above. **Confirmed live
  2026-09-18: `Systems` is the literal real `group` value**, not just a naming coincidence.

## Flagged for later: no way to list your own saved drafts

**Explicitly deferred per the user — do not build drafts (save/edit/resume) until this is
resolved. Revisit when asked, or once the rest of this roadmap is done.**

You can create a draft (`asDraft: true` on `POST /inbox/threads` or
`POST /inbox/threads/{threadId}/messages`) and, once you have its `messageId`, edit
(`PUT /inbox/drafts/{id}`) / delete (`DELETE /inbox/drafts/{id}`) / send
(`POST /inbox/drafts/{id}/send`) it — but there is **no endpoint that lists a caller's own
drafts**. `GET /inbox/threads/{threadId}`'s own doc says drafts are deliberately excluded ("not
yet part of what the conversation has said"), and `GET /inbox`'s `kind` enum has no draft value
either. So if compose needs "leave a draft, come back to it another day," there's currently no
fetch that would let the UI find it again. Options when this comes back up: ask the backend for a
`GET /inbox/drafts` list, or scope the design so a draft only persists for the current
session/tab rather than being durably resumable.

## Implementation roadmap

Ordered so each step is checkable against a real screen before moving to the next.

- [x] **1. List pane redesign** — wired + live-verified 2026-09-18. Replaced the `thread`/`notice`
      binary with the real 8-value `kind` enum (`src/pages/inbox/kind.ts`); sections are built
      dynamically from whatever `group` values the response actually carries, not a fixed list;
      `GET /inbox` wired with the `filter` param; the hard-stubbed empty `mentions` filter is gone
      (confirmed live: real "No mentions" empty state from the API, not the old client stub).
- [x] **2. Read/snooze actions** — wired 2026-09-18. Row-select → `POST /inbox/read`
      (live-verified: unread badge decremented on real clicks). Snooze → `POST /inbox/snooze` from
      the approval view's menu (3 preset durations — 1 hour / tomorrow morning / next week — since
      there's no existing duration-picker component; UI-verified, mutation not live-fired).
      `POST /inbox/read-all` ("mark all read") **not wired** — no "mark all read" affordance exists
      in the new list pane yet; add one if/when needed.
- [x] **3. Thread view** — wired 2026-09-18, **live-verified 2026-09-19** once a real `Message`
      item existed (see "What's live" above — the `isMe()` heuristic checked out correct on real
      data). Avatar-data gap resolved via `initialsFromName`/`agentInitialsFromName` fallbacks (no
      roster lookup needed — real usage already has this exact "bare name, no initials" pattern
      elsewhere in the app). `AttachedRoomCard` now built from the structured `room` object via
      `formatAttachedRoom()`. Multi-participant header derives its title from the distinct non-me
      senders already in the loaded messages. Departed members aren't specially handled —
      `senderName` renders whatever the API sends, including `"Someone no longer here"` if that's
      what comes back; no client-side special-casing needed. Bubble styling corrected 2026-09-19
      per a user-supplied reference screenshot — see "Two bugs found live" above.
- [x] **4. Thread reply** — wired 2026-09-18, live-verified 2026-09-19 alongside step 3.
- [x] **5. Approval view rebuild** — wired + live-verified 2026-09-18 against a real room-less
      proposal. Real inline Accept / Hold / Reject via `useDecideAiProposal()` (not
      `<ProposalCard>` itself — that component is a compact card-that-opens-a-dialog, which
      doesn't fit a page that's already the expanded detail view; the hook is reused, the modal
      isn't). `figuresAreStated` renders as a visible amber caveat. Multiple `dissent` entries
      supported (mapped, not single). `room: null` fallback confirmed live. Snooze menu added
      (see step 2). Each decide action manually invalidates `["inbox"]` too, since
      `useDecideAiProposal` only invalidates `["ai-proposals"]` on its own.
- [x] **6. Compose rebuild** — wired 2026-09-18. Multi-recipient `To` field (array) confirmed live
      against real `GET /workspace/members` data; real room-attach picker confirmed live against
      real `GET /rooms` data (correctly showed "No results" for this account's 0 open rooms).
      "Save draft" removed entirely rather than wired or faked, per the drafts deferral below.
- [x] **7. Notice view** — wired + live-verified 2026-09-18 for `Finished`/`Notification` kinds.
      Renders straight from the `GET /inbox` list item, no click-through fetch, as expected —
      confirmed there's genuinely no per-kind detail endpoint to call. `Mention` kind has an icon
      variant built (`AtSign`) but wasn't exercised live (0 mentions in the test account).
- [ ] **8. Drafts** — still blocked on the missing "list my drafts" capability; revisit per the
      flagged issue above before starting. Explicitly out of scope for this pass per the user.

## Status tracking

Update the checkboxes above as each step lands; note the commit/date next to it the way other
domain docs do (e.g. `- [x] 1. List pane redesign — wired 2026-0X-XX, commit abc1234`).
