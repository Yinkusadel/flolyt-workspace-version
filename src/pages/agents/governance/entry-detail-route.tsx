import { Link, useParams } from "react-router-dom";

import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { GV04_ENTRY, GV04_ROWS, GV_TONE_CLASS } from "@/pages/agents/governance/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function Entry411904() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Governance", to: "/governance" }, { label: "Entry 411,904" }]}
        title="Entry 411,904"
        subtitle="Four lines · the tool signature is the one that makes the claim checkable"
      />

      <div className="relative overflow-hidden rounded-card border border-rose-border bg-white p-5">
        <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">{GV04_ENTRY.meta}</p>
        <div className="mt-3 space-y-1.5">
          {GV04_ENTRY.lines.map((line) => (
            <p key={line} className="font-mono text-[10.5px] text-ink-2">
              {line}
            </p>
          ))}
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Why each line is there</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Line</th>
                <th className={HEAD_CLASS}>What it proves</th>
                <th className={`${HEAD_CLASS} text-right`}>Could it be forged?</th>
              </tr>
            </thead>
            <tbody>
              {GV04_ROWS.map((row) => (
                <tr key={row.line} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.line}</td>
                  <td className="px-4 py-3 text-ink-3">{row.proves}</td>
                  <td className={`px-4 py-3 text-right ${GV_TONE_CLASS[row.forgedTone]}`}>{row.forged}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The tool signature is the line that does the work">
        `play.execute` is a tool that exists only for human identities. Involuntary Churn proposed this play at
        07:58 and does not have that tool in its list — not disabled, not permission-gated, absent. An auditor
        checking whether an agent could have sent this does not need to trust a policy; they check which identity
        called which tool.
      </Callout>

      <Callout tone="amber" title="The log does not contain what the message said, and that is deliberate">
        It records that 4,410 people received a payment retry, approved by Ravi, at a time. The copy lives with
        the campaign, where it can be read by anybody in the workspace. Duplicating it here would make the log a
        second, slowly diverging copy of every message this company has ever sent.
      </Callout>

      <p className="text-[11px] text-ink-4">
        <Link to="/governance/capability" className="font-semibold text-ultra hover:underline">
          See the proposal
        </Link>
      </p>
    </div>
  );
}

function EntryNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Entry not found</p>
      <Link to="/governance" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to Governance
      </Link>
    </div>
  );
}

/** GV04 (`411904`) — the section's only built log-entry detail. */
const EntryDetailRoute = () => {
  const { id } = useParams();

  if (id === "411904") return <Entry411904 />;
  return <EntryNotFound />;
};

export default EntryDetailRoute;
