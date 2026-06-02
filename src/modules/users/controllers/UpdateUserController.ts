import { Request, Response } from "express";
import { z } from "zod";
import { UpdateUserUseCase } from "../useCases/UpdateUserUseCase";
import { PrismaUserRepository } from "../repositories/PrismaUserRepository";
import { BcryptHashProvider } from "../../../shared/providers/BcryptHashProvider";

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email("Invalid email format").optional(),
  bio: z.string().max(255).optional(),
  oldPassword: z
    .string()
    .min(6, "Old password must be at least 6 characters")
    .optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

export class UpdateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, email, bio, oldPassword, password } = updateUserSchema.parse(
      req.body,
    );

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "User not authenticated.",
      });
    }

    const userRepository = new PrismaUserRepository();
    const hashProvider = new BcryptHashProvider();
    const updateUserUseCase = new UpdateUserUseCase(
      userRepository,
      hashProvider,
    );

    const updatedUser = await updateUserUseCase.execute({
      id: userId,
      name,
      email,
      bio,
      oldPassword,
      password,
    });

    return res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  }
}
