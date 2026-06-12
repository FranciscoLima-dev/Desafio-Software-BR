import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthenticatedUser } from "../types/auth.js";
import { ApiError } from "./api-error.js";

type TokenPayload = {
  userId: string;
  email: string;
};

export const signAuthToken = (user: AuthenticatedUser): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
    subject: user.id,
  };

  return jwt.sign(
    {
      email: user.email,
      name: user.name,
    },
    env.JWT_SECRET,
    options,
  );
};

export const verifyAuthToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    if (typeof decoded.sub !== "string" || typeof decoded.email !== "string") {
      throw new ApiError(401, "Token invalido.");
    }

    return {
      userId: decoded.sub,
      email: decoded.email,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Token invalido ou expirado.");
  }
};

