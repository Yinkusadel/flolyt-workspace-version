# Opportunities endpoints

Base path: `/api/v3/opportunities` → `OPPORTUNITIES_BASE_URL` / `API_ENDPOINTS.OPPORTUNITIES` in
[`src/config/apiConfig.ts`](../../src/config/apiConfig.ts). Introduced in
[`docs/leakage-map/leakage-map-v2-frontend-handoff.md`](../leakage-map/leakage-map-v2-frontend-handoff.md)'s
Phase 7, alongside Revenue Leakage V2 — a **separate, positive-polarity** resource: its values must
never be placed in the Leakage Map grid, subtracted from leakage, or presented as missed leakage.
It sits on its own rollout flag (`RevenueIntelligence:OpportunityV1:ReadRollout`), independent of
`LeakageV2:ReadRollout` — a workspace could in principle have one enabled without the other, though
only the combination has been tested live so far.

### GET /api/v3/opportunities

- **Purpose:** The "missed opportunity" projection — positive-polarity candidates for upside
  (e.g. product deepening), mirroring Leakage's cell/state model but never netted against it.
- **Auth:** Normal authenticated workspace context, same as Leakage.
- **Request:** **No query parameters are documented for this route at all** — unlike
  `GET /leakage`, which has an explicit `mode`/`horizon`/`market`/etc. list, the handoff doc gives
  none for this one. Called with no params; confirmed live 2026-10-01 to work this way (`200`, full
  real data back). Re-check if a future need (e.g. a horizon control) turns out to require one.
- **Response:**
  ```ts
  interface RevenueOpportunityPage {
    contractVersion: "1.0";
    polarity: "MISSED_OPPORTUNITY";
    publication: {
      snapshotId: string; runId: string; definitionVersion: string;
      asOfUtc: string; builtAtUtc: string; publishedAtUtc: string;
    };
    candidateCount: number;
    pricedCandidateCount: number;
    cells: Array<{
      id: string;
      polarity: "MISSED_OPPORTUNITY";
      opportunityType: string;
      sectorProfileId: string;
      revenueStage: string;
      subjectType: string;
      grain: string;
      unit: string;
      state: "POPULATED" | "UNKNOWN" | "NO_OPPORTUNITY";
      candidateCount: number;
      amounts: Array<{
        currency: string; market?: string | null;
        grossPotential: number; expectedGain?: number | null;
        calibration: "ASSUMPTION" | "CALIBRATED" | "EMPIRICAL";
        candidateCount: number;
      }>;
      limitations: string[];
    }>;
    limitations: string[];
  }
  ```
  Render rules from the handoff doc: show `candidateCount` on a `POPULATED` cell; render money only
  from `amounts[]` — an empty `amounts` with a nonzero `candidateCount` means "evidence-backed but
  deliberately unpriced," not a zero. Never combine two `amounts[]` entries (different
  currency/calibration) into one figure.
- **Used by:** `services/api/opportunities/get-opportunities.ts`,
  `features/opportunities/use-get-opportunities.ts`, wired into
  `src/pages/leakage-map/opportunities-panel.tsx` — rendered as its own section below the Leakage
  V2 cell grid/rollups on `/leakage-map`, only fetched once the page has confirmed it's on a V2
  workspace (`enabled: !!leakageV2`). See [docs/leakage-map/v2-build-plan.md](../leakage-map/v2-build-plan.md) Step 5.
- **Status:** documented, scaffolded, wired, live-verified (partial)
- **Notes:** Confirmed live 2026-10-01 against the same V2-flagged test workspace
  (`financial-services` sector) used for Leakage V2 testing — real `200`, `contractVersion: "1.0"`,
  one cell (`product_deepening` under the `expand` stage, `UNKNOWN` state, `candidateCount: 0` —
  this workspace has no connected source that exposes the required capability). **The
  `POPULATED`-with-real-`amounts[]` path is unconfirmed live** — this workspace's data is as thin
  for opportunities as it is for leakage, so the priced-candidate rendering (currency, calibration,
  `expectedGain`) is built to the documented shape only, not yet seen against a real priced example.

## Update 2026-10-04 (Phase 4 + canonical signals, definition version 1.2.0)

Types added to `get-opportunities.ts`; **documented, scaffolded, not wired, not live-verified.** Both
additions are optional on a cell: older publications omit them until a refresh and must still read.

- **`cells[].explanation`**: `label` (render "Transaction growth readiness" for the current financial-services
  rule; `opportunityType: product_deepening` stays the stable id, not the title), `measurementState`
  (`MEASURED | PARTIAL_SCOPE | PARTIAL_HISTORY | WAITING_FOR_DATA | BLOCKED | NOT_RECORDED`),
  `valuationState` (`UNPRICED_READINESS | NOT_ASSESSED | PRICED`), `summary`, `reasons[]`,
  `missingRequirements`, `eligibleUnits`, `usableUnits`. ⚠️ No TS block in the doc: `reasons[]` elements
  are typed loosely. Reason action labels are guidance, not executable actions.
- **`cells[].signalCount` / `signalPreview[]`**: `signalCount` is the full count of detector signals (not
  unique businesses, not money). `signalPreview` is at most 20 in deterministic ID order (not a revenue
  ranking); label it a preview when shorter than `signalCount`. No paging endpoint exists. Signal shape is
  from a real TS block (`OpportunitySignal`): stage, `pricingState`, `valuation`, `confidence` (signal
  confidence, never probability of capture), `availableWindow`, `evidence`, `owner`, `outcome`.
- **Rules:** never render unpriced readiness as zero missed revenue, guaranteed expansion, or a full
  inventory; unknown probability/cost/window/owner/outcome must not show as zero, expired, assigned or
  captured; money only from `valuation`/`outcome` per signal and `amounts[]` in aggregate, never sum the
  preview; no FX ranking and no subtraction from Leakage. This release produces only DETECTED/UNPRICED
  transaction-growth signals, with no assignment/pursuit/outcome mutation endpoints. Signal IDs are not
  stable workflow IDs across refreshes.
