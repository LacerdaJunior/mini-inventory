import type { Prisma, User } from "../../../../../generated/prisma/client.js";
import {
  CreateUserInput,
  IUserRepository,
  UpdateUserInput,
} from "../IUserRepository";
import { randomUUID } from "crypto";

export class InMemoryUserRepository implements IUserRepository {
  public items: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);
    return user ? { ...user } : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === id);
    return user ? { ...user } : null;
  }

  async create(data: CreateUserInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      bio: null,
      isActive: true,
      createdAt: new Date(),
    };

    this.items.push(user);

    return { ...user };
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const userIndex = this.items.findIndex((item) => item.id === id);
    const user = this.items[userIndex];

    if (data.name !== undefined) user.name = data.name as string;
    if (data.email !== undefined) user.email = data.email as string;
    if (data.bio !== undefined) user.bio = data.bio as string | null;
    if (data.password !== undefined) user.password = data.password as string;

    return { ...user };
  }

  async softDelete(id: string): Promise<void> {
    const userIndex = this.items.findIndex((item) => item.id === id);

    if (userIndex >= 0) {
      this.items[userIndex].isActive = false;
    }
  }
}
