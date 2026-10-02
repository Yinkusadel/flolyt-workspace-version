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
