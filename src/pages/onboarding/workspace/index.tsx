import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Country } from "country-state-city";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SearchableSelect, SearchableSelectSkeleton } from "@/components/ui/searchable-select";
import { Skeleton } from "@/components/ui/skeleton";
import { StepUpConfirmModal } from "@/components/step-up-confirm-modal";
import { FlagIcon } from "@/components/flag-icon";
import { getCountryOptions } from "@/lib/location";
import { WizardStepper } from "@/pages/onboarding/wizard-stepper";
import { BackButton } from "@/pages/onboarding/back-button";
import useUpdateWorkspaceMarkets from "@/features/workspace/use-update-workspace-markets";
import useGetProposedMarkets from "@/features/workspace/use-get-proposed-markets";
import useGetSupportedCurrencies from "@/features/currency/use-get-supported-currencies";
import useStepUpConfirmation from "@/features/auth/use-step-up-confirmation";

/**
 * Onboarding step 1 ("Workspace") — flolyt-figma-designs/onboarding/03-create-workspace.svg.
 * Markets only: name, address and time zone are all collected earlier, on
 * /onboarding/start (POST /workspace) — this screen used to re-collect and re-save them
 * via PUT /identity, but that endpoint was narrowed to slug-only in an API update
 * 2026-08-26, and re-asking for fields already saved at creation just added two more
 * API calls for no product reason. This screen now only calls PUT /markets, step-up
 * gated. See docs/onboarding/build-plan.md for the full history.
 */
export default function OnboardingWorkspaceRoute() {
  const navigate = useNavigate();
  const { proposedMarkets, isLoading: isLoadingProposed } = useGetProposedMarkets();
  const { supportedCurrencies, isLoading: isLoadingCurrencies } = useGetSupportedCurrencies();

  const markets = useUpdateWorkspaceMarkets({
    onSuccess: () => {
      toast.success("Workspace set up. On to business model next");
      navigate("/onboarding/business-model");
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

  const handleContinue = async () => {
    const valid = await markets.form.trigger();
    if (!valid) {
      toast.error("Check the markets section before continuing");
      return;
    }
    stepUp.begin();
  };

  // Pre-fill the markets form once the proposed set arrives — a reset, not per-field
  // setValue, since every field changes together on first real data. Guarded to fire
  // only once: GET /proposed-markets refetches on window focus (e.g. tabbing away to
  // grab the step-up email code), and re-seeding on every one of those would silently
  // wipe out any market the user added, or a primary-market change, mid-session — the
  // form is the source of truth once the user starts editing it.
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

  // Markets added via the "Add another market" picker below — any country, not
  // just what GET /proposed-markets guessed. No currencyCode: per docs/endpoints/workspace.md,
  // omitting it makes PUT /markets fall back to the country's usual currency.
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

  // Lets a manually-added market override the "country's usual currency" default —
  // e.g. a US-registered business that bills a UK market in GBP, not USD.
  const setAddedMarketCurrency = (countryCode: string, currencyCode: string | null) => {
    const current = getMarketsValues("markets");
    setMarketsValue(
      "markets",
      current.map((m) => (m.countryCode === countryCode ? { ...m, currencyCode } : m)),
      { shouldValidate: true }
    );
  };

  const canContinue = !isLoadingProposed && !markets.isPending && !stepUp.isRequesting;

  return (
    <div>
      <WizardStepper activeStep={1} />

      <div className="mx-auto max-w-3xl px-6 pb-16">
        <h1 className="text-[22px] font-semibold text-ink">Where you sell</h1>
        <p className="mt-2 text-[12.5px] text-ink-3">
          Currency, time zone and language follow each customer's market. These are the defaults
          for reports and for anything that has no market of its own.
        </p>

        <div className="mt-6">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            Markets you sell in
          </p>

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
                <p className="mt-3 text-[11.5px] text-ink-3">No proposed markets yet — add one below.</p>
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
                    const defaultCurrency = Country.getCountryByCode(market.countryCode)?.currency;
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
                        {isLoadingCurrencies ? (
                          <SearchableSelectSkeleton className="mt-2 h-7" />
                        ) : (
                          <SearchableSelect
                            id={`currency-${market.countryCode}`}
                            options={currencyOptions}
                            value={market.currencyCode ?? null}
                            onChange={(value) => setAddedMarketCurrency(market.countryCode, value)}
                            placeholder={defaultCurrency ? `Auto (${defaultCurrency})` : "Auto"}
                            searchPlaceholder="Search currencies..."
                            className="mt-2 h-7 text-[10.5px]"
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

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <div className="mt-8 rounded-panel border border-dashed border-line bg-paper-2 p-5">
          <p className="text-[13px] font-semibold text-ink">There is no blended currency in Flolyt</p>
          <p className="mt-2 text-[11.5px] text-ink-3">
            Every figure about a person is shown in the currency they pay in. The reporting
            currency is used only where a combined number is genuinely needed, and the rate and
            its date are printed next to it, every time.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <BackButton to="/onboarding/start" disabled={markets.isPending || stepUp.isRequesting} />
          <Button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className="h-10.5 flex-1 rounded-card bg-ink px-6 text-[13px] font-semibold text-paper hover:bg-ink/90 sm:w-auto sm:flex-none"
          >
            {stepUp.isRequesting ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>

      <StepUpConfirmModal
        open={stepUp.isOpen}
        onOpenChange={stepUp.close}
        title="Confirm your markets"
        description="Setting where you sell needs a fresh code. Check your email."
        isRequesting={stepUp.isRequesting}
        isVerifying={stepUp.isVerifying}
        onVerify={stepUp.verify}
        onResend={stepUp.resend}
      />
    </div>
  );
}
