import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { AttributionKvList } from "@/pages/revenue/attribution/kv-list";
import { AT13_CARDS, AT13_HERO, AT13_RISK_KV, AT13_SETTLE_ROWS, AT_CHIP_TONE, AT_TONE_CLASS, DISPUTE_TITLES } from "@/pages/revenue/attribution/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const CARD_ACCENT: Record<"warn" | "ai", string> = {
  warn: "text-amber",
  ai: "text-ultra",
};

function SixteenMillionDispute() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Attribution", to: "/attribution" }, { label: DISPUTE_TITLES["1"] }]}
        title={DISPUTE_TITLES["1"]}
        subtitle="Two rooms, two readings, one agent that refuses to choose · 23 days unresolved"
        action={
          <Button asChild type="button">
            <Link to="/attribution/holdouts/new">Start the holdout</Link>
          </Button>
        }
      />

      <div className="relative overflow-hidden rounded-card border border-rose-border bg-rose-bg p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{AT13_HERO.label}</p>
            <p className="mt-2 text-[26px] font-semibold text-ink">{AT13_HERO.big}</p>
            <p className="mt-1.5 max-w-md text-[11px] text-ink-3">{AT13_HERO.sub}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{AT13_HERO.rightLab}</p>
            <p className="mt-2 text-[20px] font-semibold text-ink">{AT13_HERO.rightBig}</p>
            <p className="mt-1.5 font-mono text-[10px] font-semibold text-rose">{AT13_HERO.rightSub}</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The two readings, as they were written</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {AT13_CARDS.map((card) => (
            <div key={card.kicker} className="rounded-card border border-line bg-paper">
              <div className="flex h-full flex-col gap-2.5 p-4">
                <p className={`font-mono text-[9px] font-medium tracking-[0.85px] uppercase ${CARD_ACCENT[card.acc]}`}>{card.kicker}</p>
                <h3 className="text-[13px] font-semibold text-ink">{card.bold}</h3>
                <p className="flex-1 text-[10.5px] leading-relaxed text-ink-3">{card.body}</p>
                <p className={`border-t border-dashed border-line pt-2.5 font-mono text-[10px] font-semibold ${CARD_ACCENT[card.acc]}`}>{card.footer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What would settle it</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Would settle it</th>
                <th className={`${HEAD_CLASS} text-right`}>How long</th>
                <th className={HEAD_CLASS}>Cost</th>
                <th className={HEAD_CLASS}>Who could start it</th>
                <th className={HEAD_CLASS}>Started?</th>
              </tr>
            </thead>
            <tbody>
              {AT13_SETTLE_ROWS.map((row) => (
                <tr key={row.wouldSettle} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.wouldSettle}</td>
                  <td className={`px-4 py-3 text-right font-mono ${AT_TONE_CLASS[row.howLongTone]}`}>{row.howLong}</td>
                  <td className={`px-4 py-3 ${AT_TONE_CLASS[row.costTone]}`}>{row.cost}</td>
                  <td className="px-4 py-3 text-ink-4">{row.who}</td>
                  <td className="px-4 py-3">
                    <Chip tone={AT_CHIP_TONE[row.startedTone]}>{row.started}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The current state is the fourth row and that is a decision nobody made">
        ₦16M has been out of the ledger for 23 days because leaving it there requires no one to act. The holdout
        designed today is the only row that produces an answer, and it costs a fortnight and ₦2.2M. This screen
        exists so that the cheapest option stops being the invisible one.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What each of them is risking by being right</p>
        <AttributionKvList rows={AT13_RISK_KV} />
      </section>
    </div>
  );
}

function DisputeNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Dispute not found</p>
      <Link to="/attribution" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to attribution
      </Link>
    </div>
  );
}

/** AT13 (`1`) — the section's only built dispute reference row. */
const DisputeDetailRoute = () => {
  const { id } = useParams();

  if (id === "1") return <SixteenMillionDispute />;
  return <DisputeNotFound />;
};

export default DisputeDetailRoute;
