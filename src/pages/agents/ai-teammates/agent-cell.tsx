import { Link } from "react-router-dom";

import { AgentDot } from "@/pages/everyday/rooms/actor";
import type { AgentRef } from "@/pages/everyday/rooms/types";

/** Agent identity cell for tables — dashed-ring avatar + name, matching people's identity cells elsewhere. */
export function AgentCell({ agent, href }: { agent: AgentRef; href?: string }) {
  const content = (
    <span className="flex items-center gap-2">
      <AgentDot agent={agent} size="sm" />
      <span className="font-semibold text-ink">{agent.name}</span>
    </span>
  );
  if (href) {
    return (
      <Link to={href} className="hover:underline">
        {content}
      </Link>
    );
  }
  return content;
}
