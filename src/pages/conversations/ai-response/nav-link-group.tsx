import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { mapBackendRoute } from "@/features/ai-conversations/map-backend-route";
import type { NavLinkPayload } from "@/features/ai-conversations/response-parser";

export function AiNavLinkGroup({ links }: { links: NavLinkPayload[] }) {
  const navigate = useNavigate();

  return (
    <div className="grid w-full gap-2 sm:grid-cols-2">
      {links.map((link, idx) => (
        <button
          key={`${link.route}-${idx}`}
          type="button"
          onClick={() => navigate(mapBackendRoute(link.route))}
          className="group flex items-start justify-between gap-2 rounded-card border border-line bg-paper p-3 text-left transition-colors hover:border-ink-4"
        >
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-ultra group-hover:underline">{link.label}</p>
            {link.description && (
              <p className="mt-0.5 text-[11px] leading-relaxed text-ink-3">{link.description}</p>
            )}
          </div>
          <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-ink-4 transition-transform group-hover:translate-x-0.5 group-hover:text-ultra" />
        </button>
      ))}
    </div>
  );
}
