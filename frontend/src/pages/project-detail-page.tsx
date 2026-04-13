import { ArrowLeft, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  ProjectDetailErrorState,
  ProjectDetailLoadingState,
} from "@/features/projects/project-detail/states";
import { ProjectDetailSidebar } from "@/features/projects/project-detail/sidebar";
import { ProjectTaskBoard } from "@/features/projects/project-detail/task-board";
import { useProjectDetailPage } from "@/features/projects/project-detail/use-project-detail-page";
import { TaskEditorPanel } from "@/features/tasks/task-editor-panel";

export function ProjectDetailPage() {
  const { projectId = "" } = useParams();
  const detail = useProjectDetailPage(projectId);

  if (detail.projectDetailQuery.isLoading) {
    return <ProjectDetailLoadingState />;
  }

  if (detail.projectDetailQuery.isError || !detail.project) {
    return (
      <ProjectDetailErrorState
        onRetry={() => detail.projectDetailQuery.refetch()}
      />
    );
  }

  const project = detail.project;

  return (
    <>
      <div className="flex flex-1 flex-col gap-6">
        <PageHeader
          eyebrow="Project Detail"
          title={project.name}
          description={
            project.description ||
            "This project does not have a description yet, but tasks and filters are already available."
          }
          action={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={detail.openCreateTaskEditor}>
                <Plus className="size-4" />
                New task
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/projects">
                  <ArrowLeft className="size-4" />
                  Back to projects
                </Link>
              </Button>
            </div>
          }
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(20rem,22rem)_minmax(0,1fr)]">
          <ProjectDetailSidebar
            statusFilter={detail.statusFilter}
            assigneeFilter={detail.assigneeFilter}
            assigneeOptions={detail.assigneeOptions}
            totalTaskCount={detail.allProjectTasks.length}
            visibleTaskCount={detail.visibleTasks.length}
            ownerLabel={project.owner_id === detail.user?.id ? "You" : "Shared"}
            isTasksLoading={detail.tasksQuery.isLoading}
            isTasksFetching={detail.tasksQuery.isFetching}
            hasActiveFilters={detail.hasActiveFilters}
            onStatusFilterChange={detail.setStatusFilter}
            onAssigneeFilterChange={detail.setAssigneeFilter}
            onClearFilters={detail.clearFilters}
            onRefreshTasks={() => detail.tasksQuery.refetch()}
          />

          <ProjectTaskBoard
            groupedTasks={detail.groupedTasks}
            visibleTaskCount={detail.visibleTasks.length}
            projectHasTasks={detail.projectHasTasks}
            isTasksLoading={detail.tasksQuery.isLoading}
            isTasksError={detail.tasksQuery.isError}
            statusUpdateError={detail.statusUpdateError}
            assigneeLabelMap={detail.assigneeLabelMap}
            disableStatusChange={detail.statusUpdateMutation.isPending}
            statusUpdatingTaskId={
              detail.statusUpdateMutation.variables?.task.id
            }
            onRetry={() => detail.tasksQuery.refetch()}
            onCreateTask={detail.openCreateTaskEditor}
            onClearFilters={detail.clearFilters}
            onEditTask={detail.openEditTaskEditor}
            onMoveTask={detail.moveTask}
            onStatusChange={detail.updateTaskStatus}
          />
        </div>
      </div>

      {detail.token ? (
        <TaskEditorPanel
          open={detail.taskEditorState !== null}
          mode={detail.taskEditorState?.mode ?? "create"}
          projectId={projectId}
          projectName={project.name}
          token={detail.token}
          assigneeOptions={detail.editableAssigneeOptions}
          task={
            detail.taskEditorState?.mode === "edit"
              ? detail.taskEditorState.task
              : undefined
          }
          onClose={detail.closeTaskEditor}
        />
      ) : null}
    </>
  );
}
