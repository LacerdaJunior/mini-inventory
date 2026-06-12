import { Request, Response } from "express";
import { z } from "zod";
import { RefreshTokenUseCase } from "../useCases/RefreshTokenUseCase.js";
import { JwtProvider } from "../../../shared/providers/JwtProvider.js";
import { GenerateRefreshTokenProvider } from "../../../shared/providers/GenerateRefreshTokenProvider.js";
import { DayjsDateProvider } from "../../../shared/providers/DayjsDateProvider.js";
import { PrismaUserRepository } from "../repositories/PrismaUserRepository.js";


const refreshTokenSchema = z.object({
  refreshToken: z.string().uuid("Formato de token inválido."),
});

export class RefreshTokenController {
  async handle(req: Request, res: Response): Promise<void> {

    const { refreshToken } = refreshTokenSchema.parse(req.body);

    const jwtProvider = new JwtProvider();
    const dateProvider = new DayjsDateProvider();
    const generateRefreshTokenProvider = new GenerateRefreshTokenProvider(
      dateProvider,
    );
    const userRepository = new PrismaUserRepository();

    const refreshTokenUseCase = new RefreshTokenUseCase(
      jwtProvider,
      generateRefreshTokenProvider,
      userRepository,
    );


    const tokens = await refreshTokenUseCase.execute(refreshToken);

    res.status(200).json({
      status: "success",
      data: tokens,
    });
  }
}
