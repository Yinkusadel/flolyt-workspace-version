import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { RepliesTabs } from "@/pages/customers/replies/tabs";
import { MakeItEvidenceModal } from "@/pages/customers/replies/modals/make-it-evidence-modal";
import { RP05_ROWS, RP_TONE_CLASS, type ThemeRow } from "@/pages/customers/replies/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function BecameFindingCell({ row, onEvidence }: { row: ThemeRow; onEvidence: () => void }) {
  if (row.rowAction === "evidence") {
    return (
      <button
        type="button"
        onClick={onEvidence}
        className="font-mono text-[10.5px] text-rose underline decoration-dotted underline-offset-2 hover:text-rose"
      >
        {row.becameFinding}
      </button>
    );
  }
  return <span className={cn("font-mono text-[10.5px]", RP_TONE_CLASS[row.becameFindingTone])}>{row.becameFinding}</span>;
}

/** RP05 — /replies/themes. */
const RepliesThemesRoute = () => {
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Themes</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">12,800 messages in five themes · 31% of them described the ₦1.08B problem</p>
        </div>
        <Button type="button" onClick={() => toast.info("Opening the delivery-fee theme")}>
          Open a theme
        </Button>
      </div>

      <RepliesTabs active="Themes" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What people are writing about, grouped by an agent and counted</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Theme</th>
                <th className={`${HEAD_CLASS} text-right`}>Messages</th>
                <th className={`${HEAD_CLASS} text-right`}>Share</th>
                <th className={`${HEAD_CLASS} text-right`}>First seen</th>
                <th className={`${HEAD_CLASS} text-right`}>Became a finding?</th>
                <th className={`${HEAD_CLASS} text-right`}>Claim type</th>
              </tr>
            </thead>
            <tbody>
              {RP05_ROWS.map((row) => (
                <tr key={row.theme} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.theme}</td>
                  <td className={`px-4 py-3 text-right font-mono ${RP_TONE_CLASS[row.messagesTone]}`}>{row.messages}</td>
                  <td className={`px-4 py-3 text-right font-mono ${RP_TONE_CLASS[row.shareTone]}`}>{row.share}</td>
                  <td className={`px-4 py-3 text-right ${RP_TONE_CLASS[row.firstSeenTone]}`}>{row.firstSeen}</td>
                  <td className="px-4 py-3 text-right">
                    <BecameFindingCell row={row} onEvidence={() => setEvidenceOpen(true)} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.claimType === "causal" ? "ultra" : row.claimType === "association" ? "amber" : "neutral"}>
                      {row.claimType}
                    </Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Thirty-one per cent of everything written to this company in five months was about one line of code">
        3,968 people described the fee change in their own words, starting eleven days after it shipped. It became
        a finding inside Support on 21 March and reached nobody else until 2 August. This screen is the cheapest
        early-warning system in the workspace and the one nobody was reading.
      </Callout>

      <Callout tone="amber" title="The fourth row appeared on 14 August and nobody has done anything with it">
        896 people are asking why they are hearing from the company so often. That is the reactivation waves, the
        frequency cap working exactly as designed, and 896 people still finding it too much. It is not a bug and it
        is worth somebody deciding about, which is why it is counted here rather than filed as noise.
      </Callout>

      <MakeItEvidenceModal open={evidenceOpen} onOpenChange={setEvidenceOpen} />
    </div>
  );
};

export default RepliesThemesRoute;
