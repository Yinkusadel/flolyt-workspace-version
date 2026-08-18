import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { OpenARoomModal } from "@/pages/lifecycle/stage/modals/open-a-room-modal";
import { InsightCards } from "@/pages/lifecycle/stage/activate/insight-cards";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import {
  ADVOCATE_REFERRERS_OPEN_ROOM_PRESET,
  ADVOCATE_REFERRER_ROWS,
  ADVOCATE_WHO_STOPPED_CARDS,
  type AdvocateReferrerRow,
} from "@/pages/lifecycle/stage/advocate/data";

const REFERRALS_EACH_TONE_CLASS: Record<AdvocateReferrerRow["referralsEachTone"], string> = { teal: "text-teal", amber: "text-amber" };
const TOTAL_REFERRED_TONE_CLASS: Record<AdvocateReferrerRow["totalReferredTone"], string> = { ink: "text-ink", rose: "text-rose" };
const REPEAT_RATE_TONE_CLASS: Record<AdvocateReferrerRow["repeatRateTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const STILL_REFERRING_TONE_CLASS: Record<AdvocateReferrerRow["stillReferringTone"], string> = { teal: "text-teal", rose: "text-rose" };

const COLUMNS: Column<AdvocateReferrerRow>[] = [
  {
    key: "group",
    header: "Referrer group",
    render: (row) =>
      row.detailHref ? (
        <Link to={row.detailHref} className="font-semibold text-ultra hover:underline">
          {row.group}
        </Link>
      ) : (
        <span className="font-semibold text-ink-2">{row.group}</span>
      ),
  },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.customers}</span> },
  { key: "referralsEach", header: "Referrals each", align: "right", render: (row) => <span className={REFERRALS_EACH_TONE_CLASS[row.referralsEachTone]}>{row.referralsEach}</span> },
  { key: "totalReferred", header: "Total referred", align: "right", render: (row) => <span className={`font-mono ${TOTAL_REFERRED_TONE_CLASS[row.totalReferredTone]}`}>{row.totalReferred}</span> },
  { key: "repeatRate", header: "Their own repeat rate", align: "right", render: (row) => <span className={REPEAT_RATE_TONE_CLASS[row.repeatRateTone]}>{row.repeatRate}</span> },
  { key: "stillReferring", header: "Still referring", align: "right", render: (row) => <span className={STILL_REFERRING_TONE_CLASS[row.stillReferringTone]}>{row.stillReferring}</span> },
  { key: "verdict", header: "Verdict", align: "right", render: (row) => <Chip tone={row.verdictTone}>{row.verdict}</Chip> },
];

/** AV03 — Advocate's unique Referrers tab (route path "referrers", matches its tab label). */
const AdvocateReferrersTab = () => {
  const [openRoom, setOpenRoom] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={() => setOpenRoom(true)}>
          Open a war room
        </Button>
      </div>

      <DataTable columns={COLUMNS} rows={ADVOCATE_REFERRER_ROWS} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Who stopped, and when</p>
        <InsightCards cards={ADVOCATE_WHO_STOPPED_CARDS} />
      </section>

      <OpenARoomModal preset={ADVOCATE_REFERRERS_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default AdvocateReferrersTab;
