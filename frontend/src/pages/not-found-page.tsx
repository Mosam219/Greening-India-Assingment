import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { AppContainer } from "@/components/layout/app-container";
import { PageShell } from "@/components/layout/page-shell";
import { SectionCard } from "@/components/layout/section-card";
import { Button } from "@/components/ui/button";
import { ThemeToggleButton } from "@/features/theme/theme-toggle-button";

export function NotFoundPage() {
  return (
    <PageShell>
      <AppContainer className="flex min-h-screen flex-col py-6">
        <div className="flex justify-end">
          <ThemeToggleButton />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <SectionCard className="w-full max-w-md p-8 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.32em] text-muted-foreground">
              404
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              Route not found
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This URL does not map to a valid TaskFlow page. Use the home page
              or return to the protected workspace.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link to="/">
                  <ArrowLeft className="size-4" />
                  Back home
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/projects">Open projects</Link>
              </Button>
            </div>
          </SectionCard>
        </div>
      </AppContainer>
    </PageShell>
  );
}
