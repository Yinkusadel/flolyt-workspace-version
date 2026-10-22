import { Loader2 } from "lucide-react";

import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { EvidenceStatusBadge } from "./ai-response/evidence-status-badge";
import { useGetEvidence } from "@/features/ai-evidence/use-get-evidence";
import type { CanonicalIntelligenceProjection } from "@/features/ai-evidence/ai-evidence-types";
import type { IntelligenceReference } from "@/features/ai-conversations/agent-intelligence-types";

type Node = CanonicalIntelligenceProjection["nodes"][number];

function NodeCard({ node }: { node: Node }) {
  const impact = node.impact;

  return (
    <div className="rounded-card border border-line bg-paper p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-mono text-[9px] font-medium tracking-[0.4px] text-ink-4 uppercase">
            {node.reference.kind}
          </p>
          <p className="text-[12px] font-semibold text-ink">{node.label}</p>
          {node.summary && <p className="mt-0.5 text-[11px] leading-relaxed text-ink-2">{node.summary}</p>}
        </div>
        <EvidenceStatusBadge status={node.evidenceStatus.status} reason={node.evidenceStatus.reason} />
      </div>

      {/* Impact only ever comes from ImpactStatement itself, never re-derived — for
          basis === "unavailable" that means the reason text and no numeric value, per the doc. */}
      {impact && (
        <div className="mt-2 rounded-md bg-paper-2 px-2.5 py-2">
          {impact.basis === "unavailable" ? (
            <p className="text-[11px] text-ink-3">{impact.unavailableReason ?? "Impact unavailable"}</p>
          ) : (
            <p className="text-[12.5px] font-semibold text-ink">
              {impact.value}
              {impact.unit ? <span className="ml-0.5 text-[10px] font-medium text-ink-3">{impact.unit}</span> : null}
              <span className="ml-1.5 text-[10px] font-medium text-ink-4 capitalize">{impact.basis}</span>
            </p>
          )}
        </div>
      )}

      {node.observedAtUtc && (
        <p className="mt-1.5 text-[10px] text-ink-4">Observed {new Date(node.observedAtUtc).toLocaleString()}</p>
      )}

      {node.attributes && Object.keys(node.attributes).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {Object.entries(node.attributes).map(([key, value]) => (
            <span key={key} className="text-[10px] text-ink-3">
              <span className="text-ink-4">{key}: </span>
              {value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// The evidence-traversal side panel — a finding's evidence chip opens this with the
// IntelligenceReference it points to. Not tested against a real live payload yet (no populated
// GET /evidence/{kind}/{referenceId} example has appeared), so this renders defensively against
// the documented CanonicalIntelligenceProjection shape only: a flat list of node cards plus a
// plain-text relation list, not a visual graph — revisit the layout once a real example exists.
export function EvidencePanel({
  target,
  onOpenChange,
}: {
  target: IntelligenceReference | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { data, isLoading, isError } = useGetEvidence(
    target ? { kind: target.kind, referenceId: target.id } : null,
    { enabled: !!target }
  );
  const projection = data?.data;

  const nodeLabelById = new Map((projection?.nodes ?? []).map((n) => [n.reference.id, n.label]));

  return (
    <Sheet open={!!target} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Evidence</SheetTitle>
          <SheetDescription>{target ? `${target.kind} · ${target.id}` : ""}</SheetDescription>
        </SheetHeader>

        <SheetBody className="flex flex-col gap-2.5 px-5 py-5">
          {isLoading && (
            <div className="flex items-center gap-2 text-[11.5px] text-ink-3">
              <Loader2 className="size-3.5 animate-spin" />
              Loading…
            </div>
          )}

          {/* Doc: treat 404 as unavailable/inaccessible without revealing which case applied —
              one generic message covers both. */}
          {isError && <p className="text-[11.5px] text-ink-3">This evidence is unavailable right now.</p>}

          {projection && (
            <>
              {projection.nodes.map((node) => (
                <NodeCard key={node.reference.id} node={node} />
              ))}

              {projection.links.length > 0 && (
                <div className="mt-1 flex flex-col gap-1 border-t border-line pt-3">
                  <p className="text-[9.5px] font-medium tracking-[0.4px] text-ink-4 uppercase">Relations</p>
                  {projection.links.map((link, idx) => (
                    <p key={idx} className="text-[11px] text-ink-3">
                      {nodeLabelById.get(link.from.id) ?? link.from.id}
                      <span className="text-ink-4"> — {link.relation} → </span>
                      {nodeLabelById.get(link.to.id) ?? link.to.id}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
