import { expect, describe, it, beforeEach } from "vitest";
import { CreateProductUseCase } from "./CreateProductUseCase";
import { InMemoryProductRepository } from "../repositories/in-memory/InMemoryProductRepository";
import { AppError } from "../../../shared/errors/AppError";

let productRepositoryInMemory: InMemoryProductRepository;
let sut: CreateProductUseCase;

describe("Create Product Use Case", () => {
  beforeEach(() => {
    productRepositoryInMemory = new InMemoryProductRepository();
    sut = new CreateProductUseCase(productRepositoryInMemory);
  });

  it("should be able to create a new product", async () => {
    const product = await sut.execute({
      name: "Product A",
      description: "A sample product",
      price: 1000,
      stock: 20,
      category: "Tools",
    });

    expect(product.id).toEqual(expect.any(String));
    expect(product.name).toBe("Product A");
    expect(product.price).toBe(1000);
    expect(product.stock).toBe(20);
    expect(product.category).toBe("Tools");
  });

  it("should not be able to create two products with the same name", async () => {
    await productRepositoryInMemory.create({
      name: "Product A",
      description: "A sample product",
      price: 1000,
      stock: 20,
      category: "Tools",
    });

    await expect(() =>
      sut.execute({
        name: "Product A",
        description: "Another product",
        price: 1200,
        stock: 10,
        category: "Tools",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
