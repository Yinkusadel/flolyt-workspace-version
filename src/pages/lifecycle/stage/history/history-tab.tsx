import { PersonAvatar } from "@/components/person-avatar";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { ACQUIRE_GOAL_ROWS, ACQUIRE_TRIED_ROWS, type GoalRow, type TriedRow } from "@/pages/lifecycle/stage/acquire/data";
import { ACTIVATE_GOAL_ROWS, ACTIVATE_TRIED_ROWS } from "@/pages/lifecycle/stage/activate/data";

type HistoryData = {
  goalEyebrow: string;
  goalRows: GoalRow[];
  triedEyebrow: string;
  triedRows: TriedRow[];
  insightTitle: string;
  insightBody: string;
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

      <Callout tone="ultra" title={data.insightTitle}>
        {data.insightBody}
      </Callout>
    </div>
  );
}
