import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { PersonAvatar } from "@/components/person-avatar";
import { type Kpi } from "@/components/ui/kpi-cards";
import { AGENTS, MAESTRO, STATUS_META, countByStatus, type Agent } from "@/pages/agents/data";

/**
 * Rebuilt from flolyt-figma-designs/New-pages-pattern/agents/svg/01. The export's Registry /
 * Governance / Conflicts tab bar is dropped — only Registry is built, so this is a single flat
 * page, no tabs. See data.ts's own note for what's authored vs. sourced from the export.
 */

function MaestroOverview() {
  const kpis: Kpi[] = [
    { eyebrow: "Routed today", value: MAESTRO.stats.routedToday, tone: "ink" },
    { eyebrow: "Conflicts open", value: MAESTRO.stats.conflictsOpen, tone: MAESTRO.stats.conflictsOpen === "0" ? "ink" : "amber" },
    { eyebrow: "Escalated to you", value: MAESTRO.stats.escalatedToYou, tone: MAESTRO.stats.escalatedToYou === "0" ? "ink" : "amber" },
  ];

  return (
    <div className="rounded-card border border-ultra-border bg-ultra-bg p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <PersonAvatar kind="agent" initials={MAESTRO.initials} size="lg" className="size-11 text-[13px]" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-semibold text-ink">{MAESTRO.name}</h2>
              <span className="text-[12px] text-ink-3">{MAESTRO.domain}</span>
            </div>
            <p className="mt-0.5 text-[13px] text-ink-2">{MAESTRO.description}</p>
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-3 gap-6 sm:gap-8">
          {kpis.map((kpi) => (
            <div key={kpi.eyebrow} className="text-center sm:text-right">
              <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-3 uppercase">{kpi.eyebrow}</p>
              <p
                className={cn(
                  "mt-1 text-[20px] font-semibold",
                  kpi.tone === "amber" ? "text-amber" : "text-ink"
                )}
              >
                {kpi.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const status = STATUS_META[agent.status];
  const isOff = agent.status === "off";

  return (
    <Link
      to={`/agents/${agent.id}`}
      className={cn(
        "group animate-fade-in-up rounded-card border p-4 transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-ink-4 hover:shadow-md",
        isOff ? "border-line bg-paper-2/60" : "border-line bg-paper"
      )}
      style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <PersonAvatar
            kind="agent"
            initials={agent.initials}
            className={cn("transition-transform duration-200 group-hover:scale-105", isOff && "opacity-60")}
          />
          <div>
            <p className={cn("text-[14px] font-semibold", isOff ? "text-ink-3" : "text-ink group-hover:text-ultra")}>
              {agent.name}
            </p>
            <p className="text-[11px] text-ink-3">{agent.domain}</p>
          </div>
        </div>
        <Chip tone={status.tone}>{status.label}</Chip>
      </div>

      <p className="mt-3 text-[12px] text-ink-2">{agent.blurb}</p>

      <p
        className={cn(
          "mt-2 flex items-center gap-1.5 text-[11px]",
          agent.cardNoteTone === "amber" ? "text-amber" : "text-ink-4"
        )}
      >
        {agent.cardNoteTone === "amber" && <span className="size-1.5 shrink-0 rounded-full bg-amber" />}
        {agent.cardNote}
      </p>
    </Link>
  );
}

function BringYourOwnAgent() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-ink">Bring your own agent</h3>
          <p className="mt-1 max-w-2xl text-[12.5px] text-ink-3">
            Import from Claude or OpenAI, or build one against the agent API. It registers with Maestro and inherits
            exactly the same governance as the thirteen.
          </p>
        </div>
        <Button variant="outline" disabled title="Coming soon" className="shrink-0">
          Add an agent
        </Button>
      </div>
    </div>
  );
}

export default function Agents() {
  const working = countByStatus("working");
  const total = AGENTS.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Agents</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Maestro orchestrates · thirteen specialists do the work · {working} of {total} working
        </p>
      </div>

      <MaestroOverview />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">The thirteen</p>
          <p className="text-[11.5px] text-ink-3">
            {working} on · {countByStatus("blocked")} blocked · {countByStatus("off")} off
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
        </div>
      </div>

      <BringYourOwnAgent />
    </div>
  );
}
