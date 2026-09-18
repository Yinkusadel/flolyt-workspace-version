# Inbox — build plan

Not wired yet. This is the audit + roadmap from the 2026-09-18 pass that documented and
scaffolded every real `/api/v3/inbox/*` endpoint (see [inbox.md](../endpoints/inbox.md)) and
compared them against the current mock-only `/inbox` (`src/pages/inbox/`, built from
`flolyt-figma-designs/New-pages-pattern/inbox/inbox/svg/01–05`). Nothing in `src/pages/inbox/`
has been touched yet — this doc exists so the audit survives even if the chat that produced it
doesn't.

## Endpoints

11/11 documented, service+hook scaffolded for all 11, 0/11 wired. Full contracts in
[docs/endpoints/inbox.md](../endpoints/inbox.md). `GET /sources`'s path was also corrected as
part of the same pass (path only, see [app-shell.md](../endpoints/app-shell.md)) — unrelated to
inbox itself, noted here only because it landed in the same commit.

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
  to render as — matches the "grouped by consequence" gap flagged above.

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

Ordered so each step is checkable against a real screen before moving to the next. Nothing below
is started.

- [ ] **1. List pane redesign** — replace the `thread`/`notice` binary with the real 8-value
      `kind` enum; add grouped sections driven by `group` (mirror the old inbox's `Needs a
      decision from you` / `Someone mentioned you` / `Systems` layout as a starting point); wire
      `GET /inbox` with the `filter` param; remove the hard-stubbed empty `mentions` filter.
- [ ] **2. Read/snooze actions** — wire row-select → `POST /inbox/read`, "Mark all read" →
      `POST /inbox/read-all`, snooze affordance → `POST /inbox/snooze` (needs an `untilUtc`
      picker UI that doesn't exist yet).
- [ ] **3. Thread view** — wire `GET /inbox/threads/{threadId}`; resolve the avatar-data gap
      (roster lookup for `initials`/`team` from `sender`); compose the `AttachedRoomCard` display
      from the structured `room` object instead of a pre-formatted string; handle
      multi-participant headers and departed members.
- [ ] **4. Thread reply** — wire `POST /inbox/threads/{threadId}/messages`.
- [ ] **5. Approval view rebuild** — wire `GET /inbox/approvals/{proposalId}`; replace "Open the
      room to approve" with real inline Accept / Hold / Reject via `<ProposalCard>` /
      `useDecideAiProposal()` (see correction above); render `figuresAreStated` as a visible
      caveat; support multiple `dissent` entries; add a `room: null` fallback state; format
      `amountAtRisk`/`population` client-side.
- [ ] **6. Compose rebuild** — multi-recipient `To` field (array, not single slot) wired to
      `POST /inbox/threads`; real room-attach picker (rooms domain) in place of the hardcoded
      toggle; real recipient picker (teams domain) in place of the placeholder text.
- [ ] **7. Notice view** — per-`kind` icon/copy variants for `Assignment/Investigation/Obligation/
      Finished/Notification`, replacing the single generic `"agent"` bucket; confirm no
      click-through fetch is actually needed (render straight from the `GET /inbox` list item).
- [ ] **8. Drafts** — blocked on the missing "list my drafts" capability; revisit per the flagged
      issue above before starting.

## Status tracking

Update the checkboxes above as each step lands; note the commit/date next to it the way other
domain docs do (e.g. `- [x] 1. List pane redesign — wired 2026-0X-XX, commit abc1234`).
