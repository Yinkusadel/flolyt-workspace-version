import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { SetThresholdModal, type ThresholdPreset } from "@/pages/everyday/lifecycle/stage/modals/set-a-threshold-modal";
import { AssignAnOwnerModal, type AssignOwnerPreset } from "@/pages/everyday/lifecycle/stage/modals/assign-an-owner-modal";
import {
  ACQUIRE_AGENT_CARDS,
  ACQUIRE_THRESHOLD_PRESET,
  ACQUIRE_THRESHOLD_ROWS,
  type AgentCard,
  type ThresholdRow,
} from "@/pages/everyday/lifecycle/stage/acquire/data";
import {
  ACTIVATE_AGENT_CARDS,
  ACTIVATE_THRESHOLD_PRESET,
  ACTIVATE_THRESHOLD_ROWS,
} from "@/pages/everyday/lifecycle/stage/activate/data";
import {
  PRICE_AGENT_CARDS,
  PRICE_THRESHOLD_PRESET,
  PRICE_THRESHOLD_ROWS,
} from "@/pages/everyday/lifecycle/stage/price/data";
import {
  ADOPT_AGENT_CARDS,
  ADOPT_THRESHOLD_PRESET,
  ADOPT_THRESHOLD_ROWS,
} from "@/pages/everyday/lifecycle/stage/adopt/data";
import {
  RETAIN_AGENT_CARDS,
  RETAIN_THRESHOLD_PRESET,
  RETAIN_THRESHOLD_ROWS,
} from "@/pages/everyday/lifecycle/stage/retain/data";
import {
  EXPAND_AGENT_CARDS,
  EXPAND_THRESHOLD_PRESET,
  EXPAND_THRESHOLD_ROWS,
} from "@/pages/everyday/lifecycle/stage/expand/data";
import {
  SUPPORT_AGENT_CARDS,
  SUPPORT_THRESHOLD_PRESET,
  SUPPORT_THRESHOLD_ROWS,
} from "@/pages/everyday/lifecycle/stage/support/data";
import {
  RENEW_AGENT_CARDS,
  RENEW_THRESHOLD_PRESET,
  RENEW_THRESHOLD_ROWS,
} from "@/pages/everyday/lifecycle/stage/renew/data";
import {
  ADVOCATE_AGENT_CARDS,
  ADVOCATE_AGENTS_INSIGHT,
  ADVOCATE_ASSIGN_OWNER_PRESET,
  ADVOCATE_THRESHOLD_PRESET,
  ADVOCATE_THRESHOLD_ROWS,
} from "@/pages/everyday/lifecycle/stage/advocate/data";
import {
  CHURN_AGENT_CARDS,
  CHURN_AGENTS_INSIGHT,
  CHURN_ASSIGN_OWNER_PRESET,
  CHURN_THRESHOLD_PRESET,
  CHURN_THRESHOLD_ROWS,
} from "@/pages/everyday/lifecycle/stage/churn/data";

type AgentsData = {
  eyebrow: string;
  cards: AgentCard[];
  tableEyebrow: string;
  rows: ThresholdRow[];
  insightTitle: string;
  insightBody: string;
  threshold: ThresholdPreset;
  /** Renders an "Assign an owner" header button, for a stage with no owner (Advocate only). */
  assignOwnerPreset?: AssignOwnerPreset;
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
  retain: {
    eyebrow: "Agents watching this stage · 3 · the most of any stage",
    cards: RETAIN_AGENT_CARDS,
    tableEyebrow: "What would make an agent open a room here",
    rows: RETAIN_THRESHOLD_ROWS,
    insightTitle: "The fourth condition is the most valuable rule in the workspace and it has nowhere to route",
    insightBody:
      "“A release ships in a market that lost this before” is precisely the rule that would have caught Kenya in June and would catch Ghana next month. It has no owner because a release is Engineering's, a market is nobody's, and the stage is Marketing's. Eighth instance.",
    threshold: RETAIN_THRESHOLD_PRESET,
  },
  expand: {
    eyebrow: "Agents watching this stage · 2",
    cards: EXPAND_AGENT_CARDS,
    tableEyebrow: "What would make an agent open a room here",
    rows: EXPAND_THRESHOLD_ROWS,
    insightTitle: "Three breached thresholds, three with no owner — and one of them is circular",
    insightBody:
      "An account renewing unowned cannot open a room, because a room needs an owner and the reason the condition fired is that there is no owner. Ninth instance of the routing gap, and the first one that cannot be fixed by assigning the rule better. It needs a fallback, not a destination.",
    threshold: EXPAND_THRESHOLD_PRESET,
  },
  support: {
    eyebrow: "Agents watching this stage · 1",
    cards: SUPPORT_AGENT_CARDS,
    tableEyebrow: "What would make an agent open a room here",
    rows: SUPPORT_THRESHOLD_ROWS,
    insightTitle: "The first rule now exists because of what it cost when it did not",
    insightBody:
      "“A contact driver is reclassified as revenue” was added on 2 August, the day room 8f2c connected five stages. Had it existed on 11 March, Amara would have had a room on her desk in week one and the ₦412M would have been ₦20M. Two more rules on this screen still have nowhere to route — tenth and eleventh instance.",
    threshold: SUPPORT_THRESHOLD_PRESET,
  },
  renew: {
    eyebrow: "Agents watching this stage · 2",
    cards: RENEW_AGENT_CARDS,
    tableEyebrow: "What would make an agent open a room here",
    rows: RENEW_THRESHOLD_ROWS,
    insightTitle: "The second rule is the one that would have caught Ghana, and it is the twelfth unrouted condition",
    insightBody:
      "“A fix is not rolled out to every market within fourteen days” has been breached for 134 days. It has no owner because a rollout belongs to whoever deployed it, a market belongs to nobody, and the stage belongs to Customer Success. Same shape as the eleven before it, in the eighth stage running.",
    threshold: RENEW_THRESHOLD_PRESET,
  },
  advocate: {
    eyebrow: "Agents watching this stage · 1 · with nowhere to send anything",
    cards: ADVOCATE_AGENT_CARDS,
    tableEyebrow: "What would make an agent open a room here",
    rows: ADVOCATE_THRESHOLD_ROWS,
    insightTitle: ADVOCATE_AGENTS_INSIGHT.title,
    insightBody: ADVOCATE_AGENTS_INSIGHT.body,
    threshold: ADVOCATE_THRESHOLD_PRESET,
    assignOwnerPreset: ADVOCATE_ASSIGN_OWNER_PRESET,
  },
  churn: {
    eyebrow: "Agents watching this stage · 1",
    cards: CHURN_AGENT_CARDS,
    tableEyebrow: "What would make an agent open a room here",
    rows: CHURN_THRESHOLD_ROWS,
    insightTitle: CHURN_AGENTS_INSIGHT.title,
    insightBody: CHURN_AGENTS_INSIGHT.body,
    threshold: CHURN_THRESHOLD_PRESET,
    assignOwnerPreset: CHURN_ASSIGN_OWNER_PRESET,
  },
};

const CARD_FOOTNOTE_TEXT_CLASS: Record<NonNullable<AgentCard["footnoteTone"]>, string> = {
  ultra: "text-ultra",
  neutral: "text-ink-4",
  amber: "text-amber",
  teal: "text-teal",
  rose: "text-rose",
};
const CURRENTLY_TONE_CLASS: Record<ThresholdRow["currentlyTone"], string> = {
  teal: "text-teal",
  rose: "text-rose",
  amber: "text-amber",
  neutral: "text-ink-4",
};

/** The shared Agents tab template (e.g. A10) — which agents watch this stage, and what would make one open a room. */
export function AgentsTab() {
  const { stage, headerActionsEl } = useStageContext();
  const data = AGENTS_DATA[stage.slug];
  const [thresholdOpen, setThresholdOpen] = useState(false);
  const [assignOwnerOpen, setAssignOwnerOpen] = useState(false);

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
      {data.assignOwnerPreset &&
        headerActionsEl &&
        createPortal(
          <Button type="button" size="sm" onClick={() => setAssignOwnerOpen(true)}>
            Assign an owner
          </Button>,
          headerActionsEl
        )}

      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{data.eyebrow}</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {data.cards.map((card) => (
            <div key={card.id} className="rounded-card border border-line bg-paper">
              <div className="space-y-2.5 p-4">
                <div className="flex items-center gap-2">
                  {card.initials && <PersonAvatar kind="agent" initials={card.initials} size="sm" />}
                  <p className="font-mono text-[9.5px] font-medium text-ink-4">{card.status}</p>
                </div>
                <h3 className="text-[13px] font-semibold text-ink">{card.name}</h3>
                <p className="text-[10.5px] leading-relaxed text-ink-3">{card.body}</p>
                <p className={`border-t border-line pt-2.5 font-mono text-[10px] font-semibold ${CARD_FOOTNOTE_TEXT_CLASS[card.footnoteTone ?? "ultra"]}`}>
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
      {data.assignOwnerPreset && (
        <AssignAnOwnerModal preset={data.assignOwnerPreset} open={assignOwnerOpen} onOpenChange={setAssignOwnerOpen} />
      )}
    </div>
  );
}
