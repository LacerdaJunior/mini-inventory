import { expect, describe, it, beforeEach } from "vitest";
import { UpdateProductUseCase } from "./UpdateProductUseCase";
import { InMemoryProductRepository } from "../repositories/in-memory/InMemoryProductRepository";
import { AppError } from "../../../shared/errors/AppError";

let productRepositoryInMemory: InMemoryProductRepository;
let sut: UpdateProductUseCase;

describe("Update Product Use Case", () => {
  beforeEach(() => {
    productRepositoryInMemory = new InMemoryProductRepository();
    sut = new UpdateProductUseCase(productRepositoryInMemory);
  });

  it("should be able to update an existing product", async () => {
    const product = await productRepositoryInMemory.create({
      name: "Product A",
      description: "Sample product",
      price: 1000,
      stock: 10,
      category: "Tools",
    });

    const updatedProduct = await sut.execute({
      id: product.id,
      name: "Updated Product A",
      price: 1500,
    });

    expect(updatedProduct.name).toBe("Updated Product A");
    expect(updatedProduct.price).toBe(1500);
    expect(updatedProduct.description).toBe("Sample product");
  });

  it("should throw an error when the product does not exist", async () => {
    await expect(() =>
      sut.execute({
        id: "non-existing-id",
        name: "Updated Product",
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
