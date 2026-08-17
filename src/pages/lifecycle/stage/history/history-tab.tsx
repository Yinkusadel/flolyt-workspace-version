import { PersonAvatar } from "@/components/person-avatar";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { ACQUIRE_GOAL_ROWS, ACQUIRE_TRIED_ROWS, type GoalRow, type TriedRow } from "@/pages/lifecycle/stage/acquire/data";
import { ACTIVATE_GOAL_ROWS, ACTIVATE_TRIED_ROWS } from "@/pages/lifecycle/stage/activate/data";
import { PRICE_GOAL_ROWS, PRICE_TRIED_ROWS } from "@/pages/lifecycle/stage/price/data";
import { ADOPT_GOAL_ROWS, ADOPT_TRIED_ROWS } from "@/pages/lifecycle/stage/adopt/data";
import { RETAIN_GOAL_ROWS, RETAIN_HISTORY_MID_INSIGHT, RETAIN_TRIED_ROWS } from "@/pages/lifecycle/stage/retain/data";
import { EXPAND_GOAL_ROWS, EXPAND_TRIED_ROWS } from "@/pages/lifecycle/stage/expand/data";
import { SUPPORT_GOAL_ROWS, SUPPORT_HISTORY_MID_INSIGHT, SUPPORT_TRIED_ROWS } from "@/pages/lifecycle/stage/support/data";
import { RENEW_GOAL_ROWS, RENEW_HISTORY_INSIGHT, RENEW_TRIED_ROWS } from "@/pages/lifecycle/stage/renew/data";
import { ADVOCATE_GOAL_ROWS, ADVOCATE_HISTORY_INSIGHT, ADVOCATE_HISTORY_MID_INSIGHT, ADVOCATE_TRIED_ROWS } from "@/pages/lifecycle/stage/advocate/data";

type HistoryData = {
  goalEyebrow: string;
  goalRows: GoalRow[];
  triedEyebrow: string;
  triedRows: TriedRow[];
  /** A callout between the goal table and the tried table (e.g. Retain's "two goals disagree" finding). */
  midInsightTone?: "ultra" | "amber" | "rose" | "teal";
  midInsightTitle?: string;
  midInsightBody?: string;
  insightTitle: string;
  insightBody: string;
  insightTone?: "ultra" | "amber" | "rose" | "teal";
};

const HISTORY_DATA: Record<string, HistoryData> = {
  acquire: {
    goalEyebrow: "Goals that depend on this stage · 3",
    goalRows: ACQUIRE_GOAL_ROWS,
    triedEyebrow: "What has already been tried here",
    triedRows: ACQUIRE_TRIED_ROWS,
    insightTitle: "One learning here is nine months old and still cited",
    insightBody:
      "“Discounting the first order buys volume that does not repeat” came out of a 2024 campaign and has been cited in four rooms since, most recently to argue against a discount in the Retain reactivation. It is marked superseded only where a newer reading disagrees with it.",
  },
  activate: {
    goalEyebrow: "Goals that depend on this stage · 2",
    goalRows: ACTIVATE_GOAL_ROWS,
    triedEyebrow: "What has already been tried here",
    triedRows: ACTIVATE_TRIED_ROWS,
    insightTitle: "The last row has been suggested twice and never run",
    insightBody:
      "Product Reason proposed offering the account at the confirmation screen in March and again in June. Both times it was deferred rather than rejected, with no dissent recorded either time. ₦74M sits behind the guest-checkout path and the cheapest test of it has never been scheduled.",
  },
  price: {
    goalEyebrow: "Goals that depend on this stage · 2",
    goalRows: PRICE_GOAL_ROWS,
    triedEyebrow: "What has already been tried here",
    triedRows: PRICE_TRIED_ROWS,
    insightTitle: "Three of five things tried in this stage had no holdout",
    insightBody:
      "Price is the stage where a holdout is cheapest — you can charge two groups differently for four weeks and learn something permanent. It is also the stage with the fewest of them, which is why three of these rows will be argued about again next quarter.",
    insightTone: "amber",
  },
  adopt: {
    goalEyebrow: "Goals that depend on this stage · 1",
    goalRows: ADOPT_GOAL_ROWS,
    triedEyebrow: "What has already been tried here",
    triedRows: ADOPT_TRIED_ROWS,
    insightTitle: "The highest-lift action available in this stage has never been proposed by anyone",
    insightBody:
      "Prompting a one-tap-reorder customer toward scheduled delivery is worth 38 points of retention on 71,000 customers. It is not deferred, not rejected and not blocked — it has simply never come up, because until this table existed nobody could see the lift.",
    insightTone: "rose",
  },
  retain: {
    goalEyebrow: "Goals that depend on this stage · 3",
    goalRows: RETAIN_GOAL_ROWS,
    midInsightTone: RETAIN_HISTORY_MID_INSIGHT.tone,
    midInsightTitle: RETAIN_HISTORY_MID_INSIGHT.title,
    midInsightBody: RETAIN_HISTORY_MID_INSIGHT.body,
    triedEyebrow: "What has already been tried here",
    triedRows: RETAIN_TRIED_ROWS,
    insightTitle: "Four of five tests in this stage had a holdout, which is the best record in the lifecycle",
    insightBody:
      "Retain has been measured properly for years because it is the number the company reports. The result is that every claim on this table can be checked — and the one row still pending is the one that would settle whether price was ever the problem.",
    insightTone: "teal",
  },
  expand: {
    goalEyebrow: "Goals that depend on this stage · 2",
    goalRows: EXPAND_GOAL_ROWS,
    triedEyebrow: "What has already been tried here",
    triedRows: EXPAND_TRIED_ROWS,
    insightTitle: "The one test in this stage that had a holdout is the only one anybody can still argue from",
    insightBody:
      "Annual billing was measured properly in 2024 and the answer — a wash — has held up for two years. The other four are stories with numbers attached. Expand is the least-tested stage in the lifecycle, which is a strange thing for the stage that owns upselling.",
    insightTone: "amber",
  },
  support: {
    goalEyebrow: "Goals that depend on this stage · 2",
    goalRows: SUPPORT_GOAL_ROWS,
    midInsightTone: SUPPORT_HISTORY_MID_INSIGHT.tone,
    midInsightTitle: SUPPORT_HISTORY_MID_INSIGHT.title,
    midInsightBody: SUPPORT_HISTORY_MID_INSIGHT.body,
    triedEyebrow: "What has already been tried here",
    triedRows: SUPPORT_TRIED_ROWS,
    insightTitle: "The one intervention with a holdout is the one that worked",
    insightBody:
      "Proactive outreach on failed deliveries was measured properly and returns the best number in the lifecycle. The three that were not measured all turned out to be negative. That is not a coincidence about this team — it is what happens when cost savings are self-evident and revenue effects are not.",
    insightTone: "teal",
  },
  renew: {
    goalEyebrow: "Goals that depend on this stage · 2",
    goalRows: RENEW_GOAL_ROWS,
    triedEyebrow: "What has already been tried here",
    triedRows: RENEW_TRIED_ROWS,
    insightTitle: RENEW_HISTORY_INSIGHT.title,
    insightBody: RENEW_HISTORY_INSIGHT.body,
    insightTone: "teal",
  },
  advocate: {
    goalEyebrow: "Goals that depend on this stage · 1",
    goalRows: ADVOCATE_GOAL_ROWS,
    midInsightTone: ADVOCATE_HISTORY_MID_INSIGHT.tone,
    midInsightTitle: ADVOCATE_HISTORY_MID_INSIGHT.title,
    midInsightBody: ADVOCATE_HISTORY_MID_INSIGHT.body,
    triedEyebrow: "What has already been tried here",
    triedRows: ADVOCATE_TRIED_ROWS,
    insightTitle: ADVOCATE_HISTORY_INSIGHT.title,
    insightBody: ADVOCATE_HISTORY_INSIGHT.body,
    insightTone: "amber",
  },
};

const TODAY_TONE_CLASS: Record<GoalRow["todayTone"], string> = { teal: "text-teal", rose: "text-rose", amber: "text-amber", neutral: "text-ink-4" };
const PACE_CHIP_TONE: Record<GoalRow["paceTone"], "teal" | "rose" | "amber"> = { teal: "teal", rose: "rose", amber: "amber" };
const PART_TONE_CLASS: Record<GoalRow["partTone"], string> = { amber: "text-amber", rose: "text-rose", neutral: "text-ink-4", teal: "text-teal" };
const RESULT_TONE_CLASS: Record<TriedRow["resultTone"], string> = { teal: "text-teal", rose: "text-rose", amber: "text-amber", neutral: "text-ink-4" };
const WHEN_TONE_CLASS: Record<NonNullable<TriedRow["whenTone"]>, string> = { neutral: "text-ink-4", amber: "text-amber", rose: "text-rose" };

const LEARNING_CHIP_TONE: Record<TriedRow["learningKept"], "teal" | "amber" | "neutral"> = {
  validated: "teal",
  "room open": "amber",
  superseded: "neutral",
  "validated · no effect": "neutral",
  "suggested twice": "amber",
  "room needed": "amber",
  contested: "amber",
  "blocked in 2024": "amber",
  incomplete: "amber",
  "validated · low lift": "neutral",
  "never promoted": "amber",
  "never proposed": "amber",
  "works, aimed late": "amber",
  "the open approval": "amber",
  "works at small scale": "teal",
  "never cross-sold": "amber",
  "net negative": "amber",
  "validated · a wash": "neutral",
  "validated · best in lifecycle": "teal",
  "under review": "amber",
  "the obvious next test": "amber",
  "4 hrs waiting": "amber",
  "reverse it": "amber",
  unresolved: "amber",
};

/** The shared History tab template (e.g. A14) — goals that depend on this stage, and what has already been tried. */
export function HistoryTab() {
  const { stage } = useStageContext();
  const data = HISTORY_DATA[stage.slug];
  if (!data) return null;

  const goalColumns: Column<GoalRow>[] = [
    { key: "goal", header: "Goal", render: (row) => <span className="font-semibold text-ink-2">{row.goal}</span> },
    {
      key: "owner",
      header: "Owner",
      render: (row) => (
        <span className="flex items-center gap-2 whitespace-nowrap text-ink-2">
          <PersonAvatar kind="human" initials={row.owner.initials} size="sm" style={{ backgroundColor: row.owner.color }} />
          {row.owner.name}
        </span>
      ),
    },
    { key: "target", header: "Target", align: "right", render: (row) => <span className="font-mono text-ink">{row.target}</span> },
    { key: "today", header: "Today", align: "right", render: (row) => <span className={TODAY_TONE_CLASS[row.todayTone]}>{row.today}</span> },
    {
      key: "pace",
      header: "Pace",
      align: "right",
      render: (row) => <Chip tone={PACE_CHIP_TONE[row.paceTone]}>{row.paceLabel}</Chip>,
    },
    { key: "part", header: "This stage's part", align: "right", render: (row) => <span className={PART_TONE_CLASS[row.partTone]}>{row.part}</span> },
  ];

  const triedColumns: Column<TriedRow>[] = [
    { key: "what", header: "What", render: (row) => <span className="font-semibold text-ink-2">{row.what}</span> },
    { key: "when", header: "When", align: "right", render: (row) => <span className={`font-mono ${WHEN_TONE_CLASS[row.whenTone ?? "neutral"]}`}>{row.when}</span> },
    { key: "result", header: "Result", align: "right", render: (row) => <span className={RESULT_TONE_CLASS[row.resultTone]}>{row.result}</span> },
    { key: "measuredHow", header: "Measured how", align: "right", render: (row) => <span className="font-mono text-ink-4">{row.measuredHow}</span> },
    {
      key: "learningKept",
      header: "Learning kept",
      align: "right",
      render: (row) => <Chip tone={row.learningKeptTone ?? LEARNING_CHIP_TONE[row.learningKept]}>{row.learningKept}</Chip>,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{data.goalEyebrow}</p>
        <DataTable columns={goalColumns} rows={data.goalRows} />
      </section>

      {data.midInsightTitle && data.midInsightBody && (
        <Callout tone={data.midInsightTone ?? "amber"} title={data.midInsightTitle}>
          {data.midInsightBody}
        </Callout>
      )}

      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{data.triedEyebrow}</p>
        <DataTable columns={triedColumns} rows={data.triedRows} />
      </section>

      <Callout tone={data.insightTone ?? "ultra"} title={data.insightTitle}>
        {data.insightBody}
      </Callout>
    </div>
  );
}
