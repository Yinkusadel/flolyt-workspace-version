import { Navigate, useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { PersonAvatar } from "@/components/person-avatar";
import { Chip, type ChipTone } from "@/components/ui/chip";
import { KpiCards, type Kpi } from "@/components/ui/kpi-cards";
import { getAgent, STATUS_META, type Agent, type Permission } from "@/pages/agents/data";

/**
 * Rebuilt from flolyt-figma-designs/New-pages-pattern/agents/svg/02 (RIA's detail screen — the
 * only one the export fully specifies). Every other agent shares this same shape with content
 * authored in data.ts; see that file's own note. "Edit in Governance" is dropped since Governance
 * isn't built in this pass.
 */

const PERMISSION_META: Record<Permission, { label: string; tone: ChipTone }> = {
  automatic: { label: "Automatic", tone: "teal" },
  blocked: { label: "Blocked", tone: "rose" },
  proposed: { label: "Proposed", tone: "amber" },
};

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-card border border-line bg-paper p-5 transition-shadow duration-200 hover:shadow-sm", className)}>
      {children}
    </div>
  );
}

function ItsLoop({ agent }: { agent: Agent }) {
  return (
    <Card>
      <h2 className="text-[15px] font-semibold text-ink">Its loop</h2>
      <div className="mt-3.5 space-y-3">
        {agent.loop.map((step) => (
          <div key={step.stage} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <span
              className={cn(
                "size-1.5 shrink-0 translate-y-[-1px] rounded-full",
                step.active ? "bg-ultra" : "bg-line"
              )}
            />
            <span className="text-[13px] font-semibold text-ink">{step.stage}</span>
            <span className="text-[11.5px] text-ink-3">{step.cadence}</span>
            <span className="text-[11.5px] text-ink-4">{step.description}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function WhatItReads({ agent }: { agent: Agent }) {
  return (
    <Card>
      <h2 className="text-[15px] font-semibold text-ink">What it reads</h2>
      <div className="mt-3.5 space-y-2">
        {agent.reads.map((source) => (
          <div key={source.label} className="flex items-center gap-2.5">
            <span className={cn("size-1.5 shrink-0 rounded-full", source.connected ? "bg-teal" : "bg-line")} />
            <span className={cn("text-[13px]", source.connected ? "text-ink" : "text-ink-4")}>{source.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[11.5px] text-ink-3">{agent.readsNote}</p>
    </Card>
  );
}

function WhatItMayDo({ agent }: { agent: Agent }) {
  return (
    <Card>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-[15px] font-semibold text-ink">What it may do on its own</h2>
      </div>

      <div className="mt-3.5 divide-y divide-line">
        {agent.mayDo.map((row) => {
          const meta = PERMISSION_META[row.permission];
          return (
            <div key={row.action} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <span className="text-[13px] text-ink">{row.action}</span>
              <div className="flex shrink-0 items-center gap-1.5">
                <Chip tone={meta.tone}>{meta.label}</Chip>
                {row.note && <span className="text-[11px] text-ink-4">{row.note}</span>}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[11.5px] text-ink-3">{agent.mayDoNote}</p>
    </Card>
  );
}

function RecentRooms({ agent }: { agent: Agent }) {
  return (
    <Card>
      <h2 className="text-[15px] font-semibold text-ink">Recent rooms</h2>
      {agent.recentRooms.length === 0 ? (
        <p className="mt-3.5 text-[12.5px] text-ink-3">
          {agent.status === "off" ? "Not enabled, so no rooms have been opened." : "No rooms opened yet."}
        </p>
      ) : (
        <div className="mt-3.5 divide-y divide-line">
          {agent.recentRooms.map((room) => (
            <div key={room.label} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
              <span className="text-[13px] text-ink">{room.label}</span>
              <span
                className={cn(
                  "shrink-0 text-[11.5px] font-medium",
                  room.tone === "teal" && "text-teal",
                  room.tone === "amber" && "text-amber",
                  room.tone === "neutral" && "text-ink-3"
                )}
              >
                {room.outcome}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function WhereItHasBeenWrong({ agent }: { agent: Agent }) {
  if (!agent.whereWrong) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper-2/50 p-5">
        <h2 className="text-[15px] font-semibold text-ink-3">Where it has been wrong</h2>
        <p className="mt-2 text-[12.5px] text-ink-3">Nothing disputed and upheld yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-amber-border bg-amber-bg p-5">
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-4 shrink-0 text-amber" />
        <h2 className="text-[14.5px] font-semibold text-amber">Where it has been wrong</h2>
      </div>
      <div className="mt-2.5 space-y-0.5">
        {agent.whereWrong.lines.map((line, i) => (
          <p key={i} className="text-[13px] text-amber/90">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function AgentDetailRoute() {
  const { id } = useParams();
  const agent = getAgent(id);

  if (!agent) return <Navigate to="/agents" replace />;

  usePageBreadcrumb([{ label: "Agents", to: "/agents" }, { label: agent.name }]);

  const status = STATUS_META[agent.status];
  const kpis: Kpi[] = agent.stats.map((stat) => ({
    eyebrow: stat.label,
    value: stat.value,
    tone: stat.tone,
    note: stat.note,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <PersonAvatar kind="agent" initials={agent.initials} size="lg" className="size-11 shrink-0 text-[13px]" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="font-serif text-[24px] font-normal text-ink">{agent.name}</h1>
              <span className="text-[13px] text-ink-3">{agent.subtitle}</span>
            </div>
            <p className="mt-1 max-w-3xl text-[13px] text-ink-2">{agent.description}</p>
          </div>
        </div>
        <Chip tone={status.tone} className="shrink-0 px-2.5 py-1 text-[11px]">
          {status.label}
        </Chip>
      </div>

      <KpiCards items={kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <ItsLoop agent={agent} />
        <WhatItReads agent={agent} />
      </div>

      <WhatItMayDo agent={agent} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <RecentRooms agent={agent} />
        <WhereItHasBeenWrong agent={agent} />
      </div>
    </div>
  );
}
