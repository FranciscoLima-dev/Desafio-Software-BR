import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/async-handler.js";

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.use(authenticate);
dashboardRoutes.get("/", asyncHandler(dashboardController.summary));

export { dashboardRoutes };
