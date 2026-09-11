import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Flag, ShieldCheck } from "lucide-react";

import { Chip, type ChipTone } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import type { ApprovalDetail, EvidenceTier, NoticeItem } from "@/pages/inbox/data";

const TIER_TONE: Record<EvidenceTier, ChipTone> = {
  measured: "teal",
  corroborated: "neutral",
  indicative: "amber",
};

const TIER_LABEL: Record<EvidenceTier, string> = {
  measured: "Measured",
  corroborated: "Corroborated",
  indicative: "Indicative",
};

export function ApprovalView({ item, approval }: { item: NoticeItem; approval: ApprovalDetail }) {
  return (
    <div className="flex h-full min-w-0 flex-col overflow-y-auto">
      <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-control border border-amber-border bg-amber-bg text-amber">
            <ShieldCheck className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-ink">{item.title}</p>
            <p className="mt-0.5 text-[11.5px] text-ink-3">{approval.subtitle}</p>
          </div>
        </div>
        <Chip tone="amber">Approval</Chip>
      </div>

      <div className="space-y-6 px-5 py-5">
        <div>
          <p className="text-[10px] font-medium tracking-[0.07em] text-ink-4 uppercase">What will happen</p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{approval.whatWillHappen}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t border-line pt-5">
          <div>
            <p className="text-[11.5px] text-ink-3">At risk</p>
            <p className="mt-1 text-[18px] font-semibold text-rose">{approval.atRisk}</p>
          </div>
          <div>
            <p className="text-[11.5px] text-ink-3">Customers</p>
            <p className="mt-1 text-[18px] font-semibold text-ink">{approval.customers}</p>
          </div>
          <div>
            <p className="text-[11.5px] text-ink-3">Evidence</p>
            <p className="mt-1 text-[18px] font-semibold text-ink">{approval.evidenceLabel}</p>
          </div>
        </div>

        <div className="border-t border-line pt-5">
          <p className="text-[10px] font-medium tracking-[0.07em] text-ink-4 uppercase">Evidence behind it</p>
          <div className="mt-3 space-y-3">
            {approval.evidence.map((row, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
                <Chip tone={TIER_TONE[row.tier]} className="shrink-0">
                  {TIER_LABEL[row.tier]}
                </Chip>
                <p className="text-[13px] text-ink-2">{row.text}</p>
              </div>
            ))}
          </div>
        </div>

        {approval.objection && (
          <div className="flex items-start gap-3 rounded-card border border-amber-border bg-amber-bg px-4 py-3.5">
            <Flag className="mt-0.5 size-4 shrink-0 text-amber" />
            <div>
              <p className="text-[13px] font-semibold text-amber">
                {approval.objection.person.name} has an open objection on this decision
              </p>
              <p className="mt-0.5 text-[11.5px] text-amber">{approval.objection.body}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <Button asChild size="lg">
            <Link to="/rooms">Open the room to approve</Link>
          </Button>
          <button
            type="button"
            onClick={() => toast.info("Snoozed")}
            className="text-[13px] font-medium text-ink-3 hover:text-ink"
          >
            Snooze
          </button>
        </div>

        <p className="text-[11.5px] text-ink-4">
          Approvals happen in the room, where the evidence and any objections are in front of you.
        </p>
      </div>
    </div>
  );
}
