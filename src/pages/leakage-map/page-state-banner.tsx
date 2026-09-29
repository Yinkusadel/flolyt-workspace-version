import { useNavigate } from "react-router-dom";
import { AlertTriangle, PlugZap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PAGE_STATES } from "@/pages/leakage-map/data";

/**
 * Empty/error (12-states.svg), driven by `useGetLeakage`'s real query state — see index.tsx.
 * Title/body/footnote copy stays `data.ts`'s static chrome (it doesn't assert any number or fact
 * the API could contradict); the error message and the retry/connect actions are real. "Empty" is
 * inferred from `customerCount === 0` — unconfirmed live, since every real response pulled so far
 * had customers; flagged in docs/leakage-map/build-plan.md. The in-flight "recomputing" state is a
 * separate floating toast (`recomputing-toast.tsx`), not a banner here — see that file for why.
 */
export function PageStateBanner({
  state,
  errorMessage,
  onRetry,
}: {
  state: "empty" | "error";
  errorMessage?: string;
  onRetry?: () => void;
}) {
  const navigate = useNavigate();

  if (state === "error") {
    const copy = PAGE_STATES.error;
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-card border border-amber-border bg-amber-bg px-4 py-3">
        <AlertTriangle className="size-4 shrink-0 text-amber" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-medium text-ink">{copy.title}</p>
          <p className="mt-0.5 text-[11px] text-ink-2">{errorMessage ?? copy.body}</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          {copy.cta}
        </Button>
      </div>
    );
  }

  const copy = PAGE_STATES.empty;
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-line bg-paper px-6 py-12 text-center">
      <PlugZap className="size-6 text-ink-4" aria-hidden />
      <div>
        <p className="text-[14px] font-semibold text-ink">{copy.title}</p>
        <p className="mt-1 text-[12px] text-ink-3">{copy.body}</p>
        <p className="mt-1 text-[11px] text-ink-4">{copy.footnote}</p>
      </div>
      <Button type="button" size="sm" onClick={() => navigate("/data-sources")}>
        {copy.cta}
      </Button>
    </div>
  );
}
