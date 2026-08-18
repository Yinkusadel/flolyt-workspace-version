import { PersonAvatar } from "@/components/person-avatar";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/lifecycle/stage/kpi-cards";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import {
  EXPAND_ACCOUNTS_BANNER,
  EXPAND_ACCOUNTS_KPIS,
  EXPAND_ACCOUNTS_RISK_ROWS,
  EXPAND_ACCOUNT_ROWS,
  type ExpandAccountRow,
} from "@/pages/lifecycle/stage/expand/data";

const ANNUAL_VALUE_TONE_CLASS: Record<ExpandAccountRow["annualValueTone"], string> = { teal: "text-teal", amber: "text-amber" };
const ORDERS_TONE_CLASS: Record<ExpandAccountRow["ordersPerMonthTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };
const RENEWS_TONE_CLASS: Record<ExpandAccountRow["renewsTone"], string> = { ink: "text-ink", amber: "text-amber", rose: "text-rose", neutral: "text-ink-4" };
const RISK_TONE_CLASS: Record<"rose" | "amber", string> = { rose: "text-rose", amber: "text-amber" };

const COLUMNS: Column<ExpandAccountRow>[] = [
  { key: "account", header: "Account", render: (row) => <span className="font-semibold text-ink-2">{row.account}</span> },
  { key: "seats", header: "Seats", align: "right", render: (row) => <span className="font-mono text-ink">{row.seats}</span> },
  { key: "annualValue", header: "Annual value", align: "right", render: (row) => <span className={ANNUAL_VALUE_TONE_CLASS[row.annualValueTone]}>{row.annualValue}</span> },
  { key: "ordersPerMonth", header: "Orders / mo", align: "right", render: (row) => <span className={ORDERS_TONE_CLASS[row.ordersPerMonthTone]}>{row.ordersPerMonth}</span> },
  { key: "renews", header: "Renews", align: "right", render: (row) => <span className={RENEWS_TONE_CLASS[row.renewsTone]}>{row.renews}</span> },
  { key: "health", header: "Health", align: "right", render: (row) => <Chip tone={row.healthTone}>{row.health}</Chip> },
  {
    key: "owner",
    header: "Owner",
    render: (row) =>
      row.owner ? (
        <span className="flex items-center gap-2 whitespace-nowrap text-ink-2">
          <PersonAvatar kind="human" initials={row.owner.initials} size="sm" style={{ backgroundColor: row.owner.color }} />
          {row.owner.name}
        </span>
      ) : row.noOwner ? (
        <Chip tone="amber">No owner</Chip>
      ) : null,
  },
];

/** EX06 — Expand's unique Accounts tab, the same product read in "accounts mode" instead of consumer mode. */
const ExpandAccountsTab = () => {
  return (
    <div className="space-y-8">
      <span className="inline-flex rounded-chip border border-ultra-border bg-ultra-bg px-3 py-1.5 font-mono text-[9.5px] font-semibold text-ultra">
        {EXPAND_ACCOUNTS_BANNER}
      </span>

      <KpiCards items={EXPAND_ACCOUNTS_KPIS} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The whole business book, on one screen</p>
        <DataTable columns={COLUMNS} rows={EXPAND_ACCOUNT_ROWS} />
      </section>

      <Callout tone="ultra" title="The same product, read a completely different way">
        In consumer mode this stage is 1.10M people and a 1.4× multiple. In accounts mode it is 1,204 named
        businesses, each with seats, a renewal date and a person. Nothing about the data changed — only the unit
        that a question is asked in. Switching modes never re-computes a number, it re-frames one.
      </Callout>

      <section className="space-y-1">
        <p className={`pb-2 ${EYEBROW_CLASS}`}>Why 312 accounts are at risk, and what it has to do with the rest of the lifecycle</p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {EXPAND_ACCOUNTS_RISK_ROWS.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11.5px] text-ink-2">{row.label}</span>
              <span className={`font-mono text-[11px] ${RISK_TONE_CLASS[row.tone]}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExpandAccountsTab;
