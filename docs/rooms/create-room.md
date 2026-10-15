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
  reviewed, not before.** `console.log` calls behind `// TEMP DEBUG` comments: a per-step log
  inside each wired step component (`step-condition.tsx`, `step-audience.tsx`) showing that
  step's own current values, and a whole-form log inside `index.tsx` showing the full
  `NewRoomForm` object (all 5 slices, including the still-empty placeholder ones) on every change.
- **Step 2's `field` is free text, not a picked vocabulary — confirmed by a live test, not
  guessed.** The endpoint spec gives `field` no enum (unlike `operator`, which is a real fixed
  enum: `Equals`/`NotEquals`/`GreaterThan`/`LessThan`/`GreaterThanOrEquals`/
  `LessThanOrEquals`/`Contains`/`NotContains`/`IsSet`/`IsNotSet`). The user tested
  `POST /rooms/new/estimate` live with `field: "hi"` (not a real customer attribute) and got a
  200 back both times (matched everyone with `value: null`, matched no one with `value: 20`) —
  no 400, no validation error. That rules out a fixed field vocabulary; the backend accepts any
  string and just computes against it. So the rule-builder's field input is a plain text box
  (`ROOM_RULE_OPERATORS` in `new-room-data.ts` supplies the operator dropdown only), same
  pattern as `value` — there's no equivalent of Step 1's `GET /lifecycle/leakage-map` needed
  here.
- **Currency is picked per-room from `GET /currency/supported`, not inherited from anywhere.**
  No workspace-level "current reporting currency" is readable outside the onboarding flow (only
  `onboarding/workspace` and `onboarding/start` read currency endpoints today), so Step 2 asks
  directly — a row of currency chips sourced live, nothing pre-selected.
- **`POST /rooms/new/estimate` and `POST /rooms/new/similar` are debounced together, 400ms,
  keyed off the rule list + currency** (same 400ms debounce pattern as `useSlugAvailable`).
  Both fire once at least one rule has a non-empty `field` and a currency is picked; neither
  call is a `useQuery` (they're POST, "not a saved list," per the endpoint's own note that
  nothing persists) so both stay `useMutation`-based, extended to also expose `data`/`isError`
  so the step can render live results instead of just firing-and-forgetting.
- **The dropout list and similar-rooms table now render live data, not the old mock shape.**
  `DROPOUT_TONE` in `new-room-data.ts` maps known `dropOut[].key` values seen in a real response
  (`matched`, `no-contact`, `opted-out`, `at-cap`, `reachable`) to a tone, falling back to
  neutral for any key not yet seen live. The old `AUDIENCE_FILTERS`/`DROPOUT_ROWS`/
  `SIMILAR_ROOMS` mock exports were deleted from `new-room-data.ts` (confirmed unused
  elsewhere first).

## Per-step status

| Step | Endpoint(s) | Status | Notes |
|---|---|---|---|
| 1 — Condition | `GET /lifecycle/leakage-map` (vocabulary) | [x] built, **wired** | `step-condition.tsx`. Real loading/error/"no revenue model selected" states, no hardcoded fallback. `title`/`conditionKey` lifted to wizard-level `form.condition`. Not yet exercised against a live authenticated session in this sandbox (route is auth-gated) — `tsc -b` clean, code review only. |
| 2 — Audience | `GET /currency/supported` (currency picker), `POST /rooms/new/estimate` (live cohort count + dropout), `POST /rooms/new/similar` (duplicate table) | [x] built, **wired** | `step-audience.tsx`. Real rule-builder (free-text `field`, fixed-enum `operator` dropdown, `value`, `and`/`or` `logicOperator` between rows, add/remove), currency chips, debounced (400ms) live calls to both room endpoints once a currency + ≥1 non-empty rule exist. Real loading/error/empty states throughout, no hardcoded fallback. `rules`/`currency` lifted to wizard-level `form.audience`. Not yet exercised against a live authenticated session — `tsc -b` clean, code review only. |
| 3 — People | `GET /rooms/*` people/agent suggestion source (not yet identified — no candidate endpoint found for "suggested people/agents" specifically; may just be workspace member + agent-roster lookups) | [ ] not wired | `step-people.tsx` still renders `SUGGESTED_PEOPLE`/`SUGGESTED_AGENTS` mock rows. |
| 4 — Settle | none identified yet — these are all plain form fields on `POST /rooms/new`'s body, no supporting GET found | [ ] not wired | `step-settle.tsx` still renders `SETTLE_OPTIONS`/`MEASURE_ROWS` mock rows. |
| 5 — Review / duplicate / submit | `POST /rooms/new/similar` (final duplicate check), `POST /rooms/new` (actual submit), `POST /rooms/{roomId}/link` | [ ] not wired | `step-review.tsx`/`step-duplicate.tsx` render `buildReviewRows`/`DUPLICATE_COMPARE` mock data. Final submit currently just `navigate()`s to a hardcoded room, no real API call. |

## Open questions

- **Step 3's people/agent suggestions:** no endpoint in `rooms.md` obviously supplies "suggested"
  people/agents for a given cohort/condition (as opposed to `GET /rooms/{roomId}/people`, which
  reads an *existing* room). Needs a check against `teams.md`/`workspace.md` or a backend
  confirmation before Step 3's coverage check can be answered properly.
