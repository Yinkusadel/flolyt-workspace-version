import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Callout } from "@/components/ui/rail";
import { KpiCards } from "@/components/ui/kpi-cards";
import { OpenARoomModal } from "@/oldpages/everyday/lifecycle/stage/modals/open-a-room-modal";
import { useStageContext } from "@/oldpages/everyday/lifecycle/stage/layout";
import { StageSubpageHeader } from "@/components/ui/stage-subpage-header";
import { EYEBROW_CLASS } from "@/lib/lifecycle-data";
import { RENEW_ACCOUNT_DETAILS, RENEW_ACCOUNT_OPEN_ROOM_PRESET, type RenewAccountEvent } from "@/oldpages/everyday/lifecycle/stage/renew/data";

const TITLE_TONE_CLASS: Record<RenewAccountEvent["titleTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };

/**
 * RN13 — Renew's "one account" drilldown, e.g. /lifecycle/renew/book/kano-textiles.
 * Not the generic DetailDrilldown template: RN13 has an ordered event
 * timeline instead of a checked-rows table and action cards, confirmed by
 * reading RN13 directly. Reached from the Renewal book tab's business-account
 * rows.
 */
const RenewOneAccountRoute = () => {
  const { stage } = useStageContext();
  const { id } = useParams();
  const detail = id ? RENEW_ACCOUNT_DETAILS[id] : undefined;
  const [openRoom, setOpenRoom] = useState(false);

  if (!detail) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">Account not found</p>
        <Link to={`/lifecycle/${stage.slug}/book`} className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
          Back to the renewal book
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[
          { label: "Lifecycle", to: "/lifecycle" },
          { label: stage.name, to: `/lifecycle/${stage.slug}` },
          { label: "Renewal book", to: `/lifecycle/${stage.slug}/book` },
          { label: detail.title },
        ]}
        title={detail.title}
        subtitle={detail.subtitle}
        // "Open a room" header button removed for now, per explicit request — inconsistent
        // across tabs; only the /lifecycle map page's own button stays.
      />

      <span className="inline-flex rounded-chip border border-ultra-border bg-ultra-bg px-3 py-1.5 font-mono text-[9.5px] font-semibold text-ultra">
        {detail.modeBadge}
      </span>

      <KpiCards items={detail.kpis} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>{detail.timelineEyebrow}</p>
        <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-paper">
          {detail.events.map((event) => (
            <div key={event.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-baseline sm:gap-4">
              <span className="shrink-0 font-mono text-[10.5px] text-ink-4 sm:w-20">{event.date}</span>
              <div className="min-w-0 flex-1">
                <p className={`text-[12px] font-semibold ${TITLE_TONE_CLASS[event.titleTone]}`}>{event.title}</p>
                <p className="mt-0.5 text-[10px] text-ink-3">{event.body}</p>
              </div>
              <span className="shrink-0 font-mono text-[10px] text-ink-4">{event.actor}</span>
            </div>
          ))}
        </div>
      </section>

      <Callout tone="rose" title={detail.closingTitle}>
        {detail.closingBody}
      </Callout>

      <OpenARoomModal preset={RENEW_ACCOUNT_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default RenewOneAccountRoute;
