import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { AssignAnOwnerModal } from "@/pages/everyday/lifecycle/stage/modals/assign-an-owner-modal";
import { LeaksKvList } from "@/pages/revenue/leakage-map/kv-list";
import {
  LK04_CARDS,
  LK04_STAGE_ROWS,
  LK04_UNPRICED_ROWS,
  LK10_ASSIGN_OWNER_PRESET,
  LK10_ENDS_ROWS,
  LK10_FINDING_ROWS,
  LK_TONE_CLASS,
} from "@/pages/revenue/leakage-map/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function DeliveryFeeDetail() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[
          { label: "Leakage map", to: "/leakage-map" },
          { label: "The delivery fee moved to checkout" },
        ]}
        title="The delivery fee moved to checkout"
        subtitle="Shipped 4 March · connected 2 August · ₦1.08B across eight measured stages"
        action={
          <Button type="button" onClick={() => navigate("/rooms/second-order-never-happened")}>
            Open the room
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {LK04_CARDS.map((card) => (
          <div key={card.kicker} className="rounded-card border border-line bg-paper">
            <div className="flex h-full flex-col gap-2.5 p-4">
              <p className={`font-mono text-[9px] font-medium tracking-[0.85px] uppercase ${LK_TONE_CLASS[card.tone]}`}>{card.kicker}</p>
              <h3 className="text-[13px] font-semibold text-ink">{card.bold}</h3>
              <p className="flex-1 text-[10.5px] leading-relaxed text-ink-3">{card.body}</p>
              <p className={`border-t border-dashed border-line pt-2.5 font-mono text-[10px] font-semibold ${LK_TONE_CLASS[card.tone]}`}>{card.footer}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The same release, priced at every stage it touched</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[800px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Stage</th>
                <th className={HEAD_CLASS}>What it looked like there</th>
                <th className="px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">Realised</th>
                <th className={HEAD_CLASS}>First seen</th>
                <th className={HEAD_CLASS}>Named as the cause</th>
              </tr>
            </thead>
            <tbody>
              {LK04_STAGE_ROWS.map((row) => (
                <tr key={row.stage} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.stage}</td>
                  <td className="px-4 py-3 text-ink-2">{row.whatItLooked}</td>
                  <td className={`px-4 py-3 text-right font-mono ${LK_TONE_CLASS[row.realisedTone]}`}>{row.realised}</td>
                  <td className="px-4 py-3 text-ink-4">{row.firstSeen}</td>
                  <td className={`px-4 py-3 ${LK_TONE_CLASS[row.namedTone]}`}>{row.namedAsCause}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Support named it in fourteen days and it made no difference to anyone else">
        Amara's team reclassified the contact driver correctly on 21 March and fixed what they could reach. The
        finding stayed inside Support, because in March there was no destination for “a thing my stage sees that
        belongs to another stage”. That routing gap still has twelve open conditions, and it is the reason this
        page is worth ₦1.08B rather than ₦28M.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The two stages that could not be priced at all</p>
        <LeaksKvList rows={LK04_UNPRICED_ROWS} />
      </section>
    </div>
  );
}

function AdoptDepthDetail() {
  const [assignOpen, setAssignOpen] = useState(false);

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Leakage map", to: "/leakage-map" }, { label: "Adopt · feature depth" }]}
        title="Adopt · feature depth"
        subtitle="₦134M · 19 findings · 9 breached thresholds · 0 rooms · 214 days"
        action={
          <Button type="button" onClick={() => setAssignOpen(true)}>
            Assign an owner
          </Button>
        }
      />

      <div className="rounded-card border border-rose-border bg-rose-bg p-5">
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-rose uppercase">
          Realised loss · no room, no owner, 214 days
        </p>
        <p className="mt-2 text-[28px] font-semibold text-ink">₦134M</p>
        <p className="mt-1.5 max-w-xl text-[11px] leading-relaxed text-ink-2">
          The strongest retention predictor in the workspace has never been proposed as an action.
        </p>
        <div className="mt-3 flex flex-wrap gap-5 border-t border-dashed border-rose-border pt-3">
          <div>
            <p className="font-mono text-[8.5px] text-ink-4 uppercase">Agent findings</p>
            <p className="mt-0.5 text-[13px] font-semibold text-ink">19</p>
          </div>
          <div>
            <p className="font-mono text-[8.5px] text-ink-4 uppercase">Rooms opened</p>
            <p className="mt-0.5 text-[13px] font-semibold text-rose">0 rooms opened</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the agents have said about it, since April</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Agent</th>
                <th className={HEAD_CLASS}>Finding</th>
                <th className={HEAD_CLASS}>Confidence</th>
                <th className={HEAD_CLASS}>Routed to</th>
                <th className={HEAD_CLASS}>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {LK10_FINDING_ROWS.map((row) => (
                <tr key={row.finding} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                      <PersonAvatar kind="agent" initials={row.agent.initials} size="sm" />
                      {row.agent.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-2">{row.finding}</td>
                  <td className={`px-4 py-3 ${LK_TONE_CLASS[row.confidenceTone]}`}>{row.confidence}</td>
                  <td className="px-4 py-3 text-rose">{row.routedTo}</td>
                  <td className="px-4 py-3 text-rose">{row.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Nineteen findings, nine breached thresholds and zero rooms is not an agent failure">
        Every one of these was produced, ranked and routed correctly. They arrived at a field that is empty, and an
        empty field is not a person. Flolyt will not auto-assign this to the nearest plausible team, because an
        owner who did not agree to be one is how a ₦134M line sits untouched for 214 days while looking assigned.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Three ways this ends, and what each one costs</p>
        <LeaksKvList rows={LK10_ENDS_ROWS} />
      </section>

      <AssignAnOwnerModal preset={LK10_ASSIGN_OWNER_PRESET} open={assignOpen} onOpenChange={setAssignOpen} />
    </div>
  );
}

function LeakNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Line not found</p>
      <Link to="/leakage-map" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to the map
      </Link>
    </div>
  );
}

/** LK04 (`delivery-fee-checkout`) and LK10 (`adopt-depth`) — the map's only two built `:id` reference rows, same "one/two reference rows" pattern as every prior section. */
const LeakDetailRoute = () => {
  const { id } = useParams();

  if (id === "delivery-fee-checkout") return <DeliveryFeeDetail />;
  if (id === "adopt-depth") return <AdoptDepthDetail />;
  return <LeakNotFound />;
};

export default LeakDetailRoute;
