import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { SG01_OBSERVATION_ROWS, SG_TONE_CLASS } from "@/pages/customers/segments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** SG01 — before anyone has written a definition. Wired but unreachable with SEGMENTS_STATE's current default. */
export function NoSegmentsYetState() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Segments</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">4.2M customers · none grouped</p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">Nobody has defined a group yet</h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          4.2 million customer records are connected and readable. A segment is a written definition of a group —
          who is in it, who is deliberately left out, and what it is for. Until somebody writes one, there are
          customers and no groups.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={() => navigate("/segments/new")}>
            Define a segment
          </Button>
          <Button type="button" variant="outline">
            See what could be grouped
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          Agents can suggest a grouping. Only a person can define one, because a definition is a claim.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the agents have noticed, which is not the same as a segment</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Observation</th>
                <th className={HEAD_CLASS}>Agent</th>
                <th className={`${HEAD_CLASS} text-right`}>Size</th>
                <th className={HEAD_CLASS}>Would it make a segment?</th>
                <th className={HEAD_CLASS}>Why not yet</th>
              </tr>
            </thead>
            <tbody>
              {SG01_OBSERVATION_ROWS.map((row) => (
                <tr key={row.observation} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-2">{row.observation}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                      <PersonAvatar kind="agent" initials={row.agent.initials} size="sm" />
                      {row.agent.name}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-mono ${SG_TONE_CLASS[row.sizeTone]}`}>{row.size}</td>
                  <td className={`px-4 py-3 ${SG_TONE_CLASS[row.wouldSegmentTone]}`}>{row.wouldSegment}</td>
                  <td className={`px-4 py-3 ${SG_TONE_CLASS[row.whyNotTone]}`}>{row.whyNot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="An agent can find a cluster and cannot define a segment">
        A cluster is a shape in the data. A segment is a decision that the shape matters, is worth naming, and will
        be used for something — which is a claim about the business rather than about the numbers. Flolyt will hand
        a person the four observations above and will not turn any of them into a definition on its own.
      </Callout>
    </div>
  );
}
