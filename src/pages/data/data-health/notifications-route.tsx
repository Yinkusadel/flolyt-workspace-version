import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { DH13_EVENT_ROWS, DH_TONE_CLASS } from "@/pages/data/data-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** DH13 — /data-health/notifications, "Who is told". */
const NotificationsRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Data health", to: "/data-health" }, { label: "Who is told" }]}
        title="Who is told"
        subtitle="Six events · one pages somebody, four go in the digest, one is a label instead"
      />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[880px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Event</th>
              <th className={HEAD_CLASS}>Told immediately</th>
              <th className={HEAD_CLASS}>Told in the digest</th>
              <th className={HEAD_CLASS}>Told never</th>
              <th className={HEAD_CLASS}>Why</th>
            </tr>
          </thead>
          <tbody>
            {DH13_EVENT_ROWS.map((row) => (
              <tr key={row.event} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold text-ink">{row.event}</td>
                <td className={`px-4 py-3 ${DH_TONE_CLASS[row.immediatelyTone]}`}>{row.immediately}</td>
                <td className={`px-4 py-3 ${DH_TONE_CLASS[row.digestTone]}`}>{row.digest}</td>
                <td className={`px-4 py-3 ${DH_TONE_CLASS[row.neverTone]}`}>{row.never}</td>
                <td className="px-4 py-3 text-ink-4">{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="ultra" title="Only one event pages a person immediately and the digest carries the rest">
        A source stopping is the one thing where a delay costs something real — every figure that depends on it is
        wrong or missing until somebody knows. Everything else appears at six in the morning with the rest of the
        day's work, because a workspace that interrupts people for a late tickets feed is one where nobody reads
        the interruption that matters.
      </Callout>

      <Callout tone="teal" title="The last row is a notification that is deliberately not sent">
        When a backfill completes, the figure appears with a label saying it was backfilled and nobody is told. The
        label is on the number, where somebody reading it will see it, rather than in a message they received
        while doing something else three days earlier.
      </Callout>
    </div>
  );
};

export default NotificationsRoute;
