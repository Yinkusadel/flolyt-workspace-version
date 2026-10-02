import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatCount, formatPercent } from "@/lib/format-measured-value";
import { groupLimitations } from "@/pages/leakage-map/v2-cell-grid";
import type { LeakageV2Cell, LeakageV2CoverageSummary } from "@/services/api/leakage/get-leakage";

const COVERAGE_DIMENSIONS: { label: string; key: "capability" | "scope" | "freshness" | "quality"; barClass: string }[] = [
  { label: "Capability", key: "capability", barClass: "bg-ultra" },
  { label: "Scope", key: "scope", barClass: "bg-teal" },
  { label: "Freshness", key: "freshness", barClass: "bg-amber" },
  { label: "Quality", key: "quality", barClass: "bg-rose" },
];

/**
 * The four measured sub-dimensions behind `coverage.effective`, never surfaced before this pass
 * (per docs/leakage-map/v2-build-plan.md's "Design status: ON HOLD" note). Styled after a
 * reference the user shared, kept for shape (title, one row per dimension with a bar, a stat
 * footer). Colors are this app's own four accent tokens (one per row, fixed assignment so a given
 * dimension always gets the same color) — the user explicitly okayed multiple colors for these
 * bars specifically (2026-10-02), unlike the hero card above.
 */
export function V2CoverageCard({ coverage }: { coverage: LeakageV2CoverageSummary }) {
  return (
    <div className="rounded-card border border-line bg-paper p-5">
      <h2 className="text-[14.5px] font-semibold text-ink">Coverage</h2>
      <div className="mt-4 space-y-3.5">
        {COVERAGE_DIMENSIONS.map(({ label, key, barClass }) => {
          const value = coverage[key];
          return (
            <div key={key}>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-ink-2">{label}</span>
                <span className="font-mono tabular-nums text-ink-3">{value !== null ? formatPercent(value) : "—"}</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-paper-2">
                <div className={`h-1.5 rounded-full ${barClass}`} style={{ width: value !== null ? `${Math.round(value * 100)}%` : "0%" }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-line pt-4">
        <div>
          <p className="text-[11px] text-ink-4">Signals measured</p>
          <p className="mt-1 font-mono text-[16px] font-semibold text-ink tabular-nums">
            {coverage.measuredSignals} / {coverage.applicableSignals}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-ink-4">Unknown units</p>
          <p className="mt-1 font-mono text-[16px] font-semibold text-ink tabular-nums">{formatCount(coverage.residualUnknownUnits)}</p>
        </div>
      </div>
    </div>
  );
}

export interface LimitationGroup {
  key: string;
  title: string;
  count: number;
  description: string;
  /** Only the currency-unpriced group has a real per-entity split; every other group is one undifferentiated count. */
  breakdown?: { label: string; count: number }[];
}

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
const CURRENCY_UNPRICED_RE =
  /^Candidate '.+' remains unpriced because sector '.+' has no severity thresholds in ([A-Z]{3}); no FX conversion was inferred\.$/;
const MEASURED_MISSING_RE = /^Observation '.+' is measurable but cannot be priced without positive impact and currency\.$/;
const NO_BASELINE_RE = /^(\d+) subject\(s\) had no prior-window baseline and were not classified as measured zero\.$/;
const DETECTOR_AWAITING_RE = /^The '(.+)' detector is available, but this shadow adapter has no normalized facts for the resolved source yet\.$/;

/**
 * Categorizes the page's real `limitations[]` by the actual sentence templates the backend sends
 * (confirmed live against `leakageresponse.json` — a 1063-entry pull where these four templates
 * accounted for all but one line), rather than a generic UUID-strip-and-count. Each bucket's count
 * reads the real quantity the template itself carries: most are "one line per occurrence," but the
 * no-baseline template bundles its own count in the sentence ("97 subject(s)...") — parsed from
 * the match, not the (always-1) line count. Anything that matches none of the four known templates
 * still surfaces, deduped by `groupLimitations`'s UUID-stripping, under "Other" — never silently
 * dropped.
 */
export function groupLimitationsByCategory(limitations: string[], cells: LeakageV2Cell[]): LimitationGroup[] {
  const currencyCounts = new Map<string, number>();
  let measuredMissingCount = 0;
  let noBaselineCount = 0;
  const detectorIds: string[] = [];
  const otherLines: string[] = [];

  for (const line of limitations) {
    const currencyMatch = line.match(CURRENCY_UNPRICED_RE);
    const baselineMatch = line.match(NO_BASELINE_RE);
    const detectorMatch = line.match(DETECTOR_AWAITING_RE);
    if (currencyMatch) {
      currencyCounts.set(currencyMatch[1], (currencyCounts.get(currencyMatch[1]) ?? 0) + 1);
    } else if (MEASURED_MISSING_RE.test(line)) {
      measuredMissingCount++;
    } else if (baselineMatch) {
      noBaselineCount += Number(baselineMatch[1]);
    } else if (detectorMatch) {
      detectorIds.push(detectorMatch[1]);
    } else {
      otherLines.push(line);
    }
  }

  const groups: LimitationGroup[] = [];

  if (measuredMissingCount > 0) {
    groups.push({
      key: "measured-missing-impact",
      title: "Measured, missing impact or currency",
      count: measuredMissingCount,
      description: "Observations detected but not priceable.",
    });
  }

  const currencyTotal = [...currencyCounts.values()].reduce((a, b) => a + b, 0);
  if (currencyTotal > 0) {
    // Fixed alphabetical order (not count-rank) so a given currency always gets the same legend
    // position/shade across filter changes — rank-based assignment would repaint identities.
    const breakdown = [...currencyCounts.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([label, count]) => ({ label, count }));
    groups.push({
      key: "unpriced-currency",
      title: "Unpriced in other currencies",
      count: currencyTotal,
      description: "No severity thresholds outside the primary currency; FX was not inferred.",
      breakdown,
    });
  }

  if (noBaselineCount > 0) {
    groups.push({
      key: "no-prior-baseline",
      title: "No prior-window baseline",
      count: noBaselineCount,
      description: "Subjects not classified as measured zero.",
    });
  }

  if (detectorIds.length > 0) {
    const mechanismLabels = detectorIds.map((id) => {
      const cell = cells.find((c) => c.limitations.some((l) => l.includes(`'${id}'`)));
      return cell?.coordinate.mechanismLabel ?? id;
    });
    groups.push({
      key: "detectors-awaiting-data",
      title: "Detectors awaiting data",
      count: detectorIds.length,
      description: `${mechanismLabels.join(", ")} detector${detectorIds.length === 1 ? "" : "s"} have no normalized facts yet.`,
    });
  }

  if (otherLines.length > 0) {
    const counts = new Map<string, number>();
    for (const raw of otherLines) counts.set(raw.replace(UUID_RE, "…"), (counts.get(raw.replace(UUID_RE, "…")) ?? 0) + 1);
    const deduped = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    groups.push({
      key: "other",
      title: "Other",
      count: otherLines.length,
      description: deduped.map(([template, count]) => (count > 1 ? `${count}× ${template}` : template)).join(" "),
    });
  }

  return groups.sort((a, b) => b.count - a.count);
}

// Same four accent tokens as the Coverage card's bars, same "multiple colors okay here" exception
// the user gave 2026-10-02 — fixed index order (not count-rank) so a given currency keeps its
// color across filter changes instead of repainting by whichever happens to be largest.
const SEGMENT_COLOR_CLASS = ["bg-ultra", "bg-teal", "bg-amber", "bg-rose"];

function BreakdownBar({ breakdown }: { breakdown: { label: string; count: number }[] }) {
  const total = breakdown.reduce((sum, b) => sum + b.count, 0);
  if (total === 0) return null;
  return (
    <div className="mt-2">
      <div className="flex h-2 gap-px overflow-hidden rounded-full">
        {breakdown.map((b, i) => (
          <div
            key={b.label}
            className={SEGMENT_COLOR_CLASS[i % SEGMENT_COLOR_CLASS.length]}
            style={{ width: `${(b.count / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
        {breakdown.map((b, i) => (
          <span key={b.label} className="inline-flex items-center gap-1 text-[10.5px] text-ink-4">
            <span className={`size-2 rounded-xs ${SEGMENT_COLOR_CLASS[i % SEGMENT_COLOR_CLASS.length]}`} aria-hidden />
            {b.label} {b.count}
          </span>
        ))}
      </div>
    </div>
  );
}

function LimitationGroupRow({ group }: { group: LimitationGroup }) {
  return (
    <div className="border-t border-line py-3 first:border-t-0">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12.5px] font-medium text-ink">{group.title}</p>
        <p className="shrink-0 font-mono text-[12.5px] text-ink tabular-nums">{formatCount(group.count)}</p>
      </div>
      <p className="mt-0.5 text-[11px] text-ink-4">{group.description}</p>
      {group.breakdown && <BreakdownBar breakdown={group.breakdown} />}
    </div>
  );
}

/**
 * "Why the number is partial" — replaces the old flat amber Callout (one deduped-by-UUID bullet
 * list) with the real categories behind the page's `limitations[]`. "View all limitations" opens
 * the same UUID-deduped list the old Callout used, in a modal (moved out of inline expansion per
 * user feedback 2026-10-02) — same `Dialog` pattern as this page's own `HowCalculatedDialog`.
 */
export function V2LimitationsCard({ limitations, cells }: { limitations: string[]; cells: LeakageV2Cell[] }) {
  if (limitations.length === 0) return null;
  const groups = groupLimitationsByCategory(limitations, cells);
  const fullList = groupLimitations(limitations);

  return (
    <div className="rounded-card border border-line bg-paper p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[14.5px] font-semibold text-ink">Why the number is partial</h2>
        <p className="font-mono text-[11px] text-ink-4">{formatCount(limitations.length)} notes</p>
      </div>
      <div>
        {groups.map((group) => (
          <LimitationGroupRow key={group.key} group={group} />
        ))}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="mt-4 w-full rounded-control border border-line py-2 text-[12px] font-medium text-ink-2 hover:bg-paper-2"
          >
            View all limitations
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>All limitations ({formatCount(limitations.length)})</DialogTitle>
          </DialogHeader>
          <DialogBody className="px-5 py-5 sm:px-7 sm:py-6">
            <div className="space-y-2">
              {fullList.map(({ template, count }) => (
                <p key={template} className="text-[12px] leading-relaxed text-ink-3">
                  {count > 1 ? `${count}× ` : ""}
                  {template}
                </p>
              ))}
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
}
