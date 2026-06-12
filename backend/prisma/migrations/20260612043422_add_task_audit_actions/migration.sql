-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TaskHistoryAction" ADD VALUE 'TASK_CREATED';
ALTER TYPE "TaskHistoryAction" ADD VALUE 'TASK_UPDATED';
ALTER TYPE "TaskHistoryAction" ADD VALUE 'TASK_DELETED';

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "tasks_user_id_deleted_at_idx" ON "tasks"("user_id", "deleted_at");
