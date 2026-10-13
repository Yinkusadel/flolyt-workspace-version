import { Hourglass } from "lucide-react";

import { PersonAvatar } from "@/components/person-avatar";
import { agentInitialsFromName } from "@/lib/initials";
import { AiMarkdownText } from "@/pages/conversations/ai-response/markdown-text";
import type { LiveRun } from "@/features/rooms/live/room-timeline";

/**
 * An agent run that has not been committed to the transcript yet: a shimmering "working" line while it runs (from `run_started` /
 * `progress`), its draft answer as it streams, a quiet notice when some live updates were missed (the committed answer will still
 * arrive; nothing is resent) and a failure line. Approval itself is not drawn here: the Room feed carries no approval controls
 * (they follow the existing approval contracts), so a run that needs a person only says so.
 * The draft is replaced, not extended, by the committed message, and this row disappears.
 */
export function LiveRunRow({ run }: { run: LiveRun }) {
  const name = run.agentLabel ?? "An agent";
  return (
    <div className="flex gap-2.5">
      <PersonAvatar kind="agent" size="lg" initials={agentInitialsFromName(name)} />
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold text-ink">{name}</p>
        {run.markdown && (
          <div className="mt-1 rounded-card border border-ultra-border bg-paper px-3.5 py-3">
            <AiMarkdownText content={run.markdown} />
          </div>
        )}
        {run.working && (
          <p className="mt-1.5 animate-pulse text-[12px] text-ink-3 italic" role="status">
            {run.working}
          </p>
        )}
        {run.awaitingApproval && (
          <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-control bg-amber-bg px-2 py-1 text-[11.5px] text-amber">
            <Hourglass className="size-3" />
            Waiting for someone to approve a step
          </p>
        )}
        {run.deliveryGap && (
          <p className="mt-1.5 text-[11px] text-ink-4 italic">Some live updates were missed. The full answer will appear when it is ready.</p>
        )}
        {run.failed && <p className="mt-1.5 text-[12px] text-rose">{name} couldn't finish this. {run.failed}</p>}
      </div>
    </div>
  );
}
