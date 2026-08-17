import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { DetailDrilldown } from "@/pages/lifecycle/stage/detail/detail-drilldown";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { OpenARoomModal } from "@/pages/lifecycle/stage/modals/open-a-room-modal";
import { ACTIVATE_PATH_DETAILS, ACTIVATE_PATH_OPEN_ROOM_PRESET } from "@/pages/lifecycle/stage/activate/data";

/** AC05 — Activate's "one path" drilldown, e.g. /lifecycle/activate/paths/guest-checkout. */
const ActivatePathDetailRoute = () => {
  const { stage } = useStageContext();
  const { id } = useParams();
  const detail = id ? ACTIVATE_PATH_DETAILS[id] : undefined;
  const [openRoom, setOpenRoom] = useState(false);

  if (!detail) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">Path not found</p>
        <Link
          to={`/lifecycle/${stage.slug}/paths`}
          className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline"
        >
          Back to paths
        </Link>
      </div>
    );
  }

  return (
    <>
      <DetailDrilldown
        crumbs={[
          { label: "Lifecycle", to: "/lifecycle" },
          { label: stage.name, to: `/lifecycle/${stage.slug}` },
          { label: "Paths", to: `/lifecycle/${stage.slug}/paths` },
          { label: detail.path },
        ]}
        title={detail.path}
        subtitle={detail.headline}
        eyebrow={detail.eyebrow}
        kpis={detail.kpis}
        checkedRows={detail.checkedRows}
        causeTitle={detail.causeTitle}
        causeBody={detail.causeBody}
        actionsEyebrow="The 44,000 who left a phone number"
        actionCards={detail.actionCards}
        onOpenRoom={() => setOpenRoom(true)}
      />
      <OpenARoomModal preset={ACTIVATE_PATH_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </>
  );
};

export default ActivatePathDetailRoute;
