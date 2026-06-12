import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import type {
  CreateTaskInput,
  ListTasksQuery,
  UpdateTaskInput,
} from "../schemas/task.schema.js";

const endOfDay = (date: Date): Date => {
  const limit = new Date(date);
  limit.setHours(23, 59, 59, 999);
  return limit;
};

export class TaskRepository {
  list(userId: string, filters: ListTasksQuery) {
    return prisma.task.findMany({
      where: this.buildListWhere(userId, filters),
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    });
  }

  findById(userId: string, id: string) {
    return prisma.task.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });
  }

  findByIdIncludingDeleted(userId: string, id: string) {
    return prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  create(userId: string, data: CreateTaskInput) {
    return prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(userId: string, id: string, data: UpdateTaskInput) {
    await prisma.task.updateMany({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      data,
    });

    return this.findById(userId, id);
  }

  async softDelete(userId: string, id: string) {
    await prisma.task.updateMany({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  private buildListWhere(userId: string, filters: ListTasksQuery): Prisma.TaskWhereInput {
    const where: Prisma.TaskWhereInput = {
      userId,
      deletedAt: null,
    };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    if (filters.responsible) {
      where.responsible = {
        contains: filters.responsible,
        mode: "insensitive",
      };
    }

    if (filters.dueDate) {
      where.dueDate = {
        lte: endOfDay(filters.dueDate),
      };
    }

    if (filters.search) {
      where.OR = [
        {
          title: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      ];
    }

    return where;
  }
}
