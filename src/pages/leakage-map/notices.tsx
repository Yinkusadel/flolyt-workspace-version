import { useState } from "react";
import { AlertTriangle, ArrowLeftRight, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LeakageV2Controls, LeakageV2Summary } from "@/services/api/leakage/get-leakage";
import type { LeakageCoverageExplanation, LeakageExecutive } from "@/services/api/leakage/leakage-executive-types";
import { Collapse } from "@/pages/leakage-map/collapse";

/** `executive.fxState` value that means "no approved FX rates: nothing may be converted or combined". */
const NO_FX_STATE = "NOT_CONSOLIDATED_NO_APPROVED_FX";

const MEASUREMENT_BANNER_LABEL: Record<string, string> = {
  PARTIALLY_MEASURED: "Partially measured.",
  UNAVAILABLE: "Not measured yet.",
};

/**
 * The page-level caveats about the numbers: how much was measured, and that currencies are never combined.
 * Built once on the page so the filter bar's notes icon (count and tone) and the strip it reveals agree.
 */
export function buildNotices(
  executive: LeakageExecutive,
  summary: LeakageV2Summary,
  coverageExplanation: LeakageCoverageExplanation | undefined,
  controls: LeakageV2Controls
): Notice[] {
  const reportingCurrency = executive.reportingCurrency ?? controls.reportingCurrency;
  const bannerLabel = MEASUREMENT_BANNER_LABEL[summary.measurementState];
  return [
    ...(bannerLabel
      ? [
          {
            key: "measurement",
            tone: "amber" as const,
            icon: AlertTriangle,
            label: bannerLabel.replace(/\.$/, ""),
            summary: coverageExplanation?.headline,
            detail: executive.coverageMessage,
          },
        ]
      : []),
    ...(executive.fxState === NO_FX_STATE
      ? [
          {
            key: "fx",
            tone: "neutral" as const,
            icon: ArrowLeftRight,
            label: "No combined total",
            summary: undefined,
            detail: `There are no approved FX rates, so each currency stands alone.${
              reportingCurrency ? ` ${reportingCurrency} is the reporting currency, used for display only.` : ""
            }`,
          },
        ]
      : []),
  ];
}

export interface Notice {
  key: string;
  tone: "amber" | "neutral";
  icon: typeof AlertTriangle;
  label: string;
  /** Short text beside the label while collapsed. */
  summary: string | undefined;
  /** The full sentence, shown when the notice is opened. */
  detail: string;
}

/**
 * The page-level caveats as one slim row of toggles. Each opens in place to its full sentence and closes
 * again, so the notices stay on the page (they carry real caveats about the numbers below) without taking
 * two full-width banners of space.
 */
export function NoticeStrip({ notices }: { notices: Notice[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  if (notices.length === 0) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {notices.map((notice) => {
          const Icon = notice.icon;
          const isOpen = !!open[notice.key];
          return (
            <button
              key={notice.key}
              type="button"
              aria-expanded={isOpen}
              aria-controls={`notice-${notice.key}`}
              onClick={() => setOpen((prev) => ({ ...prev, [notice.key]: !prev[notice.key] }))}
              className={cn(
                "flex max-w-full items-center gap-1.5 rounded-panel border px-2.5 py-1.5 text-left text-[11.5px] text-ink-2 transition-colors",
                notice.tone === "amber"
                  ? "border-amber-border bg-amber-bg hover:border-amber"
                  : "border-line bg-paper hover:border-ink-4"
              )}
            >
              <Icon className={cn("size-3.5 shrink-0", notice.tone === "amber" ? "text-amber" : "text-ink-3")} />
              <span className="font-semibold text-ink">{notice.label}</span>
              {notice.summary && <span className="hidden truncate sm:inline">· {notice.summary}</span>}
              <ChevronDown className={cn("size-3.5 shrink-0 text-ink-3 transition-transform", isOpen && "rotate-180")} />
            </button>
          );
        })}
      </div>
      {notices.map((notice) => (
        <Collapse key={notice.key} id={`notice-${notice.key}`} open={!!open[notice.key]}>
          {/* Padding, not margin: a margin would collapse out of the measured box and get clipped. */}
          <div className="pt-2">
            <p
              className={cn(
                "rounded-panel border px-3 py-2.5 text-[11.5px] text-ink-2",
                notice.tone === "amber" ? "border-amber-border bg-amber-bg" : "border-line bg-paper"
              )}
            >
              {notice.detail}
            </p>
          </div>
        </Collapse>
      ))}
    </div>
  );
}
