import { expect, describe, it, beforeEach } from "vitest";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { InMemoryUserRepository } from "../repositories/in-memory/InMemoryUserRepository";
import { IHashProvider } from "../../../shared/providers/IHashProvider";
import {
  ITokenProvider,
  TokenPayload,
} from "../../../shared/providers/ITokenProvider";
import { AppError } from "../../../shared/errors/AppError";
import { Role } from "../../../../generated/prisma/enums.js";

class FakeHashProvider implements IHashProvider {
  async hash(payload: string): Promise<string> {
    return `${payload}-hashed`;
  }
  async compare(payload: string, hashed: string): Promise<boolean> {
    return `${payload}-hashed` === hashed;
  }
}

// 1. Atualizamos o FakeJwtProvider para respeitar o novo contrato com "role"
class FakeJwtProvider implements ITokenProvider {
  generateToken(payload: TokenPayload): string {
    return `fake-token-for-${payload.sub}-role-${payload.role}`;
  }
  verify(token: string): TokenPayload {
    return { sub: "fake-id", role: Role.USER };
  }
}

// 2. Criamos um "dublê" do gerador de Refresh Token para não usar o Prisma nos testes
class FakeGenerateRefreshTokenProvider {
  async execute(userId: string) {
    return {
      id: "fake-uuid-1234",
      token: "fake-refresh-token-string",
      userId,
      expiresAt: new Date(),
    };
  }
}

let userRepositoryInMemory: InMemoryUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeJwtProvider: FakeJwtProvider;
let fakeGenerateRefreshTokenProvider: FakeGenerateRefreshTokenProvider;
let sut: AuthenticateUserUseCase;

describe("Authenticate User Use Case", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeJwtProvider = new FakeJwtProvider();
    fakeGenerateRefreshTokenProvider = new FakeGenerateRefreshTokenProvider();

    // 3. Injetamos a nova dependência no caso de uso (usamos 'as any' porque
    // injetamos um Fake no lugar de uma classe concreta do Prisma)
    sut = new AuthenticateUserUseCase(
      userRepositoryInMemory,
      fakeHashProvider,
      fakeJwtProvider,
      fakeGenerateRefreshTokenProvider as any,
    );
  });

  it("should be able to authenticate an user", async () => {
    // Garantimos que o usuário criado no banco em memória tenha a role
    const user = await userRepositoryInMemory.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456-hashed",
      role: Role.USER,
    });

    const response = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(response).toHaveProperty("token");
    expect(response.user.email).toBe("johndoe@example.com");

    // 4. Novas asserções de segurança!
    expect(response).toHaveProperty("role");
    expect(response.role).toBe(Role.USER);
    expect(response).toHaveProperty("refreshToken");
    expect(response.refreshToken.token).toBe("fake-refresh-token-string");
  });

  it("should not be able to authenticate with non-existent email", async () => {
    await expect(() =>
      sut.execute({
        email: "non-existent@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with wrong password", async () => {
    await userRepositoryInMemory.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456-hashed",
      role: Role.USER,
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "wrong-password",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
