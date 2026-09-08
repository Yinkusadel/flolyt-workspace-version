# Chat panel — build plan

Started 2026-09-09. This build has no Figma source — it's ported from a working implementation
in the sibling repo `flolyt-dashboard` (`Flolyts-space/flolyt-dashboard`, a different local
checkout, not part of this repo). This file is the working plan: what exists over there, what's
copied here for reference, and what's still undecided before wiring starts here.

## Source material (lives in `flolyt-dashboard`, NOT this repo)

| What | Path in `flolyt-dashboard` |
|---|---|
| Chat hooks/types (the actual chatting logic) | `src/features/ai-agent/` |
| — SSE send + stream parsing | `src/features/ai-agent/use-ai-conversation-message.ts` |
| — shared types | `src/features/ai-agent/ai-types.ts` |
| — conversation list/detail/archive/sample-prompts hooks | `src/features/ai-agent/use-get-ai-conversation*.ts`, `use-archive-ai-conversation.ts`, `use-get-ai-sample-prompts.ts` |
| — broadcast preview + generic response parsing | `parse-broadcast-preview.ts`, `parse-broadcast-response.ts`, `response-parser.ts` |
| Where the hook is actually wired into a UI (chat driving a canvas) | `src/pages/WorkflowStudio/index.tsx` |
| Chat-adjacent panel components | `src/pages/WorkflowStudio/NewCanva/WorkflowCommentPanel.tsx`, `Canvas-thinking-state.tsx`, `AiResponseCtaButtons.tsx` |

These are reference-only — read them for the pattern, don't assume the paths still exist verbatim
next time this doc is opened; re-check before copying code wholesale.

## Copied into this repo for reference

- [`agent-hardening-frontend-design.md`](./agent-hardening-frontend-design.md) — full backend
  contract for the durable-run chat surface (endpoints, SSE event catalogue, run lifecycle,
  proposal cards, reconnect). Copied verbatim from `flolyt-dashboard/docs/` on 2026-09-09.
- [`agent-hardening-build-checklist.md`](./agent-hardening-build-checklist.md) — the reference
  repo's own tracker against that design doc, copied the same day. **Important:** most of it is
  unchecked — see "State of the reference implementation" below.

## The endpoint (confirm against Scalar before wiring, per [[endpoint_docs_convention]])

```
POST /api/flolyt/ai/conversations/messages
```

Body, as of the spec pasted 2026-09-09 (matches §3.1 of the design doc):

```jsonc
{
  "conversationId": null,       // null ⇒ new conversation
  "message": "...",             // required
  "mode": null,                 // optional surface-mode passthrough
  "interactiveReply": null      // NEW field — Dictionary<string,string>, answers to a prior
                                 // input_request event; not yet consumed by use-ai-conversation-message.ts
}
```

`Accept: text/event-stream` → SSE stream. `Accept: application/json` → one complete
`AgentMessageResult`. SSE mode is a POST, so `EventSource` can't be used — `fetch` +
`ReadableStream`, same pattern as [[api_endpoint_style]] would need adapting for.

Other endpoints in the same family (from the design doc, not yet confirmed against this
workspace's own Scalar instance):

```
GET    /api/flolyt/ai/conversations/?pageNumber=1&pageSize=20
GET    /api/flolyt/ai/conversations/{id}          → incl. activeRunId
DELETE /api/flolyt/ai/conversations/{id}          → archive (soft delete)
GET    /api/flolyt/ai/conversations/sample-prompts
GET    /api/flolyt/command-center/runs/{id}
GET    /api/flolyt/command-center/runs/{id}/stream
POST   /api/flolyt/command-center/runs/{id}/cancel
POST   /api/flolyt/command-center/runs/{id}/steer
GET    /api/flolyt/ai/proposals?conversationId={guid}&includeDecided=false
POST   /api/flolyt/ai/proposals/{id}/accept
POST   /api/flolyt/ai/proposals/{id}/reject
```

**Do not assume these exist verbatim in this workspace's backend** — confirm each one in Scalar
before wiring, per [[feedback_verify_against_endpoint_docs]] and
[[feedback_stop_on_truncated_endpoint_fields]]. This table is carried over from the reference
repo's doc, not independently verified against this project's API.

## State of the reference implementation (why this matters for scoping our build)

`use-ai-conversation-message.ts` in `flolyt-dashboard` only implements the **base chat surface**:
SSE send/parse, `status`/`run_queued`/`tool_call`/`reasoning_step`/`response_chunk`/
`workflow_generated`/`broadcast_preview`/`suggested_action`/`error` events, a typewriter effect,
and it captures `runId` — but does nothing with it yet (no cancel, no steer, no reconnect, no
proposal cards). `ai-types.ts` has no `AgentProposalEventDto`, no `interactiveReply` handling, no
`activeRunId` on the conversation type.

Per the checklist, the durable-run "hardening" work (Stages 0-5 of the design doc) is **mostly
unbuilt even in the reference repo**: Stage 0 (types/services) and Stage 2 (`RunStatusBar`
stop/steer) are partially done; Stages 3 (proposal cards), 4 (reconnect), and 5 (resilience) are
not started.

**Implication for this build:** when we build the chat panel here, the honest starting point is
the same base surface the reference hook already has working (send message, stream response,
reasoning steps, tool calls, conversation list) — not the full hardened design. The design doc is
there so we don't paint ourselves into a corner (e.g. capture `runId` from `run_queued` even in
v1, since retrofitting it later is the whole point of Stage 1), but treat Stages 3-5 as future
work, not v1 scope, unless told otherwise.

## Open questions before we start

- Does this workspace's backend even expose the run/proposal endpoints yet, or only the base
  `/ai/conversations/messages` + SSE surface? Needs a Scalar check.
- Where does the chat panel live in this app — a dedicated page, or a persistent panel like
  `flolyt-dashboard`'s `WorkflowCommentPanel`? Not yet decided.
