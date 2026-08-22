import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { GovernanceTabs } from "@/pages/agents/governance/tabs";
import { GV12_ROWS, GV_TONE_CLASS } from "@/pages/agents/governance/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function TheResendIncident() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Incidents</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Six entries · nobody did anything wrong · fourteen hours from send to finding</p>
        </div>
        <Button type="button" variant="outline" onClick={() => toast.success("Noted")}>
          See the fix
        </Button>
      </div>

      <GovernanceTabs active="Incidents" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>14 August · the resend that reached 1,204 held customers · reconstructed from the log</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Time</th>
                <th className={HEAD_CLASS}>Entry</th>
                <th className={`${HEAD_CLASS} text-right`}>Identity</th>
                <th className={HEAD_CLASS}>What it tells you</th>
              </tr>
            </thead>
            <tbody>
              {GV12_ROWS.map((row) => (
                <tr key={row.time + row.entry} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink-4">{row.time}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{row.entry}</td>
                  <td className={`px-4 py-3 text-right ${GV_TONE_CLASS[row.identityTone]}`}>{row.identity}</td>
                  <td className={`px-4 py-3 ${GV_TONE_CLASS[row.tellsTone]}`}>{row.tells}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Nobody did anything wrong and the log shows exactly that, which is the harder thing to build">
        Ifeoma had every permission she used, authorised the send properly, and the frequency cap ran correctly.
        The hold list simply lives on the play and this send did not use one. An incident log that looked for a
        culprit would have found a competent person following the rules, and stopped there.
      </Callout>

      <Callout tone="ultra" title="Fourteen hours from the send to the finding, and both entries are in the same sequence">
        The agent that caught it had been installed twelve days earlier and had found nothing until then. The gap
        between entry 411,203 and entry 411,847 is the entire cost of this incident being invisible, and it is
        measurable to the minute because both ends are in one log.
      </Callout>

      <p className="text-[11px] text-ink-4">
        <Link to="/governance/411904" className="font-semibold text-ultra hover:underline">
          See the Kenya retry send, for comparison
        </Link>
      </p>
    </div>
  );
}

function IncidentNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Incident not found</p>
      <Link to="/governance" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to Governance
      </Link>
    </div>
  );
}

/** GV12 (`1`) — the section's only built incident, also the "Incidents" tab's content. */
const IncidentDetailRoute = () => {
  const { id } = useParams();

  if (id === "1") return <TheResendIncident />;
  return <IncidentNotFound />;
};

export default IncidentDetailRoute;
