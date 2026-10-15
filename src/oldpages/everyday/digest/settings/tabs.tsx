import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

export type DigestSettingsTab = "what-gets-in" | "channels" | "quiet-hours" | "notification-rules";

/**
 * Shared 4-tab bar across D09–D12. Visually one group, but not one route
 * subtree: What gets in / Channels / Quiet hours live under /settings/digest,
 * while Notification rules is its own sibling route at /settings/notifications
 * — confirmed by each screen's own footer (see docs/build-tracker.md). The
 * tabs just link across the two route trees.
 */
const TABS: { key: DigestSettingsTab; label: string; href: string }[] = [
  { key: "what-gets-in", label: "What gets in", href: "/settings/digest" },
  { key: "channels", label: "Channels", href: "/settings/digest/channels" },
  { key: "quiet-hours", label: "Quiet hours", href: "/settings/digest/quiet-hours" },
  { key: "notification-rules", label: "Notification rules", href: "/settings/notifications" },
];

export function DigestSettingsTabs({ active }: { active: DigestSettingsTab }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          to={tab.href}
          className={cn(
            "shrink-0 rounded-panel px-3 py-1.5 text-[11.5px] whitespace-nowrap",
            active === tab.key
              ? "border border-line bg-paper font-semibold text-ink"
              : "font-normal text-ink-3 hover:text-ink-2"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
