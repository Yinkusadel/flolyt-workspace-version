import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Country } from "country-state-city";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { StepUpConfirmModal } from "@/components/step-up-confirm-modal";
import { FlagIcon } from "@/components/flag-icon";
import { WizardStepper } from "@/pages/onboarding/wizard-stepper";
import useUpdateWorkspaceIdentity from "@/features/workspace/use-update-workspace-identity";
import useUpdateWorkspaceMarkets from "@/features/workspace/use-update-workspace-markets";
import useGetProposedMarkets from "@/features/workspace/use-get-proposed-markets";
import useSlugAvailable from "@/features/workspace/use-slug-available";
import useGetSupportedCurrencies from "@/features/currency/use-get-supported-currencies";
import useStepUpConfirmation from "@/features/auth/use-step-up-confirmation";
import { getCountryTimezones } from "@/lib/location";

interface NavState {
  name?: string;
  timeZoneId?: string;
  country?: string;
}

/**
 * Onboarding step 1 ("Workspace") — flolyt-figma-designs/onboarding/03-create-workspace.svg.
 * Combines two edits on an already-created workspace: PUT /identity (name/slug/timezone,
 * no step-up) and PUT /markets (primary market/currency/markets list, step-up gated).
 * See docs/onboarding/build-plan.md for the full field-to-endpoint mapping and open questions.
 */
export default function OnboardingWorkspaceRoute() {
  const location = useLocation();
  const navState = (location.state ?? {}) as NavState;

  const { proposedMarkets, isLoading: isLoadingProposed } = useGetProposedMarkets();
  const { supportedCurrencies } = useGetSupportedCurrencies();

  const identity = useUpdateWorkspaceIdentity({
    defaultValues: {
      name: navState.name ?? "",
      timeZoneId: navState.timeZoneId ?? "",
      slug: "",
    },
    onSuccess: async () => {
      const marketsValid = await markets.form.trigger();
      if (!marketsValid) {
        toast.error("Check the markets section before continuing");
        return;
      }
      stepUp.begin();
    },
  });

  const markets = useUpdateWorkspaceMarkets({
    onSuccess: () => {
      toast.success("Workspace set up — on to business model next");
      // TODO: navigate("/onboarding/business-model") once that step is built.
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
    register: registerIdentity,
    watch: watchIdentity,
    setValue: setIdentityValue,
    formState: { errors: identityErrors },
  } = identity.form;

  const {
    watch: watchMarkets,
    setValue: setMarketsValue,
    getValues: getMarketsValues,
    formState: { errors: marketsErrors },
  } = markets.form;

  const slug = watchIdentity("slug");
  const { availability } = useSlugAvailable(slug || "");

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

  const timezoneOptions = useMemo(
    () => (navState.country ? getCountryTimezones(navState.country) : []),
    [navState.country]
  );

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

  const canContinue =
    !isLoadingProposed && !identity.isPending && !markets.isPending && !stepUp.isRequesting;

  return (
    <div>
      <WizardStepper activeStep={1} />

      <div className="mx-auto max-w-3xl px-6 pb-16">
        <h1 className="text-[22px] font-semibold text-ink">Name the workspace and where it lives</h1>
        <p className="mt-2 text-[12.5px] text-ink-3">
          Currency, time zone and language follow each customer's market — these are the defaults
          for reports and for anything that has no market of its own.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="workspace-name" className="text-[11px] text-ink-3">
              Workspace name
            </label>
            <Input
              id="workspace-name"
              placeholder="Kito"
              aria-invalid={!!identityErrors.name}
              className="mt-1.5"
              {...registerIdentity("name")}
            />
            {identityErrors.name && (
              <p className="mt-1.5 text-[11px] text-destructive">{identityErrors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="workspace-slug" className="text-[11px] text-ink-3">
              Address
            </label>
            <Input
              id="workspace-slug"
              placeholder="kito"
              aria-invalid={!!identityErrors.slug}
              className="mt-1.5"
              {...registerIdentity("slug")}
            />
            {identityErrors.slug ? (
              <p className="mt-1.5 text-[11px] text-destructive">{identityErrors.slug.message}</p>
            ) : (
              availability &&
              slug.length >= 3 && (
                <p className={`mt-1.5 text-[10.5px] ${availability.isAvailable ? "text-teal" : "text-destructive"}`}>
                  {availability.isAvailable
                    ? `${slug}.flolyt.com is available`
                    : availability.reason || "Not available"}
                  {!availability.isAvailable && availability.suggestion && ` — try "${availability.suggestion}"`}
                </p>
              )
            )}
            <p className="mt-1.5 text-[10.5px] text-ink-4">accepted once — choose deliberately</p>
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="workspace-timezone" className="text-[11px] text-ink-3">
            Time zone
          </label>
          <SearchableSelect
            id="workspace-timezone"
            options={timezoneOptions}
            value={watchIdentity("timeZoneId") || null}
            onChange={(value) => setIdentityValue("timeZoneId", value, { shouldValidate: true })}
            placeholder="Select a time zone"
            searchPlaceholder="Search time zones..."
            emptyText={navState.country ? "No time zones found" : "Set your country on the previous step first"}
            aria-invalid={!!identityErrors.timeZoneId}
            disabled={timezoneOptions.length === 0}
            className="mt-1.5"
          />
          {identityErrors.timeZoneId && (
            <p className="mt-1.5 text-[11px] text-destructive">{identityErrors.timeZoneId.message}</p>
          )}
        </div>

        <div className="mt-8">
          <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
            Markets you sell in
          </p>

          {isLoadingProposed ? (
            <p className="mt-3 text-[11.5px] text-ink-3">Loading proposed markets...</p>
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
            {marketsErrors.primaryMarketCountry && (
              <p className="mt-1.5 text-[11px] text-destructive">{marketsErrors.primaryMarketCountry.message}</p>
            )}
            <p className="mt-1.5 text-[10.5px] text-ink-4">used when a customer has no market</p>
          </div>

          <div>
            <label htmlFor="reporting-currency" className="text-[11px] text-ink-3">
              Reporting currency
            </label>
            <SearchableSelect
              id="reporting-currency"
              options={currencyOptions}
              value={watchMarkets("reportingCurrency") || null}
              onChange={(value) => setMarketsValue("reportingCurrency", value, { shouldValidate: true })}
              placeholder="Select a currency"
              searchPlaceholder="Search currencies..."
              className="mt-1.5"
            />
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
          onClick={() => identity.form.handleSubmit(identity.onSubmit)()}
          disabled={!canContinue}
          className="mt-8 h-10.5 w-full rounded-card bg-ink text-[13px] font-semibold text-paper hover:bg-ink/90 sm:w-40"
        >
          {identity.isPending || stepUp.isRequesting ? "Saving..." : "Continue"}
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
