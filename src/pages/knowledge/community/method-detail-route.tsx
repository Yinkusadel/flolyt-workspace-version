import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { QuoteCard } from "@/pages/knowledge/business-memory/quote-card";
import { CommunityKvList } from "@/pages/knowledge/community/kv-list";
import { CM04_ADOPTED_KV, CM04_FIELD_ROWS, CM04_NOTE, CM04_QUOTE, CM_CHIP_TONE } from "@/pages/knowledge/community/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function LapsedWhatChangedDetail() {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Community", to: "/community" }, { label: "Tell lapsed customers what changed" }]}
        title="One shared method"
        subtitle="Adopted by 44 · no result attached to it anywhere · you ran it and the number stayed here"
        action={
          <Button type="button" onClick={() => toast.success("Opening your run")}>
            See your run
          </Button>
        }
      />

      <QuoteCard text={CM04_QUOTE.text} source={CM04_QUOTE.source} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What came with it</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[680px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Field</th>
                <th className={HEAD_CLASS}>What it says</th>
                <th className={`${HEAD_CLASS} text-right`}>Present?</th>
              </tr>
            </thead>
            <tbody>
              {CM04_FIELD_ROWS.map((row) => (
                <tr key={row.field} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.field}</td>
                  <td className="px-4 py-3 text-ink-3">{row.says}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={CM_CHIP_TONE[row.presentTone]}>{row.present}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="You cannot tell whether this worked for anybody, and that is the deal">
        {CM04_NOTE}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What happened when this workspace adopted it</p>
        <CommunityKvList rows={CM04_ADOPTED_KV} />
      </section>
    </div>
  );
}

function MethodNotFound() {
  return (
    <div className={cn("rounded-card border border-dashed border-line bg-paper p-10 text-center")}>
      <p className="text-[13px] font-semibold text-ink">Method not found</p>
      <Link to="/community" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        Back to community
      </Link>
    </div>
  );
}

/** CM04 (`lapsed-what-changed`) — the index's only built `:id` reference row, same "one/two reference rows" pattern as every prior section. */
const MethodDetailRoute = () => {
  const { id } = useParams();

  if (id === "lapsed-what-changed") return <LapsedWhatChangedDetail />;
  return <MethodNotFound />;
};

export default MethodDetailRoute;
