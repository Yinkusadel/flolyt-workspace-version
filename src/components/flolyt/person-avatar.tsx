import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The single most load-bearing visual rule in the product: people are
 * solid, agents are dashed — a material difference, never a badge, because
 * at room density (nine participants, four hundred log rows) a badge must
 * be read but a material difference is perceived.
 * See files (24)/flolyt-figma-559-screens/frames/547-design-system-multiplayer.svg
 */

const TEAM_COLORS = [
  "var(--color-team-1)",
  "var(--color-team-2)",
  "var(--color-team-3)",
  "var(--color-team-4)",
] as const;

const SIZE_CLASSES = {
  sm: "size-[18px] text-[6px]",
  default: "size-6 text-[8px]",
  lg: "size-8 text-[10px]",
} as const;

export type PersonAvatarProps = Omit<React.ComponentProps<"div">, "children" | "style"> & {
  style?: React.CSSProperties;
  /** Two-letter identifier shown in the circle. */
  initials: string;
  /** Solid + team colour for a human; dashed + ultra for an agent. Never mix the two. */
  kind: "human" | "agent";
  /** Team colour slot (1-4), ignored for agents — agents are always `ultra`. */
  team?: 1 | 2 | 3 | 4;
  size?: keyof typeof SIZE_CLASSES;
};

function PersonAvatar({
  initials,
  kind,
  team = 1,
  size = "default",
  className,
  style,
  ...props
}: PersonAvatarProps) {
  const isAgent = kind === "agent";

  return (
    <div
      data-slot="person-avatar"
      data-kind={kind}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold uppercase select-none",
        SIZE_CLASSES[size],
        isAgent
          ? "border-[1.5px] border-dashed border-ultra-border font-mono text-ultra"
          : "font-sans text-white",
        className
      )}
      style={isAgent ? style : { backgroundColor: TEAM_COLORS[team - 1], ...style }}
      {...props}
    >
      {initials}
    </div>
  );
}

export { PersonAvatar };
