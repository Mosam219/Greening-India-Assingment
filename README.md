# TaskFlow Frontend

Frontend-only implementation of TaskFlow, built as a small but complete task management product against a mocked REST API. The app includes authentication, project and task management flows, optimistic updates, drag-and-drop task movement, and a persistent dark mode toggle.

The application code lives in [`frontend/`](./frontend).

This repository currently contains the frontend application only. Backend, database, migrations, and seed infrastructure mentioned in broader full-stack requirements are outside the scope of this repo.

## Implemented Features

- User-focused landing page with clear auth entry points
- Login and registration with client-side validation
- Persisted auth session with `localStorage`
- Protected routes with redirect back to the intended page after login
- Projects list with loading, error, empty, and create states
- Project detail page with task grouping by status
- Task filtering by `status` and `assignee`
- Task create/edit side panel
- Optimistic task status updates with rollback on failure
- Drag-and-drop task movement between columns
- Drag-and-drop reordering within a column
- Persistent dark mode toggle
- Responsive layouts for mobile and desktop
- Explicit loading, error, and empty states throughout the product

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- `shadcn/ui`-style local UI primitives
- MSW (Mock Service Worker)

## UI And Mocking Choices

### Styling and Components

This project uses `Tailwind CSS` for styling and local `shadcn/ui`-style component primitives in `frontend/src/components/ui`.

### Mock Backend

This project uses `MSW` rather than `json-server`.

Why:

- It intercepts real browser HTTP requests while keeping the frontend pointed at `http://localhost:4000`.
- Auth headers, status codes, delays, and structured errors are exercised through the real fetch layer.
- It makes optimistic updates and rollback behavior easier to test realistically.

Mock handlers live in `frontend/src/mocks`, and the generated service worker lives in `frontend/public/mockServiceWorker.js`.

## Docker

The frontend now includes a production-oriented container setup:

- [`frontend/Dockerfile`](./frontend/Dockerfile): multi-stage frontend build
- [`frontend/nginx/default.conf`](./frontend/nginx/default.conf): SPA-safe Nginx config with history fallback
- [`docker-compose.yml`](./docker-compose.yml): root-level compose file for the frontend service
- [`.env.example`](./.env.example): root-level defaults used by Docker Compose

### Run With Docker

```bash
docker compose up --build
```

Then open `http://localhost:3000` unless you changed `FRONTEND_PORT`.

If you want to override the defaults, copy `.env.example` to `.env` and adjust the values before running Compose.

### Docker Environment

The root [`.env.example`](./.env.example) provides these defaults:

```bash
FRONTEND_PORT=3000
VITE_API_BASE_URL=http://localhost:4000
VITE_ENABLE_API_MOCKS=true
```

Notes:

- `VITE_*` values are build-time arguments for the frontend image.
- With `VITE_ENABLE_API_MOCKS=true`, the app remains frontend-only and serves mocked API responses in the browser.
- If you later connect a real API container, set `VITE_ENABLE_API_MOCKS=false` and point `VITE_API_BASE_URL` to the appropriate API origin.

## Supported API Contract

The frontend is written against the provided backend contract:

- Base URL: `http://localhost:4000`
- Auth endpoints under `/auth/*`
- Projects endpoints under `/projects/*`
- Task endpoints under `/projects/:id/tasks` and `/tasks/:id`

When mocks are enabled, MSW intercepts these requests in the browser and serves seeded responses locally.

## Seeded Reviewer Account

- Email: `test@example.com`
- Password: `password123`

You can also register a new user through the UI.

## Environment

Environment configuration for local non-Docker development is defined in [`frontend/.env.example`](./frontend/.env.example):

```bash
VITE_API_BASE_URL=http://localhost:4000
VITE_ENABLE_API_MOCKS=true
```

`VITE_ENABLE_API_MOCKS=true` is the expected default for this frontend-only submission.

## Run Locally

All commands below are run from the `frontend/` directory.

```bash
cd frontend
pnpm install
pnpm dev
```

Then open the local Vite URL shown in the terminal.

## Useful Scripts

```bash
cd frontend
pnpm dev
pnpm build
pnpm lint
pnpm preview
```

## Project Structure

```text
frontend/
  nginx/        Nginx config for the production container
  public/       Static assets and generated MSW worker
  src/
    app/        Bootstrap, providers, and router
    components/ Shared layout and UI primitives
    config/     Env parsing
    features/   Auth, marketing, projects, tasks, and theme logic
    lib/        API client, query client, utilities, validation helpers
    mocks/      MSW browser setup, handlers, and seeded data
    pages/      Route-level entry files
    types/      Shared API and domain types
```

## Architecture Notes

- Route files are intentionally thin and delegate behavior into feature-level hooks and components.
- Query cache keys are centralized for project/task data consistency.
- Task status changes use optimistic cache updates with rollback if the request fails.
- Task ordering is persisted client-side per project because the provided API contract does not expose a reorder endpoint or task position field.
- Theme selection is applied before React renders to avoid a light-mode flash on refresh.

## Verification

The current handoff has been verified with:

```bash
cd frontend
pnpm lint
pnpm build
```

## Notes

- This submission does not include a real backend or database.
- The root `docker-compose.yml` starts the frontend service only, because this repo does not include API or PostgreSQL code.
- Mock API state is browser-local and resets if the dev session is restarted.
- Assignee labels are derived from project and task context because the provided contract does not include a user listing endpoint.
- Auth state, theme preference, and drag-and-drop task ordering persist in `localStorage`.
