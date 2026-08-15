import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { RunStatusData } from "@/pages/rooms/types";

/** Screen 34 (run status states) — see flolyt-kit-122/34-run-status-states.svg. */
const STATE_META: Record<RunStatusData["state"], { label: string; dotClass: string; trailing: string }> = {
  queued: { label: "Queued", dotClass: "bg-ink-4", trailing: "Stop · Redirect available" },
  running: { label: "Running", dotClass: "bg-ultra", trailing: "" },
  cancelRequested: { label: "Stopping — finishing the current step", dotClass: "bg-amber", trailing: "Stop disabled" },
  cancelled: { label: "Stopped by you — the work so far is kept", dotClass: "bg-ink-3", trailing: "partial output shown" },
  failed: { label: "The run failed before it finished", dotClass: "bg-rose", trailing: "Send again" },
  reconnect: { label: "Reconnected — catching up on this run", dotClass: "bg-teal", trailing: "checking every 3s" },
};

export function RunStatusBar({
  run,
  onStop,
  onRedirect,
  className,
}: {
  run: RunStatusData;
  onStop?: () => void;
  onRedirect?: (message: string) => void;
  className?: string;
}) {
  const [message, setMessage] = React.useState("");
  const meta = STATE_META[run.state];
  const canStop = run.state === "queued" || run.state === "running";

  const submit = () => {
    if (!message.trim()) return;
    onRedirect?.(message.trim());
    setMessage("");
  };

  return (
    <div className={cn("space-y-2.5 p-3", className)}>
      <div className="space-y-1 rounded-panel border border-line bg-paper px-3 py-2">
        <div className="flex items-center gap-2">
          <span className={cn("size-2 shrink-0 rounded-full", meta.dotClass)} aria-hidden />
          <span className="min-w-0 flex-1 truncate text-[11.5px] font-medium text-ink">{meta.label}</span>
          {canStop && (
            <Button type="button" variant="outline" size="xs" onClick={onStop} className="shrink-0">
              Stop
            </Button>
          )}
        </div>
        {(run.detail || (!canStop && meta.trailing)) && (
          <p className="truncate pl-4 font-mono text-[9.5px] text-ink-4">{run.detail || meta.trailing}</p>
        )}
      </div>

      <div className="flex items-center gap-1.5 rounded-panel border border-line bg-paper-2 px-2.5 py-1.5">
        <input
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="Redirect the agent…"
          className="min-w-0 flex-1 bg-transparent text-[11.5px] text-ink placeholder:text-ink-4 focus:outline-none"
        />
        <kbd className="rounded-control border border-line bg-paper px-1.5 py-0.5 font-mono text-[9px] text-ink-4">
          ↵
        </kbd>
      </div>
      {run.queuedSteering && (
        <div className="rounded-panel border border-dashed border-amber-border bg-amber-bg px-2.5 py-1.5">
          <p className="text-[10px] text-amber">Queued — "{run.queuedSteering}"</p>
        </div>
      )}
    </div>
  );
}
