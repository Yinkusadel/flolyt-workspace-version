import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import type { LeakageV2LimitationCode } from "@/services/api/leakage/get-leakage";

export const DIAGNOSTICS_ALL = "all";
export type DiagnosticsFilter = typeof DIAGNOSTICS_ALL | LeakageV2LimitationCode;

/**
 * The diagnostics drawer lives in the URL (`?diagnostics=all` or `?diagnostics=PRICING_INPUT_MISSING`) so it
 * survives a refresh. It shares the sheet with the cell drawer, so opening it closes the cell drawer.
 */
export function useDiagnosticsParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const diagnostics = searchParams.get("diagnostics") as DiagnosticsFilter | null;

  const update = useCallback(
    (value: DiagnosticsFilter | null, replace: boolean) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) {
            next.set("diagnostics", value);
            next.delete("cell");
            next.delete("panel");
            next.delete("issues");
          } else {
            next.delete("diagnostics");
          }
          return next;
        },
        { replace }
      );
    },
    [setSearchParams]
  );

  const openDiagnostics = useCallback((value: DiagnosticsFilter) => update(value, false), [update]);
  const setDiagnosticsFilter = useCallback((value: DiagnosticsFilter) => update(value, true), [update]);
  const closeDiagnostics = useCallback(() => update(null, true), [update]);

  return { diagnostics, openDiagnostics, setDiagnosticsFilter, closeDiagnostics };
}
