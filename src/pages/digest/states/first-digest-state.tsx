import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { DigestCard } from "@/pages/digest/digest-card";
import { KvList } from "@/pages/digest/kv-list";
import { FIRST_DIGEST_ARRIVES, FIRST_DIGEST_CARDS, FIRST_DIGEST_WHAT_GETS_IN } from "@/pages/digest/data";

/** D01 — Your first digest. Day one; wired but unreachable given WORKSPACE_AGE_DAYS in data.ts. */
export function FirstDigestState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Your morning digest</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Day one · built at 06:00 Lagos · two rooms opened, nothing needs you yet
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link to="/settings/digest">Digest settings</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Your first digest</p>
          {FIRST_DIGEST_CARDS.map((card) => (
            <DigestCard key={card.title} {...card} />
          ))}
        </div>

        <div className="space-y-5">
          <KvList label="How this arrives" rows={FIRST_DIGEST_ARRIVES} />
          <KvList label="What gets in" rows={FIRST_DIGEST_WHAT_GETS_IN} />
          <div className="rounded-card border border-line bg-paper-2 p-4">
            <p className="text-[12px] font-semibold text-ink">You can change all of this</p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
              Thresholds, channels and quiet hours are all yours. The four rules that cannot be turned off are marked
              as such.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
