import { cn } from "@/lib/utils";
import { Eyebrow, StageDetailLayout } from "@/pages/lifecycle/stage/layout";
import { Rail, RailInsight } from "@/pages/lifecycle/stage/rail";
import { DEPARTMENT_COLORS, type Department } from "@/pages/lifecycle/data";

const DRIVERS = [
  { driver: "“Where is my order”", contacts: "14,200", cost: "₦18M", repeat: "−31 pts", repeatTone: "rose" as const, owner: "Engineering" as Department },
  { driver: "Delivery fee not expected", contacts: "8,900", cost: "₦11M", repeat: "−24 pts", repeatTone: "rose" as const, owner: "Product" as Department },
  { driver: "Payment failed", contacts: "6,100", cost: "₦7M", repeat: "−12 pts", repeatTone: "amber" as const, owner: "Finance" as Department },
  { driver: "How do I cancel", contacts: "4,800", cost: "₦6M", repeat: "—", repeatTone: "ink" as const, owner: "Customer Success" as Department },
  { driver: "Product question", contacts: "5,200", cost: "₦6M", repeat: "+8 pts", repeatTone: "teal" as const, owner: "Product" as Department },
  { driver: "Everything else", contacts: "2,800", cost: "₦3M", repeat: "—", repeatTone: "ink" as const, owner: "Support" as Department },
];

const DEFLECTIONS = [
  { fix: "Show the delivery fee at basket", value: "8,900 / mo", owner: "Product" as Department },
  { fix: "Delivery tracking that updates on failure", value: "9,400 / mo", owner: "Engineering" as Department },
  { fix: "Retry cards on payday", value: "4,200 / mo", owner: "Finance" as Department },
];

const TONE_TEXT = { rose: "text-rose", amber: "text-amber", teal: "text-teal", ink: "text-ink-4" } as const;

const HEAD_CLASS = "px-3 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase";

/** Screen 22 (stage support) — see flolyt-kit-122/22-stage-support.svg. */
const StageSupport = () => {
  return (
    <StageDetailLayout
      title="Support"
      subtitle="42,000 contacts a month · read as a revenue signal, not a queue"
      rail={
        <Rail heading="SUPPORT IS AN EARLY WARNING">
          <RailInsight title="Support saw it first">
            &ldquo;Where is my order&rdquo; became the top driver in the week of 4 March —
            nineteen weeks before the retention cohort made it visible.
          </RailInsight>
          <RailInsight title="Two thirds of this queue is not ours">
            The drivers belong to Product, Engineering and Finance. Support carries the cost of
            other teams&rsquo; decisions.
          </RailInsight>
          <RailInsight title="Deflection is not the goal">
            A well-deflected contact still means the customer had the problem. Removing the
            cause is the only real number.
          </RailInsight>
          <RailInsight title="Read-only by design">
            Flolyt reads tickets and never writes to them. The helpdesk stays the system of
            record.
          </RailInsight>
        </Rail>
      }
    >
      <section>
        <Eyebrow>Contact drivers · what it costs, and what it costs afterwards</Eyebrow>
        <div className="mt-3 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[640px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line">
                <th className={HEAD_CLASS}>Driver</th>
                <th className={HEAD_CLASS}>Contacts</th>
                <th className={HEAD_CLASS}>Cost to serve</th>
                <th className={HEAD_CLASS}>Repeat order after</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Owned by</th>
              </tr>
            </thead>
            <tbody>
              {DRIVERS.map((d) => (
                <tr key={d.driver} className="border-b border-line last:border-0">
                  <td className="px-3 py-3 text-ink">{d.driver}</td>
                  <td className="px-3 py-3 font-mono whitespace-nowrap text-ink-2">{d.contacts}</td>
                  <td className="px-3 py-3 font-mono whitespace-nowrap text-ink-2">{d.cost}</td>
                  <td className={cn("px-3 py-3 font-mono font-semibold whitespace-nowrap", TONE_TEXT[d.repeatTone])}>
                    {d.repeat}
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 justify-end">
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: DEPARTMENT_COLORS[d.owner] }}
                        aria-hidden
                      />
                      <span style={{ color: DEPARTMENT_COLORS[d.owner] }} className="font-mono text-[10.5px]">
                        {d.owner}
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-card border border-rose-border bg-rose-bg p-5">
          <h3 className="text-[12.5px] font-semibold text-ink">A contact is not neutral</h3>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-2">
            Someone who contacts us about a missing order is 31 points less likely to order again
            than someone who does not. The ₦18M cost to serve is the small half of that number.
          </p>
        </div>
      </section>

      <section>
        <Eyebrow>What would remove the contact entirely · not deflect it</Eyebrow>
        <div className="mt-3 divide-y divide-line rounded-card border border-line bg-paper">
          {DEFLECTIONS.map((d) => (
            <div key={d.fix} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: DEPARTMENT_COLORS[d.owner] }}
                aria-hidden
              />
              <span className="text-[11.5px] text-ink-2">{d.fix}</span>
              <span className="font-mono text-[11.5px] font-semibold text-teal">{d.value}</span>
              <span
                className="ml-auto font-mono text-[11px]"
                style={{ color: DEPARTMENT_COLORS[d.owner] }}
              >
                {d.owner}
              </span>
            </div>
          ))}
        </div>
      </section>
    </StageDetailLayout>
  );
};

export default StageSupport;
