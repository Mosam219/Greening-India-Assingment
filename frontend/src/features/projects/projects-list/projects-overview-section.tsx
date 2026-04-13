import { ArrowRight, LoaderCircle, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";

import { SectionCard } from "@/components/layout/section-card";
import { Button } from "@/components/ui/button";
import {
  ProjectsEmptyState,
  ProjectsErrorState,
  ProjectsLoadingState,
} from "@/features/projects/projects-list/states";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

type ProjectsOverviewSectionProps = {
  projects: Project[];
  currentUserId?: string;
  isLoading: boolean;
  isError: boolean;
  isRefreshing: boolean;
  onRetry: () => void;
  onCreate: () => void;
};

export function ProjectsOverviewSection({
  projects,
  currentUserId,
  isLoading,
  isError,
  isRefreshing,
  onRetry,
  onCreate,
}: ProjectsOverviewSectionProps) {
  const hasProjects = projects.length > 0;

  return (
    <SectionCard>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Accessible Projects
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            Your current workspaces
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            This list includes projects you own or participate in through
            assigned tasks, matching the backend contract.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onRetry}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <RefreshCcw className="size-4" />
          )}
          Refresh
        </Button>
      </div>

      <div className="mt-8">
        {isLoading ? <ProjectsLoadingState /> : null}

        {isError ? <ProjectsErrorState onRetry={onRetry} /> : null}

        {!isLoading && !isError && !hasProjects ? (
          <ProjectsEmptyState onCreate={onCreate} />
        ) : null}

        {!isLoading && !isError && hasProjects ? (
          <div className="grid gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isOwner={project.owner_id === currentUserId}
              />
            ))}
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}

function ProjectCard({
  project,
  isOwner,
}: {
  project: Project;
  isOwner: boolean;
}) {
  const createdDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(project.created_at));

  return (
    <Link
      to={`/projects/${project.id}`}
      className={cn(
        "group block rounded-[1.75rem] border border-border/70 bg-background/80 p-5 transition-transform duration-200 hover:-translate-y-1 hover:border-primary/40",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {project.name}
            </h3>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-secondary-foreground">
              {isOwner ? "Owner" : "Member"}
            </span>
          </div>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {project.description ||
              "No description yet. Open the project to start shaping the work."}
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/85 px-4 py-3 text-right shadow-sm">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Created
          </p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {createdDate}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
        Open project
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
