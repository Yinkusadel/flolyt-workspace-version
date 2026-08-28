# Teams endpoints

This is the "send invite" / team-membership endpoint set flagged as missing in the onboarding
build (step 5, "Your team" — see [[flolyt_onboarding_build]]). See
[docs/endpoints/README.md](README.md) for the entry format and workflow.

Base path: `/api/teams` → `TEAMS_BASE_URL` / `API_ENDPOINTS.TEAMS` in
[`src/config/apiConfig.ts`](../../src/config/apiConfig.ts). `API_ENDPOINTS.TEAMS` already existed
in `apiConfig.ts` before this batch (built ahead of the real spec) and matches this doc's paths
exactly — no changes needed there.

All endpoints require `Authorization: Bearer` unless noted. Envelope is the standard
`{ data, messages, succeeded }` shape, **except `POST /{teamId}/invitations`, which has no
`data` field at all** — see its entry below.

Zod validators for the ones with a body live in
[`src/validators/teams.ts`](../../src/validators/teams.ts). Roles are a closed enum:
`Member` | `Lead` | `Administrator` (`USER_ROLES` in that file).

## Endpoints

### POST /api/teams

- **Purpose:** Create a new team.
- **Auth:** authenticated (role unspecified in doc).
- **Request:** `name` (string, required), `description` (nullable string, required key).
- **Response:** `data` = team id (uuid string).
- **Used by:** `services/api/teams/create-team.ts`, `features/teams/use-create-team.ts`. No screen wired yet.
- **Status:** wired

### GET /api/teams

- **Purpose:** List teams.
- **Auth:** authenticated.
- **Request:** query params `searchString` (optional), `pageNumber` (default 1), `pageSize` (default 10).
- **Response:** `data` = array of `{ id, name, description (nullable), companyId, dateCreated, isActive }`, plus flat pagination fields (`currentPage`, `totalPages`, `totalCount`, `pageSize`, `hasPreviousPage`, `hasNextPage`).
- **Used by:** `services/api/teams/get-teams.ts`, `features/teams/use-get-teams.ts`. No screen wired yet.
- **Status:** wired

### GET /api/teams/{teamId}

- **Purpose:** Team detail — the team record plus its members and pending invitations in one call.
- **Auth:** authenticated.
- **Request:** path param `teamId` (uuid, required).
- **Response:** `data`: base team fields + `members: [{ id, teamId, userId, userEmail, userName, roles, dateAdded, isActive }]` + `invitations: [{ id, teamId, email, roles, status, invitedAt, expiresAt, acceptedAt (nullable) }]`.
- **Used by:** `services/api/teams/get-team-by-id.ts`, `features/teams/use-get-team-by-id.ts`. No screen wired yet.
- **Status:** wired

### PUT /api/teams/{teamId}

- **Purpose:** Update a team's name/description.
- **Auth:** authenticated (role unspecified).
- **Request:** path param `teamId`; body `name` (required), `description` (nullable, required key).
- **Response:** `data` = boolean.
- **Used by:** `services/api/teams/update-team.ts`, `features/teams/use-update-team.ts`. No screen wired yet.
- **Status:** wired

### DELETE /api/teams/{teamId}

- **Purpose:** Deactivate a team (soft delete — `isActive: false`, not a hard delete, matching the `isActive` flag returned by `GET /teams`).
- **Auth:** authenticated (role unspecified).
- **Request:** path param `teamId`.
- **Response:** `data` = boolean.
- **Used by:** `services/api/teams/deactivate-team.ts`, `features/teams/use-deactivate-team.ts`. No screen wired yet.
- **Status:** wired

### PUT /api/teams/members/{memberId}/roles

- **Purpose:** Replace a team member's roles.
- **Auth:** admin-only presumed, **not stated explicitly in the doc**. `stepUpChallengeId` (nullable uuid) is present on the body, matching the same step-up-gated pattern as the workspace member/role endpoints ([[flolyt_governance_stepup_reminder]]) — **unconfirmed against the backend**, flag before assuming this is optional in practice.
- **Request:** path param `memberId` (uuid); body `roles` (`UserRole[]`, required — `Member`/`Lead`/`Administrator`), `stepUpChallengeId` (nullable uuid).
- **Response:** `data` = boolean.
- **Used by:** `services/api/teams/update-member-roles.ts`, `features/teams/use-update-member-roles.ts`. No screen wired yet.
- **Status:** wired
- **Notes:** Replaces the whole role set for that membership, not a single add/remove (unlike workspace's separate assign/remove-role endpoints).

### DELETE /api/teams/members/{memberId}

- **Purpose:** Remove a member from a team.
- **Auth:** admin-only presumed, not stated. `stepUpChallengeId` here is an **optional query param**, not a required body field — the doc doesn't mark it required, unlike the fields above.
- **Request:** path param `memberId`; optional query param `stepUpChallengeId` (uuid).
- **Response:** `data` = boolean.
- **Used by:** `services/api/teams/remove-team-member.ts`, `features/teams/use-remove-team-member.ts`. No screen wired yet.
- **Status:** wired

### POST /api/teams/{teamId}/invitations

- **Purpose:** Invite a new team member by email.
- **Auth:** authenticated (role unspecified).
- **Request:** path param `teamId`; body `email` (required), `roles` (`UserRole[]`, required), `functionalRoles` (nullable string array), `stepUpChallengeId` (nullable uuid).
- **Response:** **no `data` field** — only `{ messages, succeeded }`. Every other team endpoint returns `data`; this one's example response doesn't, so the service/hook types deliberately omit it rather than guessing a shape.
- **Used by:** `services/api/teams/invite-team-member.ts`, `features/teams/use-invite-team-member.ts`. No screen wired yet.
- **Status:** wired

### GET /api/teams/{teamId}/invitations

- **Purpose:** List a team's invitations (pending/accepted/expired — `status` is a free string per the doc, not a documented closed enum).
- **Auth:** authenticated.
- **Request:** path param `teamId`; query `pageNumber` (default 1), `pageSize` (default 10).
- **Response:** `data` = array of the same invitation shape as `GET /{teamId}`'s `invitations`, plus flat pagination fields.
- **Used by:** `services/api/teams/get-team-invitations.ts`, `features/teams/use-get-team-invitations.ts`. No screen wired yet.
- **Status:** wired

### GET /api/teams/invitations/details

- **Purpose:** Look up an invitation by its token — feeds the public accept-invitation page before the invitee has signed in.
- **Auth:** presumed unauthenticated (the invitee has no session yet) — same assumption as `POST /invitations/accept` below.
- **Request:** query param `token` (required).
- **Response:** `data`: `{ id, teamId, teamName, email, roles, inviterName, expiresAt, isExpired, userAlreadyExists, requiresRegistration }`.
- **Used by:** `services/api/teams/get-invitation-details.ts`, `features/teams/use-get-invitation-details.ts`. No screen wired yet — pairs with the existing accept-invitation page/flow below once that page needs to render invitation details before the form.
- **Status:** wired

### POST /api/teams/invitations/accept

- **Purpose:** Accept a team invitation — creates the account/membership from the token.
- **Auth:** unauthenticated.
- **Request:** `token`, `firstName`, `lastName` (all required).
- **Response:** `data` = boolean (typed `unknown` in the existing file, unverified against a real response).
- **Used by:** **already built during the auth rebuild**, not this pass — `services/api/auth/accept-invitation.ts`, `features/auth/use-accept-invitation.ts`, wired to the accept-invitation page in the auth flow. Deliberately left in `auth/` rather than duplicated into `teams/` — it's part of that flow's own screen and already uses `TEAMS.ACCEPT_INVITATION` from `apiConfig.ts`.
- **Status:** wired (per the auth rebuild); not independently verified live during this pass.

### DELETE /api/teams/invitations/{invitationId}

- **Purpose:** Revoke a pending invitation.
- **Auth:** authenticated (role unspecified).
- **Request:** path param `invitationId` (uuid).
- **Response:** `data` = boolean.
- **Used by:** `services/api/teams/revoke-team-invitation.ts`, `features/teams/use-revoke-team-invitation.ts`. No screen wired yet.
- **Status:** wired

### POST /api/teams/{teamId}/invitations/resend

- **Purpose:** Resend a team invitation.
- **Auth:** authenticated (role unspecified).
- **Request:** path param `teamId`; body `email` (required), `roles` (`UserRole[]`, required), `functionalRoles` (nullable string array), `stepUpChallengeId` (nullable uuid) — same body shape as the invite endpoint.
- **Response:** `data` = boolean.
- **Used by:** `services/api/teams/resend-team-invitation.ts`, `features/teams/use-resend-team-invitation.ts`. No screen wired yet.
- **Status:** wired
- **Notes:** The hook takes no form of its own — resending re-sends an existing invitation's already-known email/roles rather than collecting new input, so a caller (e.g. a table row action) supplies the payload directly.

## Wiring notes (2026-08-28)

All 12 remaining service files (`src/services/api/teams/`) and hook files (`src/features/teams/`)
built and typecheck clean (`npx tsc --noEmit -p tsconfig.app.json`) — `POST /invitations/accept`
was already wired in `auth/` from the earlier auth rebuild and is documented above rather than
duplicated. Zod schemas in `src/validators/teams.ts`. `API_ENDPOINTS.TEAMS` in `apiConfig.ts`
needed no changes — it already matched this spec exactly.

No screens wired to any of these yet — building the actual "Your team" settings page (onboarding
step 5's real destination, see [[flolyt_onboarding_build]]) is a separate, later step.

## Missing

_None flagged — this batch covered all 13 endpoints the user shared for this domain._
