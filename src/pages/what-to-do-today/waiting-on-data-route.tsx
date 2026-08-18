import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { KpiCards, type Kpi } from "@/pages/lifecycle/stage/kpi-cards";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { ActorAvatar } from "@/pages/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { WAITING_ON_DATA_ROWS } from "@/pages/what-to-do-today/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** T13 — items that exist but cannot be ranked/scored because their data is missing or stale. */
const WaitingOnDataRoute = () => {
  const stats: Kpi[] = [
    { eyebrow: "Items that cannot be ranked", value: "6", tone: "amber", note: "of 10 open" },
    { eyebrow: "Value behind them", value: "₦92M", tone: "rose", note: "and one is unavailable" },
    { eyebrow: "Sources that would unblock them", value: "3", tone: "teal", note: "two are one CSV each" },
    { eyebrow: "Longest blocked", value: "41 days", tone: "rose", note: "order_lines" },
  ];

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "What to do today", to: "/what-to-do-today" }, { label: "Waiting on data" }]}
        title="Waiting on data"
        subtitle="Six items cannot be ranked · three are the same missing field · one was never requested"
        action={<Button>Chase Engineering</Button>}
      />

      <KpiCards items={stats} />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What is blocked, and by exactly what
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Item</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
                <th className={HEAD_CLASS}>Blocked on</th>
                <th className={HEAD_CLASS}>Owned by</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Requested</th>
                <th className={cn(HEAD_CLASS, "text-right")}>State</th>
              </tr>
            </thead>
            <tbody>
              {WAITING_ON_DATA_ROWS.map((row) => (
                <tr key={row.item} className="border-b border-line last:border-0">
                  <td className="px-4 py-3.5 font-semibold text-ink">{row.item}</td>
                  <td className={cn("px-4 py-3.5 text-right font-mono whitespace-nowrap", row.atStakeTone ? TONE_TEXT_CLASS[row.atStakeTone] : "text-ink")}>
                    {row.atStake}
                  </td>
                  <td className="px-4 py-3.5 text-ink-3">{row.blockedOn}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {row.ownedByAgent && <ActorAvatar actor={{ kind: "agent", agent: row.ownedByAgent }} size="sm" />}
                      <span className="text-ink-2">{row.ownedByLabel}</span>
                    </div>
                  </td>
                  <td className={cn("px-4 py-3.5 text-right font-mono whitespace-nowrap", row.requestedTone ? TONE_TEXT_CLASS[row.requestedTone] : "text-ink-4")}>
                    {row.requested}
                  </td>
                  <td className={cn("px-4 py-3.5 text-right whitespace-nowrap font-mono text-[10.5px] font-semibold", TONE_TEXT_CLASS[row.badgeTone])}>
                    {row.badge}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Callout tone="rose" title="Three of these six are the same missing field">
        `order_lines` blocks margin in Price, category expansion in Expand, basket composition here and payback in
        Acquire. It has been requested once, 41 days ago, and it sits inside Engineering's 41 open obligations. One
        field, four stages, ₦92M of unrankable work.
      </Callout>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">The one nobody asked for</p>
        <div className="mt-2">
          <Callout tone="amber" title="Ghana has no delivery feed and no request has ever been filed">
            Ghana's silent failures cannot be counted, which is why its churn is the only unexplained figure in that
            stage. This is not overdue — it was never asked for. "Nobody delivered" and "nobody asked" are
            different failures and only one of them is Engineering's.
          </Callout>
        </div>
      </div>
    </div>
  );
};

export default WaitingOnDataRoute;
