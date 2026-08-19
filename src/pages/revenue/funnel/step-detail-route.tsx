import { Link, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { FN04_INSIDE_ROWS, FN04_MARKET_ROWS, FN_TONE_CLASS } from "@/pages/revenue/funnel/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function CheckoutToOrderDetail() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Funnel", to: "/funnel" }, { label: "Reached checkout → placed a first order" }]}
        title="Reached checkout → placed a first order"
        subtitle="271,000 reached checkout · 173,000 ordered · 98,000 did not"
        action={
          <Button type="button" onClick={() => navigate("/funnel/gaps")}>
            Request instrumentation
          </Button>
        }
      />

      <div className="rounded-card border border-line bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">Conversion · last 90 days</p>
            <p className="mt-2 text-[28px] font-semibold text-ink">63.8%</p>
            <p className="mt-1.5 max-w-sm text-[11px] text-ink-3">271,000 reached checkout · 173,000 ordered · 98,000 did not.</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">Before 4 march</p>
            <p className="mt-2 text-[20px] font-semibold text-ink">74.1%</p>
            <p className="mt-1.5 font-mono text-[10px] font-semibold text-rose">−10.3 points</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What happens inside this step</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[680px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What we know</th>
                <th className={HEAD_CLASS}>Source</th>
                <th className={`${HEAD_CLASS} text-right`}>Figure</th>
                <th className={`${HEAD_CLASS} text-right`}>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {FN04_INSIDE_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                  <td className="px-4 py-3 font-mono text-[10.5px] text-ink-3">{row.source}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.figureTone]}`}>{row.figure}</td>
                  <td className={`px-4 py-3 text-right ${FN_TONE_CLASS[row.confidenceTone]}`}>{row.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="The ticket count is the only evidence from inside the step, and it is not from the product">
        3,968 people were annoyed enough to write in about a fee they had already seen at the basket. That is the
        strongest signal available about what happens between two events, and it comes from Support rather than from
        instrumentation. It is a good clue and a poor substitute.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The same step in each market</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[680px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Market</th>
                <th className={`${HEAD_CLASS} text-right`}>Conversion</th>
                <th className={`${HEAD_CLASS} text-right`}>Before 4 Mar</th>
                <th className={`${HEAD_CLASS} text-right`}>Change</th>
                <th className={`${HEAD_CLASS} text-right`}>Fee shipped</th>
                <th className={`${HEAD_CLASS} text-right`}>Sample</th>
              </tr>
            </thead>
            <tbody>
              {FN04_MARKET_ROWS.map((row) => (
                <tr key={row.market} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.market}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.conversionTone]}`}>{row.conversion}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.before}</td>
                  <td className={`px-4 py-3 text-right font-mono ${FN_TONE_CLASS[row.changeTone]}`}>{row.change}</td>
                  <td className={`px-4 py-3 text-right ${FN_TONE_CLASS[row.feeShippedTone]}`}>{row.feeShipped}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-3">{row.sample}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Ghana is the next line of this table and the date is already known">
        Ghana and the UK are the two markets that did not receive the change, and they are the two that did not move.
        Ghana stops being a control on 14 September. Whatever this step is worth there, it is measurable now and
        will not be afterwards.
      </Callout>
    </div>
  );
}

function StepNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Step not found</p>
      <Link to="/funnel" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to the funnel
      </Link>
    </div>
  );
}

/** FN04 (`checkout-to-order`) — the funnel's only built `:step` reference row, same "one/two reference rows" pattern as every prior section. */
const FunnelStepDetailRoute = () => {
  const { step } = useParams();

  if (step === "checkout-to-order") return <CheckoutToOrderDetail />;
  return <StepNotFound />;
};

export default FunnelStepDetailRoute;
