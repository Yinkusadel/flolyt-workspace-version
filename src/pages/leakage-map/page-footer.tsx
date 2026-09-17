import { PAGE_FOOTER } from "@/pages/leakage-map/data";

/** Shared footer under both the coverage and actions panels — one line protects against false
 * confidence, the other says what to do about it. */
export function PageFooter() {
  return (
    <p className="text-center text-[11.5px] text-ink-3">
      {PAGE_FOOTER.coverageLine} · {PAGE_FOOTER.notIncludedLine} ·{" "}
      <span className="font-semibold text-ink">{PAGE_FOOTER.totalLine}</span> · {PAGE_FOOTER.expectedSaveLine} ·{" "}
      <span className="text-ink-4">{PAGE_FOOTER.explainer}</span>
    </p>
  );
}
