import type { User } from "../../../../generated/prisma/client.ts";
import { prisma } from "../../../shared/lib/prisma";
import {
  CreateUserInput,
  IUserRepository,
  UpdateUserInput,
} from "./IUserRepository";

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: CreateUserInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
  async softDelete(id: string): Promise<void> {
  await prisma.user.update({
    where: { 
      id: id 
    },
    data: { 
      isActive: false 
    }
  });
}
}
