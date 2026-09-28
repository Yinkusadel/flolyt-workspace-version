import { cn } from "@/lib/utils";
import { TextTooltip } from "@/components/ui/text-tooltip";
import type { EvidenceStatus } from "@/features/ai-conversations/agent-intelligence-types";

// Net-new tier scale for this app (findings/evidence had no prior UI) — deliberately not amber
// anywhere on it: amber here means "a named person must act" per index.css, which doesn't apply
// to a data-confidence label. Ramps neutral → neutral → teal → ultra instead. Shared between the
// findings cards and the evidence traversal panel so both use the same one tier scale.
export const EVIDENCE_STATUS_META: Record<EvidenceStatus, { label: string; className: string }> = {
  UNVERIFIED: { label: "Unverified", className: "border-line bg-paper-2 text-ink-4" },
  INDICATIVE: { label: "Indicative", className: "border-line bg-paper-2 text-ink-2" },
  CORROBORATED: { label: "Corroborated", className: "border-teal-border bg-teal-bg text-teal" },
  MEASURED: { label: "Measured", className: "border-ultra-border bg-ultra-bg text-ultra" },
};

// Per the v3 handoff: render the status as the structured field says it, and show its `reason` as
// the explanation — never promote it on the client.
export function EvidenceStatusBadge({ status, reason }: { status: EvidenceStatus; reason?: string | null }) {
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
