# API endpoint docs

One file per domain, named after the domain (matches the `API_ENDPOINTS` key in
[`src/config/apiConfig.ts`](../../src/config/apiConfig.ts) once wired, e.g. `workspace.md` →
`API_ENDPOINTS.WORKSPACE`).

Each file records every endpoint the user has shared for that domain, whether or not it's
wired into code yet, so we always have a source of truth to check against and correct from.

## Domains

| Domain | File | Status |
| --- | --- | --- |
| Workspace | [workspace.md](workspace.md) | 21/21 wired (no screen yet; markets/revenue-model blocked on step-up flow) |
| Currency | [currency.md](currency.md) | 1/2 verified working, 1/2 wired |
| Auth (step-up only) | [auth.md](auth.md) | 2/2 wired, unverified against a real call |

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
