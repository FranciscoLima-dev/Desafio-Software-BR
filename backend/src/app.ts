import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { globalErrorHandler } from "./middlewares/global-error-handler.js";
import { routes } from "./routes/index.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ success: true, message: "API disponivel." });
});

app.use("/api", routes);
app.use(globalErrorHandler);
