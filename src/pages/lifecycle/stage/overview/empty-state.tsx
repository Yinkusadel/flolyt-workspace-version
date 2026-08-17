import { Button } from "@/components/ui/button";

/** A01-style "not defined yet" card — shown at the bare /lifecycle/:stage route when Stage.isDefined is false. */
export function StageEmptyState({ stageName }: { stageName: string }) {
  return (
    <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
      <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">{stageName} is not defined yet</h2>
      <p className="mx-auto mt-3 max-w-lg text-[11.5px] leading-relaxed text-ink-3">
        Flolyt will not show a number for this stage until somebody says which event marks a customer
        entering it.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Button type="button">Define the stage</Button>
        <Button type="button" variant="outline">
          Use the suggested one
        </Button>
      </div>
    </div>
  );
}
