import { createBrowserRouter } from 'react-router-dom'

import { NotFoundPage } from '@/pages/not-found-page'
import { PlaceholderPage } from '@/pages/placeholder-page'
import { ScaffoldHomePage } from '@/pages/scaffold-home-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ScaffoldHomePage />,
  },
  {
    path: '/login',
    element: (
      <PlaceholderPage
        title="Login Route"
        description="Authentication UI and protected-route behavior land in the next steps."
      />
    ),
  },
  {
    path: '/register',
    element: (
      <PlaceholderPage
        title="Register Route"
        description="Client-side validation and auth wiring will be implemented after the scaffold."
      />
    ),
  },
  {
    path: '/projects',
    element: (
      <PlaceholderPage
        title="Projects Route"
        description="This route is reserved for the accessible-projects list and create-project flow."
      />
    ),
  },
  {
    path: '/projects/:projectId',
    element: (
      <PlaceholderPage
        title="Project Detail Route"
        description="Task lists, filters, and create or edit interactions will attach here."
      />
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
