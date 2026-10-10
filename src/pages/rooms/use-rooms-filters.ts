import * as React from "react";
import { useSearchParams } from "react-router-dom";

import type { GetRoomsParams } from "@/services/api/rooms/get-rooms";
import type { RoomViewFilterDto } from "@/services/api/rooms/get-room-views";
import type { CreateRoomViewFilterInput } from "@/services/api/rooms/create-room-view";
import { ROOM_STATES, type RoomStateFilter } from "@/pages/rooms/labels";

export interface RoomsFilters {
  q: string;
  state: RoomStateFilter;
  currency: string;
  stage: string;
  condition: string;
  owner: string;
  /** Kept as typed text; only sent once a currency is chosen (it compares within one currency). */
  min: string;
  archived: boolean;
}

const DEFAULT_FILTERS: RoomsFilters = {
  q: "",
  state: "open",
  currency: "",
  stage: "",
  condition: "",
  owner: "",
  min: "",
  archived: false,
};

const parseState = (value: string | null | undefined): RoomStateFilter =>
  ROOM_STATES.includes(value as RoomStateFilter) ? (value as RoomStateFilter) : "open";

/** Every filter lives in the URL, so a filtered view is a shareable link. Defaults are omitted. */
const serialize = (filters: RoomsFilters): URLSearchParams => {
  const next = new URLSearchParams();
  if (filters.q) next.set("q", filters.q);
  if (filters.state !== "open") next.set("state", filters.state);
  if (filters.currency) next.set("currency", filters.currency);
  if (filters.stage) next.set("stage", filters.stage);
  if (filters.condition) next.set("condition", filters.condition);
  if (filters.owner) next.set("owner", filters.owner);
  if (filters.currency && filters.min) next.set("min", filters.min);
  if (filters.archived) next.set("archived", "1");
  return next;
};

/** Filters -> GET /rooms query params. */
export const toRoomsParams = (filters: RoomsFilters): GetRoomsParams => {
  const min = filters.currency && filters.min ? Number(filters.min) : undefined;
  return {
    q: filters.q || undefined,
    // GET /rooms returns open rooms only unless `includeArchived` or an explicit `state` is set,
    // so "include archived" on the default Open state means: leave `state` off.
    state: filters.archived && filters.state === "open" ? undefined : filters.state,
    includeArchived: filters.archived || undefined,
    currency: filters.currency || undefined,
    stage: filters.stage || undefined,
    condition: filters.condition || undefined,
    owner: filters.owner || undefined,
    minAmountAtRisk: min !== undefined && Number.isFinite(min) ? min : undefined,
  };
};

/** Filters -> the body a saved view stores. */
export const toViewFilter = (filters: RoomsFilters): CreateRoomViewFilterInput => {
  const params = toRoomsParams(filters);
  return {
    query: params.q,
    state: filters.state,
    currency: params.currency,
    stage: params.stage,
    condition: params.condition,
    owner: params.owner,
    minAmountAtRisk: params.minAmountAtRisk,
    includeArchived: filters.archived,
  };
};

export const viewToFilters = (filter: RoomViewFilterDto): RoomsFilters => ({
  q: filter.query ?? "",
  state: parseState(filter.state),
  currency: filter.currency ?? "",
  stage: filter.stage ?? "",
  condition: filter.condition ?? "",
  owner: filter.owner ?? "",
  min: filter.currency && filter.minAmountAtRisk != null ? String(filter.minAmountAtRisk) : "",
  archived: Boolean(filter.includeArchived),
});

export const filtersEqual = (a: RoomsFilters, b: RoomsFilters) =>
  serialize(a).toString() === serialize(b).toString();

export const isDefaultFilters = (filters: RoomsFilters) => filtersEqual(filters, DEFAULT_FILTERS);

export function useRoomsFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = React.useMemo<RoomsFilters>(
    () => ({
      q: searchParams.get("q") ?? "",
      state: parseState(searchParams.get("state")),
      currency: searchParams.get("currency") ?? "",
      stage: searchParams.get("stage") ?? "",
      condition: searchParams.get("condition") ?? "",
      owner: searchParams.get("owner") ?? "",
      min: searchParams.get("min") ?? "",
      archived: searchParams.get("archived") === "1",
    }),
    [searchParams]
  );

  const update = React.useCallback(
    (patch: Partial<RoomsFilters>) => {
      setSearchParams(serialize({ ...filters, ...patch }), { replace: true });
    },
    [filters, setSearchParams]
  );

  const replaceAll = React.useCallback(
    (next: RoomsFilters) => setSearchParams(serialize(next), { replace: true }),
    [setSearchParams]
  );

  const clear = React.useCallback(
    () => setSearchParams(new URLSearchParams(), { replace: true }),
    [setSearchParams]
  );

  return { filters, update, replaceAll, clear };
}
