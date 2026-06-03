import { expect, describe, it, beforeEach } from "vitest";
import { hash } from "bcrypt";
import { DeleteUserUseCase } from "./DeleteUserUseCase";
import { InMemoryUserRepository } from "../repositories/in-memory/InMemoryUserRepository";
import { AppError } from "../../../shared/errors/AppError";

let userRepositoryInMemory: InMemoryUserRepository;
let sut: DeleteUserUseCase;

describe("Delete User Use Case", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUserRepository();
    sut = new DeleteUserUseCase(userRepositoryInMemory);
  });

  it("should be able to delete a user with valid password", async () => {
    const hashedPassword = await hash("123456", 8);

    const user = await userRepositoryInMemory.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: hashedPassword,
    });

    await sut.execute({
      userId: user.id,
      passwordConfirmation: "123456",
    });

    const deletedUser = await userRepositoryInMemory.findById(user.id);

    expect(deletedUser).not.toBeNull();
    expect(deletedUser?.isActive).toBe(false);
  });

  it("should not delete a user with incorrect password", async () => {
    const hashedPassword = await hash("123456", 8);

    const user = await userRepositoryInMemory.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: hashedPassword,
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        passwordConfirmation: "wrongpassword",
      }),
    ).rejects.toBeInstanceOf(AppError);

    const existingUser = await userRepositoryInMemory.findById(user.id);
    expect(existingUser?.isActive).toBe(true);
  });

  it("should not delete a non-existing user", async () => {
    await expect(() =>
      sut.execute({
        userId: "non-existing-id",
        passwordConfirmation: "123456",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
