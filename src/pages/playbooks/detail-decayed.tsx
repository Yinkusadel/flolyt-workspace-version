import { Link } from "react-router-dom";
import { Flag } from "lucide-react";

import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import type { Playbook } from "@/pages/playbooks/data";

const CHART_HEIGHT = 100;

function EffectByRunChart({ decay }: { decay: NonNullable<Playbook["decay"]> }) {
  return (
    <div className="rounded-card border border-line bg-paper p-5">
      <p className="text-[15px] font-semibold text-ink">Effect by run</p>
      <div className="mt-5 flex items-end gap-4" style={{ height: CHART_HEIGHT }}>
        {decay.effectByRun.map((point) => (
          <div key={point.run} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <span className="text-[11px] font-medium text-ink-3">{point.label}</span>
            <div
              className={point.significant ? "w-full max-w-16 rounded-t-sm bg-teal" : "w-full max-w-16 rounded-t-sm bg-amber"}
              style={{ height: Math.max((point.percent / 100) * CHART_HEIGHT, 4) }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-4">
        {decay.effectByRun.map((point) => (
          <span key={point.run} className="flex-1 text-center text-[11px] text-ink-4">
            {point.run}
          </span>
        ))}
      </div>
      <p className="mt-4 text-[12px] text-ink-3">{decay.chartNote}</p>
    </div>
  );
}

function ActionCard({
  title,
  body,
  cta,
  primary,
  to,
}: {
  title: string;
  body: string;
  cta: string;
  primary?: boolean;
  to: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-card border border-line bg-paper p-4">
      <div>
        <p className="text-[14px] font-semibold text-ink">{title}</p>
        <p className="mt-1.5 text-[12px] text-ink-3">{body}</p>
      </div>
      <Button asChild variant={primary ? "default" : "outline"} size="sm" className="w-fit">
        <Link to={to}>{cta}</Link>
      </Button>
    </div>
  );
}

/** PB05 — a decayed playbook's detail view: the standard trigger/steps/parameters/run-history
 * layout is replaced with why it stopped and three next steps, since deciding what to do about
 * the decay is the point of this page, not relitigating how it used to work. */
export function PlaybookDecayed({ playbook }: { playbook: Playbook }) {
  usePageBreadcrumb([{ label: "Playbooks", to: "/playbooks" }, { label: playbook.name }]);

  const decay = playbook.decay;
  if (!decay) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-[17px] font-semibold text-ink">{playbook.name}</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Version {decay.version} · {decay.agent.name} · run {decay.runsCount} times · last run {decay.lastRun}
          </p>
        </div>
        <Chip tone="amber" className="shrink-0">
          Stopped working
        </Chip>
      </div>

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <div className="flex items-start gap-2.5">
          <Flag className="mt-0.5 size-4 shrink-0 text-amber" />
          <div className="space-y-1.5">
            <p className="text-[14px] font-semibold text-amber">It worked twice, then stopped</p>
            {decay.summary.map((line) => (
              <p key={line} className="text-[13px] leading-relaxed text-amber/90">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <EffectByRunChart decay={decay} />

        <div className="rounded-card border border-line bg-paper p-5">
          <p className="text-[15px] font-semibold text-ink">Why it stopped</p>
          <div className="mt-2 space-y-1">
            {decay.whyStopped.map((line) => (
              <p key={line} className="text-[13px] leading-relaxed text-ink-2">
                {line}
              </p>
            ))}
          </div>
          <div className="mt-4 space-y-1 border-t border-line pt-4">
            {decay.goodOutcome.map((line) => (
              <p key={line} className="text-[12px] text-teal">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">What to do with it</p>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ActionCard
            title="Retire it"
            body="stops running · stays in memory and stays citable"
            cta="Retire"
            primary
            to="/playbooks"
          />
          <ActionCard
            title="Revise the trigger"
            body="narrow it to cohorts that still show the stall"
            cta="Choose"
            to={`/playbooks/${playbook.id}`}
          />
          <ActionCard
            title="Keep running and watch"
            body="two more runs, then decide"
            cta="Choose"
            to={`/playbooks/${playbook.id}`}
          />
        </div>
      </div>

      <div className="rounded-card border border-line bg-paper-2 p-5">
        <p className="text-[14px] font-semibold text-ink">A playbook that no longer works is worse than no playbook</p>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-3">
          It spends approvals, holds out customers for nothing, and teaches the team to stop reading what Flolyt
          proposes. Retiring is the cheap outcome.
        </p>
      </div>
    </div>
  );
}
