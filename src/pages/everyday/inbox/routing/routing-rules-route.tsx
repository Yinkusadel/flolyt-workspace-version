import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { TeamDot } from "@/pages/everyday/inbox/team-dot";
import { InboxTabs } from "@/pages/everyday/inbox/quick-links";
import { ROUTING_CLOSING_CALLOUT, ROUTING_RULES, ROUTING_STATS } from "@/pages/everyday/inbox/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const TABS = [
  { key: "rules", label: "Rules", href: "/inbox/routing" },
  { key: "decisions", label: "Recent decisions", href: "/inbox/routing?tab=decisions" },
  { key: "unroutable", label: "Unroutable · 3", href: "/inbox/routing/unroutable" },
] as const;

/** I07 — Routing, /inbox/routing. */
const RoutingRulesRoute = () => {
  const [searchParams] = useSearchParams();
  const active = searchParams.get("tab") ?? "rules";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Routing</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            How work finds a team · seven rules · one has fired twelve times and reached nobody
          </p>
        </div>
        <Button className="shrink-0" onClick={() => toast.success("Rule creation isn't wired up in this preview")}>
          New rule
        </Button>
      </div>

      <InboxTabs />

      <div className="flex items-center gap-1 overflow-x-auto">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            to={tab.href}
            className={cn(
              "shrink-0 rounded-panel px-3 py-1.5 text-[11px] whitespace-nowrap",
              active === tab.key
                ? "border border-line bg-paper font-semibold text-ink"
                : "font-normal text-ink-3 hover:text-ink-2"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[920px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>When this happens</th>
              <th className={HEAD_CLASS}>Goes to</th>
              <th className={HEAD_CLASS}>Because</th>
              <th className={HEAD_CLASS}>Fallback</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Fired this week</th>
              <th className={cn(HEAD_CLASS, "text-right")}>State</th>
            </tr>
          </thead>
          <tbody>
            {ROUTING_RULES.map((row) => (
              <tr key={row.when} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-ink-2">{row.when}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {row.goesToTeam ? (
                    <TeamDot team={row.goesToTeam} />
                  ) : (
                    <span className={row.goesToTone ? TONE_TEXT_CLASS[row.goesToTone] : "text-ink-2"}>{row.goesTo}</span>
                  )}
                </td>
                <td className={cn("px-4 py-3 whitespace-nowrap", row.becauseTone ? TONE_TEXT_CLASS[row.becauseTone] : "text-ink-3")}>
                  {row.because}
                </td>
                <td className={cn("px-4 py-3 whitespace-nowrap", row.fallbackTone ? TONE_TEXT_CLASS[row.fallbackTone] : "text-ink-3")}>
                  {row.fallback}
                </td>
                <td className={cn("px-4 py-3 text-right font-mono", row.firedTone ? TONE_TEXT_CLASS[row.firedTone] : "text-ink-4")}>
                  {row.firedThisWeek}
                </td>
                <td className="px-4 py-3 text-right">
                  <Chip tone={row.stateTone} className="ml-auto">
                    {row.state}
                  </Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Where the queue is actually forming
        </p>
        <KpiCards items={ROUTING_STATS} />
      </div>

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">{ROUTING_CLOSING_CALLOUT.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{ROUTING_CLOSING_CALLOUT.body}</p>
      </div>
    </div>
  );
};

export default RoutingRulesRoute;
