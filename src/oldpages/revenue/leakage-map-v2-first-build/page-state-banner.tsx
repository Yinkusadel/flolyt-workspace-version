import { useNavigate } from "react-router-dom";
import { AlertTriangle, PlugZap, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PAGE_STATES } from "@/oldpages/revenue/leakage-map-v2-first-build/data";

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
  hasData = false,
  retrying = false,
  onRetry,
}: {
  state: "empty" | "error";
  /** The request's own failure message, shown as a quiet detail line under the explanation. */
  errorMessage?: string;
  /** True when a previous good response is still on screen beneath the banner (a failed refetch). */
  hasData?: boolean;
  /** True while the retry is in flight. */
  retrying?: boolean;
  onRetry?: () => void;
}) {
  const navigate = useNavigate();

  if (state === "error") {
    const copy = PAGE_STATES.error;
    const { title, body } = hasData ? copy.refresh : copy.initial;
    const retryLabel = retrying ? copy.ctaBusy : copy.cta;

    // Nothing else on the page to anchor to, so the card sits centered in the content area.
    if (!hasData) {
      return (
        <div className="flex min-h-[55vh] items-center justify-center">
          <div
            role="alert"
            className="flex w-full max-w-md flex-col items-center gap-4 px-6 py-10 text-center"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-rose-bg text-rose">
              <AlertTriangle className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-[14px] font-semibold text-ink">{title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-3">{body}</p>
              {errorMessage && <p className="mt-2 text-[11px] text-ink-4">Details: {errorMessage}</p>}
            </div>
            <Button type="button" variant="outline" size="sm" disabled={retrying} onClick={onRetry}>
              <RefreshCw className={retrying ? "animate-spin" : undefined} aria-hidden />
              {retryLabel}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div
        role="alert"
        className="flex flex-col gap-3 rounded-card border border-line bg-paper p-4 sm:flex-row sm:items-center sm:gap-4"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-bg text-rose">
          <AlertTriangle className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-ink">{title}</p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-ink-3">{body}</p>
          {errorMessage && <p className="mt-1.5 text-[11px] text-ink-4">Details: {errorMessage}</p>}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 self-start sm:self-center"
          disabled={retrying}
          onClick={onRetry}
        >
          <RefreshCw className={retrying ? "animate-spin" : undefined} aria-hidden />
          {retryLabel}
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
