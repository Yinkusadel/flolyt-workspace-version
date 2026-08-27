import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Country } from "country-state-city";

import { Button } from "@/components/ui/button";
import { SearchableSelect, SearchableSelectSkeleton } from "@/components/ui/searchable-select";
import { Skeleton } from "@/components/ui/skeleton";
import { StepUpConfirmModal } from "@/components/step-up-confirm-modal";
import { FlagIcon } from "@/components/flag-icon";
import { WizardStepper } from "@/pages/onboarding/wizard-stepper";
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
      toast.success("Workspace set up — on to business model next");
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
  // setValue, since every field changes together on first real data.
  useEffect(() => {
    if (!proposedMarkets) return;
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
      selectedMarkets.map((m) => {
        const info = marketProposals.find((p) => p.countryCode === m.countryCode);
        return {
          value: m.countryCode,
          label: info?.countryName ?? m.countryCode,
          icon: <FlagIcon code={m.countryCode} />,
        };
      }),
    [selectedMarkets, marketProposals]
  );

  const currencyOptions = useMemo(
    () => (supportedCurrencies?.currencies ?? []).map((code) => ({ value: code, label: code })),
    [supportedCurrencies]
  );

  const isMarketSelected = (countryCode: string) =>
    selectedMarkets.some((m) => m.countryCode === countryCode);

  const toggleMarket = (proposal: (typeof marketProposals)[number]) => {
    const current = getMarketsValues("markets");
    if (isMarketSelected(proposal.countryCode)) {
      const next = current.filter((m) => m.countryCode !== proposal.countryCode);
      setMarketsValue("markets", next, { shouldValidate: true });
      if (primaryMarketCountry === proposal.countryCode) {
        setMarketsValue("primaryMarketCountry", next[0]?.countryCode ?? "", { shouldValidate: true });
      }
      return;
    }
    setMarketsValue(
      "markets",
      [...current, { countryCode: proposal.countryCode, currencyCode: proposal.currencyCode }],
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
          Currency, time zone and language follow each customer's market — these are the defaults
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
          ) : marketProposals.length === 0 ? (
            <p className="mt-3 text-[11.5px] text-ink-3">No proposed markets yet.</p>
          ) : (
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
            </div>
          )}
          {marketsErrors.markets && (
            <p className="mt-1.5 text-[11px] text-destructive">{marketsErrors.markets.message}</p>
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
            currency is used only where a combined number is genuinely needed — and the rate and
            its date are printed next to it, every time.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className="mt-8 h-10.5 w-full rounded-card bg-ink text-[13px] font-semibold text-paper hover:bg-ink/90 sm:w-40"
        >
          {stepUp.isRequesting ? "Saving..." : "Continue"}
        </Button>
      </div>

      <StepUpConfirmModal
        open={stepUp.isOpen}
        onOpenChange={stepUp.close}
        title="Confirm your markets"
        description="Setting where you sell needs a fresh code — check your email."
        isRequesting={stepUp.isRequesting}
        isVerifying={stepUp.isVerifying}
        onVerify={stepUp.verify}
        onResend={stepUp.resend}
      />
    </div>
  );
}
