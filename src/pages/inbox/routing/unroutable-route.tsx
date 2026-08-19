import { Link } from "react-router-dom";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { TeamDot } from "@/pages/inbox/team-dot";
import { InboxTabs } from "@/pages/inbox/quick-links";
import { FALLBACK_OPTIONS, UNROUTABLE_LAST_ROW_CALLOUT, UNROUTABLE_ROWS } from "@/pages/inbox/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const TABS = [
  { key: "rules", label: "Rules", href: "/inbox/routing" },
  { key: "decisions", label: "Recent decisions", href: "/inbox/routing?tab=decisions" },
  { key: "unroutable", label: "Unroutable · 3", href: "/inbox/routing/unroutable" },
] as const;

const OPTION_TONE_CLASS = {
  ultra: "border-ultra-border bg-ultra-bg",
  amber: "border-amber-border bg-amber-bg",
  teal: "border-teal-border bg-teal-bg",
  rose: "border-rose-border bg-rose-bg",
  neutral: "border-line bg-paper-2",
} as const;

/** I08 — Unroutable, /inbox/routing/unroutable. */
const UnroutableRoute = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Unroutable</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Five conditions with no destination · twelve breaches · one of them is circular
          </p>
        </div>
        <Button className="shrink-0" onClick={() => toast.success("Fallback-rule creation isn't wired up in this preview")}>
          Set a fallback rule
        </Button>
      </div>

      <InboxTabs />

      <div className="flex items-center gap-1 overflow-x-auto">
        {TABS.map((tab) => (
          <Link
            key={tab.key}
            to={tab.href}
            className={cn(
              "shrink-0 rounded-panel px-3 py-1.5 text-[11px] whitespace-nowrap",
              tab.key === "unroutable"
                ? "border border-line bg-paper font-semibold text-ink"
                : "font-normal text-ink-3 hover:text-ink-2"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[960px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Condition</th>
              <th className={HEAD_CLASS}>Cause sits in</th>
              <th className={HEAD_CLASS}>Symptom sits in</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Fired</th>
              <th className={HEAD_CLASS}>Since</th>
              <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
              <th className={HEAD_CLASS}>Why unroutable</th>
            </tr>
          </thead>
          <tbody>
            {UNROUTABLE_ROWS.map((row) => (
              <tr key={row.condition} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink-2">{row.condition}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {row.causeTeam ? (
                    <TeamDot team={row.causeTeam} />
                  ) : (
                    <span className="text-rose">{row.causeLabel}</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {row.symptomTeam ? (
                    <TeamDot team={row.symptomTeam} />
                  ) : (
                    <span className={row.symptomTone ? TONE_TEXT_CLASS[row.symptomTone] : "text-ink-2"}>{row.symptomLabel}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono text-rose">{row.fired}</td>
                <td className="px-4 py-3 whitespace-nowrap text-rose">{row.since}</td>
                <td className={cn("px-4 py-3 text-right font-mono whitespace-nowrap", row.atStakeTone ? TONE_TEXT_CLASS[row.atStakeTone] : "text-ink-4")}>
                  {row.atStake}
                </td>
                <td className="px-4 py-3 text-rose">{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">{UNROUTABLE_LAST_ROW_CALLOUT.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{UNROUTABLE_LAST_ROW_CALLOUT.body}</p>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What a fallback rule would look like
        </p>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {FALLBACK_OPTIONS.map((option) => (
            <div key={option.label} className={cn("flex flex-col justify-between rounded-card border p-4", OPTION_TONE_CLASS[option.tone])}>
              <div>
                <span className={cn("font-mono text-[9.5px] font-semibold tracking-[0.6px] uppercase", TONE_TEXT_CLASS[option.tone])}>
                  {option.label}
                </span>
                <h3 className="mt-2 text-[13px] font-semibold text-ink">{option.title}</h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{option.body}</p>
              </div>
              <p className={cn("mt-3 border-t border-dashed border-line pt-3 font-mono text-[10.5px] font-semibold", TONE_TEXT_CLASS[option.tone])}>
                {option.footnote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnroutableRoute;
