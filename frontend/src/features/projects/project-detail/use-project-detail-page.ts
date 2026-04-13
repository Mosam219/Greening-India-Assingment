import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useAuth } from "@/features/auth";
import {
  projectDetailQueryKey,
  projectTasksBaseQueryKey,
  projectTasksQueryKey,
} from "@/features/projects/query-keys";
import {
  createOptimisticStatusTask,
  updateProjectDetailTask,
  updateProjectTasksResponse,
} from "@/features/tasks/task-status-cache";
import { updateTask } from "@/features/tasks/tasks-api";
import {
  getProjectDetail,
  getProjectTasks,
} from "@/features/projects/projects-api";
import type {
  AssigneeFilterValue,
  StatusFilterValue,
  TaskEditorState,
  UpdateTaskStatusVariables,
} from "@/features/projects/project-detail/types";
import {
  buildAssigneeLabelMap,
  buildAssigneeOptions,
  buildEditableAssigneeOptions,
  getTaskStatusLabel,
  groupTasksByStatus,
} from "@/features/projects/project-detail/utils";
import {
  createTaskOrderFromGroupedBoard,
  isSameTaskOrder,
  moveTaskInGroupedBoard,
  sortTasksByTaskOrder,
  useProjectTaskOrder,
} from "@/features/projects/project-detail/task-order";
import type {
  GetProjectResponse,
  GetProjectTasksResponse,
  Task,
} from "@/types";

type UpdateTaskStatusContext = {
  projectDetailSnapshot: GetProjectResponse | undefined;
  taskQueriesSnapshots: Array<
    [readonly unknown[], GetProjectTasksResponse | undefined]
  >;
  previousTaskOrder: string[];
};

export function useProjectDetailPage(projectId: string) {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [assigneeFilter, setAssigneeFilter] =
    useState<AssigneeFilterValue>("all");
  const [taskEditorState, setTaskEditorState] =
    useState<TaskEditorState | null>(null);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(
    null,
  );

  const detailQueryKey = projectDetailQueryKey(projectId);
  const tasksBaseKey = projectTasksBaseQueryKey(projectId);

  const projectDetailQuery = useQuery({
    queryKey: detailQueryKey,
    queryFn: async () => {
      if (!token) {
        throw new Error(
          "Authentication token is required to load the project.",
        );
      }

      return getProjectDetail(token, projectId);
    },
    enabled: Boolean(token && projectId),
  });

  const tasksQuery = useQuery({
    queryKey: projectTasksQueryKey({
      projectId,
      statusFilter,
      assigneeFilter,
      currentUserId: user?.id,
    }),
    queryFn: async () => {
      if (!token) {
        throw new Error(
          "Authentication token is required to load project tasks.",
        );
      }

      return getProjectTasks(token, projectId, {
        status: statusFilter === "all" ? undefined : statusFilter,
        assignee:
          assigneeFilter === "all"
            ? undefined
            : assigneeFilter === "me"
              ? user?.id
              : assigneeFilter,
      });
    },
    enabled: Boolean(token && projectId && projectDetailQuery.data),
  });

  const project = projectDetailQuery.data;
  const visibleTasks = tasksQuery.data?.tasks ?? [];
  const allProjectTasks = project?.tasks ?? [];
  const projectHasTasks = allProjectTasks.length > 0;
  const hasActiveFilters = statusFilter !== "all" || assigneeFilter !== "all";
  const { taskOrder, setTaskOrder } = useProjectTaskOrder(
    projectId,
    allProjectTasks,
  );
  const orderedAllProjectTasks = sortTasksByTaskOrder(
    allProjectTasks,
    taskOrder,
  );
  const orderedVisibleTasks = sortTasksByTaskOrder(visibleTasks, taskOrder);

  const assigneeLabelMap = project
    ? buildAssigneeLabelMap(project, user?.id ?? null)
    : new Map<string, string>();
  const assigneeOptions = buildAssigneeOptions(assigneeLabelMap);
  const editableAssigneeOptions =
    buildEditableAssigneeOptions(assigneeLabelMap);
  const groupedTasks = groupTasksByStatus(orderedVisibleTasks);
  const allGroupedTasks = groupTasksByStatus(orderedAllProjectTasks);

  const statusUpdateMutation = useMutation<
    Task,
    unknown,
    UpdateTaskStatusVariables,
    UpdateTaskStatusContext
  >({
    mutationFn: async ({ task, nextStatus }) => {
      if (!token) {
        throw new Error(
          "Authentication token is required to update task status.",
        );
      }

      return updateTask(token, task.id, {
        status: nextStatus,
      });
    },
    onMutate: async ({ task, nextStatus, nextTaskOrder }) => {
      setStatusUpdateError(null);
      const previousTaskOrder = taskOrder;

      await Promise.all([
        queryClient.cancelQueries({
          queryKey: detailQueryKey,
        }),
        queryClient.cancelQueries({
          queryKey: tasksBaseKey,
        }),
      ]);

      const projectDetailSnapshot =
        queryClient.getQueryData<GetProjectResponse>(detailQueryKey);
      const taskQueriesSnapshots =
        queryClient.getQueriesData<GetProjectTasksResponse>({
          queryKey: tasksBaseKey,
        });
      const optimisticTask = createOptimisticStatusTask(task, nextStatus);

      if (nextTaskOrder) {
        setTaskOrder(nextTaskOrder);
      }

      queryClient.setQueryData<GetProjectResponse>(detailQueryKey, (current) =>
        updateProjectDetailTask(current, optimisticTask),
      );

      for (const [queryKey] of taskQueriesSnapshots) {
        queryClient.setQueryData<GetProjectTasksResponse>(queryKey, (current) =>
          updateProjectTasksResponse(current, queryKey, optimisticTask),
        );
      }

      return {
        projectDetailSnapshot,
        taskQueriesSnapshots,
        previousTaskOrder,
      };
    },
    onError: (_error, variables, context) => {
      queryClient.setQueryData(detailQueryKey, context?.projectDetailSnapshot);
      setTaskOrder(context?.previousTaskOrder ?? []);

      for (const [queryKey, snapshot] of context?.taskQueriesSnapshots ?? []) {
        queryClient.setQueryData(queryKey, snapshot);
      }

      setStatusUpdateError(
        `Couldn't move "${variables.task.title}" to ${getTaskStatusLabel(
          variables.nextStatus,
        )}. The change was reverted.`,
      );
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: detailQueryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: tasksBaseKey,
        }),
      ]);
    },
  });

  function clearFilters() {
    setStatusFilter("all");
    setAssigneeFilter("all");
  }

  function openCreateTaskEditor() {
    setTaskEditorState({ mode: "create" });
  }

  function openEditTaskEditor(task: Task) {
    setTaskEditorState({ mode: "edit", task });
  }

  function closeTaskEditor() {
    setTaskEditorState(null);
  }

  function updateTaskStatus(
    task: Task,
    nextStatus: UpdateTaskStatusVariables["nextStatus"],
  ) {
    const nextTaskOrder =
      task.status === nextStatus
        ? undefined
        : createTaskOrderFromGroupedBoard(
            moveTaskInGroupedBoard({
              groupedTasks: allGroupedTasks,
              task,
              targetStatus: nextStatus,
            }),
          );

    statusUpdateMutation.mutate({ task, nextStatus, nextTaskOrder });
  }

  function moveTask(
    task: Task,
    targetStatus: UpdateTaskStatusVariables["nextStatus"],
    overTaskId?: string,
  ) {
    if (overTaskId === task.id) {
      return;
    }

    const nextGroupedTasks = moveTaskInGroupedBoard({
      groupedTasks: allGroupedTasks,
      task,
      targetStatus,
      overTaskId,
    });
    const nextTaskOrder = createTaskOrderFromGroupedBoard(nextGroupedTasks);

    if (
      isSameTaskOrder(taskOrder, nextTaskOrder) &&
      targetStatus === task.status
    ) {
      return;
    }

    if (targetStatus === task.status) {
      setTaskOrder(nextTaskOrder);
      return;
    }

    statusUpdateMutation.mutate({
      task,
      nextStatus: targetStatus,
      nextTaskOrder,
    });
  }

  return {
    token,
    user,
    project,
    visibleTasks,
    allProjectTasks,
    projectHasTasks,
    hasActiveFilters,
    statusFilter,
    assigneeFilter,
    taskEditorState,
    statusUpdateError,
    assigneeOptions,
    editableAssigneeOptions,
    assigneeLabelMap,
    groupedTasks,
    taskOrder,
    projectDetailQuery,
    tasksQuery,
    setStatusFilter,
    setAssigneeFilter,
    clearFilters,
    openCreateTaskEditor,
    openEditTaskEditor,
    closeTaskEditor,
    moveTask,
    updateTaskStatus,
    statusUpdateMutation,
  };
}
