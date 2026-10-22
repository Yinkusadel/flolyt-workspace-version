import { Chip } from "@/components/ui/chip";
import type { ConveningWithheldDto } from "@/services/api/rooms/get-convening-proposals";
import { formatDay, humanize } from "@/pages/rooms/convening/format";

/** Detections that matched a condition but could not go further (Convening queue.png, "Withheld"). */
export function WithheldColumn({
  withheld,
  notShown,
}: {
  withheld: ConveningWithheldDto[];
  notShown: number;
}) {
  return (
    <section>
      <div className="flex items-baseline gap-2">
        <h2 className="text-[15px] font-semibold text-ink">Withheld</h2>
        <span className="font-mono text-[11px] text-ink-3">
          {withheld.length} shown{notShown > 0 ? ` · ${notShown} more` : ""}
        </span>
      </div>
      <p className="mt-2 text-[11.5px] text-ink-3">
        Detections that matched a condition but couldn't go further. A quiet week and a week where every
        detection died on a missing source call for opposite responses.
      </p>

      {withheld.length === 0 ? (
        <div className="mt-4 rounded-card border border-dashed border-line bg-paper p-6 text-center">
          <p className="text-[12.5px] font-semibold text-ink">Nothing withheld</p>
          <p className="mt-1 text-[11.5px] text-ink-3">Every detection this week became a proposal.</p>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-line rounded-card border border-line bg-paper">
          {withheld.map((item) => (
            <li key={item.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[12.5px] font-semibold text-ink">{item.title}</p>
                <span className="shrink-0 text-[11.5px] text-ink-3">{formatDay(item.raisedAtUtc)}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Chip tone="amber">{humanize(item.reason)}</Chip>
                <Chip>{humanize(item.alertCategory)}</Chip>
              </div>
              {item.detail && <p className="mt-2 text-[11.5px] text-ink-3">{humanize(item.detail)}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
