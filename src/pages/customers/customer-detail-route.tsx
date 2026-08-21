import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { ContactThisPersonModal } from "@/pages/customers/customer-health/modals/contact-this-person-modal";
import { HL07_CANNOT_ROWS, HL07_SIGNAL_ROWS, HL_CHIP_TONE, HL_TONE_CLASS } from "@/pages/customers/customer-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function CustomerFourOneOneEightTwoZeroSeven() {
  const navigate = useNavigate();
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="rounded-card border border-line bg-paper-2 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[16px] font-semibold text-ink">Customer 4,118,207</h1>
            <p className="mt-1 text-[11px] text-ink-3">Lagos · signed up 11 February · 6 orders · last order 2 March · in 3 cohorts</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">No health score</p>
            <p className="mt-1 text-[10px] text-ink-4">five signals, shown separately</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 border-t border-dashed border-line pt-4">
          <Button type="button" onClick={() => setContactOpen(true)}>
            Contact this person
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/inbox/replies")}>
            See their reply
          </Button>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What is known about this person</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Signal</th>
                <th className={`${HEAD_CLASS} text-right`}>Reading</th>
                <th className={HEAD_CLASS}>What it means here</th>
                <th className={`${HEAD_CLASS} text-right`}>Claim type</th>
                <th className={`${HEAD_CLASS} text-right`}>Cohort context</th>
              </tr>
            </thead>
            <tbody>
              {HL07_SIGNAL_ROWS.map((row) => (
                <tr key={row.signal} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.signal}</td>
                  <td className={`px-4 py-3 text-right font-mono ${HL_TONE_CLASS[row.readingTone]}`}>{row.reading}</td>
                  <td className="px-4 py-3 text-ink-2">{row.meaning}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={HL_CHIP_TONE[row.claimTypeTone]}>{row.claimType}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.cohortContext}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What you cannot do from this screen</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Action</th>
                <th className={`${HEAD_CLASS} text-right`}>Offered?</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={HEAD_CLASS}>Where it belongs</th>
              </tr>
            </thead>
            <tbody>
              {HL07_CANNOT_ROWS.map((row) => (
                <tr key={row.action} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.action}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={HL_CHIP_TONE[row.offeredTone]}>{row.offered}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className="px-4 py-3 text-ink-4">{row.where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="This screen exists to be read and almost nothing can be done from it">
        Everything on it is true about one person and none of it justifies acting on one person. The one exception
        is the last row: they wrote in, and a reply to somebody who wrote in is a conversation rather than a
        campaign. Everything else routes through a cohort, which is the difference between a workspace that reasons
        about groups and a CRM.
      </Callout>

      <ContactThisPersonModal open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  );
}

function CustomerNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Customer not found</p>
      <Link to="/customer-health" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to customer health
      </Link>
    </div>
  );
}

/** HL07 — /customers/:id, a cross-section customer profile (not itself a sidebar section). Only `4118207` has real content, same "one reference row" pattern as every prior section's `:id`. Reached from Customer health's cohort/threshold tables. */
const CustomerDetailRoute = () => {
  const { id } = useParams();

  if (id === "4118207") return <CustomerFourOneOneEightTwoZeroSeven />;
  return <CustomerNotFound />;
};

export default CustomerDetailRoute;
