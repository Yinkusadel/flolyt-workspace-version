import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { formatCompactMoney, formatCount, formatShortDate } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetExpandAccounts } from "@/features/lifecycle/use-get-expand-accounts";
import type { ExpandAtRiskAccountDto } from "@/services/api/lifecycle/get-expand-accounts";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

type AccountRow = ExpandAtRiskAccountDto & { id: string };

const COLUMNS: Column<AccountRow>[] = [
  {
    key: "customer",
    header: "Customer",
    render: (row) => (
      <div>
        <p className="font-semibold text-ink-2">{row.customer}</p>
        <p className="mt-0.5 text-[10px] text-ink-4">{row.plan ?? "No plan on record"}</p>
      </div>
    ),
  },
  {
    key: "renewal",
    header: "Renews",
    align: "right",
    render: (row) => (
      <span className="font-mono text-ink">
        {row.daysToRenewal}d <span className="text-ink-4">· {formatShortDate(row.endsAtUtc)}</span>
      </span>
    ),
  },
  {
    key: "value",
    header: "Value",
    align: "right",
    render: (row) => <span className="font-mono text-ink">{row.value !== null && row.currency !== null ? formatCompactMoney(row.value, row.currency) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
  {
    key: "signals",
    header: "Signals",
    render: (row) => (
      <div className="flex flex-wrap justify-end gap-1">
        {row.signals.map((signal) => (
          <Chip key={signal} tone="amber">
            {signal}
          </Chip>
        ))}
      </div>
    ),
  },
  {
    key: "paymentsFailed",
    header: "Payments failed",
    align: "right",
    render: (row) => <span className="font-mono text-rose">{row.paymentsFailed !== null ? formatCount(row.paymentsFailed) : <span className="text-ink-4">Unavailable</span>}</span>,
  },
  {
    key: "tickets",
    header: "Tickets",
    align: "right",
    render: (row) => <span className="font-mono text-ink-4">{row.tickets !== null ? formatCount(row.tickets) : "Unavailable"}</span>,
  },
];

function AccountsSkeleton() {
  return (
    <div className="space-y-3 rounded-card border border-line bg-paper p-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-20 rounded-chip" />
        </div>
      ))}
    </div>
  );
}

/**
 * EX06 — Expand's own Accounts tab, wired to GET /lifecycle/expand/accounts. Narrower than the old
 * mock's "whole business book in accounts mode" — this endpoint only covers subscriptions renewing
 * soon that carry a visible risk signal, since nothing in the semantic layer groups customers into
 * a corporate account (no seats/headcount concept exists here at all).
 */
const ExpandAccountsTab = () => {
  const { data, isLoading, isError, refetch } = useGetExpandAccounts();
  const accounts = data?.data;
  const rows: AccountRow[] = (accounts?.atRisk ?? []).map((account) => ({ ...account, id: account.customer }));

  return (
    <div className="space-y-8">
      <p className={EYEBROW_CLASS}>
        {accounts
          ? `${accounts.atRiskCount !== null ? formatCount(accounts.atRiskCount) : rows.length} subscriptions renewing in ${accounts.horizonDays} days carry a risk signal · owner ${accounts.owner ?? "unassigned"}`
          : "Subscriptions renewing soon that carry a visible risk signal"}
      </p>

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Expand's at-risk accounts.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <AccountsSkeleton />
      ) : (
        <DataTable columns={COLUMNS} rows={rows} emptyTitle="No accounts at risk right now" emptyBody="Renewals carrying a payment-failure or support-ticket signal will appear here." />
      )}

      {accounts && accounts.checked.length > 0 && (
        <p className="text-[10.5px] text-ink-4">
          Only evaluated for: {accounts.checked.join(", ")} — a renewal absent above has been cleared on just these signals, not every possible one.
        </p>
      )}

      {/* ❌ Backend does NOT provide: seats, a blended "health" score, or the full business-account
          book — the old mock's "accounts mode" reframing of the entire consumer base (1,204 named
          businesses with seats and a renewal date each) has no matching concept on this endpoint.
          Only at-risk renewals with a real signal are shown; nothing here is a fused score, per
          this endpoint's own note. */}

      {accounts?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
};

export default ExpandAccountsTab;
