import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { PersonDot } from "@/pages/everyday/rooms/actor";
import { BM_TONE_CLASS, ME11_HERO, ME11_NOTES, ME11_ROWS } from "@/pages/knowledge/business-memory/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ME11 — /business-memory/undocumented, own header, no tab bar. Built for the one reference departure, Peter Kariuki. */
const UndocumentedRoute = () => {
  const hero = ME11_HERO;

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Business memory", to: "/business-memory" }, { label: "Not written down" }]}
        title="Not written down"
        subtitle="Peter leaves in four days · nine things only he has ever answered · none of them written"
        action={
          <Button type="button" onClick={() => toast.success("Handover session started")}>
            Start a handover session
          </Button>
        }
      />

      <div className="rounded-card border border-rose-border bg-rose-bg p-5">
        <div className="flex items-center gap-3">
          <PersonDot person={hero.person} />
          <div>
            <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-rose uppercase">
              {hero.person.name} leaves in
            </p>
            <p className="text-[22px] font-semibold text-ink">{hero.daysLeft}</p>
          </div>
        </div>
        <p className="mt-3 max-w-xl text-[11px] leading-relaxed text-ink-2">{hero.subtitle}</p>
        <div className="mt-3 flex flex-wrap gap-5 border-t border-dashed border-rose-border pt-3">
          <div>
            <p className="font-mono text-[8.5px] text-ink-4 uppercase">{hero.writtenLabel}</p>
            <p className="mt-0.5 text-[13px] font-semibold text-rose">{hero.written}</p>
          </div>
          <div>
            <p className="font-mono text-[8.5px] text-ink-4 uppercase">Last day</p>
            <p className="mt-0.5 text-[13px] font-semibold text-ink-2">{hero.lastDay}</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What has been noticed, and how</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What only he seems to know</th>
                <th className={HEAD_CLASS}>How this was noticed</th>
                <th className={`${HEAD_CLASS} text-right`}>Cited from</th>
                <th className={`${HEAD_CLASS} text-right`}>Written?</th>
                <th className={HEAD_CLASS}>Who would inherit it</th>
              </tr>
            </thead>
            <tbody>
              {ME11_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                  <td className="px-4 py-3 text-ink-3">{row.how}</td>
                  <td className={cn("px-4 py-3 text-right", BM_TONE_CLASS[row.citedFromTone])}>{row.citedFrom}</td>
                  <td className="px-4 py-3 text-right text-rose">{row.written}</td>
                  <td className="px-4 py-3 text-ink-4">{row.who}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="This list was assembled by looking at who answered questions, not by asking him">
        {ME11_NOTES.assembled}
      </Callout>

      <Callout tone="rose" title="Four days is not enough and the screen does not pretend otherwise">
        {ME11_NOTES.notEnoughTime}
      </Callout>
    </div>
  );
};

export default UndocumentedRoute;
