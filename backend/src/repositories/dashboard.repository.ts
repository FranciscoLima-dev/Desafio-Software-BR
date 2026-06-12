import { TaskStatus } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export type DashboardSummary = {
  pending: number;
  completed: number;
  overdue: number;
};

type StatusCountRow = {
  status: TaskStatus;
  _count: {
    status: number;
  };
};

export class DashboardRepository {
  async summaryByUserId(userId: string, referenceDate = new Date()): Promise<DashboardSummary> {
    const [statusCounts, overdue] = await prisma.$transaction([
      prisma.task.groupBy({
        by: ["status"],
        where: {
          userId,
          deletedAt: null,
          status: {
            in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED],
          },
        },
        _count: {
          status: true,
        },
        orderBy: {
          status: "asc",
        },
      }),
      prisma.task.count({
        where: {
          userId,
          deletedAt: null,
          dueDate: {
            lt: referenceDate,
          },
          status: {
            not: TaskStatus.COMPLETED,
          },
        },
      }),
    ]);

    const typedStatusCounts = statusCounts as StatusCountRow[];

    const countByStatus = new Map<TaskStatus, number>(
      typedStatusCounts.map((item) => [item.status, item._count.status]),
    );

    return {
      pending:
        (countByStatus.get(TaskStatus.PENDING) ?? 0) +
        (countByStatus.get(TaskStatus.IN_PROGRESS) ?? 0),
      completed: countByStatus.get(TaskStatus.COMPLETED) ?? 0,
      overdue,
    };
  }
}
