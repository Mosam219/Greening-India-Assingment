import { ArrowLeft, CircleDashed, RefreshCcw } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { SectionCard } from "@/components/layout/section-card";
import { Button } from "@/components/ui/button";

export function ProjectDetailLoadingState() {
  return (
    <div className="grid gap-6">
      <SectionCard>
        <div className="h-5 w-28 animate-pulse rounded-full bg-muted" />
        <div className="mt-5 h-14 w-3/4 animate-pulse rounded-[1.5rem] bg-muted" />
        <div className="mt-6 h-5 w-full animate-pulse rounded-full bg-muted" />
        <div className="mt-3 h-5 w-2/3 animate-pulse rounded-full bg-muted" />
      </SectionCard>
      <div className="grid gap-6 xl:grid-cols-[minmax(20rem,22rem)_minmax(0,1fr)]">
        {Array.from({ length: 2 }).map((_, index) => (
          <SectionCard key={index}>
            <div className="h-6 w-40 animate-pulse rounded-full bg-muted" />
            <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-muted" />
            <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-muted" />
            <div className="mt-8 grid gap-4 xl:flex">
              {Array.from({ length: 3 }).map((__, rowIndex) => (
                <div
                  key={rowIndex}
                  className="h-40 animate-pulse rounded-[1.5rem] bg-muted xl:min-w-[20rem] xl:flex-1"
                />
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}

export function ProjectDetailErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <SectionCard>
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
        Project Detail
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
        Unable to load this project
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
        The project request did not complete successfully. This can happen if
        the project does not exist in the mock state or the session no longer
        has access.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline">
          <Link to="/projects">
            <ArrowLeft className="size-4" />
            Back to projects
          </Link>
        </Button>
        <Button onClick={onRetry}>
          <RefreshCcw className="size-4" />
          Retry
        </Button>
      </div>
    </SectionCard>
  );
}

export function TasksLoadingState() {
  return (
    <div className="grid gap-4 xl:flex xl:overflow-x-auto xl:pb-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-[1.5rem] border border-border/70 bg-background/75 p-4 xl:min-w-[20rem] xl:flex-1"
        >
          <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
          <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-muted" />
          <div className="mt-3 h-4 w-3/4 animate-pulse rounded-full bg-muted" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 2 }).map((__, cardIndex) => (
              <div
                key={cardIndex}
                className="h-40 animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TasksErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-[1.75rem] border border-destructive/30 bg-destructive/8 p-6">
      <h3 className="text-lg font-semibold text-foreground">
        Unable to load tasks
      </h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        The task list request failed. Retry the current filtered request to
        recover.
      </p>
      <Button className="mt-6" variant="outline" onClick={onRetry}>
        <RefreshCcw className="size-4" />
        Retry
      </Button>
    </div>
  );
}

export function TasksEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-border/80 bg-background/75 p-8 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <CircleDashed className="size-6" />
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
