import { expect, describe, it, beforeEach } from "vitest";
import { ListProductsUseCase } from "./ListProductsUseCase";
import { InMemoryProductRepository } from "../repositories/in-memory/InMemoryProductRepository";

let productRepositoryInMemory: InMemoryProductRepository;
let sut: ListProductsUseCase;

describe("List Products Use Case", () => {
  beforeEach(() => {
    productRepositoryInMemory = new InMemoryProductRepository();
    sut = new ListProductsUseCase(productRepositoryInMemory);
  });

  it("should return all products when no filters are applied", async () => {
    await productRepositoryInMemory.create({
      name: "Product A",
      description: "Sample A",
      price: 1000,
      stock: 5,
      category: "Tools",
    });

    await productRepositoryInMemory.create({
      name: "Product B",
      description: "Sample B",
      price: 2000,
      stock: 3,
      category: "Garden",
    });

    const products = await sut.execute({});

    expect(products).toHaveLength(2);
    expect(products.map((product) => product.name)).toEqual([
      "Product A",
      "Product B",
    ]);
  });

  it("should filter products by category", async () => {
    await productRepositoryInMemory.create({
      name: "Product A",
      description: "Sample A",
      price: 1000,
      stock: 5,
      category: "Tools",
    });

    await productRepositoryInMemory.create({
      name: "Product B",
      description: "Sample B",
      price: 2000,
      stock: 3,
      category: "Garden",
    });

    const products = await sut.execute({ category: "Garden" });

    expect(products).toHaveLength(1);
    expect(products[0].category).toBe("Garden");
  });

  it("should return a single product when filtered by name", async () => {
    await productRepositoryInMemory.create({
      name: "Product A",
      description: "Sample A",
      price: 1000,
      stock: 5,
      category: "Tools",
    });

    await productRepositoryInMemory.create({
      name: "Product B",
      description: "Sample B",
      price: 2000,
      stock: 3,
      category: "Garden",
    });

    const products = await sut.execute({ name: "Product B" });

    expect(products).toHaveLength(1);
    expect(products[0].name).toBe("Product B");
  });

  it("should paginate products using page and limit", async () => {
    for (let i = 1; i <= 5; i += 1) {
      await productRepositoryInMemory.create({
        name: `Product ${i}`,
        description: `Sample ${i}`,
        price: 1000 * i,
        stock: i,
        category: "Tools",
      });
    }

    const products = await sut.execute({ page: 2, limit: 2 });

    expect(products).toHaveLength(2);
    expect(products[0].name).toBe("Product 3");
    expect(products[1].name).toBe("Product 4");
  });

  it("should throw an error when searching by name and product does not exist", async () => {
    await expect(() => sut.execute({ name: "Nonexistent" })).rejects.toThrow(
      "Product not found.",
    );
  });
});
