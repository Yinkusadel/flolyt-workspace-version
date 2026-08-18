import { Link } from "react-router-dom";

import { KpiCards, type Kpi } from "@/pages/lifecycle/stage/kpi-cards";
import { Chip } from "@/pages/lifecycle/stage/chip";
import type { Tone } from "@/pages/rooms/types";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const STATS: Kpi[] = [
  { eyebrow: "You are watching", value: "22 rooms", note: "14 you own, 8 you do not" },
  { eyebrow: "Reaching your digest", value: "6", tone: "teal", note: "the rest are silent" },
  { eyebrow: "Auto-added this month", value: "5", note: "you were @-mentioned" },
  { eyebrow: "Muted by you", value: "3", note: "still visible, never notified" },
];

const ROWS: {
  room: string;
  roomId: string;
  why: string;
  atRisk: string;
  atRiskTone: Tone;
  notifies: string;
  notifiesTone: Tone | "ink";
  since: string;
  change: { label: string; tone: Tone };
}[] = [
  { room: "Second order never happened", roomId: "second-order-never-happened", why: "You own it", atRisk: "₦412M", atRiskTone: "rose", notifies: "everything", notifiesTone: "amber", since: "2 Aug", change: { label: "cannot mute", tone: "amber" } },
  { room: "Checkout abandoned at delivery fee", roomId: "checkout-abandoned-at-delivery-fee", why: "Same root cause as yours", atRisk: "₦124M", atRiskTone: "rose", notifies: "decisions only", notifiesTone: "ink", since: "11 Aug", change: { label: "watching", tone: "teal" } },
  { room: "Cards failing on renewal night", roomId: "cards-failing-on-renewal-night", why: "You were @-mentioned once", atRisk: "₦88M", atRiskTone: "amber", notifies: "nothing", notifiesTone: "ink", since: "4 Aug", change: { label: "muted", tone: "neutral" } },
  { room: "Weekend push fatigue", roomId: "weekend-push-fatigue", why: "You owned it once", atRisk: "₦12M", atRiskTone: "neutral", notifies: "nothing", notifiesTone: "ink", since: "3 Mar", change: { label: "muted", tone: "neutral" } },
];

const RULES = [
  { label: "You cannot mute a room you own", value: "muting your own room is resigning from it, and resigning has its own screen", tone: "text-amber" },
  { label: "Muted is not hidden", value: "it stays in your list, stays searchable, and still counts toward your load" },
  { label: "Being @-mentioned adds you, once", value: "one mention is not a subscription · you are added and told that you were" },
  { label: "Watching decays", value: "a room you have not opened in 30 days asks whether you still want it", tone: "text-teal" },
  { label: "Your load is visible to your lead", value: "22 rooms is high · it can be seen before you're assigned a 23rd", tone: "text-amber" },
];

/** R40 — Room subscriptions (`/rooms/subscriptions`) — a top-level cross-room surface. */
const RoomSubscriptions = () => {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[10.5px] text-ink-4">
          <Link to="/rooms" className="hover:text-ink-3">
            Rooms
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-ink-3">What you watch</span>
        </p>
        <h1 className="mt-2 text-[17px] font-semibold text-ink">What you watch</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">22 rooms · six reach your digest · three muted and still visible</p>
      </div>

      <KpiCards items={STATS} />

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What you watch, and how loudly
        </p>
        <div className="mt-2 overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Room</th>
                <th className={HEAD_CLASS}>Why you are on it</th>
                <th className={HEAD_CLASS}>At risk</th>
                <th className={HEAD_CLASS}>Notifies you</th>
                <th className={HEAD_CLASS}>Since</th>
                <th className={HEAD_CLASS}>Change</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.roomId} className="border-b border-line last:border-0 hover:bg-paper-2">
                  <td className="px-4 py-3.5">
                    <Link to={`/rooms/${row.roomId}`} className="font-semibold text-ink-2 hover:text-ink">
                      {row.room}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-ink-3">{row.why}</td>
                  <td className="px-4 py-3.5">
                    <Chip tone={row.atRiskTone}>{row.atRisk}</Chip>
                  </td>
                  <td className="px-4 py-3.5 text-ink-4">{row.notifies}</td>
                  <td className="px-4 py-3.5 font-mono text-ink-4">{row.since}</td>
                  <td className="px-4 py-3.5">
                    <Chip tone={row.change.tone}>{row.change.label}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">The rules</p>
        <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
          {RULES.map((rule) => (
            <div key={rule.label} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[12px]">
              <span className="text-ink-2">{rule.label}</span>
              <span className={`text-right ${rule.tone ?? "text-ink-3"}`}>{rule.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-teal-border bg-teal-bg p-4">
        <div>
          <p className="text-[12px] font-semibold text-ink">At scale, attention is the scarce thing</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            Nobody can watch everything and nobody should. This is the only place a person sees the full shape of
            what they have signed up to hear about — and quietly, it is the best predictor of who is about to be
            overloaded.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoomSubscriptions;
