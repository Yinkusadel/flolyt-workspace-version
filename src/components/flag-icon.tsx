import { cn } from "@/lib/utils";

interface FlagIconProps {
  /** ISO 3166-1 alpha-2 code, any case — flag-icons classes are lowercase. */
  code: string;
  className?: string;
}

/** Real SVG flag via `flag-icons`, not emoji — flag emoji fall back to plain two-letter codes on Windows. */
export function FlagIcon({ code, className }: FlagIconProps) {
  if (!code) return null;

  return (
    <span
      className={cn("fi", `fi-${code.toLowerCase()}`, "rounded-[2px] align-middle", className)}
      aria-hidden="true"
    />
  );
}
