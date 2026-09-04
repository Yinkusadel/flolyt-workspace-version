import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WideBarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { InfoTooltip } from "@/pages/everyday/lifecycle/stage-rail";
import { formatCompactMoney, formatCount } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetAcquireChannels } from "@/features/lifecycle/use-get-acquire-channels";
import type { AcquireChannelDto } from "@/services/api/lifecycle/get-acquire-channels";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

type ChannelRow = AcquireChannelDto & { id: string };

// ❌ Backend does NOT provide: "Reach 2nd order" or "Verdict" — GET /lifecycle/acquire/channels
// has no per-channel repeat-conversion rate and no verdict/label field (confirmed against
// docs/endpoints/lifecycle.md). Those two columns from the original design are dropped rather
// than shown against a fabricated value, same treatment as Overview's "Blended CAC" card.
const COLUMNS: Column<ChannelRow>[] = [
  { key: "channel", header: "Channel", render: (row) => <span className="font-semibold text-ink-2">{row.channel}</span> },
  {
    key: "customers",
    header: "Acquired",
    align: "right",
    render: (row) => (row.customers !== null ? <span className="font-mono text-ink">{formatCount(row.customers)}</span> : <InfoTooltip />),
  },
  {
    key: "acquisitionCost",
    header: "Spend",
    align: "right",
    render: (row) =>
      row.acquisitionCost !== null && row.currency !== null ? (
        <span className="font-mono text-ink">{formatCompactMoney(row.acquisitionCost, row.currency)}</span>
      ) : (
        <InfoTooltip />
      ),
  },
  {
    key: "costPerCustomer",
    header: "CAC",
    align: "right",
    render: (row) =>
      row.costPerCustomer !== null && row.currency !== null ? (
        <span className="text-ink-2">{formatCompactMoney(row.costPerCustomer, row.currency)}</span>
      ) : (
        <InfoTooltip />
      ),
  },
  {
    key: "revenuePerCustomer",
    header: "Value per customer",
    align: "right",
    render: (row) =>
      row.revenuePerCustomer !== null && row.currency !== null ? (
        <span className="text-ink-2">{formatCompactMoney(row.revenuePerCustomer, row.currency)}</span>
      ) : (
        <InfoTooltip />
      ),
  },
];

function ChannelsSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

/** A04 — Acquire's unique Channels tab. */
const AcquireChannelsTab = () => {
  const { data, isLoading, isError, refetch } = useGetAcquireChannels();
  const channels = data?.data;
  const rows: ChannelRow[] = (channels?.channels ?? []).map((channel) => ({ ...channel, id: channel.channel }));
  const spendRows = rows.filter((row) => row.acquisitionCost !== null).sort((a, b) => (b.acquisitionCost ?? 0) - (a.acquisitionCost ?? 0));
  const maxSpend = spendRows[0]?.acquisitionCost ?? 0;

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          {rows.length > 0 ? `${rows.length} channels · cost against what the customer is actually worth` : "Cost against what the customer is actually worth"}
        </p>

        {isError ? (
          <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
            <p className="text-[12px] text-rose">Couldn't load the channels.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : isLoading ? (
          <ChannelsSkeleton />
        ) : (
          <DataTable
            columns={COLUMNS}
            rows={rows}
            emptyTitle="No channels measured yet"
            emptyBody="Channel-level spend and value figures will appear here once acquisition data has been read for this workspace."
          />
        )}
      </section>

      {spendRows.length > 0 && (
        <section className="space-y-5">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Where the money actually goes</p>
          <div className="space-y-5">
            {spendRows.map((row) => (
              <WideBarRow
                key={row.id}
                label={row.channel}
                value={
                  row.currency
                    ? `${formatCompactMoney(row.acquisitionCost!, row.currency)}${row.customers !== null ? ` · ${formatCount(row.customers)} customers` : ""}`
                    : formatCount(row.customers ?? 0)
                }
                percent={maxSpend > 0 ? (row.acquisitionCost! / maxSpend) * 100 : 0}
                tone="amber"
              />
            ))}
          </div>
        </section>
      )}

      {channels?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
};

export default AcquireChannelsTab;
