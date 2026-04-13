import { Outlet } from 'react-router-dom'

import { AppNavbar } from '@/components/layout/app-navbar'
import { AppContainer } from '@/components/layout/app-container'
import { PageShell } from '@/components/layout/page-shell'

export function AppShellLayout() {
  return (
    <PageShell decorated>
      <div className="relative flex min-h-screen flex-col">
        <AppNavbar />
        <AppContainer className="flex max-w-[88rem] flex-1 flex-col py-8 sm:py-10">
          <Outlet />
        </AppContainer>
      </div>
    </PageShell>
  )
}
