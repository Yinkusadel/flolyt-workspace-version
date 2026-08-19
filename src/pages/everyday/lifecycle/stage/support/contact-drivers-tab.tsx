import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { InsightCards } from "@/pages/everyday/lifecycle/stage/activate/insight-cards";
import { ReclassifyADriverModal } from "@/pages/everyday/lifecycle/stage/modals/reclassify-a-driver-modal";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import {
  SUPPORT_CONTACT_DRIVER_ROWS,
  SUPPORT_DRIVER_TIMELINE_CARDS,
  SUPPORT_RECLASSIFY_PRESET,
  type ContactDriverRow,
} from "@/pages/everyday/lifecycle/stage/support/data";

const SHARE_TONE_CLASS: Record<ContactDriverRow["shareTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose", neutral: "text-ink-4" };
const VS_FEB_TONE_CLASS: Record<ContactDriverRow["vsFebTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose", neutral: "text-ink-4" };
const HANDLE_TIME_TONE_CLASS: Record<ContactDriverRow["handleTimeTone"], string> = { teal: "text-teal", amber: "text-amber" };
const REPEAT_TONE_CLASS: Record<ContactDriverRow["repeatRateAfterTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };

const COLUMNS: Column<ContactDriverRow>[] = [
  { key: "driver", header: "Driver", render: (row) => <span className="font-semibold text-ink-2">{row.driver}</span> },
  { key: "ticketsPerMo", header: "Tickets / mo", align: "right", render: (row) => <span className="font-mono text-ink">{row.ticketsPerMo}</span> },
  { key: "share", header: "Share", align: "right", render: (row) => <span className={SHARE_TONE_CLASS[row.shareTone]}>{row.share}</span> },
  { key: "vsFeb", header: "vs Feb", align: "right", render: (row) => <span className={VS_FEB_TONE_CLASS[row.vsFebTone]}>{row.vsFeb}</span> },
  { key: "handleTime", header: "Handle time", align: "right", render: (row) => <span className={HANDLE_TIME_TONE_CLASS[row.handleTimeTone]}>{row.handleTime}</span> },
  { key: "repeatRateAfter", header: "Repeat rate after", align: "right", render: (row) => <span className={REPEAT_TONE_CLASS[row.repeatRateAfterTone]}>{row.repeatRateAfter}</span> },
  { key: "reallyA", header: "Really a", align: "right", render: (row) => <Chip tone={row.reallyATone}>{row.reallyA}</Chip> },
];

/** SU03 — Support's unique Contact drivers tab (route path "drivers" per SU03's own footer). */
const SupportContactDriversTab = () => {
  const { headerActionsEl } = useStageContext();
  const [reclassifyOpen, setReclassifyOpen] = useState(false);

  return (
    <div className="space-y-8">
      {headerActionsEl &&
        createPortal(
          <Button type="button" size="sm" onClick={() => setReclassifyOpen(true)}>
            Reclassify a driver
          </Button>,
          headerActionsEl
        )}

      <section className="space-y-3">
        <DataTable columns={COLUMNS} rows={SUPPORT_CONTACT_DRIVER_ROWS} />
      </section>

      <Callout tone="rose" title="Half of this queue is not a support problem at all">
        “Where is my order”, the fee question and payment failures are 56% of tickets and every one of them is a
        symptom owned by another stage. Support Signal reclassified them as revenue drivers in the first week of
        March. The reclassification was correct, it was logged, and it went to nobody.
      </Callout>

      <section className="space-y-4">
        <p className={EYEBROW_CLASS}>The reclassification that took twenty weeks to reach anyone</p>
        <InsightCards cards={SUPPORT_DRIVER_TIMELINE_CARDS} />
      </section>

      <ReclassifyADriverModal preset={SUPPORT_RECLASSIFY_PRESET} open={reclassifyOpen} onOpenChange={setReclassifyOpen} />
    </div>
  );
};

export default SupportContactDriversTab;
