import type { Prisma, User } from "../../../../../generated/prisma/client.ts";
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
    return user || null;
  }
  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id === id);
    return user || null;
  }

  async create(data: CreateUserInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      bio: null,
      createdAt: new Date(),
    };

    this.items.push(user);
    return user;
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const userIndex = this.items.findIndex((item) => item.id === id);
    Object.assign(this.items[userIndex], data);
    return this.items[userIndex];
  }
}
