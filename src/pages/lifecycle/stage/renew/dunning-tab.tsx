import { useState } from "react";

import { Button } from "@/components/ui/button";
import { WideBarRow } from "@/pages/lifecycle/stage/bar";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/lifecycle/stage/kpi-cards";
import { OpenARoomModal } from "@/pages/lifecycle/stage/modals/open-a-room-modal";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import {
  RENEW_DUNNING_CLOSING,
  RENEW_DUNNING_KPIS,
  RENEW_DUNNING_OPEN_ROOM_PRESET,
  RENEW_DUNNING_RECOVERY_ROWS,
  RENEW_DUNNING_ROWS,
  type RenewDunningRow,
} from "@/pages/lifecycle/stage/renew/data";

const RATE_TONE_CLASS: Record<RenewDunningRow["rateTone"], string> = { teal: "text-teal", rose: "text-rose" };

const COLUMNS: Column<RenewDunningRow>[] = [
  { key: "window", header: "Retry window", render: (row) => <span className="font-semibold text-ink-2">{row.window}</span> },
  { key: "attempts", header: "Attempts", align: "right", render: (row) => <span className="font-mono text-ink">{row.attempts}</span> },
  { key: "cleared", header: "Cleared", align: "right", render: (row) => <span className={row.cleared === "Unavailable" ? "font-mono text-ink-4" : "font-mono text-ink"}>{row.cleared}</span> },
  { key: "rate", header: "Rate", align: "right", render: (row) => <span className={row.rate === "—" ? "font-mono text-ink-4" : RATE_TONE_CLASS[row.rateTone]}>{row.rate}</span> },
  { key: "note", header: "Note", align: "right", render: (row) => <span className="text-ink-2">{row.note}</span> },
  { key: "state", header: "State", align: "right", render: (row) => <Chip tone={row.stateTone}>{row.state}</Chip> },
];

/** RN04 — Renew's unique Dunning tab. */
const RenewDunningTab = () => {
  const [openRoom, setOpenRoom] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={() => setOpenRoom(true)}>
          Open a war room
        </Button>
      </div>

      <KpiCards items={RENEW_DUNNING_KPIS} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Why midnight was the wrong hour</p>
        <DataTable columns={COLUMNS} rows={RENEW_DUNNING_ROWS} />
      </section>

      <Callout tone="amber" title={RENEW_DUNNING_CLOSING.title}>
        {RENEW_DUNNING_CLOSING.body}
      </Callout>

      <section className="space-y-4">
        <p className={EYEBROW_CLASS}>What the closed room actually recovered</p>
        <div className="space-y-5">
          {RENEW_DUNNING_RECOVERY_ROWS.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <OpenARoomModal preset={RENEW_DUNNING_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default RenewDunningTab;
