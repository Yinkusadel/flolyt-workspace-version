import { useState } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DatasourceDto } from "@/services/api/datasources/get-datasources";
import { datasourceSlug, POPULAR_DATASOURCE_NAMES } from "@/pages/onboarding/data/data";

/** Renders a vendor mark from simpleicons.org, same source the old dashboard's connect-sources cards used, falling back to an initial when a slug has no match there. */
export function SourceLogo({ name, className }: { name: string; className?: string }) {
  const [imgError, setImgError] = useState(false);
  const slug = datasourceSlug(name);

  if (imgError) {
    return (
      <span className={cn("flex items-center justify-center text-[13px] font-semibold text-ink-3", className)}>
        {name.charAt(0)}
      </span>
    );
  }

  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/000000`}
      alt=""
      aria-hidden
      referrerPolicy="no-referrer"
      className={cn("object-contain opacity-80", className)}
      onError={() => setImgError(true)}
    />
  );
}

export function SourceCard({
  datasource,
  isConnected,
  onClick,
}: {
  datasource: DatasourceDto;
  isConnected: boolean;
  onClick: () => void;
}) {
  const isPopular = POPULAR_DATASOURCE_NAMES.has(datasource.name);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-3 rounded-panel border p-4 text-left transition-colors",
        isConnected ? "border-teal-border bg-teal-bg/40" : "border-line bg-paper hover:border-ultra-border"
      )}
    >
      <div className="flex w-full items-start justify-between gap-2">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-control border border-line bg-paper-2">
          <SourceLogo name={datasource.name} className="size-4.5" />
        </div>
        {isConnected ? (
          <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-teal text-white">
            <Check className="size-3" />
          </span>
        ) : (
          isPopular && (
            <span className="rounded-chip border border-ultra-border bg-ultra-bg px-1.5 py-0.5 text-[9.5px] font-semibold text-ultra">
              Popular
            </span>
          )
        )}
      </div>

      <div>
        <p className="text-[12.5px] font-semibold text-ink">{datasource.displayName}</p>
        <p className="mt-0.5 text-[10.5px] text-ink-4">{isConnected ? "Connected" : datasource.category}</p>
      </div>
    </button>
  );
}
