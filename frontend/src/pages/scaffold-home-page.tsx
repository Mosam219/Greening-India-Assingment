import { ArrowRight, LayoutTemplate, Palette, Route } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const routeCards = [
  {
    title: 'Authentication routes',
    description: 'Dedicated screens already reserved for login and registration flows.',
    href: '/login',
  },
  {
    title: 'Projects workspace',
    description: 'A top-level projects route is ready for list fetching and project creation.',
    href: '/projects',
  },
  {
    title: 'Project detail route',
    description: 'Nested detail pages are ready for task filters, dialogs, and optimistic updates.',
    href: '/projects/demo-project',
  },
]

const stackCards = [
  {
    title: 'Tailwind + shadcn/ui',
    description: 'Design tokens, utility styling, and a first shared UI primitive are in place.',
    icon: Palette,
  },
  {
    title: 'Vite + TypeScript',
    description: 'The app builds on a clean React 19 Vite baseline with path aliases configured.',
    icon: LayoutTemplate,
  },
  {
    title: 'Router scaffold',
    description: 'The final route map exists now, so feature work can slot into stable paths.',
    icon: Route,
  },
]

export function ScaffoldHomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <div className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-primary/18 blur-3xl" />
      <div className="absolute right-[-3rem] top-40 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.34em] text-muted-foreground">
              TaskFlow
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Frontend scaffold for the take-home project.
            </p>
          </div>
          <div className="rounded-full border border-border/70 bg-card/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground shadow-sm backdrop-blur">
            Step 1
          </div>
        </header>

        <section className="grid flex-1 gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.34em] text-primary">
              React + Tailwind + shadcn/ui
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              The base app is ready for auth, projects, and task management flows.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              This scaffold replaces the default Vite starter with the route skeleton,
              design tokens, aliases, and shared UI setup we need before implementing
              state and feature logic.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/projects">
                  Open project routes
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">Preview auth routes</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/70 bg-card/85 p-6 shadow-sm backdrop-blur sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Foundation
            </p>
            <div className="mt-6 space-y-4">
              {stackCards.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border/70 bg-background/80 p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-accent p-2 text-accent-foreground">
                      <Icon className="size-4" />
                    </div>
                    <h2 className="text-base font-semibold text-foreground">{title}</h2>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-8">
          <div className="grid gap-4 md:grid-cols-3">
            {routeCards.map((card) => (
              <Link
                key={card.href}
                to={card.href}
                className="group rounded-[1.75rem] border border-border/70 bg-card/85 p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:border-primary/40"
              >
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
                  Route
                </p>
                <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {card.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
                  Open route
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
