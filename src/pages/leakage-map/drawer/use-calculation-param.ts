import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Which calculation is open lives in the URL (`?calc=<reference>`), so a refresh reopens it and Back closes it.
 * The reference is the opaque `calculationReference` of a displayed amount, passed through untouched. When it was
 * opened from a cell's Amounts table, `calcFrom=<cellId>` remembers that cell so the sheet can offer a way back
 * to it. Opening a calculation closes the other sheets (one sheet at a time, never stacked).
 */
export function useCalculationParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const reference = searchParams.get("calc");
  const fromCellId = searchParams.get("calcFrom");

  const update = useCallback(
    (next: { reference: string; fromCellId?: string } | null, replace: boolean) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (next) {
            params.set("calc", next.reference);
            if (next.fromCellId) params.set("calcFrom", next.fromCellId);
            else params.delete("calcFrom");
            params.delete("cell");
            params.delete("panel");
            params.delete("diagnostics");
            params.delete("coverage");
          } else {
            params.delete("calc");
            params.delete("calcFrom");
          }
          return params;
        },
        { replace }
      );
    },
    [setSearchParams]
  );

  const openCalculation = useCallback(
    (referenceToOpen: string, fromCell?: string) => update({ reference: referenceToOpen, fromCellId: fromCell }, false),
    [update]
  );
  const closeCalculation = useCallback(() => update(null, true), [update]);
  return { reference, fromCellId, openCalculation, closeCalculation };
}
