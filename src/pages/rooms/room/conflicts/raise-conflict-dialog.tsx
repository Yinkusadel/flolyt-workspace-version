import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SearchableSelect, SearchableSelectSkeleton } from "@/components/ui/searchable-select";
import useGetSupportedCurrencies from "@/features/currency/use-get-supported-currencies";
import useCreateConflict from "@/features/rooms/use-create-conflict";

const MIN_READINGS = 2;
const MAX_READINGS = 5;

const FIELD_LABEL = "mb-1 block text-[11px] font-semibold text-ink-2";
const INPUT =
  "h-9 w-full rounded-control border border-line bg-paper px-3 text-[12px] text-ink outline-none placeholder:text-ink-4 focus:border-ultra disabled:opacity-60";
const AREA =
  "w-full resize-y rounded-panel border border-line bg-paper px-2.5 py-2 text-[12.5px] text-ink outline-none placeholder:text-ink-4 focus:border-ring disabled:opacity-60";

interface ReadingDraft {
  label: string;
  recommends: string;
  because: string;
  expectedReach: string;
  expectedEffect: string;
  currency: string;
  effectUnavailableBecause: string;
  longRunEffect: string;
}

const letter = (index: number) => String.fromCharCode(65 + index);

const emptyReading = (index: number): ReadingDraft => ({
  label: `Reading ${letter(index)}`,
  recommends: "",
  because: "",
  expectedReach: "",
  expectedEffect: "",
  currency: "",
  effectUnavailableBecause: "",
  longRunEffect: "",
});

const isCount = (value: string) => value === "" || (Number.isFinite(Number(value)) && Number(value) >= 0);

/** A reading is priced (an effect and its currency) or says why it can't be (the docs: never a silent zero). */
function readingProblem(reading: ReadingDraft): string | null {
  if (!reading.recommends.trim()) return "Say what it recommends.";
  if (!reading.because.trim()) return "Say why.";
  if (!isCount(reading.expectedReach)) return "Reach must be a number.";
  if (reading.expectedEffect !== "") {
    if (!isCount(reading.expectedEffect)) return "Expected effect must be a number.";
    if (reading.currency.trim().length !== 3) return "Give the effect's 3-letter currency, for example NGN.";
    return null;
  }
  return reading.effectUnavailableBecause.trim() ? null : "Give an expected effect, or say why it can't be priced.";
}

/**
 * "Raise a conflict": POST /rooms/{roomId}/conflicts. Live-verified (2026-10-12) that a person can raise one with
 * empty evidence claim ids. At least two readings, which is the dispute; one would be a recommendation.
 */
export function RaiseConflictDialog({
  roomId,
  open,
  onOpenChange,
}: {
  roomId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [summary, setSummary] = React.useState("");
  const [readings, setReadings] = React.useState<ReadingDraft[]>([emptyReading(0), emptyReading(1)]);
  const { createConflict, isPending } = useCreateConflict({ onSuccess: () => onOpenChange(false) });
  const { supportedCurrencies, isLoading: currenciesLoading } = useGetSupportedCurrencies();
  const currencyOptions = React.useMemo(
    () => (supportedCurrencies?.currencies ?? []).map((code) => ({ value: code, label: code })),
    [supportedCurrencies]
  );

  const problems = readings.map(readingProblem);
  const canSubmit = summary.trim().length > 0 && readings.length >= MIN_READINGS && problems.every((p) => p === null);

  const update = (index: number, patch: Partial<ReadingDraft>) =>
    setReadings((current) => current.map((reading, i) => (i === index ? { ...reading, ...patch } : reading)));

  const submit = () => {
    createConflict({
      roomId,
      summary: summary.trim(),
      readings: readings.map((reading, index) => {
        const priced = reading.expectedEffect !== "";
        return {
          key: letter(index).toLowerCase(),
          label: reading.label.trim() || `Reading ${letter(index)}`,
          recommends: reading.recommends.trim(),
          because: reading.because.trim(),
          // ❌ No evidence picker yet: it needs the Room's claims (Evidence tab). The backend accepts none.
          evidenceClaimIds: [],
          expectedReach: reading.expectedReach === "" ? null : Math.round(Number(reading.expectedReach)),
          expectedEffect: priced ? Number(reading.expectedEffect) : null,
          currency: priced ? reading.currency.trim().toUpperCase() : null,
          effectUnavailableBecause: priced ? null : reading.effectUnavailableBecause.trim(),
          longRunEffect: reading.longRunEffect.trim() || null,
        };
      }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Raise a conflict</DialogTitle>
          <DialogDescription>
            Two readings that disagree. The Room's decision owner decides between them. One reading would only be a
            recommendation.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="max-h-[65vh] space-y-5 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <label htmlFor="conflict-summary" className={FIELD_LABEL}>
              What is in dispute? (required)
            </label>
            <input
              id="conflict-summary"
              value={summary}
              disabled={isPending}
              onChange={(event) => setSummary(event.currentTarget.value)}
              placeholder="e.g. Voucher to everyone, or free delivery to the people it would actually fix?"
              className={INPUT}
            />
          </div>

          {readings.map((reading, index) => (
            <fieldset key={index} className="rounded-card border border-line bg-paper-2/50 p-4">
              <legend className="flex items-center gap-2 px-1 font-mono text-[11px] text-ink-3">
                {reading.label || `Reading ${letter(index)}`}
                {readings.length > MIN_READINGS && (
                  <button
                    type="button"
                    disabled={isPending}
                    aria-label={`Remove ${reading.label}`}
                    onClick={() => setReadings((current) => current.filter((_, i) => i !== index))}
                    className="text-ink-4 hover:text-rose"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </legend>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor={`r${index}-label`} className={FIELD_LABEL}>
                    Name
                  </label>
                  <input
                    id={`r${index}-label`}
                    value={reading.label}
                    disabled={isPending}
                    onChange={(event) => update(index, { label: event.currentTarget.value })}
                    className={INPUT}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={`r${index}-rec`} className={FIELD_LABEL}>
                    Recommends (required)
                  </label>
                  <input
                    id={`r${index}-rec`}
                    value={reading.recommends}
                    disabled={isPending}
                    onChange={(event) => update(index, { recommends: event.currentTarget.value })}
                    placeholder="e.g. 10% voucher to the whole cohort"
                    className={INPUT}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={`r${index}-why`} className={FIELD_LABEL}>
                    Because (required)
                  </label>
                  <textarea
                    id={`r${index}-why`}
                    rows={2}
                    value={reading.because}
                    disabled={isPending}
                    onChange={(event) => update(index, { because: event.currentTarget.value })}
                    className={AREA}
                  />
                </div>
                <div>
                  <label htmlFor={`r${index}-reach`} className={FIELD_LABEL}>
                    Expected reach (people)
                  </label>
                  <input
                    id={`r${index}-reach`}
                    inputMode="numeric"
                    value={reading.expectedReach}
                    disabled={isPending}
                    onChange={(event) => update(index, { expectedReach: event.currentTarget.value })}
                    className={INPUT}
                  />
                </div>
                <div className="grid grid-cols-[1fr_8rem] gap-2">
                  <div>
                    <label htmlFor={`r${index}-effect`} className={FIELD_LABEL}>
                      Expected effect
                    </label>
                    <input
                      id={`r${index}-effect`}
                      inputMode="decimal"
                      value={reading.expectedEffect}
                      disabled={isPending}
                      onChange={(event) => update(index, { expectedEffect: event.currentTarget.value })}
                      placeholder="Leave empty if unpriced"
                      className={INPUT}
                    />
                  </div>
                  <div>
                    <label htmlFor={`r${index}-cur`} className={FIELD_LABEL}>
                      Currency
                    </label>
                    {currenciesLoading ? (
                      <SearchableSelectSkeleton />
                    ) : currencyOptions.length > 0 ? (
                      // The app's supported currencies (the same list onboarding and Markets use).
                      <SearchableSelect
                        id={`r${index}-cur`}
                        options={currencyOptions}
                        value={reading.currency || null}
                        onChange={(currency) => update(index, { currency })}
                        placeholder="Select"
                        searchPlaceholder="Search..."
                        disabled={isPending || reading.expectedEffect === ""}
                        className="rounded-control bg-paper text-[12px]"
                      />
                    ) : (
                      // The list could not be loaded: keep the form usable with a typed 3-letter code.
                      <input
                        id={`r${index}-cur`}
                        maxLength={3}
                        value={reading.currency}
                        disabled={isPending || reading.expectedEffect === ""}
                        onChange={(event) => update(index, { currency: event.currentTarget.value.toUpperCase() })}
                        placeholder="NGN"
                        className={INPUT}
                      />
                    )}
                  </div>
                </div>
                {reading.expectedEffect === "" && (
                  <div className="sm:col-span-2">
                    <label htmlFor={`r${index}-unavail`} className={FIELD_LABEL}>
                      Why it can't be priced (required when there is no effect)
                    </label>
                    <input
                      id={`r${index}-unavail`}
                      value={reading.effectUnavailableBecause}
                      disabled={isPending}
                      onChange={(event) => update(index, { effectUnavailableBecause: event.currentTarget.value })}
                      placeholder="e.g. COGS source not connected"
                      className={INPUT}
                    />
                  </div>
                )}
                <div className="sm:col-span-2">
                  <label htmlFor={`r${index}-long`} className={FIELD_LABEL}>
                    Long-run effect (optional)
                  </label>
                  <input
                    id={`r${index}-long`}
                    value={reading.longRunEffect}
                    disabled={isPending}
                    onChange={(event) => update(index, { longRunEffect: event.currentTarget.value })}
                    className={INPUT}
                  />
                </div>
              </div>
              {problems[index] && (reading.recommends || reading.because || reading.expectedEffect) && (
                <p className="mt-2 text-[11.5px] text-rose">{problems[index]}</p>
              )}
            </fieldset>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending || readings.length >= MAX_READINGS}
            onClick={() => setReadings((current) => [...current, emptyReading(current.length)])}
          >
            <Plus className="size-3.5" />
            Add a reading
          </Button>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={submit} disabled={!canSubmit || isPending}>
              {isPending ? "Raising…" : "Raise conflict"}
            </Button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
