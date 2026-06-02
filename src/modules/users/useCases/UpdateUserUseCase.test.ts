import { expect, describe, it, beforeEach } from "vitest";
import { UpdateUserUseCase } from "./UpdateUserUseCase";
import { InMemoryUserRepository } from "../repositories/in-memory/InMemoryUserRepository";
import { IHashProvider } from "../../../shared/providers/IHashProvider";
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
let sut: UpdateUserUseCase;

describe("Update User Use Case", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUserRepository();
    fakeHashProvider = new FakeHashProvider();
    sut = new UpdateUserUseCase(userRepositoryInMemory, fakeHashProvider);
  });

  it("should be able to update user basic info", async () => {
    const user = await userRepositoryInMemory.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456-hashed",
    });

    const updatedUser = await sut.execute({
      id: user.id,
      name: "John Updated",
      bio: "New bio",
    });

    expect(updatedUser.name).toBe("John Updated");
    expect(updatedUser.bio).toBe("New bio");
  });

  it("should be able to update password with correct old password", async () => {
    const user = await userRepositoryInMemory.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456-hashed",
    });

    const updatedUser = await sut.execute({
      id: user.id,
      oldPassword: "123456",
      password: "newpassword123",
    });

    const checkedUser = await userRepositoryInMemory.findById(user.id);
    expect(checkedUser?.password).toBe("newpassword123-hashed");
  });

  it("should not be able to update password without old password", async () => {
    const user = await userRepositoryInMemory.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456-hashed",
    });

    await expect(() =>
      sut.execute({
        id: user.id,
        password: "newpassword123",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update password with wrong old password", async () => {
    const user = await userRepositoryInMemory.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456-hashed",
    });

    await expect(() =>
      sut.execute({
        id: user.id,
        oldPassword: "wrongpassword",
        password: "newpassword123",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
