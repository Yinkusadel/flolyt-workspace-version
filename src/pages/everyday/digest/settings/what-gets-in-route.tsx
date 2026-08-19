import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { KvList } from "@/pages/everyday/digest/kv-list";
import { WHAT_GETS_IN_ROWS, WHAT_GETS_IN_THRESHOLD } from "@/pages/everyday/digest/data";
import { DigestSettingsTabs } from "@/pages/everyday/digest/settings/tabs";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** D09 — What gets in, /settings/digest. */
const WhatGetsInRoute = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Digest settings</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Eight rules · four cannot be turned off, two cannot be turned on</p>
        </div>
        <Button className="shrink-0">Save</Button>
      </div>

      <DigestSettingsTabs active="what-gets-in" />

      <div className="overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full min-w-[900px] text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-line bg-paper-2">
              <th className={HEAD_CLASS}>Appears in your digest when</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Threshold</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Yesterday</th>
              <th className={cn(HEAD_CLASS, "text-right")}>Can you change it?</th>
              <th className={cn(HEAD_CLASS, "text-right")}>State</th>
            </tr>
          </thead>
          <tbody>
            {WHAT_GETS_IN_ROWS.map((row) => (
              <tr key={row.when} className="border-b border-line last:border-0">
                <td className="px-4 py-3.5 font-semibold text-ink">{row.when}</td>
                <td className="px-4 py-3.5 text-right font-mono whitespace-nowrap text-ink-4">{row.threshold}</td>
                <td
                  className={cn(
                    "px-4 py-3.5 text-right font-mono whitespace-nowrap",
                    row.yesterdayTone ? TONE_TEXT_CLASS[row.yesterdayTone] : "text-ink-3"
                  )}
                >
                  {row.yesterday}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Chip tone={row.canChange === "yes" ? "teal" : "neutral"}>{row.canChange}</Chip>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Chip tone={row.state === "on" ? "teal" : "neutral"}>{row.state}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="amber" title="Four cannot be turned off and two cannot be turned on">
        You can raise the ₦25M threshold and silence room closures. You cannot silence an approval you own, an
        obligation you broke, an unowned room in your stage, or a guardrail firing. And an agent narrating its own
        work will never appear here, at any threshold — if it did, the amber badge would stop meaning "a person must
        act" within a week.
      </Callout>

      <KvList label="The threshold, and what it currently hides" rows={WHAT_GETS_IN_THRESHOLD} />

      <Link to="/digest/excluded" className="inline-block text-[11.5px] font-semibold text-ultra hover:underline">
        See everything that didn't make it into a digest →
      </Link>
    </div>
  );
};

export default WhatGetsInRoute;
