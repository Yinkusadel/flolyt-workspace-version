import { StageRail } from "@/pages/leakage-map/stage-rail";
import { LeakageMatrix } from "@/pages/leakage-map/matrix";
import { MarketBreakdown } from "@/pages/leakage-map/market-breakdown";

/**
 * Rebuilt from flolyt-figma-designs/New-pages-pattern/leakage/leakage/svg/01–04 — see
 * src/pages/leakage-map/data.ts for the source-to-code notes. Every stage card and every matrix
 * cell is its own anchored Popover (see stage-rail.tsx / matrix.tsx) — a click opens a small
 * card right against whatever was clicked, matching the export's own floating-card screens
 * (02/03) instead of a shared, centered dialog.
 */
export default function LeakageMap() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Revenue leakage map</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            4.2M customers · refreshed 6 minutes ago · click any cell to open a room
          </p>
        </div>
        <div className="shrink-0 rounded-control border border-line bg-paper px-3.5 py-2 text-[13px]">
          <span className="text-ink-3">Window </span>
          <span className="font-medium text-ink">Last 90 days</span>
        </div>
      </div>

      <StageRail />

      <LeakageMatrix />

      <MarketBreakdown />
    </div>
  );
}
