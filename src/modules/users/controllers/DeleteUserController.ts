import { Request, Response } from "express";
import { z } from "zod";
import { DeleteUserUseCase } from "../useCases/DeleteUserUseCase";
import { PrismaUserRepository } from "../repositories/PrismaUserRepository";

const deleteUserSchema = z.object({
  passwordConfirmation: z
    .string()
    .min(6, "Password confirmation must be at least 6 characters"),
});

export class DeleteUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { passwordConfirmation } = deleteUserSchema.parse(req.body);
    const userId = req.user.id;

    const userRepository = new PrismaUserRepository();
    const deleteUserUseCase = new DeleteUserUseCase(userRepository);

    await deleteUserUseCase.execute({
      userId,
      passwordConfirmation,
    });

    return res.status(200).json({
      status: "success",
      message: "User deleted successfully.",
    });
  }
}
