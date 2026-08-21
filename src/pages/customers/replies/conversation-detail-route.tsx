import { Link, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { RepliesKvList } from "@/pages/customers/replies/kv-list";
import { RP04_KV_ROWS, RP04_THREAD_ROWS, RP_TONE_CLASS } from "@/pages/customers/replies/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function Customer4118207Detail() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Replies", to: "/replies" }, { label: "Customer 4,118,207" }]}
        title="Customer 4,118,207"
        subtitle="Three messages, one answer, 164 days · every step was reasonable and they are gone"
        action={<Button type="button" onClick={() => navigate("/replies/4118207/answer")}>Answer them</Button>}
      />

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="rounded-card border border-line bg-paper-2 p-4 sm:w-[62%]">
          <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-ink-4 uppercase">7 March · first message</p>
          <p className="mt-3 text-[12.5px] leading-relaxed text-ink">
            The delivery charge now shows up at the end. I have closed the app three times this week. Please put
            it back.
          </p>
        </div>
        <div className="rounded-card border border-rose-border bg-rose-bg p-4 sm:flex-1">
          <p className="font-mono text-[8.5px] font-medium tracking-[0.9px] text-rose uppercase">Answered</p>
          <p className="mt-2 text-[20px] font-semibold text-ink">Never</p>
          <p className="mt-1.5 font-mono text-[10px] font-semibold text-rose">164 days · three messages</p>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The whole thread</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>When</th>
                <th className={HEAD_CLASS}>What they said</th>
                <th className={`${HEAD_CLASS} text-right`}>Route</th>
                <th className={HEAD_CLASS}>What happened</th>
              </tr>
            </thead>
            <tbody>
              {RP04_THREAD_ROWS.map((row) => (
                <tr key={row.when} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-ink-4 whitespace-nowrap">{row.when}</td>
                  <td className="px-4 py-3 text-ink-3">{row.whatTheySaid}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.route}</td>
                  <td className={`px-4 py-3 ${RP_TONE_CLASS[row.whatHappenedTone]}`}>{row.whatHappened}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="They told the company the answer three times and are now a row in a ₦437M cohort">
        The first message was classified correctly as a delivery complaint, which is what it looked like. The
        second was answered politely. The third asked whether anybody was reading, and a draft was written for it
        in June that nobody sent. Every individual step was reasonable and the person is gone.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What can be done from here</p>
        <RepliesKvList rows={RP04_KV_ROWS} />
      </section>
    </div>
  );
}

function ConversationNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Conversation not found</p>
      <Link to="/replies" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to replies
      </Link>
    </div>
  );
}

/** RP04 (`4118207`) — the only built `:id` reference row, same "one/two reference rows" pattern as every prior section. */
const ConversationDetailRoute = () => {
  const { id } = useParams();

  if (id === "4118207") return <Customer4118207Detail />;
  return <ConversationNotFound />;
};

export default ConversationDetailRoute;
