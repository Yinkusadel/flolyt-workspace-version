import { Link } from "react-router-dom";

import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { Button } from "@/components/ui/button";
import { WRITE_FROM_ROOM } from "@/pages/playbooks/data";

/** PB07 — /playbooks/new, promoting Room 2412 (business-memory's "Delivery fee shown after the
 * cart") into the library's first playbook. Fields are shown read-only — filled in from what
 * actually happened in the room — since there's no form state to persist yet; "Edit" reads as an
 * affordance, not a working control, same as the proposal review's own "Edit" labels. */
export default function PlaybooksNewRoute() {
  usePageBreadcrumb([{ label: "Playbooks", to: "/playbooks" }, { label: "Write a playbook" }]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Write a playbook</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Promoting from {WRITE_FROM_ROOM.roomLabel} · everything below is filled in from what actually happened
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-card border border-line bg-paper p-5">
          <div className="space-y-5">
            {WRITE_FROM_ROOM.fields.map((field) => (
              <div key={field.label}>
                <p className="font-mono text-[9px] font-semibold tracking-[0.06em] text-ink-4 uppercase">{field.label}</p>
                <div className="mt-1.5 rounded-control border border-line bg-paper px-3 py-2">
                  <p className="text-[12.5px] text-ink">{field.value}</p>
                </div>
                {field.hint && <p className="mt-1 text-[11px] text-ink-3">{field.hint}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-card border border-ultra-border bg-ultra-bg p-5">
            <p className="text-[14px] font-semibold text-ink">Promoted, not invented</p>
            <p className="mt-2 text-[12px] leading-relaxed text-ink-2">
              This one comes from a room that closed with {WRITE_FROM_ROOM.preserved} measured against a holdout. It
              starts with evidence behind it.
            </p>
            <Link
              to={`/business-memory/${WRITE_FROM_ROOM.roomId}`}
              className="mt-3 inline-block text-[12px] font-medium text-ultra hover:underline"
            >
              {WRITE_FROM_ROOM.roomLabel} →
            </Link>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-5">
            <p className="text-[14px] font-semibold text-amber">Writing one from scratch</p>
            <p className="mt-2 text-[12px] leading-relaxed text-amber/90">
              A playbook with no run history has nothing to earn autonomy with. It stays Draft until it has worked
              three times, however confident you are today.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-card border border-line bg-paper p-5">
        <p className="text-[16px] font-semibold text-ink">What it inherits from the room</p>
        <div className="mt-4 divide-y divide-line">
          {WRITE_FROM_ROOM.inherits.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13px] text-ink-3">{row.label}</p>
              <p className="text-[13px] font-medium text-ink">{row.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-ink-4">
          Everything here travels with it. A playbook that loses its evidence is just an instruction.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button asChild>
          <Link to="/playbooks">Create as Proposed</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/playbooks">Save as Draft</Link>
        </Button>
        <p className="ml-auto text-[11.5px] text-ink-4">Nothing starts Automatic</p>
      </div>
    </div>
  );
}
