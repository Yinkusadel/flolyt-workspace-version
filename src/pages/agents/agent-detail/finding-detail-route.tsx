import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { AgentDetailKvList } from "@/pages/agents/agent-detail/kv-list";
import { AN06_KV, AN06_QUOTE, AN06_ROWS, AN_FINDING_TITLES, AN_TONE_CLASS } from "@/pages/agents/agent-detail/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function RepeatRateFinding() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Repeat & Decay", to: "/agent-detail" }, { label: AN_FINDING_TITLES["1"] }]}
        title={AN_FINDING_TITLES["1"]}
        subtitle="Causal · five inputs · three rival explanations ruled out and one that was not"
        action={
          <Button asChild type="button">
            <Link to="/rooms/8f2c">Open the room</Link>
          </Button>
        }
      />

      <div className="relative overflow-hidden rounded-card border border-ultra-border bg-ultra-bg p-5">
        <p className="text-[14px] leading-relaxed font-semibold text-ink">"{AN06_QUOTE.quote}"</p>
        <p className="mt-2.5 font-mono text-[10px] text-ultra">{AN06_QUOTE.meta}</p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What it is built from</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[780px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Input</th>
                <th className={HEAD_CLASS}>Source</th>
                <th className={`${HEAD_CLASS} text-right`}>Rows</th>
                <th className={`${HEAD_CLASS} text-right`}>Contribution</th>
              </tr>
            </thead>
            <tbody>
              {AN06_ROWS.map((row) => (
                <tr key={row.input} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.input}</td>
                  <td className="px-4 py-3 text-ink-3">{row.source}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.rows}</td>
                  <td className={`px-4 py-3 text-right ${AN_TONE_CLASS[row.contributionTone]}`}>{row.contribution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The fourth row is the reason this is a causal claim and not a strong hunch">
        Repeat & Decay wrote down what else could have caused the fall and showed why each one does not fit —
        Ramadan reached the UK too, the competitor cut was Nigeria-only, fuel would have raised basket value
        rather than lowered it. All four are kept, including the explanation it could not rule out, which is the
        same release under a different name.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What happened to it</p>
        <AgentDetailKvList rows={AN06_KV} />
      </section>
    </div>
  );
}

function FindingNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Finding not found</p>
      <Link to="/agent-detail/findings" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to Findings
      </Link>
    </div>
  );
}

/** AN06 (`1`) — the section's only built finding detail. */
const FindingDetailRoute = () => {
  const { fid } = useParams();

  if (fid === "1") return <RepeatRateFinding />;
  return <FindingNotFound />;
};

export default FindingDetailRoute;
