import { PAGE_FOOTER } from "@/pages/leakage-map/data";

/** Shared two-line footer under both the coverage and actions panels — one line protects against
 * false confidence, the other says what to do about it. */
export function PageFooter() {
  return (
    <div className="space-y-1 text-center text-[11.5px]">
      <p className="text-ink-3">
        {PAGE_FOOTER.coverageLine} · {PAGE_FOOTER.notIncludedLine}
      </p>
      <p className="text-ink-2">
        <span className="font-semibold text-ink">{PAGE_FOOTER.totalLine}</span> · {PAGE_FOOTER.expectedSaveLine}
      </p>
      <p className="text-ink-4">{PAGE_FOOTER.explainer}</p>
    </div>
  );
}
