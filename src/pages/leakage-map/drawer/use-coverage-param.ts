import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export type CoverageTab = "holding-back" | "signals" | "ratios";
const TABS: CoverageTab[] = ["holding-back", "signals", "ratios"];

/**
 * Whether the Coverage sheet is open, and on which tab, lives in the URL (`?coverage=holding-back`,
 * `signals` or `ratios`), like the other sheets, so a refresh keeps it and Back closes it. Opening it closes
 * the cell and diagnostics sheets.
 */
export function useCoverageParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get("coverage");
  const tab: CoverageTab | null = TABS.find((t) => t === raw) ?? null;

  const update = useCallback(
    (next: CoverageTab | null, replace: boolean) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next) {
            params.set("coverage", next);
            params.delete("cell");
            params.delete("panel");
            params.delete("diagnostics");
          } else {
            params.delete("coverage");
          }
          return params;
        },
        { replace }
      );
    },
    [setSearchParams]
  );

  const openCoverage = useCallback((next: CoverageTab = "holding-back") => update(next, false), [update]);
  const setCoverageTab = useCallback((next: CoverageTab) => update(next, true), [update]);
  const closeCoverage = useCallback(() => update(null, true), [update]);
  return { tab, openCoverage, setCoverageTab, closeCoverage };
}
