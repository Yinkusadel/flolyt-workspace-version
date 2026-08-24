import { Link } from "react-router-dom";

import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { TeammatesKvList } from "@/pages/agents/ai-teammates/kv-list";
import { TM08_KV, TM08_ROWS } from "@/pages/agents/ai-teammates/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** TM08 — /ai-teammates/boundary. */
const BoundaryRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "AI teammates", to: "/ai-teammates" }, { label: "The boundary" }]}
        title="What they may never do"
        subtitle="Nine things no agent can do, on any plan, with no override anywhere"
        action={
          <Link to="/audit-log" className="text-[11.5px] font-semibold text-ultra hover:underline">
            See the audit log
          </Link>
        }
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>An agent may never</th>
              <th className={HEAD_CLASS}>What happens instead</th>
              <th className={`${HEAD_CLASS} text-right`}>Enforced where</th>
              <th className={`${HEAD_CLASS} text-right`}>Any way around it?</th>
            </tr>
          </thead>
          <tbody>
            {TM08_ROWS.map((row) => (
              <tr key={row.may} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{row.may}</td>
                <td className="px-4 py-3 text-ink-3">{row.instead}</td>
                <td className="px-4 py-3 text-right text-ink-4">{row.where}</td>
                <td className="px-4 py-3 text-right">
                  <Chip tone="rose">none</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="ultra" title="Nine rules, no permission level, no plan, no admin override">
        There is no enterprise tier in which an agent sends. There is no setting an administrator can find. The
        right-hand column is identical on every row because these are not policies applied to a capable system —
        the capability was never built, and the audit log in Governance is how anybody can check that claim rather
        than take it.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What they may do, which is more than it sounds</p>
        <TeammatesKvList rows={TM08_KV} />
      </section>
    </div>
  );
};

export default BoundaryRoute;
