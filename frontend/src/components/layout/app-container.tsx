import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

export function AppContainer({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12', className)}
      {...props}
    />
  )
}
