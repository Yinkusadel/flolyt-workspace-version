import { useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WideBarRow, type BarTone } from "@/pages/everyday/lifecycle/stage/bar";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { CHIP_INTERACTIVE_CLASS, Chip, type ChipTone } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { InfoTooltip } from "@/pages/everyday/lifecycle/stage-rail";
import { KpiCards, type Kpi } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { StageEmptyState } from "@/pages/everyday/lifecycle/stage/overview/empty-state";
import { OverviewStageRail } from "@/pages/everyday/lifecycle/stage/overview/mini-stage-rail";
import { OpenARoomModal, type OpenRoomPreset } from "@/pages/everyday/lifecycle/stage/modals/open-a-room-modal";
import { ShareOrExportModal, type ShareOrExportPreset } from "@/pages/everyday/lifecycle/stage/modals/share-or-export-modal";
import { AssignAnOwnerModal, type AssignOwnerPreset } from "@/pages/everyday/lifecycle/stage/modals/assign-an-owner-modal";
import { STAGES } from "@/pages/everyday/lifecycle/data";
import { formatCompactCurrency, formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetStage } from "@/features/lifecycle/use-get-stage";
import type { StageData, StageDepartureDto } from "@/services/api/lifecycle/get-stage";
import { ACQUIRE_OPEN_ROOM_PRESET, ACQUIRE_OVERVIEW_BAR_ROWS, ACQUIRE_SHARE_EXPORT_PRESET } from "@/pages/everyday/lifecycle/stage/acquire/data";
import { ACTIVATE_OPEN_ROOM_PRESET, ACTIVATE_SHARE_EXPORT_PRESET } from "@/pages/everyday/lifecycle/stage/activate/data";
import { PRICE_OPEN_ROOM_PRESET, PRICE_SHARE_EXPORT_PRESET } from "@/pages/everyday/lifecycle/stage/price/data";
import { ADOPT_OPEN_ROOM_PRESET, ADOPT_SHARE_EXPORT_PRESET } from "@/pages/everyday/lifecycle/stage/adopt/data";
import { RETAIN_OPEN_ROOM_PRESET, RETAIN_SHARE_EXPORT_PRESET } from "@/pages/everyday/lifecycle/stage/retain/data";
import { EXPAND_OPEN_ROOM_PRESET, EXPAND_SHARE_EXPORT_PRESET } from "@/pages/everyday/lifecycle/stage/expand/data";
import { SUPPORT_OPEN_ROOM_PRESET, SUPPORT_SHARE_EXPORT_PRESET } from "@/pages/everyday/lifecycle/stage/support/data";
import { RENEW_OPEN_ROOM_PRESET, RENEW_SHARE_EXPORT_PRESET } from "@/pages/everyday/lifecycle/stage/renew/data";
import {
  ADVOCATE_ASSIGN_OWNER_PRESET,
  ADVOCATE_OPEN_ROOM_PRESET,
  ADVOCATE_OVERVIEW_INSIGHT,
  ADVOCATE_OVERVIEW_LEAD,
  ADVOCATE_SHARE_EXPORT_PRESET,
} from "@/pages/everyday/lifecycle/stage/advocate/data";
import {
  CHURN_ASSIGN_OWNER_PRESET,
  CHURN_OPEN_ROOM_PRESET,
  CHURN_OVERVIEW_INSIGHT,
  CHURN_OVERVIEW_LEAD,
  CHURN_SHARE_EXPORT_PRESET,
} from "@/pages/everyday/lifecycle/stage/churn/data";

type OverviewData = {
  /** A callout shown before the KPI cards, for a finding urgent enough to lead the page (e.g. Advocate's "no owner" banner). */
  leadTitle?: string;
  leadBody?: string;
  leadTone?: "ultra" | "amber" | "rose" | "teal" | "neutral";
  barEyebrow?: string;
  barRows?: { label: string; value: string; percent: number; tone: BarTone }[];
  insightTitle: string;
  insightBody: string;
  insightTone?: "ultra" | "amber" | "rose" | "teal" | "neutral";
  leakEyebrow: string;
  leakWhereHeader: string;
  showStageRail?: boolean;
  openRoomPreset: OpenRoomPreset;
  shareExportPreset: ShareOrExportPreset;
  /** Renders an "Assign an owner" header button, for a stage with no owner (Advocate only). */
  assignOwnerPreset?: AssignOwnerPreset;
};

const OVERVIEW_DATA: Record<string, OverviewData> = {
  acquire: {
    barEyebrow: "Volume is up 31% and quality is down 11 points",
    barRows: ACQUIRE_OVERVIEW_BAR_ROWS,
    insightTitle: "More customers, fewer second orders, and both numbers are correct",
    insightBody:
      "Acquisition rose 212,000 while second orders fell 17,000. Read either alone and you get the opposite answer about whether this stage is working — which is why the headline figure on this screen is a rate, not a count.",
    leakEyebrow: "What is leaking, in order",
    leakWhereHeader: "Where",
    openRoomPreset: ACQUIRE_OPEN_ROOM_PRESET,
    shareExportPreset: ACQUIRE_SHARE_EXPORT_PRESET,
  },
  activate: {
    insightTitle: "116,000 customers had a perfectly good first order and never came back, and nobody knows why",
    insightBody:
      "It is the third-largest group in the stage and the only one with no reading behind it. Everything Flolyt can see about them looks normal. That is a real answer and it is stated as one — a plausible story would be worse than an admitted gap.",
    insightTone: "amber",
    leakEyebrow: "What is leaking, in order",
    leakWhereHeader: "Where they stop",
    showStageRail: true,
    openRoomPreset: ACTIVATE_OPEN_ROOM_PRESET,
    shareExportPreset: ACTIVATE_SHARE_EXPORT_PRESET,
  },
  price: {
    insightTitle: "Two of the five largest items on this screen cannot be valued at all",
    insightBody:
      "Legacy Unlimited and absorbed delivery fees are almost certainly losing money — 3,100 customers on a 2022 price and 41,000 subscriptions eating a fee introduced in 2026. Neither can be priced without cost of goods, so neither is in the ₦46M, and neither has a room.",
    insightTone: "rose",
    leakEyebrow: "What is leaking, in order",
    leakWhereHeader: "Where",
    showStageRail: true,
    openRoomPreset: PRICE_OPEN_ROOM_PRESET,
    shareExportPreset: PRICE_SHARE_EXPORT_PRESET,
  },
  adopt: {
    insightTitle: "An entire feature is invisible to this stage",
    insightBody:
      "Loyalty tiers were renamed in April and have never emitted an event. Flolyt cannot say how many customers use them, whether the rename helped or hurt, or whether the feature does anything at all. It is listed as unavailable rather than left off the table.",
    insightTone: "rose",
    leakEyebrow: "What is leaking, in order",
    leakWhereHeader: "Group",
    showStageRail: true,
    openRoomPreset: ADOPT_OPEN_ROOM_PRESET,
    shareExportPreset: ADOPT_SHARE_EXPORT_PRESET,
  },
  retain: {
    insightTitle: "142,000 of these customers cannot be contacted by anybody, ever",
    insightBody:
      "No email, no consent, no push — they checked out as guests. They are inside the 148,000 in the reactivation room and will be silently dropped at send time. The only fix for them was upstream, in Activate, at the moment the account was offered and was not.",
    insightTone: "rose",
    leakEyebrow: "What is leaking, in order",
    leakWhereHeader: "Group",
    showStageRail: true,
    openRoomPreset: RETAIN_OPEN_ROOM_PRESET,
    shareExportPreset: RETAIN_SHARE_EXPORT_PRESET,
  },
  expand: {
    insightTitle: "This is the only stage whose own numbers improved this quarter, and it means less than it looks",
    insightBody:
      "Expansion rate rose 0.7 points while the eligible population fell 11%. Expansion works on customers who stay, and Retain is producing fewer of them. A healthy rate applied to a shrinking base is how a stage can be doing its job and still be worth less every quarter.",
    insightTone: "amber",
    leakEyebrow: "What is leaking, in order",
    leakWhereHeader: "Where",
    showStageRail: true,
    openRoomPreset: EXPAND_OPEN_ROOM_PRESET,
    shareExportPreset: EXPAND_SHARE_EXPORT_PRESET,
  },
  support: {
    insightTitle: "The ₦9M is what Support can fix. The ₦38M is what Support can only see.",
    insightBody:
      "This stage's own number is small because most of what it detects belongs to Delivery, Product or Engineering. Support is the earliest and cheapest sensor in the lifecycle and the one with the least ability to act on what it senses.",
    insightTone: "amber",
    leakEyebrow: "What is leaking, in order",
    leakWhereHeader: "Where",
    showStageRail: true,
    openRoomPreset: SUPPORT_OPEN_ROOM_PRESET,
    shareExportPreset: SUPPORT_SHARE_EXPORT_PRESET,
  },
  renew: {
    insightTitle: "Nobody in the ₦88M decided to leave",
    insightBody:
      "61,400 cards failed on renewal night because they were presented at midnight, when balances are lowest. These customers wanted the service, were willing to pay for it, and were lost to an implementation detail. It is the only ₦88M in this lifecycle that needed no persuasion, no discount and no product change.",
    insightTone: "teal",
    leakEyebrow: "What is leaking, in order",
    leakWhereHeader: "Where",
    showStageRail: true,
    openRoomPreset: RENEW_OPEN_ROOM_PRESET,
    shareExportPreset: RENEW_SHARE_EXPORT_PRESET,
  },
  advocate: {
    leadTitle: ADVOCATE_OVERVIEW_LEAD.title,
    leadBody: ADVOCATE_OVERVIEW_LEAD.body,
    leadTone: "amber",
    insightTitle: ADVOCATE_OVERVIEW_INSIGHT.title,
    insightBody: ADVOCATE_OVERVIEW_INSIGHT.body,
    insightTone: "rose",
    leakEyebrow: "Where the value is, and where it is going",
    leakWhereHeader: "Where",
    showStageRail: true,
    openRoomPreset: ADVOCATE_OPEN_ROOM_PRESET,
    shareExportPreset: ADVOCATE_SHARE_EXPORT_PRESET,
    assignOwnerPreset: ADVOCATE_ASSIGN_OWNER_PRESET,
  },
  churn: {
    leadTitle: CHURN_OVERVIEW_LEAD.title,
    leadBody: CHURN_OVERVIEW_LEAD.body,
    leadTone: "amber",
    insightTitle: CHURN_OVERVIEW_INSIGHT.title,
    insightBody: CHURN_OVERVIEW_INSIGHT.body,
    leakEyebrow: "What is leaking, in order",
    leakWhereHeader: "Where",
    showStageRail: true,
    openRoomPreset: CHURN_OPEN_ROOM_PRESET,
    shareExportPreset: CHURN_SHARE_EXPORT_PRESET,
    assignOwnerPreset: CHURN_ASSIGN_OWNER_PRESET,
  },
};

const TREND_TONE_CLASS: Record<string, string> = {
  worsening: "text-rose",
  improving: "text-teal",
  flat: "text-ink-4",
};

// `claim.grade`'s real enum values aren't confirmed by any live response (departures have only
// ever come back empty) — matched defensively by keyword, same pattern as safeCalloutTone
// elsewhere in this domain, rather than assuming an exact string.
function claimTone(grade: string): ChipTone {
  const normalized = grade.toLowerCase();
  if (normalized.includes("causal")) return "ultra";
  if (normalized.includes("correlat")) return "amber";
  return "neutral";
}

// The leak table (all 10 stages, shared) is wired to GET /lifecycle/stages/{stageKey}'s
// `departures[]` — grouped by exit-rule cause, the same field every stage's own Overview KPIs
// already read from. Every live response seen so far returned `departures: []` (empty, not
// populated rows), so the empty state below is what every stage currently shows — that's this
// endpoint's own honest answer, not a loading or wiring bug. `observedValue`/`reachability` are a
// plain `number | string | null` paired with their own `*Caveat` string here, NOT the 4-field
// `{value,state,missingSource,wouldUnlock}` wrapper used elsewhere in this domain — confirm this
// shape against a live response with real rows before trusting it further; nothing has confirmed
// `claim.grade`'s real values either, hence `claimTone`'s defensive keyword match above. The old
// per-stage "owner" column (Acquire only) is dropped — no owner field exists on a departure.
type DepartureRow = StageDepartureDto & { id: string };

// Every stage's KPI row is wired to the same GET /lifecycle/stages/{stageKey} endpoint — it
// returns the identical 4 generic measured-value fields (population/atStake/rateOfChange/
// primaryConversion) for every stage, unlike Cohorts/Markets where the real endpoint's shape
// didn't match most stages' bespoke designs at all.
//
// Corrected 2026-09-06, caught by the user: an earlier pass here reused every stage's OLD MOCK
// card label assuming it still described what the live field measures — it does not, and this
// doc's own coverage-tracker note above (written 2026-08-31, before that pass) already said so:
// "Acquire/Activate's 'Acquired · 12 months' card is a real population match; Retain's identical
// card is NOT its own population — it's echoing Acquire's top-of-funnel number for context, a
// different concept than 'who's in Retain now'." Price's "Customers with revenue" (really a
// 90-day revenue filter) and Support's "Something went wrong"/"Told us about it" (monthly
// incident rates against active-customer count) are flagged the same way. No live check has ever
// confirmed what `primaryConversion` measures for any stage besides Acquire/Activate either —
// "Adopting · 2+ features", "Ever won back", etc. were invented labels, not verified ones.
// Only Acquire and Activate's labels are kept (both live-checked, both previously reviewed);
// every other stage now shows the plain, honest field name rather than a fabricated-sounding
// per-stage claim — a generic label that's actually true beats a specific one that might not be.
const POPULATION_LABEL: Record<string, string> = {
  acquire: "Acquired · 12 months",
  activate: "Acquired · 12 months",
};

const PRIMARY_CONVERSION_LABEL: Record<string, string> = {
  acquire: "Reach a second order",
  activate: "Reach value",
};

// Only Acquire/Activate had a live-checked note on this card — kept verbatim rather than
// inventing similar-sounding notes for the other 8, which would need context (a prior-period
// comparison, a definition nuance) this single live field doesn't carry.
const PRIMARY_CONVERSION_NOTE: Partial<Record<string, string>> = {
  acquire: "the number that decides if this is good",
  activate: "activation, not just a first order",
};

function buildStageKpis(stageData: StageData | undefined, stageSlug: string): Kpi[] {
  if (!stageData) return [];
  const { population, rateOfChange, yearOverYear, atStake, primaryConversion } = stageData;
  const populationLabel = POPULATION_LABEL[stageSlug] ?? "Population";
  const conversionLabel = PRIMARY_CONVERSION_LABEL[stageSlug] ?? "Primary conversion";
  const conversionNote = PRIMARY_CONVERSION_NOTE[stageSlug];

  const populationNote =
    yearOverYear.value !== null ? `${yearOverYear.value >= 0 ? "+" : ""}${formatPercent(yearOverYear.value)} on last year` : undefined;

  return [
    population.value !== null
      ? { eyebrow: populationLabel, value: formatCount(population.value), tone: "teal", note: populationNote }
      : { eyebrow: populationLabel, unavailable: { missingSource: population.missingSource, wouldUnlock: population.wouldUnlock } },
    atStake.value !== null
      ? { eyebrow: "At stake", value: formatCompactCurrency(atStake.value), tone: "rose", note: "in this stage alone" }
      : { eyebrow: "At stake", unavailable: { missingSource: atStake.missingSource, wouldUnlock: atStake.wouldUnlock } },
    rateOfChange.value !== null
      ? { eyebrow: "Rate of change", value: `${rateOfChange.value >= 0 ? "+" : ""}${formatPercent(rateOfChange.value)}`, tone: rateOfChange.value >= 0 ? "teal" : "rose", note: "month over month" }
      : { eyebrow: "Rate of change", unavailable: { missingSource: rateOfChange.missingSource, wouldUnlock: rateOfChange.wouldUnlock } },
    primaryConversion.value !== null
      ? { eyebrow: conversionLabel, value: formatPercent(primaryConversion.value), tone: "rose", note: conversionNote }
      : { eyebrow: conversionLabel, unavailable: { missingSource: primaryConversion.missingSource, wouldUnlock: primaryConversion.wouldUnlock } },
  ];
}

/** Screen A02 (and the shared template for every stage's Overview tab). */
export function OverviewTab() {
  const { stage, headerActionsEl } = useStageContext();
  const [openRoomFor, setOpenRoomFor] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [assignOwnerOpen, setAssignOwnerOpen] = useState(false);

  const stageQuery = useGetStage(stage.slug);

  if (!stage.isDefined) return <StageEmptyState stageName={stage.name} />;

  const data = OVERVIEW_DATA[stage.slug];
  if (!data) return null;

  const kpis = buildStageKpis(stageQuery.data?.data, stage.slug);
  const departures: DepartureRow[] = (stageQuery.data?.data.departures ?? []).map((departure) => ({ ...departure, id: departure.cause }));

  const columns: Column<DepartureRow>[] = [
    { key: "where", header: data.leakWhereHeader, render: (row) => <span className="font-semibold text-ink-2">{row.cause}</span> },
    {
      key: "customers",
      header: "Customers",
      align: "right",
      render: (row) => (row.size !== null ? <span className="font-mono text-ink">{formatCount(row.size)}</span> : <InfoTooltip />),
    },
    {
      key: "value",
      header: "Value",
      align: "right",
      render: (row) =>
        row.observedValue !== null ? (
          <span className="text-rose">{formatCompactCurrency(row.observedValue)}</span>
        ) : (
          <InfoTooltip missingSource={row.observedValueCaveat ?? undefined} />
        ),
    },
    {
      key: "trend",
      header: "Trend",
      align: "right",
      render: (row) =>
        row.trend.direction !== null ? (
          <span className={TREND_TONE_CLASS[row.trend.direction] ?? "text-ink-4"}>
            {row.trend.direction}
            {row.trend.shareChange !== null && ` · ${row.trend.shareChange >= 0 ? "+" : ""}${formatPercent(row.trend.shareChange)}`}
          </span>
        ) : (
          <InfoTooltip missingSource={row.trend.missingSource ?? undefined} />
        ),
    },
    {
      key: "causeKnown",
      header: "Cause known?",
      render: (row) => <Chip tone={claimTone(row.claim.grade)}>{row.claim.grade}</Chip>,
    },
    {
      key: "room",
      header: "Room",
      align: "right",
      render: (row) => (
        <button type="button" onClick={() => setOpenRoomFor(row.id)}>
          <Chip tone={row.roomOpen ? "amber" : "neutral"} className={CHIP_INTERACTIVE_CLASS}>
            {row.roomOpen ? "open" : "none"}
          </Chip>
        </button>
      ),
    },
  ];

  const leakTable = stageQuery.isError ? (
    <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
      <p className="text-[12px] text-rose">Couldn't load what's leaking in this stage.</p>
      <Button type="button" variant="outline" size="sm" onClick={() => stageQuery.refetch()}>
        Retry
      </Button>
    </div>
  ) : stageQuery.isLoading ? (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-16 rounded-chip" />
        </div>
      ))}
    </div>
  ) : (
    <DataTable
      columns={columns}
      rows={departures}
      emptyTitle="No departures measured yet"
      emptyBody="Dated exit causes for this stage will appear here once Flolyt has enough history to group them."
    />
  );

  return (
    <div className="space-y-8">
      {headerActionsEl &&
        createPortal(
          <>
            {(stage.slug === "activate" || stage.slug === "price" || stage.slug === "adopt" || stage.slug === "retain" || stage.slug === "expand" || stage.slug === "support" || stage.slug === "renew" || stage.slug === "advocate" || stage.slug === "churn") && (
              <Link to={`/lifecycle/${stage.slug}/definition`} className="text-[11px] font-semibold text-ink-3 hover:text-ink">
                How this stage is defined
              </Link>
            )}
            <Link to={`/lifecycle/${stage.slug}/compare`} className="text-[11px] font-semibold text-ink-3 hover:text-ink">
              Compare periods
            </Link>
            <button type="button" onClick={() => setShareOpen(true)} className="text-[11px] font-semibold text-ink-3 hover:text-ink">
              Share or export
            </button>
            {data.assignOwnerPreset && (
              <Button type="button" size="sm" onClick={() => setAssignOwnerOpen(true)}>
                Assign an owner
              </Button>
            )}
          </>,
          headerActionsEl
        )}

      {data.leadTitle && data.leadBody && (
        <Callout tone={data.leadTone ?? "amber"} title={data.leadTitle}>
          {data.leadBody}
        </Callout>
      )}

      <KpiCards
        items={kpis}
        isLoading={stageQuery.isLoading}
        isError={stageQuery.isError}
        onRetry={() => stageQuery.refetch()}
      />

      {data.barEyebrow && data.barRows && (
        <section className="space-y-3">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            {data.barEyebrow}
          </p>
          <div className="space-y-3">
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
          {leakTable}
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
          {leakTable}
        </section>
      )}

      {data.showStageRail && <OverviewStageRail stages={STAGES} activeSlug={stage.slug} />}

      <OpenARoomModal
        preset={data.openRoomPreset}
        open={openRoomFor !== null}
        onOpenChange={(open) => setOpenRoomFor(open ? openRoomFor : null)}
      />
      <ShareOrExportModal preset={data.shareExportPreset} open={shareOpen} onOpenChange={setShareOpen} />
      {data.assignOwnerPreset && (
        <AssignAnOwnerModal preset={data.assignOwnerPreset} open={assignOwnerOpen} onOpenChange={setAssignOwnerOpen} />
      )}
    </div>
  );
}
