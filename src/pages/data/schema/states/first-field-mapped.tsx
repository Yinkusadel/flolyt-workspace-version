import { useState } from "react";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { SchemaKvList } from "@/pages/data/schema/kv-list";
import { MapAFieldModal } from "@/pages/data/schema/modals/map-a-field-modal";
import { SM02_KV, SM02_STATS, SM_KPI_TONE } from "@/pages/data/schema/data";

/** SM02 — twelve December, one field mapped. Wired but unreachable with SCHEMA_STATE's current default. */
export function FirstFieldMappedState() {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Schema</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            One field · fourteen metrics depend on it · and it needed a sentence first
          </p>
        </div>
        <Button type="button" onClick={() => setMapOpen(true)}>
          Map another
        </Button>
      </div>

      <div className="flex items-start gap-4 rounded-card border border-teal-border bg-teal-bg p-5">
        <PersonAvatar kind="human" initials="SM" team={1} />
        <div className="min-w-0">
          <h2 className="text-[14px] font-semibold text-ink">The first mapped field needed a sentence before it could be used</h2>
          <p className="mt-1.5 text-[11px] text-ink-2">
            `orders.total` is a number. Whether it includes delivery, tax and discounts is a question about this
            business, and three people gave three answers before Ravi wrote one down.
          </p>
          <p className="mt-1.5 text-[11px] font-semibold text-teal">
            Gross of tax, net of discount, delivery included. Everything computed from it inherits that sentence.
          </p>
        </div>
      </div>

      <KpiCards items={SM02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: SM_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the mapping records</p>
        <SchemaKvList rows={SM02_KV} />
      </section>

      <Callout tone="ultra" title="A schema without written meanings is a list of column names">
        Every field in this section carries a sentence somebody wrote and can be argued with. It is the same
        object that appears in business memory as a definition, and it is why the most-cited entry in this
        workspace's memory is a note about what a word means rather than a finding.
      </Callout>

      <MapAFieldModal open={mapOpen} onOpenChange={setMapOpen} />
    </div>
  );
}
