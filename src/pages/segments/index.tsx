import { cn } from "@/lib/utils";
import {
  CUSTOMER_BASE,
  MOVEMENTS,
  SEGMENTS,
  STAGE_SUMMARY,
  type ChangeTone,
  type StageAccent,
} from "@/pages/segments/data";

const STAGE_ACCENT_CLASS: Record<StageAccent, string> = {
  teal: "bg-teal",
  amber: "bg-amber",
  rose: "bg-rose",
  ultra: "bg-ultra",
};

const CHANGE_TONE_CLASS: Record<ChangeTone, string> = {
  teal: "text-teal",
  amber: "text-amber",
  rose: "text-rose",
};

const RAIL_ITEMS = [
  {
    heading: "They move on their own",
    body: "A person can be in Champions on Monday and Slipping by Friday. Nothing here is a saved export.",
  },
  {
    heading: "Size is the least useful number",
    body: "The 30-day change column is what opens a room. 148,000 people is a fact; +31% is a problem.",
  },
  {
    heading: "Overlap is expected",
    body: "Someone can be discount-only and slipping at once. Frequency caps exist because of exactly this.",
  },
  {
    heading: "Unused segments are flagged",
    body: "180,000 deep-lapsed customers nobody has acted on is itself a finding.",
  },
];

/** Screen 36 (segments) — see flolyt-kit-122/36-segments.svg. */
const Segments = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Segments</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          {CUSTOMER_BASE} customers · movement between stages over the last 30 days
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="min-w-0 space-y-8">
          <section className="space-y-4">
            <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
              Movement · where people went last month
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {STAGE_SUMMARY.map((stage) => (
                <div
                  key={stage.key}
                  className="relative overflow-hidden rounded-panel border border-line bg-paper p-4 pt-[15px]"
                >
                  <span
                    className={cn("absolute inset-x-0 top-0 h-[3px]", STAGE_ACCENT_CLASS[stage.accent])}
                    aria-hidden
                  />
                  <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                    {stage.label}
                  </p>
                  <p className="mt-2 text-[20px] font-semibold text-ink">{stage.count}</p>
                  <p className="mt-0.5 text-[10px] text-ink-4">customers</p>
                </div>
              ))}
            </div>

            <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-paper">
              {MOVEMENTS.map((movement) => (
                <div
                  key={movement.id}
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
                >
                  <span className="flex shrink-0 items-center gap-2 sm:w-[180px]">
                    <span
                      className={cn(
                        "size-[7px] shrink-0 rounded-full",
                        movement.tone === "concern" ? "bg-rose" : "bg-teal"
                      )}
                      aria-hidden
                    />
                    <span className="text-[12px] font-medium text-ink">
                      {movement.from} → {movement.to}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 font-mono text-[12px] font-semibold sm:w-[90px]",
                      movement.tone === "concern" ? "text-rose" : "text-teal"
                    )}
                  >
                    {movement.count}
                  </span>
                  <span className="text-[11px] text-ink-4">{movement.note}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
              Segments in use · built once, kept live
            </p>

            <div className="overflow-x-auto rounded-card border border-line bg-paper">
              <table className="w-full min-w-[640px] text-left text-[12px]">
                <thead>
                  <tr className="border-b border-line">
                    <th className="px-4 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                      Segment
                    </th>
                    <th className="px-4 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                      Rule
                    </th>
                    <th className="px-4 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                      Size
                    </th>
                    <th className="px-4 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                      30-day change
                    </th>
                    <th className="px-4 py-2.5 text-right font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                      Used by
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SEGMENTS.map((segment) => (
                    <tr key={segment.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 align-top font-semibold whitespace-nowrap text-ink">
                        {segment.name}
                      </td>
                      <td className="px-4 py-3 align-top text-ink-3">{segment.rule}</td>
                      <td className="px-4 py-3 align-top font-mono whitespace-nowrap text-ink-2">{segment.size}</td>
                      <td
                        className={cn(
                          "px-4 py-3 align-top font-mono font-semibold whitespace-nowrap",
                          CHANGE_TONE_CLASS[segment.changeTone]
                        )}
                      >
                        {segment.change}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 text-right align-top whitespace-nowrap",
                          segment.usedByWarn ? "text-amber" : "text-ink-4"
                        )}
                      >
                        {segment.usedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="overflow-hidden rounded-card border border-line bg-paper-2 lg:sticky lg:top-0">
          <div className="border-b border-line px-5 py-4">
            <p className="text-[11px] font-semibold tracking-[0.45px] text-ink-2">SEGMENTS ARE NOT LISTS</p>
          </div>
          <div className="divide-y divide-line">
            {RAIL_ITEMS.map((item) => (
              <div key={item.heading} className="p-5">
                <h3 className="text-[12.5px] font-semibold text-ink">{item.heading}</h3>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-3">{item.body}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Segments;
