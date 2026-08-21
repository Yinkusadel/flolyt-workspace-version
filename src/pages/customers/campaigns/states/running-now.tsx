import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { cn } from "@/lib/utils";
import { DEPARTMENT_COLORS, EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip, CHIP_INTERACTIVE_CLASS } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { CampaignsTabs } from "@/pages/customers/campaigns/tabs";
import { StopACampaignModal } from "@/pages/customers/campaigns/modals/stop-a-campaign-modal";
import { CP03_ROWS, CP03_STATS, CP_CHIP_TONE, CP_KPI_TONE, CP_TONE_CLASS, type ApprovedBy, type CampaignRow } from "@/pages/customers/campaigns/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function ApprovedByCell({ approvedBy }: { approvedBy: ApprovedBy }) {
  if (approvedBy.kind === "person") {
    return (
      <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
        <PersonAvatar
          kind="human"
          initials={approvedBy.person.initials}
          size="sm"
          style={{ backgroundColor: DEPARTMENT_COLORS[approvedBy.person.department] }}
        />
        {approvedBy.person.name.split(" ")[0]}
      </span>
    );
  }
  return <span className={CP_TONE_CLASS[approvedBy.tone]}>{approvedBy.label}</span>;
}

function StateCell({ row, onStop }: { row: CampaignRow; onStop: () => void }) {
  if (row.rowAction === "stop") {
    return (
      <button type="button" onClick={onStop}>
        <Chip tone={CP_CHIP_TONE[row.stateTone]} className={CHIP_INTERACTIVE_CLASS}>
          {row.state}
        </Chip>
      </button>
    );
  }
  return <Chip tone={CP_CHIP_TONE[row.stateTone]}>{row.state}</Chip>;
}

/** CP03 — the default populated "Running now" state, and /campaigns' index tab. */
export function RunningNowState() {
  const navigate = useNavigate();
  const [stopOpen, setStopOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Campaigns</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Six running · five under a holdout · one held by a guardrail nobody has answered</p>
        </div>
        <Button type="button" onClick={() => navigate("/campaigns/new")}>
          New campaign
        </Button>
      </div>

      <CampaignsTabs active="Running" />

      <KpiCards items={CP03_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: CP_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Running now</p>

        <div className="hidden overflow-x-auto rounded-card border border-line bg-paper md:block">
          <table className="w-full min-w-[960px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Campaign</th>
                <th className={HEAD_CLASS}>Room</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Audience</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Held</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Day</th>
                <th className={HEAD_CLASS}>State</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Approved by</th>
              </tr>
            </thead>
            <tbody>
              {CP03_ROWS.map((row) => (
                <tr key={row.campaign} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">
                    {row.id ? (
                      <Link to={`/campaigns/${row.id}`} className="text-ultra hover:underline">
                        {row.campaign}
                      </Link>
                    ) : (
                      <span className="text-ink-2">{row.campaign}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.room}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", CP_TONE_CLASS[row.audienceTone])}>{row.audience}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", CP_TONE_CLASS[row.heldTone])}>{row.held}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.day}</td>
                  <td className="px-4 py-3">
                    <StateCell row={row} onStop={() => setStopOpen(true)} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end">
                      <ApprovedByCell approvedBy={row.approvedBy} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2.5 md:hidden">
          {CP03_ROWS.map((row) => (
            <div key={row.campaign} className="rounded-card border border-line bg-paper p-3.5">
              <div className="flex items-baseline justify-between gap-3">
                {row.id ? (
                  <Link to={`/campaigns/${row.id}`} className="text-[12.5px] font-semibold text-ultra hover:underline">
                    {row.campaign}
                  </Link>
                ) : (
                  <span className="text-[12.5px] font-semibold text-ink">{row.campaign}</span>
                )}
                <span className={cn("font-mono text-[11.5px] font-semibold", CP_TONE_CLASS[row.audienceTone])}>{row.audience}</span>
              </div>
              <p className="mt-1 text-[10.5px] text-ink-4">{row.room}</p>
              <div className="mt-1.5 flex items-center justify-between gap-3">
                <StateCell row={row} onStop={() => setStopOpen(true)} />
                <ApprovedByCell approvedBy={row.approvedBy} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <Callout tone="amber" title="Wave three is held at 52,000 and no person has been asked to unblock it yet">
        Ada&apos;s standing authority covers reactivation with no offer, under 50,000, Nigeria only. Wave three is
        52,000. The agent did not round down to 49,999 and did not split it into two sends, because a standing
        authority that can be satisfied by re-shaping the request is not a limit — it is a suggestion. It waits for
        Ada, and the wait costs ₦2.1M a day.
      </Callout>

      <Callout tone="rose" title="One row will never have a holdout and it is marked, not excused">
        The Lagos refund reached everyone whose order failed, because withholding an apology from 310 people to
        measure the other 3,100 was refused by Amara on the day. Its result is in the ledger as recovered and
        flagged as unmeasured incrementality — two facts, kept apart.
      </Callout>

      <StopACampaignModal open={stopOpen} onOpenChange={setStopOpen} />
    </div>
  );
}
