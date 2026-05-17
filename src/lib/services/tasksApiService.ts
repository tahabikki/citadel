const staticTasks: any[] = [];

export async function listTasks(status?: string | null) {
  if (status) {
    return staticTasks.filter(t => t.status === status.toUpperCase());
  }
  return staticTasks;
}

type UpdateTaskInput = {
  taskId: string;
  status?: string;
  result?: unknown;
  errorMessage?: string;
};

export async function updateTask(input: UpdateTaskInput) {
  return { id: input.taskId, ...input };
}

type CreateTaskInput = {
  reservationId: string;
  type: string;
  accessLevel?: number;
};

export async function createTask(input: CreateTaskInput) {
  return {
    id: "task-" + Date.now(),
    reservationId: input.reservationId,
    type: input.type,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };
}