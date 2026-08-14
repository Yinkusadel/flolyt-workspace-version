import type { ReactNode } from "react";

/**
 * Shared shell for screens 16-26 (stage detail pages) in flolyt-kit-122 —
 * page header full-width, then a two-column body: analysis on the left,
 * a persistent "rail" of context/decisions on the right. See
 * flolyt-kit-122/16-stage-acquire.svg through 26-stage-release-impact.svg.
 */
export type StageDetailLayoutProps = {
  title: string;
  subtitle?: string;
  rail: ReactNode;
  children: ReactNode;
};

export function StageDetailLayout({ title, subtitle, rail, children }: StageDetailLayoutProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-[11.5px] text-ink-3">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="min-w-0 space-y-8">{children}</div>
        <aside className="overflow-hidden rounded-card border border-line bg-paper-2 lg:sticky lg:top-0">
          {rail}
        </aside>
      </div>
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
      {children}
    </p>
  );
}
