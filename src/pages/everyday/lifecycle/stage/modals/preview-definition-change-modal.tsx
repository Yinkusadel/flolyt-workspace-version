import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCount } from "@/pages/everyday/lifecycle/format-measured-value";
import type {
  PreviewImpactSectionDto,
  PreviewStageDefinitionData,
} from "@/services/api/lifecycle/preview-stage-definition";

const IMPACT_SECTIONS: { key: keyof PreviewStageDefinitionData; label: string }[] = [
  { key: "figuresAffected", label: "Figures affected" },
  { key: "cohortsBroken", label: "Cohorts broken" },
  { key: "goalsInvalidated", label: "Goals invalidated" },
  { key: "learningsScoped", label: "Learnings scoped" },
];

/**
 * The blast-radius report from POST .../definition/preview, shown before PUT .../definition
 * commits it. Read-only — Confirm just re-sends the same entryEventKey/exitRules/exclusions the
 * preview was issued for, plus the previewToken, via the parent's save mutation.
 */
export function PreviewDefinitionChangeModal({
  open,
  onOpenChange,
  stageName,
  candidateLabel,
  preview,
  onConfirm,
  isSaving,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stageName: string;
  candidateLabel: string;
  preview: PreviewStageDefinitionData | undefined;
  onConfirm: () => void;
  isSaving: boolean;
}) {
  if (!preview) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Preview this change</DialogTitle>
          <DialogDescription>
            Setting {stageName}&rsquo;s entry event to &ldquo;{candidateLabel}&rdquo; &mdash; here&rsquo;s what it would affect before you save.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
              <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Customers added</p>
              <p className="mt-1 text-[14px] font-semibold text-ink">
                {preview.customersAdded !== null ? formatCount(preview.customersAdded) : "Not available"}
              </p>
            </div>
            <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
              <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Customers removed</p>
              <p className="mt-1 text-[14px] font-semibold text-ink">
                {preview.customersRemoved !== null ? formatCount(preview.customersRemoved) : "Not available"}
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {IMPACT_SECTIONS.map(({ key, label }) => {
              const section = preview[key] as PreviewImpactSectionDto;
              return (
                <div key={key} className="rounded-panel border border-line bg-paper px-3.5 py-3">
                  <p className="text-[11.5px] font-semibold text-ink">{label}</p>
                  {section.measured ? (
                    section.items.length > 0 ? (
                      <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-[10.5px] text-ink-2">
                        {section.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-[10.5px] text-ink-3">None</p>
                    )
                  ) : (
                    <p className="mt-1 text-[10.5px] text-ink-3">{section.unmeasuredReason ?? "Not measured"}</p>
                  )}
                </div>
              );
            })}
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={onConfirm} disabled={isSaving}>
              {isSaving ? "Saving…" : "Confirm and save"}
            </Button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
