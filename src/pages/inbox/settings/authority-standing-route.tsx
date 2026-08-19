import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { KvList } from "@/pages/digest/kv-list";
import { PersonDot } from "@/pages/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { AuthorityTabs } from "@/pages/inbox/settings/authority-tabs";
import {
  STANDING_ACTIVITY,
  STANDING_CLOSING_CALLOUT,
  STANDING_GRANTS,
  STANDING_INTRO_CALLOUT,
  STANDING_RULES,
} from "@/pages/inbox/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** I12 — Standing authority, /settings/authority/standing. */
const AuthorityStandingRoute = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Standing authority</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Three active · granted by Ada · 17 plays ran under them this week, one was held
          </p>
        </div>
        <Button className="shrink-0" onClick={() => toast.success("Granting authority isn't wired up in this preview")}>
          Grant an authority
        </Button>
      </div>

      <AuthorityTabs active="standing" />

      <div className="rounded-card border border-ultra-border bg-ultra-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">{STANDING_INTRO_CALLOUT.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{STANDING_INTRO_CALLOUT.body}</p>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Granted by Ada Obi · 3 active
        </p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Class of play</th>
                <th className={HEAD_CLASS}>Limits</th>
                <th className={HEAD_CLASS}>Market</th>
                <th className={HEAD_CLASS}>Expires</th>
                <th className={HEAD_CLASS}>Used</th>
                <th className={cn(HEAD_CLASS, "text-right")}>State</th>
              </tr>
            </thead>
            <tbody>
              {STANDING_GRANTS.map((row) => (
                <tr key={row.classOfPlay} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.classOfPlay}</td>
                  <td className="px-4 py-3 text-ink-3">{row.limits}</td>
                  <td className="px-4 py-3 text-ink-3 whitespace-nowrap">{row.market}</td>
                  <td className={cn("px-4 py-3 whitespace-nowrap", row.expiresTone ? TONE_TEXT_CLASS[row.expiresTone] : "text-ink-4")}>
                    {row.expires}
                  </td>
                  <td className="px-4 py-3 font-mono text-ink-4 whitespace-nowrap">{row.used}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.stateTone} className="ml-auto">
                      {row.state}
                    </Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What ran under standing authority this week · 17 plays
        </p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Play</th>
                <th className={HEAD_CLASS}>Room</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Reach</th>
                <th className={HEAD_CLASS}>Ran at</th>
                <th className={HEAD_CLASS}>Under whose authority</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Reviewed</th>
              </tr>
            </thead>
            <tbody>
              {STANDING_ACTIVITY.map((row, i) => (
                <tr key={`${row.play}-${i}`} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.play}</td>
                  <td className="px-4 py-3 text-ink-3">{row.room}</td>
                  <td className={cn("px-4 py-3 text-right font-mono whitespace-nowrap", row.reachTone ? TONE_TEXT_CLASS[row.reachTone] : "text-ink-4")}>
                    {row.reach}
                  </td>
                  <td className={cn("px-4 py-3 whitespace-nowrap", row.ranAtTone ? TONE_TEXT_CLASS[row.ranAtTone] : "text-ink-4")}>
                    {row.ranAt}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.under ? (
                      <span className="flex items-center gap-2 font-semibold text-ink-2">
                        <PersonDot person={row.under} size="sm" />
                        {row.under.name}
                      </span>
                    ) : (
                      <span className="text-ink-4">{row.underLabel}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.reviewedTone} className="ml-auto">
                      {row.reviewed}
                    </Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-card border border-teal-border bg-teal-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">{STANDING_CLOSING_CALLOUT.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{STANDING_CLOSING_CALLOUT.body}</p>
      </div>

      <KvList rows={STANDING_RULES} />
    </div>
  );
};

export default AuthorityStandingRoute;
