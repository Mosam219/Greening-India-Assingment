import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { AppContainer } from '@/components/layout/app-container'
import { PageHeader } from '@/components/layout/page-header'
import { PageShell } from '@/components/layout/page-shell'
import { SectionCard } from '@/components/layout/section-card'
import { ThemeToggleButton } from '@/features/theme/theme-toggle-button'

type HighlightItem = {
  eyebrow: string
  title: string
  description: string
}

type AuthPageFrameProps = {
  badge: string
  title: string
  description: string
  highlights: HighlightItem[]
  children: ReactNode
  footer: ReactNode
}

export function AuthPageFrame({
  badge,
  title,
  description,
  highlights,
  children,
  footer,
}: AuthPageFrameProps) {
  return (
    <PageShell decorated>
      <AppContainer className="flex min-h-screen flex-col py-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <Link
              to="/"
              className="text-sm font-medium uppercase tracking-[0.34em] text-muted-foreground transition-colors hover:text-foreground"
            >
              TaskFlow
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Frontend take-home with a mock backend contract.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-border/70 bg-card/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground shadow-sm backdrop-blur">
              {badge}
            </div>
            <ThemeToggleButton />
          </div>
        </header>

        <div className="grid flex-1 gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div>
            <PageHeader eyebrow="Authentication" title={title} description={description} />

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <SectionCard key={item.title} className="h-full bg-card/70 p-5 sm:p-6">
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                    {item.eyebrow}
                  </p>
                  <h2 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </SectionCard>
              ))}
            </div>
          </div>

          <SectionCard className="w-full max-w-xl justify-self-center border-border/80 bg-card/92 p-6 sm:p-8">
            {children}
            <div className="mt-8 border-t border-border/70 pt-6">{footer}</div>
          </SectionCard>
        </div>
      </AppContainer>
    </PageShell>
  )
}
