import { Link } from "react-router-dom";

import { PersonAvatar } from "@/components/person-avatar";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { PRICE_PLAN_DECISION_CARDS, PRICE_PLAN_DETAILS, PRICE_PLAN_ROWS, type PlanRow } from "@/pages/everyday/lifecycle/stage/price/data";

const PRICE_TONE_CLASS: Record<PlanRow["priceTone"], string> = { ink: "text-ink", amber: "text-amber", rose: "text-rose", neutral: "text-ink-4" };
const REVENUE_TONE_CLASS: Record<PlanRow["revenueTone"], string> = { teal: "text-teal", amber: "text-amber", ink: "text-ink" };
const ORDERS_TONE_CLASS: Record<PlanRow["ordersTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose", ink: "text-ink" };

const CARD_FOOTNOTE_CLASS: Record<"teal" | "amber" | "rose", string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose" };

const COLUMNS: Column<PlanRow>[] = [
  {
    key: "plan",
    header: "Plan",
    render: (row) =>
      PRICE_PLAN_DETAILS[row.id] ? (
        <Link to={`/lifecycle/price/plans/${row.id}`} className="font-semibold text-ultra hover:underline">
          {row.plan}
        </Link>
      ) : (
        <span className="font-semibold text-ink-2">{row.plan}</span>
      ),
  },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.customers}</span> },
  { key: "price", header: "Price", align: "right", render: (row) => <span className={`font-mono ${PRICE_TONE_CLASS[row.priceTone]}`}>{row.price}</span> },
  { key: "revenuePerCustomer", header: "Revenue / customer", align: "right", render: (row) => <span className={REVENUE_TONE_CLASS[row.revenueTone]}>{row.revenuePerCustomer}</span> },
  { key: "ordersPerMonth", header: "Orders / month", align: "right", render: (row) => <span className={ORDERS_TONE_CLASS[row.ordersTone]}>{row.ordersPerMonth}</span> },
  { key: "margin", header: "Margin", align: "right", render: () => <span className="font-mono text-ink-4">Unavailable</span> },
  { key: "state", header: "State", align: "right", render: (row) => <Chip tone={row.stateTone}>{row.state}</Chip> },
];

/** PR03 — Price's Plans tab, and the list side of the plans/:id drilldown (PR04). */
const PricePlansTab = () => {
  return (
    <div className="space-y-8">
      <DataTable columns={COLUMNS} rows={PRICE_PLAN_ROWS} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Two plans that need a decision, and one that does not</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PRICE_PLAN_DECISION_CARDS.map((card) => (
            <div key={card.id} className="rounded-card border border-line bg-paper">
              <div className="flex h-full flex-col gap-2.5 p-4">
                <div className="flex items-center gap-2">
                  {card.agentTag && <PersonAvatar kind="agent" initials={card.agentTag} size="sm" />}
                  <p className="font-mono text-[9px] font-medium text-ink-4">{card.meta}</p>
                </div>
                <h3 className="text-[13px] font-semibold text-ink">{card.title}</h3>
                <p className="flex-1 text-[10.5px] leading-relaxed text-ink-3">{card.body}</p>
                <p className={`border-t border-dashed border-line pt-2.5 font-mono text-[10px] font-semibold ${CARD_FOOTNOTE_CLASS[card.tone]}`}>
                  {card.footnote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PricePlansTab;
