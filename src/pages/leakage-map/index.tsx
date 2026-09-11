import * as React from "react";

import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StageRail } from "@/pages/leakage-map/stage-rail";
import { LeakageMatrix } from "@/pages/leakage-map/matrix";
import { MarketBreakdown } from "@/pages/leakage-map/market-breakdown";
import {
  DEFAULT_SHADE_BY,
  DEFAULT_WINDOW,
  SHADE_BY_FOOTNOTE,
  SHADE_BY_OPTIONS,
  WINDOW_FOOTNOTE,
  WINDOW_OPTIONS,
} from "@/pages/leakage-map/data";

/**
 * Rebuilt from flolyt-figma-designs/New-pages-pattern/leakage/leakage/svg/01–04, updated per
 * .../leakage/Archive/04,08,09 (adds the "Shade by" picker and reworks Window's own options) — see
 * src/pages/leakage-map/data.ts for the source-to-code notes. Every stage card and every matrix
 * cell opens its own anchored FloatingCard (see stage-rail.tsx / matrix.tsx) — a click opens a
 * small card right against whatever was clicked, matching the export's own floating-card screens
 * (02/03) instead of a shared, centered dialog.
 */
export default function LeakageMap() {
  const [windowValue, setWindowValue] = React.useState<string>(DEFAULT_WINDOW);
  const [shadeBy, setShadeBy] = React.useState<string>(DEFAULT_SHADE_BY);

  const shadeByOption = SHADE_BY_OPTIONS.find((o) => o.value === shadeBy) ?? SHADE_BY_OPTIONS[0];
  const windowOption = WINDOW_OPTIONS.find((o) => o.value === windowValue) ?? WINDOW_OPTIONS[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Revenue leakage map</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">4.2M customers · refreshed 6 minutes ago · 90-day exposure, annualised in each cell</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Select value={shadeBy} onValueChange={setShadeBy}>
            <SelectTrigger className="w-auto py-2 text-[13px] whitespace-nowrap">
              <span>
                <span className="text-ink-3">Shade by </span>
                <SelectValue>{shadeByOption.shortLabel}</SelectValue>
              </span>
            </SelectTrigger>
            <SelectContent align="end" className="w-72">
              {SHADE_BY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="py-2">
                  <span className="block">
                    <span className="block text-[12px] font-medium text-ink">{option.label}</span>
                    <span className="block text-[10.5px] text-ink-3">{option.note}</span>
                  </span>
                </SelectItem>
              ))}
              <div className="mt-1 border-t border-line px-2.5 pt-2 text-[10.5px] leading-relaxed text-ink-4">
                {SHADE_BY_FOOTNOTE}
              </div>
            </SelectContent>
          </Select>

          <Select value={windowValue} onValueChange={setWindowValue}>
            <SelectTrigger className="w-auto py-2 text-[13px] whitespace-nowrap">
              <span>
                <span className="text-ink-3">Window </span>
                <SelectValue>{windowOption.label}</SelectValue>
              </span>
            </SelectTrigger>
            <SelectContent align="end" className="w-72">
              {WINDOW_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="py-2">
                  <span className="block">
                    <span className="block text-[12px] font-medium text-ink">{option.label}</span>
                    <span className={cn("block text-[10.5px]", option.caveat ? "text-amber" : "text-ink-3")}>
                      {option.note}
                    </span>
                  </span>
                </SelectItem>
              ))}
              <div className="mt-1 border-t border-line px-2.5 pt-2 text-[10.5px] leading-relaxed text-ink-4">
                {WINDOW_FOOTNOTE}
              </div>
            </SelectContent>
          </Select>
        </div>
      </div>

      <StageRail />

      <LeakageMatrix shadeByCaptionLabel={shadeByOption.captionLabel} />

      <MarketBreakdown />
    </div>
  );
}
