import { Fragment } from "react";

import { cn } from "@/lib/utils";
import { StageDetailLayout } from "@/pages/lifecycle/stage/layout";
import { BarTrack } from "@/pages/lifecycle/stage/bar";
import { Rail } from "@/pages/lifecycle/stage/rail";

type CellData = { pct: number; color: string; textColor?: string; broken?: boolean };
type Cell = CellData | null;

type CohortRow = { cohort: string; size: string; cells: Cell[] };

const cell = (pct: number, color: string, broken = false): CellData => ({ pct, color, broken });
const M0 = cell(100, "#1B8A83");
M0.textColor = "#FFFFFF";

const COHORTS: CohortRow[] = [
  { cohort: "Sep 2025", size: "218k", cells: [M0, cell(41, "#7BC4BE"), cell(34, "#B4DED9"), cell(30, "#B4DED9"), cell(28, "#F5C3C9"), cell(27, "#F5C3C9"), cell(26, "#F5C3C9"), cell(25, "#E9959F"), cell(25, "#E9959F")] },
  { cohort: "Oct 2025", size: "241k", cells: [M0, cell(43, "#7BC4BE"), cell(36, "#7BC4BE"), cell(32, "#B4DED9"), cell(30, "#B4DED9"), cell(29, "#F5C3C9"), cell(28, "#F5C3C9"), cell(27, "#F5C3C9"), null] },
  { cohort: "Nov 2025", size: "312k", cells: [M0, cell(44, "#7BC4BE"), cell(37, "#7BC4BE"), cell(33, "#B4DED9"), cell(31, "#B4DED9"), cell(30, "#B4DED9"), cell(29, "#F5C3C9"), null, null] },
  { cohort: "Dec 2025", size: "486k", cells: [M0, cell(39, "#7BC4BE"), cell(31, "#B4DED9"), cell(27, "#F5C3C9"), cell(25, "#E9959F"), cell(24, "#E9959F"), null, null, null] },
  { cohort: "Jan 2026", size: "274k", cells: [M0, cell(40, "#7BC4BE"), cell(33, "#B4DED9"), cell(29, "#F5C3C9"), cell(27, "#F5C3C9"), null, null, null, null] },
  { cohort: "Feb 2026", size: "252k", cells: [M0, cell(38, "#7BC4BE"), cell(31, "#B4DED9"), cell(28, "#F5C3C9"), null, null, null, null, null] },
  { cohort: "Mar 2026", size: "266k", cells: [M0, cell(27, "#F5C3C9", true), cell(19, "#E9959F"), null, null, null, null, null, null] },
  { cohort: "Apr 2026", size: "281k", cells: [M0, cell(26, "#F5C3C9", true), null, null, null, null, null, null, null] },
  { cohort: "May 2026", size: "294k", cells: [M0, cell(27, "#F5C3C9", true), null, null, null, null, null, null, null] },
];

const LTV_CHANNELS = [
  { name: "Organic search", ltv: "₦18,400", cac: "₦2,100", percent: 92, tone: "teal" as const },
  { name: "Referral", ltv: "₦16,900", cac: "₦1,400", percent: 84, tone: "teal" as const },
  { name: "Paid social", ltv: "₦7,200", cac: "₦5,800", percent: 36, tone: "amber" as const },
  { name: "Influencer", ltv: "₦6,100", cac: "₦4,900", percent: 30, tone: "amber" as const },
  { name: "Discount aggregator", ltv: "₦2,800", cac: "₦3,600", percent: 14, tone: "rose" as const },
];

const MONTHS = ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8"];

/** Screen 20 (stage retain / cohort retention) — see flolyt-kit-122/20-stage-retain-cohorts.svg. */
const StageRetain = () => {
  return (
    <StageDetailLayout
      title="Cohort retention"
      subtitle="Share of each acquisition cohort still ordering, by month since first order"
      rail={
        <Rail heading="LTV BY ACQUISITION CHANNEL">
          <div className="space-y-4">
            {LTV_CHANNELS.map((c) => (
              <div key={c.name} className="space-y-1.5 border-t border-line pt-4 first:border-0 first:pt-0">
                <div className="flex items-baseline justify-between">
                  <span className="text-[12px] font-semibold text-ink">{c.name}</span>
                </div>
                <div className="flex items-baseline justify-between font-mono text-[10.5px]">
                  <span className="text-ink-2">LTV {c.ltv}</span>
                  <span className="text-ink-4">CAC {c.cac}</span>
                </div>
                <BarTrack percent={c.percent} tone={c.tone} />
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-card border border-dashed border-line bg-paper p-4">
            <h3 className="text-[12px] font-semibold text-ink">One channel loses money</h3>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-3">
              Aggregator customers cost ₦3,600 and return ₦2,800. They are also 61% of the
              discount-dependent segment. Cutting the channel would remove ₦74M of leakage and
              ₦52M of revenue.
            </p>
          </div>
        </Rail>
      }
    >
      <section>
        <div className="overflow-x-auto rounded-card border border-line bg-paper p-4">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[110px_50px_repeat(9,1fr)] gap-1.5">
              <div />
              <div />
              {MONTHS.map((m) => (
                <div key={m} className="text-center font-mono text-[9.5px] text-ink-4">
                  {m}
                </div>
              ))}

              {COHORTS.map((row) => (
                <Fragment key={row.cohort}>
                  <div className="flex items-center text-[11.5px] font-semibold text-ink">
                    {row.cohort}
                  </div>
                  <div key={`${row.cohort}-size`} className="flex items-center font-mono text-[10px] text-ink-4">
                    {row.size}
                  </div>
                  {row.cells.map((c, i) => (
                    <div
                      key={`${row.cohort}-${MONTHS[i]}`}
                      className={cn(
                        "flex h-8 items-center justify-center rounded-control text-[10.5px] font-semibold",
                        !c && "bg-paper-2"
                      )}
                      style={c ? { backgroundColor: c.color, color: c.textColor ?? "#161920" } : undefined}
                    >
                      {c && (
                        <span
                          className={cn(
                            "flex h-full w-full items-center justify-center rounded-control",
                            c.broken && "border-[1.5px] border-dashed border-rose"
                          )}
                        >
                          {c.pct}%
                        </span>
                      )}
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-card border border-rose-border bg-rose-bg p-5">
          <h3 className="text-[13px] font-semibold text-ink">
            Every cohort acquired after 4 March breaks the same way
          </h3>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-2">
            M1 retention drops from about 40% to about 27% and stays there. The break is by
            acquisition date, not by market, channel or campaign — which is what makes it a
            change we made, not a change in demand.
          </p>
        </div>
      </section>
    </StageDetailLayout>
  );
};

export default StageRetain;
