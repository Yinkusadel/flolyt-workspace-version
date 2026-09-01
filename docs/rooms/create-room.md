# New-room wizard — build plan

Started (this pass) 2026-09-01. Source: `flolyt-figma-designs/Everyday Screens/flolyt-rooms/`
(R06–R11), already fully built as a UI-only pass — see [[flolyt_rooms_rebuild]]. This doc covers
the *live-wiring* pass on top of that build: checking each step, section by section, against the
real endpoints, and recording the decisions made along the way.

The actual endpoint reference stays at [`docs/endpoints/rooms.md`](../endpoints/rooms.md) (52
rooms endpoints) and [`docs/endpoints/lifecycle.md`](../endpoints/lifecycle.md) (the leakage-map
vocabulary this wizard also depends on), per the established [[endpoint_docs_convention]] — this
file links to them rather than duplicating their contracts.

## Why this exists

The rooms rebuild shipped the wizard's UI in full, but 0 of the 52 rooms endpoints were wired
into it — every step ran on static mock data (`new-room-data.ts`). Going through it step by step
to check real coverage surfaced a genuine design gap on Step 1 (see below), not just missing
wiring — worth a durable record of *why* each fix was made, not only *what* changed (git log has
the what).

## The 5 steps

| # | Step | Component | What it collects (maps to `POST /rooms/new`) |
|---|---|---|---|
| 1 | Condition | `step-condition.tsx` | `conditionKey`, `title` |
| 2 | Audience | `step-audience.tsx` | `rules`, `currency` |
| 3 | People | `step-people.tsx` | `people`, `agents` |
| 4 | Settle | `step-settle.tsx` | `settlesWhen`, `measuredOverDays`, `primaryMeasure`, `revenueBasis`, `holdoutPercent`, `noHoldoutBecause`, `wouldProveUsWrong` |
| 5 | Review / duplicate | `step-review.tsx`, `step-duplicate.tsx` | `linkToRoomId`, `linkReason`, `openDespiteOverlapWith` — plus the final submit |

No `?step=` param — client-local `useState` in `index.tsx` (confirmed by reading every step's own
SVG footer, none show a step query string).

## Decisions made so far

- **Step 1's condition field was one input double-cast as two backend fields — split it.**
  The original mock had a single free-text input bound to what looked like `title`, with no
  control for `conditionKey` at all. Rereading `POST /rooms/new`'s own note caught this:
  `conditionKey` is "picked from the map's vocabulary, not typed" — a genuinely separate,
  controlled field from `title` ("the person's own words"). This was an actual missing-field bug,
  not just an unwired input — see [[feedback_verify_against_endpoint_docs]] for the mistake that
  first missed it (I initially called the section "fully coverable" from the mocked `<input>`
  alone, without rereading the endpoint's request shape).
  **Fix:** added a real `SearchableSelect` for `conditionKey`, wired live to
  `GET /lifecycle/leakage-map`; kept `title` as a separate free-text input, relabeled "Name it, in
  your own words."
- **Condition vocabulary is grouped by `grid` in the dropdown, not flattened.** Originally planned
  to just dedupe conditions across all grids into one flat list. The user pasted a live response
  showing `grid` values are real, meaningful categories — `lifecycle_stage` (repeat_decay,
  involuntary_churn, abandonment, refunds, discount_dependency) and `segment` (spoilage, leakage,
  churn_risk, activation, expansion_gap) — not arbitrary groupings. Confirmed live data overrides
  the doc's own prose here, per [[feedback_build_incrementally_from_live_evidence]]. Still deduped
  by `condition.key` across grids for the actual stored value (`POST /rooms/new` only takes a bare
  `conditionKey`, never a `grid`), but the picker now shows a sticky group header per grid.
  `SearchableSelect` (`src/components/ui/searchable-select.tsx`) gained an optional `group` field
  to support this — backward compatible, the 2 other existing call sites (onboarding's
  country/timezone pickers) are untouched, still flat lists.
- **The "similar rooms" table moved from Step 1 to Step 2.** It was on the condition step in the
  original mock, but its backing endpoint, `POST /rooms/new/similar`, requires `rules` +
  `currency` — audience-targeting fields that don't exist until Step 2's rule builder. Calling it
  from Step 1 would have nothing real to send. Moved the table (still rendering `SIMILAR_ROOMS`
  mock data, not live yet) to sit right after Step 2's cohort-count card — the point where `rules`
  will actually exist once that step's own rule-builder is wired.
- **Whole-form state was introduced at the wizard level, shaped up front.** The wizard previously
  had zero shared state — every step was fully local/static, and there was no single object
  matching what `POST /rooms/new` actually needs at submit time. `index.tsx` now holds a
  `NewRoomForm` with one slice per step (`condition`, `audience`, `people`, `settle`, `review`),
  all five present from the start with typed empty defaults — even the four steps not wired yet —
  so the shape of the eventual submit body is visible immediately, not built up ad hoc as each
  step gets wired.
- **Temporary debug logging, at the user's request — remove once every step is wired and
  reviewed, not before.** Two `console.log` calls, both behind `// TEMP DEBUG` comments: a
  per-step log inside each step component (currently only `step-condition.tsx`) showing that
  step's own current values, and a whole-form log inside `index.tsx` showing the full
  `NewRoomForm` object (all 5 slices, including the still-empty placeholder ones) on every change.

## Per-step status

| Step | Endpoint(s) | Status | Notes |
|---|---|---|---|
| 1 — Condition | `GET /lifecycle/leakage-map` (vocabulary) | [x] built, **wired** | `step-condition.tsx`. Real loading/error/"no revenue model selected" states, no hardcoded fallback. `title`/`conditionKey` lifted to wizard-level `form.condition`. Not yet exercised against a live authenticated session in this sandbox (route is auth-gated) — `tsc -b` clean, code review only. |
| 2 — Audience | `POST /rooms/new/estimate` (live cohort count), `POST /rooms/new/similar` (duplicate table) | [ ] not wired | `step-audience.tsx` still renders `AUDIENCE_FILTERS`/`DROPOUT_ROWS` mock rows and the relocated `SIMILAR_ROOMS` table on mock data. Needs a real rule-builder before either endpoint has anything real to send. **Next up.** |
| 3 — People | `GET /rooms/*` people/agent suggestion source (not yet identified — no candidate endpoint found for "suggested people/agents" specifically; may just be workspace member + agent-roster lookups) | [ ] not wired | `step-people.tsx` still renders `SUGGESTED_PEOPLE`/`SUGGESTED_AGENTS` mock rows. |
| 4 — Settle | none identified yet — these are all plain form fields on `POST /rooms/new`'s body, no supporting GET found | [ ] not wired | `step-settle.tsx` still renders `SETTLE_OPTIONS`/`MEASURE_ROWS` mock rows. |
| 5 — Review / duplicate / submit | `POST /rooms/new/similar` (final duplicate check), `POST /rooms/new` (actual submit), `POST /rooms/{roomId}/link` | [ ] not wired | `step-review.tsx`/`step-duplicate.tsx` render `buildReviewRows`/`DUPLICATE_COMPARE` mock data. Final submit currently just `navigate()`s to a hardcoded room, no real API call. |

## Open questions

- **Step 3's people/agent suggestions:** no endpoint in `rooms.md` obviously supplies "suggested"
  people/agents for a given cohort/condition (as opposed to `GET /rooms/{roomId}/people`, which
  reads an *existing* room). Needs a check against `teams.md`/`workspace.md` or a backend
  confirmation before Step 3's coverage check can be answered properly.
