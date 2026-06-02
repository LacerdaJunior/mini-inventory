import type { Product } from "../../../../generated/prisma/client.js";

export interface ICreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export interface IUpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
}

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  create(data: ICreateProductInput): Promise<Product>;
  update(id: string, data: IUpdateProductInput): Promise<Product>;
  delete(id: string): Promise<void>;
  findByCategory(category: string): Promise<Product[]>;
  findByName(name: string): Promise<Product | null>;
}
