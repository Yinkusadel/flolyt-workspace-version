import { HelpCircle } from "lucide-react";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HOW_CALCULATED } from "@/pages/leakage-map/data";

export function HowCalculatedDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[12px] font-medium text-ultra hover:underline"
        >
          How is this calculated?
          <HelpCircle className="size-3.5" />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>How this is calculated</DialogTitle>
        </DialogHeader>
        <DialogBody className="px-5 py-5 sm:px-7 sm:py-6">
          <div className="space-y-1.5 rounded-card border border-line bg-paper-2 px-4 py-3 font-mono text-[11.5px] text-ink-2">
            {HOW_CALCULATED.formulas.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <dl className="mt-5 space-y-4">
            {HOW_CALCULATED.terms.map((term) => (
              <div key={term.term}>
                <dt className="text-[12.5px] font-semibold text-ink">{term.term}</dt>
                <dd className="mt-1 text-[12px] leading-relaxed text-ink-3">{term.body}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 border-t border-line pt-4">
            <p className="font-mono text-[9.5px] font-medium tracking-[0.6px] text-ink-4 uppercase">
              What is not included
            </p>
            <ul className="mt-2 space-y-1">
              {HOW_CALCULATED.notIncluded.map((line) => (
                <li key={line} className="text-[12px] leading-relaxed text-rose">
                  · {line}
                </li>
              ))}
            </ul>
          </div>

          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4">
            <div>
              <dt className="font-mono text-[8px] font-medium tracking-[0.6px] text-ink-4 uppercase">Coverage</dt>
              <dd className="mt-0.5 text-[12px] font-semibold text-ink">{HOW_CALCULATED.coveragePercent}% of surface</dd>
            </div>
            <div>
              <dt className="font-mono text-[8px] font-medium tracking-[0.6px] text-ink-4 uppercase">Last calibration</dt>
              <dd className="mt-0.5 text-[12px] font-semibold text-ink">{HOW_CALCULATED.lastCalibration}</dd>
            </div>
            <div>
              <dt className="font-mono text-[8px] font-medium tracking-[0.6px] text-ink-4 uppercase">Next recalibration</dt>
              <dd className="mt-0.5 text-[12px] font-semibold text-ink">{HOW_CALCULATED.nextRecalibration}</dd>
            </div>
          </dl>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
