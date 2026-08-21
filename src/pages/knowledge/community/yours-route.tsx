import { useState } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Chip, CHIP_INTERACTIVE_CLASS } from "@/pages/everyday/lifecycle/stage/chip";
import { CommunityTabs } from "@/pages/knowledge/community/tabs";
import { ReportBackModal } from "@/pages/knowledge/community/modals/report-back-modal";
import { CM_TONE_CLASS, YOUR_METHOD_ROWS, type YourMethodRow } from "@/pages/knowledge/community/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

function ReportedBackCell({ row, onReport }: { row: YourMethodRow; onReport: () => void }) {
  if (row.rowAction === "report") {
    return (
      <button type="button" onClick={onReport}>
        <Chip tone="neutral" className={CHIP_INTERACTIVE_CLASS}>
          {row.reportedBack}
        </Chip>
      </button>
    );
  }
  return <Chip tone="neutral">{row.reportedBack}</Chip>;
}

/** "Yours" tab — /community/yours. Not its own numbered CM frame; assembled from CM12's own table (see data.ts's fidelity note on the adopted/not-adopted discrepancy with CM03). */
const YoursRoute = () => {
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Community</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Six adopted · one shared</p>
      </div>

      <CommunityTabs active="Yours" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Methods you have adopted, and what you have run against them</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Method</th>
                <th className={`${HEAD_CLASS} text-right`}>Adopted</th>
                <th className={`${HEAD_CLASS} text-right`}>Runs here</th>
                <th className={`${HEAD_CLASS} text-right`}>Result here</th>
                <th className={`${HEAD_CLASS} text-right`}>Reported back</th>
              </tr>
            </thead>
            <tbody>
              {YOUR_METHOD_ROWS.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">
                    <Link to={`/community/${row.id}`} className="text-ultra hover:underline">
                      {row.method}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.adopted}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", CM_TONE_CLASS[row.runsTone])}>{row.runs}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", CM_TONE_CLASS[row.resultTone])}>{row.result}</td>
                  <td className="px-4 py-3 text-right">
                    <ReportedBackCell row={row} onReport={() => setReportOpen(true)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ReportBackModal open={reportOpen} onOpenChange={setReportOpen} />
    </div>
  );
};

export default YoursRoute;
