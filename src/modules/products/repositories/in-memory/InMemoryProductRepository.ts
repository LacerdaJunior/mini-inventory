import { randomUUID } from "crypto";
import type { Product } from "../../../../../generated/prisma/client.js";
import {
  ICreateProductInput,
  IProductRepository,
  IUpdateProductInput,
} from "../IProductRepository.js";

export class InMemoryProductRepository implements IProductRepository {
  private products: Product[] = [];

  async findAll(skip?: number, take?: number): Promise<Product[]> {
    const start = skip ?? 0;
    const end = take ? start + take : undefined;
    return this.products.slice(start, end);
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.find((product) => product.id === id) ?? null;
  }

  async findByCategory(
    category: string,
    skip?: number,
    take?: number,
  ): Promise<Product[]> {
    const filtered = this.products.filter(
      (product) => product.category === category,
    );
    const start = skip ?? 0;
    const end = take ? start + take : undefined;
    return filtered.slice(start, end);
  }

  async findByName(name: string): Promise<Product | null> {
    return this.products.find((product) => product.name === name) ?? null;
  }

  async create(data: ICreateProductInput): Promise<Product> {
    const product: Product = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category: data.category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.products.push(product);
    return product;
  }

  async update(id: string, data: IUpdateProductInput): Promise<Product> {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );

    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    const existingProduct = this.products[productIndex];
    const updatedProduct = {
      ...existingProduct,
      ...data,
      updatedAt: new Date(),
    };

    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  async delete(id: string): Promise<void> {
    this.products = this.products.filter((product) => product.id !== id);
  }
}
