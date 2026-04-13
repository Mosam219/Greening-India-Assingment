import {
  CircleCheckBig,
  FolderOpenDot,
  LoaderCircle,
  RefreshCcw,
  UserRound,
} from "lucide-react";

import { SectionCard } from "@/components/layout/section-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { statusSections } from "@/features/projects/project-detail/constants";
import type {
  AssigneeFilterOption,
  AssigneeFilterValue,
  StatusFilterValue,
} from "@/features/projects/project-detail/types";

type ProjectDetailSidebarProps = {
  statusFilter: StatusFilterValue;
  assigneeFilter: AssigneeFilterValue;
  assigneeOptions: AssigneeFilterOption[];
  totalTaskCount: number;
  visibleTaskCount: number;
  ownerLabel: string;
  isTasksLoading: boolean;
  isTasksFetching: boolean;
  hasActiveFilters: boolean;
  onStatusFilterChange: (value: StatusFilterValue) => void;
  onAssigneeFilterChange: (value: AssigneeFilterValue) => void;
  onClearFilters: () => void;
  onRefreshTasks: () => void;
};

export function ProjectDetailSidebar({
  statusFilter,
  assigneeFilter,
  assigneeOptions,
  totalTaskCount,
  visibleTaskCount,
  ownerLabel,
  isTasksLoading,
  isTasksFetching,
  hasActiveFilters,
  onStatusFilterChange,
  onAssigneeFilterChange,
  onClearFilters,
  onRefreshTasks,
}: ProjectDetailSidebarProps) {
  return (
    <SectionCard className="h-fit xl:sticky xl:top-28">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
        Board controls
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        Refine the board
      </h2>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        Narrow the board by status or assignee, then refresh when you want the
        latest task data.
      </p>

      <div className="mt-8 rounded-[1.5rem] border border-border/70 bg-background/80 p-5">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="task-status-filter">Status</Label>
            <Select
              id="task-status-filter"
              value={statusFilter}
              onChange={(event) =>
                onStatusFilterChange(event.target.value as StatusFilterValue)
              }
            >
              <option value="all">All statuses</option>
              {statusSections.map((section) => (
                <option key={section.status} value={section.status}>
                  {section.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-assignee-filter">Assignee</Label>
            <Select
              id="task-assignee-filter"
              value={assigneeFilter}
              onChange={(event) =>
                onAssigneeFilterChange(
                  event.target.value as AssigneeFilterValue,
                )
              }
            >
              <option value="all">All assignees</option>
              {assigneeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-border/70 bg-muted/30 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Project snapshot
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              A quick read on scope and visibility.
            </p>
          </div>
          <div className="rounded-full border border-border/70 bg-background/90 px-3 py-1.5 text-xs font-medium text-muted-foreground">
            {isTasksLoading ? "Loading..." : `${visibleTaskCount} shown`}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <ProjectMetricCard
            label="Total tasks"
            detail="All tasks in this project"
            value={String(totalTaskCount)}
            icon={FolderOpenDot}
          />
          <ProjectMetricCard
            label="Visible tasks"
            detail="Matches the current filters"
            value={isTasksLoading ? "..." : String(visibleTaskCount)}
            icon={CircleCheckBig}
          />
          <ProjectMetricCard
            label="Owner status"
            detail="Your relationship to this project"
            value={ownerLabel}
            icon={UserRound}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button
          className="w-full"
          variant="outline"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
        >
          Clear filters
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={onRefreshTasks}
          disabled={isTasksFetching}
        >
          {isTasksFetching ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <RefreshCcw className="size-4" />
          )}
          Refresh tasks
        </Button>
      </div>
    </SectionCard>
  );
}

function ProjectMetricCard({
  label,
  detail,
  value,
  icon: Icon,
}: {
  label: string;
  detail: string;
  value: string;
  icon: typeof FolderOpenDot;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[1.25rem] border border-border/70 bg-background/85 px-4 py-3">
      <div className="rounded-xl bg-accent p-2 text-accent-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
      </div>
      <p className="shrink-0 text-xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}
