import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { GV05_CARDS, GV05_ROWS, GV_CHIP_TONE, GV_TONE_CLASS } from "@/pages/agents/governance/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const CARD_ACCENT_CLASS: Record<string, string> = {
  ai: "border-ultra-border bg-ultra-bg",
  warn: "border-amber-border bg-amber-bg",
  ok: "border-teal-border bg-teal-bg",
};

/** GV05 — /governance/capability, "proving the negative". */
const CapabilityRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Governance", to: "/governance" }, { label: "Can an agent act?" }]}
        title="Can an agent act?"
        subtitle="Eight tools · four absent from every agent identity · absent, not disabled"
        action={
          <Button type="button" onClick={() => toast.success("Tool list exported")}>
            Export the tool list
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {GV05_CARDS.map((card) => (
          <div key={card.eyebrow} className={`flex flex-col rounded-card border p-4 ${CARD_ACCENT_CLASS[card.tone] ?? "border-line bg-paper"}`}>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.7px] text-ink-4 uppercase">{card.eyebrow}</p>
            <p className="mt-1.5 text-[14px] font-semibold text-ink">{card.heading}</p>
            <p className="mt-1.5 flex-1 text-[11px] leading-relaxed text-ink-2">{card.body}</p>
            <p className={`mt-2.5 border-t border-dashed border-line pt-2 font-mono text-[10px] font-semibold ${GV_TONE_CLASS[card.tone]}`}>
              {card.footer}
            </p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What an agent identity can call · the complete list</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Tool</th>
                <th className={HEAD_CLASS}>What it does</th>
                <th className={`${HEAD_CLASS} text-right`}>Available to agents</th>
                <th className={`${HEAD_CLASS} text-right`}>Available to people</th>
              </tr>
            </thead>
            <tbody>
              {GV05_ROWS.map((row) => (
                <tr key={row.tool} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-ink">{row.tool}</td>
                  <td className="px-4 py-3 text-ink-3">{row.does}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={GV_CHIP_TONE[row.agentsTone]}>{row.agents}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={GV_CHIP_TONE[row.peopleTone]}>{row.people}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Absent is a different word from disabled and the distinction is the whole page">
        A disabled capability is one configuration change away from being enabled, usually by an administrator,
        often at three in the morning during an incident. These tools are not in the list an agent identity is
        issued, so there is no setting, no plan and no support ticket that turns them on. `source.write` is absent
        for everybody, including Ada.
      </Callout>

      <Callout tone="teal" title="This is the screen to send to somebody who does not believe the rest of the product">
        Every other section asserts what agents cannot do. This one is eight rows and a column, and it can be
        checked in about thirty seconds by somebody who has never seen Flolyt before. The absence of a send tool is
        a stronger statement than four hundred thousand entries of it not being used.
      </Callout>
    </div>
  );
};

export default CapabilityRoute;
