import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { cn } from "@/lib/utils";
import { DEPARTMENT_COLORS, EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { CHIP_INTERACTIVE_CLASS } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { LeaksKvList } from "@/pages/revenue/leakage-map/kv-list";
import { LeaksTabs } from "@/pages/revenue/leakage-map/tabs";
import { OpenARoomFromLineModal } from "@/pages/revenue/leakage-map/modals/open-a-room-from-line-modal";
import { DisputeALineModal } from "@/pages/revenue/leakage-map/modals/dispute-a-line-modal";
import { ReclassifyAClaimModal } from "@/pages/revenue/leakage-map/modals/reclassify-a-claim-modal";
import {
  CLAIM_CHIP_TONE,
  CLAIM_LABEL,
  LEAK_MAP_ROWS,
  LK03_NOT_ON_MAP_ROWS,
  LK_TONE_CLASS,
  type LeakMapRow,
} from "@/pages/revenue/leakage-map/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** Only these two rows have a built `:id` reference page — every other stage name renders as plain text. */
const STAGE_DETAIL_HREF: Partial<Record<string, string>> = {
  Adopt: "/leakage-map/adopt-depth",
};

function RoomCell({ row, onAction }: { row: LeakMapRow; onAction: (action: "open-room" | "dispute" | "reclassify") => void }) {
  if (row.roomHref) {
    return (
      <Link to={row.roomHref} className="font-semibold text-ultra hover:underline">
        {row.roomLabel}
      </Link>
    );
  }
  if (row.roomAction) {
    return (
      <button type="button" onClick={() => onAction(row.roomAction!)}>
        <Chip tone="rose" className={CHIP_INTERACTIVE_CLASS}>
          {row.roomLabel}
        </Chip>
      </button>
    );
  }
  if (row.roomLabel === "none") {
    return <span className={LK_TONE_CLASS[row.roomTone ?? "rose"]}>none</span>;
  }
  return <span className="text-ink-2">{row.roomLabel}</span>;
}

/** LK03 — the default populated "The map" state, and the reference table reused by LK07/09/11/17/19. */
export function TheMapState() {
  const [modal, setModal] = useState<"open-room" | "dispute" | "reclassify" | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Leakage map</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            ₦1.08B lost since 4 March · ₦1.11B still at stake · ₦411M recovered
          </p>
        </div>
        <Button type="button" size="sm" onClick={() => setModal("open-room")}>
          Open a room
        </Button>
      </div>

      <LeaksTabs active="The map" />

      <KpiCards
        items={[
          { eyebrow: "Realised loss · 151 days", value: "₦1.08B", tone: "rose", note: "4 March to today" },
          { eyebrow: "Still at stake · next 90 days", value: "₦1.11B", tone: "amber", note: "a different number" },
          { eyebrow: "Recovered and measured", value: "₦411M", tone: "teal", note: "plus 3 other currencies" },
          { eyebrow: "Days from cause to connection", value: "151", tone: "rose", note: "4 Mar found, 2 Aug joined" },
        ]}
      />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where it leaked · ten stages, one release</p>

        <div className="hidden overflow-x-auto rounded-card border border-line bg-paper md:block">
          <table className="w-full min-w-[880px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Stage</th>
                <th className={HEAD_CLASS}>Team</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Realised</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
                <th className={HEAD_CLASS}>Claim type</th>
                <th className={HEAD_CLASS}>Room</th>
                <th className={HEAD_CLASS}>Owner</th>
              </tr>
            </thead>
            <tbody>
              {LEAK_MAP_ROWS.map((row) => (
                <tr key={row.stage} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold">
                    {STAGE_DETAIL_HREF[row.stage] ? (
                      <Link to={STAGE_DETAIL_HREF[row.stage]!} className="text-ultra hover:underline">
                        {row.stage}
                      </Link>
                    ) : (
                      <span className="text-ink">{row.stage}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.team === "Everyone" ? (
                      <span className="text-ink-3">Everyone</span>
                    ) : (
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: DEPARTMENT_COLORS[row.team] }} aria-hidden />
                        <span className="text-ink-2">{row.team}</span>
                      </span>
                    )}
                  </td>
                  <td className={cn("px-4 py-3 text-right font-mono", row.realisedTone ? LK_TONE_CLASS[row.realisedTone] : "text-ink")}>
                    {row.realised}
                  </td>
                  <td className={cn("px-4 py-3 text-right font-mono", row.atStakeTone ? LK_TONE_CLASS[row.atStakeTone] : "text-ink")}>
                    {row.atStake}
                  </td>
                  <td className="px-4 py-3">
                    <Chip tone={CLAIM_CHIP_TONE[row.claimType]}>{CLAIM_LABEL[row.claimType]}</Chip>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <RoomCell row={row} onAction={setModal} />
                  </td>
                  <td className="px-4 py-3">
                    {row.owner ? (
                      <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                        <PersonAvatar kind="human" initials={row.owner.initials} size="sm" style={{ backgroundColor: DEPARTMENT_COLORS[row.owner.department] }} />
                        {row.owner.name.split(" ")[0]}
                      </span>
                    ) : (
                      <Chip tone="rose">nobody</Chip>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2.5 md:hidden">
          {LEAK_MAP_ROWS.map((row) => (
            <div key={row.stage} className="rounded-card border border-line bg-paper p-3.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[12.5px] font-semibold text-ink">{row.stage}</span>
                <span className={cn("font-mono text-[11.5px] font-semibold", row.realisedTone ? LK_TONE_CLASS[row.realisedTone] : "text-ink")}>
                  {row.realised}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Chip tone={CLAIM_CHIP_TONE[row.claimType]}>{CLAIM_LABEL[row.claimType]}</Chip>
                <span className="text-[10px] text-ink-4">
                  {row.owner ? row.owner.name : "nobody"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Callout tone="amber" title="₦1.08B of ₦1.11B traces to one release, and that should worry you as much as it explains">
        Eight of ten stages date their loss to the same week in March — see{" "}
        <Link to="/leakage-map/delivery-fee-checkout" className="font-semibold text-ultra hover:underline">
          how the same release prices out at every stage it touched
        </Link>
        . That is either a catastrophic release or a set of agents anchored on the first cause anyone found — and
        from this screen alone the two look identical. The two association rows with no room, Adopt and Churn at
        ₦252M combined, are the ones to check first, because nobody has ever argued with them.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What is not on this map, and why</p>
        <LeaksKvList rows={LK03_NOT_ON_MAP_ROWS} />
      </section>

      <OpenARoomFromLineModal open={modal === "open-room"} onOpenChange={(open) => setModal(open ? "open-room" : null)} />
      <DisputeALineModal open={modal === "dispute"} onOpenChange={(open) => setModal(open ? "dispute" : null)} />
      <ReclassifyAClaimModal open={modal === "reclassify"} onOpenChange={(open) => setModal(open ? "reclassify" : null)} />
    </div>
  );
}
