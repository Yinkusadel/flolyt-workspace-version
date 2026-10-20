import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import useApproveRelationship from "@/features/datasource-relationships/use-approve-relationship";
import { RelationshipApiError } from "@/services/api/datasource-relationships/relationship-error";
import type {
  RelationshipMapping,
  RelationshipPreview,
} from "@/services/api/datasource-relationships/types";

function formatLeft(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function ApproveError({ error, onReload }: { error: RelationshipApiError; onReload: () => void }) {
  const stale = error.status === 409;
  const title =
    error.status === 403
      ? "Only workspace administrators can approve"
      : stale
        ? "This approval is no longer valid"
        : "The relationship was not approved";

  return (
    <div className="rounded-card border border-rose-border bg-rose-bg p-4">
      <h3 className="text-[12px] font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-[10.5px] text-ink-2">{error.message}</p>
      {error.validationIssues.length > 0 && (
        <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[10.5px] text-ink-2">
          {error.validationIssues.map((issue, index) => (
            <li key={`${issue.field}-${index}`}>
              {issue.field ? <span className="font-mono">{issue.field}: </span> : null}
              {issue.message}
            </li>
          ))}
        </ul>
      )}
      {stale && (
        <>
          <p className="mt-1.5 text-[10.5px] text-ink-2">
            The relationship or its data changed after the preview. Reload, then run the preview again.
            The old receipt is not reused.
          </p>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={onReload}>
            Reload and try again
          </Button>
        </>
      )}
    </div>
  );
}

/**
 * POST /{id}/approve (step 5 of docs/datasource-relationships/build-plan.md). Sends the preview's
 * server-issued `id` as `previewId`, never match counts. No optimistic update: the page changes only
 * once the backend returns the new revision. A 409 is never replayed. The caller keys this on the
 * preview id so the partial-acceptance choice resets with every new preview.
 */
export function ApproveSection({
  mapping,
  preview,
  onReload,
}: {
  mapping: RelationshipMapping;
  preview: RelationshipPreview;
  onReload: () => void;
}) {
  const [acceptPartial, setAcceptPartial] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const { approveRelationship, isPending, error } = useApproveRelationship();

  const expiresAt = new Date(preview.expiresAtUtc).getTime();
  const msLeft = expiresAt - now;
  const expired = msLeft <= 0;

  useEffect(() => {
    if (expired) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [expired]);

  const needsPartialChoice = preview.requiresPartialAcceptance;
  const canSubmit =
    preview.canApprove && !expired && !isPending && (!needsPartialChoice || acceptPartial);
  const apiError = error instanceof RelationshipApiError ? error : null;

  return (
    <div className="space-y-4 rounded-card border border-line bg-paper-2 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-[13px] font-semibold text-ink">Approve</h2>
          <p className="mt-0.5 text-[10.5px] text-ink-3">
            Approving revision {mapping.revision} marks this relationship as reviewed by an administrator.
            Any later edit returns it to draft.
          </p>
        </div>
        {expired ? (
          <Chip tone="rose">Preview expired</Chip>
        ) : (
          <Chip tone="amber">Valid for {formatLeft(msLeft)}</Chip>
        )}
      </div>

      {!preview.canApprove && (
        <p className="text-[11px] text-ink-2">
          The preview says this cannot be approved yet. Look at the problems above, change the data or
          the declaration, then run the preview again.
        </p>
      )}

      {expired && (
        <p className="text-[11px] text-ink-2">
          The 15 minutes are up. Run the preview again to get a fresh one.
        </p>
      )}

      {needsPartialChoice && preview.canApprove && !expired && (
        <label htmlFor="accept-partial" className="flex cursor-pointer items-start gap-2.5 text-[11px] text-ink-2">
          <input
            id="accept-partial"
            type="checkbox"
            checked={acceptPartial}
            disabled={isPending}
            onChange={(e) => setAcceptPartial(e.currentTarget.checked)}
            className="mt-0.5 size-3.5 accent-ultra"
          />
          <span>
            This preview read only part of each dataset (up to 10,000 rows). I accept that rows beyond
            that were not checked. The data is checked again whenever it is used, and a read that is
            still incomplete is refused.
          </span>
        </label>
      )}

      {apiError && <ApproveError error={apiError} onReload={onReload} />}

      <Button
        type="button"
        disabled={!canSubmit}
        onClick={() =>
          approveRelationship({
            id: mapping.id,
            payload: {
              expectedRevision: mapping.revision,
              previewId: preview.id,
              acceptPartial: needsPartialChoice && acceptPartial,
            },
          })
        }
      >
        {isPending ? "Approving..." : `Approve revision ${mapping.revision}`}
      </Button>
    </div>
  );
}
