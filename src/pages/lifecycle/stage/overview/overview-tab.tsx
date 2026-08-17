import { useState } from "react";
import { Link } from "react-router-dom";

import { PersonAvatar } from "@/components/person-avatar";
import { WideBarRow, type BarTone } from "@/pages/lifecycle/stage/bar";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { KpiCards, type Kpi } from "@/pages/lifecycle/stage/kpi-cards";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { StageEmptyState } from "@/pages/lifecycle/stage/overview/empty-state";
import { OverviewStageRail } from "@/pages/lifecycle/stage/overview/mini-stage-rail";
import { OpenARoomModal, type OpenRoomPreset } from "@/pages/lifecycle/stage/modals/open-a-room-modal";
import { ShareOrExportModal, type ShareOrExportPreset } from "@/pages/lifecycle/stage/modals/share-or-export-modal";
import { STAGES } from "@/pages/lifecycle/data";
import {
  ACQUIRE_OPEN_ROOM_PRESET,
  ACQUIRE_OVERVIEW_BAR_ROWS,
  ACQUIRE_OVERVIEW_KPIS,
  ACQUIRE_OVERVIEW_LEAK_ROWS,
  ACQUIRE_SHARE_EXPORT_PRESET,
  type LeakRow,
} from "@/pages/lifecycle/stage/acquire/data";
import {
  ACTIVATE_OPEN_ROOM_PRESET,
  ACTIVATE_OVERVIEW_KPIS,
  ACTIVATE_OVERVIEW_LEAK_ROWS,
  ACTIVATE_SHARE_EXPORT_PRESET,
} from "@/pages/lifecycle/stage/activate/data";
import {
  PRICE_OPEN_ROOM_PRESET,
  PRICE_OVERVIEW_KPIS,
  PRICE_OVERVIEW_LEAK_ROWS,
  PRICE_SHARE_EXPORT_PRESET,
} from "@/pages/lifecycle/stage/price/data";

type OverviewData = {
  kpis: Kpi[];
  barEyebrow?: string;
  barRows?: { label: string; value: string; percent: number; tone: BarTone }[];
  insightTitle: string;
  insightBody: string;
  insightTone?: "ultra" | "amber" | "rose" | "teal" | "neutral";
  leakEyebrow: string;
  leakWhereHeader: string;
  leakColumnKind: "owner" | "cause";
  leakRows: LeakRow[];
  showStageRail?: boolean;
  openRoomPreset: OpenRoomPreset;
  shareExportPreset: ShareOrExportPreset;
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
    leakWhereHeader: "Where",
    leakColumnKind: "owner",
    leakRows: ACQUIRE_OVERVIEW_LEAK_ROWS,
    openRoomPreset: ACQUIRE_OPEN_ROOM_PRESET,
    shareExportPreset: ACQUIRE_SHARE_EXPORT_PRESET,
  },
  activate: {
    kpis: ACTIVATE_OVERVIEW_KPIS,
    insightTitle: "116,000 customers had a perfectly good first order and never came back, and nobody knows why",
    insightBody:
      "It is the third-largest group in the stage and the only one with no reading behind it. Everything Flolyt can see about them looks normal. That is a real answer and it is stated as one — a plausible story would be worse than an admitted gap.",
    insightTone: "amber",
    leakEyebrow: "Where the 528,000 who never activate are lost",
    leakWhereHeader: "Where they stop",
    leakColumnKind: "cause",
    leakRows: ACTIVATE_OVERVIEW_LEAK_ROWS,
    showStageRail: true,
    openRoomPreset: ACTIVATE_OPEN_ROOM_PRESET,
    shareExportPreset: ACTIVATE_SHARE_EXPORT_PRESET,
  },
  price: {
    kpis: PRICE_OVERVIEW_KPIS,
    insightTitle: "Two of the five largest items on this screen cannot be valued at all",
    insightBody:
      "Legacy Unlimited and absorbed delivery fees are almost certainly losing money — 3,100 customers on a 2022 price and 41,000 subscriptions eating a fee introduced in 2026. Neither can be priced without cost of goods, so neither is in the ₦46M, and neither has a room.",
    insightTone: "rose",
    leakEyebrow: "What is leaking, in order",
    leakWhereHeader: "Where",
    leakColumnKind: "cause",
    leakRows: PRICE_OVERVIEW_LEAK_ROWS,
    showStageRail: true,
    openRoomPreset: PRICE_OPEN_ROOM_PRESET,
    shareExportPreset: PRICE_SHARE_EXPORT_PRESET,
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
    { key: "where", header: data.leakWhereHeader, render: (row) => <span className="font-semibold text-ink-2">{row.where}</span> },
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
    data.leakColumnKind === "owner"
      ? {
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
        }
      : {
          key: "causeKnown",
          header: "Cause known?",
          render: (row) => (row.causeKnown ? <Chip tone={row.causeKnown.tone}>{row.causeKnown.label}</Chip> : null),
        },
    {
      key: "room",
      header: "Room",
      align: "right",
      render: (row) => (
        <button type="button" onClick={() => setOpenRoomFor(row.id)}>
          <Chip tone={row.room.tone}>{row.room.label}</Chip>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-end gap-4">
        {(stage.slug === "activate" || stage.slug === "price") && (
          <Link to={`/lifecycle/${stage.slug}/definition`} className="text-[11px] font-semibold text-ink-3 hover:text-ink">
            How this stage is defined
          </Link>
        )}
        <button type="button" onClick={() => setShareOpen(true)} className="text-[11px] font-semibold text-ink-3 hover:text-ink">
          Share or export
        </button>
      </div>

      <KpiCards items={data.kpis} />

      {data.barEyebrow && data.barRows && (
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
      )}

      {!data.barRows && (
        <section className="space-y-3">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            {data.leakEyebrow}
          </p>
          <DataTable columns={columns} rows={data.leakRows} />
        </section>
      )}

      <Callout tone={data.insightTone ?? "ultra"} title={data.insightTitle}>
        {data.insightBody}
      </Callout>

      {data.barRows && (
        <section className="space-y-3">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            {data.leakEyebrow}
          </p>
          <DataTable columns={columns} rows={data.leakRows} />
        </section>
      )}

      {data.showStageRail && <OverviewStageRail stages={STAGES} activeSlug={stage.slug} />}

      <OpenARoomModal
        preset={data.openRoomPreset}
        open={openRoomFor !== null}
        onOpenChange={(open) => setOpenRoomFor(open ? openRoomFor : null)}
      />
      <ShareOrExportModal preset={data.shareExportPreset} open={shareOpen} onOpenChange={setShareOpen} />
    </div>
  );
}
