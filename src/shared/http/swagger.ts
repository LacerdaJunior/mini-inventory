import { Router } from "express";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";

const swaggerRouter = Router();


const specPath = path.resolve(process.cwd(), "openapi.json");

if (fs.existsSync(specPath)) {
  const specJson = JSON.parse(fs.readFileSync(specPath, "utf-8"));
  

  swaggerRouter.use("/", swaggerUi.serve, swaggerUi.setup(specJson));
} else {
  swaggerRouter.get("/", (_req, res) => {
    res.status(404).json({ status: "error", message: "OpenAPI spec not found. Verifique o caminho." });
  });
}

export { swaggerRouter };