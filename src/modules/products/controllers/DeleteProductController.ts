import { Request, Response } from "express";
import { z } from "zod";
import { DeleteProductUseCase } from "../useCases/DeleteProductUseCase.js";
import { PrismaProductRepository } from "../repositories/PrismaProductRepository.js";

const deleteProductSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
});

export class DeleteProductController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = deleteProductSchema.parse(req.params);

    const productRepository = new PrismaProductRepository();
    const deleteProductUseCase = new DeleteProductUseCase(productRepository);

    await deleteProductUseCase.execute(id);

    return res.status(200).json({
      status: "success",
      message: "Product deleted successfully.",
    });
  }
}
