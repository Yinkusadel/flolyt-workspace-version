import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { ConfirmModal } from "@/components/confirm-modal";
import { Button } from "@/components/ui/button";
import { SearchableSelect, type SearchableSelectOption } from "@/components/ui/searchable-select";
import { Skeleton } from "@/components/ui/skeleton";
import useCloseRoom from "@/features/rooms/use-close-room";
import { useGetRoom } from "@/features/rooms/use-get-room";
import { useGetRoomClosePreview } from "@/features/rooms/use-get-room-close-preview";
import { useGetRoomPeople } from "@/features/rooms/use-get-room-people";
import { useGetRooms } from "@/features/rooms/use-get-rooms";
import { humanize } from "@/pages/rooms/convening/format";
import {
  AREA,
  CarriedSection,
  EMPTY_MEASUREMENT,
  FIELD_LABEL,
  INPUT,
  MeasurementSection,
  OutcomePicker,
  OwedSection,
  StepHeading,
  SummaryCard,
  type MeasurementForm,
  type OwedRow,
} from "@/pages/rooms/close/sections";
import { buildClosePayload, type CloseFormState } from "@/pages/rooms/close/close-payload";
import { closeLog } from "@/pages/rooms/close/close-log";

function CloseSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6" aria-busy="true" aria-label="Loading the close preview">
      <Skeleton className="h-9 w-2/3" />
      <Skeleton className="h-40 rounded-card" />
      <Skeleton className="h-56 rounded-card" />
      <Skeleton className="h-64 rounded-card" />
    </div>
  );
}

/**
 * The Close room page (Room · Close.png), at `/rooms/:roomId/close`: a dry run from `GET /rooms/{roomId}/close-preview`, then `POST /rooms/{roomId}/close`.
 * Four steps (how it ended, the measurement, what is carried into the record, what is still owed), then a confirm. Built from the real
 * previews of 2026-10-17; the CLOSE ITSELF HAS NEVER RUN against the real backend (it ends a Room for good), so the request body is
 * mock-verified only. Open questions: the shape of `dissent` ("your own objection": sent as the plain text), and the rates in a measurement
 * (sent as null for the backend to compute). Not built: reopening a closed Room, and the design's "Back to the room" link (the topbar
 * breadcrumb serves it).
 */
export function RoomClosePage() {
  const { roomId = "" } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const room = useGetRoom(roomId);
  const preview = useGetRoomClosePreview(roomId);
  const people = useGetRoomPeople(roomId);
  const rooms = useGetRooms();
  const title = room.data?.data.title ?? preview.data?.data.title ?? "Room";
  usePageBreadcrumb([{ label: "Rooms", to: "/rooms" }, { label: title, to: `/rooms/${roomId}` }, { label: "Close" }]);

  const [kind, setKind] = React.useState<string | null>(null);
  const [unmeasuredReason, setUnmeasuredReason] = React.useState("");
  const [supersededBy, setSupersededBy] = React.useState<string | null>(null);
  const [measurement, setMeasurement] = React.useState<MeasurementForm>(EMPTY_MEASUREMENT);
  const [ownObjection, setOwnObjection] = React.useState("");
  const [owed, setOwed] = React.useState<OwedRow[]>([]);
  const [note, setNote] = React.useState("");
  const [revisit, setRevisit] = React.useState("");
  const [confirming, setConfirming] = React.useState(false);

  const { closeRoom, isPending } = useCloseRoom({
    onSuccess: () => {
      setConfirming(false);
      navigate(`/rooms/${roomId}`);
    },
  });

  const data = preview.data?.data;

  const form: CloseFormState = { kind, unmeasuredReason, supersededBy, measurement, ownObjection, owed, note, revisit };
  const { payload, missing, draft } = buildClosePayload(roomId, data?.currency ?? "", form);

  // Every change to the form is logged (after a short pause while typing): the values held, what is still missing, and the exact body that would be sent.
  const snapshot = JSON.stringify({ form, draft, missing, wouldSend: payload });
  React.useEffect(() => {
    if (!data) return;
    const timer = window.setTimeout(() => closeLog("Form changed", { ...JSON.parse(snapshot), canSubmit: JSON.parse(snapshot).missing.length === 0 }), 250);
    return () => window.clearTimeout(timer);
  }, [snapshot, data]);

  const peopleOptions = React.useMemo<SearchableSelectOption[]>(
    () => (people.data?.data.people ?? []).map((person) => ({ value: person.userId, label: person.displayName ?? "Name not available" })),
    [people.data]
  );
  const roomOptions = React.useMemo<SearchableSelectOption[]>(
    () => (rooms.data?.data.rooms ?? []).filter((candidate) => candidate.id !== roomId).map((candidate) => ({ value: candidate.id, label: candidate.title })),
    [rooms.data, roomId]
  );

  if (preview.isPending) return <CloseSkeleton />;
  if (preview.isError || !data) {
    return (
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
        <p className="text-[12px] text-rose">{preview.error?.message || "Couldn't load the close preview."}</p>
        <Button type="button" variant="outline" size="sm" onClick={() => preview.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const blocker = missing[0] ?? null;

  const submit = () => {
    if (!payload) return;
    closeLog("Close confirmed: sending", payload);
    closeRoom(payload);
  };

  return (
    <div className="@container mx-auto max-w-5xl space-y-9 pb-24">
      <div>
        <h1 className="text-[22px] font-semibold text-ink">Close: {data.title}</h1>
        <p className="mt-1.5 text-[12.5px] text-ink-3">This preview shows what closing will record, read by the same code the close uses. Nothing is written until you press Close.</p>
      </div>

      <SummaryCard preview={data} />

      <section>
        <StepHeading step={1} title="How did it end?">
          These five aren't ranked and none is the default. Finding something real and deciding it isn't worth fixing is a proper conclusion.
        </StepHeading>
        <OutcomePicker preview={data} kind={kind} onChange={setKind} />
        {kind === "unmeasurable" && (
          <div className="mt-4">
            <label htmlFor="close-unmeasured" className={FIELD_LABEL}>
              Why can't it be measured?
            </label>
            <textarea id="close-unmeasured" rows={3} value={unmeasuredReason} onChange={(event) => setUnmeasuredReason(event.currentTarget.value)} className={AREA} />
          </div>
        )}
        {kind === "superseded" && (
          <div className="mt-4 max-w-md">
            <span className={FIELD_LABEL}>The room that took this over</span>
            <SearchableSelect options={roomOptions} value={supersededBy} onChange={setSupersededBy} placeholder="Choose a room" searchPlaceholder="Search rooms" emptyText="No other room." />
          </div>
        )}
      </section>

      <section>
        <StepHeading step={2} title="Measurement" />
        <MeasurementSection preview={data} kind={kind} form={measurement} onChange={setMeasurement} />
      </section>

      <section>
        <StepHeading step={3} title="What gets carried into the record" />
        <CarriedSection preview={data} />
        <div className="mt-4">
          <label htmlFor="close-objection" className={FIELD_LABEL}>
            Your own objection to closing this way (optional)
          </label>
          <textarea id="close-objection" rows={3} value={ownObjection} onChange={(event) => setOwnObjection(event.currentTarget.value)} placeholder="Recorded with the outcome" className={AREA} />
        </div>
      </section>

      <section>
        <StepHeading step={4} title="Anything still owed?" />
        <OwedSection rows={owed} people={peopleOptions} onChange={setOwed} />
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="close-note" className={FIELD_LABEL}>
              Note (optional)
            </label>
            <textarea id="close-note" rows={3} value={note} onChange={(event) => setNote(event.currentTarget.value)} placeholder="Anything the next person to read this should know" className={AREA} />
          </div>
          <div>
            <label htmlFor="close-revisit" className={FIELD_LABEL}>
              Reopen if… (optional)
            </label>
            <input id="close-revisit" value={revisit} onChange={(event) => setRevisit(event.currentTarget.value)} placeholder="e.g. second-order rate drops under 25% again" className={INPUT} />
          </div>
        </div>
      </section>

      <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-paper px-5 py-3.5 shadow-sm">
        <p className="text-[12.5px] text-ink-2">
          {kind ? (
            <>
              Closing as <span className="font-semibold text-ink">{humanize(kind)}</span>. The leak cell is re-read when you close.
              {blocker && <span className="ml-2 text-ink-3">{blocker}</span>}
            </>
          ) : (
            "Choose how it ended to close this room."
          )}
        </p>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/rooms/${roomId}`}>Cancel</Link>
          </Button>
          <Button type="button" size="sm" disabled={Boolean(blocker) || isPending} onClick={() => setConfirming(true)}>
            Close room
          </Button>
        </div>
      </div>

      <ConfirmModal
        open={confirming}
        onOpenChange={setConfirming}
        title={`Close ${data.title}?`}
        description={`This records the outcome "${kind ? humanize(kind) : ""}" and ends this opening of the room. Every objection above is kept in its own words. The room can be opened again later as a second opening.`}
        confirmLabel="Close room"
        pendingLabel="Closing…"
        isPending={isPending}
        onConfirm={submit}
      />
    </div>
  );
}
