import { Link } from "react-router-dom";
import { Gauge, ScrollText, Settings, UserMinus } from "lucide-react";

/**
 * `/handoff/load`, `/settings/handoff-escalation`, `/settings/departures` and
 * `/settings/handoff` had no in-app link pointing to them — same "built but
 * unreachable" gap the digest archive and inbox authority settings hit.
 * Fixed proactively, same pattern as `InboxQuickLinks`: a thin nav strip at
 * the top of every main `/handoff` state.
 */
const LINKS = [
  { label: "Who is the bottleneck", href: "/handoff/load", icon: Gauge },
  { label: "Escalation policy", href: "/settings/handoff-escalation", icon: ScrollText },
  { label: "Departures", href: "/settings/departures", icon: UserMinus },
  { label: "Settings", href: "/settings/handoff", icon: Settings },
];

export function HandoffQuickLinks() {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-panel border border-line bg-paper px-2.5 py-1.5 text-[10.5px] font-medium text-ink-3 hover:border-ink-4 hover:text-ink-2"
        >
          <link.icon className="size-3" aria-hidden />
          {link.label}
        </Link>
      ))}
    </div>
  );
}
