import { expect, describe, it, beforeEach } from "vitest";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { InMemoryUserRepository } from "../repositories/in-memory/InMemoryUserRepository";
import { IHashProvider } from "../../../shared/providers/IHashProvider";
import { ITokenProvider } from "../../../shared/providers/ITokenProvider";
import { AppError } from "../../../shared/errors/AppError";

class FakeHashProvider implements IHashProvider {
  async hash(payload: string): Promise<string> {
    return `${payload}-hashed`;
  }
  async compare(payload: string, hashed: string): Promise<boolean> {
    return `${payload}-hashed` === hashed;
  }
}

class FakeJwtProvider implements ITokenProvider {
  generateToken(payload: { sub: string }): string {
    return `fake-token-for-${payload.sub}`;
  }
  verify(token: string): { sub: string } {
    return { sub: "fake-id" };
  }
}

let userRepositoryInMemory: InMemoryUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeJwtProvider: FakeJwtProvider;
let sut: AuthenticateUserUseCase;

describe("Authenticate User Use Case", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeJwtProvider = new FakeJwtProvider();

    sut = new AuthenticateUserUseCase(
      userRepositoryInMemory,
      fakeHashProvider,
      fakeJwtProvider,
    );
  });

  it("should be able to authenticate an user", async () => {
    const user = await userRepositoryInMemory.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456-hashed",
    });

    const response = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(response).toHaveProperty("token");
    expect(response.user.email).toBe("johndoe@example.com");
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
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "wrong-password",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
