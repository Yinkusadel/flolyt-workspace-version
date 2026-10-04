import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export type DrawerPanel = "cell" | "case";

/**
 * Which cell's drawer is open, and whether it shows the cell or its case, live in the URL
 * (`?cell=<id>&panel=case`) so a refresh or a shared link lands on the same drawer and the browser's
 * back button closes it.
 */
export function useCellDrawerParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const cellId = searchParams.get("cell");
  const panel: DrawerPanel = searchParams.get("panel") === "case" ? "case" : "cell";

  const update = useCallback(
    (cell: string | null, nextPanel: DrawerPanel, replace: boolean) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (cell) next.set("cell", cell);
          else next.delete("cell");
          if (cell && nextPanel === "case") next.set("panel", "case");
          else next.delete("panel");
          return next;
        },
        { replace }
      );
    },
    [setSearchParams]
  );

  // Opening adds a history entry (so Back closes the drawer); switching panels and closing replace the current one.
  const openCell = useCallback((id: string) => update(id, "cell", false), [update]);
  const showCase = useCallback((id: string) => update(id, "case", true), [update]);
  const showCell = useCallback((id: string) => update(id, "cell", true), [update]);
  const close = useCallback(() => update(null, "cell", true), [update]);

  return { cellId, panel, openCell, showCase, showCell, close };
}
