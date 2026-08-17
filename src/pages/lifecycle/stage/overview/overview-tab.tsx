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
import {
  ADOPT_OPEN_ROOM_PRESET,
  ADOPT_OVERVIEW_KPIS,
  ADOPT_OVERVIEW_LEAK_ROWS,
  ADOPT_SHARE_EXPORT_PRESET,
} from "@/pages/lifecycle/stage/adopt/data";
import {
  RETAIN_OPEN_ROOM_PRESET,
  RETAIN_OVERVIEW_KPIS,
  RETAIN_OVERVIEW_LEAK_ROWS,
  RETAIN_SHARE_EXPORT_PRESET,
} from "@/pages/lifecycle/stage/retain/data";
import {
  EXPAND_OPEN_ROOM_PRESET,
  EXPAND_OVERVIEW_KPIS,
  EXPAND_OVERVIEW_LEAK_ROWS,
  EXPAND_SHARE_EXPORT_PRESET,
} from "@/pages/lifecycle/stage/expand/data";
import {
  SUPPORT_OPEN_ROOM_PRESET,
  SUPPORT_OVERVIEW_KPIS,
  SUPPORT_OVERVIEW_LEAK_ROWS,
  SUPPORT_SHARE_EXPORT_PRESET,
} from "@/pages/lifecycle/stage/support/data";
import {
  RENEW_OPEN_ROOM_PRESET,
  RENEW_OVERVIEW_KPIS,
  RENEW_OVERVIEW_LEAK_ROWS,
  RENEW_SHARE_EXPORT_PRESET,
} from "@/pages/lifecycle/stage/renew/data";

type OverviewData = {
  kpis: Kpi[];
  barEyebrow?: string;
  barRows?: { label: string; value: string; percent: number; tone: BarTone }[];
  insightTitle: string;
  insightBody: string;
  insightTone?: "ultra" | "amber" | "rose" | "teal" | "neutral";
  leakEyebrow: string;
  leakWhereHeader: string;
  /** Overrides the leak table's 4th column header — defaults to "Trend" (e.g. Retain's "Still reachable"). */
  leakTrendHeader?: string;
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
  adopt: {
    kpis: ADOPT_OVERVIEW_KPIS,
    insightTitle: "An entire feature is invisible to this stage",
    insightBody:
      "Loyalty tiers were renamed in April and have never emitted an event. Flolyt cannot say how many customers use them, whether the rename helped or hurt, or whether the feature does anything at all. It is listed as unavailable rather than left off the table.",
    insightTone: "rose",
    leakEyebrow: "Where the 781,000 who use nothing are",
    leakWhereHeader: "Group",
    leakColumnKind: "cause",
    leakRows: ADOPT_OVERVIEW_LEAK_ROWS,
    showStageRail: true,
    openRoomPreset: ADOPT_OPEN_ROOM_PRESET,
    shareExportPreset: ADOPT_SHARE_EXPORT_PRESET,
  },
  retain: {
    kpis: RETAIN_OVERVIEW_KPIS,
    insightTitle: "142,000 of these customers cannot be contacted by anybody, ever",
    insightBody:
      "No email, no consent, no push — they checked out as guests. They are inside the 148,000 in the reactivation room and will be silently dropped at send time. The only fix for them was upstream, in Activate, at the moment the account was offered and was not.",
    insightTone: "rose",
    leakEyebrow: "The 651,000 who never came back",
    leakWhereHeader: "Group",
    leakTrendHeader: "Still reachable",
    leakColumnKind: "cause",
    leakRows: RETAIN_OVERVIEW_LEAK_ROWS,
    showStageRail: true,
    openRoomPreset: RETAIN_OPEN_ROOM_PRESET,
    shareExportPreset: RETAIN_SHARE_EXPORT_PRESET,
  },
  expand: {
    kpis: EXPAND_OVERVIEW_KPIS,
    insightTitle: "This is the only stage whose own numbers improved this quarter, and it means less than it looks",
    insightBody:
      "Expansion rate rose 0.7 points while the eligible population fell 11%. Expansion works on customers who stay, and Retain is producing fewer of them. A healthy rate applied to a shrinking base is how a stage can be doing its job and still be worth less every quarter.",
    insightTone: "amber",
    leakEyebrow: "Where the ₦61M is",
    leakWhereHeader: "Where",
    leakColumnKind: "cause",
    leakRows: EXPAND_OVERVIEW_LEAK_ROWS,
    showStageRail: true,
    openRoomPreset: EXPAND_OPEN_ROOM_PRESET,
    shareExportPreset: EXPAND_SHARE_EXPORT_PRESET,
  },
  support: {
    kpis: SUPPORT_OVERVIEW_KPIS,
    insightTitle: "The ₦9M is what Support can fix. The ₦38M is what Support can only see.",
    insightBody:
      "This stage's own number is small because most of what it detects belongs to Delivery, Product or Engineering. Support is the earliest and cheapest sensor in the lifecycle and the one with the least ability to act on what it senses.",
    insightTone: "amber",
    leakEyebrow: "Where the ₦9M is",
    leakWhereHeader: "Where",
    leakColumnKind: "cause",
    leakRows: SUPPORT_OVERVIEW_LEAK_ROWS,
    showStageRail: true,
    openRoomPreset: SUPPORT_OPEN_ROOM_PRESET,
    shareExportPreset: SUPPORT_SHARE_EXPORT_PRESET,
  },
  renew: {
    kpis: RENEW_OVERVIEW_KPIS,
    insightTitle: "Nobody in the ₦88M decided to leave",
    insightBody:
      "61,400 cards failed on renewal night because they were presented at midnight, when balances are lowest. These customers wanted the service, were willing to pay for it, and were lost to an implementation detail. It is the only ₦88M in this lifecycle that needed no persuasion, no discount and no product change.",
    insightTone: "teal",
    leakEyebrow: "Where the ₦88M is, and why it is the cheapest money in the company",
    leakWhereHeader: "Where",
    leakColumnKind: "cause",
    leakRows: RENEW_OVERVIEW_LEAK_ROWS,
    showStageRail: true,
    openRoomPreset: RENEW_OPEN_ROOM_PRESET,
    shareExportPreset: RENEW_SHARE_EXPORT_PRESET,
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
    {
      key: "where",
      header: data.leakWhereHeader,
      render: (row) =>
        row.detailHref ? (
          <Link to={row.detailHref} className="font-semibold text-ultra hover:underline">
            {row.where}
          </Link>
        ) : (
          <span className="font-semibold text-ink-2">{row.where}</span>
        ),
    },
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
      header: data.leakTrendHeader ?? "Trend",
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
        {(stage.slug === "activate" || stage.slug === "price" || stage.slug === "adopt" || stage.slug === "retain" || stage.slug === "expand" || stage.slug === "support" || stage.slug === "renew") && (
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
