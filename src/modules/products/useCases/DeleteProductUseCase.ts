import { IProductRepository } from "../repositories/IProductRepository.js";
import { AppError } from "../../../shared/errors/AppError.js";

export class DeleteProductUseCase {
  constructor(private productsRepository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    const productExists = await this.productsRepository.findById(id);

    if (!productExists) {
      throw new AppError("Product not found.", 404);
    }

    await this.productsRepository.delete(id);
  }
}
