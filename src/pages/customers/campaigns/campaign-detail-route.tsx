import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { CampaignsKvList } from "@/pages/customers/campaigns/kv-list";
import { CP04_KV_ROWS, CP04_STEPS_ROWS, CP_TONE_CLASS } from "@/pages/customers/campaigns/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function ReactivationWaveOneDetail() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Campaigns", to: "/campaigns" }, { label: "Reactivation · wave one" }]}
        title="Reactivation · wave one"
        subtitle="90,000 reached of 148,000 matched · every reduction named · the holdout is contaminated"
        action={
          <Button type="button" onClick={() => toast.info("Opening the experiment behind this send")}>
            Open the experiment
          </Button>
        }
      />

      <div className="rounded-card border border-rose-border bg-rose-bg p-5">
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-rose uppercase">Reached · day 12 of 14</p>
        <p className="mt-2 text-[28px] font-semibold text-ink">90,000</p>
        <p className="mt-1.5 max-w-xl text-[11px] leading-relaxed text-ink-2">
          10,000 held back. 1,204 of the held group received it anyway on 14 August, and the comparison is no longer
          clean.
        </p>
        <div className="mt-3 border-t border-dashed border-rose-border pt-3">
          <p className="font-mono text-[8.5px] text-ink-4 uppercase">Provisional result</p>
          <p className="mt-0.5 text-[13px] font-semibold text-rose">Withdrawn · ₦9.1M no longer stated</p>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>How the audience was built, from segment to send</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Step</th>
                <th className={`${HEAD_CLASS} text-right`}>People</th>
                <th className={HEAD_CLASS}>What happened here</th>
                <th className={`${HEAD_CLASS} text-right`}>Set by</th>
              </tr>
            </thead>
            <tbody>
              {CP04_STEPS_ROWS.map((row) => (
                <tr key={row.step} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.step}</td>
                  <td className={`px-4 py-3 text-right font-mono ${CP_TONE_CLASS[row.peopleTone]}`}>{row.people}</td>
                  <td className="px-4 py-3 text-ink-3">{row.what}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.setBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The room says 100,000 and the send says 90,000, and every step between them is on this screen">
        Four separate reductions, none of them silent, each with whoever set it. A guardrail that quietly shrinks an
        audience is a bug — the number in the room and the number in the send are allowed to differ only because the
        path between them is readable.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What went wrong on 14 August</p>
        <CampaignsKvList rows={CP04_KV_ROWS} />
      </section>
    </div>
  );
}

function CampaignNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Campaign not found</p>
      <Link to="/campaigns" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to campaigns
      </Link>
    </div>
  );
}

/** CP04 (`reactivation-1`) — the only built `:id` reference row, same "one/two reference rows" pattern as every prior section. */
const CampaignDetailRoute = () => {
  const { id } = useParams();

  if (id === "reactivation-1") return <ReactivationWaveOneDetail />;
  return <CampaignNotFound />;
};

export default CampaignDetailRoute;
