import type { User } from "../../../../generated/prisma/client.js";
import { IUserRepository } from "../repositories/IUserRepository.js";
import { IHashProvider } from "../../../shared/providers/IHashProvider.js";
import { AppError } from "../../../shared/errors/AppError.js";

interface IUpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  bio?: string;
  oldPassword?: string;
  password?: string;
}

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashProvider: IHashProvider,
  ) {}

  async execute({
    id,
    name,
    email,
    bio,
    oldPassword,
    password,
  }: IUpdateUserRequest): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    if (email && email !== user.email) {
      const userWithSameEmail = await this.userRepository.findByEmail(email);
      if (userWithSameEmail) {
        throw new AppError("This email is already in use.", 409);
      }
    }

    let passwordToUpdate = user.password;

    if (password && !oldPassword) {
      throw new AppError(
        "You must inform the old password to set a new password.",
        400,
      );
    }

    if (password && oldPassword) {
      const checkOldPassword = await this.hashProvider.compare(
        oldPassword,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError("Old password does not match.", 400);
      }

      passwordToUpdate = await this.hashProvider.hash(password);
    }

    const updatedUser = await this.userRepository.update(id, {
      name,
      email,
      bio,
      password: passwordToUpdate,
    });

    const safeUser = { ...updatedUser };
    Reflect.deleteProperty(safeUser, 'password');

    return safeUser;
  }
}
