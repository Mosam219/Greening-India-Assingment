import { ArrowRight, LogIn, PanelTop, Sparkles, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

import { AppContainer } from "@/components/layout/app-container";
import { PageShell } from "@/components/layout/page-shell";
import { SectionCard } from "@/components/layout/section-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth";
import {
  previewColumns,
  valueCards,
  workflowBenefits,
  workflowSteps,
} from "@/features/marketing/landing-content";
import { ThemeToggleButton } from "@/features/theme/theme-toggle-button";

export function LandingPageView() {
  const { isAuthenticated, user } = useAuth();
  const primaryAction = isAuthenticated
    ? {
        href: "/projects",
        label: "Open my workspace",
        icon: ArrowRight,
      }
    : {
        href: "/register",
        label: "Create account",
        icon: UserPlus,
      };
  const secondaryAction = isAuthenticated
    ? {
        href: "/projects",
        label: "View projects",
        icon: ArrowRight,
      }
    : {
        href: "/login",
        label: "Sign in",
        icon: LogIn,
      };
  const PrimaryActionIcon = primaryAction.icon;
  const SecondaryActionIcon = secondaryAction.icon;

  return (
    <PageShell decorated>
      <AppContainer className="relative flex min-h-screen flex-col py-6 sm:py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-3 rounded-full border border-border/70 bg-card/80 px-4 py-3 shadow-sm backdrop-blur"
          >
            <div className="rounded-full bg-primary/14 p-2 text-primary">
              <PanelTop className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-foreground">
                TaskFlow
              </p>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Plan work clearly
              </p>
            </div>
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ThemeToggleButton />
            <Button asChild size="sm" variant="ghost">
              <Link to={secondaryAction.href}>
                <SecondaryActionIcon className="size-4" />
                {secondaryAction.label}
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to={primaryAction.href}>
                <PrimaryActionIcon className="size-4" />
                {primaryAction.label}
              </Link>
            </Button>
          </div>
        </header>

        <section className="grid flex-1 gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="size-4" />A calmer way to manage projects
            </div>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Keep work moving without losing the details.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              TaskFlow helps you organize projects, assign tasks, and track
              progress in one place so your team knows what needs attention
              right now.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to={primaryAction.href}>
                  <PrimaryActionIcon className="size-4" />
                  {primaryAction.label}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to={secondaryAction.href}>
                  <SecondaryActionIcon className="size-4" />
                  {secondaryAction.label}
                </Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <HeroStat
                value="Projects"
                label="Keep launches, redesigns, and internal work organized."
              />
              <HeroStat
                value="Assignments"
                label="Make ownership visible so work does not stall."
              />
              <HeroStat
                value="Status"
                label="See what is queued, active, and complete."
              />
            </div>

            <p className="mt-6 text-sm leading-7 text-muted-foreground">
              {isAuthenticated
                ? `Welcome back${user ? `, ${getFirstName(user.name)}` : ""}. Your workspace is ready when you are.`
                : "New here? Create an account to start your own workspace or sign in to continue where you left off."}
            </p>
          </div>

          <SectionCard className="relative overflow-hidden border-primary/15 bg-[linear-gradient(160deg,rgba(255,255,255,0.95),rgba(228,247,245,0.92))] p-6 dark:bg-[linear-gradient(160deg,rgba(26,32,44,0.92),rgba(19,54,58,0.82))] sm:p-8">
            <div className="absolute right-[-4rem] top-[-4rem] h-40 w-40 rounded-full bg-primary/12 blur-3xl" />
            <div className="absolute bottom-[-5rem] left-[-3rem] h-44 w-44 rounded-full bg-accent/50 blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
                    Your day at a glance
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                    See priorities before they slip
                  </h2>
                </div>
                <div className="rounded-full border border-border/70 bg-background/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground shadow-sm">
                  Live workflow
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {previewColumns.map((column) => (
                  <div
                    key={column.title}
                    className="rounded-[1.5rem] border border-border/70 bg-background/82 p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground">
                        {column.title}
                      </h3>
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-secondary-foreground">
                        {column.tasks.length}
                      </span>
                    </div>

                    <div className="mt-4 space-y-3">
                      {column.tasks.map((task) => (
                        <div
                          key={task.title}
                          className="rounded-2xl border border-border/70 bg-card/90 p-4"
                        >
                          <p className="text-sm font-medium text-foreground">
                            {task.title}
                          </p>
                          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                            <span>{task.owner}</span>
                            <span>{task.tag}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {workflowBenefits.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <div
                      key={benefit.title}
                      className="rounded-[1.5rem] border border-border/70 bg-background/80 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-xl p-2 ${benefit.toneClassName}`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {benefit.title}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionCard>
        </section>

        <section className="grid gap-4 py-6 md:grid-cols-3">
          {valueCards.map(({ title, description, icon: Icon }) => (
            <SectionCard
              key={title}
              className="border-border/70 bg-card/80 p-6 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-accent p-3 text-accent-foreground">
                  <Icon className="size-5" />
                </div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {title}
                </h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {description}
              </p>
            </SectionCard>
          ))}
        </section>

        <section className="grid gap-6 py-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <SectionCard className="bg-card/80">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
              How it works
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              From kickoff to completion, without the chaos.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              TaskFlow is designed for teams that want clarity without a bloated
              setup. Create a workspace, add tasks, assign ownership, and keep
              progress visible as work moves.
            </p>
          </SectionCard>

          <div className="grid gap-4">
            {workflowSteps.map((item) => (
              <SectionCard
                key={item.step}
                className="border-border/70 bg-background/80 p-5 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="w-fit rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-sm font-semibold tracking-[0.24em] text-primary">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </SectionCard>
            ))}
          </div>
        </section>

        <section className="pb-8 pt-2">
          <SectionCard className="overflow-hidden border-primary/15 bg-[linear-gradient(135deg,rgba(80,164,176,0.12),rgba(226,245,241,0.7))] dark:bg-[linear-gradient(135deg,rgba(30,64,70,0.5),rgba(18,24,38,0.92))]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
                  Ready to get organized?
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Bring your projects, tasks, and ownership into one clean
                  workflow.
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  Start with a new account or jump back into your workspace and
                  pick up where your team left off.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link to={primaryAction.href}>
                    <PrimaryActionIcon className="size-4" />
                    {primaryAction.label}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to={secondaryAction.href}>
                    <SecondaryActionIcon className="size-4" />
                    {secondaryAction.label}
                  </Link>
                </Button>
              </div>
            </div>
          </SectionCard>
        </section>
      </AppContainer>
    </PageShell>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[1.5rem] border border-border/70 bg-card/78 px-5 py-4 shadow-sm backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.26em] text-foreground">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{label}</p>
    </div>
  );
}

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}
