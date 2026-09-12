import * as React from "react";

import { StageRail } from "@/pages/leakage-map/stage-rail";
import { LeakageMatrix } from "@/pages/leakage-map/matrix";
import { MarketBreakdown } from "@/pages/leakage-map/market-breakdown";
import { ShadeByPicker } from "@/pages/leakage-map/shade-by-picker";
import { WindowPicker } from "@/pages/leakage-map/window-picker";
import { ViewModePicker } from "@/pages/leakage-map/view-mode-picker";
import { DEFAULT_SHADE_BY, DEFAULT_VIEW_MODE, SHADE_BY_OPTIONS, type ViewMode } from "@/pages/leakage-map/data";

/**
 * Rebuilt from flolyt-figma-designs/New-pages-pattern/leakage/leakage/svg/01–04, updated per
 * .../leakage/Archive/04,08,09 (adds the "Shade by" picker and reworks Window's own options) — see
 * src/pages/leakage-map/data.ts for the source-to-code notes. Every stage card and every matrix
 * cell opens its own anchored FloatingCard (see stage-rail.tsx / matrix.tsx) — a click opens a
 * small card right against whatever was clicked, matching the export's own floating-card screens
 * (02/03) instead of a shared, centered dialog.
 */
export default function LeakageMap() {
  const [viewMode, setViewMode] = React.useState<ViewMode>(DEFAULT_VIEW_MODE);
  const [shadeBy, setShadeBy] = React.useState<string>(DEFAULT_SHADE_BY);

  const shadeByOption = SHADE_BY_OPTIONS.find((o) => o.value === shadeBy) ?? SHADE_BY_OPTIONS[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Revenue leakage map</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">4.2M customers · refreshed 6 minutes ago · 90-day exposure, annualised in each cell</p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <ViewModePicker value={viewMode} onChange={setViewMode} />
          {viewMode === "historical" ? (
            <WindowPicker />
          ) : (
            <ShadeByPicker value={shadeBy} onChange={setShadeBy} />
          )}
        </div>
      </div>

      <StageRail />

      <LeakageMatrix shadeByCaptionLabel={shadeByOption.captionLabel} />

      <MarketBreakdown />
    </div>
  );
}
