import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { PersonDot } from "@/pages/everyday/rooms/actor";
import { TONE_TEXT_CLASS } from "@/pages/everyday/rooms/tone";
import { DigestCard } from "@/pages/everyday/digest/digest-card";
import { KvList } from "@/pages/everyday/digest/kv-list";
import { ADA, TEAM_DIGEST_ARRIVES, TEAM_DIGEST_CARDS, TEAM_LOAD } from "@/pages/everyday/digest/data";

/** D07 — Team digest, reached at /digest?team=ea-cs. Only "ea-cs" (East Africa CS) has real content, same "one reference row" pattern as every prior rebuild. */
export function TeamState({ team }: { team: string }) {
  if (team !== "ea-cs") {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-10 text-center">
        <p className="text-[13px] font-semibold text-ink">No team digest for "{team}"</p>
        <p className="mt-1.5 text-[11.5px] text-ink-3">Only East Africa CS has a built team digest in this demo.</p>
        <Link to="/digest" className="mt-4 inline-block text-[11.5px] font-semibold text-ultra hover:underline">
          Back to your digest
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">East Africa CS · morning digest</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Wednesday 13 August · built at 06:00 Nairobi · nine people · 17 open items</p>
        </div>
        <div className="flex shrink-0 gap-2.5">
          <Button asChild variant="outline">
            <Link to="/digest/archive">Archive</Link>
          </Button>
          <Button asChild>
            <Link to="/settings/digest">Digest settings</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">Your team, overnight</p>
          {TEAM_DIGEST_CARDS.map((card) => (
            <DigestCard key={card.title} {...card} />
          ))}
        </div>

        <div className="space-y-5">
          <div>
            <p className="mb-2 font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">Your nine</p>
            <div className="divide-y divide-line rounded-card border border-line bg-paper">
              {TEAM_LOAD.map((row) => (
                <div key={row.person.name} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <PersonDot person={row.person} size="sm" />
                    <span className="text-[11px] text-ink-2">{row.person.name}</span>
                  </div>
                  <span className={cn("font-mono text-[10.5px]", row.tone ? TONE_TEXT_CLASS[row.tone] : "text-ink-3")}>
                    {row.items}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                <span className="text-[11px] text-ink-2">Four others</span>
                <span className="font-mono text-[10.5px] text-ink-4">0 each</span>
              </div>
              <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                <span className="text-[11px] text-ink-2">Nobody</span>
                <span className="font-mono text-[10.5px] text-rose">3</span>
              </div>
            </div>
          </div>

          <KvList label="Arrives" rows={TEAM_DIGEST_ARRIVES} />

          <Callout tone="teal" title="Local time, not workspace time">
            Built at 06:00 Nairobi, not 06:00 Lagos. A team in a market gets its morning in its own morning.
          </Callout>

          <p className="text-[10px] text-ink-4">{ADA.name} — not subscribed to this team digest.</p>
        </div>
      </div>
    </div>
  );
}
