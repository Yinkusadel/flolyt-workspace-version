import { Link, useParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import { KvList } from "@/pages/digest/kv-list";
import { ONE_DIGEST_CHANGED_AFTER, ONE_DIGEST_DATE, ONE_DIGEST_LABEL, ONE_DIGEST_ROWS } from "@/pages/digest/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** D05 — One past digest, /digest/:date. Only ONE_DIGEST_DATE ("2026-08-11") has real content, same "one reference row" pattern as every prior rebuild. */
const OneDigestRoute = () => {
  const { date } = useParams();

  usePageBreadcrumb(
    date === ONE_DIGEST_DATE
      ? [{ label: "Digest", to: "/digest" }, { label: "Archive", to: "/digest/archive" }, { label: ONE_DIGEST_LABEL }]
      : [{ label: "Digest", to: "/digest" }, { label: date ?? "" }]
  );

  if (date !== ONE_DIGEST_DATE) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">No digest found for {date}</p>
        <p className="mt-1.5 text-[11.5px] text-ink-3">Only {ONE_DIGEST_LABEL} has a built archive entry in this demo.</p>
        <Link to="/digest/archive" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
          Back to the archive
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">{ONE_DIGEST_LABEL}</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">One thing was asked for and not done · it has now appeared three days running</p>
        </div>
        <Button variant="outline" className="shrink-0">
          See the pattern
        </Button>
      </div>

      <div className="rounded-card border-2 border-amber-border bg-amber-bg p-4">
        <h3 className="text-[14px] font-semibold text-ink">This digest asked for one thing and it was not done</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
          The Ghana room appeared under "New" with no owner. It appeared again on the 12th and the 13th. It is still
          unowned four days later.
        </p>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What it said, and what happened after
        </p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Section</th>
                <th className={HEAD_CLASS}>Item</th>
                <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
                <th className={cn(HEAD_CLASS, "text-right")}>You did</th>
                <th className={cn(HEAD_CLASS, "text-right")}>When</th>
                <th className={cn(HEAD_CLASS, "text-right")}>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {ONE_DIGEST_ROWS.map((row) => (
                <tr key={row.item} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-3 whitespace-nowrap">{row.section}</td>
                  <td className="px-4 py-3 text-ink-2">{row.item}</td>
                  <td className={cn("px-4 py-3 text-right font-mono whitespace-nowrap", row.atStakeTone ? TONE_TEXT_CLASS[row.atStakeTone] : "text-ink")}>
                    {row.atStake}
                  </td>
                  <td className={cn("px-4 py-3 text-right whitespace-nowrap", row.youDidTone ? TONE_TEXT_CLASS[row.youDidTone] : "text-ink-3")}>
                    {row.youDid}
                  </td>
                  <td className={cn("px-4 py-3 text-right font-mono whitespace-nowrap", row.whenTone ? TONE_TEXT_CLASS[row.whenTone] : "text-ink-4")}>
                    {row.when}
                  </td>
                  <td className={cn("px-4 py-3 text-right font-semibold whitespace-nowrap", TONE_TEXT_CLASS[row.outcomeTone])}>
                    {row.outcome}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <h3 className="text-[13px] font-semibold text-ink">Nothing here was hidden from you and the outcome was still nothing</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">
          The Ghana room was in the digest, at the right threshold, in the right section, with the right number on
          it. It has been read three times. The gap is not in what the digest reported — it is that a room can be
          read repeatedly and remain unowned, which is what the amber badge and the daily list are for.
        </p>
      </div>

      <KvList label="What Flolyt changed after this" rows={ONE_DIGEST_CHANGED_AFTER} />
    </div>
  );
};

export default OneDigestRoute;
