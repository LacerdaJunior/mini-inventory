import { Request, Response } from "express";
import { z } from "zod";
import { ListProductsUseCase } from "../useCases/ListProductsUseCase.js";
import { PrismaProductRepository } from "../repositories/PrismaProductRepository.js";

const listProductsSchema = z.object({
  category: z.string().optional(),
  name: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
});

export class ListProductsController {
  async handle(req: Request, res: Response): Promise<void> {
    const { category, name, limit, page } = listProductsSchema.parse(req.query);

    const productRepository = new PrismaProductRepository();
    const listProductsUseCase = new ListProductsUseCase(productRepository);

    const products = await listProductsUseCase.execute({
      category,
      name,
      limit,
      page,
    });

    res.status(200).json({
      status: "success",
      data: products,
    });
  }
}
