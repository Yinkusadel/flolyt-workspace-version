import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Chip, type ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { DROPOUT_TONE, ROOM_RULE_OPERATORS } from "@/pages/everyday/rooms/new/new-room-data";
import useGetSupportedCurrencies from "@/features/currency/use-get-supported-currencies";
import useEstimateNewRoomCohort from "@/features/rooms/use-estimate-new-room-cohort";
import useGetSimilarRooms from "@/features/rooms/use-get-similar-rooms";
import type { RoomSegmentRuleInput } from "@/services/api/rooms/estimate-new-room-cohort";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const DEBOUNCE_MS = 400;

const SIMILAR_STATE_TONE: Record<string, ChipTone> = {
  open: "amber",
  recovering: "ultra",
  stale: "rose",
  archived: "neutral",
};

function fmt(n: number): string {
  return n.toLocaleString();
}

/** A guidance line that still reads as a designed element, not bare floating text. */
function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper-2 px-4 py-3 text-[11.5px] text-ink-3">
      {children}
    </div>
  );
}

/** Shares the populated cohort card's exact frame so the layout doesn't jump once real numbers land. */
function CohortCardSkeleton() {
  return (
    <div className="rounded-card border-2 border-line bg-paper-2 p-5">
      <Skeleton className="h-4.5 w-72 max-w-full" />
      <Skeleton className="mt-2.5 h-3 w-52 max-w-full" />
      <Skeleton className="mt-1.5 h-2.5 w-60 max-w-full" />
    </div>
  );
}

function SimilarRoomsSkeleton() {
  return (
    <div className="mt-2 space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="ml-auto h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

/** Same dashed-card language as the page-level empty states (e.g. NoSegmentsYetState), scaled down for an inline section. */
function SimilarRoomsEmptyState() {
  return (
    <div className="mt-2 rounded-card border border-dashed border-line bg-paper p-6 text-center">
      <p className="text-[12.5px] font-semibold text-ink">Nothing similar found</p>
      <p className="mx-auto mt-1 max-w-sm text-[11px] leading-relaxed text-ink-3">
        No other open room is already working this cohort — safe to keep going.
      </p>
    </div>
  );
}

export interface AudienceStepValue {
  rules: RoomSegmentRuleInput[];
  currency: string | null;
}

interface StepAudienceProps {
  value: AudienceStepValue;
  onChange: (value: AudienceStepValue) => void;
}

/**
 * R07 — New room · who is in it.
 *
 * `field` on a rule is free text, not picked from a vocabulary — the endpoint's own spec gives
 * it no enum, and a live test (an unrecognized field string) returned 200 with a 0/irrelevant
 * count rather than a 400. Only `operator` gets a real picker, since that IS a fixed backend
 * enum. See ROOM_RULE_OPERATORS in new-room-data.ts.
 */
export function StepAudience({ value, onChange }: StepAudienceProps) {
  const { rules, currency } = value;
  const { supportedCurrencies, isPending: currenciesPending } = useGetSupportedCurrencies();
  const {
    estimateCohort,
    estimate,
    isPending: estimatePending,
    isError: estimateErrored,
    error: estimateError,
  } = useEstimateNewRoomCohort();
  const {
    findSimilarRooms,
    similar,
    isPending: similarPending,
    isError: similarErrored,
    error: similarError,
  } = useGetSimilarRooms();

  // TEMP DEBUG — remove once the new-room wizard's fields are all wired and reviewed.
  React.useEffect(() => {
    console.log("[new-room] audience step:", value);
  }, [value]);

  const validRules = React.useMemo(() => rules.filter((r) => r.field.trim().length > 0), [rules]);
  const readyToCount = Boolean(currency) && validRules.length > 0;
  const validRulesKey = JSON.stringify(validRules);

  React.useEffect(() => {
    if (!currency || validRules.length === 0) return;
    const timeout = setTimeout(() => {
      estimateCohort({ rules: validRules, currency });
      findSimilarRooms({ rules: validRules, currency, limit: 5 });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timeout);
    // Re-runs only when the rule content or currency actually changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validRulesKey, currency]);

  const updateRule = (index: number, patch: Partial<RoomSegmentRuleInput>) => {
    onChange({ ...value, rules: rules.map((r, i) => (i === index ? { ...r, ...patch } : r)) });
  };

  const addRule = () => {
    onChange({
      ...value,
      rules: [...rules, { field: "", operator: "Equals", value: null, logicOperator: "And", order: rules.length }],
    });
  };

  const removeRule = (index: number) => {
    onChange({ ...value, rules: rules.filter((_, i) => i !== index).map((r, i) => ({ ...r, order: i })) });
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Currency</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {currenciesPending &&
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-7 w-14 rounded-control" />)}
          {!currenciesPending &&
            (supportedCurrencies?.currencies ?? []).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChange({ ...value, currency: c })}
                className={cn(
                  "rounded-control border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase transition-colors",
                  currency === c
                    ? "border-ultra-border bg-ultra-bg text-ultra"
                    : "border-line bg-paper text-ink-3 hover:text-ink"
                )}
              >
                {c}
              </button>
            ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Who is in it</p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <div className="min-w-[620px] divide-y divide-line">
            {rules.map((row, index) => {
              const op = ROOM_RULE_OPERATORS.find((o) => o.value === row.operator);
              return (
                <div key={index} className="flex items-center gap-2 px-4 py-3 text-[12px]">
                  {index > 0 ? (
                    <select
                      value={row.logicOperator ?? "And"}
                      onChange={(e) => updateRule(index, { logicOperator: e.currentTarget.value })}
                      className="shrink-0 rounded-control border border-line bg-paper-2 px-1.5 py-1 font-mono text-[10px] text-ink-3 uppercase"
                    >
                      <option value="And">and</option>
                      <option value="Or">or</option>
                    </select>
                  ) : (
                    <span className="w-[38px] shrink-0" />
                  )}
                  <input
                    value={row.field}
                    onChange={(e) => updateRule(index, { field: e.currentTarget.value })}
                    placeholder="Field, e.g. daysSinceFirstOrder"
                    className="min-w-0 flex-1 rounded-control border border-line bg-paper-2 px-2.5 py-1.5 text-[12px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-ink-4"
                  />
                  <select
                    value={row.operator}
                    onChange={(e) => updateRule(index, { operator: e.currentTarget.value })}
                    className="shrink-0 rounded-control border border-line bg-paper-2 px-2 py-1.5 font-mono text-[10.5px] text-ink-3"
                  >
                    {ROOM_RULE_OPERATORS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  {op?.needsValue !== false && (
                    <input
                      value={row.value === null ? "" : String(row.value)}
                      onChange={(e) => updateRule(index, { value: e.currentTarget.value })}
                      placeholder="Value"
                      className="w-32 shrink-0 rounded-control border border-line bg-paper-2 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-ink-2 outline-none placeholder:font-normal placeholder:text-ink-4"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    aria-label="Remove condition"
                    className="shrink-0 text-ink-4 hover:text-rose"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={addRule}
              className="flex w-full items-center gap-1.5 px-4 py-3 text-left text-[12px] font-semibold text-ultra"
            >
              <Plus className="size-3.5" /> Add a condition
            </button>
          </div>
        </div>
      </div>

      {!readyToCount && (
        <Hint>
          {currency ? "Add at least one condition to see who's in it." : "Pick a currency and add at least one condition to see who's in it."}
        </Hint>
      )}

      {readyToCount && estimatePending && <CohortCardSkeleton />}

      {readyToCount && estimateErrored && (
        <p className="rounded-control border border-rose-border bg-rose-bg px-3.5 py-2.5 text-[11.5px] text-rose">
          {estimateError?.message ?? "Couldn't count this cohort."}
        </p>
      )}

      {readyToCount && !estimatePending && !estimateErrored && estimate && (
        <div className="rounded-card border-2 border-ultra-border bg-ultra-bg p-5">
          <p className="text-[16px] font-semibold text-ultra">
            {fmt(estimate.reachable)} reachable of {fmt(estimate.matched)} matched
            {estimate.amountAtRisk !== null && ` · ${estimate.currency} ${fmt(estimate.amountAtRisk)} at stake`}
          </p>
          <p className="mt-1.5 text-[11px] text-ink-2">
            Counted just now
            {estimate.outsideCurrency > 0 && ` · ${fmt(estimate.outsideCurrency)} outside ${estimate.currency}, not counted`}
          </p>
          <p className="mt-0.5 text-[10.5px] text-ink-3">Recount as you type · this is a live query, not a saved list</p>
        </div>
      )}

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Rooms that already exist about something similar
        </p>
        {!readyToCount && <div className="mt-2"><Hint>Checked once a currency and a condition are set.</Hint></div>}
        {readyToCount && similarPending && <SimilarRoomsSkeleton />}
        {readyToCount && similarErrored && (
          <p className="mt-2 rounded-control border border-rose-border bg-rose-bg px-3.5 py-2.5 text-[11.5px] text-rose">
            {similarError?.message ?? "Couldn't check for similar rooms."}
          </p>
        )}
        {readyToCount && !similarPending && !similarErrored && similar && similar.rooms.length === 0 && <SimilarRoomsEmptyState />}
        {readyToCount && !similarPending && !similarErrored && similar && similar.rooms.length > 0 && (
          <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
            <table className="w-full min-w-[760px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-line bg-paper-2">
                  <th className={HEAD_CLASS}>Room</th>
                  <th className={HEAD_CLASS}>Population</th>
                  <th className={HEAD_CLASS}>Shared with yours</th>
                  <th className={HEAD_CLASS}>Owner</th>
                  <th className={HEAD_CLASS}>State</th>
                  <th className={HEAD_CLASS}>Suggestion</th>
                </tr>
              </thead>
              <tbody>
                {similar.rooms.map((room) => (
                  <tr key={room.roomId} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-semibold text-ink-2">{room.title}</td>
                    <td className="px-4 py-3 font-mono text-ink">{room.population !== null ? fmt(room.population) : "—"}</td>
                    <td className="px-4 py-3 font-mono text-ink">{fmt(room.sharedCustomers)}</td>
                    <td className="px-4 py-3 text-ink-2">{room.ownerName ?? "Unassigned"}</td>
                    <td className="px-4 py-3">
                      <Chip tone={SIMILAR_STATE_TONE[room.state] ?? "neutral"}>{room.state}</Chip>
                    </td>
                    <td className="px-4 py-3 text-[10.5px] text-ink-3">{room.suggestion ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {readyToCount && !estimatePending && !estimateErrored && estimate && (
        <div>
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            Who drops out, and why · shown now rather than at send
          </p>
          <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
            <div className="min-w-[560px] divide-y divide-line">
              {estimate.dropOut.map((row) => (
                <div key={row.key} className="flex items-center gap-3 px-4 py-3 text-[12px]">
                  <span className="text-ink-2">{row.label}</span>
                  <span
                    className={cn(
                      "ml-auto font-mono font-semibold whitespace-nowrap",
                      TONE_TEXT_CLASS[DROPOUT_TONE[row.key] ?? "neutral"]
                    )}
                  >
                    {fmt(row.customers)}
                  </span>
                  {row.why && <span className="w-64 shrink-0 text-right font-mono text-[10.5px] text-ink-3">{row.why}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">The room will carry the reachable figure, not the matched one</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            A room that opens on the larger number and sends to the smaller one produces a campaign that worked
            being reviewed as one that failed. The exclusions are known now, so the room carries the reachable
            figure from the first minute — and the customers who cannot be reached are still listed, because they
            are a finding of their own.
          </p>
        </div>
      </div>
    </div>
  );
}
