import type { CloseRoomPayload } from "@/services/api/rooms/close-room";
import type { MeasurementForm, OwedRow } from "@/pages/rooms/close/sections";

/** Everything the person has typed or chosen on the close page. */
export interface CloseFormState {
  kind: string | null;
  unmeasuredReason: string;
  supersededBy: string | null;
  measurement: MeasurementForm;
  ownObjection: string;
  owed: OwedRow[];
  note: string;
  revisit: string;
}

export const wholeNumber = (value: string) => (value.trim() !== "" && Number.isInteger(Number(value)) && Number(value) >= 0 ? Number(value) : null);

/**
 * Turns the form into the `POST /rooms/{roomId}/close` body and lists, in words, every required thing still missing (empty list: it can be sent).
 * Required by the schema (checked in Scalar 2026-10-17): `kind`; when a measurement is sent, ALL of contacted, heldBack, convertedContacted,
 * convertedHeldBack, recovered, currency, source, windowStartUtc, windowEndUtc; per obligation, description and toUserId. Everything else is
 * nullable: note, dissent (a string), supersededByRoomId, unmeasuredReason, revisitCondition, excluded, excludedReason and the three rates.
 * A measurement is sent only for "money-recovered"; every other ending sends `measurement: null`, which the schema allows.
 */
export function buildClosePayload(roomId: string, currency: string, form: CloseFormState): { payload: CloseRoomPayload | null; missing: string[]; draft: Record<string, unknown> } {
  const missing: string[] = [];
  const m = form.measurement;
  const counts = [m.contacted, m.heldBack, m.convertedContacted, m.convertedHeldBack, m.recovered].map(wholeNumber);

  if (!form.kind) missing.push("Choose how it ended.");
  if (form.kind === "superseded" && !form.supersededBy) missing.push("Choose the room that took this over.");
  if (form.kind === "unmeasurable" && !form.unmeasuredReason.trim()) missing.push("Say why no honest number attaches.");
  if (form.kind === "money-recovered") {
    if (counts.some((count) => count === null)) missing.push("Enter all five counts.");
    if (!m.source.trim()) missing.push("Say where the counts came from.");
    if (!m.windowStart || !m.windowEnd) missing.push("Enter the window.");
  }
  if (form.owed.some((row) => Boolean(row.description.trim()) !== Boolean(row.toUserId))) missing.push("Each obligation needs what and who.");

  // What the body holds so far, for the console log only: whatever is filled in, `null` for what is not. Never sent.
  const draft: Record<string, unknown> = {
    roomId,
    kind: form.kind,
    measurement:
      form.kind === "money-recovered"
        ? {
            contacted: counts[0],
            heldBack: counts[1],
            convertedContacted: counts[2],
            convertedHeldBack: counts[3],
            recovered: counts[4],
            currency,
            source: m.source.trim() || null,
            excluded: wholeNumber(m.excluded),
            excludedReason: m.excludedReason.trim() || null,
            windowStartUtc: m.windowStart ? `${m.windowStart}T00:00:00Z` : null,
            windowEndUtc: m.windowEnd ? `${m.windowEnd}T23:59:59Z` : null,
          }
        : null,
    note: form.note.trim() || null,
    dissent: form.ownObjection.trim() || null,
    supersededByRoomId: form.kind === "superseded" ? form.supersededBy : null,
    unmeasuredReason: form.kind === "unmeasurable" ? form.unmeasuredReason.trim() || null : null,
    revisitCondition: form.revisit.trim() || null,
    outstanding: form.owed.map((row) => ({ toUserId: row.toUserId, description: row.description.trim() || null, proposedDueAtUtc: row.due ? `${row.due}T00:00:00Z` : null })),
  };

  if (missing.length > 0 || !form.kind) return { payload: null, missing, draft };

  const owedFilled = form.owed.filter((row) => row.description.trim() && row.toUserId);
  const payload: CloseRoomPayload = {
    roomId,
    kind: form.kind,
    measurement:
      form.kind === "money-recovered"
        ? {
            contacted: counts[0]!,
            heldBack: counts[1]!,
            convertedContacted: counts[2]!,
            convertedHeldBack: counts[3]!,
            recovered: counts[4]!,
            currency,
            excluded: wholeNumber(m.excluded),
            excludedReason: m.excludedReason.trim() || null,
            windowStartUtc: `${m.windowStart}T00:00:00Z`,
            windowEndUtc: `${m.windowEnd}T23:59:59Z`,
            source: m.source.trim(),
            contactedRate: null,
            heldBackRate: null,
            liftPoints: null,
          }
        : null,
    ...(form.note.trim() ? { note: form.note.trim() } : {}),
    ...(form.ownObjection.trim() ? { dissent: form.ownObjection.trim() } : {}),
    ...(form.kind === "superseded" && form.supersededBy ? { supersededByRoomId: form.supersededBy } : {}),
    ...(form.kind === "unmeasurable" ? { unmeasuredReason: form.unmeasuredReason.trim() } : {}),
    ...(form.revisit.trim() ? { revisitCondition: form.revisit.trim() } : {}),
    ...(owedFilled.length > 0
      ? {
          outstanding: owedFilled.map((row) => ({
            toUserId: row.toUserId!,
            description: row.description.trim(),
            class: "other",
            ...(row.due ? { proposedDueAtUtc: `${row.due}T00:00:00Z` } : {}),
          })),
        }
      : {}),
  };
  return { payload, missing, draft };
}
