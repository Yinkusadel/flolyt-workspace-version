import { useState } from "react";

import { PersonAvatar } from "@/components/person-avatar";
import { WideBarRow, type BarTone } from "@/pages/lifecycle/stage/bar";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { KpiCards, type Kpi } from "@/pages/lifecycle/stage/kpi-cards";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { StageEmptyState } from "@/pages/lifecycle/stage/overview/empty-state";
import { OpenARoomModal } from "@/pages/lifecycle/stage/modals/open-a-room-modal";
import { ShareOrExportModal } from "@/pages/lifecycle/stage/modals/share-or-export-modal";
import {
  ACQUIRE_OPEN_ROOM_PRESET,
  ACQUIRE_OVERVIEW_BAR_ROWS,
  ACQUIRE_OVERVIEW_KPIS,
  ACQUIRE_OVERVIEW_LEAK_ROWS,
  ACQUIRE_SHARE_EXPORT_PRESET,
  type LeakRow,
} from "@/pages/lifecycle/stage/acquire/data";

type OverviewData = {
  kpis: Kpi[];
  barEyebrow: string;
  barRows: { label: string; value: string; percent: number; tone: BarTone }[];
  insightTitle: string;
  insightBody: string;
  leakEyebrow: string;
  leakRows: LeakRow[];
};

const OVERVIEW_DATA: Record<string, OverviewData> = {
  acquire: {
    kpis: ACQUIRE_OVERVIEW_KPIS,
    barEyebrow: "Volume is up 31% and quality is down 11 points",
    barRows: ACQUIRE_OVERVIEW_BAR_ROWS,
    insightTitle: "More customers, fewer second orders, and both numbers are correct",
    insightBody:
      "Acquisition rose 212,000 while second orders fell 17,000. Read either alone and you get the opposite answer about whether this stage is working — which is why the headline figure on this screen is a rate, not a count.",
    leakEyebrow: "What is leaking, in order",
    leakRows: ACQUIRE_OVERVIEW_LEAK_ROWS,
  },
};

const LEAK_VALUE_TONE_CLASS: Record<LeakRow["valueTone"], string> = {
  rose: "text-rose",
  amber: "text-amber",
  ink: "text-ink",
};

const LEAK_TREND_TONE_CLASS: Record<LeakRow["trendTone"], string> = {
  rose: "text-rose",
  amber: "text-amber",
  teal: "text-teal",
  neutral: "text-ink-4",
};

/** Screen A02 (and the shared template for every stage's Overview tab). */
export function OverviewTab() {
  const { stage } = useStageContext();
  const [openRoomFor, setOpenRoomFor] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  if (!stage.isDefined) return <StageEmptyState stageName={stage.name} />;

  const data = OVERVIEW_DATA[stage.slug];
  if (!data) return null;

  const columns: Column<LeakRow>[] = [
    { key: "where", header: "Where", render: (row) => <span className="font-semibold text-ink-2">{row.where}</span> },
    {
      key: "customers",
      header: "Customers",
      align: "right",
      render: (row) => <span className="font-mono text-ink">{row.customers}</span>,
    },
    {
      key: "value",
      header: "Value",
      align: "right",
      render: (row) => <span className={LEAK_VALUE_TONE_CLASS[row.valueTone]}>{row.value}</span>,
    },
    {
      key: "trend",
      header: "Trend",
      align: "right",
      render: (row) => <span className={LEAK_TREND_TONE_CLASS[row.trendTone]}>{row.trend}</span>,
    },
    {
      key: "owner",
      header: "Owner",
      render: (row) =>
        row.owner ? (
          <span className="flex items-center gap-2 whitespace-nowrap text-ink-2">
            <PersonAvatar kind="human" initials={row.owner.initials} size="sm" />
            {row.owner.name}
          </span>
        ) : (
          <Chip tone="amber">No owner</Chip>
        ),
    },
    {
      key: "room",
      header: "Room",
      align: "right",
      render: (row) => (
        <button type="button" onClick={() => setOpenRoomFor(row.id)}>
          {row.room === "open" ? (
            <Chip tone="ultra">open one</Chip>
          ) : row.room === "open-unowned" ? (
            <Chip tone="amber">open · unowned</Chip>
          ) : (
            <Chip tone="amber">No owner</Chip>
          )}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button type="button" onClick={() => setShareOpen(true)} className="text-[11px] font-semibold text-ink-3 hover:text-ink">
          Share or export
        </button>
      </div>

      <KpiCards items={data.kpis} />

      <section className="space-y-4">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          {data.barEyebrow}
        </p>
        <div className="space-y-5">
          {data.barRows.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <Callout tone="ultra" title={data.insightTitle}>
        {data.insightBody}
      </Callout>

      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          {data.leakEyebrow}
        </p>
        <DataTable columns={columns} rows={data.leakRows} />
      </section>

      <OpenARoomModal
        preset={ACQUIRE_OPEN_ROOM_PRESET}
        open={openRoomFor !== null}
        onOpenChange={(open) => setOpenRoomFor(open ? openRoomFor : null)}
      />
      <ShareOrExportModal preset={ACQUIRE_SHARE_EXPORT_PRESET} open={shareOpen} onOpenChange={setShareOpen} />
    </div>
  );
}
