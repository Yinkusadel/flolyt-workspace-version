# Currency endpoints

Base path: `/api/flolyt/currency` → `CURRENCY_BASE_URL` / `API_ENDPOINTS.CURRENCY` in
[`src/config/apiConfig.ts`](../../src/config/apiConfig.ts). Neither endpoint had a service/hook
file or documentation until the onboarding build needed them for screen 03's currency picker and
the missing pre-workspace screen's silent timezone/currency defaults.

## GET /api/flolyt/currency/supported

- **Purpose:** The flat list of currencies Flolyt can report figures in — screen 03's "Reporting
  currency" dropdown, and the currency half of what `PUT /markets` validates against (see that
  endpoint's note: "a market's currency is validated against what Flolyt can *report* in").
- **Request:** none.
- **Response:**
  ```ts
  interface SupportedCurrenciesResponse {
    currencies: string[];
    defaultFallback: string;
  }
  ```
- **Used by:** `services/api/currency/get-supported-currencies.ts`, `features/currency/use-get-supported-currencies.ts`, wired to `/onboarding/workspace` (screen 03's "Reporting currency" dropdown).
- **Status:** wired
- **Notes:** No country data in this response at all — earlier assumption that this endpoint
  might double as a country list was wrong, corrected mid-session. This is currencies only.

## GET /api/flolyt/currency/default

- **Purpose:** The default currency for a given country — used to silently pre-fill the new
  business-details screen's currency (a required `POST /workspace` field with no visible input on
  that screen, deferred to screen 03 for the real edit).
- **Request:** `countryCode`, presumed query param — the URL in `apiConfig.ts` has no `{placeholder}`
  segment, and the response echoes `countryCode` back the same way `GET /slug-available` echoes
  `slug`. **Assumption, not confirmed** — verify against a real call before trusting it.
- **Response:**
  ```ts
  interface DefaultCurrencyResponse {
    countryCode: string;
    currency: string;
    isFallback: boolean;
  }
  ```
- **Used by:** `services/api/currency/get-default-currency.ts`, `features/currency/use-get-default-currency.ts`, wired to `/onboarding/start` (silent currency default once a country is picked, not shown as its own field).
- **Status:** wired
- **Notes:** `isFallback` presumably means "this country has no specific default, here's the
  generic one" — mirrors `defaultFallback` on the supported-currencies response. Render
  accordingly if ever surfaced to a user (don't state a fallback as if it were certain).

## Missing

_Request parameter shape for `GET /default` is inferred, not confirmed — flag if the countryCode
turns out to be a path param instead of a query param._
