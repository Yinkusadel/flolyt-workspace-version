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
| Lifecycle | [lifecycle.md](lifecycle.md) | 69/69 documented, 69/69 scaffolded (service+hook files, typechecks clean), 1/69 wired (`GET /map`, partial). Full-surface reference (tab matrix, conventions) at [lifecycle-reference.md](lifecycle-reference.md) |
| App shell | [app-shell.md](app-shell.md) | 5/5 documented (`/search /home /inbox /command-bar /sources`), 0/5 wired |
| Rooms | [rooms.md](rooms.md) | 52/52 documented, service+hook scaffolded for all 52, 0/52 wired into a page |

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

## Reusing a mock's label, heading, or narrative copy after wiring

When a live field replaces a mocked value, the label/heading/callout text sitting next to it
needs the same scrutiny as the value itself — a wrong label is as dishonest as a wrong number,
and it's much easier to miss because nothing type-checks against it.

Before keeping any specific-sounding mock copy (a card eyebrow, a section heading, a sentence in
a Callout) on a newly-wired field:

1. **Ask what the wording actually asserts.** A generic description ("Population", "What is
   leaking, in order") stays true regardless of the value underneath it. A specific one ("Acquired
   · 12 months", "Where the 528,000 who never activate are lost") asserts a number, a time window,
   or a named concept that may only have been true for the old mock data.
2. **Re-read this domain's own doc file for a standing note about that exact field/screen** before
   trusting the copy — not just before writing the fetch call. A coverage-tracker note from an
   earlier pass is easy to forget exists once the wiring itself is underway.
3. **Check what a cited note actually confirmed.** A note that verifies a response's *shape*
   (object vs. bare number, nullable vs. required) does not thereby confirm a *semantic* claim
   made elsewhere in the same paragraph. Treat those as two separate questions.
4. **A note ending in an open question ("needs further audit", "not yet confirmed", "❓ open") is
   not settled**, no matter how confident an earlier sentence in the same note reads. The trailing
   caveat is the note's real verdict.
5. **When uncertain, use the plain/generic version of the label** and say so in the PR/summary —
   flag it as a deliberate downgrade pending confirmation, not a final answer. A boring correct
   label beats an interesting wrong one.
6. **Audit every sibling of a caught mistake in the same pass.** If one stage's/item's copy turns
   out to be stale, check every other stage/item using the same pattern before calling the fix
   done — don't wait to be asked about each one individually.

This applies to KPI/stat card labels, table section headings, and narrative Callout text alike —
anywhere static copy sits beside a value that used to be mock and is now live.
