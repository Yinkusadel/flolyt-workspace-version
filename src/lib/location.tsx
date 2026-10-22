import { Country, State, City } from "country-state-city";
import { FlagIcon } from "@/components/flag-icon";

export interface LocationOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

/** All ~195 countries, with a real SVG flag icon (not emoji — see FlagIcon). */
export const getCountryOptions = (): LocationOption[] =>
  Country.getAllCountries()
    .map((country) => ({
      value: country.isoCode,
      label: country.name,
      icon: <FlagIcon code={country.isoCode} />,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

/**
 * States/provinces for a country — empty for countries with no such subdivision
 * (e.g. Singapore, Monaco). Callers should fall back to a free-text input when
 * this comes back empty, not render an empty dropdown.
 */
export const getStateOptions = (countryCode: string): LocationOption[] =>
  State.getStatesOfCountry(countryCode)
    .map((state) => ({ value: state.isoCode, label: state.name }))
    .sort((a, b) => a.label.localeCompare(b.label));

/**
 * Cities for a state, or for the whole country when it has no states. Empty in
 * either case means the same fall-back-to-text-input rule as states.
 */
export const getCityOptions = (countryCode: string, stateCode?: string): LocationOption[] => {
  const cities = stateCode
    ? City.getCitiesOfState(countryCode, stateCode)
    : (City.getCitiesOfCountry(countryCode) ?? []);

  return cities
    .map((city) => ({ value: city.name, label: city.name }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

/** A country's valid IANA timezones — most countries have exactly one. */
export const getCountryTimezones = (countryCode: string): LocationOption[] => {
  const country = Country.getCountryByCode(countryCode);

  return (country?.timezones ?? []).map((tz) => ({
    value: tz.zoneName,
    label: `${tz.tzName} (${tz.gmtOffsetName})`,
  }));
};
