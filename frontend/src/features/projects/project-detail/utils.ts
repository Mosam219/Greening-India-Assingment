import type { TaskAssigneeOption } from "@/features/tasks/task-editor-panel";
import type { ProjectDetail, Task, TaskStatus } from "@/types";

import { statusSections } from "@/features/projects/project-detail/constants";
import type {
  AssigneeFilterOption,
  GroupedTasks,
} from "@/features/projects/project-detail/types";

export function groupTasksByStatus(tasks: Task[]): GroupedTasks {
  return {
    todo: tasks.filter((task) => task.status === "todo"),
    in_progress: tasks.filter((task) => task.status === "in_progress"),
    done: tasks.filter((task) => task.status === "done"),
  };
}

export function buildAssigneeLabelMap(
  project: ProjectDetail,
  currentUserId: string | null,
) {
  const uniqueAssigneeIds = new Set<string>();

  if (project.owner_id) {
    uniqueAssigneeIds.add(project.owner_id);
  }

  if (currentUserId) {
    uniqueAssigneeIds.add(currentUserId);
  }

  for (const task of project.tasks) {
    if (task.assignee_id) {
      uniqueAssigneeIds.add(task.assignee_id);
    }
  }

  const orderedAssigneeIds = Array.from(uniqueAssigneeIds).sort(
    (left, right) => {
      if (left === currentUserId) {
        return -1;
      }

      if (right === currentUserId) {
        return 1;
      }

      if (left === project.owner_id) {
        return -1;
      }

      if (right === project.owner_id) {
        return 1;
      }

      return left.localeCompare(right);
    },
  );

  let memberCount = 0;
  const labels = new Map<string, string>();

  for (const assigneeId of orderedAssigneeIds) {
    if (assigneeId === currentUserId) {
      labels.set(assigneeId, "You");
      continue;
    }

    if (assigneeId === project.owner_id) {
      labels.set(assigneeId, "Project owner");
      continue;
    }

    memberCount += 1;
    labels.set(assigneeId, `Member ${memberCount}`);
  }

  return labels;
}

export function buildAssigneeOptions(
  assigneeLabelMap: Map<string, string>,
): AssigneeFilterOption[] {
  return Array.from(assigneeLabelMap.entries()).map(([assigneeId, label]) => ({
    value: label === "You" ? "me" : assigneeId,
    label,
  }));
}

export function buildEditableAssigneeOptions(
  assigneeLabelMap: Map<string, string>,
): TaskAssigneeOption[] {
  return Array.from(assigneeLabelMap.entries()).map(([assigneeId, label]) => ({
    value: assigneeId,
    label,
  }));
}

export function getTaskStatusLabel(status: TaskStatus) {
  return (
    statusSections.find((section) => section.status === status)?.label ?? status
  );
}

export function formatTaskDueDate(dueDate: Task["due_date"]) {
  if (!dueDate) {
    return "No due date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(dueDate));
}
