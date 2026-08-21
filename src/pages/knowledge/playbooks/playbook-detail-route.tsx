import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import {
  PB04_HERO,
  PB04_NOTE,
  PB04_PRECONDITION_ROWS,
  PB04_STEPS_ROWS,
  PB_CHIP_TONE,
} from "@/pages/knowledge/playbooks/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function RetryAt0900Detail() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Playbooks", to: "/playbooks" }, { label: "Retry cards at 09:00 local" }]}
        title="One playbook"
        subtitle="Six steps, four preconditions · Ghana fails two of them, one of which is a person"
        action={
          <Button type="button" onClick={() => toast.success("Opening the run form")}>
            Run it
          </Button>
        }
      />

      <div className="rounded-card border border-line2 bg-paper p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{PB04_HERO.eyebrow}</p>
            <p className="mt-1.5 text-[24px] font-semibold text-ink">{PB04_HERO.big}</p>
            <p className="mt-1 max-w-lg text-[11px] text-ink-3">{PB04_HERO.sub}</p>
          </div>
          <div className="sm:text-right">
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{PB04_HERO.rightLabel}</p>
            <p className="mt-1.5 text-[18px] font-semibold text-ink">{PB04_HERO.rightBig}</p>
            <p className="mt-1 font-mono text-[9.5px] text-rose">{PB04_HERO.rightSub}</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the playbook actually says</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Step</th>
                <th className={HEAD_CLASS}>What is done</th>
                <th className={`${HEAD_CLASS} text-right`}>Who does it</th>
                <th className={`${HEAD_CLASS} text-right`}>Can it be skipped?</th>
              </tr>
            </thead>
            <tbody>
              {PB04_STEPS_ROWS.map((row) => (
                <tr key={row.step} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink-4">{row.step}</td>
                  <td className="px-4 py-3 text-ink-2">{row.what}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn("whitespace-nowrap", row.whoIsAgent ? "text-ultra" : "text-ink-4")}>{row.who}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={PB_CHIP_TONE[row.skippableTone]}>{row.skippable}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Preconditions · checked before it will run anywhere</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Precondition</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={`${HEAD_CLASS} text-right`}>Nigeria</th>
                <th className={`${HEAD_CLASS} text-right`}>Kenya</th>
                <th className={`${HEAD_CLASS} text-right`}>Ghana</th>
                <th className={`${HEAD_CLASS} text-right`}>UK</th>
              </tr>
            </thead>
            <tbody>
              {PB04_PRECONDITION_ROWS.map((row) => (
                <tr key={row.precondition} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.precondition}</td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={PB_CHIP_TONE[row.nigeriaTone]}>{row.nigeria}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={PB_CHIP_TONE[row.kenyaTone]}>{row.kenya}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={PB_CHIP_TONE[row.ghanaTone]}>{row.ghana}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={PB_CHIP_TONE[row.ukTone]}>{row.uk}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Ghana fails two preconditions and the second one is a person, not data">
        {PB04_NOTE}
      </Callout>
    </div>
  );
}

function PlaybookNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Playbook not found</p>
      <Link to="/playbooks" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to playbooks
      </Link>
    </div>
  );
}

/** PB04 (`retry-0900`) — the index's only built `:id` reference row, same "one/two reference rows" pattern as every prior section. */
const PlaybookDetailRoute = () => {
  const { id } = useParams();

  if (id === "retry-0900") return <RetryAt0900Detail />;
  return <PlaybookNotFound />;
};

export default PlaybookDetailRoute;
