import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { MK11_HERO, MK11_ROWS, MK_CHIP_TONE } from "@/pages/agents/marketplace/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** MK11 — /marketplace/installed/update. */
const UpdateRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Marketplace", to: "/marketplace" }, { label: "Installed", to: "/marketplace/installed" }, { label: "Update" }]}
        title="An update that needs approval"
        subtitle="One new field · the agent paused itself rather than read something unapproved"
        action={
          <Button type="button" onClick={() => toast.success("Change reviewed. Send approval from Governance")}>
            Review the change
          </Button>
        }
      />

      <div className="relative overflow-hidden rounded-card border border-amber-border bg-amber-bg p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{MK11_HERO.leftLabel}</p>
            <p className="mt-2 text-[26px] font-semibold text-ink">{MK11_HERO.leftBig}</p>
            <p className="mt-1.5 max-w-md text-[11px] text-ink-3">{MK11_HERO.sub}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{MK11_HERO.rightLabel}</p>
            <p className="mt-2 text-[20px] font-semibold text-ink">{MK11_HERO.rightBig}</p>
            <p className="mt-1.5 font-mono text-[10px] font-semibold text-amber">{MK11_HERO.rightSub}</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What changed, and what it means here</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}></th>
                <th className={HEAD_CLASS}>Before</th>
                <th className={HEAD_CLASS}>After</th>
                <th className={`${HEAD_CLASS} text-right`}>Needs approval?</th>
              </tr>
            </thead>
            <tbody>
              {MK11_ROWS.map((row) => (
                <tr key={row.field} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.field}</td>
                  <td className="px-4 py-3 text-ink-4">{row.before}</td>
                  <td className="px-4 py-3 text-ink-2">{row.after}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={MK_CHIP_TONE[row.needsApprovalTone]}>{row.needsApproval}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="It paused itself rather than reading a field nobody had approved">
        The publisher shipped an update that asks for the send channel — a reasonable change that would make it
        catch email resends as well as push. It is a new field, so the agent stopped and waited instead of taking
        it. An installed agent whose data access grows quietly is the specific risk a marketplace introduces, and
        this is the whole mitigation.
      </Callout>

      <Callout tone="amber" title="A cost change of ₦10 a month does not need approval and a new field does">
        The distinction is what it can see, not what it costs. Governance holds a budget for the total and would
        flag a material jump; a tenth of a naira a run is not a governance event. Reading one more column about
        every send this company makes is.
      </Callout>
    </div>
  );
};

export default UpdateRoute;
