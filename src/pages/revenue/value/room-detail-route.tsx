import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { ValueKvList } from "@/pages/revenue/value/kv-list";
import {
  VL06_OTHER_KV,
  VL06_PLAYS_ROWS,
  VL06_STATS,
  VL06_TIMELINE,
  VL_KPI_TONE,
  VL_TONE_CLASS,
} from "@/pages/revenue/value/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function CardsFailingDetail() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Value", to: "/value" }, { label: "Cards failing on renewal night" }]}
        title="Cards failing on renewal night"
        subtitle="₦88M at risk · ₦62M recovered · ₦26M that a retry was never going to reach"
        action={
          <Button type="button" variant="outline" onClick={() => toast.info("Opening the reuse workflow")}>
            Reuse the design
          </Button>
        }
      />

      <KpiCards items={VL06_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: VL_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The whole life of one room</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>When</th>
                <th className={HEAD_CLASS}>What happened</th>
                <th className={`${HEAD_CLASS} text-right`}>Figure</th>
                <th className={HEAD_CLASS}>Who</th>
              </tr>
            </thead>
            <tbody>
              {VL06_TIMELINE.map((row, i) => (
                <tr key={i} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 text-ink-2">{row.what}</td>
                  <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.figureTone]}`}>{row.figure}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                      <PersonAvatar kind={row.who.kind} initials={row.who.ref.initials} size="sm" team={2} />
                      {row.who.ref.name}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="₦26M did not come back and the ledger says why rather than rounding it away">
        Those balances failed for reasons a retry cannot fix — expired cards, closed accounts, and 4,100 customers
        who had already churned by the time the retry ran. The at-risk figure and the recovered figure are both
        real, and the gap between them is the useful part: it is the size of the problem that a different
        intervention would have to solve.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Plays that ran inside this room · they live in Rooms, and are listed here</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[700px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Play</th>
                <th className={`${HEAD_CLASS} text-right`}>Audience</th>
                <th className={`${HEAD_CLASS} text-right`}>Holdout</th>
                <th className={HEAD_CLASS}>Approved by</th>
                <th className={HEAD_CLASS}>Where it lives</th>
              </tr>
            </thead>
            <tbody>
              {VL06_PLAYS_ROWS.map((row) => (
                <tr key={row.play} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.play}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.audience}</td>
                  <td className="px-4 py-3 text-right font-mono text-teal">{row.holdout}</td>
                  <td className="px-4 py-3 text-ink-4">{row.approvedBy}</td>
                  <td className="px-4 py-3 text-ultra">{row.where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="A play is approved and run in the room, and only its result appears here">
        Audiences, exclusions, frequency caps, standing authority and the re-auth itself all belong to Rooms. This
        section holds what the play was worth and how that was established. Splitting them keeps one screen from
        being both the trigger and the scorecard for the same action.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this room produced besides money</p>
        <ValueKvList rows={VL06_OTHER_KV} />
      </section>
    </div>
  );
}

function RoomNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Room not found</p>
      <Link to="/value" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to value
      </Link>
    </div>
  );
}

/** VL06 (`8a1f`) — the ledger's only built room reference page, same "one/two reference rows" pattern as every prior section. */
const RoomDetailRoute = () => {
  const { id } = useParams();

  if (id === "8a1f") return <CardsFailingDetail />;
  return <RoomNotFound />;
};

export default RoomDetailRoute;
