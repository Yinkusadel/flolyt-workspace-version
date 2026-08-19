import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { QUIET_HOURS_ROWS } from "@/pages/everyday/digest/data";
import { DigestSettingsTabs } from "@/pages/everyday/digest/settings/tabs";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const EXEMPTION_CARDS = [
  {
    eyebrow: "ALWAYS EXEMPT",
    tone: "rose" as const,
    title: "A guardrail stopping a send",
    body: "If the frequency cap, quiet hours or opt-out check halts something mid-flight, everyone in that room is told immediately regardless of the hour. It is the only rule allowed through.",
    footnote: "cannot be turned off",
  },
  {
    eyebrow: "NEVER EXEMPT",
    tone: "amber" as const,
    title: "An approval, however large",
    body: "A ₦412M play waiting on you at 23:00 waits until 07:00. The cost of waiting is real and it is smaller than the cost of a culture where the product wakes people up.",
    footnote: "including Ada",
  },
  {
    eyebrow: "YOUR OWN OVERRIDE",
    tone: "neutral" as const,
    title: "You can go quieter, never louder",
    body: "You may widen your quiet hours or mute a channel entirely. You cannot narrow them below the market default, and you cannot opt into overnight approvals.",
    footnote: "one direction only",
  },
];

/** D11 — Quiet hours and timezones, /settings/digest/quiet-hours. */
const QuietHoursRoute = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Quiet hours</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Four markets, four clocks · your local for reading, the customer's local for sending</p>
        </div>
        <Button className="shrink-0">Save</Button>
      </div>

      <DigestSettingsTabs active="quiet-hours" />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[900px] text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Market</th>
              <th className={HEAD_CLASS}>Quiet hours</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Digest built at</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Timezone</th>
              <th className={HEAD_CLASS}>Who this affects</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Exempt</th>
            </tr>
          </thead>
          <tbody>
            {QUIET_HOURS_ROWS.map((row) => (
              <tr key={row.market} className="border-b border-line last:border-0">
                <td className="px-4 py-3.5 font-semibold text-ink">{row.market}</td>
                <td className="px-4 py-3.5 font-mono text-ink-3 whitespace-nowrap">{row.quietHours}</td>
                <td className={cn("px-4 py-3.5 text-right font-mono whitespace-nowrap", row.builtAtTone ? TONE_TEXT_CLASS[row.builtAtTone] : "text-ink")}>
                  {row.builtAt}
                </td>
                <td className="px-4 py-3.5 text-right font-mono whitespace-nowrap text-ink-4">{row.timezone}</td>
                <td className="px-4 py-3.5 text-ink-3">{row.affects}</td>
                <td className="px-4 py-3.5 text-right whitespace-nowrap text-ink-3">{row.exempt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="teal" title="Local means the reader's local, and separately the customer's local">
        Your digest is built at 06:00 where you are. A send to a customer respects quiet hours where they are. These
        are two different clocks and conflating them is how a Nairobi team lead gets a Lagos morning, or a Ghanaian
        customer gets a message at 05:00.
      </Callout>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          The one exemption, and why it exists
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {EXEMPTION_CARDS.map((card) => (
            <div key={card.title} className="flex flex-col justify-between rounded-card border border-line bg-paper p-4">
              <div>
                <span className={cn("font-mono text-[9.5px] font-semibold tracking-[0.6px] uppercase", TONE_TEXT_CLASS[card.tone])}>
                  {card.eyebrow}
                </span>
                <h3 className="mt-2 text-[13px] font-semibold text-ink">{card.title}</h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{card.body}</p>
              </div>
              <p className={cn("mt-3 border-t border-dashed border-line pt-3 font-mono text-[10.5px]", TONE_TEXT_CLASS[card.tone])}>
                {card.footnote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuietHoursRoute;
