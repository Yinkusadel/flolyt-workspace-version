import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Eyebrow, StageDetailLayout } from "@/pages/lifecycle/stage/layout";
import { Rail, RailInsight } from "@/pages/lifecycle/stage/rail";
import { DEPARTMENT_COLORS, type Department } from "@/pages/lifecycle/data";

const ATTRIBUTION = [
  { stage: "Activate", department: "Product" as Department, count: "184,000", percent: 100, amount: "₦188M", note: "never reached first value" },
  { stage: "Retain", department: "Marketing" as Department, count: "148,000", percent: 81, amount: "₦412M", note: "second order never happened" },
  { stage: "Renew", department: "Finance" as Department, count: "38,900", percent: 19, amount: "₦88M", note: "card failed, nobody chose to leave" },
  { stage: "Support", department: "Engineering" as Department, count: "94,000", percent: 52, amount: "₦96M", note: "unresolved delivery problem" },
  { stage: "Price", department: "Finance" as Department, count: "62,000", percent: 32, amount: "₦46M", note: "discount ended, value never landed" },
];

const GENUINELY_DONE = { count: "75,100", percent: 39, amount: "₦72M", note: "moved, changed needs, no longer buying" };

const CHANGES = [
  { fix: "Delivery fee shown at basket", department: "Product" as Department, status: "shipped 7 Aug", amount: "₦188M / yr" },
  { fix: "Retry cards on payday", department: "Finance" as Department, status: "approved 3 Aug", amount: "₦88M / yr" },
  { fix: "Delivery tracking on failure", department: "Engineering" as Department, status: "in progress", amount: "₦96M / yr" },
  { fix: "Every release held against revenue for 14 days", department: "Engineering" as Department, status: "in effect", amount: "unquantified" },
];

/** Screen 25 (stage churn / post-mortem) — see flolyt-kit-122/25-stage-churn.svg. */
const StageChurn = () => {
  return (
    <StageDetailLayout
      title="Churn"
      subtitle="602,000 customers lost in twelve months · where each of them actually left"
      rail={
        <Rail heading="HOW THIS IS ATTRIBUTED">
          <RailInsight title="The cause, not the exit">
            A customer who cancels at renewal because they never activated is activation churn.
            Filing it under renewal is how the same mistake survives a year.
          </RailInsight>
          <RailInsight title="Teams are named, not blamed">
            Attribution exists so the fix lands with whoever can make it. A post-mortem that
            produces a culprit and no ticket has failed.
          </RailInsight>
          <RailInsight title="“Genuinely done” is a real category">
            Some customers should leave. Pretending otherwise turns retention into a war against
            your own users.
          </RailInsight>
          <RailInsight title="It writes to memory">
            Every attributed cause becomes a learning the agents carry into the next room.
          </RailInsight>
        </Rail>
      }
    >
      <section>
        <Eyebrow>
          Attributed to the stage where the cause happened — not where the loss appeared
        </Eyebrow>
        <div className="mt-4 space-y-4">
          {ATTRIBUTION.map((row) => (
            <div key={row.stage}>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-[12.5px] font-semibold text-ink">{row.stage}</span>
                <span
                  className="font-mono text-[10.5px]"
                  style={{ color: DEPARTMENT_COLORS[row.department] }}
                >
                  {row.department}
                </span>
                <span className="font-mono text-[10.5px] text-ink-4">{row.count}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-3">
                <div className="h-5 min-w-0 flex-1 rounded-control bg-paper-2">
                  <div
                    className="h-5 rounded-control bg-rose"
                    style={{ width: `${row.percent}%` }}
                  />
                </div>
                <div className="w-32 shrink-0 text-right sm:w-40">
                  <span className="font-semibold text-rose">{row.amount}</span>
                  <p className="text-[10.5px] text-ink-4">{row.note}</p>
                </div>
              </div>
            </div>
          ))}

          <div>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-[12.5px] font-semibold text-ink">Genuinely done</span>
              <span className="font-mono text-[10.5px] text-ink-4">{GENUINELY_DONE.count}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-3">
              <div className="h-5 min-w-0 flex-1 rounded-control bg-paper-2">
                <div
                  className="h-5 rounded-control bg-ink-4"
                  style={{ width: `${GENUINELY_DONE.percent}%` }}
                />
              </div>
              <div className="w-32 shrink-0 text-right sm:w-40">
                <span className="font-semibold text-ink-3">{GENUINELY_DONE.amount}</span>
                <p className="text-[10.5px] text-ink-4">{GENUINELY_DONE.note}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-card border border-rose-border bg-rose-bg p-5">
          <h3 className="text-[13.5px] font-semibold text-ink">
            87% of last year&rsquo;s churn was preventable by someone
          </h3>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-2">
            Only 75,100 of 602,000 customers left because their needs changed. The rest left
            because of something a team could have done differently, and in every case another
            team saw the symptom first.
          </p>
        </div>
      </section>

      <section>
        <Eyebrow>What has changed since · each one traceable to a room</Eyebrow>
        <div className="mt-3 divide-y divide-line rounded-card border border-line bg-paper">
          {CHANGES.map((c) => (
            <div key={c.fix} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: DEPARTMENT_COLORS[c.department] }}
                aria-hidden
              />
              <span className="text-[12px] text-ink-2">{c.fix}</span>
              <span
                className="font-mono text-[10.5px]"
                style={{ color: DEPARTMENT_COLORS[c.department] }}
              >
                {c.department}
              </span>
              <span className="font-mono text-[11px] text-ink-4">{c.status}</span>
              <span
                className={cn(
                  "ml-auto text-[11.5px] font-semibold",
                  c.amount === "unquantified" ? "text-ink-4" : "text-teal"
                )}
              >
                {c.amount}
              </span>
            </div>
          ))}
        </div>
        <Link
          to="/lifecycle/release-impact"
          className="mt-3 inline-block text-[11.5px] font-medium text-ultra hover:underline"
        >
          View release history →
        </Link>
      </section>
    </StageDetailLayout>
  );
};

export default StageChurn;
