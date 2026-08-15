import * as React from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  AUTONOMY_GROUPS,
  AUTONOMY_MODES,
  DECISION_PRINCIPLES,
  type AutonomyMode,
} from "@/pages/governance/data";

const MODE_DOT_CLASS: Record<AutonomyMode, string> = {
  automatic: "bg-teal",
  proposes: "bg-amber",
  blocked: "bg-rose",
};

const MODE_SOLID_CLASS: Record<AutonomyMode, string> = {
  automatic: "border-transparent bg-teal text-white",
  proposes: "border-transparent bg-amber text-white",
  blocked: "border-transparent bg-rose text-white",
};

function defaultModes() {
  const modes: Record<string, AutonomyMode> = {};
  for (const group of AUTONOMY_GROUPS) {
    for (const row of group.rows) modes[row.id] = row.mode;
  }
  return modes;
}

/** Screen 59 (agent autonomy) — see flolyt-kit-122/59-agent-autonomy.svg. */
const Governance = () => {
  const [modes, setModes] = React.useState<Record<string, AutonomyMode>>(defaultModes);

  const handleSave = () => {
    toast.success("Autonomy settings saved");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">What agents may do on their own</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            The default is: anything that leaves Flolyt asks a person first
          </p>
        </div>
        <Button onClick={handleSave} className="shrink-0">
          Save changes
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="min-w-0 space-y-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2 rounded-panel border border-line bg-paper-2 px-4 py-3">
            {AUTONOMY_MODES.map((mode) => (
              <div key={mode.key} className="flex items-center gap-1.5">
                <span className={cn("size-2 shrink-0 rounded-full", MODE_DOT_CLASS[mode.key])} aria-hidden />
                <span className="text-[11.5px] font-semibold text-ink">{mode.label}</span>
                <span className="text-[10.5px] text-ink-4">{mode.description}</span>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            {AUTONOMY_GROUPS.map((group) => (
              <section key={group.key} className="space-y-3">
                <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
                  {group.label}
                </p>
                <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-paper">
                  {group.rows.map((row) => (
                    <div
                      key={row.id}
                      className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="text-[12.5px] text-ink">{row.label}</p>
                        <p className="mt-0.5 text-[10.5px] text-ink-4">{row.note}</p>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        {AUTONOMY_MODES.map((mode) => {
                          const selected = modes[row.id] === mode.key;
                          return (
                            <button
                              key={mode.key}
                              type="button"
                              onClick={() => setModes((prev) => ({ ...prev, [row.id]: mode.key }))}
                              className={cn(
                                "w-[78px] rounded-control border px-2 py-1.5 text-[10px] font-semibold transition-colors",
                                selected
                                  ? MODE_SOLID_CLASS[mode.key]
                                  : "border-line bg-paper text-ink-4 hover:border-ink-4"
                              )}
                            >
                              {mode.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <aside className="overflow-hidden rounded-card border border-line bg-paper-2 lg:sticky lg:top-0">
          <div className="border-b border-line px-5 py-4">
            <p className="text-[11px] font-semibold tracking-[0.45px] text-ink-2">HOW THIS IS DECIDED</p>
          </div>
          <div className="divide-y divide-line">
            {DECISION_PRINCIPLES.map((item) => (
              <div key={item.heading} className="p-5">
                <h3 className="text-[12.5px] font-semibold text-ink">{item.heading}</h3>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-3">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="p-5 pt-0">
            <div className="rounded-panel border border-amber-border bg-amber-bg p-4">
              <h3 className="text-[12px] font-semibold text-ink">Loosening a row</h3>
              <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
                Moving anything out of Proposes removes a human from the loop. Flolyt will keep logging it, but it
                will no longer stop.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Governance;
