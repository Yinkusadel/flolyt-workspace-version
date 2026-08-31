# API endpoint docs

One file per domain, named after the domain (matches the `API_ENDPOINTS` key in
[`src/config/apiConfig.ts`](../../src/config/apiConfig.ts) once wired, e.g. `workspace.md` →
`API_ENDPOINTS.WORKSPACE`).

Each file records every endpoint the user has shared for that domain, whether or not it's
wired into code yet, so we always have a source of truth to check against and correct from.

## Domains

| Domain | File | Status |
| --- | --- | --- |
| Workspace | [workspace.md](workspace.md) | 22/22 wired, 3/22 verified working (`PUT /markets`, `GET /agents`, `POST /onboarding/progress`) |
| Currency | [currency.md](currency.md) | 1/2 verified working, 1/2 wired |
| Auth (step-up only) | [auth.md](auth.md) | 2/2 wired, unverified against a real call |
| Datasources | [datasources.md](datasources.md) | 14/14 wired, `GET /connected`'s no-envelope shape confirmed |
| Teams | [teams.md](teams.md) | 13/13 wired (1 of those, `POST /invitations/accept`, was already built in `auth/` during the auth rebuild) |

## Per-endpoint entry format

Each endpoint in a domain file is recorded as:

```
### METHOD /path/to/endpoint

- **Purpose:** what it's for
- **Auth:** required? which role/scope?
- **Request:** path/query params, body shape
- **Response:** shape (envelope, fields)
- **Used by:** screen(s)/file(s) once wired — "not wired yet" until then
- **Status:** documented | wired | verified working
- **Notes:** anything surprising, or corrections made after the fact
```

## Workflow

1. User pastes/describes an endpoint → add or update its entry in the relevant domain file here.
2. When wiring it into code, follow [[api_endpoint_style]] (service + hook file shape) and
   update the entry's **Used by**/**Status**.
3. If a screen/flow needs an endpoint that hasn't been shared yet, stop and ask the user for it
   rather than guessing the shape — flag it in the relevant domain file under "Missing" too.

## Marking unavailable fields in code

When wiring a previously-mocked screen to a real endpoint and the original design calls for a
field the response doesn't actually carry, don't drop it silently and don't invent a value.
Comment it out in place, annotated with why, so the gap stays visible and greppable
(`Backend does NOT provide`) instead of hidden behind a dropped element or a fabricated number:

```tsx
const metrics = [
  // ❌ Backend does NOT provide: deliveryRate
  // { label: "Delivery Rate", v: fmtPct(d.deliveryRate), ok: d.deliveryRate >= 95 },
  { label: "Soft Bounce Rate", v: fmtPct(compliance.softBounceRate), ... },
];
```

```tsx
<p className="text-2xl font-bold text-emerald-400">
  {/* ❌ backend does NOT provide consentRate */}
  {/* {fmtPct(d.consentRate)} */}
</p>
```

Pair it with a `// NOTE: from backend -> Type.fieldName` comment above fields that *do* map
cleanly, so the response-to-UI mapping is traceable in both directions. Source pattern:
`flolyt-dashboard/src/pages/NewCampaignPage/ComplianceDrawer.tsx`.
