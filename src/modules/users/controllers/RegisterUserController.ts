import { Request, Response } from "express";
import { z } from "zod";
import { RegisterUserUseCase } from "../useCases/RegisterUserUseCase";
import { PrismaUserRepository } from "../repositories/PrismaUserRepository";
import { BcryptHashProvider } from "../../../shared/providers/BcryptHashProvider";

const registerUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export class RegisterUserController {
  async handle(req: Request, res: Response): Promise<void> {
    const { name, email, password } = registerUserSchema.parse(req.body);

    const userRepository = new PrismaUserRepository();
    const hashProvider = new BcryptHashProvider();

    const registerUseCase = new RegisterUserUseCase(
      userRepository,
      hashProvider,
    );

    const user = await registerUseCase.execute({
      name,
      email,
      password,

    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      status: "success",
      data: userWithoutPassword,
    });
  }
}
