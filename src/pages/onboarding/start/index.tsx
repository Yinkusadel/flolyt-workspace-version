import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller } from "react-hook-form";
import { Country } from "country-state-city";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useAuth } from "@/utils/auth-context";
import { COOKIE_KEYS, setCookie } from "@/utils/cookies";
import useCreateWorkspace from "@/features/workspace/use-create-workspace";
import useSlugAvailable from "@/features/workspace/use-slug-available";
import useGetDefaultCurrency from "@/features/currency/use-get-default-currency";
import { getCityOptions, getCountryOptions, getCountryTimezones, getStateOptions } from "@/lib/location";

// Not documented anywhere — POST /workspace's employeeCountRange has no listed
// enum, these buckets are a guess pending confirmation.
const EMPLOYEE_COUNT_RANGE_OPTIONS = ["1-10", "11-50", "51-200", "201-1000", "1000+"].map((range) => ({
  value: range,
  label: `${range} employees`,
}));

/**
 * The screen this export is missing: POST /workspace needs 11 fields no screen in
 * flolyt-figma-designs/onboarding collects. Reached right after sign-in when
 * onboardingRequired is true and no workspace exists yet — see
 * docs/onboarding/build-plan.md's "missing pre-workspace screen" section.
 */
export default function OnboardingStartRoute() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const { form, onSubmit, isPending } = useCreateWorkspace({
    onSuccess: (workspaceId) => {
      const values = form.getValues();

      // The JWT itself won't carry this until next login/refresh — save it
      // locally so ProtectedRoute's onboarding gate knows a workspace exists
      // right now, not just after a fresh sign-in. See protected-route.tsx.
      if (user) {
        const updatedUser = { ...user, companyId: workspaceId, companyName: values.name };
        setUser(updatedUser);
        setCookie(COOKIE_KEYS.USER_DATA, JSON.stringify(updatedUser), { expires: 7 });
      }

      navigate("/onboarding/workspace");
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = form;

  const countryCode = watch("country");
  const currency = watch("currency");
  const timeZoneId = watch("timeZoneId");
  const slug = watch("slug") ?? "";
  const { availability } = useSlugAvailable(slug);

  const [stateCode, setStateCode] = useState<string | null>(null);

  // The "https://" prefix is fixed in the UI (see the webSite field below) — the
  // user only ever types/pastes the domain. Strip any protocol they paste anyway
  // so it can't get doubled up into "https://https://...".
  const websiteDomain = (watch("webSite") ?? "").replace(/^https?:\/\//i, "");
  const handleWebsiteDomainChange = (raw: string) => {
    const domain = raw.replace(/^https?:\/\//i, "");
    setValue("webSite", domain ? `https://${domain}` : "", { shouldValidate: true });
  };

  useEffect(() => {
    if (user?.email) setValue("email", user.email, { shouldValidate: true });
  }, [user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  const countryOptions = useMemo(() => getCountryOptions(), []);

  const timezoneOptions = useMemo(
    () => (countryCode ? getCountryTimezones(countryCode) : []),
    [countryCode]
  );

  const stateOptions = useMemo(
    () => (countryCode ? getStateOptions(countryCode) : []),
    [countryCode]
  );
  const hasStates = stateOptions.length > 0;

  const cityOptions = useMemo(() => {
    if (!countryCode) return [];
    if (hasStates && !stateCode) return [];
    return getCityOptions(countryCode, hasStates ? (stateCode ?? undefined) : undefined);
  }, [countryCode, hasStates, stateCode]);
  const hasCities = cityOptions.length > 0;

  // A new country invalidates whatever state/city was picked for the old one,
  // and immediately sets currency/timezone from local data (country-state-city)
  // so Continue is never blocked waiting on a network round trip — the live
  // GET /currency/default call below overrides currency with Flolyt's own
  // authoritative default if/when it resolves, but submission never depends on
  // that call succeeding.
  useEffect(() => {
    setStateCode(null);
    setValue("state", "");
    setValue("city", "");

    if (!countryCode) {
      setValue("currency", "");
      setValue("timeZoneId", "");
      return;
    }

    const fallbackCurrency = Country.getCountryByCode(countryCode)?.currency;
    setValue("currency", fallbackCurrency ?? "", { shouldValidate: true });

    const zones = getCountryTimezones(countryCode);
    setValue("timeZoneId", zones[0]?.value ?? "", { shouldValidate: true });
  }, [countryCode]); // eslint-disable-line react-hooks/exhaustive-deps

  const { defaultCurrency } = useGetDefaultCurrency(countryCode || null);

  useEffect(() => {
    if (defaultCurrency?.currency) {
      setValue("currency", defaultCurrency.currency, { shouldValidate: true });
    }
  }, [defaultCurrency]); // eslint-disable-line react-hooks/exhaustive-deps

  // isValid alone (from the zod resolver) already covers every required field
  // in the schema — name/description/jobRole/etc as well as country/currency/
  // timeZoneId. The extra country/currency/timeZoneId check just guards the
  // instant right after a country is picked, before react-hook-form's own
  // re-validation of the silently-set fields has caught up.
  const canSubmit = isValid && Boolean(countryCode && currency && timeZoneId);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-[22px] font-semibold text-ink">Tell us about your business</h1>
      <p className="mt-2 text-[12.5px] text-ink-3">
        A quick set of basics before we set up your workspace. You'll name it and pick your
        markets on the next step.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-[11px] text-ink-3">
              Business name
            </label>
            <Input
              id="name"
              placeholder="Kito"
              aria-invalid={!!errors.name}
              className="mt-1.5"
              {...register("name")}
            />
            {errors.name && <p className="mt-1.5 text-[11px] text-destructive">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="slug" className="text-[11px] text-ink-3">
              Workspace address
            </label>
            <Input
              id="slug"
              placeholder="kito"
              aria-invalid={!!errors.slug}
              className="mt-1.5"
              {...register("slug")}
            />
            {errors.slug ? (
              <p className="mt-1.5 text-[11px] text-destructive">{errors.slug.message}</p>
            ) : (
              availability &&
              slug.length >= 3 && (
                <p className={`mt-1.5 text-[10.5px] ${availability.isAvailable ? "text-teal" : "text-destructive"}`}>
                  {availability.isAvailable
                    ? `${slug}.flolyt.com is available`
                    : availability.reason || "Not available"}
                  {!availability.isAvailable && availability.suggestion && `. Try "${availability.suggestion}"`}
                </p>
              )
            )}
            <p className="mt-1.5 text-[10.5px] text-ink-4">
              {slug ? `${slug}.flolyt.com` : "yourname.flolyt.com"}. Accepted once, choose deliberately
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="text-[11px] text-ink-3">
            What does your business do?
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="A short description of what you sell and to whom"
            aria-invalid={!!errors.description}
            className="mt-1.5 w-full resize-y rounded-panel border border-line bg-paper-2 px-2.5 py-2 text-[12.5px] text-ink outline-none placeholder:text-ink-4 focus:border-ring"
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-1.5 text-[11px] text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="text-[11px] text-ink-3">
              Work email
            </label>
            <div
              id="email"
              className="mt-1.5 flex h-9 w-full items-center rounded-panel border border-border bg-paper-2 px-2.5 text-[12.5px] text-ink-3"
            >
              {user?.email ?? ""}
            </div>
          </div>

          <div>
            <label htmlFor="jobRole" className="text-[11px] text-ink-3">
              Your role
            </label>
            <Input
              id="jobRole"
              placeholder="Founder, Head of Growth..."
              aria-invalid={!!errors.jobRole}
              className="mt-1.5"
              {...register("jobRole")}
            />
            {errors.jobRole && (
              <p className="mt-1.5 text-[11px] text-destructive">{errors.jobRole.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="employeeCountRange" className="text-[11px] text-ink-3">
            Company size
          </label>
          <Controller
            control={control}
            name="employeeCountRange"
            render={({ field }) => (
              <SearchableSelect
                id="employeeCountRange"
                options={EMPLOYEE_COUNT_RANGE_OPTIONS}
                value={field.value || null}
                onChange={field.onChange}
                placeholder="Select a range"
                searchPlaceholder="Search..."
                className="mt-1.5"
                aria-invalid={!!errors.employeeCountRange}
              />
            )}
          />
          {errors.employeeCountRange && (
            <p className="mt-1.5 text-[11px] text-destructive">{errors.employeeCountRange.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="country" className="text-[11px] text-ink-3">
              Country
            </label>
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <SearchableSelect
                  id="country"
                  options={countryOptions}
                  value={field.value || null}
                  onChange={field.onChange}
                  placeholder="Select a country"
                  searchPlaceholder="Search countries..."
                  className="mt-1.5"
                  aria-invalid={!!errors.country}
                />
              )}
            />
            {errors.country && (
              <p className="mt-1.5 text-[11px] text-destructive">{errors.country.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="text-[11px] text-ink-3">
              State / Province
            </label>
            {hasStates ? (
              <SearchableSelect
                id="state"
                options={stateOptions}
                value={stateCode}
                onChange={(code) => {
                  setStateCode(code);
                  const name = stateOptions.find((option) => option.value === code)?.label ?? "";
                  setValue("state", name, { shouldValidate: true });
                }}
                placeholder="Select a state"
                searchPlaceholder="Search states..."
                disabled={!countryCode}
                className="mt-1.5"
                aria-invalid={!!errors.state}
              />
            ) : (
              <Input
                id="state"
                placeholder="State or province"
                disabled={!countryCode}
                aria-invalid={!!errors.state}
                className="mt-1.5"
                {...register("state")}
              />
            )}
            {errors.state && <p className="mt-1.5 text-[11px] text-destructive">{errors.state.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="text-[11px] text-ink-3">
              City
            </label>
            {hasCities ? (
              <SearchableSelect
                id="city"
                options={cityOptions}
                value={watch("city") || null}
                onChange={(value) => setValue("city", value, { shouldValidate: true })}
                placeholder="Select a city"
                searchPlaceholder="Search cities..."
                disabled={hasStates && !stateCode}
                className="mt-1.5"
                aria-invalid={!!errors.city}
              />
            ) : (
              <Input
                id="city"
                placeholder="City"
                disabled={hasStates && !stateCode}
                aria-invalid={!!errors.city}
                className="mt-1.5"
                {...register("city")}
              />
            )}
            {errors.city && <p className="mt-1.5 text-[11px] text-destructive">{errors.city.message}</p>}
          </div>

          <div>
            <label htmlFor="timeZoneId" className="text-[11px] text-ink-3">
              Time zone
            </label>
            <SearchableSelect
              id="timeZoneId"
              options={timezoneOptions}
              value={timeZoneId || null}
              onChange={(value) => setValue("timeZoneId", value, { shouldValidate: true })}
              placeholder="Select a country first"
              searchPlaceholder="Search time zones..."
              disabled={!countryCode}
              className="mt-1.5"
              aria-invalid={!!errors.timeZoneId}
            />
            {errors.timeZoneId && (
              <p className="mt-1.5 text-[11px] text-destructive">{errors.timeZoneId.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="location" className="text-[11px] text-ink-3">
              Business address
            </label>
            <Input
              id="location"
              placeholder="14 Broad Street"
              aria-invalid={!!errors.location}
              className="mt-1.5"
              {...register("location")}
            />
            {errors.location && (
              <p className="mt-1.5 text-[11px] text-destructive">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="webSite" className="text-[11px] text-ink-3">
              Website
            </label>
            <div
              className={`mt-1.5 flex h-9 w-full items-center rounded-panel border bg-paper-2 pl-2.5 text-[12.5px] transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 ${
                errors.webSite ? "border-destructive ring-3 ring-destructive/20" : "border-border hover:border-ink-4"
              }`}
            >
              <span className="shrink-0 text-ink-4 select-none">https://</span>
              <input
                id="webSite"
                type="text"
                placeholder="www.example.com"
                aria-invalid={!!errors.webSite}
                value={websiteDomain}
                onChange={(e) => handleWebsiteDomainChange(e.currentTarget.value)}
                className="h-full w-full bg-transparent px-1 text-ink outline-none placeholder:text-ink-4"
              />
            </div>
            {errors.webSite && (
              <p className="mt-1.5 text-[11px] text-destructive">{errors.webSite.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="zipCode" className="text-[11px] text-ink-3">
              Zip code <span className="text-ink-4">(optional)</span>
            </label>
            <Input id="zipCode" placeholder="100001" className="mt-1.5" {...register("zipCode")} />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="text-[11px] text-ink-3">
              Phone <span className="text-ink-4">(optional)</span>
            </label>
            <Input id="phoneNumber" placeholder="+234..." className="mt-1.5" {...register("phoneNumber")} />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending || !canSubmit}
          className="h-10.5 w-full rounded-card bg-ink px-6 text-[13px] font-semibold text-paper hover:bg-ink/90 sm:w-auto"
        >
          {isPending ? "Creating..." : "Continue"}
        </Button>
      </form>
    </div>
  );
}
