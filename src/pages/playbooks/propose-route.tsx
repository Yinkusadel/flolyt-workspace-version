import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { PENDING_PROPOSAL } from "@/pages/playbooks/data";

/** PB04 — /playbooks/propose. Flolyt's single pending proposal (Maestro, "Dunning retry spread"),
 * reached from the index's "Flolyt has 1 playbook to propose" link. Keeps the section's own
 * "Playbooks" heading rather than a sub-page breadcrumb trail — this is a review mode of the
 * library, not a detail page. */
export default function PlaybooksProposeRoute() {
  usePageBreadcrumb([{ label: "Playbooks" }]);

  const { owner, proposal } = PENDING_PROPOSAL;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Playbooks</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Flolyt has one playbook to propose</p>
      </div>

      <div className="flex items-start gap-4 rounded-card border border-ultra-border bg-ultra-bg p-5">
        <PersonAvatar kind="agent" initials={owner.initials} size="lg" className="mt-0.5 shrink-0" />
        <div>
          <p className="text-[15px] font-semibold text-ink">You have done this three times</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{proposal.fromRoomsBody}</p>
          <p className="mt-2 text-[12px] text-ink-3">
            Nothing is created until you say so, and it would start as Proposed, not Automatic.
          </p>
        </div>
      </div>

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Drawn from</p>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {proposal.drawnFrom.map((room) => (
            <div key={room.label} className="rounded-card border border-line bg-paper p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-semibold text-ink">{room.label}</p>
                <ArrowUpRight className="size-3.5 shrink-0 text-ink-4" />
              </div>
              <p className="mt-1 text-[12px] text-ink-3">{room.date}</p>
              <p className="mt-3 text-[13px] font-semibold text-teal">{room.preserved}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-card border border-line bg-paper p-5">
          <p className="text-[15px] font-semibold text-ink">What Maestro is proposing</p>
          <p className="mt-1 text-[11.5px] text-ink-3">Everything here is editable before it is created</p>
          <div className="mt-4 divide-y divide-line">
            {proposal.proposing.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <p className="text-[13px] text-ink-3">{row.label}</p>
                <div className="flex items-center gap-4">
                  <p className="text-[13px] font-medium text-ink">{row.value}</p>
                  <span className="text-[12px] font-medium text-ultra">Edit</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-card border border-line bg-paper p-5">
            <p className="text-[14px] font-semibold text-ink">What it would have caught</p>
            <p className="mt-1 text-[11.5px] text-ink-3">Backtested over the last 90 days</p>
            <p className="mt-4">
              <span className="text-[28px] font-semibold text-ink">{proposal.backtestCount}</span>
              <span className="ml-1.5 text-[13px] text-ink-2">{proposal.backtestBody}</span>
            </p>
            <div className="mt-4 rounded-card border border-amber-border bg-amber-bg p-3">
              <p className="text-[12px] text-amber">{proposal.falsePositiveNote}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-5">
        <Button asChild>
          <Link to="/playbooks">Create as Proposed</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={`/playbooks/${PENDING_PROPOSAL.id}`}>Edit first</Link>
        </Button>
        <Link to="/playbooks" className="text-[13px] font-medium text-ink-3 hover:text-ink">
          Not useful
        </Link>
        <p className="ml-auto text-[11.5px] text-ink-4">Dismissing tells Maestro not to propose this pattern again</p>
      </div>

      <p className="text-[13px] leading-relaxed text-ink-2">
        A playbook proposed from three measured outcomes is a different thing from one someone wrote down because it
        felt right. Flolyt only proposes the first kind.
      </p>
    </div>
  );
}
