import type { Product } from "../../../../generated/prisma/client.js";
import { IProductRepository } from "../repositories/IProductRepository.js";
import { UpdateProductDTO } from "../dtos/UpdateProductDTO.js";
import { AppError } from "../../../shared/errors/AppError.js";

export class UpdateProductUseCase {
  constructor(private productsRepository: IProductRepository) {}

  async execute(data: UpdateProductDTO): Promise<Product> {
    const product = await this.productsRepository.findById(data.id);

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    const updatedProduct = await this.productsRepository.update(
      product.id,
      data,
    );
    return updatedProduct;
  }
}
