import { LayoutGrid, LogOut, PanelTop } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth";
import { ThemeToggleButton } from "@/features/theme/theme-toggle-button";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    to: "/projects",
    label: "Projects",
    icon: LayoutGrid,
  },
];

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AppNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-4 px-6 py-4 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <NavLink
              to="/projects"
              className="inline-flex items-center gap-3 rounded-2xl border border-border/70 bg-card/80 px-4 py-3 shadow-sm transition-colors hover:border-primary/40"
            >
              <div className="rounded-xl bg-primary/12 p-2 text-primary">
                <PanelTop className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-foreground">
                  TaskFlow
                </p>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Workspace
                </p>
              </div>
            </NavLink>

            <nav className="hidden items-center gap-2 md:flex">
              {navigationItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )
                  }
                >
                  <Icon className="size-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ThemeToggleButton className="sm:self-stretch" />

            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-border/70 bg-card/80 px-3 py-3 shadow-sm">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>

            <Button
              className="sm:self-stretch"
              size="sm"
              variant="outline"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>

        <nav className="flex items-center gap-2 overflow-x-auto pb-1 md:hidden">
          {navigationItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/80 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
