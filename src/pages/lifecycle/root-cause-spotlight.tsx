import { Link } from "react-router-dom";

import { DEPARTMENT_COLORS, EYEBROW_CLASS, ROOT_CAUSE_HEADLINE, type RootCauseRow } from "@/pages/lifecycle/data";

export type RootCauseSpotlightProps = {
  rows: RootCauseRow[];
};

export function RootCauseSpotlight({ rows }: RootCauseSpotlightProps) {
  return (
    <section aria-labelledby="root-cause-eyebrow">
      <p id="root-cause-eyebrow" className={EYEBROW_CLASS}>
        Where the same root cause shows up · {ROOT_CAUSE_HEADLINE}
      </p>

      <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-paper">
          {rows.map((row) => (
            <div key={row.stage} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: DEPARTMENT_COLORS[row.department] }}
                aria-hidden
              />
              <span className="w-20 shrink-0 text-[12px] font-semibold text-ink">{row.stage}</span>
              <span
                className="w-36 shrink-0 font-mono text-[10.5px]"
                style={{ color: DEPARTMENT_COLORS[row.department] }}
              >
                {row.department}
              </span>
              <span className="text-[12px] text-ink-2">{row.detail}</span>
            </div>
          ))}
        </div>

        <div className="rounded-card border border-amber-border bg-amber-bg p-5">
          <h3 className="text-[13.5px] font-semibold text-ink">One change. Five teams.</h3>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-2">
            Each team saw its own symptom and none of them owned the cause. Twenty weeks passed
            before anyone connected the fee release to the retention break.
          </p>
          <Link to="/lifecycle/churn/chain" className="mt-3 inline-block text-[11px] font-semibold text-amber hover:underline">
            See the whole chain →
          </Link>
        </div>
      </div>
    </section>
  );
}
