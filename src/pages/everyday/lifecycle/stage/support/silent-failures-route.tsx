import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { formatCount, formatPercent } from "@/pages/everyday/lifecycle/format-measured-value";
import { useGetSupportSilentFailures } from "@/features/lifecycle/use-get-support-silent-failures";

const CALLOUT_TONES = new Set(["amber", "teal", "rose", "ultra", "neutral"]);
function safeCalloutTone(tone: string): "amber" | "teal" | "rose" | "ultra" | "neutral" {
  return (CALLOUT_TONES.has(tone) ? tone : "neutral") as "amber" | "teal" | "rose" | "ultra" | "neutral";
}

function SilentFailuresSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-card border border-line bg-paper p-3.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-2 h-5 w-16" />
        </div>
      ))}
    </div>
  );
}

/**
 * SU13 — "Silent failures", reached from the Overview's "Revenue behind silent failures" KPI card,
 * wired to GET /lifecycle/support/silent-failures. That endpoint returns four top-level scalars,
 * not a per-outcome breakdown — the old mock's "what went wrong, and whether they told us" table
 * has no matching field at all.
 */
const SupportSilentFailuresRoute = () => {
  const { stage } = useStageContext();
  const { data, isLoading, isError, refetch } = useGetSupportSilentFailures();
  const silent = data?.data;

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[
          { label: "Lifecycle", to: "/lifecycle" },
          { label: stage.name, to: `/lifecycle/${stage.slug}` },
          { label: "Silent failures" },
        ]}
        title="Silent failures"
        subtitle="Customers whose orders went wrong who may never have said anything"
        action={
          <Button type="button" size="sm">
            Open a war room
          </Button>
        }
      />

      {isError ? (
        <div className="flex flex-wrap items-center gap-3 rounded-card border border-rose-border bg-rose-bg/40 px-4 py-3">
          <p className="text-[12px] text-rose">Couldn't load Support's silent failures.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <SilentFailuresSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-card border border-line bg-paper p-3.5">
              <p className="font-mono text-[9.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Could be silent</p>
              <p className="mt-1.5 text-[16px] font-semibold text-ink">{silent?.couldBeSilent !== null && silent?.couldBeSilent !== undefined ? formatCount(silent.couldBeSilent) : "Unavailable"}</p>
              <p className="mt-1 text-[10px] text-ink-4">An upper bound — includes everyone who DID complain too.</p>
            </div>
            <div className="rounded-card border border-line bg-paper p-3.5">
              <p className="font-mono text-[9.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Customers in window</p>
              <p className="mt-1.5 text-[16px] font-semibold text-ink">{silent?.customersInWindow !== null && silent?.customersInWindow !== undefined ? formatCount(silent.customersInWindow) : "Unavailable"}</p>
            </div>
            <div className="rounded-card border border-line bg-paper p-3.5">
              <p className="font-mono text-[9.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Share</p>
              <p className="mt-1.5 text-[16px] font-semibold text-ink">{silent?.share !== null && silent?.share !== undefined ? formatPercent(silent.share) : "Unavailable"}</p>
            </div>
          </div>

          <Callout tone="amber" title="Confirmed silent is always unavailable, and says why">
            Without a connected helpdesk there's no contact record for a complaint to be absent from — so how many of
            the customers above stayed silent, specifically, can't be confirmed. That gap is shown rather than
            dropped, so "asked" and "known" don't get quietly conflated.
          </Callout>
        </>
      )}

      {/* ❌ Backend does NOT provide: a per-outcome ("delivery late", "delivery failed", etc.)
          breakdown with told-us/stayed-silent/repeat-rate columns — this endpoint returns four
          workspace-wide scalars only, not a table. The old mock's table and closing cards aren't
          reproducible from live data; dropped. */}

      {silent?.callouts.map((callout) => (
        <Callout key={callout.key} tone={safeCalloutTone(callout.tone)} title={callout.headline}>
          {callout.body}
        </Callout>
      ))}
    </div>
  );
};

export default SupportSilentFailuresRoute;
