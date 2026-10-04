import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Whether the "What's holding coverage back" sheet is open lives in the URL (`?issues=1`), like the other
 * sheets, so a refresh keeps it and Back closes it. Opening it closes the cell and diagnostics sheets.
 */
export function useCoverageIssuesParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isOpen = searchParams.get("issues") === "1";

  const update = useCallback(
    (open: boolean, replace: boolean) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (open) {
            next.set("issues", "1");
            next.delete("cell");
            next.delete("panel");
            next.delete("diagnostics");
          } else {
            next.delete("issues");
          }
          return next;
        },
        { replace }
      );
    },
    [setSearchParams]
  );

  const openIssues = useCallback(() => update(true, false), [update]);
  const closeIssues = useCallback(() => update(false, true), [update]);
  return { isOpen, openIssues, closeIssues };
}
