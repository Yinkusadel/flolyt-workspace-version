import { cn } from "@/lib/utils";
import { PersonAvatar } from "@/components/person-avatar";
import { DEPARTMENT_COLORS, EYEBROW_CLASS, type OwnershipRow, type Trend } from "@/pages/everyday/lifecycle/data";

export type OwnershipTableProps = {
  rows: OwnershipRow[];
};

const TREND_CLASSES: Record<Trend, string> = {
  steady: "text-ink-4",
  worsening: "text-rose",
  improving: "text-teal",
};

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase";

export function OwnershipTable({ rows }: OwnershipTableProps) {
  return (
    <section aria-labelledby="ownership-eyebrow">
      <p id="ownership-eyebrow" className={EYEBROW_CLASS}>
        Who owns what · a stage always has one owning team and a named person
      </p>

      <div className="mt-3 overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[720px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line">
              <th className={HEAD_CLASS}>Stage</th>
              <th className={HEAD_CLASS}>Owning team</th>
              <th className={HEAD_CLASS}>Owner</th>
              <th className={HEAD_CLASS}>Lead agent</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Open rooms</th>
              <th className={HEAD_CLASS}>Reviewed</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.stage} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold whitespace-nowrap text-ink">{row.stage}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="flex items-center gap-2 text-ink-2">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: DEPARTMENT_COLORS[row.department] }}
                      aria-hidden
                    />
                    {row.department}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="flex items-center gap-2 text-ink-2">
                    <PersonAvatar
                      kind="human"
                      initials={row.owner.initials}
                      size="sm"
                      style={{ backgroundColor: DEPARTMENT_COLORS[row.department] }}
                    />
                    {row.owner.name}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="flex items-center gap-2 font-mono text-[10.5px] text-ultra">
                    <PersonAvatar kind="agent" initials={row.leadAgent.initials} size="sm" />
                    {row.leadAgent.name}
                  </span>
                </td>
                <td
                  className={cn(
                    "px-4 py-3 text-right font-mono font-semibold",
                    row.openRooms > 0 ? "text-amber" : "text-ink-4"
                  )}
                >
                  {row.openRooms}
                </td>
                <td className="px-4 py-3 font-mono whitespace-nowrap text-ink-4">{row.reviewCadence}</td>
                <td
                  className={cn(
                    "px-4 py-3 text-right font-medium whitespace-nowrap",
                    TREND_CLASSES[row.trend]
                  )}
                >
                  {row.trend}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
