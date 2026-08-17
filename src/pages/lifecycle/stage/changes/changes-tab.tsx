import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip, type ChipTone } from "@/pages/lifecycle/stage/chip";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { ACQUIRE_CHANGE_ROWS, ACQUIRE_CHANGE_SOURCE_ROWS, type ChangeRow } from "@/pages/lifecycle/stage/acquire/data";
import { ACTIVATE_CHANGE_ROWS } from "@/pages/lifecycle/stage/activate/data";
import { PRICE_CHANGE_ROWS } from "@/pages/lifecycle/stage/price/data";
import { ADOPT_CHANGE_ROWS } from "@/pages/lifecycle/stage/adopt/data";
import { RETAIN_CHANGE_ROWS } from "@/pages/lifecycle/stage/retain/data";
import { EXPAND_CHANGE_ROWS } from "@/pages/lifecycle/stage/expand/data";
import { SUPPORT_CHANGE_ROWS } from "@/pages/lifecycle/stage/support/data";
import { RENEW_CHANGE_ROWS } from "@/pages/lifecycle/stage/renew/data";
import { ADVOCATE_CHANGE_ROWS, ADVOCATE_CHANGES_INSIGHT } from "@/pages/lifecycle/stage/advocate/data";
import { CHURN_CHANGE_ROWS, CHURN_CHANGES_INSIGHT } from "@/pages/lifecycle/stage/churn/data";

type ChangesData = {
  eyebrow: string;
  rows: ChangeRow[];
  insightTitle: string;
  insightBody: string;
  /** Overrides the primary closing callout's tone — defaults to "amber" (e.g. Retain's is "ultra"). */
  insightTone?: "amber" | "rose" | "teal" | "ultra";
  /** A second closing callout, for stages with two distinct findings to flag (e.g. Price's undated Ghana price). */
  secondInsightTone?: "amber" | "rose" | "teal" | "ultra";
  secondInsightTitle?: string;
  secondInsightBody?: string;
  sourceEyebrow?: string;
  sourceRows?: { label: string; value: string; tone: "teal" | "amber" | "ultra" | "neutral" }[];
};

const CHANGES_DATA: Record<string, ChangesData> = {
  acquire: {
    eyebrow: "Dated changes that moved something in this stage",
    rows: ACQUIRE_CHANGE_ROWS,
    insightTitle: "One change on this list has never been measured",
    insightBody:
      "The loyalty tier rename shipped without an event, so its effect is unknown rather than zero. It is listed as not instrumented — and the request to instrument it is one of the fourteen overdue obligations sitting with Engineering.",
    sourceEyebrow: "How a change gets onto this list",
    sourceRows: ACQUIRE_CHANGE_SOURCE_ROWS,
  },
  activate: {
    eyebrow: "Dated changes that moved something in this stage",
    rows: ACTIVATE_CHANGE_ROWS,
    insightTitle: "Two of these were shipped by teams who will never see this screen",
    insightBody:
      "Engineering has no reason to open Activate and Marketing has no reason to look past Acquire. The two changes with the largest effect on this stage were made by people whose own dashboards showed nothing wrong. Everything else in Flolyt follows from that fact.",
  },
  price: {
    eyebrow: "Dated changes that moved something in this stage",
    rows: PRICE_CHANGE_ROWS,
    insightTitle: "The 4 March delivery fee is a pricing change and it was never reviewed as one",
    insightBody:
      "It raised the effective price of 61% of orders by ₦350 without appearing in any price list, any plan, or any Finance review. It shipped as an engineering change. Ravi owns Price and found out about it in August, in a war room, five stages downstream.",
    secondInsightTone: "amber",
    secondInsightTitle: "One change on this list has no owner and no date",
    secondInsightBody:
      "Ghana's price was set in August 2024 by someone who has since left, with no review cadence attached. Flolyt cannot tell you why it was never revisited — only that it has not been, for 22 months, and that it costs 410,000 customers a 22% premium.",
  },
  adopt: {
    eyebrow: "Dated changes that moved something in this stage",
    rows: ADOPT_CHANGE_ROWS,
    insightTitle: "The wallet is the only entry here that failed on its own terms",
    insightBody:
      "Everything else on this list was damaged by a decision made elsewhere or has no reading at all. The wallet shipped, worked, and then nothing was built to bring anyone back to it — no balance reminder, no auto-top-up, no follow-up. It is the cheapest fix in the stage and has been sitting untouched for nine months.",
  },
  retain: {
    eyebrow: "Dated changes that moved something in this stage",
    rows: RETAIN_CHANGE_ROWS,
    insightTitle: "Every entry on this list has a measured effect, which is unusual",
    insightBody:
      "Retain is the most instrumented stage in the workspace because it is the one everyone has always been judged on. It has no blind spots and no unavailable rows — and it still took twenty weeks to find the cause, because the cause was not in this stage.",
    insightTone: "ultra",
    secondInsightTone: "amber",
    secondInsightTitle: "The 7 August fix is being measured right now, against a holdout",
    secondInsightBody:
      "18,900 customers have seen the fee at basket rather than at checkout. It is too early for a reading and the screen says so rather than showing an encouraging early number that will move.",
  },
  expand: {
    eyebrow: "Dated changes that moved something in this stage",
    rows: EXPAND_CHANGE_ROWS,
    insightTitle: "The last row is not a change and it is on the list deliberately",
    insightBody:
      "A behavioural upgrade prompt has never been built, so it has no date, no team and no effect. It is the largest identified opportunity in the stage. Listing only what happened would make this screen a record of decisions taken and silent about the one that never was.",
    insightTone: "rose",
    secondInsightTone: "ultra",
    secondInsightTitle: "The 4 March fee is the only stage in the lifecycle where it did nothing",
    secondInsightBody:
      "Expansion rate held at 19.7% through it. That is a real negative finding and it is worth as much as the positive ones — it tells you the fee damaged frequency and value-per-customer, and left the willingness to move up a tier untouched.",
  },
  support: {
    eyebrow: "Dated changes that moved something in this stage",
    rows: SUPPORT_CHANGE_ROWS,
    insightTitle: "Four of the six changes here were made by Support and three of them made revenue worse",
    insightBody:
      "Every one was a sensible cost decision. The chatbot, the article and the Ghana headcount cut all reduced handling cost and all reduced retention, because this stage has been optimised against a cost metric for years with no visibility of the revenue on the other side of it.",
    insightTone: "rose",
    secondInsightTone: "teal",
    secondInsightTitle: "The one that worked is the one that cost more",
    secondInsightBody:
      "Proactive outreach on failed deliveries adds handling cost and returns 31.4% retention against a holdout — the best measured intervention anywhere in the lifecycle. It exists because Amara ran it as an experiment, not because a system suggested it.",
  },
  renew: {
    eyebrow: "Dated changes that moved something in this stage",
    rows: RENEW_CHANGE_ROWS,
    insightTitle: "Two entries here are the absence of an action, not an action",
    insightBody:
      "The Ghana rollout that did not happen and the re-forecast that has not started are both listed as dated changes, because in this stage a thing not done has exactly the same measurable effect as a thing done. A change log that only records deployments would show neither.",
    insightTone: "rose",
  },
  advocate: {
    eyebrow: "Dated changes that moved something in this stage",
    rows: ADVOCATE_CHANGE_ROWS,
    insightTitle: ADVOCATE_CHANGES_INSIGHT.title,
    insightBody: ADVOCATE_CHANGES_INSIGHT.body,
    insightTone: "rose",
  },
  churn: {
    eyebrow: "Dated changes that moved something in this stage",
    rows: CHURN_CHANGE_ROWS,
    insightTitle: CHURN_CHANGES_INSIGHT.title,
    insightBody: CHURN_CHANGES_INSIGHT.body,
    insightTone: "rose",
  },
};

const EFFECT_TONE_CLASS: Record<ChangeRow["effectTone"], string> = {
  teal: "text-teal",
  rose: "text-rose",
  amber: "text-amber",
  neutral: "text-ink-4",
  ultra: "text-ultra",
};

const BADGE_TONE: Record<ChangeRow["badgeTone"], ChipTone> = { ultra: "ultra", neutral: "neutral", amber: "amber" };

const SOURCE_TONE_CLASS: Record<"teal" | "amber" | "ultra" | "neutral", string> = {
  teal: "text-teal",
  amber: "text-amber",
  ultra: "text-ultra",
  neutral: "text-ink-3",
};

/** The shared "What changed" tab template (e.g. A09) — dated changes with a measured effect where one exists. */
export function ChangesTab() {
  const { stage } = useStageContext();
  const data = CHANGES_DATA[stage.slug];
  if (!data) return null;
  const rowHref = (row: ChangeRow) => `/lifecycle/${stage.slug}/changes/${row.id}`;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{data.eyebrow}</p>
        <Button type="button" size="sm" className="shrink-0">
          Add a change
        </Button>
      </div>

      <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-paper">
        {data.rows.map((row) => (
          <div key={row.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex shrink-0 items-center gap-2 sm:w-24">
              <span className="font-mono text-[10.5px] text-ink-4">{row.date}</span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:w-28">
              <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: row.teamColor }} aria-hidden />
              <span className="font-mono text-[10px] font-medium" style={{ color: row.teamColor }}>
                {row.team}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              {row.hasDetail ? (
                <Link to={rowHref(row)} className="text-[12px] font-semibold text-ultra hover:underline">
                  {row.title}
                </Link>
              ) : (
                <p className="text-[12px] font-semibold text-ink">{row.title}</p>
              )}
              <p className={`text-[10px] ${EFFECT_TONE_CLASS[row.effectTone]}`}>{row.effect}</p>
            </div>
            <Chip tone={BADGE_TONE[row.badgeTone]}>{row.badge}</Chip>
          </div>
        ))}
      </div>

      <Callout tone={data.insightTone ?? "amber"} title={data.insightTitle}>
        {data.insightBody}
      </Callout>

      {data.secondInsightTitle && data.secondInsightBody && (
        <Callout tone={data.secondInsightTone ?? "amber"} title={data.secondInsightTitle}>
          {data.secondInsightBody}
        </Callout>
      )}

      {data.sourceEyebrow && data.sourceRows && (
        <section className="space-y-1">
          <p className="pb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            {data.sourceEyebrow}
          </p>
          <div className="divide-y divide-line rounded-card border border-line bg-paper">
            {data.sourceRows.map((row) => (
              <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <span className="text-[11.5px] text-ink-2">{row.label}</span>
                <span className={`font-mono text-[11px] ${SOURCE_TONE_CLASS[row.tone]}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
