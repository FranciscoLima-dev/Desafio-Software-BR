import { Router } from "express";
import { TaskController } from "../controllers/task.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate-request.js";
import {
  createTaskSchema,
  listTasksQuerySchema,
  taskIdParamSchema,
  updateTaskSchema,
} from "../schemas/task.schema.js";
import { asyncHandler } from "../utils/async-handler.js";

const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.use(authenticate);

taskRoutes.get(
  "/",
  validateRequest({ query: listTasksQuerySchema }),
  asyncHandler(taskController.list),
);

taskRoutes.post(
  "/",
  validateRequest({ body: createTaskSchema }),
  asyncHandler(taskController.create),
);

taskRoutes.get(
  "/:id",
  validateRequest({ params: taskIdParamSchema }),
  asyncHandler(taskController.findById),
);

taskRoutes.put(
  "/:id",
  validateRequest({ params: taskIdParamSchema, body: updateTaskSchema }),
  asyncHandler(taskController.update),
);

taskRoutes.delete(
  "/:id",
  validateRequest({ params: taskIdParamSchema }),
  asyncHandler(taskController.remove),
);

taskRoutes.get(
  "/:id/history",
  validateRequest({ params: taskIdParamSchema }),
  asyncHandler(taskController.history),
);

export { taskRoutes };

