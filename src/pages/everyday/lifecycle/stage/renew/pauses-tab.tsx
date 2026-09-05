import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WideBarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { OpenARoomModal } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { RENEW_PAUSES_OPEN_ROOM_PRESET } from "@/pages/everyday/lifecycle/stage/renew/data";
import { useGetRenewPauses } from "@/features/lifecycle/use-get-renew-pauses";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

function PausesSkeleton() {
  return (
    <div className="space-y-4 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-4 w-full" />
      ))}
    </div>
  );
}

/** RN05 — Renew's own Pauses tab, wired to GET /lifecycle/renew/pauses. */
const RenewPausesTab = () => {
  const { headerActionsEl } = useStageContext();
  const [openRoom, setOpenRoom] = useState(false);
  const { data, isLoading, isError, refetch } = useGetRenewPauses();
  const pauses = data?.data;

  return (
    <div className="space-y-8">
      {headerActionsEl &&
        createPortal(
          <Button type="button" size="sm" onClick={() => setOpenRoom(true)}>
            Open a war room
          </Button>,
          headerActionsEl
        )}

      <section className="space-y-5">
        <p className={EYEBROW_CLASS}>
          {pauses
            ? `${pauses.lapses !== null ? formatCount(pauses.lapses) : "?"} lapse events · ${pauses.returned !== null ? formatCount(pauses.returned) : "?"} returned · gaps under ${pauses.renewalGraceDays} days count as a renewal, not a lapse`
            : "Who lapsed, how long for, and whether they came back"}
        </p>

        {isError ? (
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
            <p className="text-[12px] text-rose">Couldn't load Renew's pauses.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <PausesSkeleton />
        ) : pauses && pauses.bands.length > 0 ? (
          <div className="space-y-5">
            {pauses.bands.map((band) => (
              <WideBarRow
                key={band.band}
                label={band.band === "never" ? "Never returned" : band.band}
                value={band.share !== null ? `${formatCount(band.lapses)} · ${formatPercent(band.share)}` : `${formatCount(band.lapses)} · no share reported`}
                percent={band.share !== null ? band.share * 100 : 0}
                tone={band.band === "never" ? "rose" : "teal"}
              />
            ))}
          </div>
        ) : (
          <p className="text-[11.5px] text-ink-3">No lapse bands measured yet.</p>
        )}
      </section>

      {pauses && (
        <p className="text-[10.5px] text-ink-4">
          Lapses newer than {pauses.maturityDays} days are excluded — a subscription that ended recently hasn't failed to return, it hasn't had the chance yet.
        </p>
      )}

      {/* ❌ Backend does NOT provide: a pause reason or status at all — nothing in the schema
          carries why a subscription lapsed, only the gap length. The old mock's reason-based
          breakdown table ("financial", "moving", "dissatisfied", etc.) is entirely fabricated for
          this endpoint and is dropped rather than reproduced. */}

      {pauses?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}

      <OpenARoomModal preset={RENEW_PAUSES_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default RenewPausesTab;
