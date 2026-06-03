import { expect, describe, it, beforeEach } from "vitest";
import { DeleteProductUseCase } from "./DeleteProductUseCase";
import { InMemoryProductRepository } from "../repositories/in-memory/InMemoryProductRepository";
import { AppError } from "../../../shared/errors/AppError";

let productRepositoryInMemory: InMemoryProductRepository;
let sut: DeleteProductUseCase;

describe("Delete Product Use Case", () => {
  beforeEach(() => {
    productRepositoryInMemory = new InMemoryProductRepository();
    sut = new DeleteProductUseCase(productRepositoryInMemory);
  });

  it("should be able to delete an existing product", async () => {
    const product = await productRepositoryInMemory.create({
      name: "Product A",
      description: "Sample product",
      price: 1000,
      stock: 10,
      category: "Tools",
    });

    await sut.execute(product.id);

    const deletedProduct = await productRepositoryInMemory.findById(product.id);
    expect(deletedProduct).toBeNull();
  });

  it("should throw an error when trying to delete a non-existing product", async () => {
    await expect(() => sut.execute("non-existing-id")).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
