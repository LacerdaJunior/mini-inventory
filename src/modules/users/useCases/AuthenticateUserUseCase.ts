import type { User } from "../../../../generated/prisma/client.js";
import { IHashProvider } from "../../../shared/providers/IHashProvider.js";
import { AuthenticateUserDTO } from "../dtos/AuthenticateUserDTO.js";
import { IUserRepository } from "../repositories/IUserRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { ITokenProvider } from "../../../shared/providers/ITokenProvider.js";

interface IAuthenticateResponse {
  user: User;
  token: string;
}

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashProvider: IHashProvider,
    private readonly tokenProvider: ITokenProvider,
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

    const token = this.tokenProvider.generateToken({ sub: user.id });

    Reflect.deleteProperty(user, "password");

    return {
      user,
      token,
    };
  }
}
