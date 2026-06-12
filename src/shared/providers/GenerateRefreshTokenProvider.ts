import { PrismaClient } from "@prisma/client";
import { IDateProvider } from "./IDateProvider.js";
import crypto from "crypto";

const prisma = new PrismaClient();

export class GenerateRefreshTokenProvider {
  constructor(private dateProvider: IDateProvider) {}

  async execute(userId: string) {
    const expiresAt = this.dateProvider.addDays(7);
    const token = crypto.randomUUID();

    const generateRefreshToken = await prisma.refreshToken.create({
      data: {
        userId,
        expiresAt,
        token,
      },
    });

    return generateRefreshToken;
  }
}
