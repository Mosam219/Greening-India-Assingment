import type {
  AuthUser,
  EntityId,
  Project,
  ProjectDetail,
  Task,
  TaskPriority,
  TaskStatus,
  User,
} from "@/types";

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

type CreateProjectInput = {
  name: string;
  description?: string;
};

type UpdateProjectInput = {
  name?: string;
  description?: string;
};

type CreateTaskInput = {
  title: string;
  description?: string;
  priority: TaskPriority;
  assignee_id?: EntityId | null;
  due_date?: string | null;
};

type UpdateTaskInput = {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee_id?: EntityId | null;
  due_date?: string | null;
};

export interface MockUserRecord extends User {
  password: string;
}

export interface MockTaskRecord extends Omit<Task, "project_id"> {
  project_id: EntityId;
  creator_id: EntityId;
}

interface MockState {
  users: MockUserRecord[];
  projects: Project[];
  tasks: MockTaskRecord[];
}

const seedUsers: MockUserRecord[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Taylor Green",
    email: "test@example.com",
    password: "password123",
    created_at: "2026-04-01T09:00:00Z",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Alex Carter",
    email: "alex@example.com",
    password: "secret123",
    created_at: "2026-04-01T09:30:00Z",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    name: "Jamie Singh",
    email: "jamie@example.com",
    password: "secret123",
    created_at: "2026-04-01T10:00:00Z",
  },
];

const seedProjects: Project[] = [
  {
    id: "aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1",
    name: "Website Redesign",
    description: "Q2 marketing and conversion refresh",
    owner_id: seedUsers[0].id,
    created_at: "2026-04-01T10:00:00Z",
  },
  {
    id: "bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbb2",
    name: "Mobile Launch",
    description: "Launch checklist for the beta app store release",
    owner_id: seedUsers[1].id,
    created_at: "2026-04-03T11:30:00Z",
  },
  {
    id: "ccccccc3-cccc-4ccc-8ccc-ccccccccccc3",
    name: "Finance Migration",
    description: "Back-office cleanup not visible to the demo user",
    owner_id: seedUsers[2].id,
    created_at: "2026-04-05T08:15:00Z",
  },
];

const seedTasks: MockTaskRecord[] = [
  {
    id: "d1d1d1d1-1111-4111-8111-d1d1d1d1d1d1",
    title: "Design homepage",
    description: "Refine hero composition and CTA hierarchy",
    status: "in_progress",
    priority: "high",
    project_id: seedProjects[0].id,
    creator_id: seedUsers[0].id,
    assignee_id: seedUsers[0].id,
    due_date: "2026-04-15",
    created_at: "2026-04-06T10:00:00Z",
    updated_at: "2026-04-07T13:00:00Z",
  },
  {
    id: "d2d2d2d2-2222-4222-8222-d2d2d2d2d2d2",
    title: "Write announcement copy",
    description: "Landing page and launch email drafts",
    status: "todo",
    priority: "medium",
    project_id: seedProjects[0].id,
    creator_id: seedUsers[0].id,
    assignee_id: seedUsers[1].id,
    due_date: "2026-04-18",
    created_at: "2026-04-06T11:30:00Z",
    updated_at: "2026-04-06T11:30:00Z",
  },
  {
    id: "d3d3d3d3-3333-4333-8333-d3d3d3d3d3d3",
    title: "Submit TestFlight build",
    description: "Bundle notes and install steps for the beta group",
    status: "todo",
    priority: "high",
    project_id: seedProjects[1].id,
    creator_id: seedUsers[1].id,
    assignee_id: seedUsers[0].id,
    due_date: "2026-04-20",
    created_at: "2026-04-08T09:45:00Z",
    updated_at: "2026-04-08T09:45:00Z",
  },
  {
    id: "d4d4d4d4-4444-4444-8444-d4d4d4d4d4d4",
    title: "Confirm analytics events",
    description: "Validate screen names and purchase funnel events",
    status: "done",
    priority: "low",
    project_id: seedProjects[1].id,
    creator_id: seedUsers[0].id,
    assignee_id: seedUsers[0].id,
    due_date: null,
    created_at: "2026-04-08T12:00:00Z",
    updated_at: "2026-04-09T16:10:00Z",
  },
  {
    id: "d5d5d5d5-5555-4555-8555-d5d5d5d5d5d5",
    title: "Migrate invoice archive",
    description: "Move legacy exports into the new storage bucket",
    status: "todo",
    priority: "medium",
    project_id: seedProjects[2].id,
    creator_id: seedUsers[2].id,
    assignee_id: seedUsers[2].id,
    due_date: "2026-04-22",
    created_at: "2026-04-10T08:00:00Z",
    updated_at: "2026-04-10T08:00:00Z",
  },
];

let state: MockState = createInitialState();

function createInitialState(): MockState {
  return {
    users: structuredClone(seedUsers),
    projects: structuredClone(seedProjects),
    tasks: structuredClone(seedTasks),
  };
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeOptionalText(value?: string | null) {
  if (value == null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function sanitizeTask(task: MockTaskRecord): Task {
  const publicTask: Omit<MockTaskRecord, "creator_id"> & {
    creator_id?: EntityId;
  } = clone(task);
  delete publicTask.creator_id;
  return clone(publicTask);
}

function sanitizeProject(project: Project): Project {
  return clone(project);
}

export function listUsers(): User[] {
  return state.users.map((user) => {
    const publicUser: Omit<MockUserRecord, "password"> & { password?: string } =
      clone(user);
    delete publicUser.password;
    return publicUser;
  });
}

export function toAuthUser(user: MockUserRecord): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export function createMockToken(userId: EntityId) {
  return `mock-jwt.${userId}`;
}

export function findUserByToken(token: string) {
  const prefix = "mock-jwt.";
  if (!token.startsWith(prefix)) {
    return null;
  }

  return (
    state.users.find((user) => user.id === token.slice(prefix.length)) ?? null
  );
}

export function findUserByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  return state.users.find((user) => user.email === normalizedEmail) ?? null;
}

export function findUserById(userId: EntityId) {
  return state.users.find((user) => user.id === userId) ?? null;
}

export function findUserByCredentials(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  return (
    state.users.find(
      (user) => user.email === normalizedEmail && user.password === password,
    ) ?? null
  );
}

export function createUserRecord(input: CreateUserInput) {
  const now = new Date().toISOString();
  const user: MockUserRecord = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: normalizeEmail(input.email),
    password: input.password,
    created_at: now,
  };

  state.users.push(user);
  return clone(user);
}

export function getProjectById(projectId: EntityId) {
  return state.projects.find((project) => project.id === projectId) ?? null;
}

export function getTaskRecordById(taskId: EntityId) {
  return state.tasks.find((task) => task.id === taskId) ?? null;
}

export function isProjectOwner(userId: EntityId, projectId: EntityId) {
  return getProjectById(projectId)?.owner_id === userId;
}

export function hasProjectAccess(userId: EntityId, projectId: EntityId) {
  const project = getProjectById(projectId);
  if (!project) {
    return false;
  }

  if (project.owner_id === userId) {
    return true;
  }

  return state.tasks.some(
    (task) =>
      task.project_id === projectId &&
      (task.assignee_id === userId || task.creator_id === userId),
  );
}

export function canDeleteTask(userId: EntityId, taskId: EntityId) {
  const task = getTaskRecordById(taskId);
  if (!task) {
    return false;
  }

  return isProjectOwner(userId, task.project_id) || task.creator_id === userId;
}

export function getProjectsForUser(userId: EntityId) {
  return state.projects
    .filter((project) => hasProjectAccess(userId, project.id))
    .map(sanitizeProject);
}

export function getProjectDetail(projectId: EntityId): ProjectDetail | null {
  const project = getProjectById(projectId);
  if (!project) {
    return null;
  }

  return {
    ...sanitizeProject(project),
    tasks: listTasksForProject(projectId),
  };
}

export function createProjectRecord(
  input: CreateProjectInput,
  ownerId: EntityId,
) {
  const project: Project = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    description: normalizeOptionalText(input.description),
    owner_id: ownerId,
    created_at: new Date().toISOString(),
  };

  state.projects.unshift(project);
  return sanitizeProject(project);
}

export function updateProjectRecord(
  projectId: EntityId,
  input: UpdateProjectInput,
) {
  const project = getProjectById(projectId);
  if (!project) {
    return null;
  }

  if (input.name !== undefined) {
    project.name = input.name.trim();
  }

  if (input.description !== undefined) {
    project.description = normalizeOptionalText(input.description);
  }

  return sanitizeProject(project);
}

export function deleteProjectRecord(projectId: EntityId) {
  const projectIndex = state.projects.findIndex(
    (project) => project.id === projectId,
  );
  if (projectIndex === -1) {
    return false;
  }

  state.projects.splice(projectIndex, 1);
  state.tasks = state.tasks.filter((task) => task.project_id !== projectId);
  return true;
}

export function listTasksForProject(
  projectId: EntityId,
  filters?: {
    status?: TaskStatus;
    assignee?: EntityId;
  },
) {
  return state.tasks
    .filter((task) => task.project_id === projectId)
    .filter((task) => (filters?.status ? task.status === filters.status : true))
    .filter((task) =>
      filters?.assignee ? task.assignee_id === filters.assignee : true,
    )
    .sort((left, right) => right.updated_at.localeCompare(left.updated_at))
    .map(sanitizeTask);
}

export function createTaskRecord(
  projectId: EntityId,
  input: CreateTaskInput,
  creatorId: EntityId,
) {
  const now = new Date().toISOString();
  const task: MockTaskRecord = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: normalizeOptionalText(input.description),
    status: "todo",
    priority: input.priority,
    project_id: projectId,
    creator_id: creatorId,
    assignee_id: input.assignee_id ?? null,
    due_date: input.due_date ?? null,
    created_at: now,
    updated_at: now,
  };

  state.tasks.unshift(task);
  return sanitizeTask(task);
}

export function updateTaskRecord(taskId: EntityId, input: UpdateTaskInput) {
  const task = getTaskRecordById(taskId);
  if (!task) {
    return null;
  }

  if (input.title !== undefined) {
    task.title = input.title.trim();
  }

  if (input.description !== undefined) {
    task.description = normalizeOptionalText(input.description);
  }

  if (input.status !== undefined) {
    task.status = input.status;
  }

  if (input.priority !== undefined) {
    task.priority = input.priority;
  }

  if (input.assignee_id !== undefined) {
    task.assignee_id = input.assignee_id;
  }

  if (input.due_date !== undefined) {
    task.due_date = input.due_date;
  }

  task.updated_at = new Date().toISOString();
  return sanitizeTask(task);
}

export function deleteTaskRecord(taskId: EntityId) {
  const taskIndex = state.tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    return false;
  }

  state.tasks.splice(taskIndex, 1);
  return true;
}

export function resetMockState() {
  state = createInitialState();
}
