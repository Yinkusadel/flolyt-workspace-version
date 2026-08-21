import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { CommunityTabs } from "@/pages/knowledge/community/tabs";
import { CommunityKvList } from "@/pages/knowledge/community/kv-list";
import { CM07_LEFT_ROWS, CM07_NEVER_KV, CM07_NOTE, CM07_PEOPLE_BAR, CM_TONE_CLASS } from "@/pages/knowledge/community/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CM07 — /community/outbound, "What leaves". */
const OutboundRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Community</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Two things in seven months · both approved word by word · nothing leaves automatically
        </p>
      </div>

      <CommunityTabs active="What leaves" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Everything this workspace has ever sent to the community</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>What</th>
                <th className={`${HEAD_CLASS} text-right`}>When</th>
                <th className={`${HEAD_CLASS} text-right`}>Approved by</th>
                <th className={HEAD_CLASS}>What was stripped</th>
                <th className={HEAD_CLASS}>Visible as</th>
              </tr>
            </thead>
            <tbody>
              {CM07_LEFT_ROWS.map((row) => (
                <tr key={row.what} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.what}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.when}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.approvedBy}</td>
                  <td className="px-4 py-3 text-ink-3">{row.stripped}</td>
                  <td className="px-4 py-3 text-ink-4">{row.visibleAs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What has never left, and cannot</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {CM07_PEOPLE_BAR.map((seg) => (
            <div key={seg.label} className="rounded-card border border-line bg-paper p-4">
              <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{seg.label}</p>
              <p className={`mt-2.5 text-[19px] font-semibold ${CM_TONE_CLASS[seg.tone]}`}>
                {seg.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Callout tone="teal" title="Two things have left in seven months and both were approved by a person, line by line">
        {CM07_NOTE}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What cannot leave, under any setting</p>
        <CommunityKvList rows={CM07_NEVER_KV} />
      </section>
    </div>
  );
};

export default OutboundRoute;
