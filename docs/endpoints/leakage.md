# Leakage endpoints

Base path: `/api/v3/leakage` → `LEAKAGE_BASE_URL` / `API_ENDPOINTS.LEAKAGE` in
[`src/config/apiConfig.ts`](../../src/config/apiConfig.ts). Pasted 2026-09-22 from the
Scalar/OpenAPI reference doc (prose descriptions + example request/response payloads, same source
format as [[lifecycle]] and [[rooms]]'s corrected passes). **A real `GET /leakage`,
`GET /leakage/stages/{stageKey}`, `GET /leakage/report`, and `GET /leakage/cells/{...}` response
were all confirmed live** across three passes: 2026-09-22/23 on a workspace with no completed
refresh yet (`coverage.measured: 0`, `cells` empty everywhere, `report`'s `markets: []`), then
**2026-09-24 on the same workspace after a real data source was connected** — the first genuinely
measured cells/stages/coverage this domain has seen (`coverage.percent: 20`, real multi-currency
`atStake` arrays, a real measured grid cell). `GET /leakage/cells/{...}` refuses a bad coordinate
with a plain thrown error rather than a `200` with `data: null` (still true), but was also
confirmed live for a **real, successfully measured** coordinate (see its section below).
`conditions` and `GET /leakage/report`'s per-market entry shape are still unconfirmed against a
real call — per [[feedback_verify_against_endpoint_docs]].

This is the leakage map/page's own domain, separate from the pre-redesign `LIFECYCLE.GET_LEAKAGE_MAP`
scaffold in `src/services/api/lifecycle-old/get-leakage-map.ts` (that one is part of the archived
pre-rooms-first-home surface — see [[flolyt_archived_sections_note]] and
[[flolyt_leakage_map_rebuild]] for the current, still mock-only page it belongs to). Nine operations
below, all newly documented and scaffolded (service + hook), 0/9 wired into a page.

**One correction made while adding this pass:** `ROOMS.OPEN_ROOM_ON_LEAKAGE_CELL` (a never-wired
placeholder documented in [rooms.md](rooms.md) as `POST /rooms`) had the wrong path and the wrong
body shape — both were a guess made before this full spec existed. The real endpoint is
`POST /api/v3/leakage/cells/{grid}/{row}/{condition}/{currency}/room` below, with a `settlement`
object in the body, not a flat `{grid, rowKey, conditionKey, currency, title}`. The old
`src/services/api/rooms/open-room-on-leakage-cell.ts` / `src/features/rooms/use-open-room-on-leakage-cell.ts`
files were deleted and replaced by the corrected ones under `leakage/` below; `rooms.md`'s entry
now points here instead of describing it independently.

## ⚠️ One response in this paste is still truncated

Per [[feedback_stop_on_truncated_endpoint_fields]] — flagging this rather than guessing:

- `GET /leakage/report`'s `topLeaks[]` example ends with `"...": "[Additional Properties
  Truncated]"` after `net`, despite the endpoint's own prose saying each leak carries "its owner" —
  that field's real name isn't visible anywhere in the capture, so `LeakageTopLeakDto` (in
  `get-leakage-report.ts`) doesn't include it. Re-paste with Scalar's "Show Schema" toggle (not the
  example tab) before wiring `topLeaks` into a UI.
- `GET /leakage`'s `grids[].cells[]` was ALSO truncated in the original 2026-09-22 paste (cut off
  after `roomId`), but a full, untruncated real cell was pasted live 2026-09-24 — see "Fields
  confirmed live" below. `LeakageCellDto` is now complete.

## Fields confirmed live vs. still inferred

**Confirmed live 2026-09-22:** `atStake`, `expected`, `population` (stage card + stage detail),
`departedThisMonth` (stage detail), `movement` (stage detail), and `headline.yearOverYear` are all
the *same* measured-value wrapper — `LeakageMeasuredValueDto<T> = { value: T | null, state: string,
missingSource?: string, wouldUnlock?: string }` — the same convention the old lifecycle domain's
`LifecycleMeasuredValueDto` used. The wrapper object itself is never `null`; only `.value` is. This
was originally typed as several different ad-hoc shapes per field — corrected. `atStake`'s inner
array is confirmed to use `{ currency, amountAtRisk }` (not `amount`), which is exactly the shape
`formatAtStakeAmounts` in `src/lib/format-measured-value.ts` already expects. `marketLens` is
confirmed to be `null` itself (not just its sub-fields) when the workspace has no market data yet.

**Still inferred (outer wrapper confirmed by analogy, inner content is not):** every `expected`
and `movement` seen live so far — including 2026-09-24's real-coverage pull — was still
`state: "unavailable"`, so `LeakageExpectedEntryDto`'s and `LeakageMovementValueDto`'s fields (what
`.value` looks like once populated) remain a guess from the endpoints' own prose.

**`GET /leakage`'s grid-inline `LeakageCellDto` fully confirmed live 2026-09-24**, correcting the
2026-09-22 truncated guess in two ways: (1) `amount`/`customers`/`intensity` really are plain
nullable scalars, not `LeakageMeasuredValueDto`-wrapped like the rest of this API family — confirmed
by a real measured cell (`state: "available"`, `amount: 7023.98`, `customers: 24`, `intensity: 1`)
sitting right next to gap ones; (2) the cell carries **six more fields the truncated paste never
showed**: `reason` (confirmed literal `"NotMeasuredByFlolyt"` — a different string than the
click-through detail's own `reason`, which only ever showed `"SourceMissing"`), `missingSource`,
`wouldUnlock`, `neverEstimated` (boolean), `calculation` (populated only when measured, `null` on a
gap), and `realized` (a plain number when measured, `null` on a gap). A genuine measured zero is
real too (`state: "available"`, `amount: 0`, `customers: 0`) — not a gap, confirmed live. `intensity`
looks bounded like a 0–1 score (a real measured cell was `1`; several real-zero cells were `0`),
though only those two endpoints have been observed.

**`GET /leakage/report` confirmed live 2026-09-23** (same no-refresh-yet workspace) — but only its
**top-level shape**: `window`/`horizon`/`refreshedAtUtc`/`coverage`/`calculation` all matched the
already-documented `LeakageWindowDto`/`LeakageHorizonDto`/`LeakageCoverageDto`/`LeakageCalculationDto`
exactly, field-for-field, no surprises. `markets` came back `[]` (no completed refresh), so the
**per-market entry shape is still 100% unconfirmed** — `gross`/`realized`/`expected`/`net`/
`conditions`/`bySeverity`/`byHorizon`/`topLeaks`/`actions` all remain typed from prose alone.
Re-check once a workspace with `coverage.measured > 0` produces a non-empty `markets[]`.
Incidentally, this response's `coverage.unmeasuredConditions` names this workspace's real 10
conditions (Repeat decay, Involuntary churn, Abandonment, Refunds, Discount dependency, Spoilage,
Leakage, Churn risk, Activation, Expansion gap) — confirms a real workspace has **10** conditions
on its map, not the old mock's 5, reinforcing why the matrix's columns must render from
`grid.conditions` dynamically (see docs/leakage-map/build-plan.md mismatch #4).

## Shared shapes

Defined once in `src/services/api/leakage/get-leakage.ts` and imported by the other eight files,
the way `get-lifecycle-map.ts` anchors the old lifecycle domain:

```ts
interface LeakageWindowDto {
  days: number; key: string; label: string; isPrecomputed: boolean; options: string[];
}
interface LeakageHorizonDto {
  days: number; key: string; label: string; mode: string; modeNote: string | null; options: string[];
}
interface LeakageSeverityLevelDto { level: string; label: string; cadence: string; }
interface LeakageSourceDto { id: string; name: string; kind: string; status: string; }
interface LeakageCalculationDto {
  method: string; windowStartUtc: string | null; windowEndUtc: string | null; windowDays: number;
  sources: LeakageSourceDto[]; inputs: { label: string; value: string }[]; caveats: string[];
}
interface LeakageOwnerDto { ownerUserId: string; displayName: string; isActive: boolean; }
// Confirmed live 2026-09-22 — the wrapper every independently-gappable figure in this API uses.
interface LeakageMeasuredValueDto<T> {
  value: T | null; state: string; missingSource?: string; wouldUnlock?: string;
}
interface LeakageHeadlineDto {
  key: string; label: string; unit: string; value: number | null; missingSource: string | null;
  wouldUnlock: string | null; computedAtUtc: string | null;
  yearOverYear: LeakageMeasuredValueDto<number>; // confirmed live — not a bare number
}
interface LeakageRealizedAmountDto { currency: string; amount: number; }
// Confirmed live — atStake's inner field is `amountAtRisk`, matching
// src/lib/format-measured-value.ts's formatAtStakeAmounts exactly.
interface LeakageAtStakeAmountDto { currency: string; amountAtRisk: number; }
```

`window` is one of `30 | 90 | 180 | 365 | "qtd" | <days up to 365>`, default 90, refused otherwise.
`horizon` is one of `30 | 60 | 90 | "quarter" | 365 | <days>`, default 90 — window looks back,
horizon looks forward, and every expected-loss figure is computed over the horizon, not the window.
`severity` is `s1`–`s5` on the workspace's own per-currency materiality ladder; a gap cell is always
`s5`. Money is never summed across currencies or across conditions, and coverage/`bySeverity` stay
the whole picture even when `minSeverity`/`minConfidence` hide cells from the grid.

## GET /api/v3/leakage

- **Purpose:** The whole leakage page in one read — ten stage cards, the customer-state/segment ×
  condition grid(s), the per-market rail, coverage, severity bands, and a calculation block on
  every figure.
- **Request:** query `window?`, `market?` (country code), `horizon?`, `calculate?`
  (`"gross" | "expected" | "net"`, default `"gross"`), `minSeverity?` (`s1`–`s5`),
  `minConfidence?` (`"low" | "medium" | "high"`).
- **Response:**
  ```ts
  interface LeakagePageData {
    window: LeakageWindowDto;
    horizon: LeakageHorizonDto;
    refreshedAtUtc: string | null;
    customerCount: number;
    revenueModel: string | null;
    stages: LeakageStageCardDto[];   // 10 cards; atStake/population/expected use LeakageMeasuredValueDto
    callouts: { key: string; tone: string; headline: string; body: string }[];
    marketLens: { countryCode: string; currencyCode: string; isPrimary: boolean } | null; // confirmed nullable
    grids: LeakageGridDto[];         // customer-state and/or segment × condition — confirmed live: this
                                      // workspace has BOTH a "lifecycle_stage" grid and a "segment" grid
                                      // at once, not a hypothetical future case
    markets: LeakageMarketRailEntryDto[];
    coverage: LeakageCoverageDto;    // measured/onMap/percent + the two condition-name lists + sentence
    filter: { calculate: string; minSeverity: string | null; minConfidence: string | null; cellsHidden: number };
    bySeverity: { currency: string; bands: { level: string; label: string; cells: number; amount: number }[] }[];
    ladders: { currency: string; s1From: number; s2From: number; s3From: number }[];
    calculation: LeakageCalculationDto;
  }
  ```
  A condition the business doesn't have is absent from the response entirely; one it has but
  hasn't connected is a dashed cell naming the missing source. `LeakageCellDto` (inside each grid)
  is truncated in the paste — see the ⚠️ section above.
- **Used by:** `services/api/leakage/get-leakage.ts`, `features/leakage/use-get-leakage.ts`. Wired
  into `src/pages/leakage-map/index.tsx`'s filter bar, page-state banner (loading/error/empty), and
  `stage-rail.tsx` — see [[flolyt_leakage_map_wiring]] Steps 1–2. The matrix, coverage panel,
  actions panel, and market breakdown are still mock, wired in later steps.
- **Status:** documented, scaffolded, partially wired (filters, page shell, stage rail)

## GET /api/v3/leakage/report

- **Purpose:** The exposure framework's report, per market and never blended — gross exposure,
  expected loss, net expected loss (each with 80% range/confidence/severity), coverage, exclusions,
  cells by severity, expected/net over every horizon the picker names, the top ten leaks with
  owners, and the rooms open on them.
- **Request:** query `window?`, `horizon?` — same options as the page.
- **Response:**
  ```ts
  interface LeakageReportData {
    window: LeakageWindowDto;
    horizon: LeakageHorizonDto;
    refreshedAtUtc: string | null;
    coverage: LeakageCoverageDto;
    markets: {
      currency: string; countryCode: string | null; isPrimary: boolean;
      gross: number | null; realized: number | null; expected: number | null; net: number | null;
      conditions: { key: string; label: string; gross: number; severity: LeakageSeverityLevelDto; expected: number | null }[];
      excludes: string[];
      bySeverity: { level: string; label: string; cells: number; amount: number }[];
      byHorizon: { key: string; label: string; days: number; mode: string; expected: number | null; net: number | null }[];
      topLeaks: LeakageTopLeakDto[]; // truncated in the paste, see ⚠️ above — no `owner` field typed
      actions: { openRooms: number; owners: string[] };
    }[];
    calculation: LeakageCalculationDto;
  }
  ```
  Every figure here is one the page (`GET /leakage`) also shows, composed in the framework's order
  — this is a report over the same numbers, not a separate calculation.
- **Used by:** `services/api/leakage/get-leakage-report.ts`, `features/leakage/use-get-leakage-report.ts`. Not wired.
- **Status:** documented, scaffolded, not wired

## GET /api/v3/leakage/conditions

- **Purpose:** Every condition the workspace's revenue model implies, with the verdict on whether
  the business has it (`Applies` / `NotApplicable` / `Unknown`), who decided, and why. This is
  where not-applicable columns the page drops stay visible, along with the override that hid them.
- **Request:** none.
- **Response:**
  ```ts
  interface LeakageConditionsData {
    revenueModel: string | null;
    conditions: {
      key: string; label: string; revenueModel: string;
      applicability: "Unknown" | "Applies" | "NotApplicable";
      because: string; decidedBy: string; measurable: boolean;
      override: {
        applicability: "Unknown" | "Applies" | "NotApplicable"; because: string;
        setByUserId: string; setByName: string; setAtUtc: string;
      } | null;
    }[];
  }
  ```
- **Used by:** `services/api/leakage/get-leakage-conditions.ts`, `features/leakage/use-get-leakage-conditions.ts`. Not wired.
- **Status:** documented, scaffolded, not wired

## PUT /api/v3/leakage/conditions/{key}

- **Purpose:** As an administrator, decide whether a condition applies to this business.
- **Request:** path `key`; body `{ applicability: "Applies" | "NotApplicable", because: string }`
  — `because` is required. `"Unknown"` is what inference produces and is refused if sent; the
  request payload type (`LeakageConditionDecision`) deliberately excludes it rather than reusing
  the three-way `applicability` union the read side returns.
- **Response:** the updated condition, same shape as one entry of `GET /conditions`'s list.
  Setting `Applies` again brings a hidden column back. Recorded with who decided and when.
- **Used by:** `services/api/leakage/update-leakage-condition.ts`, `features/leakage/use-update-leakage-condition.ts`. Invalidates both `["leakage-conditions"]` and `["leakage"]` on success (a condition's applicability decides whether the page's grid even shows that column). Not wired.
- **Status:** documented, scaffolded, not wired

## GET /api/v3/leakage/cells/{grid}/{row}/{condition}/{currency}

- **Purpose:** The panel behind a click on a cell. A measured cell carries its figure, who's
  behind it, what moved since a comparable earlier reading, the room already open on it (if any),
  and the draft a new room would use. A gap cell carries which of three reasons it is, the sentence
  to show, how many other cells the same missing source would fill, and the semantic columns it
  needs.
- **Request:** path `grid`, `row`, `condition`, `currency`; query `window?`, `horizon?` (default 90
  — selects the forward period of the `expected` figure carried beside the gross one).
- **Response:**
  ```ts
  interface LeakageCellDetailDto {
    coordinate: string; grid: string; rowKey: string; rowLabel: string;
    conditionKey: string; conditionLabel: string; label: string; currency: string; windowDays: number;
    state: string; amount: number | null; customers: number | null;
    movement: LeakageMeasuredValueDto<{ direction: string | null; amountChange: number | null; percentChange: number | null; comparedToLabel: string | null }>; // outer wrapper confirmed live, inner content still a guess
    expected: LeakageMeasuredValueDto<LeakageExpectedEntryDto>; // outer wrapper confirmed live, inner content still a guess
    horizon: LeakageHorizonDto; severity: LeakageSeverityLevelDto;
    room: { roomId: string; title: string; openedAtUtc: string; ownerMemberId: string | null; ownerName: string | null; canSeeInside: boolean } | null;
    draft: {
      grid: string; rowKey: string; conditionKey: string; currency: string; title: string;
      settlesWhen: string[]; measuredOverDays: number; primaryMeasure: string; revenueBasis: string;
      holdoutPercent: number | null; wouldProveUsWrong: string | null;
    } | null;
    reason: string | null; // only confirmed literal is "SourceMissing"; see LeakageCellGapReason's note
    missingSource: string | null; wouldUnlock: string | null; explanation: string | null;
    alsoFills: number | null; connect: { roles: string[] } | null; neverEstimated: boolean;
    calculation: LeakageCalculationDto; computedAtUtc: string; realized: number | null;
    signals: { name: string; description: string; leadTime: string; kind: string; watchable: boolean; citation: string }[];
    guidance: { name: string; definition: string; leading: string; detection: string; diagnosis: string; fix: string; prevention: string; impact: string; citation: string }[];
  }
  ```
  The surface never decides between "open room" and "create room", and never invents a default —
  `room` vs `draft` is that decision, made server-side. A cell whose condition has been taken off
  the map (`NotApplicable`) is refused, not served.
- **Used by:** `services/api/leakage/get-leakage-cell.ts`, `features/leakage/use-get-leakage-cell.ts` (hook only fires once all four path params are present). Wired into `src/pages/leakage-map/detail-panel.tsx`'s `CellDetailCard`, opened from a matrix cell click in `matrix.tsx`.
- **Status:** documented, scaffolded, wired, **live-verified end-to-end 2026-09-24**
- **Confirmed live 2026-09-22:** a refused coordinate (no cell at that address) comes back as a
  thrown HTTP error — `{ data: null, messages: ["That cell is not on the leakage map…"], succeeded:
  false }` on a non-2xx status — not a `200` with `data: null`. `getServerErrorMessage` already
  reads `messages[]` correctly, so the existing try/catch in `get-leakage-cell.ts` needed no change.
- **Confirmed live 2026-09-24** for `active × repeat_decay × NGN` on the newly-connected-source
  workspace: clicking a real `₦4.3M` matrix cell fired `GET .../cells/lifecycle_stage/active/
  repeat_decay/NGN?window=90&horizon=90` and rendered the real amount, severity ("Low"), and
  customer count (11), with `movement`/`expected` correctly gapped and a "Start a room" button
  present (so `draft` was non-null) — no console errors. `room`/`signals`/`guidance` populated
  still hasn't been seen (this cell had none open).

## POST /api/v3/leakage/cells/{grid}/{row}/{condition}/{currency}/room

- **Purpose:** Opens a room on this cell, from the draft the panel handed back. Second door onto
  the same command an agent's proposal card runs — the coordinate dedups, so a room opened from
  the map and one an agent proposed are the same object; clicking a cell somebody's already working
  joins their room instead of splitting the evidence.
- **Request:** path `grid`, `row`, `condition`, `currency`; body is the (possibly edited) draft:
  ```ts
  interface OpenRoomOnLeakageCellPayload {
    grid: string; row: string; condition: string; currency: string; title: string | null;
    settlement: {
      settlesWhen: string[]; measuredOverDays: number; primaryMeasure: string; revenueBasis: string;
      holdoutPercent?: number | null; noHoldoutBecause?: string | null; wouldProveUsWrong?: string | null;
    };
  }
  ```
  Corrected from the earlier `rooms.md` guess — real body nests settlement fields under
  `settlement`, not flat.
- **Response:** `{ data: roomId, messages, succeeded }` — `data` is a plain string (uuid).
- **Used by:** `services/api/leakage/open-room-on-leakage-cell.ts`, `features/leakage/use-open-room-on-leakage-cell.ts`. Invalidates `["rooms"]`, `["leakage-cell"]`, and `["leakage"]` on success. Wired into `CellDetailCard`'s "Start a room" button — sends the cell's own `draft` object as-is, no client-side edit form.
- **Status:** documented, scaffolded, wired, **live-confirmed end-to-end 2026-09-24** — button
  present and correctly gated on a real cell with a non-null `draft`, and the "Start a room" click
  itself (the actual POST) confirmed working, navigating to the new room.
- **Notes:** Refused on a cell with no figure behind it. Supersedes the never-wired
  `ROOMS.OPEN_ROOM_ON_LEAKAGE_CELL` placeholder — see the correction note at the top of this file.

## POST /api/v3/leakage/stages/{stageKey}/learn-why

- **Purpose:** Ask the stage's own specialist why it's leaking. Opens a conversation seeded with a
  brief the product writes (coordinate, window, the figure being explained, which sources are
  connected/not) so an explanation that exceeds the evidence is visible as such, and the same click
  twice asks the same question.
- **Request:** path `stageKey`; query `window?`, `horizon?` (default 90 — picks the expected loss
  the brief states beside the gross figure, where the panel has one). No body.
- **Response:**
  ```ts
  interface LearnWhyConversationDto {
    conversationId: string; runId: string; agentKey: string; agentName: string;
    title: string; question: string; windowDays: number;
  }
  ```
  Returns the conversation/run to attach the existing chat panel's SSE to — the turn renders like
  any other. Refused on a stage with no measured figure ("a gap is not a question").
- **Used by:** `services/api/leakage/learn-why-leakage-stage.ts`, `features/leakage/use-learn-why-leakage-stage.ts`. Wired into `src/pages/leakage-map/detail-panel.tsx`'s `StageDetailCard` — see [[flolyt_leakage_map_wiring]] Step 3.
- **Status:** documented, scaffolded, wired — refusal-gating **fixed**
- **Second, previously-undocumented refusal case confirmed live 2026-09-23, now fixed:** the doc's
  prose originally named only one refusal ("a gap is not a question" — no measured figure at all,
  i.e. `atStake`/`headline` value is `null`). Clicking "Learn why" on Acquire — whose `atStake.value`
  was a real, non-null `[{ currency: "NGN", amountAtRisk: 0 }]` — was refused anyway:
  ```json
  { "data": null, "messages": ["There is nothing to explain at Acquire: nothing is leaking there over this window — the refresh ran and found nought, which is a result rather than a gap."], "succeeded": false }
  ```
  So the server distinguishes **two** unanswerable states, not one: unmeasured (`value: null`, "a
  gap is not a question") vs. measured-but-zero (a real `0`, "a result rather than a gap"). The
  frontend gate is now `hasLeakToExplain = stage.atStake.value?.some((amount) => amount.amountAtRisk > 0)`
  ([detail-panel.tsx:100](../../src/pages/leakage-map/detail-panel.tsx)) — `> 0`, not just
  non-`null`, so an all-zero stage no longer shows a button guaranteed to hit this refusal.

## POST /api/v3/leakage/cells/{grid}/{row}/{condition}/{currency}/learn-why

- **Purpose:** The same question about one cell rather than a whole stage — where Home's prompts
  point, since a suggestion carrying a cell coordinate needs a door. Answered by the specialist of
  the stage the cell rolls up to, or the workspace's own agent where the axis doesn't reach one.
- **Request:** path `grid`, `row`, `condition`, `currency`; query `window?`, `horizon?`. No body.
- **Response:** same `LearnWhyConversationDto` shape as the stage version (shared type, defined in
  `learn-why-leakage-stage.ts`).
- **Used by:** `services/api/leakage/learn-why-leakage-cell.ts`, `features/leakage/use-learn-why-leakage-cell.ts`. Wired into `CellDetailCard`'s "Learn why" button, gated on `cell.amount !== null` ([detail-panel.tsx:415](../../src/pages/leakage-map/detail-panel.tsx)) — **unlike the now-fixed stage gate, this one is still non-`null`-only, not `> 0`**, so it likely still has the same "measured-zero still refused" gap the stage version had before its fix. **Button confirmed present live 2026-09-24; the mutation itself wasn't clicked (creates a real conversation).**
- **Status:** documented, scaffolded, wired — not live-exercised; gate not yet aligned with the stage fix
- **Notes:** Refused on a cell the map isn't showing, or one with no figure behind it.

## GET /api/v3/leakage/stages/{stageKey}

- **Purpose:** The panel behind a click on a stage card — money over the window and its movement,
  population, who left this month, the headline, open-room count, and which customer states the
  stage spans (so the matrix below can highlight them).
- **Request:** path `stageKey`; query `window?`, `market?`, `horizon?` (default 90 — selects the
  forward period of the expected figure, summed over the stage's cells per currency).
- **Response:**
  ```ts
  interface LeakageStageDetailDto {
    key: string; name: string; position: number; owningTeam: string | null; owner: LeakageOwnerDto | null;
    reviewCadence: string | null; windowDays: number; horizon: LeakageHorizonDto;
    marketLens: { countryCode: string; currencyCode: string; isPrimary: boolean } | null; // confirmed nullable
    atStake: LeakageMeasuredValueDto<LeakageAtStakeAmountDto[]>;
    expected: LeakageMeasuredValueDto<LeakageExpectedEntryDto[]>; // outer confirmed, inner still a guess
    severity: { currency: string; severity: LeakageSeverityLevelDto }[];
    movement: LeakageMeasuredValueDto<{ direction: string | null; amountChange: number | null; percentChange: number | null; comparedToLabel: string | null }>; // outer confirmed, inner still a guess
    population: LeakageMeasuredValueDto<number>;
    departedThisMonth: LeakageMeasuredValueDto<number>; // per calendar month, not per window — calculation says so
    headline: LeakageHeadlineDto; openRoomCount: number;
    spansStates: string[]; // empty for the 7 stages the customer-state axis doesn't reach — honest, not a gap
    learnWhy: { agentKey: string; agentName: string } | null; // confirmed nullable — see below
    calculation: LeakageCalculationDto; refreshedAtUtc: string | null;
    realized: LeakageRealizedAmountDto[];
  }
  ```
- **Used by:** `services/api/leakage/get-leakage-stage.ts`, `features/leakage/use-get-leakage-stage.ts`. Wired into `StageDetailCard` (lazy-fetched on a stage card click) — see [[flolyt_leakage_map_wiring]] Step 3.
- **Status:** documented, scaffolded, wired and live-verified
- **`learnWhy` confirmed nullable live 2026-09-24:** it is `null` for `churn`, the one stage whose
  page-level entry also has `leadAgentKey: null` / `leadAgentName: null` — no specialist exists to
  ask. It was typed non-nullable from the doc's example (which only showed a stage that had one),
  so `StageDetailCard` read `.agentName` off it unguarded and threw
  `Cannot read properties of null (reading 'agentName')` during render, escaping to the route-level
  error boundary and taking the whole page down with "Something went wrong". Type corrected and the
  label made null-safe. **Still open:** the "Learn why" button's own gate
  (`atStake.value?.some((a) => a.amountAtRisk > 0)`) asks whether a leak is measured, not whether
  there is an agent to ask — so on any stage carrying a real amount but no specialist the button
  still renders, under the plain "Learn why" label. Deliberately left as-is pending a product
  decision, same as the measured-zero refusal question above.
- **Confirmed live 2026-09-22** for the `acquire` stage on a workspace with no completed refresh —
  every gapped field's `missingSource`/`wouldUnlock` sentence reads exactly as described in the
  endpoint's prose. `atStake` was `available` (`[{ currency: "NGN", amountAtRisk: 0 }]`); every
  other measured-value field was `unavailable`.
