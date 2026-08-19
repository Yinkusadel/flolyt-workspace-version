import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import {
  SUPPORT_MARKET_CLOSING,
  SUPPORT_MARKET_GHANA_ROWS,
  SUPPORT_MARKET_ROWS,
  type SupportMarketRow,
} from "@/pages/everyday/lifecycle/stage/support/data";

const CONTACT_RATE_TONE_CLASS: Record<SupportMarketRow["contactRateTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const RESOLUTION_TONE_CLASS: Record<"teal" | "rose", string> = { teal: "text-teal", rose: "text-rose" };
const SILENT_TONE_CLASS: Record<SupportMarketRow["silentFailuresTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose", neutral: "text-ink-4" };
const DELIVERY_FEED_TONE_CLASS: Record<"teal" | "rose", string> = { teal: "text-teal", rose: "text-rose" };

const COLUMNS: Column<SupportMarketRow>[] = [
  { key: "market", header: "Market", render: (row) => <span className="font-semibold text-ink-2">{row.market}</span> },
  { key: "contactsPerMo", header: "Contacts / mo", align: "right", render: (row) => <span className="font-mono text-ink">{row.contactsPerMo}</span> },
  { key: "contactRate", header: "Contact rate", align: "right", render: (row) => <span className={CONTACT_RATE_TONE_CLASS[row.contactRateTone]}>{row.contactRate}</span> },
  { key: "resolution", header: "Resolution", align: "right", render: (row) => <span className={RESOLUTION_TONE_CLASS[row.resolutionTone]}>{row.resolution}</span> },
  { key: "repeatAfter", header: "Repeat after", align: "right", render: (row) => <span className={RESOLUTION_TONE_CLASS[row.repeatAfterTone]}>{row.repeatAfter}</span> },
  { key: "silentFailures", header: "Silent failures", align: "right", render: (row) => <span className={row.silentFailures === "Unavailable" ? "font-mono text-ink-4" : SILENT_TONE_CLASS[row.silentFailuresTone]}>{row.silentFailures}</span> },
  { key: "atStake", header: "At stake", align: "right", render: (row) => <span className="text-amber">{row.atStake}</span> },
  { key: "deliveryFeed", header: "Delivery feed", align: "right", render: (row) => <span className={DELIVERY_FEED_TONE_CLASS[row.deliveryFeedTone]}>{row.deliveryFeed}</span> },
];

/**
 * SU07 — Support's Markets tab (stage-specific layout, not the shared
 * MarketsTab template — SU07's columns are contact rate/resolution/silent
 * failures/delivery feed, not Acquire's spend/CAC, confirmed by reading
 * SU07 directly).
 */
const SupportMarketsTab = () => {
  return (
    <div className="space-y-8">
      <DataTable columns={COLUMNS} rows={SUPPORT_MARKET_ROWS} />

      <Callout tone="rose" title={SUPPORT_MARKET_CLOSING.title}>
        {SUPPORT_MARKET_CLOSING.body}
      </Callout>

      <section className="space-y-1">
        <p className={`pb-2 ${EYEBROW_CLASS}`}>Seventh consecutive stage</p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {SUPPORT_MARKET_GHANA_ROWS.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11.5px] text-ink-2">{row.label}</span>
              <span className="font-mono text-[11px] text-rose">{row.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SupportMarketsTab;
