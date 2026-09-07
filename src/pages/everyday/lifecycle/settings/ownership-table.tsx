import { Plus, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { PersonAvatar } from "@/components/person-avatar";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DEPARTMENT_COLORS, EYEBROW_CLASS, KNOWN_DEPARTMENTS, type Department } from "@/pages/everyday/lifecycle/data";

export type OwnershipRow = {
  id: string;
  stage: string;
  owningTeam: string | null;
  ownerId: string | null;
  ownerName: string | null;
  leadAgentName: string | null;
  openRooms: number;
  reviewCadence: string | null;
};

export type OwnershipTableProps = {
  rows: OwnershipRow[];
  onManageOwner: (row: OwnershipRow) => void;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase";

export function OwnershipTable({ rows, onManageOwner }: OwnershipTableProps) {
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
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const knownDepartment = row.owningTeam && KNOWN_DEPARTMENTS.has(row.owningTeam) ? (row.owningTeam as Department) : null;
              return (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap text-ink">{row.stage}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="flex items-center gap-2 text-ink-2">
                      {knownDepartment && (
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: DEPARTMENT_COLORS[knownDepartment] }}
                          aria-hidden
                        />
                      )}
                      {row.owningTeam ?? <span className="text-ink-4">Unavailable</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.ownerName ? (
                      <span className="flex items-center gap-2">
                        <span className="flex items-center gap-2 text-ink-2">
                          <PersonAvatar
                            kind="human"
                            initials={getInitials(row.ownerName)}
                            size="sm"
                            style={knownDepartment ? { backgroundColor: DEPARTMENT_COLORS[knownDepartment] } : undefined}
                          />
                          {row.ownerName}
                        </span>
                        <button
                          type="button"
                          onClick={() => onManageOwner(row)}
                          className="shrink-0 rounded-control p-1 text-ink-4 hover:bg-paper-2 hover:text-ink"
                          aria-label={`Change ${row.stage}'s owner`}
                        >
                          <Pencil className="size-3" />
                        </button>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Chip tone="amber">No owner</Chip>
                        <button
                          type="button"
                          onClick={() => onManageOwner(row)}
                          className="shrink-0 rounded-control p-1 text-ink-4 hover:bg-paper-2 hover:text-ink"
                          aria-label={`Assign ${row.stage}'s owner`}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.leadAgentName ? (
                      <span className="flex items-center gap-2 font-mono text-[10.5px] text-ultra">
                        <PersonAvatar kind="agent" initials={getInitials(row.leadAgentName)} size="sm" />
                        {row.leadAgentName}
                      </span>
                    ) : (
                      <span className="text-ink-4">No lead agent</span>
                    )}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 text-right font-mono font-semibold",
                      row.openRooms > 0 ? "text-amber" : "text-ink-4"
                    )}
                  >
                    {row.openRooms}
                  </td>
                  <td className="px-4 py-3 font-mono whitespace-nowrap text-ink-4">{row.reviewCadence ?? "Not set"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
