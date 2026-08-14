import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Eyebrow, StageDetailLayout } from "@/pages/lifecycle/stage/layout";
import { Rail, RailDecisionCard, RailInsight } from "@/pages/lifecycle/stage/rail";

type Readiness = "high" | "medium" | "low";

const READINESS_CLASSES: Record<Readiness, string> = {
  high: "border-teal-border bg-teal-bg text-teal",
  medium: "border-amber-border bg-amber-bg text-amber",
  low: "border-line bg-paper-2 text-ink-3",
};

const SIGNALS = [
  { signal: "Ordering above their delivery allowance", customers: "18,400", value: "₦41M", readiness: "high" as Readiness, move: "offer the plan that fits" },
  { signal: "Buying the same item monthly, manually", customers: "31,200", value: "₦28M", readiness: "high" as Readiness, move: "offer a subscription" },
  { signal: "Three household members, one account", customers: "8,900", value: "₦14M", readiness: "medium" as Readiness, move: "offer a family plan" },
  { signal: "Standard plan, using premium depth", customers: "6,100", value: "₦9M", readiness: "medium" as Readiness, move: "earn the upgrade first" },
  { signal: "High LTV, no subscription", customers: "22,800", value: "₦4M", readiness: "low" as Readiness, move: "leave alone for now" },
];

const BLOCKS = [
  { reason: "Open support ticket", count: "4,100", note: "Support holds the block" },
  { reason: "Failed payment in the last 30 days", count: "6,900", note: "Finance holds the block" },
  { reason: "In an active reactivation wave", count: "31,900", note: "frequency cap" },
  { reason: "Refund pending", count: "1,200", note: "Support holds the block" },
];

const HEAD_CLASS = "px-3 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase";

/** Screen 21 (stage expand) — see flolyt-kit-122/21-stage-expand.svg. */
const StageExpand = () => {
  return (
    <StageDetailLayout
      title="Expand"
      subtitle="₦96M of customers already using more than they pay for"
      rail={
        <Rail heading="WHAT SALES SEES HERE">
          <RailDecisionCard
            badge="NEEDS YOUR APPROVAL"
            title="Offer the delivery plan to 18,400 customers"
            rows={[
              { label: "They pay now", value: "₦2,400 + fees" },
              { label: "They would pay", value: "₦3,100 flat" },
              { label: "Average saving", value: "₦1,900 / mo" },
              { label: "Net to us", value: "+₦41M / yr" },
            ]}
            footnote="They save money. So do we."
            footnoteTone="teal"
          />
          <RailInsight title="Readiness beats size">
            The largest accounts are not the readiest. Ordering behaviour is.
          </RailInsight>
          <RailInsight title="Blocks are other teams' calls">
            Sales cannot clear a support block. It is shown, with the team holding it named.
          </RailInsight>
          <RailInsight title="Every offer is reversible">
            An expansion that has to be defended is an expansion that should not have been sent.
          </RailInsight>
        </Rail>
      }
    >
      <section>
        <Eyebrow>Expansion signals · ranked by readiness, not by account size</Eyebrow>
        <div className="mt-3 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[640px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line">
                <th className={HEAD_CLASS}>Signal</th>
                <th className={HEAD_CLASS}>Customers</th>
                <th className={HEAD_CLASS}>Value</th>
                <th className={HEAD_CLASS}>Readiness</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Right move</th>
              </tr>
            </thead>
            <tbody>
              {SIGNALS.map((s) => (
                <tr key={s.signal} className="border-b border-line last:border-0">
                  <td className="px-3 py-3 text-ink">{s.signal}</td>
                  <td className="px-3 py-3 font-mono whitespace-nowrap text-ink-2">{s.customers}</td>
                  <td className="px-3 py-3 font-mono font-semibold whitespace-nowrap text-teal">{s.value}</td>
                  <td className="px-3 py-3">
                    <Badge variant="outline" className={cn("border", READINESS_CLASSES[s.readiness])}>
                      {s.readiness}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap text-ink-2">{s.move}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-card border border-dashed border-line bg-paper-2 p-5">
          <h3 className="text-[12.5px] font-semibold text-ink">
            Expansion is not upsell with better data
          </h3>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-2">
            Every signal above is a customer already getting less than they are paying for, or
            paying more than they need to. Selling them more before that is fixed is how a
            renewal becomes a complaint.
          </p>
        </div>
      </section>

      <section>
        <Eyebrow>Blocked from expansion right now, and why</Eyebrow>
        <div className="mt-3 divide-y divide-line rounded-card border border-line bg-paper">
          {BLOCKS.map((b) => (
            <div key={b.reason} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
              <span className="size-2 shrink-0 rounded-full bg-rose" aria-hidden />
              <span className="text-[11.5px] text-ink-2">{b.reason}</span>
              <span className="font-mono text-[11.5px] font-semibold text-ink">{b.count}</span>
              <span className="ml-auto text-[11px] text-ink-4">{b.note}</span>
            </div>
          ))}
        </div>
      </section>
    </StageDetailLayout>
  );
};

export default StageExpand;
