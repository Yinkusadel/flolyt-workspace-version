import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { IdentityTabs } from "@/pages/data/identity/tabs";
import { ID07_STATE_ROWS, ID_TONE_CLASS } from "@/pages/data/identity/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ID07 — /identity/consent. */
const ConsentRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Identity</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Five states · unknown is treated as opted out · opting out covers being studied
        </p>
      </div>

      <IdentityTabs active="Consent" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What each customer has agreed to, per market</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>State</th>
                <th className={HEAD_RIGHT_CLASS}>People</th>
                <th className={HEAD_CLASS}>What it permits</th>
                <th className={HEAD_CLASS}>Set by</th>
                <th className={HEAD_CLASS}>Where enforced</th>
              </tr>
            </thead>
            <tbody>
              {ID07_STATE_ROWS.map((row) => (
                <tr key={row.state} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.state}</td>
                  <td className={`px-4 py-3 text-right font-mono ${ID_TONE_CLASS[row.peopleTone]}`}>{row.people}</td>
                  <td className="px-4 py-3 text-ink-2">{row.permits}</td>
                  <td className="px-4 py-3 text-ink-4">{row.setBy}</td>
                  <td className="px-4 py-3 text-teal">{row.enforced}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="teal" title="Unknown consent is treated as opted out, and the count is zero because of it">
        Any record arriving without a consent state is unreachable until one exists. That is stricter than most
        jurisdictions require and it means the reachable figure is never optimistic — which matters because
        reachable is the denominator for every audience and holdout in the product.
      </Callout>

      <Callout tone="ultra" title="Opting out removes somebody from experiments as well as from campaigns">
        Consent to be contacted and consent to be studied are treated as the same thing here. It costs the
        workspace 6,100 people in every holdout and it is the only defensible reading — being held back from
        something is a decision made about a person, whether or not they ever hear about it.
      </Callout>
    </div>
  );
};

export default ConsentRoute;
