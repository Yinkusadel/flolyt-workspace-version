import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { ChipTone } from "@/components/ui/chip";
import type { RevenueLeakCaseStatus } from "@/services/api/leakage/leakage-case-types";
import type { WorkspaceMemberDto } from "@/services/api/workspace/get-workspace-members";

/** Primary actions use the app's blue (`ultra`), not the default black button. */
export const PRIMARY_ACTION_CLASS = "border-ultra bg-ultra text-paper hover:bg-ultra/90";

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">{children}</p>;
}

/** Small sentence-case label over a field or stat. */
export function FieldLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("mb-1 text-[10.5px] font-medium text-ink-4", className)}>{children}</p>;
}

/**
 * Workflow-position tone per case status, so a status reads the same colour everywhere: untouched states
 * neutral or amber, active ownership blue, a positive outcome teal, a dead end rose.
 */
export const CASE_STATUS_TONE: Record<RevenueLeakCaseStatus, ChipTone> = {
  DETECTED: "amber",
  REVIEWED: "neutral",
  ASSIGNED: "ultra",
  WORKED: "ultra",
  RESOLVED: "teal",
  VERIFIED: "teal",
  CLOSED: "neutral",
  INVALIDATED: "rose",
};

/** A case's raw `ownerUserId` resolved against the workspace roster; falls back to the id (honest) rather than blank. */
export function resolveOwnerName(members: WorkspaceMemberDto[], ownerUserId: string | null): string {
  if (!ownerUserId) return "Unassigned";
  return members.find((m) => m.id === ownerUserId)?.displayName ?? ownerUserId;
}
