import { Link } from "react-router-dom";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { KvList } from "@/pages/digest/kv-list";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { SETTINGS_CALLOUT_1, SETTINGS_CALLOUT_2, SETTINGS_COMPARED_ROWS, SETTINGS_RULE_ROWS } from "@/pages/inbox/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const CAN_CHANGE_TONE = { yes: "teal", no: "rose" } as const;

/** I15 — Inbox settings, /settings/inbox. */
const InboxSettingsRoute = () => {
  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Inbox", to: "/inbox" }, { label: "Settings" }]}
        title="What reaches your inbox"
        subtitle="Eight rules · five cannot be turned off, one cannot be turned on"
        action={
          <div className="flex flex-wrap gap-2.5 sm:justify-end">
            <Button variant="outline" asChild>
              <Link to="/settings/authority">Approval authority</Link>
            </Button>
            <Button onClick={() => toast.success("Settings saved")}>Save</Button>
          </div>
        }
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[880px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Reaches your inbox when</th>
              <th className={HEAD_CLASS}>Threshold</th>
              <th className={cn(HEAD_CLASS, "text-right")}>This week</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Can you change it?</th>
              <th className={cn(HEAD_CLASS, "text-right")}>State</th>
            </tr>
          </thead>
          <tbody>
            {SETTINGS_RULE_ROWS.map((row) => (
              <tr key={row.when} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-ink-2">{row.when}</td>
                <td className="px-4 py-3 text-ink-3 whitespace-nowrap">{row.threshold}</td>
                <td className={cn("px-4 py-3 text-right font-mono whitespace-nowrap", row.thisWeekTone ? TONE_TEXT_CLASS[row.thisWeekTone] : "text-ink-4")}>
                  {row.thisWeek}
                </td>
                <td className="px-4 py-3 text-right">
                  <Chip tone={CAN_CHANGE_TONE[row.canChange]} className="ml-auto">
                    {row.canChange}
                  </Chip>
                </td>
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

      <div className="rounded-card border border-amber-border bg-amber-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">{SETTINGS_CALLOUT_1.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{SETTINGS_CALLOUT_1.body}</p>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Your inbox, compared
        </p>
        <KvList rows={SETTINGS_COMPARED_ROWS} />
      </div>

      <div className="rounded-card border border-teal-border bg-teal-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">{SETTINGS_CALLOUT_2.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{SETTINGS_CALLOUT_2.body}</p>
      </div>
    </div>
  );
};

export default InboxSettingsRoute;
