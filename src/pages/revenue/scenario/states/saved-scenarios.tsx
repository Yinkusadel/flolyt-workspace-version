import { useState } from "react";
import { Link } from "react-router-dom";
import { Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { DEPARTMENT_COLORS, EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { ScenarioKvList } from "@/pages/revenue/scenario/kv-list";
import { ScenarioTabs } from "@/pages/revenue/scenario/tabs";
import { ShareAScenarioModal } from "@/pages/revenue/scenario/modals/share-a-scenario-modal";
import { SC03_KV_ROWS, SC03_ROWS, SC_CHIP_TONE, SC_STATUS_TONE, SC_TONE_CLASS } from "@/pages/revenue/scenario/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SC03 — the default populated "Saved scenarios" state, and the reference table SC08's modals link back to. */
export function SavedScenariosState() {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Scenario</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Six modelled · two blocked on data · one has been overtaken by what actually happened
          </p>
        </div>
        <Button asChild type="button" size="sm">
          <Link to="/scenario/new">Model a change</Link>
        </Button>
      </div>

      <ScenarioTabs active="Saved" />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[900px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Scenario</th>
              <th className={HEAD_CLASS}>Change</th>
              <th className={`${HEAD_CLASS} text-right`}>Range</th>
              <th className={`${HEAD_CLASS} text-right`}>Profit</th>
              <th className={`${HEAD_CLASS} text-right`}>Confidence</th>
              <th className={HEAD_CLASS}>State</th>
              <th className={HEAD_CLASS}>Owner</th>
              <th className={HEAD_CLASS} />
            </tr>
          </thead>
          <tbody>
            {SC03_ROWS.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <Link to={`/scenario/${row.id.toLowerCase()}`} className="font-semibold text-ultra hover:underline">
                    {row.id}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-2">{row.change}</td>
                <td className={`px-4 py-3 text-right font-mono ${SC_TONE_CLASS[row.rangeTone]}`}>{row.range}</td>
                <td className={`px-4 py-3 text-right font-mono ${SC_TONE_CLASS[row.profitTone]}`}>{row.profit}</td>
                <td className={`px-4 py-3 text-right ${SC_TONE_CLASS[row.confidenceTone]}`}>{row.confidence}</td>
                <td className="px-4 py-3">
                  <Chip tone={SC_CHIP_TONE[SC_STATUS_TONE[row.status]]}>{row.status}</Chip>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                    <PersonAvatar kind="human" initials={row.owner.initials} size="sm" style={{ backgroundColor: DEPARTMENT_COLORS[row.owner.department] }} />
                    {row.owner.name.split(" ")[0]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {row.canShare && (
                    <button
                      type="button"
                      onClick={() => setShareOpen(true)}
                      className="text-ink-4 transition-colors hover:text-ultra"
                      aria-label={`Share ${row.id}`}
                    >
                      <Share2 className="size-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="ultra" title="Six scenarios, three usable ranges, one that has since been overtaken by reality">
        S-089 was modelled in March at ₦18M to ₦44M and then actually run. It recovered ₦31M. That is the only row
        here anybody can check, and it is kept on the list permanently for exactly that reason — a scenario tool
        with no record of how its ranges turned out is a tool that never has to be right.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What a scenario is not, restated on the list rather than buried in the detail</p>
        <ScenarioKvList rows={SC03_KV_ROWS} />
      </section>

      <ShareAScenarioModal open={shareOpen} onOpenChange={setShareOpen} />
    </div>
  );
}
