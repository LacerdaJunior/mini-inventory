import type { Product } from "../../../../generated/prisma/client.ts";
import { prisma } from "../../../shared/lib/prisma";
import {
  ICreateProductInput,
  IProductRepository,
  IUpdateProductInput,
} from "./IProductRepository.js";

export class PrismaProductRepository implements IProductRepository {
  async findAll(): Promise<Product[]> {
    return prisma.product.findMany();
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async findByCategory(category: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: { category },
    });
  }

  async findByName(name: string): Promise<Product | null> {
    return prisma.product.findFirst({
      where: { name },
    });
  }

  async create(data: ICreateProductInput): Promise<Product> {
    return prisma.product.create({
      data,
    });
  }

  async update(id: string, data: IUpdateProductInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }
}
