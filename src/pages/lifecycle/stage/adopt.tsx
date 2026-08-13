import { cn } from "@/lib/utils";
import { Eyebrow, StageDetailLayout } from "@/pages/lifecycle/stage/layout";
import { Rail, RailCallout, RailInsight } from "@/pages/lifecycle/stage/rail";

const TONE_DOT_CLASSES = {
  teal: "bg-teal",
  ink: "bg-ink-4",
  amber: "bg-amber",
  ultra: "bg-ultra",
} as const;

const FEATURES = [
  { name: "Saved baskets", left: 70.2, top: 20.3, tone: "teal" as const },
  { name: "Reorder in one tap", left: 60.9, top: 16.2, tone: "teal" as const },
  { name: "Delivery tracking", left: 83.8, top: 27, tone: "teal" as const },
  { name: "Wishlists", left: 46.4, top: 57.8, tone: "ink" as const },
  { name: "Subscriptions", left: 33.6, top: 13.7, tone: "teal" as const },
  { name: "Reviews", left: 52.4, top: 63.7, tone: "ink" as const },
  { name: "Loyalty points", left: 65.1, top: 73.7, tone: "amber" as const },
  { name: "Gift cards", left: 19.1, top: 66.2, tone: "ink" as const },
  { name: "In-app chat", left: 41.3, top: 40.3, tone: "ultra" as const },
  { name: "Price alerts", left: 25.1, top: 32.8, tone: "ultra" as const },
];

const PLANS = [
  { name: "Premium annual", customers: "84,000", used: "2.1 of 9", paidFor: "9", overpaying: "₦68M" },
  { name: "Premium monthly", customers: "142,000", used: "2.8 of 9", paidFor: "9", overpaying: "₦44M" },
  { name: "Standard", customers: "612,000", used: "3.4 of 4", paidFor: "4", overpaying: "—" },
  { name: "Free", customers: "2.1M", used: "1.2 of 2", paidFor: "2", overpaying: "—" },
];

const HEAD_CLASS = "px-3 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase";

/** Screen 19 (stage adopt) — see flolyt-kit-122/19-stage-adopt.svg. */
const StageAdopt = () => {
  return (
    <StageDetailLayout
      title="Adopt"
      subtitle="Which parts of the product actually keep people · and which are paid for and ignored"
      rail={
        <Rail heading="THE UNCOMFORTABLE FINDING">
          <RailCallout tone="amber" title="₦112M of revenue sits on plans people do not use">
            Premium customers touch 2.1 of 9 features. That revenue is real today and fragile the
            moment anyone looks at their bill.
            <span className="mt-2 block font-semibold text-amber">
              Finance calls this revenue. Product calls it a warning.
            </span>
          </RailCallout>
          <RailInsight title="Downgrade before they churn">
            Moving them to a plan that fits loses ₦44M and keeps ₦68M. Doing nothing risks both.
          </RailInsight>
          <RailInsight title="Or earn the plan">
            Drive one more feature into use. Customers at 4+ features renew 31 points higher.
          </RailInsight>
          <RailInsight title="What we will not do">
            Hide the usage data. If a customer asks what they are paying for, the honest answer
            is the only answer.
          </RailInsight>
        </Rail>
      }
    >
      <section>
        <Eyebrow>Adoption against retention · every dot is a feature</Eyebrow>
        <div className="relative mt-3 aspect-[672/300] rounded-card border border-line bg-paper-2 p-6">
          <div className="absolute top-6 right-6 bottom-6 left-6">
            <div className="absolute top-0 bottom-0 left-[7.4%] w-px bg-line" aria-hidden />
            <div className="absolute top-[93.3%] right-0 left-[7.4%] h-px bg-line" aria-hidden />

            <span className="absolute top-0 left-0 font-mono text-[9px] text-ink-4">keeps</span>
            <span className="absolute bottom-[8%] left-0 font-mono text-[9px] text-ink-4">
              does not
            </span>
            <span className="absolute bottom-0 left-[9%] font-mono text-[9px] text-ink-4">
              rarely used
            </span>
            <span className="absolute right-0 bottom-0 font-mono text-[9px] text-ink-4">
              used by everyone
            </span>

            {FEATURES.map((f) => (
              <div
                key={f.name}
                className="absolute flex items-center gap-1.5"
                style={{ left: `${f.left}%`, top: `${f.top}%` }}
              >
                <span className={cn("size-2.5 shrink-0 rounded-full", TONE_DOT_CLASSES[f.tone])} />
                <span className="text-[10.5px] whitespace-nowrap text-ink-2">{f.name}</span>
              </div>
            ))}

            <div className="absolute right-0 bottom-[16%] w-42.5 rounded-panel border border-line bg-paper p-3">
              <p className="text-[11.5px] font-semibold text-ink">Subscriptions</p>
              <p className="mt-1 text-[10.5px] text-ink-3">29% use it. They retain at 94%.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <Eyebrow>Paying for depth they never touch</Eyebrow>
        <div className="mt-3 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[560px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line">
                <th className={HEAD_CLASS}>Plan</th>
                <th className={HEAD_CLASS}>Customers</th>
                <th className={HEAD_CLASS}>Features used</th>
                <th className={HEAD_CLASS}>Features paid for</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Overpaying by</th>
              </tr>
            </thead>
            <tbody>
              {PLANS.map((plan) => (
                <tr key={plan.name} className="border-b border-line last:border-0">
                  <td className="px-3 py-3 font-semibold whitespace-nowrap text-ink">{plan.name}</td>
                  <td className="px-3 py-3 font-mono whitespace-nowrap text-ink-2">{plan.customers}</td>
                  <td className="px-3 py-3 font-mono whitespace-nowrap text-ink-2">{plan.used}</td>
                  <td className="px-3 py-3 font-mono whitespace-nowrap text-ink-2">{plan.paidFor}</td>
                  <td
                    className={cn(
                      "px-3 py-3 text-right font-semibold whitespace-nowrap",
                      plan.overpaying === "—" ? "text-ink-4 font-normal" : "text-rose"
                    )}
                  >
                    {plan.overpaying}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </StageDetailLayout>
  );
};

export default StageAdopt;
