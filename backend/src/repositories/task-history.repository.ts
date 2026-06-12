import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export class TaskHistoryRepository {
  create(data: Prisma.TaskHistoryUncheckedCreateInput) {
    return prisma.taskHistory.create({
      data,
    });
  }

  createMany(data: Prisma.TaskHistoryCreateManyInput[]) {
    if (data.length === 0) {
      return Promise.resolve({ count: 0 });
    }

    return prisma.taskHistory.createMany({
      data,
    });
  }

  listByTaskId(taskId: string) {
    return prisma.taskHistory.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
    });
  }
}
