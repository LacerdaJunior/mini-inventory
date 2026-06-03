import { IUserRepository } from "../repositories/IUserRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { compare } from "bcrypt";
import { DeleteUserDTO } from "../dtos/DeleteUserDTO.js";

export class DeleteUserUseCase {
  constructor(private usersRepository: IUserRepository) {}

  async execute({ userId, passwordConfirmation }: DeleteUserDTO): Promise<void> {

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    
    const passwordMatch = await compare(passwordConfirmation, user.password);

    if (!passwordMatch) {
      throw new AppError("Incorrect password. The account was not deleted.", 401);
    }

   
    await this.usersRepository.softDelete(userId);
  }
}
