import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate-request.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { asyncHandler } from "../utils/async-handler.js";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post(
  "/register",
  validateRequest({ body: registerSchema }),
  asyncHandler(authController.register),
);

authRoutes.post(
  "/login",
  validateRequest({ body: loginSchema }),
  asyncHandler(authController.login),
);

authRoutes.post("/logout", authenticate, asyncHandler(authController.logout));

export { authRoutes };
