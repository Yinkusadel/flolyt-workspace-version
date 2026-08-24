import { Link } from "react-router-dom";

import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { MarketplaceTabs } from "@/pages/agents/marketplace/tabs";
import { MK05_ROWS, MK_CHIP_TONE, MK_TONE_CLASS } from "@/pages/agents/marketplace/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** MK05 — /marketplace/what-arrives. Uses Payment retry timing as its worked example — see data.ts's header note on why this is a flat generic tab rather than a true /:id/access route. */
const WhatArrivesRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">What it would read</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Two sources, six fields, and every field it cannot reach listed beside them</p>
      </div>

      <MarketplaceTabs active="What arrives" />

      <p className="text-[11px] text-ink-4">
        Worked example: <Link to="/marketplace/retry-timing" className="font-semibold text-ultra hover:underline">Payment retry timing</Link>, before installing.
      </p>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Before installing · exactly what it would be able to reach</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Source</th>
                <th className={`${HEAD_CLASS} text-right`}>Rows</th>
                <th className={HEAD_CLASS}>Fields it would read</th>
                <th className={HEAD_CLASS}>Fields it would not</th>
                <th className={`${HEAD_CLASS} text-right`}>Access</th>
              </tr>
            </thead>
            <tbody>
              {MK05_ROWS.map((row) => (
                <tr key={row.source} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold text-ink">{row.source}</td>
                  <td className={`px-4 py-3 text-right font-mono ${MK_TONE_CLASS[row.rowsTone]}`}>{row.rows}</td>
                  <td className="px-4 py-3 text-ink-2">{row.fieldsRead}</td>
                  <td className="px-4 py-3 text-ink-4">{row.fieldsNot}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={MK_CHIP_TONE[row.accessTone]}>{row.access}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="A marketplace agent asks for fields, not tables, and the difference is the whole screen">
        It needs a timezone and a payment outcome. It does not need a name, an email or a card token, and it
        cannot reach them — the grant is per field, shown before installation, and unchanged afterwards without a
        new approval. Governance holds the same list for every agent running here, including this one after it is
        installed.
      </Callout>

      <Callout tone="teal" title="This screen is shown before the install button, not after">
        Most people install first and audit later, which is how a third-party agent ends up with read access to a
        customer table nobody meant to expose. The fields it would read are the second thing on the listing and
        the last thing before the re-authentication, and both times they are enumerated rather than summarised.
      </Callout>
    </div>
  );
};

export default WhatArrivesRoute;
