# App-shell endpoints

Five routes pasted 2026-09-04 alongside the lifecycle batch under the same Scalar "Lifecycle" tag,
but genuinely cross-cutting — not scoped to `/lifecycle/*`, each its own top-level path with no
shared base. [`lifecycle.md`](lifecycle.md) flagged these as "file under their own domain doc when
we get to those surfaces" back on 2026-08-31; this is that doc. `search` and `command-bar` still
have no `API_ENDPOINTS` group; `home`, `inbox`, and `sources` each grew their own group instead
(`HOME`, `INBOX`, `SOURCES` in `src/config/apiConfig.ts`) once real specs landed for them.

**Auth:** Bearer JWT, every route · **Envelope:** `Result<T>` (`succeeded`, `data`, `messages`).

Status: `search` and `command-bar` remain documented-only (2 endpoints). `home`'s 3 endpoints are
tracked here (2 wired as of 2026-09-16, `/home/greeting` scaffolded-but-unused by design). `inbox`
moved to its own file, [inbox.md](inbox.md), on 2026-09-18 (11/11 documented, service/hook
scaffolded, 0/11 wired) once its real spec turned out far bigger than a single-endpoint stub.
`sources`' single endpoint got its real path and full scaffold the same day (see its entry below).
See [docs/home/build-plan.md](../home/build-plan.md) for `home`'s wiring pass,
[[api_endpoint_style]] for the service+hook shape.

## Endpoints

### GET /api/flolyt/search

- **Purpose:** Finds what already exists — rooms, customers, campaigns, business memory, evidence —
  and offers to *ask* instead when it can't find something, since search can't create what doesn't
  exist yet.
- **Auth:** Bearer token.
- **Request:** query `q` (string, required).
- **Response `data`:** `{ query, groups: [{ group, hits: [{ id, title, detail, status, occurredAtUtc }], hasMore }], shownCount, askInstead: string[] }`. `detail`/`status`/`occurredAtUtc` nullable per the spec's example.
- **Used by:** not wired.
- **Status:** documented.
- **Notes:** Memory and evidence are the same claims split by the question they answer — what the
  workspace believes generally, vs what one specific piece of work rests on. Superseded/rejected
  claims never surface (same filter definition-retrieval uses). Customers match on name, email, or
  external id; rooms match the condition key as well as the title. Groups are capped — `hasMore`
  rather than an exact remainder, since an exact count would mean visiting every match just to
  print the least useful number on screen.

### GET /api/v3/home

- **Purpose:** The prioritised carousel, in three named parts (server-ranked, in this order):
  `guarded` (what Flolyt has preserved/closed/left waiting over a **fixed 30-day window**,
  independent of `window` below — a tenant's quoted preserved amount never changes just because
  someone moved a dropdown), `facts` (the up-to-five things most worth knowing right now, ranked
  by severity, each with a `question` to hand a fresh conversation for a deep dive — see
  `POST /conversations/messages`), and `cards` (what waits on you and what the workspace has been
  told, newest and most pressing first). **Full shape confirmed 2026-09-17** from the real Scalar
  spec — `guarded` and `facts` were previously undocumented here; a 2026-09-15/16 pass had to
  guess at a "business state" grouping from `cards[].figures` in their absence (see build-plan for
  why that guess was wrong and got corrected).
- **Auth:** Bearer token.
- **Request:** query `window?` (integer — one of `30`/`90`/`180`/`365`; decides `cards[]`' figures
  only, nothing else — **not** `guarded`, which is always the last 30 days regardless).
- **Response `data`:**
  ```ts
  interface HomeResponse {
    window: { days: number; options: number[] };
    revenueModel: string | null;
    guarded: {
      days: number; // always 30 in practice
      roomsClosed: number;
      roomsOpen: number;
      decisionsWaitingOnYou: number;
      preserved: Array<{ currency: string; amount: number }>;
      biggestExposure: Array<{ currency: string; amount: number; title: string; roomId: string | null }>;
    };
    facts: Array<{
      key: string;
      tone: string;
      severity: number; // 3 pressing, 2 worth knowing, 1 background
      text: string;
      question: string; // prompt for POST /conversations/messages
      figures: Array<{ currency: string; amount: number }>;
      context: { stage: string | null; grid: string | null; rowKey: string | null; conditionKey: string | null; currency: string | null } | null;
    }>;
    cards: Array<{
      kind: string;
      key: string;
      severity: number;
      asOfUtc: string;
      title: string;
      detail: string | null;
      figures: Array<{ currency: string; amount: number }>;
      href: string | null;
      sourceId: string | null;
    }>;
    refreshedAtUtc: string | null;
  }
  ```
  Standard `{ data, messages, succeeded }` envelope. **`facts[].context` can be `null` itself**
  (not just its sub-fields) — confirmed live, the TS type must be `HomeFactContext | null`, not a
  non-nullable object.
- **Used by:** Two surfaces, both reading the same `useGetHome()` React Query cache (same query
  key, so this is one network call, not two):
  - `HomeCarousel` (`src/pages/conversations/home-carousel.tsx`) — one slide per part: `guarded`
    (always shown — it's a fixed summary object, not a match count), `facts` (skipped if empty),
    and `cards[]` filtered to `kind: "action"` ("needs you", skipped if empty). A fact's "Ask
    about this" button navigates to `/conversations/new` with `state: { bootstrapToken, prompt:
    fact.question }` — the same pattern the composer's own submit uses.
  - `NotificationBell` (`src/components/notification-bell.tsx`), in the topbar left of
    `UserMenu` — `cards[]` filtered to `kind !== "action"` ("workspace"), in a dropdown reachable
    from every screen, not just home. **Moved here from the carousel 2026-09-17** per the user's
    direction; the needs-you/workspace split itself is unchanged, just shared via
    `splitHomeCardsByKind()` (`src/features/home/group-home-cards.ts`) instead of duplicated.
- **Status:** wired and live-verified 2026-09-17.
- **Notes:** Severity is never derived by comparing money across currencies: a figure is measured
  against its own currency's digest threshold, and an action against the inbox grouping that
  already decided what needs you (see `GET /inbox` above — not recomputed here). Money is per
  currency and never blended, same rule the leakage map and the old `conditionTotals` field
  followed. Nothing is invented to pad any of the three parts — a workspace with two facts gets
  two, empty `guarded.preserved`/`biggestExposure` render as "—"/no section rather than a fake
  zero. **Confirmed live 2026-09-17** (`ichigo@yopmail.com`): `guarded` had `roomsClosed: 0`,
  `roomsOpen: 0`, `preserved: []`, `biggestExposure: []` for this account — the stat grid still
  renders correctly (zeros and a "—" placeholder, not hidden). `cards[].kind` is exactly
  `"action"` or `"notification"` in practice, all with `figures: []` — confirming money never
  actually lives on `cards[]`, it lives on `guarded`/`facts` as this corrected spec says. See
  build-plan for the fuller wiring notes, including `href` values confirmed not to resolve to
  routes in this app.

### GET /api/v3/home/greeting

- **Purpose:** The line above the conversation bar for a surface about to open a new
  conversation, so it renders something written for this person instead of the same hardcoded
  sentence every time.
- **Auth:** Bearer token.
- **Request:** none.
- **Response `data`:** `{ greeting: string }`. Standard envelope.
- **Used by:** nothing — scaffolded (`useGetHomeGreeting`) but deliberately not called, per this
  endpoint's own note below.
- **Status:** documented (2026-09-15), intentionally not wired.
- **Notes:** Drawn fresh from a small pool on each call, sometimes using the person's first name
  and sometimes not, and **never** announcing the time of day — that's one sentence for everybody
  in a timezone and wrong for anyone working late. The name comes from their own record, never
  from the login on the token; someone with no first name on record gets a line that needs none.
  Reads one document, so it's cheap enough to call wherever a conversation starts. The home
  screen gets the same sentence back inside `GET /home/prompts` and does **not** need this as a
  second call there.

### GET /api/v3/home/prompts

- **Purpose:** Everything around the composer in one call — the greeting above it and the
  suggestions under it — so the top of the page doesn't wait on two round trips.
- **Auth:** Bearer token.
- **Request:** none.
- **Response `data`:**
  ```ts
  interface HomePromptsResponse {
    greeting: string;
    prompts: Array<{
      key: string;
      text: string;
      intent: string;
      because: string;
      context: {
        stage: string | null;
        grid: string | null;
        rowKey: string | null;
        conditionKey: string | null;
        currency: string | null;
      };
    }>;
  }
  ```
  Standard envelope.
- **Used by:** `NewConversationRoute` (`src/pages/conversations/new-conversation-route.tsx`) — the
  `h1` greeting and the composer's typewriter placeholder texts.
- **Status:** wired 2026-09-15.
- **Notes:** Same greeting rules as `GET /home/greeting` above (small pool, sometimes a first
  name, never a time-of-day line) — don't call both from the same screen. Says nothing about the
  business itself: the `/home` carousel reports the state, prompts say what's worth asking about
  it — "a third voice on the same subject would be the one with least room to say it well." Built
  from the workspace's own state: what waits on you, the stages you own, the largest measured
  leaks (ranked inside each market, never across), the sources whose absence is blocking cells,
  and the rooms in flight — a ranked dozen, and which of them is on screen at any moment is the
  client's business. Every prompt states `because` (why it was suggested) and carries `context`
  (the coordinate it came from), so choosing one is the same call the leakage map itself would
  have made.

### GET /inbox and the rest of the inbox domain

Moved to its own file, **[inbox.md](inbox.md)**, on 2026-09-18 once the real spec pasted 11
operations (10 of them brand new — threads, drafts, snooze, per-line read, the approval detail
pane) under the real `/api/v3/inbox/*` path, correcting the `/api/flolyt/inbox` guess this stub
used to carry. See that file for the full, current entries.

### GET /api/flolyt/command-bar

- **Purpose:** The command bar's front door — what the workspace will reason over (shown before
  the question is asked) and what's worth asking, grouped Diagnose / Forecast / Act.
- **Auth:** Bearer token.
- **Response `data`:** `{ willReasonOver: [{ kind, label, status, lastSyncedAtUtc, recordCount, problem, contributingConnections, blocks }], suggestions: [{ key, group, prompt, annotation, action, available, missingSources, blocker, surface, roomTarget: { grid, rowKey, rowLabel, conditionKey, currency, amountAtRisk } }] }`. `kind` ∈ enum incl. `"Unknown"`; `status` ∈ enum incl. `"NotConnected"`; `group` ∈ `Diagnose`/`Forecast`/`Act`; `action` ∈ enum incl. `"Answer"`.
- **Used by:** not wired.
- **Status:** documented.
- **Notes:** Every suggestion states what it reads and what it does. A suggestion whose source is
  missing comes back `available: false` with `missingSources` named — **never hidden**, since
  hiding it teaches nobody what connecting that source would buy. Only one suggestion kind opens a
  war room (`roomTarget`) — a room needs a leakage coordinate to snapshot and be measured against;
  the rest answer inline in the shared, durable workspace conversation, not a private chat.
  `willReasonOver` is the same row shape as `GET /sources` below — see that entry's notes, this is
  the same underlying data surfaced as the command bar's "will reason over" strip.

### GET /sources

- **Purpose:** What this workspace can and can't reason over — the room sources rail, and
  `command-bar`'s `willReasonOver` strip (same question, same row shape).
- **Auth:** Bearer token.
- **Response `data`:** `{ sources: [{ kind, label, status, lastSyncedAtUtc, recordCount, problem, contributingConnections, blocks }], connectedCount, totalCount }`. `kind` enum includes `"Unknown"`; `status` enum includes `"NotConnected"`.
- **Used by:** service + hook ready (`src/services/api/sources/get-sources.ts` /
  `src/features/sources/use-get-sources.ts`), not wired into a page yet.
- **Status:** service/hook ready, not wired.
- **Notes:** **Path corrected 2026-09-18** — real spec confirms this lives at top-level
  `/api/v3/sources`, not `/api/flolyt/sources` as first guessed on 2026-09-04; shape itself was
  already right. A row is a **data domain**, not a connection — two warehouses both carrying
  engagement events are one row; a connected warehouse carrying nothing usable does not read as
  healthy. Every domain is returned, including ones nothing supplies — a missing row and a
  not-connected row are different statements and only one is actionable. `blocks` is derived from
  the leakage map's own account of what's unavailable, not written down separately. **No
  `read_only` status** — every source Flolyt connects is read-only, so that flag would distinguish
  nothing (don't invent one client-side).
