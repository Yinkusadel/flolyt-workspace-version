import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { ForecastKvList } from "@/pages/revenue/forecast/kv-list";
import { FC04_HERO, FC04_KV_ROWS, FC04_ROWS, FC_CHIP_TONE, FC_DETAIL_TITLES, FC_TONE_CLASS } from "@/pages/revenue/forecast/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function RenewDetail() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Forecast", to: "/forecast" }, { label: FC_DETAIL_TITLES["renew"] }]}
        title={FC_DETAIL_TITLES["renew"]}
        subtitle="88.4% signed · the model said 87.9% · one input explains the whole difference"
        action={
          <Button asChild type="button">
            <Link to="/forecast/renew/re-forecast">Re-forecast now</Link>
          </Button>
        }
      />

      <div className="relative overflow-hidden rounded-card border border-rose-border bg-rose-bg p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{FC04_HERO.label}</p>
            <p className="mt-2 text-[26px] font-semibold text-ink">{FC04_HERO.big}</p>
            <p className="mt-1.5 max-w-md text-[11px] text-ink-3">{FC04_HERO.sub}</p>
          </div>
          <div className="text-right">
            <p className="text-[12px] font-semibold text-rose">{FC04_HERO.late}</p>
            <p className="mt-1 font-mono text-[10px] text-ink-4">{FC04_HERO.due}</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the number is made of</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Input</th>
                <th className={`${HEAD_CLASS} text-right`}>Value</th>
                <th className={HEAD_CLASS}>Source</th>
                <th className={`${HEAD_CLASS} text-right`}>Confidence</th>
                <th className={HEAD_CLASS}>Kunle's view</th>
              </tr>
            </thead>
            <tbody>
              {FC04_ROWS.map((row) => (
                <tr key={row.input} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.input}</td>
                  <td className={`px-4 py-3 text-right font-mono ${row.valueTone ? FC_TONE_CLASS[row.valueTone] : "text-ink"}`}>{row.value}</td>
                  <td className="px-4 py-3 text-ink-2">{row.source}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={FC_CHIP_TONE[row.confidenceTone]}>{row.confidence}</Chip>
                  </td>
                  <td className={`px-4 py-3 ${FC_TONE_CLASS[row.viewTone]}`}>{row.view}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The whole difference between 87.9% and 88.4% is one input and it is named">
        Kunle put the card recovery at +2.8 where the model has +2.3, because he has watched the Kenyan retry for
        six days and the model has not. That is a defensible disagreement about one row, it is visible on this
        screen, and in ninety days it is checkable. A forecast that let him move the headline figure without naming
        which input he moved would be an opinion with a decimal point.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What happens when the re-forecast is late</p>
        <div className="max-w-2xl">
          <ForecastKvList rows={FC04_KV_ROWS} />
        </div>
      </section>
    </div>
  );
}

function ForecastNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Forecast not found</p>
      <Link to="/forecast" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to forecast
      </Link>
    </div>
  );
}

/** FC04 (disk, `renew`) — the section's only built `:stage` reference row, same "one/two reference rows" pattern as every prior section. */
const ForecastStageDetailRoute = () => {
  const { stage } = useParams();

  if (stage === "renew") return <RenewDetail />;
  return <ForecastNotFound />;
};

export default ForecastStageDetailRoute;
