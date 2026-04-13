import {
  CalendarDays,
  LoaderCircle,
  Plus,
  SquarePen,
  UserRound,
} from "lucide-react";
import { useState } from "react";

import { SectionCard } from "@/components/layout/section-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  priorityClassNames,
  statusClassNames,
  statusSections,
} from "@/features/projects/project-detail/constants";
import {
  TasksEmptyState,
  TasksErrorState,
  TasksLoadingState,
} from "@/features/projects/project-detail/states";
import type { GroupedTasks } from "@/features/projects/project-detail/types";
import { formatTaskDueDate } from "@/features/projects/project-detail/utils";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types";

type ProjectTaskBoardProps = {
  groupedTasks: GroupedTasks;
  visibleTaskCount: number;
  projectHasTasks: boolean;
  isTasksLoading: boolean;
  isTasksError: boolean;
  statusUpdateError: string | null;
  assigneeLabelMap: Map<string, string>;
  disableStatusChange: boolean;
  statusUpdatingTaskId?: string;
  onRetry: () => void;
  onCreateTask: () => void;
  onClearFilters: () => void;
  onEditTask: (task: Task) => void;
  onStatusChange: (task: Task, nextStatus: TaskStatus) => void;
  onMoveTask: (
    task: Task,
    targetStatus: TaskStatus,
    overTaskId?: string,
  ) => void;
};

export function ProjectTaskBoard({
  groupedTasks,
  visibleTaskCount,
  projectHasTasks,
  isTasksLoading,
  isTasksError,
  statusUpdateError,
  assigneeLabelMap,
  disableStatusChange,
  statusUpdatingTaskId,
  onRetry,
  onCreateTask,
  onClearFilters,
  onEditTask,
  onStatusChange,
  onMoveTask,
}: ProjectTaskBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    status: TaskStatus;
    overTaskId?: string;
  } | null>(null);

  const visibleTaskMap = new Map(
    Object.values(groupedTasks)
      .flat()
      .map((task) => [task.id, task]),
  );

  function resetDragState() {
    setDraggedTaskId(null);
    setDropTarget(null);
  }

  function handleColumnDrop(targetStatus: TaskStatus, overTaskId?: string) {
    if (!draggedTaskId) {
      return;
    }

    const draggedTask = visibleTaskMap.get(draggedTaskId);
    if (!draggedTask) {
      resetDragState();
      return;
    }

    onMoveTask(draggedTask, targetStatus, overTaskId);
    resetDragState();
  }

  return (
    <SectionCard className="min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Tasks
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            Grouped by status
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Tasks remain grouped for quick scanning while filters narrow the
            result set. Drag cards to reorder work or move them between status
            columns.
          </p>
        </div>

        <div className="rounded-full border border-border/70 bg-background/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
          {isTasksLoading ? "Loading..." : `${visibleTaskCount} shown`}
        </div>
      </div>

      <div className="mt-8">
        {statusUpdateError ? (
          <div className="mb-6 rounded-[1.5rem] border border-destructive/30 bg-destructive/8 px-5 py-4">
            <p className="text-sm font-medium text-destructive">
              {statusUpdateError}
            </p>
          </div>
        ) : null}

        {isTasksLoading ? <TasksLoadingState /> : null}

        {isTasksError ? <TasksErrorState onRetry={onRetry} /> : null}

        {!isTasksLoading && !isTasksError && !projectHasTasks ? (
          <TasksEmptyState
            title="No tasks yet"
            description="This project is ready for work, but it does not have any tasks yet. Use the New task action to create the first one."
            action={
              <Button onClick={onCreateTask}>
                <Plus className="size-4" />
                Create first task
              </Button>
            }
          />
        ) : null}

        {!isTasksLoading &&
        !isTasksError &&
        projectHasTasks &&
        visibleTaskCount === 0 ? (
          <TasksEmptyState
            title="No tasks match the current filters"
            description="Adjust the status or assignee filters to widen the result set."
            action={
              <Button variant="outline" onClick={onClearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : null}

        {!isTasksLoading && !isTasksError && visibleTaskCount > 0 ? (
          <div className="-mx-1 overflow-x-auto pb-2">
            <div className="grid gap-4 px-1 xl:flex xl:min-w-max xl:gap-5">
              {statusSections.map((section) => (
                <div
                  key={section.status}
                  className={cn(
                    "rounded-[1.5rem] border border-border/70 bg-background/75 p-4 xl:min-h-[32rem] xl:min-w-[20rem] xl:max-w-[22rem] xl:flex-1",
                    draggedTaskId &&
                      dropTarget?.status === section.status &&
                      !dropTarget?.overTaskId
                      ? "border-primary/60 bg-primary/5"
                      : "",
                  )}
                  onDragOver={(event) => {
                    if (disableStatusChange) {
                      return;
                    }

                    event.preventDefault();
                    if (
                      dropTarget?.status !== section.status ||
                      Boolean(dropTarget?.overTaskId)
                    ) {
                      setDropTarget({ status: section.status });
                    }
                  }}
                  onDragLeave={(event) => {
                    if (
                      event.currentTarget.contains(
                        event.relatedTarget as Node | null,
                      )
                    ) {
                      return;
                    }

                    if (
                      dropTarget?.status === section.status &&
                      !dropTarget?.overTaskId
                    ) {
                      setDropTarget(null);
                    }
                  }}
                  onDrop={(event) => {
                    if (disableStatusChange) {
                      return;
                    }

                    event.preventDefault();
                    handleColumnDrop(section.status);
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {section.label}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {section.description}
                      </p>
                    </div>
                    <span className="rounded-full bg-card px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                      {groupedTasks[section.status].length}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {groupedTasks[section.status].length > 0 ? (
                      groupedTasks[section.status].map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          assigneeLabel={
                            task.assignee_id
                              ? (assigneeLabelMap.get(task.assignee_id) ??
                                "Assignee")
                              : "Unassigned"
                          }
                          onEdit={() => onEditTask(task)}
                          onStatusChange={(nextStatus) =>
                            onStatusChange(task, nextStatus)
                          }
                          isStatusUpdating={statusUpdatingTaskId === task.id}
                          disableStatusChange={disableStatusChange}
                          isDragging={draggedTaskId === task.id}
                          isDropTarget={dropTarget?.overTaskId === task.id}
                          onDragStart={() => {
                            setDraggedTaskId(task.id);
                            setDropTarget({
                              status: task.status,
                              overTaskId: task.id,
                            });
                          }}
                          onDragEnd={resetDragState}
                          onDragOver={() => {
                            if (
                              !disableStatusChange &&
                              (dropTarget?.overTaskId !== task.id ||
                                dropTarget?.status !== section.status)
                            ) {
                              setDropTarget({
                                status: section.status,
                                overTaskId: task.id,
                              });
                            }
                          }}
                          onDrop={() =>
                            handleColumnDrop(section.status, task.id)
                          }
                        />
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border/80 bg-card/70 px-4 py-5 text-sm text-muted-foreground">
                        No tasks in this column.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}

function TaskCard({
  task,
  assigneeLabel,
  onEdit,
  onStatusChange,
  isStatusUpdating,
  disableStatusChange,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: {
  task: Task;
  assigneeLabel: string;
  onEdit: () => void;
  onStatusChange: (nextStatus: TaskStatus) => void;
  isStatusUpdating: boolean;
  disableStatusChange: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOver: () => void;
  onDrop: () => void;
}) {
  return (
    <article
      draggable={!disableStatusChange}
      className={cn(
        "rounded-2xl border border-border/70 bg-card/85 p-4 shadow-sm transition-opacity",
        isDragging ? "opacity-50" : "",
        isDropTarget ? "border-primary/60 ring-2 ring-primary/20" : "",
      )}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onDragOver={(event) => {
        if (disableStatusChange) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        onDragOver();
      }}
      onDrop={(event) => {
        if (disableStatusChange) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        onDrop();
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.24em]",
              statusClassNames[task.status],
            )}
          >
            {task.status.replace("_", " ")}
          </span>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.24em]",
              priorityClassNames[task.priority],
            )}
          >
            {task.priority}
          </span>
        </div>

        <Button size="sm" variant="ghost" className="shrink-0" onClick={onEdit}>
          <SquarePen className="size-4" />
          Edit
        </Button>
      </div>

      <h4 className="mt-4 text-base font-semibold tracking-tight text-foreground">
        {task.title}
      </h4>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        {task.description || "No task description yet."}
      </p>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label
            htmlFor={`task-status-${task.id}`}
            className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground"
          >
            Update status
          </Label>
          {isStatusUpdating ? (
            <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <LoaderCircle className="size-3.5 animate-spin" />
              Syncing
            </span>
          ) : null}
        </div>
        <Select
          id={`task-status-${task.id}`}
          className="h-9 rounded-lg text-sm"
          value={task.status}
          disabled={disableStatusChange}
          onChange={(event) => {
            const nextStatus = event.target.value as TaskStatus;

            if (nextStatus === task.status) {
              return;
            }

            onStatusChange(nextStatus);
          }}
        >
          {statusSections.map((section) => (
            <option key={section.status} value={section.status}>
              {section.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-xl bg-background/80 px-3 py-3">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            <UserRound className="size-3.5" />
            Assignee
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">
            {assigneeLabel}
          </p>
        </div>

        <div className="rounded-xl bg-background/80 px-3 py-3">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            <CalendarDays className="size-3.5" />
            Due date
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">
            {formatTaskDueDate(task.due_date)}
          </p>
        </div>
      </div>
    </article>
  );
}
