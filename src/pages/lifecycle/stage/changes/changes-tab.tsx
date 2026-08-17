import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip, type ChipTone } from "@/pages/lifecycle/stage/chip";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { ACQUIRE_CHANGE_ROWS, ACQUIRE_CHANGE_SOURCE_ROWS, type ChangeRow } from "@/pages/lifecycle/stage/acquire/data";

type ChangesData = {
  eyebrow: string;
  rows: ChangeRow[];
  insightTitle: string;
  insightBody: string;
  sourceEyebrow: string;
  sourceRows: { label: string; value: string; tone: "teal" | "amber" | "ultra" | "neutral" }[];
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
};

const EFFECT_TONE_CLASS: Record<ChangeRow["effectTone"], string> = {
  teal: "text-teal",
  rose: "text-rose",
  amber: "text-amber",
  neutral: "text-ink-4",
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
              <p className="text-[12px] font-semibold text-ink">{row.title}</p>
              <p className={`text-[10px] ${EFFECT_TONE_CLASS[row.effectTone]}`}>{row.effect}</p>
            </div>
            <Chip tone={BADGE_TONE[row.badgeTone]}>{row.badge}</Chip>
          </div>
        ))}
      </div>

      <Callout tone="amber" title={data.insightTitle}>
        {data.insightBody}
      </Callout>

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
    </div>
  );
}
