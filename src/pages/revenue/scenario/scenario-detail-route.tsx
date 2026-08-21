import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { DEPARTMENT_COLORS, EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { ChangeAnAssumptionModal } from "@/pages/revenue/scenario/modals/change-an-assumption-modal";
import { TurnItIntoSomethingModal } from "@/pages/revenue/scenario/modals/turn-it-into-something-modal";
import type { PersonRef } from "@/pages/everyday/rooms/types";
import {
  SC_KPI_TONE,
  SC_TONE_CLASS,
  S114_STATS,
  S114_TIMELINE,
  S114_WHERE_KV,
  S131_STATS,
  S131_BECOME,
} from "@/pages/revenue/scenario/data";
import { ScenarioKvList } from "@/pages/revenue/scenario/kv-list";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function S114Detail() {
  const [changeOpen, setChangeOpen] = useState(false);

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Scenario", to: "/scenario" }, { label: "S-114" }]}
        title="S-114 · Reverse the delivery fee"
        subtitle="₦188M – ₦512M · two assumptions changed since it was saved · never acted on"
        action={
          <div className="flex flex-wrap gap-2.5">
            <Button type="button" variant="outline" onClick={() => setChangeOpen(true)}>
              Change an assumption
            </Button>
            <Button type="button">Re-run</Button>
          </div>
        }
      />

      <KpiCards items={S114_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: SC_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What has happened to it since it was saved</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>When</th>
                <th className={HEAD_CLASS}>What</th>
                <th className={HEAD_CLASS}>Who</th>
                <th className={HEAD_CLASS}>Effect on the range</th>
              </tr>
            </thead>
            <tbody>
              {S114_TIMELINE.map((row, i) => (
                <tr key={`${row.when}-${i}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                      {row.whoKind === "human" ? (
                        <PersonAvatar
                          kind="human"
                          initials={row.who.initials}
                          size="sm"
                          style={{ backgroundColor: DEPARTMENT_COLORS[(row.who as PersonRef).department] }}
                        />
                      ) : (
                        <PersonAvatar kind="agent" initials={row.who.initials} size="sm" />
                      )}
                      {row.who.name.split(" ")[0]}
                    </span>
                  </td>
                  <td className={`px-4 py-3 ${SC_TONE_CLASS[row.effectTone]}`}>{row.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="An agent refreshed one input and a person changed another, and both are on the same list">
        Price &amp; Margin can update a figure it owns — the trailing order value — and cannot touch an assumption a
        person set. Zainab widened the recovery window because she disagreed with it, and her name is on the change
        rather than the model quietly improving itself overnight. Anyone who read this scenario eleven days ago is
        looking at a different low end now and can see exactly why.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where it has gone</p>
        <ScenarioKvList rows={S114_WHERE_KV} />
      </section>

      <ChangeAnAssumptionModal open={changeOpen} onOpenChange={setChangeOpen} />
    </div>
  );
}

function S131Detail() {
  const [promoteOpen, setPromoteOpen] = useState(false);

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Scenario", to: "/scenario" }, { label: "S-131" }]}
        title="S-131 · Reactivation wave three"
        subtitle="₦31M – ₦58M · 52,000 customers · waiting on Ada"
        action={
          <Button type="button" onClick={() => setPromoteOpen(true)}>
            What this can become
          </Button>
        }
      />

      <KpiCards items={S131_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: SC_KPI_TONE[s.tone] }))} />

      <Callout tone="amber" title="Wave three is 52,000 and the standing authority stops at 50,000">
        Neither the scenario nor the play it could become will round it down to 49,999. It waits for Ada, and the
        wait costs ₦2.1M a day.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this scenario can become</p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {S131_BECOME.map((row) => (
            <div key={row.label} className="flex items-start gap-3 px-3.5 py-3">
              <span
                className={`mt-0.5 size-2.5 shrink-0 rounded-full ${row.blocked ? "bg-rose" : row.on ? "bg-ultra" : "border border-line"}`}
                aria-hidden
              />
              <span className="min-w-0">
                <span className={`block text-[12px] font-semibold ${row.blocked ? "text-ink-4" : "text-ink"}`}>{row.label}</span>
                <span className="mt-0.5 block text-[10.5px] text-ink-4">{row.sub}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <p className="text-[11px] text-ink-3">
        The Retain room this could attach to is{" "}
        <Link to="/rooms/second-order-never-happened" className="font-semibold text-ultra hover:underline">
          Second order never happened
        </Link>
        .
      </p>

      <TurnItIntoSomethingModal open={promoteOpen} onOpenChange={setPromoteOpen} />
    </div>
  );
}

function ScenarioNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Scenario not found</p>
      <Link to="/scenario" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to scenarios
      </Link>
    </div>
  );
}

/** SC08 (`s-114`) and SC13's base (`s-131`) — the section's only two built `:id` reference rows, same "one/two reference rows" pattern as every prior section. */
const ScenarioDetailRoute = () => {
  const { id } = useParams();

  if (id === "s-114") return <S114Detail />;
  if (id === "s-131") return <S131Detail />;
  return <ScenarioNotFound />;
};

export default ScenarioDetailRoute;
