import type { User } from "../../../../generated/prisma/client.js";
import { IHashProvider } from "../../../shared/providers/IHashProvider.js";
import { RegisterUserDTO } from "../dtos/RegisterUserDTO.js";
import { IUserRepository } from "../repositories/IUserRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashProvider: IHashProvider,
  ) {}

  async execute(data: RegisterUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError("User with this email already exists.", 409);
    }

    const hashedPassword = await this.hashProvider.hash(data.password);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return user;
  }
}
