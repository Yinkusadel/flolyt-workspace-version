import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { PersonDot } from "@/pages/everyday/rooms/actor";
import { RecognitionTabs } from "@/pages/knowledge/recognition/tabs";
import { AMARA, RC11_LENS, RC11_NOTES, RC_TONE_CLASS, YOUR_RECOGNITION_ROWS } from "@/pages/knowledge/recognition/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** RC11 — /recognition?as=me, a viewing-as lens on Amara Okeke's own recognitions. */
export function YoursLensState() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Recognition</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Four acts · no count, no rank, no comparison, and no number anywhere on the screen
          </p>
        </div>
        <Button type="button" onClick={() => navigate("/recognition/new")}>
          Recognise somebody
        </Button>
      </div>

      <RecognitionTabs active="Yours" />

      <div className="rounded-card border border-line bg-paper-2 p-4">
        <div className="flex items-start gap-3">
          <PersonDot person={AMARA} />
          <div>
            <p className="text-[13px] font-semibold text-ink">
              {RC11_LENS.name} · {RC11_LENS.team}
            </p>
            <p className="mt-0.5 font-mono text-[9.5px] text-ink-4">{RC11_LENS.sub}</p>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-3">{RC11_LENS.body}</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Recognised</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What you did</th>
                <th className={`${HEAD_CLASS} text-right`}>Recognised by</th>
                <th className={`${HEAD_CLASS} text-right`}>When</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={`${HEAD_CLASS} text-right`}>What it cost</th>
              </tr>
            </thead>
            <tbody>
              {YOUR_RECOGNITION_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.recognisedBy}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className={cn("px-4 py-3 text-right", RC_TONE_CLASS[row.costTone])}>{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Naming the fee correctly in March is recognised and it did not help anybody at the time">
        {RC11_NOTES.namingFee}
      </Callout>

      <Callout tone="ultra" title="This screen has no number on it and will not get one">
        {RC11_NOTES.noNumber}
      </Callout>
    </div>
  );
}
