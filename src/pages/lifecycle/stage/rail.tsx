import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Rail({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div>
      <div className="border-b border-line px-5 py-4">
        <p className="text-[11px] font-semibold tracking-[0.45px] text-ink-2">{heading}</p>
      </div>
      <div className="space-y-5 p-5">{children}</div>
    </div>
  );
}

/** A plain title + body block, separated from the previous block by a rule. */
export function RailInsight({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-line pt-5 first:border-0 first:pt-0">
      <h3 className="text-[12.5px] font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-3">{children}</p>
    </div>
  );
}

const CALLOUT_TONE_CLASSES = {
  amber: "border-amber-border bg-amber-bg",
  teal: "border-teal-border bg-teal-bg",
  rose: "border-rose-border bg-rose-bg",
} as const;

/** Highlighted finding card — used for "the uncomfortable finding" / guardrail-style boxes in the rail. */
export function RailCallout({
  tone = "amber",
  title,
  children,
}: {
  tone?: keyof typeof CALLOUT_TONE_CLASSES;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-card border p-4", CALLOUT_TONE_CLASSES[tone])}>
      <h3 className="text-[13px] font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{children}</p>
    </div>
  );
}

/** Dashed ultra-bordered agent note — "ACTIVATION AGENT", "NOW WATCHING", etc. */
export function RailAgentNote({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-card border border-dashed border-ultra-border bg-ultra-bg/60 p-4">
      <span className="inline-flex rounded-chip border border-dashed border-ultra-border px-1.5 py-0.5 font-mono text-[9.5px] font-semibold tracking-[0.6px] text-ultra">
        {label}
      </span>
      <p className="mt-2.5 text-[11px] leading-relaxed text-ink-2">{children}</p>
    </div>
  );
}

export type DecisionRow = { label: string; value: string };

/** The "NEEDS A HUMAN DECISION" / "NEEDS YOUR APPROVAL" proposal card. */
export function RailDecisionCard({
  badge,
  title,
  rows,
  footnote,
  footnoteTone = "ink",
}: {
  badge: string;
  title: string;
  rows: DecisionRow[];
  footnote: string;
  footnoteTone?: "ink" | "teal";
}) {
  return (
    <div className="relative overflow-hidden rounded-card border border-line bg-paper pl-4">
      <span className="absolute inset-y-0 left-0 w-[3px] rounded-l-card bg-amber" aria-hidden />
      <div className="p-4 pl-1">
        <span className="font-mono text-[9px] font-semibold tracking-[0.9px] text-amber">
          {badge}
        </span>
        <h3 className="mt-1.5 text-[13px] font-semibold text-ink">{title}</h3>
        <dl className="mt-3 space-y-1.5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-3">
              <dt className="text-[11px] text-ink-4">{row.label}</dt>
              <dd className="text-right text-[11px] font-medium text-ink-2">{row.value}</dd>
            </div>
          ))}
        </dl>
        <p
          className={cn(
            "mt-3 border-t border-dashed border-line pt-3 text-[10.5px]",
            footnoteTone === "teal" ? "font-semibold text-teal" : "text-ink-3"
          )}
        >
          {footnote}
        </p>
      </div>
    </div>
  );
}
