import { RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The "recomputing exposure" indicator for a filter-driven refetch — a fixed-position floating
 * card (toast-shaped, but not routed through the app's global `sonner` Toaster: it's tied to this
 * page's own query state, not a one-off notification) rather than an in-flow banner. An in-flow
 * banner pushed the whole page down/up every time it mounted or unmounted, which read as janky on
 * every filter change — this stays permanently mounted and only animates its own opacity/position,
 * so it never shifts anything else on the page. Positioned bottom-left, opposite the app's
 * top-right toast stack (`main.tsx`'s `<Toaster position="top-right">`), so the two never overlap.
 */
export function RecomputingToast({ visible, horizonLabel }: { visible: boolean; horizonLabel: string }) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed bottom-5 left-5 z-40 transition-all duration-300 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      )}
    >
      <div className="pointer-events-auto flex max-w-xs items-center gap-3 rounded-card border border-line bg-paper px-4 py-3 shadow-lg">
        <RefreshCw className="size-4 shrink-0 animate-spin text-ink-3" aria-hidden />
        <div>
          <p className="text-[12px] font-medium text-ink">Recomputing exposure for {horizonLabel.toLowerCase()}…</p>
          <p className="mt-0.5 text-[10.5px] text-ink-3">Cells refresh in about two seconds.</p>
        </div>
      </div>
    </div>
  );
}
