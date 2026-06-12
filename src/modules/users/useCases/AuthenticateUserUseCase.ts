import type { Role, User } from "../../../../generated/prisma/client.js";
import { IHashProvider } from "../../../shared/providers/IHashProvider.js";
import { AuthenticateUserDTO } from "../dtos/AuthenticateUserDTO.js";
import { IUserRepository } from "../repositories/IUserRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ITokenProvider } from "../../../shared/providers/ITokenProvider.js";
import { GenerateRefreshTokenProvider } from "../../../shared/providers/GenerateRefreshTokenProvider.js";

interface IAuthenticateResponse {
  user: User;
  token: string;
  role: Role;
  refreshToken: {
    token: string;
    expiresAt: Date;
  };
  
}

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashProvider: IHashProvider,
    private readonly tokenProvider: ITokenProvider,
    private readonly generateRefreshTokenProvider: GenerateRefreshTokenProvider,
  ) {}

  async execute(data: AuthenticateUserDTO): Promise<IAuthenticateResponse> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError("Invalid email or password.", 401);
    }

    const passwordMatch = await this.hashProvider.compare(
      data.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new AppError("Invalid email or password.", 401);
    }

    const token = this.tokenProvider.generateToken({
      sub: user.id,
      role: user.role,
    });

    const refreshToken = await this.generateRefreshTokenProvider.execute(user.id);

    Reflect.deleteProperty(user, "password");

    return {
      user,
      token,
      role: user.role,
      refreshToken,
    };
  }
}
