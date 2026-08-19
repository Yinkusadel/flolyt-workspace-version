import { Link, useParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { AgentDot, PersonDot } from "@/pages/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { REPLY_DETAILS, REPLY_DETAIL_BANNER, REPLY_DETAIL_CALLOUT } from "@/pages/inbox/data";

/** I06 — only "r-4b19" (Amina B.) has a fully-built detail page, same "one reference row" pattern used across the app. */
const OneReplyRoute = () => {
  const { id } = useParams();
  const detail = id ? REPLY_DETAILS[id] : undefined;

  if (!detail) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">This reply does not have a full page yet</p>
        <p className="mt-1.5 text-[11.5px] text-ink-3">Only Amina B.'s erasure request is built.</p>
        <Link to="/inbox/replies" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
          Back to replies
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Inbox", to: "/inbox" }, { label: "Replies", to: "/inbox/replies" }, { label: detail.customer.name }]}
        title={`${detail.customer.name} · ${detail.customer.location}`}
        subtitle={detail.subtitle}
        action={
          <Button variant="destructive" onClick={() => toast.success("Erasure executed")}>
            Execute the erasure
          </Button>
        }
      />

      <div className="rounded-card border-2 border-rose-border bg-rose-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">{REPLY_DETAIL_BANNER.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{REPLY_DETAIL_BANNER.body}</p>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What she said, and what already happened
        </p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">When</th>
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">What</th>
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">By</th>
                <th className="px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">State</th>
              </tr>
            </thead>
            <tbody>
              {detail.timeline.map((row, i) => (
                <tr key={i} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 text-ink-2">{row.what}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.byPerson ? (
                      <span className="flex items-center gap-2 font-semibold text-ink-2">
                        <PersonDot person={row.byPerson} size="sm" />
                        {row.byPerson.name}
                      </span>
                    ) : row.byAgent ? (
                      <span className="flex items-center gap-2 font-semibold text-ink-2">
                        <AgentDot agent={row.byAgent} size="sm" />
                        {row.byAgent.name}
                      </span>
                    ) : (
                      <span className="text-ink-4">{row.byLabel}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={row.stateTone}>{row.state}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">{REPLY_DETAIL_CALLOUT.title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{REPLY_DETAIL_CALLOUT.body}</p>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What Flolyt will not do with this reply
        </p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {detail.willNotRows.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11px] font-medium text-ink-2">{row.label}</span>
              <span className={cn("text-right text-[10.5px] sm:max-w-[60%]", row.tone ? TONE_TEXT_CLASS[row.tone] : "text-ink-4")}>
                {row.caveat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OneReplyRoute;
