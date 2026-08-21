import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { RP01_SOURCE_ROWS, RP_TONE_CLASS } from "@/pages/customers/replies/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** RP01 — before anything has been sent, so nothing has come back. Wired but unreachable with REPLIES_STATE's current default. */
export function NobodyHasWrittenBackState() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Replies</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Nothing sent, so nothing received · four routes, all ending at a person</p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">Nobody has written back, because nothing has been sent</h2>
        <p className="mx-auto mt-3 max-w-2xl text-[11.5px] leading-relaxed text-ink-3">
          This is the only screen in Flolyt where a message goes to one named person. It fills when a customer
          replies to something the company sent, or writes in of their own accord. Both are conversations, which
          is why they live here and not in Campaigns.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={() => toast.info("Nothing is running yet · the table below shows where a reply would go")}>
            See what is running
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/replies/use")}>
            How replies are handled
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          A reply is answered by a person. An agent may draft, and the send button is never theirs.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where a reply will come from, and where it will go</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Source</th>
                <th className={HEAD_CLASS}>What it is</th>
                <th className={`${HEAD_CLASS} text-right`}>Routes to</th>
                <th className={`${HEAD_CLASS} text-right`}>Who answers</th>
              </tr>
            </thead>
            <tbody>
              {RP01_SOURCE_ROWS.map((row) => (
                <tr key={row.source} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.source}</td>
                  <td className="px-4 py-3 text-ink-3">{row.whatItIs}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.routesTo}</td>
                  <td className={`px-4 py-3 text-right ${RP_TONE_CLASS[row.whoAnswersTone]}`}>{row.whoAnswers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The fourth row exists because somebody in a holdout can still write to you">
        They received nothing and may still have something to say — about a fee, an order, or the silence itself.
        Answering them does not contaminate anything, because a reply is not a treatment. It is recorded on the
        experiment as a contact so that nobody later wonders whether the held group was truly untouched.
      </Callout>
    </div>
  );
}
