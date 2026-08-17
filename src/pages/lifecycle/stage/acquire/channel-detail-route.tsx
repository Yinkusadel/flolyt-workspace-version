import { Link, useParams } from "react-router-dom";

import { DetailDrilldown } from "@/pages/lifecycle/stage/detail/detail-drilldown";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { ACQUIRE_CHANNEL_DETAILS } from "@/pages/lifecycle/stage/acquire/data";

/** A05 — Acquire's "one channel" drilldown, e.g. /lifecycle/acquire/channels/paid-social-ghana. */
const AcquireChannelDetailRoute = () => {
  const { stage } = useStageContext();
  const { id } = useParams();
  const detail = id ? ACQUIRE_CHANNEL_DETAILS[id] : undefined;

  if (!detail) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">Channel not found</p>
        <Link
          to={`/lifecycle/${stage.slug}/channels`}
          className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline"
        >
          Back to channels
        </Link>
      </div>
    );
  }

  return (
    <DetailDrilldown
      crumbs={[
        { label: "Lifecycle", to: "/lifecycle" },
        { label: stage.name, to: `/lifecycle/${stage.slug}` },
        { label: "Channels", to: `/lifecycle/${stage.slug}/channels` },
        { label: detail.channel },
      ]}
      title={detail.channel}
      subtitle={detail.headline}
      eyebrow={detail.eyebrow}
      kpis={detail.kpis}
      checkedRows={detail.checkedRows}
      causeTitle={detail.causeTitle}
      causeBody={detail.causeBody}
      actionsEyebrow="What this stage would do about it"
      actionCards={detail.actionCards}
    />
  );
};

export default AcquireChannelDetailRoute;
