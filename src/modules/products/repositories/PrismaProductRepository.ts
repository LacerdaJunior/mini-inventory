import type { Product } from "../../../../generated/prisma/client.ts";
import { prisma } from "../../../shared/lib/prisma";
import {
  ICreateProductInput,
  IProductRepository,
  IUpdateProductInput,
} from "./IProductRepository.js";

export class PrismaProductRepository implements IProductRepository {
  async findAll(skip?: number, take?: number): Promise<Product[]> {
    return prisma.product.findMany({
      skip,
      take,
    });
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async findByCategory(category: string, skip?: number, take?: number): Promise<Product[]> {
    return prisma.product.findMany({
      where: { category },
      skip,
      take,
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
