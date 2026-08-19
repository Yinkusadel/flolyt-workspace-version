import type { ReactNode } from "react";
import { Info } from "lucide-react";

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

const CALLOUT_ACCENT_CLASSES = {
  amber: "border-amber-border bg-amber-bg",
  teal: "border-teal-border bg-teal-bg",
  rose: "border-rose-border bg-rose-bg",
  ultra: "border-ultra-border bg-ultra-bg",
  neutral: "border-line bg-paper-2",
} as const;

const CALLOUT_ICON_CLASSES = {
  amber: "text-amber",
  teal: "text-teal",
  rose: "text-rose",
  ultra: "text-ultra",
  neutral: "text-ink-4",
} as const;

/**
 * Full-width insight callout — the "uncomfortable finding" boxes that close
 * out nearly every new lifecycle screen (e.g. A02's "more customers, fewer
 * second orders" box, A06's CAC-vs-value box). No left accent strand (design
 * cleanup: strands were removed from every card/callout across lifecycle);
 * the leading info icon signals "this is a finding" instead. Distinct from
 * RailCallout above, which is sized for the (now-removed) sidebar aside
 * rather than full-width tab content.
 */
export function Callout({
  tone = "amber",
  title,
  children,
}: {
  tone?: keyof typeof CALLOUT_ACCENT_CLASSES;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-card border p-4", CALLOUT_ACCENT_CLASSES[tone])}>
      <div className="flex gap-2.5">
        <Info className={cn("mt-0.5 size-4 shrink-0", CALLOUT_ICON_CLASSES[tone])} aria-hidden />
        <div>
          <h3 className="text-[12px] font-semibold text-ink">{title}</h3>
          <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{children}</p>
        </div>
      </div>
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
    <div className="rounded-card border border-line bg-paper">
      <div className="p-4">
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
