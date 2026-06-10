import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  CORS_ORIGIN: z.string().url(),
  DATABASE_URL: z.string().min(1),
  JWT_EXPIRES_IN: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().int().positive().default(3333),
});

export const env = envSchema.parse(process.env);

