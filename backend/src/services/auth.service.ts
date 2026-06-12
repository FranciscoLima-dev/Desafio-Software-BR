import bcrypt from "bcrypt";
import type { User } from "@prisma/client";
import { UserRepository } from "../repositories/user.repository.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import type { AuthenticatedUser, AuthResponse } from "../types/auth.js";
import { ApiError } from "../utils/api-error.js";
import { signAuthToken } from "../utils/jwt.js";

const PASSWORD_HASH_ROUNDS = 12;

export class AuthService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new ApiError(409, "Email ja cadastrado.");
    }

    const passwordHash = await bcrypt.hash(input.password, PASSWORD_HASH_ROUNDS);

    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    return this.createSession(user);
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new ApiError(401, "Credenciais invalidas.");
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new ApiError(401, "Credenciais invalidas.");
    }

    return this.createSession(user);
  }

  logout(): void {
    return undefined;
  }

  private createSession(user: User): AuthResponse {
    const authenticatedUser = this.toAuthenticatedUser(user);

    return {
      user: authenticatedUser,
      token: signAuthToken(authenticatedUser),
    };
  }

  private toAuthenticatedUser(user: User): AuthenticatedUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
