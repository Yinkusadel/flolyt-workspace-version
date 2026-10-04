import { Link } from "react-router-dom";
import { Ban, Building2, Check, ChevronRight, CircleDollarSign, Clock, Plug, ShieldCheck, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Chip, type ChipTone } from "@/components/ui/chip";
import type {
  LeakageV2LimitationCode,
  LeakageV2Readiness,
  LeakageV2ReadinessCategory,
  LeakageV2ReadinessItem,
  LeakageV2ReadinessState,
} from "@/services/api/leakage/get-leakage";
import { PRIMARY_ACTION_CLASS } from "@/pages/leakage-map/drawer/shared";

interface CategoryMeta {
  label: string;
  Icon: LucideIcon;
  /**
   * The diagnostics group this row opens. The handoff says to open the limitation drawer "filtered by the
   * corresponding limitation code when one exists"; the pairing here is read from the names (it is not an API
   * field), and a row with no matching code does not open anything.
   */
  code: LeakageV2LimitationCode | null;
}

const CATEGORY: Record<LeakageV2ReadinessCategory, CategoryMeta> = {
  SECTOR_CONFIRMATION: { label: "Sector confirmation", Icon: Building2, code: "SECTOR_ASSIGNMENT_MISSING" },
  SOURCE_CAPABILITY: { label: "Source capability", Icon: Plug, code: "CAPABILITY_GAP" },
  HISTORY: { label: "History", Icon: Clock, code: "BASELINE_HISTORY_MISSING" },
  PRICING: { label: "Pricing", Icon: CircleDollarSign, code: "PRICING_INPUT_MISSING" },
  POLICY_CONFIGURATION: { label: "Policy configuration", Icon: ShieldCheck, code: "CURRENCY_POLICY_MISSING" },
  PLATFORM_CAPABILITY: { label: "Platform capability", Icon: Ban, code: "NORMALIZED_FACTS_UNAVAILABLE" },
};

const STATE_TAG: Record<LeakageV2ReadinessState, { label: string; tone: ChipTone }> = {
  ACTION_REQUIRED: { label: "Action", tone: "amber" },
  WAITING_FOR_DATA: { label: "Waiting", tone: "ultra" },
  UNAVAILABLE: { label: "Unavailable", tone: "neutral" },
  READY: { label: "Ready", tone: "teal" },
};

interface ReadinessSectionProps {
  readiness: LeakageV2Readiness;
  onOpenDiagnostics: (code: LeakageV2LimitationCode) => void;
}

/**
 * What stands between this workspace and a fuller map. One row per category the API sends; rows that are
 * `READY` stay quiet (a single tick line at the bottom). An action button appears only when the API marks the
 * action `eligible`, and goes to Data sources; an action that is not eligible shows the server's own reason as
 * text and never as a button. A row's text opens the diagnostics behind it.
 */
export function ReadinessSection({ readiness, onOpenDiagnostics }: ReadinessSectionProps) {
  const open = readiness.items.filter((item) => item.state !== "READY");
  const ready = readiness.items.filter((item) => item.state === "READY");

  return (
    <section aria-label="Readiness" className="rounded-card border border-line bg-paper p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-semibold text-ink">Readiness</h2>
        {readiness.state === "ACTION_REQUIRED" ? (
          <Chip tone="amber">Action required · {readiness.actionRequiredCount}</Chip>
        ) : readiness.state === "LIMITED" ? (
          <Chip>Limited</Chip>
        ) : (
          <Chip tone="teal">Ready</Chip>
        )}
      </div>

      {open.length > 0 && (
        <ul className="mt-3 divide-y divide-line">
          {open.map((item) => (
            <ReadinessRow key={item.category} item={item} onOpenDiagnostics={onOpenDiagnostics} />
          ))}
        </ul>
      )}

      {ready.length > 0 && (
        <ul className={cn("space-y-1", open.length > 0 && "mt-3 border-t border-line pt-3")}>
          {ready.map((item) => (
            <li key={item.category} className="flex items-center gap-1.5 text-[11.5px] text-ink-3">
              <Check className="size-3.5 text-teal" />
              {CATEGORY[item.category].label} ready
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ReadinessRow({
  item,
  onOpenDiagnostics,
}: {
  item: LeakageV2ReadinessItem;
  onOpenDiagnostics: (code: LeakageV2LimitationCode) => void;
}) {
  const meta = CATEGORY[item.category];
  const tag = STATE_TAG[item.state];
  const { action } = item;
  const body = (
    <>
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-control bg-paper-2 text-ink-3">
        <meta.Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-[12.5px] font-semibold text-ink">{meta.label}</span>
          <Chip tone={tag.tone}>{tag.label}</Chip>
        </span>
        <span className="mt-0.5 block text-[11px] leading-relaxed text-ink-3">
          {item.message}
          {item.affectedCount > 0 && ` (${item.affectedCount.toLocaleString("en-US")})`}
        </span>
      </span>
      {meta.code && <ChevronRight className="mt-1.5 size-3.5 shrink-0 text-ink-4" aria-hidden />}
    </>
  );

  return (
    <li className="py-3">
      {meta.code ? (
        <button
          type="button"
          onClick={() => onOpenDiagnostics(meta.code as LeakageV2LimitationCode)}
          className="flex w-full gap-3 text-left"
          aria-label={`${meta.label}: open the diagnostics behind it`}
        >
          {body}
        </button>
      ) : (
        <div className="flex gap-3">{body}</div>
      )}

      {action && (
        <div className="mt-2 pl-11">
          {action.eligible && action.target === "datasources" ? (
            <Link
              to="/data-sources"
              className={cn(
                "inline-flex h-7 items-center rounded-control border px-2.5 text-[11.5px] font-medium transition-colors",
                PRIMARY_ACTION_CLASS
              )}
            >
              {action.label}
            </Link>
          ) : (
            action.unavailableReason && <p className="text-[10.5px] text-ink-4">{action.unavailableReason}</p>
          )}
          {action.eligible && action.missingRequirements.length > 0 && (
            <p className="mt-1.5 text-[10.5px] text-ink-3">Needs {action.missingRequirements.join(", ")}</p>
          )}
        </div>
      )}
    </li>
  );
}
