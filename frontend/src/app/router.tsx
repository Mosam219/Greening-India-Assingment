import { createBrowserRouter } from "react-router-dom";

import { AppShellLayout } from "@/components/layout/app-shell-layout";
import { ProtectedRoute } from "@/features/auth";
import { NotFoundPage } from "@/pages/not-found-page";
import { ProjectDetailPage } from "@/pages/project-detail-page";
import { ProjectsListPage } from "@/pages/projects-list-page";
import { RegisterPage } from "@/pages/register-page";
import { ScaffoldHomePage } from "@/pages/scaffold-home-page";
import { LoginScreen } from "@/pages/login-screen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ScaffoldHomePage />,
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/projects",
    element: (
      <ProtectedRoute>
        <AppShellLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ProjectsListPage />,
      },
      {
        path: ":projectId",
        element: <ProjectDetailPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
