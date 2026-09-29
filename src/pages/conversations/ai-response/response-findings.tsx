import { useState } from "react";
import { ChevronDown, ChevronUp, Database, ListChecks } from "lucide-react";

import { TextTooltip } from "@/components/ui/text-tooltip";
import { EvidenceStatusBadge } from "./evidence-status-badge";
import type { AgentResponseV2 } from "@/features/ai-conversations/agent-response-types";
import type { IntelligenceReference } from "@/features/ai-conversations/agent-intelligence-types";

type Finding = AgentResponseV2["findings"][number];

// An "empty shell" finding: no metrics, no evidence, and marked UNVERIFIED — the signature of a
// filler entry the backend emits when there's nothing structured to report (a plain greeting, or
// a specialist's own answer that echoed itself as its one "finding" instead of extracting real
// facts), rather than a genuine finding. Originally gated on `sourceResolution.decision ===
// "no_source_required"` too, but a real example (2026-09-28, Revenue Intelligence's own leakage
// answer) showed the same empty-shell shape with `decision: "use_single_source"` — the decision
// isn't the reliable signal, having literally nothing structured attached is. Confirmed safe
// against every real finding captured so far: all of them carry non-empty metrics or evidence,
// regardless of their `decision` or status.
function isEmptyShellFinding(finding: Finding): boolean {
  return finding.metrics.length === 0 && finding.evidence.length === 0 && finding.evidenceStatus === "UNVERIFIED";
}

// A finding's own `evidence[]` (referenceType/referenceId/label/...) is display-only citation
// info — it is NOT the same list the evidence-traversal endpoint accepts. The traversable
// `IntelligenceReference`s (the ones with a real `kind`) live on `provenance.findings[].evidence`
// and `.traceRoots`. Cross-reference by id so only a chip with a genuine traversable match becomes
// clickable; everything else stays a plain descriptive tooltip.
function findTraversableReference(
  findingId: string,
  referenceId: string,
  provenance?: AgentResponseV2["provenance"] | null
): IntelligenceReference | null {
  const pf = provenance?.findings?.find((f) => f.findingId === findingId);
  if (!pf) return null;
  const candidates = [...(pf.traceRoots ?? []), ...(pf.evidence ?? [])];
  return candidates.find((ref) => ref.id === referenceId) ?? null;
}

function FindingCard({
  finding,
  reason,
  provenance,
  onOpenEvidence,
}: {
  finding: Finding;
  reason?: string | null;
  provenance?: AgentResponseV2["provenance"] | null;
  onOpenEvidence: (ref: IntelligenceReference) => void;
}) {
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

      {finding.evidence.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {finding.evidence.map((e, idx) => {
            const traversable = findTraversableReference(finding.id, e.referenceId, provenance);
            const tooltipContent = (
              <>
                {e.observedAtUtc && <p>Observed {new Date(e.observedAtUtc).toLocaleString()}</p>}
                {e.method && <p>Method: {e.method}</p>}
                {!e.observedAtUtc && !e.method && <p>{e.referenceType}</p>}
              </>
            );
            const chipClassName =
              "inline-flex min-w-0 max-w-full items-center gap-1 rounded-chip border border-line bg-paper-2 px-2 py-1 text-[10px] text-ink-3";

            return traversable ? (
              <TextTooltip key={`${e.referenceId}-${idx}`} content={tooltipContent} className="inline-flex min-w-0 max-w-full">
                <button
                  type="button"
                  onClick={() => onOpenEvidence(traversable)}
                  className={`${chipClassName} transition-colors hover:border-ink-4 hover:text-ink`}
                >
                  <Database className="size-2.5 shrink-0 text-ink-4" />
                  <span className="min-w-0 truncate">{e.label}</span>
                </button>
              </TextTooltip>
            ) : (
              <TextTooltip key={`${e.referenceId}-${idx}`} content={tooltipContent} className={chipClassName}>
                <Database className="size-2.5 shrink-0 text-ink-4" />
                <span className="min-w-0 truncate">{e.label}</span>
              </TextTooltip>
            );
          })}
        </div>
      )}
    </div>
  );
}

// A response's structured findings — the doc's primary structured-content model, previously never
// rendered anywhere (the backend only ever sent empty `metrics`/`evidence` arrays until a real
// populated example showed up 2026-09-28). One card per finding: title/summary, an evidence-status
// badge, a compact metric grid, and evidence chips — clickable through to the evidence-traversal
// panel when a real traversable reference backs them, plain descriptive tooltips otherwise.
//
// Collapsed by default behind a summary toggle, same disclosure pattern as `HandoffCard`'s "View
// brief" and `AiDataTable`'s "Show all N" — a multi-finding answer (4+ cards, each with its own
// metric grid) otherwise pushes the composer and suggested-actions panel well off-screen. Confirmed
// live 2026-09-28 against a real 4-finding response.
export function AiResponseFindings({
  findings,
  provenance,
  onOpenEvidence,
}: {
  findings: AgentResponseV2["findings"];
  provenance?: AgentResponseV2["provenance"] | null;
  onOpenEvidence: (ref: IntelligenceReference) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const visibleFindings = findings.filter((f) => !isEmptyShellFinding(f));
  if (!visibleFindings.length) return null;

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
        {visibleFindings.length} finding{visibleFindings.length === 1 ? "" : "s"}
        {expanded ? <ChevronUp className="size-3 shrink-0" /> : <ChevronDown className="size-3 shrink-0" />}
      </button>

      {expanded && (
        <div className="flex flex-col gap-2">
          {visibleFindings.map((finding) => (
            <FindingCard
              key={finding.id}
              finding={finding}
              reason={reasonByFindingId.get(finding.id)}
              provenance={provenance}
              onOpenEvidence={onOpenEvidence}
            />
          ))}
        </div>
      )}
    </div>
  );
}
