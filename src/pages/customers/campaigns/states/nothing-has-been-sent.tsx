import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { CP01_PROPOSAL_ROWS, CP_TONE_CLASS } from "@/pages/customers/campaigns/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CP01 — before any campaign has been sent. Wired but unreachable with CAMPAIGNS_STATE's current default. */
export function NothingHasBeenSentState() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Campaigns</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Three proposals · one ready · nothing sent, and no agent can send it</p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">Nothing has been sent to anybody</h2>
        <p className="mx-auto mt-3 max-w-2xl text-[11.5px] leading-relaxed text-ink-3">
          Three rooms are open and two have a proposal in them. A campaign reaches real people, so it needs a room,
          a cohort, a holdout, guardrails and one named person who approves it with a re-authentication. None of
          those chains is complete yet.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={() => toast.info("Three proposals listed below")}>
            See the proposals
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/campaigns/new")}>
            What a campaign needs
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          No agent can send. There is no permission level in this product that grants it.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What is proposed, and what each one is still missing</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Proposal</th>
                <th className={`${HEAD_CLASS} text-right`}>From</th>
                <th className={`${HEAD_CLASS} text-right`}>Room</th>
                <th className={HEAD_CLASS}>Missing</th>
                <th className={`${HEAD_CLASS} text-right`}>Who would approve</th>
              </tr>
            </thead>
            <tbody>
              {CP01_PROPOSAL_ROWS.map((row) => (
                <tr key={row.proposal} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.proposal}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="flex items-center justify-end gap-1.5 whitespace-nowrap text-ink-2">
                      <PersonAvatar kind="agent" initials={row.fromAgent.initials} size="sm" />
                      {row.fromAgent.name}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-mono ${CP_TONE_CLASS[row.roomTone]}`}>{row.room}</td>
                  <td className="px-4 py-3 text-ink-3">{row.missing}</td>
                  <td className={`px-4 py-3 text-right ${CP_TONE_CLASS[row.approverTone]}`}>{row.approver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="An agent can propose a campaign and can never send one">
        All three of these were written by agents, with audiences, copy and reasoning attached. Not one of them can
        leave this screen without a person re-authenticating against it. That is a property of how the product is
        built rather than a setting somebody could relax on a busy Friday.
      </Callout>
    </div>
  );
}
