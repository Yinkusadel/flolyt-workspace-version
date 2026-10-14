import * as React from "react";
import { Lock } from "lucide-react";

import { ConfirmModal } from "@/components/confirm-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/utils/auth-context";
import useCreateRoomGuardrail from "@/features/rooms/use-create-room-guardrail";
import useDeleteRoomGuardrail from "@/features/rooms/use-delete-room-guardrail";
import { useGetRoomGuardrails } from "@/features/rooms/use-get-room-guardrails";
import { formatDay, humanize } from "@/pages/rooms/convening/format";
import type { RoomGuardrailDto } from "@/services/api/rooms/get-room-guardrails";

const CARD = "overflow-hidden rounded-card border border-line bg-paper";
const INPUT =
  "h-9 w-full rounded-control border border-line bg-paper px-3 text-[12.5px] text-ink outline-none placeholder:text-ink-4 focus:border-ultra disabled:opacity-60";
const LABEL = "mb-1 block text-[11px] font-semibold text-ink-2";

/** "excluded permanently, before..." as a sentence: first letter up, nothing else changed (the text is the backend's own). */
const sentence = (text: string) => (text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}${/[.!?]$/.test(text) ? "" : "."}` : "");

/** `overridable` as the backend sends it: "never" (seen live; the docs also say "no") cannot be lifted by anyone, "by-its-author" only by whoever set it. */
const isUnliftable = (guardrail: RoomGuardrailDto) => guardrail.overridable === "never" || guardrail.overridable === "no";

/** Why nothing is listed under "Already prevented". Only `not-yet-computed` has been seen; any other reason shows as plain words. */
const absentReason = (reason: string | null) =>
  reason === "not-yet-computed" ? "These numbers haven't been computed yet." : reason ? `${humanize(reason)}.` : "Nothing has been stopped yet.";

function GuardrailsSkeleton() {
  return (
    <div className="grid items-start gap-6 @5xl:grid-cols-[minmax(0,1fr)_380px]" aria-busy="true" aria-label="Loading the guardrails">
      <Skeleton className="h-72 rounded-card" />
      <Skeleton className="h-52 rounded-card" />
    </div>
  );
}

/**
 * What this Room may not do, and what that has already prevented (Room · People & guardrails.png, Guardrails), from
 * `GET /rooms/{roomId}/guardrails`. Unliftable guardrails (opt-out, quiet hours, frequency cap) are conditions the send pipeline refuses,
 * not permissions anyone holds, workspace owner included. Guardrails set in this Room are stated, NOT enforced: nothing in the send
 * pipeline reads them yet. Only their author can lift one. Not shown: a "Change in settings" link for guardrails set elsewhere (no route is
 * known). The real response held a single Opt-out guardrail and no stops; the room-set rows and the stops list are built from the docs.
 */
export function GuardrailsSection({ roomId, canEdit }: { roomId: string; canEdit: boolean }) {
  const { user } = useAuth();
  const query = useGetRoomGuardrails(roomId);
  const [label, setLabel] = React.useState("");
  const [setting, setSetting] = React.useState("");
  const [lifting, setLifting] = React.useState<RoomGuardrailDto | null>(null);

  const { createRoomGuardrail, isPending: isCreating } = useCreateRoomGuardrail({
    onSuccess: () => {
      setLabel("");
      setSetting("");
    },
  });
  const { deleteRoomGuardrail, isPending: isLifting } = useDeleteRoomGuardrail({ onSuccess: () => setLifting(null) });

  const data = query.data?.data;
  const absolute = (data?.guardrails ?? []).filter(isUnliftable);
  const inRoom = (data?.guardrails ?? []).filter((guardrail) => guardrail.overridable === "by-its-author");
  const elsewhere = (data?.guardrails ?? []).filter((guardrail) => !isUnliftable(guardrail) && guardrail.overridable !== "by-its-author");

  return (
    <section>
      <h2 className="text-[16px] font-semibold text-ink">Guardrails</h2>
      <p className="mt-0.5 text-[12px] text-ink-3">What this room may not do, and what that has already prevented.</p>

      <div className="mt-3">
        {query.isPending ? (
          <GuardrailsSkeleton />
        ) : query.isError || !data ? (
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
            <p className="text-[12px] text-rose">{query.error?.message || "Couldn't load the guardrails."}</p>
            <Button type="button" variant="outline" size="sm" onClick={() => query.refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid items-start gap-6 @5xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className={CARD}>
              {absolute.length > 0 && (
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3.5">
                    <h3 className="text-[14px] font-semibold text-ink">Absolute</h3>
                    <p className="text-[11.5px] text-ink-3">Checked and refused at send time. Nobody can lift these, including the workspace owner.</p>
                  </div>
                  <ul className="divide-y divide-line border-t border-line">
                    {absolute.map((guardrail) => (
                      <li key={guardrail.label} className="flex items-start gap-3 px-5 py-3.5">
                        <Lock className="mt-0.5 size-3.5 shrink-0 text-ink-3" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-ink">{guardrail.label}</p>
                          <p className="mt-0.5 text-[12px] leading-relaxed text-ink-3">{sentence(guardrail.setting)}</p>
                          {guardrail.overrideNote && <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-4">{sentence(guardrail.overrideNote)}</p>}
                        </div>
                        <span className="shrink-0 rounded-chip bg-ink px-2 py-0.5 text-[9.5px] font-semibold text-paper">Never liftable</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {elsewhere.length > 0 && (
                <div className="border-t border-line">
                  <h3 className="bg-paper-2/60 px-5 py-3 text-[14px] font-semibold text-ink">Set elsewhere</h3>
                  <ul className="divide-y divide-line border-t border-line">
                    {elsewhere.map((guardrail) => (
                      <li key={guardrail.label} className="px-5 py-3.5">
                        <p className="text-[13px] font-semibold text-ink">{guardrail.label}</p>
                        <p className="mt-0.5 text-[12px] leading-relaxed text-ink-3">{guardrail.setting}</p>
                        {guardrail.overrideNote && <p className="mt-0.5 text-[11.5px] text-ink-4">{guardrail.overrideNote}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t border-line">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-paper-2/60 px-5 py-3">
                  <h3 className="text-[14px] font-semibold text-ink">Set in this room</h3>
                  <span className="rounded-chip border border-dashed border-ink-4 px-2 py-0.5 text-[10.5px] text-ink-3">Stated, not enforced</span>
                </div>
                {inRoom.length === 0 ? (
                  <p className="border-t border-line px-5 py-4 text-[12.5px] text-ink-3">No one has set a guardrail on this Room yet.</p>
                ) : (
                  <ul className="divide-y divide-line border-t border-line">
                    {inRoom.map((guardrail) => {
                      const mine = !!guardrail.key && guardrail.setBy === user?.id;
                      return (
                        <li key={guardrail.key ?? guardrail.label} className="flex items-start gap-3 px-5 py-3.5">
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold text-ink">{guardrail.label}</p>
                            <p className="mt-0.5 text-[12px] leading-relaxed text-ink-3">{guardrail.setting}</p>
                            <p className="mt-0.5 text-[11.5px] text-ink-4">
                              Set by {mine ? `${guardrail.setByLabel ?? "you"} (you)` : (guardrail.setByLabel ?? "someone in this room")}
                              {guardrail.setAtUtc ? ` · ${formatDay(guardrail.setAtUtc)}` : ""}
                              {!mine && guardrail.setByLabel ? ` · only ${guardrail.setByLabel} can lift it` : ""}
                            </p>
                          </div>
                          {mine && (
                            <Button type="button" variant="outline" size="sm" onClick={() => setLifting(guardrail)}>
                              Lift
                            </Button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}

                {canEdit && (
                  <form
                    className="space-y-3 border-t border-line px-5 py-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (label.trim() && setting.trim()) createRoomGuardrail({ roomId, label: label.trim(), setting: setting.trim() });
                    }}
                  >
                    <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                      <div>
                        <label htmlFor="guardrail-name" className={LABEL}>
                          Name
                        </label>
                        <input id="guardrail-name" value={label} disabled={isCreating} onChange={(event) => setLabel(event.currentTarget.value)} placeholder="e.g. No SMS" className={INPUT} />
                      </div>
                      <div>
                        <label htmlFor="guardrail-setting" className={LABEL}>
                          Setting
                        </label>
                        <input
                          id="guardrail-setting"
                          value={setting}
                          disabled={isCreating}
                          onChange={(event) => setSetting(event.currentTarget.value)}
                          placeholder="e.g. WhatsApp and email only"
                          className={INPUT}
                        />
                      </div>
                      <Button type="submit" variant="outline" disabled={isCreating || !label.trim() || !setting.trim()}>
                        {isCreating ? "Adding" : "Add guardrail"}
                      </Button>
                    </div>
                    <p className="text-[11.5px] leading-relaxed text-ink-3">
                      Anyone in the room can add one, and only its author can lift it. The send pipeline doesn't read room guardrails yet, so these are
                      commitments rather than blocks.
                    </p>
                  </form>
                )}
              </div>
            </div>

            <aside className={CARD}>
              <h3 className="border-b border-line px-5 py-3.5 text-[14px] font-semibold text-ink">Already prevented</h3>
              {data.stopped.length === 0 ? (
                <p className="px-5 py-4 text-[12.5px] leading-relaxed text-ink-3">{absentReason(data.stopsAbsentBecause)}</p>
              ) : (
                <ul className="divide-y divide-line">
                  {data.stopped.map((stop) => (
                    <li key={`${stop.guardrail}-${stop.whatWasStopped}`} className="px-5 py-3.5">
                      <p className="text-[13px] font-semibold text-ink">{stop.guardrail}</p>
                      <p className="mt-0.5 text-[12.5px] text-ink">
                        {stop.whatWasStopped}
                        {stop.affected !== null ? ` (${stop.affected.toLocaleString("en-US")})` : ""}
                      </p>
                      <p className="mt-0.5 text-[11.5px] text-ink-3">Instead: {stop.whatHappenedInstead}</p>
                    </li>
                  ))}
                </ul>
              )}
              {!data.sendTimeStopsAvailable && (
                <p className="border-t border-line bg-paper-2/60 px-5 py-3 text-[11.5px] leading-relaxed text-ink-3">
                  <span className="font-semibold text-ink">Send-time stops: unavailable.</span> Throughput splits and quiet-hours holds happen during sending and
                  aren't recorded, so none are shown here. That doesn't mean there were none.
                  {data.stopsComputedFrom && <span className="mt-1 block text-ink-4">Computed from {data.stopsComputedFrom}.</span>}
                </p>
              )}
            </aside>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!lifting}
        onOpenChange={(open) => !open && setLifting(null)}
        title={`Lift “${lifting?.label ?? ""}”?`}
        description="Only you can lift a guardrail you set. This room will no longer carry it."
        confirmLabel="Lift guardrail"
        pendingLabel="Lifting"
        isPending={isLifting}
        onConfirm={() => lifting?.key && deleteRoomGuardrail({ roomId, key: lifting.key })}
      />
    </section>
  );
}
