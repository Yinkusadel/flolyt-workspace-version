import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BarRow } from "@/pages/lifecycle-stage/bar";
import { Eyebrow, StageDetailLayout } from "@/pages/lifecycle-stage/layout";
import { Rail, RailAgentNote, RailDecisionCard } from "@/pages/lifecycle-stage/rail";

type Verdict = "scale it" | "hold" | "stop";

const VERDICT_CLASSES: Record<Verdict, string> = {
  "scale it": "border-teal-border bg-teal-bg text-teal",
  hold: "border-amber-border bg-amber-bg text-amber",
  stop: "border-rose-border bg-rose-bg text-rose",
};

const CHANNELS = [
  {
    name: "Organic search",
    newPerMo: "18,400",
    cac: "₦2,100",
    ltv: "₦18,400",
    payback: "1.4 mo",
    paybackTone: "teal" as const,
    m1: "44%",
    verdict: "scale it" as Verdict,
    m6Percent: 92,
    m6Label: "26% still ordering at M6",
  },
  {
    name: "Referral",
    newPerMo: "22,900",
    cac: "₦1,400",
    ltv: "₦16,900",
    payback: "1.0 mo",
    paybackTone: "teal" as const,
    m1: "46%",
    verdict: "scale it" as Verdict,
    m6Percent: 88,
    m6Label: "29% still ordering at M6",
  },
  {
    name: "Paid social",
    newPerMo: "26,100",
    cac: "₦5,800",
    ltv: "₦7,200",
    payback: "9.7 mo",
    paybackTone: "amber" as const,
    m1: "31%",
    verdict: "hold" as Verdict,
    m6Percent: 34,
    m6Label: "11% still ordering at M6",
  },
  {
    name: "Influencer",
    newPerMo: "8,200",
    cac: "₦4,900",
    ltv: "₦6,100",
    payback: "9.6 mo",
    paybackTone: "amber" as const,
    m1: "29%",
    verdict: "hold" as Verdict,
    m6Percent: 30,
    m6Label: "9% still ordering at M6",
  },
  {
    name: "Discount aggregator",
    newPerMo: "12,900",
    cac: "₦3,600",
    ltv: "₦2,800",
    payback: "never",
    paybackTone: "rose" as const,
    m1: "18%",
    verdict: "stop" as Verdict,
    m6Percent: 11,
    m6Label: "3% still ordering at M6",
  },
];

const HEAD_CLASS = "px-3 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase";

/** Screen 16 (stage acquire) — see flolyt-kit-122/16-stage-acquire.svg. */
const StageAcquire = () => {
  return (
    <StageDetailLayout
      title="Acquire"
      // subtitle="894,000 new customers a year · the question is not how many, but which ones"
      rail={
        <Rail heading="THE DECISION WAITING">
          <RailDecisionCard
            badge="NEEDS A HUMAN DECISION"
            title="Stop the aggregator channel"
            rows={[
              { label: "Removes", value: "₦74M leakage" },
              { label: "Also removes", value: "₦52M revenue" },
              { label: "Net, year one", value: "+₦22M" },
              { label: "Net, year two", value: "+₦61M" },
              { label: "Owner", value: "Tunde · Marketing" },
            ]}
            footnote="Growth loses a number they are measured on. Say so out loud."
          />
          <RailAgentNote label="ADVOCACY AGENT ADDS">
            Referral now brings more customers than paid social at a fifth of the cost. The
            budget question is not whether to cut, but where the ₦74M goes.
          </RailAgentNote>
        </Rail>
      }
    >
      <section>
        <Eyebrow>Channel quality · volume is the least interesting column</Eyebrow>
        <div className="mt-3 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[640px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line">
                <th className={HEAD_CLASS}>Channel</th>
                <th className={HEAD_CLASS}>New / mo</th>
                <th className={HEAD_CLASS}>CAC</th>
                <th className={HEAD_CLASS}>LTV</th>
                <th className={HEAD_CLASS}>Payback</th>
                <th className={HEAD_CLASS}>M1 retention</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {CHANNELS.map((c) => (
                <tr key={c.name} className="border-b border-line last:border-0">
                  <td className="px-3 py-3 font-medium whitespace-nowrap text-ink">{c.name}</td>
                  <td className="px-3 py-3 font-mono whitespace-nowrap text-ink-2">{c.newPerMo}</td>
                  <td className="px-3 py-3 font-mono whitespace-nowrap text-ink-2">{c.cac}</td>
                  <td className="px-3 py-3 font-mono whitespace-nowrap text-ink-2">{c.ltv}</td>
                  <td
                    className={cn(
                      "px-3 py-3 font-mono font-semibold whitespace-nowrap",
                      c.paybackTone === "teal" && "text-teal",
                      c.paybackTone === "amber" && "text-amber",
                      c.paybackTone === "rose" && "text-rose"
                    )}
                  >
                    {c.payback}
                  </td>
                  <td className="px-3 py-3 font-mono whitespace-nowrap text-ink-2">{c.m1}</td>
                  <td className="px-3 py-3 text-right">
                    <Badge variant="outline" className={cn("border", VERDICT_CLASSES[c.verdict])}>
                      {c.verdict}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <Eyebrow>The same channels, judged 6 months later</Eyebrow>
        <div className="mt-4 space-y-3.5">
          {CHANNELS.map((c) => (
            <BarRow
              key={c.name}
              label={c.name}
              percent={c.m6Percent}
              tone={c.m6Percent >= 60 ? "teal" : c.m6Percent >= 20 ? "amber" : "rose"}
              trailing={c.m6Label}
              trailingTone="ink"
            />
          ))}
        </div>

        <div className="mt-5 rounded-card border border-dashed border-line bg-paper-2 p-5">
          <h3 className="text-[12.5px] font-semibold text-ink">
            Acquisition is judged on month six, not on signup
          </h3>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-2">
            A channel that fills the top of the funnel with people who never place a second order
            is not growth. It is a leakage source with a marketing budget attached.
          </p>
        </div>
      </section>
    </StageDetailLayout>
  );
};

export default StageAcquire;
