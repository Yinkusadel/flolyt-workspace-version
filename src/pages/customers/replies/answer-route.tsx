import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { RP08_CHECK_ROWS, RP08_DRAFT, RP08_USED_ROWS } from "@/pages/customers/replies/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function AnswerCustomer4118207() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Replies", to: "/replies" }, { label: "Customer 4,118,207", to: "/replies/4118207" }, { label: "Answer" }]}
        title="Answer this reply"
        subtitle="Drafted by an agent from three messages and the release calendar · five checks, three blocking"
        action={
          <Button
            type="button"
            onClick={() => {
              toast.success("Sent · your name is on it");
              navigate("/replies");
            }}
          >
            Send it
          </Button>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="rounded-card border border-line bg-white p-4 sm:w-[56%]">
          <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{RP08_DRAFT.meta}</p>
          <p className="mt-3 text-[11px] leading-relaxed text-ink-2">{RP08_DRAFT.body}</p>
        </div>
        <div className="rounded-card border border-line bg-paper-2 p-4 sm:flex-1">
          <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What the draft used</p>
          <div className="mt-3 space-y-2.5">
            {RP08_USED_ROWS.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-3">
                <span className="text-[10px] font-semibold text-ink-2">{row.label}</span>
                <span className="text-right font-mono text-[9.5px] text-ink-4">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Checks that run before this can be sent</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Check</th>
                <th className={`${HEAD_CLASS} text-right`}>Result</th>
                <th className={HEAD_CLASS}>What it found</th>
                <th className={`${HEAD_CLASS} text-right`}>Blocking?</th>
              </tr>
            </thead>
            <tbody>
              {RP08_CHECK_ROWS.map((row) => (
                <tr key={row.check} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.check}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.resultTone === "ok" ? "teal" : "amber"}>{row.result}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.whatItFound}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={row.blocking ? "rose" : "neutral"}>{row.blocking ? "yes" : "no"}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The draft says the company was wrong and cannot promise a fix, and both of those are deliberate">
        An agent wrote it from the thread, the order history and the release calendar. It does not offer a
        discount, does not say the fee is moving back, and does not apologise for something that has not been
        decided. Whoever sends it can rewrite every word — and it will be their name on it, not the agent's.
      </Callout>
    </div>
  );
}

function AnswerNotFound() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
      <p className="text-[13px] font-semibold text-ink">Conversation not found</p>
      <Link to="/replies" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to replies
      </Link>
    </div>
  );
}

/** RP08 (`4118207/answer`) — the only built `:id/answer` reference row. */
const ReplyAnswerRoute = () => {
  const { id } = useParams();

  if (id === "4118207") return <AnswerCustomer4118207 />;
  return <AnswerNotFound />;
};

export default ReplyAnswerRoute;
