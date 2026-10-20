import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { getRelationshipHistory } from "@/services/api/datasource-relationships/get-relationship-history";
import type {
  RelationshipHistoryEntry,
  RelationshipMapping,
  RelationshipState,
} from "@/services/api/datasource-relationships/types";
import { formatDateTime } from "@/pages/data-sources/format";
import { STATE_TONE } from "@/pages/relationships/labels";

const PAGE_SIZE = 25;

// `changeReason` is CREATED, REVISED or APPROVED, except on a disable where it is the free text
// reason the person typed. Seen on a real relationship 2026-10-20.
function describe(entry: RelationshipHistoryEntry): { label: string; reason: string | null } {
  switch (entry.changeReason) {
    case "CREATED":
      return { label: "Draft created", reason: null };
    case "REVISED":
      return { label: "Edited", reason: null };
    case "APPROVED":
      return {
        label: entry.approval?.acceptedPartial ? "Approved, accepting a partial preview" : "Approved",
        reason: null,
      };
    default:
      return entry.state === "Disabled"
        ? { label: "Disabled", reason: entry.changeReason }
        : { label: entry.changeReason, reason: null };
  }
}

function HistoryRow({ entry, isCurrent }: { entry: RelationshipHistoryEntry; isCurrent: boolean }) {
  const { label, reason } = describe(entry);
  const tone = STATE_TONE[entry.state.toUpperCase() as RelationshipState] ?? "neutral";

  return (
    <li className="flex flex-wrap items-start gap-x-4 gap-y-1.5 px-4 py-3">
      <div className="w-16 shrink-0 font-mono text-[10.5px] text-ink-4">Rev {entry.revision}</div>

      <div className="min-w-0 flex-1 basis-56">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[12px] font-semibold text-ink">{label}</p>
          {/* The chip is the state after the change. It repeats the label for approve and disable, so skip it there. */}
          {!label.startsWith(entry.state) && <Chip tone={tone}>{entry.state}</Chip>}
          {isCurrent && <Chip tone="ultra">Current</Chip>}
        </div>
        {reason && <p className="mt-1 wrap-break-word text-[11px] text-ink-2">Reason: {reason}</p>}
      </div>

      <div className="shrink-0 text-right text-[10.5px] text-ink-3">
        <p>{entry.changedByName}</p>
        <p className="text-ink-4">{formatDateTime(entry.changedAtUtc)}</p>
      </div>
    </li>
  );
}

/**
 * The audit trail (step 6 of docs/datasource-relationships/build-plan.md). The detail response
 * carries the latest 50 revisions, newest first. Earlier ones come from GET /{id}/history, so the
 * button is driven by `historyTotal`, never by `historyTruncated` alone (list rows report it
 * wrongly). Names come from the backend (`changedByName`), never from user ids.
 */
export function HistoryPanel({ mapping }: { mapping: RelationshipMapping }) {
  const base = mapping.history ?? [];
  const [earlier, setEarlier] = useState<RelationshipHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // A new revision changes what "earlier" means, so start again from the detail's own entries.
  useEffect(() => setEarlier([]), [mapping.revision]);

  const entries = [...base, ...earlier.filter((e) => !base.some((b) => b.id === e.id))];
  const total = mapping.historyTotal ?? entries.length;
  const hasMore = entries.length < total;

  const loadEarlier = async () => {
    setLoading(true);
    try {
      const response = await getRelationshipHistory(mapping.id, {
        offset: entries.length,
        limit: PAGE_SIZE,
      });
      setEarlier((prev) => [...prev, ...response.data.revisions]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load earlier revisions");
    } finally {
      setLoading(false);
    }
  };

  if (entries.length === 0) return null;

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-[13px] font-semibold text-ink">History</h2>
        <p className="mt-0.5 text-[10.5px] text-ink-3">
          Every change to this relationship, newest first. Showing {entries.length} of {total}.
        </p>
      </div>

      <ul className="divide-y divide-line rounded-card border border-line bg-paper-2">
        {entries.map((entry) => (
          <HistoryRow key={entry.id} entry={entry} isCurrent={entry.revision === mapping.revision} />
        ))}
      </ul>

      {hasMore && (
        <Button type="button" variant="outline" size="sm" disabled={loading} onClick={loadEarlier}>
          {loading ? "Loading..." : "Load earlier revisions"}
        </Button>
      )}
    </section>
  );
}
