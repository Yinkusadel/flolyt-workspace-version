import { useState, type ReactNode } from "react";
import { ArrowLeft, Check, Copy, TriangleAlert } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactMoney } from "@/lib/format-measured-value";
import { useGetLeakageCalculationDetail } from "@/features/leakage/use-get-leakage-calculation-detail";
import type { LeakageV2Cell } from "@/services/api/leakage/get-leakage";
import type {
  LeakageCalculationComponent,
  LeakageCalculationDetail,
} from "@/services/api/leakage/get-leakage-calculation-detail";
import {
  formatExactMoney,
  formatPlainNumber,
  humanizeEnum,
  marketName,
  MODE_TITLE,
  sentenceCase,
} from "@/pages/leakage-map/format";
import { SectionLabel } from "@/pages/leakage-map/drawer/shared";

/** Candidates shown before "Show all N". */
const PREVIEW_ROWS = 10;

interface CalculationDrawerProps {
  /** The opaque `calculationReference` of the amount being explained; `null` = closed. */
  reference: string | null;
  cells: LeakageV2Cell[];
  /** The cell this was opened from (the Amounts table), to offer a way back to it. */
  fromCell: LeakageV2Cell | undefined;
  onBack: () => void;
  onClose: () => void;
}

/**
 * The exact arithmetic behind one displayed amount, from `GET /leakage/calculation/detail`. It shows the selected
 * amount first, whether the included parts add up to it, then each candidate's working. Nothing is recomputed here:
 * every figure is the server's. If the server cannot resolve the reference the sheet says so and never substitutes
 * a newer calculation.
 */
export function CalculationDrawer({ reference, cells, fromCell, onBack, onClose }: CalculationDrawerProps) {
  const { data, isLoading, isError, error } = useGetLeakageCalculationDetail(
    { calculationReference: reference ?? "" },
    !!reference
  );
  const detail = data?.succeeded ? data.data : undefined;
  const failureMessage = isError ? error?.message : data && !data.succeeded ? (data.messages[0] ?? null) : null;

  const cell = detail ? cells.find((c) => c.id === detail.cellId) : undefined;
  const title = cell?.coordinate.mechanismLabel ?? (detail?.components[0] ? humanizeEnum(detail.components[0].mechanism) : "Calculation");

  return (
    <Sheet open={!!reference} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-[52rem]">
        <SheetHeader className="gap-2">
          {fromCell && (
            <button type="button" onClick={onBack} className="flex w-fit items-center gap-1 text-[11px] font-medium text-ultra hover:underline">
              <ArrowLeft className="size-3" />
              Back to {fromCell.coordinate.mechanismLabel}
            </button>
          )}
          <p className="font-mono text-[10px] tracking-wide text-ink-3 uppercase">How this number is calculated</p>
          <SheetTitle className="text-[18px]">{title}</SheetTitle>
          <SheetDescription className="sr-only">The exact calculation behind one amount</SheetDescription>
          {detail && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              <Chip tone="ultra">{marketName(detail.amount.market ?? "UNASSIGNED")}</Chip>
              <Chip>{detail.amount.currency}</Chip>
              <Chip>{humanizeEnum(detail.amount.lifecycleClass)}</Chip>
              <Chip>{MODE_TITLE[detail.amount.mode.toUpperCase()] ?? humanizeEnum(detail.amount.mode)}</Chip>
              <Chip>{detail.amount.horizonDays} days</Chip>
            </div>
          )}
        </SheetHeader>

        <SheetBody className="space-y-5 px-5 py-5">
          {isLoading && <CalculationSkeleton />}
          {!isLoading && !detail && <Unavailable message={failureMessage} onClose={onClose} />}
          {detail && <CalculationContent detail={detail} />}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}

function CalculationSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr]">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-16" />
      <Skeleton className="h-64" />
    </div>
  );
}

/** The server could not resolve this reference. We say so; we never show another publication's numbers instead. */
function Unavailable({ message, onClose }: { message: string | null | undefined; onClose: () => void }) {
  const queryClient = useQueryClient();
  return (
    <div className="rounded-card border border-rose-border bg-rose-bg/40 p-5">
      <div className="flex items-start gap-3">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-rose" />
        <div>
          <h2 className="text-[14px] font-semibold text-ink">Calculation detail unavailable</h2>
          <p className="mt-1 text-[11.5px] text-ink-2">
            This figure's breakdown can't be shown. We won't substitute the newest calculation.
          </p>
          {message && <p className="mt-3 rounded-panel bg-paper px-3 py-2 font-mono text-[11px] break-words text-ink-2">{message}</p>}
          <p className="mt-3 text-[11px] text-ink-3">
            Common causes: a reference from before this format, another workspace's reference, missing policy versions, or
            totals that don't reconcile.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-3"
            onClick={() => {
              void queryClient.invalidateQueries({ queryKey: ["leakage"] });
              onClose();
            }}
          >
            Reload the map for a fresh reference
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Values that are the same on every candidate collapse to one entry. */
const distinct = (values: string[]) => [...new Set(values.filter(Boolean))];

function CalculationContent({ detail }: { detail: LeakageCalculationDetail }) {
  const { amount, components } = detail;
  const { currency } = amount;
  const reconciled = detail.reconciliationState === "RECONCILED";
  const includedCount = components.filter((c) => c.included).length;

  const policies = distinct(
    components.map((c) => `${c.correlationPolicyId} ${c.correlationPolicyVersion} · basis ${c.correlationModeBasis}`)
  );
  const assumptions = distinct(components.flatMap((c) => c.assumptions));
  const caveats = distinct(components.flatMap((c) => c.caveats));
  const baselines = distinct(components.map((c) => c.baselineReference));
  const lineage = distinct(components.flatMap((c) => c.sourceLineage));
  const versions = [
    ["calculation", distinct(components.map((c) => c.calculationVersion))],
    ["ramp", distinct(components.map((c) => c.rampVersion))],
    ["recovery", distinct(components.map((c) => c.recoveryVersion))],
    ["detector", distinct(components.map((c) => c.detectorVersion))],
    ["mapping", distinct(components.map((c) => c.mappingVersion))],
  ] as const;

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr]">
        <div className="rounded-card border border-rose-border bg-rose-bg/30 p-4">
          <p className="text-[11px] text-ink-3">Selected amount</p>
          <p className="mt-1 font-mono text-[26px] leading-none font-semibold text-ink">
            {formatExactMoney(detail.includedSelectedAmount, currency)}
          </p>
          <p className="mt-2 text-[11px] text-ink-3">
            {components.length} {components.length === 1 ? "candidate" : "candidates"} · sum of the included ones
            {includedCount < components.length ? ` (${includedCount} counted)` : ""}
          </p>
        </div>
        <div className={cn("rounded-card border p-4", reconciled ? "border-teal-border bg-teal-bg/50" : "border-amber-border bg-amber-bg")}>
          <p className={cn("flex items-center gap-1.5 text-[13px] font-semibold", reconciled ? "text-teal" : "text-amber")}>
            {reconciled ? <Check className="size-4" /> : <TriangleAlert className="size-4" />}
            {reconciled ? "Reconciled" : sentenceCase(detail.reconciliationState)}
          </p>
          <p className="mt-1.5 text-[11px] text-ink-2">
            {reconciled
              ? "The included parts add up to the figure shown, in all four totals."
              : "The included parts do not add up to the figure shown within the tolerance."}
          </p>
          <p className="mt-2 font-mono text-[10px] text-ink-3">
            Δ {formatPlainNumber(detail.selectedAmountDelta, 4)} · tolerance ±{detail.reconciliationTolerance} {currency}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 divide-x divide-y divide-line overflow-hidden rounded-card border border-line sm:grid-cols-4 sm:divide-y-0">
        <Total label="Included gross" value={formatExactMoney(detail.includedGross, currency, 4)} />
        <Total label="Included expected" value={formatExactMoney(detail.includedExpected, currency, 4)} />
        <Total label="Included net" value={formatExactMoney(detail.includedNet, currency, 4)} />
        <Total label={`Selected (${(MODE_TITLE[amount.mode.toUpperCase()] ?? amount.mode).toLowerCase()})`} value={formatExactMoney(detail.includedSelectedAmount, currency, 4)} />
      </dl>

      <CandidateTable components={components} currency={currency} />

      <div className="rounded-card border border-line bg-paper-2 px-4 py-3">
        <SectionLabel>How it is built</SectionLabel>
        <p className="mt-1 font-mono text-[11px] text-ink">{detail.formula}</p>
        <p className="mt-1.5 text-[11px] text-ink-3">{detail.aggregationNote}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoCard title="Correlation">
          <p>
            Candidates are de-duplicated under the policy below. An excluded candidate contributes nothing even though
            its own estimate is positive.
          </p>
          <ul className="mt-2 space-y-1 font-mono text-[10px] text-ink-3">
            {policies.map((policy) => (
              <li key={policy}>{policy}</li>
            ))}
          </ul>
          <p className="mt-2 text-[10.5px] text-ink-4">
            {includedCount} of {components.length} candidates counted.
            {components.some((c) => c.correlationModeBasis === "INFERRED_FROM_LEGACY_TOTALS") &&
              " This publication predates stored combination mode, so it is inferred from the published totals."}
          </p>
        </InfoCard>

        <InfoCard title="Range and confidence">
          <p>
            {amount.range.status === "UNAVAILABLE" || amount.range.lower == null || amount.range.upper == null
              ? "No range is available for this amount."
              : `${humanizeEnum(amount.range.status)} range ${formatCompactMoney(amount.range.lower, currency)} to ${formatCompactMoney(amount.range.upper, currency)}.`}{" "}
            {amount.confidenceLevel.toUpperCase() === "NOT_AVAILABLE"
              ? "Confidence is not rated."
              : `${humanizeEnum(amount.confidenceLevel)} confidence (${amount.confidence.toFixed(2)}).`}
          </p>
          <p className="mt-2 font-mono text-[10px] text-ink-3">
            {amount.range.version ?? "no range version"}
          </p>
          <p className="mt-2 text-[10.5px] text-ink-4">Ranges and confidence stay per candidate. No aggregate is invented.</p>
        </InfoCard>

        <InfoCard title="Baseline and source">
          {baselines.length > 0 && <p>Baseline {baselines.join(", ")}.</p>}
          {lineage.length > 0 && <p className="mt-1">From {lineage.join(" and ")}.</p>}
          <p className="mt-2 font-mono text-[10px] text-ink-3">
            {versions.map(([name, values]) => `${name} ${values.join(", ") || "–"}`).join(" · ")}
          </p>
        </InfoCard>

        <InfoCard title="Assumptions and caveats" tone="amber">
          {assumptions.length === 0 && caveats.length === 0 && <p>None recorded.</p>}
          {assumptions.map((a) => (
            <p key={a} className="mb-1">
              {a}
            </p>
          ))}
          {caveats.map((c) => (
            <p key={c} className="mb-1">
              {c}
            </p>
          ))}
        </InfoCard>
      </div>

      <ReferenceBlock detail={detail} />
    </>
  );
}

function Total({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3.5 py-3">
      <dt className="text-[10.5px] text-ink-4">{label}</dt>
      <dd className="mt-0.5 font-mono text-[12px] font-semibold break-words text-ink">{value}</dd>
    </div>
  );
}

function InfoCard({ title, tone, children }: { title: string; tone?: "amber"; children: ReactNode }) {
  return (
    <div className={cn("rounded-card border p-4 text-[11.5px] leading-relaxed text-ink-2", tone === "amber" ? "border-amber-border bg-amber-bg/60" : "border-line bg-paper")}>
      <SectionLabel>{title}</SectionLabel>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

/**
 * Every candidate's working: impact x ramp = gross, x probability = expected, x (1 - recovery) = net, and what it
 * contributes to the total. Money columns carry no symbol because the whole table is in one currency (stated in
 * the caption). An excluded candidate is struck through and contributes 0.
 */
function CandidateTable({ components, currency }: { components: LeakageCalculationComponent[]; currency: string }) {
  const [showAll, setShowAll] = useState(false);
  const rows = showAll ? components : components.slice(0, PREVIEW_ROWS);
  const money = (n: number) => formatPlainNumber(n, 2);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="text-[13px] font-semibold text-ink">Inputs by candidate</h3>
        {components.length > PREVIEW_ROWS && (
          <Button type="button" variant="outline" size="sm" onClick={() => setShowAll((prev) => !prev)}>
            {showAll ? `Show first ${PREVIEW_ROWS}` : `Show all ${components.length}`}
          </Button>
        )}
      </div>
      <div className="overflow-x-auto rounded-card border border-line">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="border-b border-line bg-paper-2 text-[10px] text-ink-4">
              <th className="px-2.5 py-2 font-medium">Candidate</th>
              <th className="px-1.5 py-2 text-right font-medium">Impact</th>
              <th className="px-1.5 py-2 text-right font-medium">× ramp</th>
              <th className="px-1.5 py-2 text-right font-medium text-ink">= Gross</th>
              <th className="px-1.5 py-2 text-right font-medium">× prob.</th>
              <th className="px-1.5 py-2 text-right font-medium">= Expected</th>
              <th className="px-1.5 py-2 text-right font-medium">× (1−rec.)</th>
              <th className="px-1.5 py-2 text-right font-medium">= Net</th>
              <th className="px-2.5 py-2 text-right font-medium">Contribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((c) => (
              <tr key={c.candidateId} className={cn("align-top", !c.included && "bg-paper-2/60")}>
                <td className="px-2.5 py-2">
                  <p className={cn("font-mono text-[10.5px] text-ink", !c.included && "line-through")}>{c.candidateId.slice(0, 8)}…</p>
                  <p className="text-[9.5px] text-ink-4">{c.included ? "Included" : sentenceCase(c.inclusionReason)}</p>
                </td>
                <td className="px-1.5 py-2 text-right font-mono text-ink-2">{money(c.impact)}</td>
                <td className="px-1.5 py-2 text-right font-mono text-ink-3">{c.rampFactor.toFixed(2)}</td>
                <td className="px-1.5 py-2 text-right font-mono font-semibold text-ink">{money(c.gross)}</td>
                <td className="px-1.5 py-2 text-right font-mono text-ink-3">{c.probability.toFixed(2)}</td>
                <td className="px-1.5 py-2 text-right font-mono text-ink-2">{money(c.expected)}</td>
                <td className="px-1.5 py-2 text-right font-mono text-ink-3">{(1 - c.recoveryRate).toFixed(2)}</td>
                <td className="px-1.5 py-2 text-right font-mono text-ink-2">{money(c.net)}</td>
                <td className={cn("px-2.5 py-2 text-right font-mono font-semibold", c.included ? "text-ink" : "text-rose")}>{money(c.contribution)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[10.5px] text-ink-4">
        Showing {rows.length} of {components.length} candidates. All amounts in {currency}. Ranges and confidence stay per candidate.
      </p>
    </div>
  );
}

/** The opaque reference, copyable, and which publication it is tied to. */
function ReferenceBlock({ detail }: { detail: LeakageCalculationDetail }) {
  const reference = detail.calculationReference;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      toast.success("Reference copied");
    } catch {
      toast.error("Couldn't copy the reference");
    }
  };
  return (
    <div className="rounded-card bg-paper-2 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-[11px] font-semibold text-ink">Reference</span>
          <span className="min-w-0 truncate font-mono text-[10.5px] text-ink-3" title={reference}>
            {reference}
          </span>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={copy}>
          <Copy data-icon="inline-start" />
          Copy
        </Button>
      </div>
      <p className="mt-1.5 font-mono text-[10px] text-ink-4">
        publication {detail.publicationId.slice(0, 8)} · run {detail.runId.slice(0, 8)} · stays tied to this publication after newer runs
      </p>
    </div>
  );
}
