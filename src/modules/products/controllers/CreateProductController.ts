import { Request, Response } from "express";
import { z } from "zod";
import { CreateProductUseCase } from "../useCases/CreateProductUseCase.js";
import { PrismaProductRepository } from "../repositories/PrismaProductRepository.js";

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().int().positive("Price must be a positive integer in cents"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  category: z.string().min(1, "Category is required"),
});

export class CreateProductController {
  async handle(req: Request, res: Response): Promise<void> {
    const { name, description, price, stock, category } =
      createProductSchema.parse(req.body);

    const productRepository = new PrismaProductRepository();
    const createProductUseCase = new CreateProductUseCase(productRepository);
    const product = await createProductUseCase.execute({
      name,
      description,
      price,
      stock,
      category,
    });

    res.status(201).json({
      status: "success",
      data: product,
    });
  }
}
