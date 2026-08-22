import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { TeammatesTabs } from "@/pages/agents/ai-teammates/tabs";
import { TeammatesKvList } from "@/pages/agents/ai-teammates/kv-list";
import { TurnBar } from "@/pages/agents/ai-teammates/turn-bar";
import { RedirectRunModal } from "@/pages/agents/ai-teammates/modals/redirect-run-modal";
import { TM05_KV, TM05_RUNS } from "@/pages/agents/ai-teammates/data";

/** TM05 — /ai-teammates/runs. */
const RunsRoute = () => {
  const [redirectOpen, setRedirectOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Reading now</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Three runs · one has a redirect queued for turn five · nothing new proposed while any is open</p>
      </div>

      <TeammatesTabs active="Reading now" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Three runs in progress</p>
        <div className="space-y-4 rounded-card border border-line bg-paper p-4">
          {TM05_RUNS.map((run, i) => (
            <div key={run.label} className={i === 0 ? "space-y-2" : "space-y-2 border-t border-line pt-4"}>
              <TurnBar label={run.label} sub={run.sub} done={run.done} total={run.total} tone={run.tone} />
              {i === 0 && (
                <div className="pt-1">
                  <Button type="button" size="sm" variant="outline" onClick={() => setRedirectOpen(true)}>
                    Redirect this run
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What is happening inside the first one</p>
        <TeammatesKvList rows={TM05_KV} />
      </section>

      <Callout tone="ultra" title="Ravi's redirect lands at turn five, not now, and that is deliberate">
        Repeat & Decay is halfway through reading 4.2M rows. Interrupting mid-read would produce a partial table
        that looks exactly like a complete one, which is the single failure mode nobody would catch afterwards. The
        instruction waits for the turn boundary, and the screen says when it will land rather than pretending it
        was instant.
      </Callout>

      <Callout tone="amber" title="Nothing new is proposed while a run is open">
        Repeat & Decay has five plays in room 8f2c and will not propose a sixth until this run finishes and the
        attribution settles. An agent that proposed while still working would be arguing with its own unfinished
        analysis, and somebody would approve the earlier version.
      </Callout>

      <RedirectRunModal open={redirectOpen} onOpenChange={setRedirectOpen} />
    </div>
  );
};

export default RunsRoute;
