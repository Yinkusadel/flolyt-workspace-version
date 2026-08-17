import { Link } from "react-router-dom";

import { WideBarRow } from "@/pages/lifecycle/stage/bar";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import {
  ACQUIRE_CHANNEL_ROWS,
  ACQUIRE_CHANNEL_SPEND_ROWS,
  ACQUIRE_CHANNEL_DETAILS,
  type ChannelRow,
} from "@/pages/lifecycle/stage/acquire/data";

const TONE_CLASS: Record<"teal" | "amber" | "rose" | "ink" | "neutral", string> = {
  teal: "text-teal",
  amber: "text-amber",
  rose: "text-rose",
  ink: "text-ink",
  neutral: "text-ink-4",
};

const VERDICT_CHIP_TONE: Record<ChannelRow["verdictTone"], "teal" | "amber" | "rose" | "neutral"> = {
  teal: "teal",
  amber: "amber",
  rose: "rose",
  neutral: "neutral",
};

const COLUMNS: Column<ChannelRow>[] = [
  {
    key: "channel",
    header: "Channel",
    render: (row) =>
      ACQUIRE_CHANNEL_DETAILS[row.id] ? (
        <Link to={`/lifecycle/acquire/channels/${row.id}`} className="font-semibold text-ultra hover:underline">
          {row.channel}
        </Link>
      ) : (
        <span className="font-semibold text-ink-2">{row.channel}</span>
      ),
  },
  { key: "acquired", header: "Acquired", align: "right", render: (row) => <span className="font-mono text-ink">{row.acquired}</span> },
  { key: "spend", header: "Spend", align: "right", render: (row) => <span className={`font-mono ${TONE_CLASS[row.spendTone]}`}>{row.spend}</span> },
  { key: "cac", header: "CAC", align: "right", render: (row) => <span className={TONE_CLASS[row.cacTone]}>{row.cac}</span> },
  { key: "reach2nd", header: "Reach 2nd order", align: "right", render: (row) => <span className={TONE_CLASS[row.reach2ndTone]}>{row.reach2nd}</span> },
  { key: "valuePerCustomer", header: "Value per customer", align: "right", render: (row) => <span className={TONE_CLASS[row.valueTone]}>{row.valuePerCustomer}</span> },
  { key: "verdict", header: "Verdict", align: "right", render: (row) => <Chip tone={VERDICT_CHIP_TONE[row.verdictTone]}>{row.verdict}</Chip> },
];

/** A04 — Acquire's unique Channels tab. */
const AcquireChannelsTab = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Seven channels · CAC against what the customer is actually worth
        </p>
        <DataTable columns={COLUMNS} rows={ACQUIRE_CHANNEL_ROWS} />
      </section>

      <section className="space-y-5">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Where the money actually goes
        </p>
        <div className="space-y-5">
          {ACQUIRE_CHANNEL_SPEND_ROWS.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <Callout tone="rose" title="A quarter of the acquisition budget buys 3.5% of the customers">
        Ghana paid social costs ₦6,026 per customer to acquire people worth ₦1,140. It is the clearest loss in the
        stage and it has been running for five months. Nothing was broken — the campaign hit its signup target
        every week.
      </Callout>
    </div>
  );
};

export default AcquireChannelsTab;
