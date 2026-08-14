import { cn } from "@/lib/utils";
import { Eyebrow, StageDetailLayout } from "@/pages/lifecycle/stage/layout";
import { Rail, RailInsight } from "@/pages/lifecycle/stage/rail";

const PLANS = [
  { name: "Premium annual", customers: "84,000", price: "₦48,000", margin: "71%", discounted: "12%", discountedTone: "teal" as const, m6: "58%", net: "₦2.86B" },
  { name: "Premium monthly", customers: "142,000", price: "₦4,800", margin: "68%", discounted: "34%", discountedTone: "amber" as const, m6: "31%", net: "₦5.56B" },
  { name: "Standard", customers: "612,000", price: "₦2,400", margin: "62%", discounted: "41%", discountedTone: "amber" as const, m6: "27%", net: "₦10.9B" },
  { name: "Standard + delivery", customers: "188,000", price: "₦3,100", margin: "64%", discounted: "8%", discountedTone: "teal" as const, m6: "39%", net: "₦4.4B" },
  { name: "Free", customers: "2.1M", price: "₦0", margin: "—", discounted: "—", discountedTone: null, m6: "14%", net: "—" },
  { name: "Legacy grandfathered", customers: "31,000", price: "₦1,900", margin: "44%", discounted: "0%", discountedTone: null, m6: "72%", net: "₦0.7B" },
];

const ELASTICITY = [
  { label: "Full price", convert: "3.1% convert", m6: "39% still here at M6", note: "the healthiest cohort we have", tone: "teal" as const, current: true },
  { label: "10% off", convert: "3.9% convert", m6: "34% at M6", note: "pays for itself", tone: "teal" as const, current: false },
  { label: "20% off", convert: "5.4% convert", m6: "22% at M6", note: "buys volume, loses the customer", tone: "amber" as const, current: false },
  { label: "30%+ off", convert: "8.8% convert", m6: "11% at M6", note: "buys a discount-only buyer", tone: "rose" as const, current: false },
];

const FLOORS = [
  { who: "Any agent, any plan", limit: "10%", note: "no approval — reversible", tone: "amber" as const },
  { who: "Any agent", limit: "20%", note: "Finance approval", tone: "amber" as const },
  { who: "Any agent", limit: "over 20%", note: "blocked — a person must originate it", tone: "rose" as const },
  { who: "Aggregator-acquired customer", limit: "any discount", note: "blocked — already unprofitable", tone: "rose" as const },
];

const TONE_TEXT = { teal: "text-teal", amber: "text-amber", rose: "text-rose" } as const;
const TONE_ACCENT_BG = { teal: "bg-teal", amber: "bg-amber", rose: "bg-rose" } as const;

const HEAD_CLASS = "px-3 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase";

/** Screen 18 (stage price) — see flolyt-kit-122/18-stage-price.svg. */
const StagePrice = () => {
  return (
    <StageDetailLayout
      title="Price"
      subtitle="Six plans, four markets · what the price is doing to behaviour, not just to margin"
      rail={
        <Rail heading="PRICE IS A LIFECYCLE DECISION">
          <RailInsight title="Margin is the easy half">
            A 30% discount converts nearly three times as well and produces a customer worth a
            quarter as much. Only one of those shows up this quarter.
          </RailInsight>
          <RailInsight title="Discounting is an acquisition channel">
            It behaves like one, decays like one, and should be judged at month six like one.
          </RailInsight>
          <RailInsight title="Grandfathered plans are evidence">
            31,000 people on an old price retain at 72%. Something about that plan works, and it
            is not the price.
          </RailInsight>
          <RailInsight title="Floors are enforced, not advised">
            An agent cannot propose past the floor. Finance sets it; the mesh refuses the rest.
          </RailInsight>
        </Rail>
      }
    >
      <section>
        <Eyebrow>Plan mix and margin</Eyebrow>
        <div className="mt-3 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line">
                <th className={HEAD_CLASS}>Plan</th>
                <th className={HEAD_CLASS}>Customers</th>
                <th className={HEAD_CLASS}>Price</th>
                <th className={HEAD_CLASS}>Gross margin</th>
                <th className={HEAD_CLASS}>Discounted</th>
                <th className={HEAD_CLASS}>M6 retention</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Net</th>
              </tr>
            </thead>
            <tbody>
              {PLANS.map((plan) => (
                <tr key={plan.name} className="border-b border-line last:border-0">
                  <td className="px-3 py-3 font-semibold whitespace-nowrap text-ink">{plan.name}</td>
                  <td className="px-3 py-3 font-mono whitespace-nowrap text-ink-2">{plan.customers}</td>
                  <td className="px-3 py-3 font-mono whitespace-nowrap text-ink-2">{plan.price}</td>
                  <td className="px-3 py-3 font-mono whitespace-nowrap text-ink-2">{plan.margin}</td>
                  <td
                    className={cn(
                      "px-3 py-3 font-mono whitespace-nowrap",
                      plan.discountedTone ? TONE_TEXT[plan.discountedTone] : "text-ink-2",
                      plan.discountedTone && "font-semibold"
                    )}
                  >
                    {plan.discounted}
                  </td>
                  <td className="px-3 py-3 font-mono whitespace-nowrap text-ink-2">{plan.m6}</td>
                  <td className="px-3 py-3 text-right font-mono font-semibold whitespace-nowrap text-ink">
                    {plan.net}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <Eyebrow>What a discount actually buys · standard plan, last four quarters</Eyebrow>
        <div className="mt-3 space-y-2">
          {ELASTICITY.map((row) => (
            <div
              key={row.label}
              className={cn(
                "relative flex flex-wrap items-center gap-x-6 gap-y-1 overflow-hidden rounded-panel border border-line py-3 pr-4 pl-4",
                row.current ? "bg-paper-2" : "bg-paper"
              )}
            >
              <span className={cn("absolute inset-y-0 left-0 w-[3px]", TONE_ACCENT_BG[row.tone])} aria-hidden />
              <span className="w-28 text-[12px] font-semibold text-ink">{row.label}</span>
              <span className="font-mono text-[11.5px] text-ink-2">{row.convert}</span>
              <span className="font-mono text-[11.5px] text-ink-2">{row.m6}</span>
              <span className={cn("ml-auto text-[11px]", TONE_TEXT[row.tone])}>{row.note}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Eyebrow>Discount floors · what agents may propose without a person</Eyebrow>
        <div className="mt-3 divide-y divide-line rounded-card border border-line bg-paper">
          {FLOORS.map((floor) => (
            <div key={`${floor.who}-${floor.limit}`} className="flex flex-wrap items-center gap-x-6 gap-y-1 px-4 py-3">
              <span className="min-w-[220px] text-[11.5px] text-ink-2">{floor.who}</span>
              <span className="font-mono text-[11.5px] font-semibold text-ink">{floor.limit}</span>
              <span className={cn("ml-auto text-[11.5px]", TONE_TEXT[floor.tone])}>{floor.note}</span>
            </div>
          ))}
        </div>
      </section>
    </StageDetailLayout>
  );
};

export default StagePrice;
