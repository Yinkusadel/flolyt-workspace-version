import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { ExperimentsKvList } from "@/pages/customers/experiments/kv-list";
import { XP04_DESIGN_ROWS, XP04_KV_ROWS, XP07_DESIGN_ROWS, XP07_KV_ROWS } from "@/pages/customers/experiments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function KenyaRetryDetail() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Experiments", to: "/experiments" }, { label: "Kenya retry window" }]}
        title="Kenya retry window"
        subtitle="+44.3 points · nine days · nothing in the design changed after it was signed"
        action={
          <Button type="button" onClick={() => toast.success("Closed · credited to Kenya retry window")}>
            Close and credit
          </Button>
        }
      />

      <div className="rounded-card border border-teal-border bg-teal-bg p-5">
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-teal uppercase">Treated against held · day 9 of 9</p>
        <p className="mt-2 text-[28px] font-semibold text-ink">+44.3 pts</p>
        <p className="mt-1.5 max-w-xl text-[11px] leading-relaxed text-ink-2">
          68.4% of 4,410 treated recovered. 24.1% of 490 held recovered. It closes today.
        </p>
        <div className="mt-3 border-t border-dashed border-teal-border pt-3">
          <p className="font-mono text-[8.5px] text-ink-4 uppercase">Attributable</p>
          <p className="mt-0.5 text-[13px] font-semibold text-teal">KES 1.0M · observed KES 1.1M</p>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The design, as it was registered on 9 August</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[680px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Field</th>
                <th className={HEAD_CLASS}>What was written</th>
                <th className={`${HEAD_CLASS} text-right`}>Changed since?</th>
              </tr>
            </thead>
            <tbody>
              {XP04_DESIGN_ROWS.map((row) => (
                <tr key={row.field} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.field}</td>
                  <td className="px-4 py-3 text-ink-3">{row.written}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.changed ? "amber" : "teal"}>{row.changed ? "yes" : "no"}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="teal" title="Nothing on this screen has changed since it was written, and that is what makes the number worth having">
        A design that can be edited while it runs produces a result shaped by whoever was watching. Every field
        here is locked from the moment Ravi re-authenticated. The one thing that could have stopped it early was
        the failure condition, and it never came close.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the 490 held customers experienced</p>
        <ExperimentsKvList rows={XP04_KV_ROWS} />
      </section>
    </div>
  );
}

function WeekendCadenceDetail() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Experiments", to: "/experiments" }, { label: "Weekend push cadence" }]}
        title="Weekend push cadence"
        subtitle="18% fewer unsubscribes and nothing anybody can claim · the rule it produced is the whole return"
        action={
          <Button type="button" onClick={() => toast.info("Opening the rule this produced")}>
            Read the rule
          </Button>
        }
      />

      <div className="rounded-card border border-rose-border bg-rose-bg p-5">
        <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-rose uppercase">The experiment that was not one</p>
        <p className="mt-2 text-[28px] font-semibold text-ink">₦12M</p>
        <p className="mt-1.5 max-w-xl text-[11px] leading-relaxed text-ink-2">
          The cadence changed for everyone at once in March. Nothing was held back, so nothing can be claimed.
        </p>
        <div className="mt-3 border-t border-dashed border-rose-border pt-3">
          <p className="font-mono text-[8.5px] text-ink-4 uppercase">Attributable</p>
          <p className="mt-0.5 text-[13px] font-semibold text-rose">Unavailable · no group to compare against</p>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What was written down before it ran, and what was not</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Field</th>
                <th className={HEAD_CLASS}>What exists</th>
                <th className={`${HEAD_CLASS} text-right`}>Present?</th>
                <th className={HEAD_CLASS}>Consequence</th>
              </tr>
            </thead>
            <tbody>
              {XP07_DESIGN_ROWS.map((row) => (
                <tr key={row.field} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.field}</td>
                  <td className="px-4 py-3 text-ink-3">{row.whatExists}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.present ? "teal" : "rose"}>{row.present ? "yes" : "no"}</Chip>
                  </td>
                  <td className={`px-4 py-3 ${row.consequence === "—" ? "text-ink-4" : "text-amber"}`}>{row.consequence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Unsubscribes fell 18% and the honest answer is that nobody knows why">
        March contained a cadence change, a delivery-fee release, a Ramadan period and a competitor's promotion.
        All 310,000 customers experienced all four. The 18% is real and its cause is unknowable, and the room
        closed as unmeasurable rather than claiming the number that was sitting there.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What it would have taken, and what it would have cost</p>
        <ExperimentsKvList rows={XP07_KV_ROWS} />
      </section>
    </div>
  );
}

function ExperimentNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Experiment not found</p>
      <Link to="/experiments" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to experiments
      </Link>
    </div>
  );
}

/** XP04/XP07 (`kenya-retry`, `weekend-cadence`) — the two built `:id` reference rows, same "one/two reference rows" pattern as every prior section. */
const ExperimentDetailRoute = () => {
  const { id } = useParams();

  if (id === "kenya-retry") return <KenyaRetryDetail />;
  if (id === "weekend-cadence") return <WeekendCadenceDetail />;
  return <ExperimentNotFound />;
};

export default ExperimentDetailRoute;
