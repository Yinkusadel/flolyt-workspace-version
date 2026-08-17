import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { SetThresholdModal, type ThresholdPreset } from "@/pages/lifecycle/stage/modals/set-a-threshold-modal";
import {
  ACQUIRE_AGENT_CARDS,
  ACQUIRE_THRESHOLD_PRESET,
  ACQUIRE_THRESHOLD_ROWS,
  type AgentCard,
  type ThresholdRow,
} from "@/pages/lifecycle/stage/acquire/data";
import {
  ACTIVATE_AGENT_CARDS,
  ACTIVATE_THRESHOLD_PRESET,
  ACTIVATE_THRESHOLD_ROWS,
} from "@/pages/lifecycle/stage/activate/data";
import {
  PRICE_AGENT_CARDS,
  PRICE_THRESHOLD_PRESET,
  PRICE_THRESHOLD_ROWS,
} from "@/pages/lifecycle/stage/price/data";
import {
  ADOPT_AGENT_CARDS,
  ADOPT_THRESHOLD_PRESET,
  ADOPT_THRESHOLD_ROWS,
} from "@/pages/lifecycle/stage/adopt/data";

type AgentsData = {
  eyebrow: string;
  cards: AgentCard[];
  tableEyebrow: string;
  rows: ThresholdRow[];
  insightTitle: string;
  insightBody: string;
  threshold: ThresholdPreset;
};

const AGENTS_DATA: Record<string, AgentsData> = {
  acquire: {
    eyebrow: "Agents watching this stage · 2",
    cards: ACQUIRE_AGENT_CARDS,
    tableEyebrow: "What would make an agent open a room here",
    rows: ACQUIRE_THRESHOLD_ROWS,
    insightTitle: "One threshold has been breached for four months and never opened a room",
    insightBody:
      "The MTN verification drop crossed its threshold on 2 April. It did not open a room because the rule routes to a stage owner and that condition has no owner assigned — so it queued, silently, for 134 days. This is the screen where that becomes visible.",
    threshold: ACQUIRE_THRESHOLD_PRESET,
  },
  activate: {
    eyebrow: "Agents watching this stage · 2",
    cards: ACTIVATE_AGENT_CARDS,
    tableEyebrow: "What would make an agent open a room here",
    rows: ACTIVATE_THRESHOLD_ROWS,
    insightTitle: "Two conditions have been breached for months with nowhere to route",
    insightBody:
      "Guest share and path floor both cross the Acquire/Activate boundary — the cause is in acquisition channel mix and the symptom is in activation. Neither stage owner considers it theirs, so the rule has no destination and the room never opens. This is the third instance of the same routing gap in two stages.",
    threshold: ACTIVATE_THRESHOLD_PRESET,
  },
  price: {
    eyebrow: "Agents watching this stage · 1, and it is partially blind",
    cards: PRICE_AGENT_CARDS,
    tableEyebrow: "What would make an agent open a room here",
    rows: PRICE_THRESHOLD_ROWS,
    insightTitle: "Two more breached thresholds with no owner — the same routing gap, fourth and fifth instance",
    insightBody:
      "Plan downgrades and FX drift both breached months ago. Both route to “Price stage owner” for the condition but to Marketing and a departed employee for the cause. This is now consistent enough across Acquire, Activate and Price to be a product problem rather than three configuration mistakes.",
    threshold: PRICE_THRESHOLD_PRESET,
  },
  adopt: {
    eyebrow: "Agents watching this stage · 1",
    cards: ADOPT_AGENT_CARDS,
    tableEyebrow: "What would make an agent open a room here",
    rows: ADOPT_THRESHOLD_ROWS,
    insightTitle: "The third row is the one that would have caught the loyalty rename in two weeks instead of four months",
    insightBody:
      "“A shipped feature emits no events after 14 days” has been breached for 118 days. It has no owner because instrumentation sits between Product, who ships the feature, and Engineering, who owns the event. Seventh instance of the same routing gap.",
    threshold: ADOPT_THRESHOLD_PRESET,
  },
};

const CARD_ACCENT_CLASS: Record<AgentCard["tone"], string> = {
  ultra: "bg-ultra",
  neutral: "bg-ink-4",
  amber: "bg-amber",
  teal: "bg-teal",
  rose: "bg-rose",
};
const CURRENTLY_TONE_CLASS: Record<ThresholdRow["currentlyTone"], string> = {
  teal: "text-teal",
  rose: "text-rose",
  amber: "text-amber",
  neutral: "text-ink-4",
};

/** The shared Agents tab template (e.g. A10) — which agents watch this stage, and what would make one open a room. */
export function AgentsTab() {
  const { stage } = useStageContext();
  const data = AGENTS_DATA[stage.slug];
  const [thresholdOpen, setThresholdOpen] = useState(false);

  if (!data) return null;

  const columns: Column<ThresholdRow>[] = [
    { key: "condition", header: "Condition", render: (row) => <span className="font-semibold text-ink-2">{row.condition}</span> },
    { key: "threshold", header: "Threshold", align: "right", render: (row) => <span className="font-mono text-ink-4">{row.threshold}</span> },
    {
      key: "currently",
      header: "Currently",
      align: "right",
      render: (row) => <span className={CURRENTLY_TONE_CLASS[row.currentlyTone]}>{row.currently}</span>,
    },
    {
      key: "status",
      header: "Would open",
      align: "right",
      render: (row) =>
        row.status === "already-open" ? (
          <Chip tone="amber">{row.statusLabel ?? "already open"}</Chip>
        ) : row.status === "not-opened" ? (
          <Chip tone="rose">{row.statusLabel ?? "not opened"}</Chip>
        ) : row.status === "blocked" ? (
          <Chip tone="amber">{row.statusLabel ?? "blocked"}</Chip>
        ) : row.status === "opens-automatically" ? (
          <Chip tone="ultra">{row.statusLabel ?? "opens automatically"}</Chip>
        ) : (
          <Chip tone="neutral">{row.statusLabel ?? "no"}</Chip>
        ),
    },
    {
      key: "owner",
      header: "Who it goes to",
      render: (row) =>
        row.owner ? (
          <span className="flex items-center gap-2 whitespace-nowrap text-ink-2">
            <PersonAvatar kind="human" initials={row.owner.initials} size="sm" style={{ backgroundColor: row.owner.color }} />
            {row.owner.name}
          </span>
        ) : row.noOwner ? (
          <Chip tone="amber">No owner</Chip>
        ) : null,
    },
    {
      key: "edit",
      header: "Edit",
      align: "right",
      render: () => (
        <button
          type="button"
          onClick={() => setThresholdOpen(true)}
          className="font-semibold text-ultra hover:underline"
        >
          edit
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{data.eyebrow}</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {data.cards.map((card) => (
            <div key={card.id} className="relative overflow-hidden rounded-card border border-line bg-paper pl-4">
              <span className={`absolute inset-y-0 left-0 w-[3px] ${CARD_ACCENT_CLASS[card.tone]}`} aria-hidden />
              <div className="space-y-2.5 p-4 pl-1">
                <div className="flex items-center gap-2">
                  {card.initials && <PersonAvatar kind="agent" initials={card.initials} size="sm" />}
                  <p className="font-mono text-[9.5px] font-medium text-ink-4">{card.status}</p>
                </div>
                <h3 className="text-[13px] font-semibold text-ink">{card.name}</h3>
                <p className="text-[10.5px] leading-relaxed text-ink-3">{card.body}</p>
                <p className="border-t border-line pt-2.5 font-mono text-[10px] font-semibold text-ultra">
                  {card.footnote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            {data.tableEyebrow}
          </p>
          <Button type="button" size="sm" className="shrink-0" onClick={() => setThresholdOpen(true)}>
            Add a threshold
          </Button>
        </div>
        <DataTable columns={columns} rows={data.rows} />
      </section>

      <Callout tone="rose" title={data.insightTitle}>
        {data.insightBody}
      </Callout>

      <SetThresholdModal
        stageName={stage.name}
        preset={data.threshold}
        open={thresholdOpen}
        onOpenChange={setThresholdOpen}
      />
    </div>
  );
}
