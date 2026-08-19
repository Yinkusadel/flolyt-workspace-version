import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { ActorAvatar } from "@/pages/everyday/rooms/actor";
import { CASCADE_ROOT, type CascadeNode } from "@/pages/everyday/goals/cascade-data";

function CascadeRow({ node, depth }: { node: CascadeNode; depth: number }) {
  return (
    <>
      <div
        className="flex flex-col gap-2 border-b border-line px-4 py-3 last:border-0 sm:flex-row sm:items-center sm:gap-4"
        style={{ paddingLeft: `${16 + depth * 24}px` }}
      >
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold text-ink">{node.name}</p>
          <p className="mt-0.5 text-[10px] text-ink-4">{node.typeLabel}</p>
        </div>
        <span className="shrink-0 font-mono text-[10.5px] text-ink-4">{node.range ?? "—"}</span>
        <span className={cn("shrink-0 font-mono text-[13px] font-semibold", TONE_TEXT_CLASS[node.currentTone])}>
          {node.current}
        </span>
        <div className="flex shrink-0 flex-wrap gap-1.5">
          {node.chips.map((chip) => (
            <Chip key={chip.label} tone={chip.tone}>
              {chip.label}
            </Chip>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {node.owner ? (
            <>
              <ActorAvatar actor={{ kind: "human", person: node.owner }} size="sm" />
              <span className="text-[10.5px] text-ink-2">{node.ownerName ?? node.owner.name}</span>
            </>
          ) : (
            <span className="text-[10.5px] text-ink-4">—</span>
          )}
        </div>
        <span className="shrink-0 text-right text-[10px] text-ink-4 sm:w-28">{node.meta}</span>
      </div>
      {node.children?.map((child) => <CascadeRow key={child.id} node={child} depth={depth + 1} />)}
    </>
  );
}

/** G10 — Goal cascade. */
export function GoalCascadeRoute() {
  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Goals", to: "/goals" }, { label: "Cascade" }]}
        title="Goal cascade"
        subtitle="One company goal · four markets · eleven teams · one branch with no baseline"
        action={<Button onClick={() => toast.success("Team goal added")}>Add a team goal</Button>}
      />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Company goal → market → team → owner
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <div className="min-w-[820px]">
            <CascadeRow node={CASCADE_ROOT} depth={0} />
          </div>
        </div>
      </div>

      <Callout tone="amber" title="The company goal is 7.2 points behind because two of four markets are, and one has no baseline at all">
        Ghana has never had a repeat-rate baseline, so it has no target, no owner and one team working without
        either. A flat goal list hides this — the rollup reads as if Ghana were on track, because a blank
        contributes nothing rather than contributing doubt.
      </Callout>
    </div>
  );
}
