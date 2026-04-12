import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border/70 bg-card/90 p-8 text-center shadow-sm backdrop-blur">
        <p className="text-sm font-medium uppercase tracking-[0.32em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          Route not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The URL exists outside the current TaskFlow scaffold. Use the home route to
          continue building from the planned flow.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">
            <ArrowLeft className="size-4" />
            Back to scaffold
          </Link>
        </Button>
      </div>
    </main>
  )
}
