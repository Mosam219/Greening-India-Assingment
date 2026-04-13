# TaskFlow Frontend

## 1. Overview

This repository contains a frontend-only implementation of **TaskFlow**, a small project and task management application. It includes authentication flows, a projects dashboard, project detail views, task creation and editing, optimistic updates, drag-and-drop task movement, and a persistent dark mode toggle.

The app is built against a mocked REST API contract using browser-side request interception, so the UI behaves like it is talking to a real backend at `http://localhost:4000` without requiring an API server in this repo.

### Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- Tailwind CSS
- Local `shadcn/ui`-style component primitives
- MSW (Mock Service Worker)
- Docker + Nginx for containerized frontend delivery

### Implemented Product Features

- User-focused landing page
- Login and registration with client-side validation
- Persisted auth state via `localStorage`
- Protected routes with redirect-after-login behavior
- Projects list with loading, error, empty, and create states
- Project detail page with grouped task columns
- Task filtering by status and assignee
- Task create/edit side panel
- Optimistic task status updates with rollback on failure
- Drag-and-drop task movement between status columns
- Persistent dark mode toggle
- Responsive layout for mobile and desktop

## 2. Architecture Decisions

### Why it is structured this way

- **Thin route files**: route-level page files are kept small and mostly delegate to feature-specific hooks and view components. This keeps routing concerns separate from business logic and makes refactors safer.
- **Feature-oriented modules**: auth, marketing, projects, tasks, and theme state are grouped by domain instead of by file type alone. That keeps related query logic, UI, and utilities close together.
- **MSW for the backend contract**: I used MSW instead of a simple in-memory function layer so the app still performs real HTTP requests, sends auth headers, and handles realistic status codes, delays, and structured error responses.
- **TanStack Query for server state**: project and task data are query-driven, which makes loading/error states explicit and supports optimistic updates with rollback.
- **Local UI primitives**: instead of pulling a large component library runtime into the project, I used Tailwind with local `shadcn/ui`-style primitives for predictable styling and easier control over the look and interaction details.

### Tradeoffs

- **Frontend-only scope**: this repo intentionally does not include a real API, database, PostgreSQL container, migrations, or seed pipeline. That keeps the submission aligned with the chosen scope, but it also means some infrastructure requirements from a full-stack version are documented as not applicable here.
- **Mocked users list omission**: the provided API contract does not include a user listing endpoint, so assignee labels are derived from the project and task context already available.
- **Websocket or SSE support**: Real-time task updates via WebSocket or SSE

### Intentionally left out

- Real backend/API server
- PostgreSQL
- Migrations and seed runner
- Automated end-to-end or unit test suite
- Multi-user collaborative sync beyond the mocked browser session

Those were left out because this repo was intentionally built as a **frontend-only submission with mocked APIs**, and expanding beyond that would have changed the scope substantially.

### Current frontend structure

```text
frontend/
  nginx/        Nginx config for the containerized SPA
  public/       Static assets and generated MSW worker
  src/
    app/        App bootstrap, providers, and router
    components/ Shared layout and UI primitives
    config/     Env parsing
    features/   Auth, marketing, projects, tasks, and theme logic
    lib/        API client, query client, validation helpers, utilities
    mocks/      MSW handlers, browser setup, seeded mock data
    pages/      Route entry files
    types/      Shared domain and API types
```

## 3. Running Locally

Assume Docker is installed and available.

```bash
git clone https://github.com/Mosam219/Greening-India-Assingment.git taskflow
cd taskflow
cp .env.example .env
docker compose up --build
```

App available at:

```text
http://localhost:3000
```

### Notes

- The root [`docker-compose.yml`](./docker-compose.yml) starts the frontend service only, because this repository does not include API or PostgreSQL services.
- The frontend image is built from [`frontend/Dockerfile`](./frontend/Dockerfile) and served through Nginx with SPA route fallback configured in [`frontend/nginx/default.conf`](./frontend/nginx/default.conf).

### Environment Variables

Root [`.env.example`](./.env.example):

```bash
FRONTEND_PORT=3000
VITE_API_BASE_URL=http://localhost:4000
VITE_ENABLE_API_MOCKS=true
```

- `FRONTEND_PORT` controls the host port exposed by Docker Compose.
- `VITE_API_BASE_URL` is the API base URL compiled into the frontend.
- `VITE_ENABLE_API_MOCKS=true` keeps the repo self-contained by enabling MSW in the browser.

## 4. Running Migrations

Not applicable in this repository.

This repo does **not** include:

- a backend service
- a PostgreSQL database
- migration files
- a seed runner

Because the submission is frontend-only, there are no migrations to run locally.

## 5. Test Credentials

Use the seeded reviewer account:

```text
Email:    test@example.com
Password: password123
```

You can also register a new user through the UI.

## 6. API Reference

This app implements the following mocked API contract through MSW. The frontend sends requests as if the backend were running at `http://localhost:4000`.

### Auth

#### `POST /auth/register`

Request:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123"
}
```

Response `201`:

```json
{
  "token": "<jwt>",
  "user": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

#### `POST /auth/login`

Request:

```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

Response `200`:

```json
{
  "token": "<jwt>",
  "user": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

### Projects

#### `GET /projects`

Requires:

```text
Authorization: Bearer <token>
```

Response `200`:

```json
{
  "projects": [
    {
      "id": "uuid",
      "name": "Website Redesign",
      "description": "Q2 project",
      "owner_id": "uuid",
      "created_at": "2026-04-01T10:00:00Z"
    }
  ]
}
```

#### `POST /projects`

Request:

```json
{
  "name": "New Project",
  "description": "Optional description"
}
```

Response `201`:

```json
{
  "id": "uuid",
  "name": "New Project",
  "description": "Optional description",
  "owner_id": "uuid",
  "created_at": "2026-04-09T10:00:00Z"
}
```

#### `GET /projects/:id`

Response `200`:

```json
{
  "id": "uuid",
  "name": "Website Redesign",
  "description": "Q2 project",
  "owner_id": "uuid",
  "tasks": [
    {
      "id": "uuid",
      "title": "Design homepage",
      "status": "in_progress",
      "priority": "high",
      "assignee_id": "uuid",
      "due_date": "2026-04-15",
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

#### `PATCH /projects/:id`

Request:

```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

Response `200`: updated project object

#### `DELETE /projects/:id`

Response `204 No Content`

### Tasks

#### `GET /projects/:id/tasks?status=todo&assignee=uuid`

Response `200`:

```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Design homepage",
      "description": "...",
      "status": "todo",
      "priority": "high",
      "assignee_id": "uuid",
      "due_date": "2026-04-15",
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

#### `POST /projects/:id/tasks`

Request:

```json
{
  "title": "Design homepage",
  "description": "...",
  "priority": "high",
  "assignee_id": "uuid",
  "due_date": "2026-04-15"
}
```

Response `201`: created task object

#### `PATCH /tasks/:id`

Request:

```json
{
  "title": "Updated title",
  "status": "done",
  "priority": "low",
  "assignee_id": "uuid",
  "due_date": "2026-04-20"
}
```

Response `200`: updated task object

#### `DELETE /tasks/:id`

Response `204 No Content`

### Error Responses

Validation error:

```json
{
  "error": "validation failed",
  "fields": {
    "email": "is required"
  }
}
```

Unauthenticated:

```json
{
  "error": "unauthorized"
}
```

Forbidden:

```json
{
  "error": "forbidden"
}
```

Not found:

```json
{
  "error": "not found"
}
```

## 7. What I'd Do With More Time

- I could have implemented better UI/UX designs
- I would have tried to implement a backend.
- I would have implemented different types of views for projects and the project details page. Like table view, column view (same like Jira).

### Shortcuts I took

- I kept the backend mocked with MSW instead of implementing the full stack.
- I limited drag-and-drop to status-column moves because the provided contract does not support persisted custom ordering.
- I optimized primarily for a polished, production-shaped frontend architecture rather than full backend infrastructure coverage in this repo.
