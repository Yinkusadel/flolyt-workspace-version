import { Link } from "react-router-dom";

import { PersonAvatar } from "@/components/person-avatar";
import { DEPARTMENT_COLORS } from "@/pages/everyday/lifecycle/data";
import type { PersonRef } from "@/pages/everyday/rooms/types";

/**
 * LK11's persona lens — new UI, introduced by the Revenue group's "viewing as
 * now works" gap closure (see REVENUE-GROUP.md's C4). Distinct from the
 * sidebar's own VIEWING AS selector, which only offers
 * Marketing/Sales/Products/Everyone, not a named person — this is a per-frame
 * override with its own "See everything" escape back to the unfiltered map.
 */
export function LensBar({ person, holds, body }: { person: PersonRef; holds: string; body: string }) {
  return (
    <div className="rounded-card border border-ultra-border bg-ultra-bg p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <PersonAvatar kind="human" initials={person.initials} style={{ backgroundColor: DEPARTMENT_COLORS[person.department] }} />
          <div>
            <p className="text-[12.5px] font-semibold text-ink">
              Viewing as {person.name} <span className="font-normal text-ink-3">· {holds}</span>
            </p>
            <p className="mt-1 max-w-2xl text-[10.5px] leading-relaxed text-ultra">{body}</p>
          </div>
        </div>
        <Link to="/leakage-map" className="shrink-0 text-[11px] font-semibold text-ultra hover:underline">
          See everything
        </Link>
      </div>
    </div>
  );
}
