import { Request, Response } from "express";
import { z } from "zod";
import { AuthenticateUserUseCase } from "../useCases/AuthenticateUserUseCase";
import { PrismaUserRepository } from "../repositories/PrismaUserRepository";
import { BcryptHashProvider } from "../../../shared/providers/BcryptHashProvider";
import { JwtProvider } from "../../../shared/providers/JwtProvider";

const authenticateUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export class AuthenticateUserController {
  async handle(req: Request, res: Response): Promise<void> {
    const { email, password } = authenticateUserSchema.parse(req.body);

    const userRepository = new PrismaUserRepository();
    const hashProvider = new BcryptHashProvider();
    const jwtProvider = new JwtProvider();

    const authenticateUseCase = new AuthenticateUserUseCase(
      userRepository,
      hashProvider,
      jwtProvider,
    );

    const { user, token } = await authenticateUseCase.execute({
      email,
      password,
    });

    res.status(200).json({
      user,
      token,
    });
    
  }
}
