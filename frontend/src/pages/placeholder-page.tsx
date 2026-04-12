import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

type PlaceholderPageProps = {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-2xl rounded-[2rem] border border-border/70 bg-card/90 p-8 shadow-sm backdrop-blur sm:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
          TaskFlow
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
          {description}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="size-4" />
              Back to scaffold
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/projects">
              Continue to app routes
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
