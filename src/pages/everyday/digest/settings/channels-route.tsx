import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { CHANNEL_ROWS } from "@/pages/everyday/digest/data";
import { DigestSettingsTabs } from "@/pages/everyday/digest/settings/tabs";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** D10 — Channels, /settings/digest/channels. */
const ChannelsRoute = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Digest channels</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Six channels · one has not delivered in two days and 612 messages are queued</p>
        </div>
        <Button className="shrink-0">Fix the certificate</Button>
      </div>

      <DigestSettingsTabs active="channels" />

      <div className="rounded-card border-2 border-rose-border bg-rose-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">Push has not delivered since 11 August · 612 messages are queued</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
          The APNs certificate expired. Nothing was dropped — everything queued will send when it is replaced. Email
          and Slack are unaffected, and this is in your inbox as a systems item.
        </p>
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[900px] text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Channel</th>
              <th className={HEAD_CLASS}>Sends</th>
              <th className={HEAD_CLASS}>Contains</th>
              <th className={cn(HEAD_CLASS, "text-right")}>State</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Health</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Last delivered</th>
            </tr>
          </thead>
          <tbody>
            {CHANNEL_ROWS.map((row) => (
              <tr key={row.channel} className="border-b border-line last:border-0">
                <td className="px-4 py-3.5 font-semibold text-ink">{row.channel}</td>
                <td className="px-4 py-3.5 text-ink-3">{row.sends}</td>
                <td className="px-4 py-3.5 text-ink-3">{row.contains}</td>
                <td className="px-4 py-3.5 text-right">
                  <Chip tone={row.state === "on" ? "teal" : "neutral"}>{row.state}</Chip>
                </td>
                <td className={cn("px-4 py-3.5 text-right whitespace-nowrap", row.healthTone ? TONE_TEXT_CLASS[row.healthTone] : "text-ink-4")}>
                  {row.health ?? "—"}
                </td>
                <td className={cn("px-4 py-3.5 text-right font-mono whitespace-nowrap", row.lastDeliveredTone ? TONE_TEXT_CLASS[row.lastDeliveredTone] : "text-ink-4")}>
                  {row.lastDelivered ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="rose" title="A channel that fails silently is worse than no channel">
        Push has been dead for two days. It is marked on this screen, counted in the inbox, named in the weekly
        roll-up, and the queued messages are held rather than discarded. What it does not do is fail quietly and let
        you assume you were told about something.
      </Callout>
    </div>
  );
};

export default ChannelsRoute;
