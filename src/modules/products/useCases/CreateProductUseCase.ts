import type { Product } from "../../../../generated/prisma/client.js";
import { IProductRepository } from "../repositories/IProductRepository.js";
import { CreateProductDTO } from "../dtos/CreateProductDTO.js";
import { AppError } from "../../../shared/errors/AppError.js";

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(data: CreateProductDTO): Promise<Product> {
    const productAlreadyExists = await this.productRepository.findByName(
      data.name,
    );

    if (productAlreadyExists) {
      throw new AppError("Product with this name already exists.", 409);
    }

    const product = await this.productRepository.create(data);
    return product;
  }
}
