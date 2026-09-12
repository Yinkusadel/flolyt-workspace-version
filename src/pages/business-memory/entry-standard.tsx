import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Flag, ShieldAlert } from "lucide-react";

import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { PersonAvatar } from "@/components/person-avatar";
import { KpiCards, type Kpi } from "@/components/ui/kpi-cards";
import { EVIDENCE_TIER_LABEL, EVIDENCE_TIER_TONE, type MemoryEntry } from "@/pages/business-memory/data";

const CONTROL_TILE_TONE: Record<MemoryEntry["control"]["status"], Kpi["tone"]> = {
  healthy: "teal",
  decaying: "amber",
  "no-control": "rose",
  unavailable: "ink",
};

function Section({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{eyebrow}</p>
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  );
}

function ControlCallout({ entry }: { entry: MemoryEntry }) {
  if (entry.control.status === "no-control") {
    return (
      <div className="rounded-card border border-dashed border-rose-border bg-rose-bg/40 p-4">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-rose" />
          <div>
            <p className="text-[13.5px] font-semibold text-rose">No control was designed for this fix</p>
            <p className="mt-1 text-[12px] text-rose/90">
              Nothing watches for this to happen again. If the same pattern reappears, a room will have to
              rediscover it from scratch.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-teal-border bg-teal-bg p-4">
      <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-teal uppercase">The control</p>
      <p className="mt-2 text-[13.5px] text-teal">{entry.control.badgeLabel} control · watches for this pattern</p>
      <p className="mt-1 text-[11.5px] text-teal/80">Owned by the team that shipped the fix.</p>
    </div>
  );
}

export function EntryStandard({ entry }: { entry: MemoryEntry }) {
  usePageBreadcrumb([{ label: "Business memory", to: "/business-memory" }, { label: entry.title }]);

  const kpis: Kpi[] = [
    {
      eyebrow: "Preserved",
      value: entry.preserved ?? "Unavailable",
      tone: entry.preserved ? "teal" : "ink",
      note: `vs ${entry.measuredAgainst}`,
    },
    { eyebrow: "Measured against", value: entry.measuredAgainst, tone: "ink" },
    { eyebrow: "Control", value: entry.control.badgeLabel, tone: CONTROL_TILE_TONE[entry.control.status] },
    { eyebrow: "Recurrence", value: entry.recurrence ?? "Too early to tell", tone: "ink" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-[17px] font-semibold text-ink">{entry.title}</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Closed {entry.closedFull} · open {entry.openDays} days
            {entry.openedBy ? ` · opened by ${entry.openedBy.name}` : ""} · cited {entry.citedCount} time
            {entry.citedCount === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/rooms">Open room</Link>
          </Button>
          <Button asChild>
            <Link to={entry.id === "room-2412" ? "/playbooks/new" : "/playbooks"}>Promote to playbook</Link>
          </Button>
        </div>
      </div>

      <KpiCards items={kpis} />

      {entry.whatBroke && (
        <Section eyebrow="What broke">
          <p className="text-[13px] text-ink-2">{entry.whatBroke}</p>
        </Section>
      )}

      {entry.evidence && (
        <Section eyebrow="What the evidence said">
          <div className="space-y-2.5 rounded-card border border-line bg-paper p-4">
            {entry.evidence.map((row, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-line pb-2.5 last:border-0 last:pb-0">
                <Chip tone={EVIDENCE_TIER_TONE[row.tier]} className="mt-0.5 shrink-0">
                  {EVIDENCE_TIER_LABEL[row.tier]}
                </Chip>
                <p className="text-[13px] text-ink-2">{row.text}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {entry.triedFirst && (
        <Section eyebrow="What was tried first, and did not work">
          <p className="text-[13px] text-ink-2">{entry.triedFirst}</p>
        </Section>
      )}

      {entry.workedDetail && (
        <Section eyebrow="What worked">
          <p className="text-[13px] text-ink-2">{entry.workedDetail}</p>
        </Section>
      )}

      <ControlCallout entry={entry} />

      {entry.decision && (
        <Section eyebrow="The decision">
          <div className="flex items-center gap-2.5">
            <PersonAvatar kind="human" initials={entry.decision.approver.initials} team={entry.decision.approver.team} size="sm" />
            <p className="text-[13px] text-ink">
              Approved by {entry.decision.approver.name} · {entry.decision.role} · {entry.decision.date}
            </p>
          </div>

          {entry.decision.objection && (
            <div className="mt-3 flex items-start gap-2.5 border-t border-line pt-3">
              <Flag className="mt-0.5 size-3.75 shrink-0 text-amber" />
              <div>
                <p className="text-[13px] text-amber">{entry.decision.objection.body}</p>
                <p className="mt-1 text-[11.5px] text-ink-3">{entry.decision.objection.resolution}</p>
              </div>
            </div>
          )}
        </Section>
      )}

      {entry.citedSince && entry.citedSince.length > 0 && (
        <Section eyebrow="Cited since">
          <div className="divide-y divide-line rounded-card border border-line bg-paper">
            {entry.citedSince.map((citation, i) => (
              <div key={i} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <p className="text-[13px] text-ink-2">{citation.label}</p>
                <p className="text-[11.5px] text-ink-4">{citation.date}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
