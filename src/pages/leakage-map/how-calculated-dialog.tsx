import { HelpCircle } from "lucide-react";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatShortDateWithYear } from "@/lib/format-measured-value";
import type { LeakageCalculationDto } from "@/services/api/leakage/get-leakage";

/**
 * "How is this calculated?" (dialog behind the controls bar link) — swapped from the mock's
 * authored formulas/terms/calibration-date stat row (none of which has an API equivalent, per
 * docs/leakage-map/build-plan.md mismatch #8) to the page's own real top-level `calculation`
 * block: the method in the server's own words, the window it ran over, which connected sources
 * fed it, the concrete inputs it read, and its caveats.
 */
export function HowCalculatedDialog({ calculation }: { calculation?: LeakageCalculationDto }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          disabled={!calculation}
          className="inline-flex items-center gap-1 text-[12px] font-medium text-ultra hover:underline disabled:opacity-60"
        >
          How is this calculated?
          <HelpCircle className="size-3.5" />
        </button>
      </DialogTrigger>

      {calculation && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How this is calculated</DialogTitle>
          </DialogHeader>
          <DialogBody className="px-5 py-5 sm:px-7 sm:py-6">
            <p className="text-[12px] leading-relaxed text-ink-2">{calculation.method}</p>

            {calculation.windowStartUtc && calculation.windowEndUtc && (
              <p className="mt-3 text-[11px] text-ink-4">
                {formatShortDateWithYear(calculation.windowStartUtc)} –{" "}
                {formatShortDateWithYear(calculation.windowEndUtc)} ({calculation.windowDays} days)
              </p>
            )}

            {calculation.sources.length > 0 && (
              <div className="mt-5 border-t border-line pt-4">
                <p className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">Sources</p>
                <div className="mt-2 space-y-1">
                  {calculation.sources.map((source) => (
                    <p key={source.id} className="text-[12px] text-ink-2">
                      {source.name} <span className="text-ink-4">· {source.kind} · {source.status}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {calculation.inputs.length > 0 && (
              <dl className="mt-5 space-y-2 border-t border-line pt-4">
                {calculation.inputs.map((input) => (
                  <div key={input.label} className="flex items-baseline justify-between gap-3">
                    <dt className="text-[11.5px] text-ink-3">{input.label}</dt>
                    <dd className="text-[12px] font-semibold text-ink">{input.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {calculation.caveats.length > 0 && (
              <div className="mt-5 border-t border-line pt-4">
                <p className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">Caveats</p>
                <ul className="mt-2 space-y-1.5">
                  {calculation.caveats.map((caveat) => (
                    <li key={caveat} className="text-[12px] leading-relaxed text-ink-3">
                      · {caveat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </DialogBody>
        </DialogContent>
      )}
    </Dialog>
  );
}
