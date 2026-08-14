import { cn } from "@/lib/utils";
import type { EvidenceGrade } from "@/pages/rooms/types";

const EVIDENCE_GRADE_META: Record<EvidenceGrade, { label: string; classes: string }> = {
  causal: { label: "Causal finding", classes: "border-teal-border bg-teal-bg text-teal" },
  association: { label: "Strong association", classes: "border-ultra-border bg-ultra-bg text-ultra" },
  hypothesis: { label: "Hypothesis", classes: "border-line bg-paper text-ink-3" },
  insufficient: { label: "Insufficient evidence", classes: "border-line bg-paper text-ink-4" },
};

export function EvidenceBadge({ grade, className }: { grade: EvidenceGrade; className?: string }) {
  const meta = EVIDENCE_GRADE_META[grade];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-chip border px-1.5 py-0.5 font-mono text-[9px] font-medium tracking-[0.5px] whitespace-nowrap uppercase",
        meta.classes,
        className
      )}
    >
      {meta.label}
    </span>
  );
}
