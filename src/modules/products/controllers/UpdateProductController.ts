import { Request, Response } from "express";
import { z } from "zod";
import { UpdateProductUseCase } from "../useCases/UpdateProductUseCase.js";
import { PrismaProductRepository } from "../repositories/PrismaProductRepository.js";

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().int().positive().optional(),
  stock: z.number().int().nonnegative().optional(),
  category: z.string().min(1).optional(),
});

export class UpdateProductController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, description, price, stock, category } =
      updateProductSchema.parse(req.body);
    const id = req.params.id as string;

    const productRepository = new PrismaProductRepository();
    const updateProductUseCase = new UpdateProductUseCase(productRepository);

    const updatedProduct = await updateProductUseCase.execute({
      id,
      name,
      description,
      price,
      stock,
      category,
    });

    return res.status(200).json({
      status: "success",
      data: updatedProduct,
    });
  }
}
