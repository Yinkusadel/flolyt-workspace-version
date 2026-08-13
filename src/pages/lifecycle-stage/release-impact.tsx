import { cn } from "@/lib/utils";
import { Eyebrow, StageDetailLayout } from "@/pages/lifecycle-stage/layout";
import { Rail, RailAgentNote, RailInsight } from "@/pages/lifecycle-stage/rail";

const RELEASES = [
  { name: "One-tap reorder", shipped: "2 Aug", owner: "Platform", effect: "+₦18M / mo", tone: "teal" as const, flagged: false },
  { name: "Search ranking v4", shipped: "24 Jul", owner: "Discovery", effect: "+₦4M / mo", tone: "teal" as const, flagged: false },
  { name: "Checkout rewrite", shipped: "11 Jun", owner: "Payments", effect: "no measurable effect", tone: "ink" as const, flagged: false },
  { name: "Push permission prompt", shipped: "3 May", owner: "Growth", effect: "−₦2M / mo", tone: "rose" as const, flagged: false },
  { name: "Delivery fee at checkout", shipped: "4 Mar", owner: "Payments", effect: "−₦412M / yr", tone: "rose" as const, flagged: true },
  { name: "SSO for business accounts", shipped: "4 Mar", owner: "Identity", effect: "no measurable effect", tone: "ink" as const, flagged: false },
];

const EVENTS = [
  { name: "checkout.fee_shown", status: "missing", tone: "rose" as const, note: "would have caught this on day two" },
  { name: "order.completed", status: "healthy", tone: "teal" as const, note: "1.2M events / day" },
  { name: "basket.abandoned", status: "healthy", tone: "amber" as const, note: "reason not captured" },
  { name: "payment.declined", status: "healthy", tone: "teal" as const, note: "decline code captured" },
];

const TONE_TEXT = { teal: "text-teal", rose: "text-rose", amber: "text-amber", ink: "text-ink-4" } as const;
const TONE_DOT = { teal: "bg-teal", rose: "bg-rose", amber: "bg-amber", ink: "bg-ink-4" } as const;

const HEAD_CLASS = "px-3 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase";

/** Screen 26 (stage engineering / release impact) — see flolyt-kit-122/26-stage-release-impact.svg. */
const ReleaseImpact = () => {
  return (
    <StageDetailLayout
      title="Release impact"
      subtitle="What shipping changed · every release measured against revenue, not just errors"
      rail={
        <Rail heading="WHY ENGINEERING IS IN HERE">
          <RailInsight title="A release is a revenue event">
            Every change to the product changes behaviour. Most changes are small; some are the
            largest single line in the year&rsquo;s numbers.
          </RailInsight>
          <RailInsight title="Clean is not the same as safe">
            Error budgets measure whether the software works. They cannot tell you whether it
            still earns.
          </RailInsight>
          <RailInsight title="The instrument list is a backlog">
            A missing event is a question the business cannot ask. That is an engineering ticket
            with a revenue number on it.
          </RailInsight>
          <RailInsight title="Blame is not the point">
            Payments shipped what they were asked to ship. The failure was that nobody was
            watching the same number.
          </RailInsight>
          <RailAgentNote label="NOW WATCHING">
            Every release is now held against activation, second-order rate and contact volume
            for 14 days before it is called clean.
          </RailAgentNote>
        </Rail>
      }
    >
      <section>
        <Eyebrow>Releases, newest first</Eyebrow>
        <div className="mt-3 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[600px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line">
                <th className={HEAD_CLASS}>Release</th>
                <th className={HEAD_CLASS}>Shipped</th>
                <th className={HEAD_CLASS}>Owner</th>
                <th className={HEAD_CLASS}>Health</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Revenue effect</th>
              </tr>
            </thead>
            <tbody>
              {RELEASES.map((r) => (
                <tr
                  key={r.name}
                  className={cn("border-b border-line last:border-0", r.flagged && "bg-rose-bg")}
                >
                  <td className="px-3 py-3 font-medium whitespace-nowrap text-ink">{r.name}</td>
                  <td className="px-3 py-3 font-mono whitespace-nowrap text-ink-2">{r.shipped}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-ink-3">{r.owner}</td>
                  <td className="px-3 py-3 font-mono whitespace-nowrap text-teal">clean</td>
                  <td className={cn("px-3 py-3 text-right font-semibold whitespace-nowrap", TONE_TEXT[r.tone])}>
                    {r.effect}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-card border border-rose-border bg-rose-bg p-5">
          <h3 className="text-[13.5px] font-semibold text-ink">
            The most expensive release of the year passed every check
          </h3>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-2">
            No errors, no latency regression, no rollback. Error budgets and revenue are
            different questions, and only one of them was being asked on 4 March.
          </p>
          <p className="mt-3 text-[11px] font-semibold text-rose">
            Detected 20 weeks late — by a retention cohort, not by a dashboard engineering looks
            at.
          </p>
        </div>
      </section>

      <section>
        <Eyebrow>Instrumentation health · answers are only as good as the events behind them</Eyebrow>
        <div className="mt-3 divide-y divide-line rounded-card border border-line bg-paper">
          {EVENTS.map((e) => (
            <div key={e.name} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
              <span className={cn("size-2 shrink-0 rounded-full", TONE_DOT[e.tone])} aria-hidden />
              <span className="font-mono text-[11.5px] text-ink-2">{e.name}</span>
              <span className={cn("font-mono text-[11px] font-semibold", TONE_TEXT[e.tone])}>
                {e.status}
              </span>
              <span className="ml-auto text-[11px] text-ink-4">{e.note}</span>
            </div>
          ))}
        </div>
      </section>
    </StageDetailLayout>
  );
};

export default ReleaseImpact;
