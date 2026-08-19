import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DigestCard } from "@/pages/everyday/digest/digest-card";
import { KvList } from "@/pages/everyday/digest/kv-list";
import { TODAY_DIGEST_ARRIVES, TODAY_DIGEST_CARDS, TODAY_DIGEST_WHAT_GETS_IN } from "@/pages/everyday/digest/data";

/** D02 — Today's digest, the default state at /digest. */
export function TodayState() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Your morning digest</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">
            Wednesday 13 August · built at 06:00 Lagos · about ninety seconds to read
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 sm:shrink-0 sm:justify-end">
          <Button asChild variant="outline">
            <Link to="/digest/weekly">Weekly roll-up</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/digest/archive">Archive</Link>
          </Button>
          <Button asChild size="icon" className="sm:hidden" aria-label="Digest settings">
            <Link to="/settings/digest">
              <Settings />
            </Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/settings/digest">Digest settings</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Overnight</p>
          {TODAY_DIGEST_CARDS.map((card) => (
            <DigestCard key={card.title} {...card} />
          ))}
        </div>

        <div className="space-y-5">
          <KvList label="How this arrives" rows={TODAY_DIGEST_ARRIVES} />
          <KvList label="What gets in" rows={TODAY_DIGEST_WHAT_GETS_IN} />
          <Callout tone="neutral" title="Agents keep working whether or not you read this">
            The digest is a summary of work, never a queue that blocks it. Nothing waits for you to open it.
          </Callout>
        </div>
      </div>
    </div>
  );
}
