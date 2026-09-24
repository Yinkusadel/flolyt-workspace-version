import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { Country } from "country-state-city";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SearchableSelect, SearchableSelectSkeleton } from "@/components/ui/searchable-select";
import { Skeleton } from "@/components/ui/skeleton";
import { StepUpConfirmModal } from "@/components/step-up-confirm-modal";
import { FlagIcon } from "@/components/flag-icon";
import { getCountryOptions } from "@/lib/location";
import useUpdateWorkspaceMarkets from "@/features/workspace/use-update-workspace-markets";
import useGetProposedMarkets from "@/features/workspace/use-get-proposed-markets";
import useGetSupportedCurrencies from "@/features/currency/use-get-supported-currencies";
import useStepUpConfirmation from "@/features/auth/use-step-up-confirmation";

const EYEBROW_CLASS = "font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase";

/**
 * Settings/Markets — same declare-your-markets form as onboarding step 1
 * (/onboarding/workspace), reused here so a workspace can revisit and update where it
 * sells after setup. GET /proposed-markets doubles as "current markets" once
 * `declared: true` (there's no separate read-current-markets endpoint) — see
 * docs/endpoints/workspace.md.
 */
export default function MarketsRoute() {
  const { proposedMarkets, isLoading: isLoadingProposed } = useGetProposedMarkets();
  const { supportedCurrencies, isLoading: isLoadingCurrencies } = useGetSupportedCurrencies();

  const markets = useUpdateWorkspaceMarkets({
    onSuccess: () => {
      toast.success("Markets updated");
    },
  });

  const stepUp = useStepUpConfirmation({
    action: "change_workspace_markets",
    onConfirmed: (challengeId) => {
      markets.form.setValue("stepUpChallengeId", challengeId);
      markets.form.handleSubmit(markets.onSubmit)();
    },
  });

  const {
    watch: watchMarkets,
    setValue: setMarketsValue,
    getValues: getMarketsValues,
    formState: { errors: marketsErrors },
  } = markets.form;

  const handleSave = async () => {
    const valid = await markets.form.trigger();
    if (!valid) {
      toast.error("Check the markets section before saving");
      return;
    }
    stepUp.begin();
  };

  // Pre-fill once the current/proposed set arrives — see onboarding/workspace's identical
  // guard for why this only seeds once (a window-focus refetch must never clobber edits).
  const hasSeededMarkets = useRef(false);
  useEffect(() => {
    if (!proposedMarkets || hasSeededMarkets.current) return;
    hasSeededMarkets.current = true;
    markets.form.reset({
      markets: proposedMarkets.proposals.map((p) => ({
        countryCode: p.countryCode,
        currencyCode: p.currencyCode,
      })),
      primaryMarketCountry: proposedMarkets.primaryMarketCountry,
      reportingCurrency: proposedMarkets.reportingCurrency,
      stepUpChallengeId: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposedMarkets]);

  const marketProposals = useMemo(
    () =>
      (proposedMarkets?.proposals ?? []).map((proposal) => ({
        ...proposal,
        countryName: Country.getCountryByCode(proposal.countryCode)?.name ?? proposal.countryCode,
      })),
    [proposedMarkets]
  );

  const selectedMarkets = watchMarkets("markets");
  const primaryMarketCountry = watchMarkets("primaryMarketCountry");

  const primaryMarketOptions = useMemo(
    () =>
      selectedMarkets.map((m) => ({
        value: m.countryCode,
        label: Country.getCountryByCode(m.countryCode)?.name ?? m.countryCode,
        icon: <FlagIcon code={m.countryCode} />,
      })),
    [selectedMarkets]
  );

  const currencyOptions = useMemo(
    () => (supportedCurrencies?.currencies ?? []).map((code) => ({ value: code, label: code })),
    [supportedCurrencies]
  );

  const isMarketSelected = (countryCode: string) =>
    selectedMarkets.some((m) => m.countryCode === countryCode);

  const removeMarket = (countryCode: string) => {
    const current = getMarketsValues("markets");
    const next = current.filter((m) => m.countryCode !== countryCode);
    setMarketsValue("markets", next, { shouldValidate: true });
    if (primaryMarketCountry === countryCode) {
      setMarketsValue("primaryMarketCountry", next[0]?.countryCode ?? "", { shouldValidate: true });
    }
  };

  const toggleMarket = (proposal: (typeof marketProposals)[number]) => {
    if (isMarketSelected(proposal.countryCode)) {
      removeMarket(proposal.countryCode);
      return;
    }
    const current = getMarketsValues("markets");
    setMarketsValue(
      "markets",
      [...current, { countryCode: proposal.countryCode, currencyCode: proposal.currencyCode }],
      { shouldValidate: true }
    );
  };

  const addedMarkets = useMemo(
    () => selectedMarkets.filter((m) => !marketProposals.some((p) => p.countryCode === m.countryCode)),
    [selectedMarkets, marketProposals]
  );

  const addableCountryOptions = useMemo(
    () => getCountryOptions().filter((option) => !isMarketSelected(option.value)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedMarkets]
  );

  const addMarket = (countryCode: string) => {
    const current = getMarketsValues("markets");
    setMarketsValue("markets", [...current, { countryCode, currencyCode: null }], {
      shouldValidate: true,
    });
  };

  const setAddedMarketCurrency = (countryCode: string, currencyCode: string | null) => {
    const current = getMarketsValues("markets");
    setMarketsValue(
      "markets",
      current.map((m) => (m.countryCode === countryCode ? { ...m, currencyCode } : m)),
      { shouldValidate: true }
    );
  };

  const canSave = !isLoadingProposed && !markets.isPending && !stepUp.isRequesting;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Markets</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Currency, time zone and language follow each customer's market. These are the defaults
          for reports and for anything that has no market of its own.
        </p>
      </div>

      <div>
        <p className={EYEBROW_CLASS}>Markets you sell in</p>

        {isLoadingProposed ? (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="size-3.5 shrink-0 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="mt-2.5 h-2.5 w-10" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {marketProposals.length === 0 && addedMarkets.length === 0 && (
              <p className="mt-3 text-[11.5px] text-ink-3">No markets yet — add one below.</p>
            )}
            {(marketProposals.length > 0 || addedMarkets.length > 0) && (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {marketProposals.map((proposal) => {
                  const selected = isMarketSelected(proposal.countryCode);
                  return (
                    <button
                      key={proposal.countryCode}
                      type="button"
                      onClick={() => toggleMarket(proposal)}
                      className={`flex items-center justify-between rounded-panel border px-3.5 py-3 text-left transition-colors ${
                        selected ? "border-ultra-border bg-paper" : "border-line bg-paper-2"
                      }`}
                    >
                      <span>
                        <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink">
                          <FlagIcon code={proposal.countryCode} /> {proposal.countryName}
                        </span>
                        <span className="font-mono text-[10.5px] text-ink-4">{proposal.currencyCode}</span>
                      </span>
                      {selected && (
                        <span className="flex size-4 items-center justify-center rounded-full bg-ultra text-[8px] text-white">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}

                {addedMarkets.map((market) => {
                  const countryName =
                    Country.getCountryByCode(market.countryCode)?.name ?? market.countryCode;
                  return (
                    <div
                      key={market.countryCode}
                      className="rounded-panel border border-ultra-border bg-paper px-3.5 py-3 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink">
                          <FlagIcon code={market.countryCode} /> {countryName}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeMarket(market.countryCode)}
                          aria-label={`Remove ${countryName}`}
                          className="flex size-4 shrink-0 items-center justify-center rounded-full text-ink-4 hover:text-ink"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                      <label
                        htmlFor={`currency-${market.countryCode}`}
                        className="mt-2 block text-[10px] text-ink-4"
                      >
                        Currency for this market
                      </label>
                      {isLoadingCurrencies ? (
                        <SearchableSelectSkeleton className="mt-1 h-7" />
                      ) : (
                        <SearchableSelect
                          id={`currency-${market.countryCode}`}
                          options={currencyOptions}
                          value={market.currencyCode ?? null}
                          onChange={(value) => setAddedMarketCurrency(market.countryCode, value)}
                          placeholder="Select currency"
                          searchPlaceholder="Search currencies..."
                          className="mt-1 h-7 text-[10.5px]"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
        {marketsErrors.markets && (
          <p className="mt-1.5 text-[11px] text-destructive">{marketsErrors.markets.message}</p>
        )}

        {!isLoadingProposed && (
          <SearchableSelect
            id="add-market"
            options={addableCountryOptions}
            value={null}
            onChange={addMarket}
            placeholder="Add another market"
            searchPlaceholder="Search countries..."
            className="mt-3"
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="primary-market" className="text-[11px] text-ink-3">
            Primary market
          </label>
          {isLoadingProposed ? (
            <SearchableSelectSkeleton className="mt-1.5" />
          ) : (
            <SearchableSelect
              id="primary-market"
              options={primaryMarketOptions}
              value={primaryMarketCountry || null}
              onChange={(value) => setMarketsValue("primaryMarketCountry", value, { shouldValidate: true })}
              placeholder="Select the primary market"
              searchPlaceholder="Search markets..."
              className="mt-1.5"
              aria-invalid={!!marketsErrors.primaryMarketCountry}
            />
          )}
          {marketsErrors.primaryMarketCountry && (
            <p className="mt-1.5 text-[11px] text-destructive">{marketsErrors.primaryMarketCountry.message}</p>
          )}
          <p className="mt-1.5 text-[10.5px] text-ink-4">used when a customer has no market</p>
        </div>

        <div>
          <label htmlFor="reporting-currency" className="text-[11px] text-ink-3">
            Reporting currency
          </label>
          {isLoadingCurrencies ? (
            <SearchableSelectSkeleton className="mt-1.5" />
          ) : (
            <SearchableSelect
              id="reporting-currency"
              options={currencyOptions}
              value={watchMarkets("reportingCurrency") || null}
              onChange={(value) => setMarketsValue("reportingCurrency", value, { shouldValidate: true })}
              placeholder="Select a currency"
              searchPlaceholder="Search currencies..."
              className="mt-1.5"
            />
          )}
          <p className="mt-1.5 text-[10.5px] text-ink-4">conversions are always dated and stated</p>
        </div>
      </div>

      <div className="rounded-panel border border-dashed border-line bg-paper-2 p-5">
        <p className="text-[13px] font-semibold text-ink">There is no blended currency in Flolyt</p>
        <p className="mt-2 text-[11.5px] text-ink-3">
          Every figure about a person is shown in the currency they pay in. The reporting
          currency is used only where a combined number is genuinely needed, and the rate and
          its date are printed next to it, every time.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="h-10.5 rounded-card bg-ink px-6 text-[13px] font-semibold text-paper hover:bg-ink/90"
        >
          {stepUp.isRequesting ? "Saving..." : "Save changes"}
        </Button>
      </div>

      <StepUpConfirmModal
        open={stepUp.isOpen}
        onOpenChange={stepUp.close}
        title="Confirm your markets"
        description="Updating where you sell needs a fresh code. Check your email."
        isRequesting={stepUp.isRequesting}
        isVerifying={stepUp.isVerifying}
        onVerify={stepUp.verify}
        onResend={stepUp.resend}
      />
    </div>
  );
}
