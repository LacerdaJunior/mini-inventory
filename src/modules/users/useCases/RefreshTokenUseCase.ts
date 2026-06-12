import { PrismaClient } from "@prisma/client";
import { AppError } from "../../../shared/errors/AppError.js";
import { ITokenProvider } from "../../../shared/providers/ITokenProvider.js";
import { GenerateRefreshTokenProvider } from "../../../shared/providers/GenerateRefreshTokenProvider.js";
import dayjs from "dayjs";
import { PrismaUserRepository } from "../repositories/PrismaUserRepository.js";

const prisma = new PrismaClient();

export class RefreshTokenUseCase {
  constructor(
    private readonly tokenProvider: ITokenProvider,
    private readonly generateRefreshTokenProvider: GenerateRefreshTokenProvider,
    private readonly prismaUserRepository: PrismaUserRepository,
  ) {}

  async execute(refreshTokenString: string) {
    const refreshTokenExists = await prisma.refreshToken.findUnique({
      where: {
        token: refreshTokenString,
      },
    });

    if (!refreshTokenExists) {
      throw new AppError("Refresh token does not exist.", 401);
    }

    const isExpired = dayjs().isAfter(dayjs(refreshTokenExists.expiresAt));

    if (isExpired) {
      throw new AppError("Refresh token expired. Please login again.", 401);
    }

    const user = await this.prismaUserRepository.findById(refreshTokenExists.userId);

    const newAccessToken = this.tokenProvider.generateToken({
      sub: refreshTokenExists.userId,

      role: user?.role || "USER",
    });

    const newRefreshToken = await this.generateRefreshTokenProvider.execute(
      refreshTokenExists.userId,
    );

    await prisma.refreshToken.delete({
      where: {
        id: refreshTokenExists.id,
      },
    });

    return {
      token: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
