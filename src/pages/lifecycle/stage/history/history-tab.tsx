import { PersonAvatar } from "@/components/person-avatar";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { ACQUIRE_GOAL_ROWS, ACQUIRE_TRIED_ROWS, type GoalRow, type TriedRow } from "@/pages/lifecycle/stage/acquire/data";
import { ACTIVATE_GOAL_ROWS, ACTIVATE_TRIED_ROWS } from "@/pages/lifecycle/stage/activate/data";
import { PRICE_GOAL_ROWS, PRICE_TRIED_ROWS } from "@/pages/lifecycle/stage/price/data";
import { ADOPT_GOAL_ROWS, ADOPT_TRIED_ROWS } from "@/pages/lifecycle/stage/adopt/data";

type HistoryData = {
  goalEyebrow: string;
  goalRows: GoalRow[];
  triedEyebrow: string;
  triedRows: TriedRow[];
  insightTitle: string;
  insightBody: string;
  insightTone?: "ultra" | "amber" | "rose";
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
};

const TODAY_TONE_CLASS: Record<GoalRow["todayTone"], string> = { teal: "text-teal", rose: "text-rose", amber: "text-amber", neutral: "text-ink-4" };
const PACE_CHIP_TONE: Record<GoalRow["paceTone"], "teal" | "rose" | "amber"> = { teal: "teal", rose: "rose", amber: "amber" };
const PART_TONE_CLASS: Record<GoalRow["partTone"], string> = { amber: "text-amber", rose: "text-rose", neutral: "text-ink-4" };
const RESULT_TONE_CLASS: Record<TriedRow["resultTone"], string> = { teal: "text-teal", rose: "text-rose", amber: "text-amber", neutral: "text-ink-4" };
const WHEN_TONE_CLASS: Record<NonNullable<TriedRow["whenTone"]>, string> = { neutral: "text-ink-4", amber: "text-amber" };

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
      render: (row) => <Chip tone={LEARNING_CHIP_TONE[row.learningKept]}>{row.learningKept}</Chip>,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{data.goalEyebrow}</p>
        <DataTable columns={goalColumns} rows={data.goalRows} />
      </section>

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
