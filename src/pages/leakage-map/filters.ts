import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import type { GetLeakageV2Params } from "@/services/api/leakage/get-leakage";

/**
 * Market and currency live in the URL: together they decide WHICH view you are on (all markets vs.
 * one market), so they must survive a refresh and be shareable. The remaining controls are plain
 * state, per the app's convention that page-level flow position is URL state and ordinary filters
 * are not.
 *
 * `market` is the explicit attribution filter (`NG`, or `UNASSIGNED` for unattributed exposure);
 * `currency` is the denomination filter. They are separate query params and neither substitutes for
 * the other, even when both are set (`market=NG&currency=NGN`).
 */
export interface LeakageFilters {
  market: string | null;
  currency: string | null;
  mode: string;
  horizon: string;
  /** Only sent when `horizon === "custom"`. */
  horizonDays: number;
  sector: string | null;
  severity: string | null;
  confidence: string | null;
  lifecycleClass: string | null;
}

/**
 * The handoff names EXPECTED as the recommended mode (`executive.recommendedMode`, always EXPECTED),
 * so that is what the first request asks for. The mode toggle still shows the server's own option list.
 */
export const DEFAULT_MODE = "expected";
export const DEFAULT_HORIZON = "90";
export const DEFAULT_CUSTOM_HORIZON_DAYS = 120;

type LocalFilters = Omit<LeakageFilters, "market" | "currency">;

const INITIAL_LOCAL_FILTERS: LocalFilters = {
  mode: DEFAULT_MODE,
  horizon: DEFAULT_HORIZON,
  horizonDays: DEFAULT_CUSTOM_HORIZON_DAYS,
  sector: null,
  severity: null,
  confidence: null,
  lifecycleClass: null,
};

export function useLeakageFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [local, setLocal] = useState<LocalFilters>(INITIAL_LOCAL_FILTERS);

  const market = searchParams.get("market");
  const currency = searchParams.get("currency");

  const filters = useMemo<LeakageFilters>(() => ({ ...local, market, currency }), [local, market, currency]);

  const setUrlParam = useCallback(
    (key: "market" | "currency", value: string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set(key, value);
          else next.delete(key);
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setMarket = useCallback((value: string | null) => setUrlParam("market", value), [setUrlParam]);
  const setCurrency = useCallback((value: string | null) => setUrlParam("currency", value), [setUrlParam]);
  const setLocalFilters = useCallback((patch: Partial<LocalFilters>) => setLocal((prev) => ({ ...prev, ...patch })), []);

  const clearMoreFilters = useCallback(
    () => setLocal((prev) => ({ ...prev, sector: null, severity: null, confidence: null, lifecycleClass: null })),
    []
  );

  const params = useMemo(() => toGetLeakageV2Params(filters), [filters]);

  return { filters, params, setMarket, setCurrency, setLocalFilters, clearMoreFilters };
}

export function toGetLeakageV2Params(filters: LeakageFilters): GetLeakageV2Params {
  return {
    mode: filters.mode,
    horizon: filters.horizon,
    horizonDays: filters.horizon === "custom" ? filters.horizonDays : undefined,
    market: filters.market ?? undefined,
    currency: filters.currency ?? undefined,
    sector: filters.sector ?? undefined,
    severity: filters.severity ?? undefined,
    confidence: filters.confidence ?? undefined,
    lifecycleClass: filters.lifecycleClass ?? undefined,
  };
}

/** How many of the "More filters" controls are active, for the trigger's count badge. */
export function countMoreFilters(filters: LeakageFilters): number {
  return [filters.sector, filters.severity, filters.confidence, filters.lifecycleClass].filter(Boolean).length;
}
