# Eticore frontend

Frontend base in React, TypeScript and Vite for Eticore. It consumes the backend contract documented in [`../docs/api-grafo.md`](../docs/api-grafo.md).

## Connected API flows

- Health status, public catalog search/filter/pagination and public samples.
- Cookie sessions, registration, login, TOTP challenge/setup/confirmation/removal and sign-out.
- Profile read/update, route selection/change/progress, attempt history/resume/results and persisted activity flows.
- Points, ranks and badges.
- Role-guarded account activation, role changes and audit queries.
- Group/member administration and aggregate reports.
- Editorial unit/draft/review/publication lifecycle.
- Legal notice versions, privacy events, user requests and technical publication.

The interface exposes protected operations only to the corresponding roles. Attempt updates use server revisions; correct answers, scoring, reward calculation and report aggregation stay on the API. Request and response payloads follow the backend DTOs documented in the API graph.

All 50 documented application operations have a client call and an interface flow. The deployed host could not be resolved from this environment, so the live session/CORS behavior still needs a smoke check when DNS/network access is available.

## API configuration

`VITE_API_BASE_URL` defaults to `/api/v1`. In development, Vite proxies `/api/v1/*` to the configured `API_PROXY_TARGET`, rewriting it to `/eticore/api/v1/*`; `/health` is forwarded to the deployment context as well. This keeps session requests same-origin in the browser. Vite listens on port `5173`, matching the configured API CORS origin.

Copy `.env.example` to `.env` for local overrides. Never put passwords, private keys, or API credentials in `VITE_*` values. The frontend uses the server's HttpOnly session cookie and does not store tokens.

## Development

### Source layout

- `src/App.tsx` composes navigation and the public/private layouts.
- `src/features/<area>/` keeps each area's API adapter, state hook, model (when needed), and page together. Small areas only contain the files they use; there are no mandatory `hooks/` or `ui/` subfolders.
- `src/shared/` contains the API client and components or types used by multiple areas. Move code here only after a second area needs it.
- `src/index.css` defines Tailwind v4, design tokens, and local Poppins files. `src/styles/components.css` composes feature style modules built with Tailwind `@apply`.

```bash
npm install
npm run dev
```

## Verification

```bash
npm run build
npm run lint
```

Before changing interface or visual identity, read [`docs/brand/PRODUCT_IDENTITY.md`](docs/brand/PRODUCT_IDENTITY.md) and [`docs/brand/FRONTEND_SPEC.md`](docs/brand/FRONTEND_SPEC.md). Tailwind CSS v4 is installed. Approved Figma SVGs and Poppins Regular/Medium/Bold are in `resources/`; the Figma file specifies Caprasimo Regular but does not include its font binary.
