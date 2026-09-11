import * as React from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StageRail } from "@/pages/leakage-map/stage-rail";
import { LeakageMatrix } from "@/pages/leakage-map/matrix";
import { MarketBreakdown } from "@/pages/leakage-map/market-breakdown";
import { DEFAULT_WINDOW, WINDOW_OPTIONS } from "@/pages/leakage-map/data";

/**
 * Rebuilt from flolyt-figma-designs/New-pages-pattern/leakage/leakage/svg/01–04 — see
 * src/pages/leakage-map/data.ts for the source-to-code notes. Every stage card and every matrix
 * cell opens its own anchored FloatingCard (see stage-rail.tsx / matrix.tsx) — a click opens a
 * small card right against whatever was clicked, matching the export's own floating-card screens
 * (02/03) instead of a shared, centered dialog.
 */
export default function LeakageMap() {
  const [windowValue, setWindowValue] = React.useState<string>(DEFAULT_WINDOW);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Revenue leakage map</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            4.2M customers · refreshed 6 minutes ago · click any cell to open a room
          </p>
        </div>
        <Select value={windowValue} onValueChange={setWindowValue}>
          <SelectTrigger className="w-auto shrink-0 py-2 text-[13px] whitespace-nowrap">
            <span>
              <span className="text-ink-3">Window </span>
              <SelectValue />
            </span>
          </SelectTrigger>
          <SelectContent>
            {WINDOW_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <StageRail />

      <LeakageMatrix />

      <MarketBreakdown />
    </div>
  );
}
