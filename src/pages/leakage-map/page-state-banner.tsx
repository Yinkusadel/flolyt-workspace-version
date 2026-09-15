import { AlertTriangle, PlugZap, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PAGE_STATES } from "@/pages/leakage-map/data";

/**
 * Loading/empty/error (12-states.svg) — none of them blank the figures. This page has no live
 * source yet, so these are reachable only via LEAKAGE_MAP_STATE in index.tsx, not by any real
 * fetch lifecycle; "partial" (the default) needs no banner of its own — the status line and the
 * coverage panel already carry that job every time the page loads.
 */
export function PageStateBanner({ state }: { state: "loading" | "empty" | "error" }) {
  if (state === "loading") {
    const copy = PAGE_STATES.loading;
    return (
      <div className="flex items-center gap-3 rounded-card border border-line bg-paper-2 px-4 py-3">
        <RefreshCw className="size-4 shrink-0 animate-spin text-ink-3" aria-hidden />
        <div>
          <p className="text-[12.5px] font-medium text-ink">{copy.title}</p>
          <p className="mt-0.5 text-[11px] text-ink-3">
            {copy.body} {copy.footnote}
          </p>
        </div>
      </div>
    );
  }

  if (state === "error") {
    const copy = PAGE_STATES.error;
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-card border border-amber-border bg-amber-bg px-4 py-3">
        <AlertTriangle className="size-4 shrink-0 text-amber" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-medium text-ink">{copy.title}</p>
          <p className="mt-0.5 text-[11px] text-ink-2">{copy.body}</p>
          <p className="mt-0.5 text-[10.5px] text-ink-3">{copy.footnote}</p>
        </div>
        <Button type="button" variant="outline" size="sm">
          {copy.cta}
        </Button>
      </div>
    );
  }

  const copy = PAGE_STATES.empty;
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-line bg-paper px-6 py-12 text-center">
      <PlugZap className="size-6 text-ink-4" aria-hidden />
      <div>
        <p className="text-[14px] font-semibold text-ink">{copy.title}</p>
        <p className="mt-1 text-[12px] text-ink-3">{copy.body}</p>
        <p className="mt-1 text-[11px] text-ink-4">{copy.footnote}</p>
      </div>
      <Button type="button" size="sm">
        {copy.cta}
      </Button>
    </div>
  );
}
