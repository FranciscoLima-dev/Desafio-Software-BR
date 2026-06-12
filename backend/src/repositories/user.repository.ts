import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }
}
