# Inbox domain endpoints

Everything under `/api/v3/inbox/*`, pasted 2026-09-18 from the real spec. Supersedes the single
`GET /inbox` stub previously recorded in [app-shell.md](app-shell.md) under a guessed
`/api/flolyt/inbox` path — that entry moved here with its real path and full shape, and
app-shell.md now points at this file instead. Corresponds to the already-built `/inbox` section
(mock data at `src/pages/inbox/data.ts`) — see [[flolyt_inbox_rebuild]] — so every entry below is a
candidate to wire against an existing mocked screen, not a page waiting to be built.

**Auth:** Bearer JWT, every route · **Envelope:** `Result<T>` (`data`, `messages`, `succeeded`).

**Status: 11/11 documented, 9/11 wired into `/inbox` (2026-09-18), all 9 live-verified against real
data as of 2026-09-19** — `GET /inbox`, `POST /read`, `GET /threads/{id}`, `POST
/threads/{id}/messages`, `POST /threads` (compose), and `GET /approvals/{proposalId}` (including
its accept/hold/reject actions, via the `ai-proposals` domain — see that entry's notes below) are
all confirmed against real responses and, for the mutations, real successful sends. `POST /snooze`
is UI-verified but not actually fired live, to avoid deciding/snoozing a real pending proposal
without being asked to. `POST /read-all` and the three `/drafts/*` endpoints are still
service/hook-only, not wired — drafts intentionally, per the "no way to list your own drafts" gap
in docs/inbox/build-plan.md.

## Per-endpoint entries

Every GET below returns `{ data: <shape below>, messages: string[], succeeded: boolean }` — the
envelope is omitted from each `Response:` line for brevity; only the `data` shape is shown.
Mutations show their real top-level shape including the envelope.

`kind` is the same 8-value enum everywhere it appears below: `Proposal`, `Assignment`,
`Investigation`, `Obligation`, `Finished`, `Notification`, `Message`, `Mention`.

### GET /inbox

- **Purpose:** Grouped by consequence, not by time — needs a decision / mentions / finished /
  systems, so a decision waiting on you outranks an agent finishing something regardless of
  timestamps.
- **Auth:** Bearer token.
- **Request:** query `filter?` — `All` | `Unread` | `Mentions` | `Approvals`.
- **Response `data`:** `{ items: InboxItem[], counts: [{ group, count }], unread: number, total: number }` where
  `InboxItem = { group: string, kind, sourceId: uuid, isRead: boolean, mentionsYou: boolean, actorLabel: string, summary: string, context: string | null, occurredAtUtc: string, roomId: uuid | null, href: string | null, eventCount: number }`.
  **`group` confirmed live 2026-09-18** (`ichigo@yopmail.com`): `NeedsYou`, `Mentions`, `Finished`,
  `Systems` — all four came back in one `counts[]` response (`Mentions` at 0). Real observed
  `kind`s for that account: `Proposal` (2, both in `NeedsYou`), `Finished` (28, in `Finished`),
  `Notification` (87, in `Systems`) — confirms `kind` and `group` are independent axes, not a
  kind→group lookup (a `Notification`-kind item landed in the `Systems` group, not a `Notification`
  group).
- **Used by:** wired into `/inbox` (`src/pages/inbox/`), live-verified 2026-09-18 — list pane,
  grouped sections, filter tabs, read-on-select all confirmed against real data. `Message`-kind
  rows (thread view) were **not** exercised live — this account had none in its inbox.
- **Status:** wired, live-verified (except the `Message`/thread path — no live example yet).
- **Notes:** Four rules hold: (1) an agent narrating its own tool calls never appears — the room
  log/tool-call audit exist for that; (2) an undecided proposal never ages out of the list — a
  reminder that scrolls away is an action nobody took and nobody was reminded of; (3) finished
  work is digested **per room** — eleven runs in one room send one line about the eleven, not
  eleven items; (4) read/dismissed system alerts are gone. `isRead` is per caller — the same line
  is read for one teammate and unread for another. `counts`/`unread` are always over the *whole*
  inbox regardless of which `filter` is asked, because a tab that counted its own contents would
  report one approval only while already looking at approvals; `total` is the unfiltered figure.

### POST /inbox/read

- **Purpose:** Marks one line read, for the caller alone — it stays unread for every other
  teammate.
- **Auth:** Bearer token.
- **Request:** body `{ kind, sourceId: uuid }`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** wired into `/inbox` (`src/pages/inbox/index.tsx`'s row-select handler),
  live-verified 2026-09-18 — the unread badge count dropped by one on each real select.
- **Status:** wired, live-verified.
- **Notes:** Read state is keyed on `kind` + `sourceId` together, not `sourceId` alone — a line's
  group can change (an obligation nobody answered escalates into `NeedsYou`) while what it *is*
  can't, and keying on the half that moves would quietly forget somebody had already read it.
  Idempotent — the first read is the one recorded, so a client that polls doesn't rewrite the map
  on every refresh.

### POST /inbox/read-all

- **Purpose:** Clears the list for the caller.
- **Auth:** Bearer token.
- **Request:** none.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`mark-all-inbox-read.ts` / `use-mark-all-inbox-read.ts`), not
  wired.
- **Status:** service/hook ready, not wired.
- **Notes:** Everything before now becomes a watermark rather than a per-line record — what stops
  a busy workspace accumulating a row per person per line forever. The watermark never moves
  backwards, so a second tab clearing the list a moment later can't unread what happened in
  between.

### POST /inbox/snooze

- **Purpose:** Puts one line off until `untilUtc`, for the caller alone.
- **Auth:** Bearer token.
- **Request:** body `{ kind, sourceId: uuid, untilUtc: string | null }`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** wired into the approval view's "Snooze" menu (3 preset durations); UI confirmed
  rendering live 2026-09-18 but the mutation itself wasn't fired against a real proposal (would
  have snoozed a live item out of the account's actual inbox).
- **Status:** wired, UI-verified; mutation itself not live-fired.
- **Notes:** Not a read — reading says you've seen it, snoozing says you've seen it and it isn't
  for now, and marking it read to get it out of the way is the wrong record because the line
  never comes back. A snoozed line leaves the list and its counters together, and returns on its
  own once the clock passes `untilUtc` — no job to run, nothing to sweep. `untilUtc: null` (or any
  time already past) un-snoozes immediately. Capped at 90 days ahead — further than that isn't
  putting a line off, it's hiding it, and an undecided proposal is supposed to wait in this list
  until it's decided.

### POST /inbox/threads

- **Purpose:** Starts a conversation.
- **Auth:** Bearer token.
- **Request:** body `{ recipients: string[], body: string, asDraft?: boolean, roomId?: uuid | null }`.
- **Response:** `{ data: uuid (messageId), messages, succeeded }`.
- **Used by:** wired into `ComposeView` (`src/pages/inbox/compose-view.tsx`) — real multi-recipient
  picker (`GET /workspace/members`, humans only) and real room-attach picker (`GET /rooms`), both
  confirmed loading live data 2026-09-18. Send confirmed live 2026-09-19 (the user's own test
  messages).
- **Status:** wired, live-verified.
- **Notes:** `recipients` are stored member references — `human:{guid}` — people only; bringing an
  agent in means opening a room or starting an agent conversation instead, both of which keep
  something a direct message wouldn't (a room holds the evidence and decision trail, an agent
  conversation holds the run). Somebody outside the workspace is refused. **The sender is not
  auto-added as a participant** — confirmed live 2026-09-19: a thread composed without the sender
  in `recipients` never appears in the sender's own inbox afterward. `ComposeView` always appends
  the signed-in member's own ref to `recipients` before sending, to guarantee this. `roomId` is
  the optional "About" attachment — it rides on the message, not the thread, so a later reply can
  attach a
  different room. `asDraft: true` saves without sending. A message addressed to three people is
  one conversation all three are in, not three threads.

### GET /inbox/threads/{threadId}

- **Purpose:** One conversation, oldest message first, with everyone in it.
- **Auth:** Bearer token.
- **Request:** path `threadId`.
- **Response `data`:** `{ threadId, participants: string[], messages: InboxThreadMessage[] }` where
  `InboxThreadMessage = { id: uuid, sender: string, senderName: string, isAgent: boolean, body: string, roomId: uuid | null, room: InboxThreadRoom | null, sentAtUtc: string }`
  and `InboxThreadRoom = { id: uuid, title: string, status: string, isRestricted: boolean, stageLabel: string | null, conditionLabel: string | null, currency: string | null, amountAtRisk: number | null }`.
- **Used by:** wired into `ThreadView` (`src/pages/inbox/thread-view.tsx`), live-verified
  2026-09-19 once a real `Message`-kind item existed — the `sender`-matching `isMe()` heuristic
  (`human:{guid}` ref vs bare `auth-context` user id) checked out correct on real data.
- **Status:** wired, live-verified.
- **Notes:** `senderName` is resolved at read time, not stored — a name frozen at write would be
  one the roster has since corrected (renames happen for both agents and people). Somebody who's
  left the workspace reads as `"Someone no longer here"`, and their messages stay — deleting what
  a departed colleague said would rewrite a conversation other people are still reading. Drafts
  are absent — they belong to their author and aren't yet part of what the conversation has said.
  A thread you're not in returns 404 rather than 403, so the response never confirms the
  conversation exists to somebody outside it.

### POST /inbox/threads/{threadId}/messages

- **Purpose:** Replies into a conversation.
- **Auth:** Bearer token.
- **Request:** path `threadId`; body `{ body: string, asDraft?: boolean, roomId?: uuid | null }`.
- **Response:** `{ data: uuid (messageId), messages, succeeded }`.
- **Used by:** wired into `ThreadView`'s reply box, live-verified 2026-09-19 alongside
  `GET /threads/{id}` above.
- **Status:** wired, live-verified.
- **Notes:** Recipients are the thread, not the replier's choice — whoever was addressed or has
  spoken gets it, minus whoever is writing. Letting a replier re-pick would let them quietly drop
  a participant who'd have no way of noticing. An agent that has spoken into the thread is not
  replied to — it's still not addressable.

### PUT /inbox/drafts/{messageId}

- **Purpose:** Edits a draft — your own, and only while it's still a draft.
- **Auth:** Bearer token.
- **Request:** path `messageId`; body `{ body: string, roomId?: uuid | null }`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`update-inbox-draft.ts` / `use-update-inbox-draft.ts`), not
  wired.
- **Status:** service/hook ready, not wired.
- **Notes:** A sent message can't change under somebody who's already read it. Mentions are
  re-parsed from the body on every edit, so a draft can't keep a mention its text no longer
  carries.

### DELETE /inbox/drafts/{messageId}

- **Purpose:** Throws a draft away — your own, and only while unsent.
- **Auth:** Bearer token.
- **Request:** path `messageId`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`delete-inbox-draft.ts` / `use-delete-inbox-draft.ts`), not
  wired.
- **Status:** service/hook ready, not wired.

### POST /inbox/drafts/{messageId}/send

- **Purpose:** Sends a draft saved earlier — your own, and only while it's still one.
- **Auth:** Bearer token.
- **Request:** path `messageId`.
- **Response:** `{ data: true, messages, succeeded }`.
- **Used by:** service + hook ready (`send-inbox-draft.ts` / `use-send-inbox-draft.ts`), not
  wired.
- **Status:** service/hook ready, not wired.
- **Notes:** Sending twice keeps the first send, doesn't make a second message. Recipients are
  re-checked against the workspace at send time, not only at save time — somebody can leave while
  a draft sits, and sending then would put a message where nobody can read it.

### GET /inbox/approvals/{proposalId}

- **Purpose:** The pane behind a needs-a-decision line, in one read: the proposal, the room it was
  raised in, the evidence behind it, and the objections on the record.
- **Auth:** Bearer token.
- **Request:** path `proposalId`.
- **Response `data`:**
  ```ts
  interface InboxApprovalDetail {
    proposalId: string;
    toolName: string;
    state: string;
    isPending: boolean;
    rationale: string | null;
    effectiveArgumentsJson: string;
    wasEdited: boolean;
    proposedBy: string | null;
    figuresAreStated: boolean;
    reachesCustomers: boolean;
    framing: {
      summary: string;
      reach: number;
      effect: number | null;
      currency: string | null;
      plannedSendAtUtc: string | null;
      audienceSegmentId: string | null;
      fingerprint: string | null;
    };
    decisionOwnerMemberId: string;
    createdAtUtc: string;
    waitingFor: string | null;
    room: {
      id: string;
      title: string;
      status: string;
      stageLabel: string;
      conditionLabel: string;
      currency: string;
      amountAtRisk: number;
      population: number;
      ownerMemberId: string;
    } | null;
    evidenceCount: number;
    evidence: Array<{
      claimId: string;
      statement: string;
      badge: string;
      source: string;
      window: string;
      n: number | null;
      gaps: string[];
    }>;
    dissent: Array<{
      wording: string;
      by: string;
      recordedAtUtc: string;
      borneOut: boolean | null;
    }>;
  }
  ```
- **Used by:** wired into `ApprovalView` (`src/pages/inbox/approval-view.tsx`), live-verified
  2026-09-18 against a real room-less proposal (`room: null`, `evidenceCount: 0`) — the fallback
  copy and the `framing.reach`-based "Customers" stat both rendered correctly. Accept/Hold/Reject
  are wired to the **`ai-proposals` domain** (`useDecideAiProposal`, see
  [ai-proposals.md](ai-proposals.md)), not a same-domain action — see docs/inbox/build-plan.md's
  correction. Buttons rendered correctly live but weren't clicked (would have decided a real
  pending proposal). Every proposal-decide success handler also invalidates the `["inbox"]` query
  client-side, since `useDecideAiProposal` only invalidates `["ai-proposals"]` on its own.
- **Status:** wired, live-verified (read side); decide actions UI-verified, not live-fired.
- **Notes:** One call rather than four, on purpose — separate calls would render the argument
  before the evidence that qualifies it, and the dissent last of all, which puts the objection in
  front of the reader after they've already made up their mind. Each finding's `badge` is mapped
  from its claim grade: `Measured` for a causal finding, `Corroborated` for a strong association,
  `Indicative` for a hypothesis. Findings graded insufficient-evidence are **absent** rather than
  badged — "cannot be answered with what's connected" isn't evidence behind a decision, and
  listing it here would lend the others its weakness; the room's evidence tab shows those with the
  missing source named instead. `evidenceCount` counts what's actually shown. `figuresAreStated`
  must be rendered, not silently trusted — it means the reach/effect were asserted by whoever
  proposed the play and verified by nothing, and a stated reach read as a checked one is how a
  play meant for 100,000 people reaches five times that. Empty `dissent` means nobody objected,
  not that the section wasn't asked for. A proposal raised in a room you're not inside returns
  404 — a restricted room's plays are part of its inside, and saying which of the two it is would
  confirm the work to somebody outside it. A proposal raised outside any room has `room: null`,
  `evidence: []`, `dissent: []` and reads that way rather than failing.
