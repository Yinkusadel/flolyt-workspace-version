import { PersonAvatar } from "@/components/person-avatar";
import { AGENT_HEADER } from "@/pages/agents/agent-detail/data";

/** The agent identity block repeated on every screen in this section (avatar, name, role/tenure, subtitle) — a plain header, matching every other section's H1 convention rather than a bordered card. */
export function AgentHeader({ subtitle }: { subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <PersonAvatar kind="agent" initials={AGENT_HEADER.initials} size="lg" className="mt-0.5" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <h1 className="text-[17px] font-semibold text-ink">{AGENT_HEADER.name}</h1>
          <span className="font-mono text-[9px] font-medium tracking-[0.7px] text-ink-4 uppercase">
            {AGENT_HEADER.roleLabel} · {AGENT_HEADER.since}
          </span>
        </div>
        <p className="mt-1 text-[11.5px] text-ink-3">{subtitle}</p>
      </div>
    </div>
  );
}
