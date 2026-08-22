import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { MK12_ROWS, MK_TONE_CLASS } from "@/pages/agents/marketplace/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** MK12 — /marketplace/refused. */
const RefusedRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Marketplace", to: "/marketplace" }, { label: "What this is not" }]}
        title="What this is not"
        subtitle="Six refused features, asked for 22 times · all of them somebody else's outcome"
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Feature</th>
              <th className={`${HEAD_CLASS} text-right`}>Asked for</th>
              <th className={HEAD_CLASS}>Why it is refused</th>
              <th className={`${HEAD_CLASS} text-right`}>What answers it instead</th>
            </tr>
          </thead>
          <tbody>
            {MK12_ROWS.map((row) => (
              <tr key={row.feature} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{row.feature}</td>
                <td className={`px-4 py-3 text-right ${MK_TONE_CLASS[row.askedForTone]}`}>{row.askedFor}</td>
                <td className="px-4 py-3 text-ink-3">{row.why}</td>
                <td className="px-4 py-3 text-right text-ultra">{row.insteadAnswer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="rose" title="Twenty-two requests for the same underlying thing, which is somebody else's outcome">
        Every refused feature on this list is a way of asking whether an agent works before running it, and the
        honest answer is that nobody can know that about your customers. What the marketplace can do is tell you
        what it reads, what it may claim, whether it would run here at all, and how many companies kept it.
      </Callout>

      <Callout tone="ultra" title="The install count is the compromise and it is a weak one on purpose">
        Sixty-one companies installed payment retry timing and did not remove it. That is real information and it
        is close to the weakest form of evidence this product accepts anywhere. It is shown because the
        alternative is a listing with no signal at all, and it is labelled as a count of experience on every
        screen it appears.
      </Callout>
    </div>
  );
};

export default RefusedRoute;
