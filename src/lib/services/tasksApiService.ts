import { prisma } from '@/lib/prisma';

export async function listTasks(status?: string | null) {
  const where: any = {};

  if (status) {
    where.status = status.toUpperCase();
  }

  return prisma.task.findMany({
    where,
    include: {
      reservation: {
        include: {
          room: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      },
      user: {
        select: {
          firstName: true,
          lastName: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

type UpdateTaskInput = {
  taskId: string;
  status?: string;
  result?: unknown;
  errorMessage?: string;
};

export async function updateTask(input: UpdateTaskInput) {
  const updateData: any = {};

  if (input.status) {
    updateData.status = input.status.toUpperCase();
    if (input.status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }
  }

  if (input.result) {
    updateData.result = input.result;
  }

  if (input.errorMessage) {
    updateData.errorMessage = input.errorMessage;
    updateData.attempts = { increment: 1 };
  }

  return prisma.task.update({
    where: { id: input.taskId },
    data: updateData,
    include: { reservation: true }
  });
}

type CreateTaskInput = {
  reservationId: string;
  type: string;
  accessLevel?: number;
};

export async function createTask(input: CreateTaskInput) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: input.reservationId },
    include: { room: true }
  });

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  const validFrom = new Date();
  const validUntil = input.type === 'CREATE_CARD' ? reservation.checkOut : new Date();

  return prisma.task.create({
    data: {
      reservationId: input.reservationId,
      userId: reservation.userId,
      type: input.type.toUpperCase() as any,
      status: 'PENDING',
      roomNumber: reservation.room.roomNumber,
      accessLevel: input.accessLevel || 1,
      validFrom,
      validUntil
    }
  });
}
