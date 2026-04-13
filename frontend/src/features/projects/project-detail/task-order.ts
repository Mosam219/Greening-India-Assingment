import { useEffect, useState, type SetStateAction } from "react";

import { statusSections } from "@/features/projects/project-detail/constants";
import type { GroupedTasks } from "@/features/projects/project-detail/types";
import type { Task, TaskStatus } from "@/types";

const taskOrderStoragePrefix = "taskflow.task-order";

function getTaskOrderStorageKey(projectId: string) {
  return `${taskOrderStoragePrefix}.${projectId}`;
}

function readStoredTaskOrder(projectId: string) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(
      getTaskOrderStorageKey(projectId),
    );
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue)
      ? parsedValue.filter(
          (value): value is string => typeof value === "string",
        )
      : [];
  } catch {
    return [];
  }
}

function writeStoredTaskOrder(projectId: string, taskOrder: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    getTaskOrderStorageKey(projectId),
    JSON.stringify(taskOrder),
  );
}

export function syncTaskOrder(taskIds: string[], currentOrder: string[]) {
  const taskIdSet = new Set(taskIds);
  const existingOrder = currentOrder.filter((taskId) => taskIdSet.has(taskId));
  const existingOrderSet = new Set(existingOrder);
  const unseenTaskIds = taskIds.filter(
    (taskId) => !existingOrderSet.has(taskId),
  );

  return [...unseenTaskIds, ...existingOrder];
}

export function useProjectTaskOrder(projectId: string, tasks: Task[]) {
  const taskIds = tasks.map((task) => task.id);
  const [taskOrderState, setTaskOrderState] = useState<{
    projectId: string;
    taskOrder: string[];
  }>(() => ({
    projectId,
    taskOrder: readStoredTaskOrder(projectId),
  }));
  const baseTaskOrder =
    taskOrderState.projectId === projectId
      ? taskOrderState.taskOrder
      : readStoredTaskOrder(projectId);
  const taskOrder = syncTaskOrder(taskIds, baseTaskOrder);

  useEffect(() => {
    writeStoredTaskOrder(projectId, taskOrder);
  }, [projectId, taskOrder]);

  function setTaskOrder(nextTaskOrder: SetStateAction<string[]>) {
    setTaskOrderState((currentState) => {
      const currentOrder =
        currentState.projectId === projectId
          ? syncTaskOrder(taskIds, currentState.taskOrder)
          : syncTaskOrder(taskIds, readStoredTaskOrder(projectId));
      const resolvedTaskOrder =
        typeof nextTaskOrder === "function"
          ? nextTaskOrder(currentOrder)
          : nextTaskOrder;

      return {
        projectId,
        taskOrder: resolvedTaskOrder,
      };
    });
  }

  return {
    taskOrder,
    setTaskOrder,
  };
}

export function sortTasksByTaskOrder(tasks: Task[], taskOrder: string[]) {
  const taskIndexMap = new Map(
    taskOrder.map((taskId, index) => [taskId, index]),
  );

  return [...tasks].sort((left, right) => {
    const leftIndex = taskIndexMap.get(left.id) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = taskIndexMap.get(right.id) ?? Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex;
  });
}

export function moveTaskInGroupedBoard({
  groupedTasks,
  task,
  targetStatus,
  overTaskId,
}: {
  groupedTasks: GroupedTasks;
  task: Task;
  targetStatus: TaskStatus;
  overTaskId?: string;
}) {
  const nextGroups: GroupedTasks = {
    todo: [...groupedTasks.todo],
    in_progress: [...groupedTasks.in_progress],
    done: [...groupedTasks.done],
  };

  for (const section of statusSections) {
    nextGroups[section.status] = nextGroups[section.status].filter(
      (item) => item.id !== task.id,
    );
  }

  const nextTask =
    targetStatus === task.status ? task : { ...task, status: targetStatus };
  const targetTasks = nextGroups[targetStatus];
  const targetIndex = overTaskId
    ? targetTasks.findIndex((item) => item.id === overTaskId)
    : -1;

  if (targetIndex === -1) {
    targetTasks.push(nextTask);
  } else {
    targetTasks.splice(targetIndex, 0, nextTask);
  }

  return nextGroups;
}

export function createTaskOrderFromGroupedBoard(groupedTasks: GroupedTasks) {
  return statusSections.flatMap((section) =>
    groupedTasks[section.status].map((task) => task.id),
  );
}

export function isSameTaskOrder(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((taskId, index) => taskId === right[index]);
}
