import { Link, useSearchParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { ARCHIVE_CARDS, ARCHIVE_ROWS, ONE_DIGEST_DATE } from "@/pages/everyday/digest/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const FILTER_TABS = [
  { key: "daily", label: "Daily", count: 31 },
  { key: "weekly", label: "Weekly", count: 5 },
  { key: "quiet", label: "Quiet days", count: 9 },
  { key: "needed-you", label: "Needed you", count: 22 },
] as const;

/** D04 — Digest archive, /digest/archive. */
const DigestArchiveRoute = () => {
  const [searchParams] = useSearchParams();
  const active = searchParams.get("filter") ?? "daily";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Digest archive</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Thirty-one digests · what each asked of you, and what happened next</p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/digest">Open today's</Link>
        </Button>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto">
        {FILTER_TABS.map((tab) => (
          <Link
            key={tab.key}
            to={tab.key === "daily" ? "/digest/archive" : `/digest/archive?filter=${tab.key}`}
            className={cn(
              "shrink-0 rounded-panel px-3 py-1.5 text-[11px] whitespace-nowrap",
              active === tab.key
                ? "border border-line bg-paper font-semibold text-ink"
                : "font-normal text-ink-3 hover:text-ink-2"
            )}
          >
            {tab.label} · {tab.count}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[820px] text-left text-[11.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Date</th>
              <th className={HEAD_CLASS}>Headline</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Needed you</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Acted within</th>
              <th className={cn(HEAD_CLASS, "text-right")}>At stake</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Outcome</th>
            </tr>
          </thead>
          <tbody>
            {ARCHIVE_ROWS.map((row) => (
              <tr key={row.date} className="border-b border-line last:border-0 hover:bg-paper-2">
                <td className="px-4 py-3 whitespace-nowrap">
                  {row.date === "Mon 11 Aug" ? (
                    <Link to={`/digest/${ONE_DIGEST_DATE}`} className="font-semibold text-ultra hover:underline">
                      {row.date}
                    </Link>
                  ) : (
                    <span className="font-semibold text-ink-2">{row.date}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-ink-2">{row.headline}</td>
                <td className={cn("px-4 py-3 text-right font-mono", row.neededYouTone ? TONE_TEXT_CLASS[row.neededYouTone] : "text-ink-3")}>
                  {row.neededYou}
                </td>
                <td className={cn("px-4 py-3 text-right font-mono whitespace-nowrap", row.actedWithinTone ? TONE_TEXT_CLASS[row.actedWithinTone] : "text-ink-4")}>
                  {row.actedWithin}
                </td>
                <td className={cn("px-4 py-3 text-right font-mono whitespace-nowrap", row.atStakeTone ? TONE_TEXT_CLASS[row.atStakeTone] : "text-ink")}>
                  {row.atStake}
                </td>
                <td className={cn("px-4 py-3 text-right font-semibold whitespace-nowrap", TONE_TEXT_CLASS[row.outcomeTone])}>
                  {row.outcome}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <p className="mb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          What the archive is actually for
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {ARCHIVE_CARDS.map((card) => (
            <div key={card.title} className="flex flex-col justify-between rounded-card border border-line bg-paper p-4">
              <div>
                <span className={cn("font-mono text-[9.5px] font-semibold tracking-[0.6px] uppercase", TONE_TEXT_CLASS[card.eyebrowTone])}>
                  {card.eyebrow}
                </span>
                <h3 className="mt-2 text-[13px] font-semibold text-ink">{card.title}</h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-ink-2">{card.body}</p>
              </div>
              {card.footnote && (
                <p className={cn("mt-3 border-t border-dashed border-line pt-3 font-mono text-[10.5px]", card.footnoteTone ? TONE_TEXT_CLASS[card.footnoteTone] : "text-ink-3")}>
                  {card.footnote}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <Callout tone="teal" title='The useful question is rarely "what happened last night"'>
        It is almost always "how long has that been sitting there", and only an archive can answer it. Yesterday's
        digest being unreachable is how a ₦31M room stays unowned for a week without anyone noticing the repetition.
      </Callout>
    </div>
  );
};

export default DigestArchiveRoute;
