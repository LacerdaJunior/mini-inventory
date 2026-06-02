import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUserUseCase } from "./RegisterUserUseCase";
import { InMemoryUserRepository } from "../repositories/in-memory/InMemoryUserRepository";
import type { IHashProvider } from "../../../shared/providers/IHashProvider";
import { AppError } from "../../../shared/errors/AppError";

class FakeHashProvider implements IHashProvider {
  async hash(payload: string): Promise<string> {
    return `${payload}-hashed`;
  }
  async compare(payload: string, hashed: string): Promise<boolean> {
    return `${payload}-hashed` === hashed;
  }
}

let userRepositoryInMemory: InMemoryUserRepository;
let fakeHashProvider: FakeHashProvider;
let sut: RegisterUserUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUserRepository();
    fakeHashProvider = new FakeHashProvider();

    sut = new RegisterUserUseCase(userRepositoryInMemory, fakeHashProvider);
  });

  it("should be able to register a new user", async () => {
    const user = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.password).toBe("123456-hashed");
  });

  it("should not be able to register with same email twice", async () => {
    await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "Jane Doe",
        email: "johndoe@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
