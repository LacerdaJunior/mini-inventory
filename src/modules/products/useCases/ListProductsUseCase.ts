import type { Product } from "../../../../generated/prisma/client.js";
import { IProductRepository } from "../repositories/IProductRepository.js";
import { ListProductsDTO } from "../dtos/ListProductsDTO.js";
import { AppError } from "../../../shared/errors/AppError.js";

export class ListProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(data: ListProductsDTO): Promise<Product[]> {
    const { category, name, page = 1, limit = 10 } = data;

    const take = limit;
    const skip = (page - 1) * limit;

    if (category) {
      return this.productRepository.findByCategory(category, skip, take);
    }

    if (name) {
      const product = await this.productRepository.findByName(name);
      if (!product) throw new AppError("Product not found.", 404);
      return [product];
    }

    return this.productRepository.findAll(skip, take);
  }
}
