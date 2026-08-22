import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { AgentHeader } from "@/pages/agents/agent-detail/agent-header";
import { AgentDetailKvList } from "@/pages/agents/agent-detail/kv-list";
import { AN12_KV, AN12_REFUSED_ROWS } from "@/pages/agents/agent-detail/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AN12 — /agent-detail/limits, "What it will not do". Keeps the agent header banner (no tab bar), matching an.py's own head()-only, no-subtabs() shape. */
const LimitsRoute = () => {
  usePageBreadcrumb([{ label: "Repeat & Decay", to: "/agent-detail" }, { label: "What it will not do" }]);

  return (
    <div className="space-y-8">
      <AgentHeader subtitle="Nine things it cannot do, and four it has actually refused" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>It has refused</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>It has refused</th>
                <th className={`${HEAD_CLASS} text-right`}>When</th>
                <th className={HEAD_CLASS}>What it said instead</th>
                <th className={`${HEAD_CLASS} text-right`}>Who asked</th>
              </tr>
            </thead>
            <tbody>
              {AN12_REFUSED_ROWS.map((row) => (
                <tr key={row.refused} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.refused}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 text-ink-3">{row.said}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.askedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="Two of these refusals came from people asking it directly, and it said no in the thread">
        Ravi asked for a margin estimate in February and Tunde asked for a churn ranking in April. Both are
        reasonable requests, both would have produced a plausible number, and both were declined with a sentence
        explaining what was missing. Neither person had to be told by a policy screen; the agent said it where
        they asked.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The nine it structurally cannot do</p>
        <AgentDetailKvList rows={AN12_KV} />
      </section>
    </div>
  );
};

export default LimitsRoute;
