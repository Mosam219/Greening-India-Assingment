import { FolderKanban, Plus, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProjectsLoadingState() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-[1.75rem] border border-border/70 bg-background/75 p-5"
        >
          <div className="h-5 w-40 animate-pulse rounded-full bg-muted" />
          <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-muted" />
          <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-muted" />
          <div className="mt-6 h-4 w-28 animate-pulse rounded-full bg-muted" />
        </div>
      ))}
    </div>
  );
}

export function ProjectsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-[1.75rem] border border-destructive/30 bg-destructive/8 p-6">
      <h3 className="text-lg font-semibold text-foreground">
        Unable to load projects
      </h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        The request did not complete successfully. Retry the fetch to recover
        without leaving the workspace.
      </p>
      <Button className="mt-6" variant="outline" onClick={onRetry}>
        <RefreshCcw className="size-4" />
        Retry
      </Button>
    </div>
  );
}

export function ProjectsEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-border/80 bg-background/75 p-8 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <FolderKanban className="size-6" />
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
        No accessible projects yet
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
        Create the first project to seed the workspace. Once added, it will
        appear here immediately and remain available after refresh through the
        mock API state.
      </p>
      <Button className="mt-6" onClick={onCreate}>
        <Plus className="size-4" />
        Create your first project
      </Button>
    </div>
  );
}
