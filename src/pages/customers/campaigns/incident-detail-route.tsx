import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { CP16_GUARDRAIL_ROWS, CP16_STATS, CP_CHIP_TONE, CP_KPI_TONE, CP_TONE_CLASS } from "@/pages/customers/campaigns/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function ResendIncident() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Campaigns", to: "/campaigns" }, { label: "When a send went wrong" }]}
        title="Campaigns · incident"
        subtitle="1,204 held customers were reached · three guardrails held, two were in the wrong place"
        action={
          <Button type="button" onClick={() => toast.success("Opening Sam's fix in the queue")}>
            Open the fix
          </Button>
        }
      />

      <div className="rounded-card border border-rose-border bg-rose-bg p-5">
        <p className="text-[12px] font-semibold text-ink">
          A resend on 14 August ignored the hold list and reached 1,204 people who were being held
        </p>
        <p className="mt-2 text-[10.5px] leading-relaxed text-ink-2">
          It was built outside the play, from a saved list, by someone with every permission needed to do it. No
          guardrail was bypassed, because the guardrails run inside the play and this did not use one.
        </p>
      </div>

      <KpiCards items={CP16_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: CP_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the guardrails did and did not cover</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Guardrail</th>
                <th className={`${HEAD_CLASS} text-right`}>Applied to the resend?</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={HEAD_CLASS}>Fix</th>
              </tr>
            </thead>
            <tbody>
              {CP16_GUARDRAIL_ROWS.map((row) => (
                <tr key={row.guardrail} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.guardrail}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={CP_CHIP_TONE[row.appliedTone]}>{row.applied}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className={`px-4 py-3 ${row.fix === "—" ? "text-ink-4" : CP_TONE_CLASS.ok}`}>{row.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Three guardrails held and two did not, and the difference is where they are enforced">
        Consent, quiet hours and permanent exclusions live in the delivery layer and applied to everything. The cap
        and the hold list live on the play, so anything sent another way misses them. Nobody did anything wrong and
        nothing was overridden — the two most experiment-critical rules were simply in the wrong place, and that is
        now one line in Sam&apos;s queue.
      </Callout>

      <Callout tone="teal" title="Fourteen hours from send to detection, against 151 days for the fee change">
        The overlap check runs nightly and compares every send against every hold list. It found this before
        anybody looked at a chart, and the difference between fourteen hours and five months is that somebody had
        written down which people were supposed to be left alone.
      </Callout>
    </div>
  );
}

function IncidentNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Incident not found</p>
      <Link to="/campaigns" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to campaigns
      </Link>
    </div>
  );
}

/** CP16 (`1`) — /campaigns/incidents/:id, the only built reference row, same "one/two reference rows" pattern as every prior section. */
const CampaignIncidentDetailRoute = () => {
  const { id } = useParams();

  if (id === "1") return <ResendIncident />;
  return <IncidentNotFound />;
};

export default CampaignIncidentDetailRoute;
