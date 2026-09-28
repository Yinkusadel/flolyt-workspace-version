import { useState } from "react";
import { ChevronDown, ChevronUp, Database, ListChecks } from "lucide-react";

import { cn } from "@/lib/utils";
import { TextTooltip } from "@/components/ui/text-tooltip";
import type { AgentResponseV2 } from "@/features/ai-conversations/agent-response-types";
import type { EvidenceStatus } from "@/features/ai-conversations/agent-intelligence-types";

type Finding = AgentResponseV2["findings"][number];

// Net-new tier scale for this app (findings/evidence had no prior UI) — deliberately not amber
// anywhere on it: amber here means "a named person must act" per index.css, which doesn't apply
// to a data-confidence label. Ramps neutral → neutral → teal → ultra instead.
const EVIDENCE_STATUS_META: Record<EvidenceStatus, { label: string; className: string }> = {
  UNVERIFIED: { label: "Unverified", className: "border-line bg-paper-2 text-ink-4" },
  INDICATIVE: { label: "Indicative", className: "border-line bg-paper-2 text-ink-2" },
  CORROBORATED: { label: "Corroborated", className: "border-teal-border bg-teal-bg text-teal" },
  MEASURED: { label: "Measured", className: "border-ultra-border bg-ultra-bg text-ultra" },
};

// Per the v3 handoff: render the status as the structured field says it, and show its `reason` as
// the explanation — never promote it on the client. `reason` lives on `provenance`, not on the
// finding itself, so it's threaded in from there rather than guessed.
function EvidenceStatusBadge({ status, reason }: { status: EvidenceStatus; reason?: string | null }) {
  const meta = EVIDENCE_STATUS_META[status] ?? EVIDENCE_STATUS_META.UNVERIFIED;
  const badge = (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-chip border px-2 py-0.5 text-[9.5px] font-semibold whitespace-nowrap",
        meta.className
      )}
    >
      {meta.label}
    </span>
  );
  if (!reason) return badge;
  return <TextTooltip content={reason}>{badge}</TextTooltip>;
}

function FindingCard({ finding, reason }: { finding: Finding; reason?: string | null }) {
  return (
    <div className="rounded-card border border-line bg-paper p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-ink">{finding.title}</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-ink-2">{finding.summary}</p>
        </div>
        <EvidenceStatusBadge status={finding.evidenceStatus} reason={reason} />
      </div>

      {finding.metrics.length > 0 && (
        <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {finding.metrics.map((m) => (
            <div key={m.id} className="min-w-0 rounded-md bg-paper-2 px-2 py-1.5">
              <p className="truncate text-[9px] font-medium tracking-[0.3px] text-ink-4 uppercase">{m.label}</p>
              <p className="mt-0.5 truncate text-[12.5px] font-semibold text-ink">
                {m.value}
                {m.unit ? <span className="ml-0.5 text-[10px] font-medium text-ink-3">{m.unit}</span> : null}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Descriptive only — no click-through yet. Full evidence traversal (GET
          /evidence/{kind}/{referenceId}) is a separate, not-yet-built piece. */}
      {finding.evidence.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {finding.evidence.map((e, idx) => (
            <TextTooltip
              key={`${e.referenceId}-${idx}`}
              content={
                <>
                  {e.observedAtUtc && <p>Observed {new Date(e.observedAtUtc).toLocaleString()}</p>}
                  {e.method && <p>Method: {e.method}</p>}
                  {!e.observedAtUtc && !e.method && <p>{e.referenceType}</p>}
                </>
              }
              className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-chip border border-line bg-paper-2 px-2 py-1 text-[10px] text-ink-3"
            >
              <Database className="size-2.5 shrink-0 text-ink-4" />
              <span className="min-w-0 truncate">{e.label}</span>
            </TextTooltip>
          ))}
        </div>
      )}
    </div>
  );
}

// A response's structured findings — the doc's primary structured-content model, previously never
// rendered anywhere (the backend only ever sent empty `metrics`/`evidence` arrays until a real
// populated example showed up 2026-09-28). One card per finding: title/summary, an evidence-status
// badge, a compact metric grid, and descriptive evidence chips.
//
// Collapsed by default behind a summary toggle, same disclosure pattern as `HandoffCard`'s "View
// brief" and `AiDataTable`'s "Show all N" — a multi-finding answer (4+ cards, each with its own
// metric grid) otherwise pushes the composer and suggested-actions panel well off-screen. Confirmed
// live 2026-09-28 against a real 4-finding response.
export function AiResponseFindings({
  findings,
  provenance,
}: {
  findings: AgentResponseV2["findings"];
  provenance?: AgentResponseV2["provenance"] | null;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!findings.length) return null;

  const reasonByFindingId = new Map(
    (provenance?.findings ?? []).map((f) => [f.findingId, f.evidenceStatus?.reason ?? null])
  );

  return (
    <div className="flex w-full max-w-[85%] min-w-0 flex-col gap-2">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="inline-flex items-center gap-1.5 self-start rounded-chip border border-line bg-paper px-3 py-1.5 text-[11px] font-medium text-ink-3 transition-colors hover:border-ink-4"
      >
        <ListChecks className="size-3 shrink-0 text-ink-4" />
        {findings.length} finding{findings.length === 1 ? "" : "s"}
        {expanded ? <ChevronUp className="size-3 shrink-0" /> : <ChevronDown className="size-3 shrink-0" />}
      </button>

      {expanded && (
        <div className="flex flex-col gap-2">
          {findings.map((finding) => (
            <FindingCard key={finding.id} finding={finding} reason={reasonByFindingId.get(finding.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
