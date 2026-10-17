import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { SearchableSelect, type SearchableSelectOption } from "@/components/ui/searchable-select";
import { formatDay, formatMoney, humanize } from "@/pages/rooms/convening/format";
import type { RoomClosePreviewData } from "@/services/api/rooms/get-room-close-preview";

export const FIELD_LABEL = "mb-1.5 block text-[11px] font-semibold text-ink-2";
export const INPUT =
  "h-9 w-full rounded-panel border border-line bg-paper-2 px-2.5 text-[12.5px] text-ink outline-none placeholder:text-ink-4 focus:border-ring disabled:opacity-60";
export const AREA =
  "w-full resize-y rounded-panel border border-line bg-paper-2 px-2.5 py-2 text-[12.5px] text-ink outline-none placeholder:text-ink-4 focus:border-ring disabled:opacity-60";

/** What each ending means, in the design's words. The API names only the kind and what it needs, so an unknown kind simply has no sentence. */
const OUTCOME_COPY: Record<string, string> = {
  "money-recovered": "The plays brought money back, measured against a group that was held back.",
  "no-action-needed": "Real, but not worth fixing, or it resolved by itself.",
  superseded: "Another room carries this work.",
  disproven: "The leak wasn't what it looked like.",
  unmeasurable: "Something happened, but no number would be honest.",
};

export function StepHeading({ step, title, children }: { step: number; title: string; children?: React.ReactNode }) {
  return (
    <div>
      <h2 className="flex items-center gap-2.5 text-[17px] font-semibold text-ink">
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-ink font-mono text-[12px] text-paper">{step}</span>
        {title}
      </h2>
      {children && <p className="mt-1.5 text-[12.5px] text-ink-3">{children}</p>}
    </div>
  );
}

function Tile({ label, children, note, tone }: { label: string; children: React.ReactNode; note?: string; tone?: "amber" }) {
  return (
    <div className={cn("rounded-panel px-4 py-3.5", tone === "amber" ? "border border-amber-border bg-amber-bg/60" : "bg-paper-2")}>
      <p className={cn("font-mono text-[10px] font-medium tracking-[0.8px] uppercase", tone === "amber" ? "text-amber" : "text-ink-3")}>{label}</p>
      <p className="mt-1.5 font-mono text-[18px] leading-tight font-semibold text-ink">{children}</p>
      {note && <p className="mt-1.5 text-[11.5px] text-ink-3">{note}</p>}
    </div>
  );
}

/** What closing would record about the Room, read by the same code the close uses. */
export function SummaryCard({ preview }: { preview: RoomClosePreviewData }) {
  const count = (value: number | null) => (value === null ? "-" : value.toLocaleString("en-US"));
  const money = (value: number | null) => formatMoney(value, preview.currency) ?? "-";
  const facts = [
    `Opening ${preview.openingNumber}`,
    `Opened ${formatDay(preview.openedAtUtc)}`,
    `${preview.openDays} ${preview.openDays === 1 ? "day" : "days"} open`,
    `${preview.people} ${preview.people === 1 ? "person" : "people"}`,
    `${preview.agents} ${preview.agents === 1 ? "agent" : "agents"}`,
    `${preview.plays} ${preview.plays === 1 ? "play" : "plays"}, ${preview.playsApproved} approved`,
  ];
  const nowUnavailable = preview.currentPopulation === null && preview.currentAmountAtRisk === null;
  return (
    <section className="rounded-card border border-line bg-paper px-5 py-5">
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink-2">
        {facts.map((fact) => (
          <span key={fact}>{fact}</span>
        ))}
      </p>
      <div className="mt-4 grid gap-3 @3xl:grid-cols-3">
        <Tile label="People · open → now">
          {count(preview.populationAtOpen)} → {count(preview.currentPopulation)}
        </Tile>
        <Tile label="At risk · open → now">
          {money(preview.amountAtOpen)} → {money(preview.currentAmountAtRisk)}
        </Tile>
        {/* ❌ Backend does NOT provide: `delta`, `currentPopulation`, `currentAmountAtRisk` when the leak cell no longer exists (null on the real responses of 2026-10-17). */}
        <Tile
          label="Cell change"
          tone="amber"
          note={
            preview.delta === null
              ? preview.deltaUnavailableBecause
                ? `Not available: ${preview.deltaUnavailableBecause}.`
                : "Not available."
              : "The leak now against the opening figure. This is not a recovery claim."
          }
        >
          {preview.delta === null ? "-" : money(preview.delta)}
        </Tile>
      </div>
      {nowUnavailable && <p className="mt-3 text-[11.5px] text-ink-3">The "now" figures are read from the leakage map when you close; today there is nothing to read.</p>}
    </section>
  );
}

/** The five endings. None is ranked and none is chosen for the person. An ending that cannot be chosen yet says why in the backend's words. */
export function OutcomePicker({ preview, kind, onChange }: { preview: RoomClosePreviewData; kind: string | null; onChange: (kind: string) => void }) {
  return (
    <div className="mt-4 grid gap-3 @3xl:grid-cols-3" role="radiogroup" aria-label="How did it end?">
      {preview.outcomes.map((outcome) => {
        const selected = kind === outcome.kind;
        return (
          <label
            key={outcome.kind}
            className={cn(
              "flex flex-col gap-1.5 rounded-card border bg-paper px-4 py-4",
              outcome.available ? "cursor-pointer hover:bg-paper-2/50" : "cursor-not-allowed opacity-60",
              selected ? "border-ultra ring-1 ring-ultra" : "border-line"
            )}
          >
            <span className="flex items-center gap-2.5 text-[13.5px] font-semibold text-ink">
              <input type="radio" name="close-outcome" disabled={!outcome.available} checked={selected} onChange={() => onChange(outcome.kind)} />
              {humanize(outcome.kind)}
            </span>
            {OUTCOME_COPY[outcome.kind] && <span className="text-[12px] text-ink-2">{OUTCOME_COPY[outcome.kind]}</span>}
            {outcome.needs && <span className="text-[11.5px] text-ink-3">Needs: {outcome.needs}</span>}
            {!outcome.available && outcome.whyNot && <Chip tone="amber">Not yet: {outcome.whyNot}</Chip>}
          </label>
        );
      })}
    </div>
  );
}

export interface MeasurementForm {
  contacted: string;
  heldBack: string;
  convertedContacted: string;
  convertedHeldBack: string;
  recovered: string;
  windowStart: string;
  windowEnd: string;
}

export const EMPTY_MEASUREMENT: MeasurementForm = { contacted: "", heldBack: "", convertedContacted: "", convertedHeldBack: "", recovered: "", windowStart: "", windowEnd: "" };

function NumberField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label htmlFor={id} className={FIELD_LABEL}>
        {label}
      </label>
      <input id={id} type="number" min={0} inputMode="numeric" value={value} onChange={(event) => onChange(event.currentTarget.value)} className={INPUT} />
    </div>
  );
}

/**
 * Step 2. What the preview knows about the measurement (plan, suggested window, linked campaigns, why the counts must be entered), then the
 * by-hand counts, shown only when "Money recovered" is chosen: no other ending carries a measurement.
 */
export function MeasurementSection({
  preview,
  kind,
  form,
  onChange,
}: {
  preview: RoomClosePreviewData;
  kind: string | null;
  form: MeasurementForm;
  onChange: (next: MeasurementForm) => void;
}) {
  const plan = preview.plan;
  const window = preview.suggestedWindow;
  const set = (key: keyof MeasurementForm) => (value: string) => onChange({ ...form, [key]: value });
  const impact = preview.recoveredImpact;
  return (
    <div className="mt-4 space-y-4 rounded-card border border-line bg-paper px-5 py-5">
      {/* ❌ Backend does NOT provide: `plan` (null on the real responses of 2026-10-17), so held back, measured over, primary measure and revenue basis are empty. */}
      {plan ? (
        <div className="grid gap-3 sm:grid-cols-2 @3xl:grid-cols-4">
          <Tile label="Held back">{plan.holdoutPercent === null ? "-" : `${plan.holdoutPercent}%`}</Tile>
          <Tile label="Measured over">{plan.measuredOverDays} days</Tile>
          <Tile label="Primary measure">{humanize(plan.primaryMeasure)}</Tile>
          <Tile label="Revenue basis">{humanize(plan.revenueBasis)}</Tile>
        </div>
      ) : (
        <p className="text-[12.5px] text-ink-3">This room has no measurement plan yet: nothing says how much was held back, over how long, or by what measure.</p>
      )}
      {plan?.noHoldoutBecause && <p className="text-[12px] text-ink-2">No holdout because: {plan.noHoldoutBecause}</p>}
      {window && (
        <p className="rounded-panel bg-paper-2 px-3.5 py-2.5 text-[12.5px] text-ink-2">
          Suggested window: {formatDay(window.startUtc)} → {formatDay(window.endUtc)} ({window.days} days), counted from the first approved play.{" "}
          <span className="font-semibold text-ink">{window.hasElapsed ? "It has elapsed." : "It hasn't elapsed yet."}</span>
        </p>
      )}

      <div>
        <p className="font-mono text-[10px] font-medium tracking-[0.8px] text-ink-3 uppercase">Linked campaigns</p>
        {preview.linkedCampaigns.length === 0 ? (
          <p className="mt-1.5 text-[12.5px] text-ink-3">No campaign is linked to this room's plays.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {preview.linkedCampaigns.map((campaign) => (
              <li key={campaign.campaignId} className="flex flex-wrap items-center justify-between gap-2 rounded-panel border border-line px-3.5 py-2.5 text-[12.5px]">
                <span>
                  <span className="font-semibold text-ink">{campaign.name}</span> <span className="text-ink-3">· from the play {campaign.playSummary}</span>
                </span>
                <span className="font-mono text-ink-2">
                  treatment {campaign.treatment.toLocaleString("en-US")} · holdout {campaign.holdout.toLocaleString("en-US")}
                </span>
              </li>
            ))}
          </ul>
        )}
        {preview.holdoutHonoured === false && <p className="mt-2 text-[12px] text-rose">Holdout not honoured: nobody was held back, so no lift can be computed from this campaign.</p>}
      </div>

      {preview.measurementMustBeSupplied && preview.measurementMustBeSuppliedBecause && (
        <p className="text-[12px] text-ink-2">{preview.measurementMustBeSuppliedBecause}</p>
      )}
      {preview.measurementUnavailableBecause && <p className="text-[12px] text-ink-2">{preview.measurementUnavailableBecause}</p>}
      {impact && !impact.isAvailable && (
        <p className="text-[12px] text-ink-3">
          No recovery can be claimed yet{impact.missingSource ? `: missing ${impact.missingSource}` : ""}.
          {impact.wouldUnlock ? ` Having it would unlock ${impact.wouldUnlock}.` : ""}
        </p>
      )}

      {kind === "money-recovered" ? (
        <div className="space-y-3 border-t border-line pt-4">
          <p className="text-[12.5px] font-semibold text-ink">Enter the counts by hand</p>
          <div className="grid gap-3 sm:grid-cols-2 @3xl:grid-cols-3">
            <NumberField id="m-contacted" label="Contacted" value={form.contacted} onChange={set("contacted")} />
            <NumberField id="m-held" label="Held back" value={form.heldBack} onChange={set("heldBack")} />
            <NumberField id="m-conv-c" label="Converted (contacted)" value={form.convertedContacted} onChange={set("convertedContacted")} />
            <NumberField id="m-conv-h" label="Converted (held back)" value={form.convertedHeldBack} onChange={set("convertedHeldBack")} />
            <NumberField id="m-recovered" label={`Recovered (${preview.currency})`} value={form.recovered} onChange={set("recovered")} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="m-start" className={FIELD_LABEL}>
                Window starts
              </label>
              <input id="m-start" type="date" value={form.windowStart} onChange={(event) => set("windowStart")(event.currentTarget.value)} className={INPUT} />
            </div>
            <div>
              <label htmlFor="m-end" className={FIELD_LABEL}>
                Window ends
              </label>
              <input id="m-end" type="date" value={form.windowEnd} onChange={(event) => set("windowEnd")(event.currentTarget.value)} className={INPUT} />
            </div>
          </div>
        </div>
      ) : (
        <p className="border-t border-line pt-3 text-[12px] text-ink-3">Counts are only entered when the room is closed as "Money recovered"; the other endings carry no measurement.</p>
      )}
    </div>
  );
}

/** Predictions and objections exactly as the outcome will snapshot them (the same lists the close reads). */
export function CarriedSection({ preview }: { preview: RoomClosePreviewData }) {
  return (
    <div className="mt-4 grid gap-4 @4xl:grid-cols-2">
      <div className="overflow-hidden rounded-card border border-line bg-paper">
        <h3 className="px-5 py-3.5 text-[14px] font-semibold text-ink">
          Predictions <span className="font-normal text-ink-3">· the room's falsifiers</span>
        </h3>
        {preview.predictions.length === 0 ? (
          <p className="border-t border-line px-5 py-5 text-[12.5px] text-ink-3">No condition was named for this room.</p>
        ) : (
          <ul>
            {preview.predictions.map((prediction, index) => (
              <li key={`${prediction.addedAtUtc}-${index}`} className="border-t border-line px-5 py-3.5 text-[13px] leading-relaxed text-ink">
                <span className="font-semibold">If</span> {prediction.condition} → <span className="text-ink-2">{prediction.thenWhat}</span>
                <span className="mt-1.5 block">
                  {prediction.metAtUtc ? <Chip tone="amber">Met {formatDay(prediction.metAtUtc)}</Chip> : <Chip className="border-dashed bg-transparent">Not met</Chip>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="overflow-hidden rounded-card border border-line bg-paper">
        <h3 className="px-5 py-3.5 text-[14px] font-semibold text-ink">
          Objections <span className="font-normal text-ink-3">· in their original wording</span>
        </h3>
        {preview.dissent.length === 0 ? (
          <p className="border-t border-line px-5 py-5 text-[12.5px] text-ink-3">No objection was recorded on this room.</p>
        ) : (
          <ul>
            {preview.dissent.map((objection, index) => (
              <li key={`${objection.recordedAtUtc}-${index}`} className="border-t border-line px-5 py-3.5">
                <p className="text-[13px] text-ink">“{objection.wording}”</p>
                <p className="mt-1 text-[11.5px] text-ink-3">
                  {objection.by} ·{" "}
                  {objection.borneOut === true ? "borne out" : objection.borneOut === false ? "shown wrong" : "not yet judged"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export interface OwedRow {
  key: number;
  description: string;
  toUserId: string | null;
  due: string;
}

/** Step 4: follow-ups to hand off out of the Room. A row needs both what and who; the date is optional. */
export function OwedSection({
  rows,
  people,
  onChange,
}: {
  rows: OwedRow[];
  people: SearchableSelectOption[];
  onChange: (rows: OwedRow[]) => void;
}) {
  const nextKey = React.useRef(rows.length + 1);
  const update = (key: number, patch: Partial<OwedRow>) => onChange(rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  return (
    <div className="mt-4 space-y-3 rounded-card border border-line bg-paper px-5 py-5">
      {rows.length === 0 && <p className="text-[12.5px] text-ink-3">Nothing is owed. Add an item to hand a follow-up to somebody when the room closes.</p>}
      {rows.map((row) => (
        <div key={row.key} className="grid items-end gap-3 @3xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_11rem_auto]">
          <div>
            <label htmlFor={`owed-what-${row.key}`} className={FIELD_LABEL}>
              What
            </label>
            <input id={`owed-what-${row.key}`} value={row.description} onChange={(event) => update(row.key, { description: event.currentTarget.value })} className={INPUT} />
          </div>
          <div>
            <span className={FIELD_LABEL}>Who</span>
            <SearchableSelect options={people} value={row.toUserId} onChange={(value) => update(row.key, { toUserId: value })} placeholder="Choose a person" searchPlaceholder="Search people" emptyText="Nobody to hand it to." />
          </div>
          <div>
            <label htmlFor={`owed-by-${row.key}`} className={FIELD_LABEL}>
              By
            </label>
            <input id={`owed-by-${row.key}`} type="date" value={row.due} onChange={(event) => update(row.key, { due: event.currentTarget.value })} className={INPUT} />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => onChange(rows.filter((candidate) => candidate.key !== row.key))}>
            <Trash2 className="size-3.5" aria-hidden />
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...rows, { key: nextKey.current++, description: "", toUserId: null, due: "" }])}>
        <Plus className="size-3.5" aria-hidden />
        Add obligation
      </Button>
    </div>
  );
}
