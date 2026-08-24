import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { DataSourcesKvList } from "@/pages/data/data-sources/kv-list";
import { DS16_PERSONAL_FIELD_KV, DS16_QUESTION_ROWS, DS_TONE_CLASS } from "@/pages/data/data-sources/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DS16 — /data-sources/what-we-read, outside the tab bar (linked from DS01/DS03's empty/settings states). */
const WhatWeReadRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Data sources", to: "/data-sources" }, { label: "What Flolyt reads" }]}
        title="What Flolyt reads"
        subtitle="Seven questions · six answered by a scope you can look at, one by a policy elsewhere"
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Question</th>
              <th className={HEAD_CLASS}>Answer</th>
              <th className={HEAD_CLASS}>Where it is enforced</th>
              <th className={HEAD_CLASS}>Checkable</th>
            </tr>
          </thead>
          <tbody>
            {DS16_QUESTION_ROWS.map((row) => (
              <tr key={row.question} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{row.question}</td>
                <td className="px-4 py-3 text-ink-2">{row.answer}</td>
                <td className="px-4 py-3 text-ink-4">{row.enforcedWhere}</td>
                <td className={`px-4 py-3 ${DS_TONE_CLASS[row.checkableTone]}`}>{row.checkable}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="ultra" title="Six of seven questions are answered by a scope somebody can look at rather than by a policy">
        The credential is read-only, the fields are enumerated, the tool list has no write in it and Community has
        a wall. Each of those is a thing on a screen in this product. The seventh question is about Flolyt as a
        company rather than about the software, and it is answered in Settings rather than pretended to be answered
        here.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The one personal field, in full</p>
        <DataSourcesKvList rows={DS16_PERSONAL_FIELD_KV} />
      </section>
    </div>
  );
};

export default WhatWeReadRoute;
