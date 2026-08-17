import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/lifecycle/stage/kpi-cards";
import { ReForecastTheBookModal } from "@/pages/lifecycle/stage/modals/re-forecast-the-book-modal";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import {
  RENEW_BOOK_CLOSING,
  RENEW_BOOK_KPIS,
  RENEW_BOOK_ROWS,
  RENEW_BOOK_WARNING,
  RENEW_REFORECAST_PRESET,
  type RenewBookRow,
} from "@/pages/lifecycle/stage/renew/data";

const PROJECTED_RATE_TONE_CLASS: Record<RenewBookRow["projectedRateTone"], string> = { amber: "text-amber", rose: "text-rose" };
const CONFIDENCE_TONE_CLASS: Record<RenewBookRow["confidenceTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose", neutral: "text-ink-4" };
const BASIS_TONE_CLASS: Record<RenewBookRow["basisTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose", neutral: "text-ink-4" };

const COLUMNS: Column<RenewBookRow>[] = [
  {
    key: "renewing",
    header: "Renewing",
    render: (row) =>
      row.detailHref ? (
        <Link to={row.detailHref} className="font-semibold text-ultra hover:underline">
          {row.renewing}
        </Link>
      ) : (
        <span className="font-semibold text-ink-2">{row.renewing}</span>
      ),
  },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.customers}</span> },
  { key: "value", header: "Value", align: "right", render: (row) => <span className="font-mono text-ink">{row.value}</span> },
  { key: "projectedRate", header: "Projected rate", align: "right", render: (row) => <span className={row.projectedRate === "Unavailable" ? "font-mono text-ink-4" : PROJECTED_RATE_TONE_CLASS[row.projectedRateTone]}>{row.projectedRate}</span> },
  { key: "confidence", header: "Confidence", align: "right", render: (row) => <span className={CONFIDENCE_TONE_CLASS[row.confidenceTone]}>{row.confidence}</span> },
  { key: "basis", header: "Basis", align: "right", render: (row) => <span className={BASIS_TONE_CLASS[row.basisTone]}>{row.basis}</span> },
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

/** RN03 — Renew's unique Renewal book tab (route path "book" per its own footer). */
const RenewRenewalBookTab = () => {
  const [reforecastOpen, setReforecastOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={() => setReforecastOpen(true)}>
          Chase the re-forecast
        </Button>
      </div>

      <KpiCards items={RENEW_BOOK_KPIS} />

      <Callout tone="rose" title={RENEW_BOOK_WARNING.title}>
        {RENEW_BOOK_WARNING.body}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What renews, when</p>
        <DataTable columns={COLUMNS} rows={RENEW_BOOK_ROWS} />
      </section>

      <Callout tone="rose" title={RENEW_BOOK_CLOSING.title}>
        {RENEW_BOOK_CLOSING.body}
      </Callout>

      <ReForecastTheBookModal preset={RENEW_REFORECAST_PRESET} open={reforecastOpen} onOpenChange={setReforecastOpen} />
    </div>
  );
};

export default RenewRenewalBookTab;
