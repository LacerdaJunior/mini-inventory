import { Router } from "express";
import { RegisterUserController } from "../../../modules/users/controllers/RegisterUserController.js";
import { AuthenticateUserController } from "../../../modules/users/controllers/AuthenticateUserController.js";
import { UpdateUserController } from "../../../modules/users/controllers/UpdateUserController.js";
import { DeleteUserController } from "../../../modules/users/controllers/DeleteUserController.js";
import { CreateProductController } from "../../../modules/products/controllers/CreateProductController.js";
import { ListProductsController } from "../../../modules/products/controllers/ListProductsController.js";
import { UpdateProductController } from "../../../modules/products/controllers/UpdateProductController.js";
import { DeleteProductController } from "../../../modules/products/controllers/DeleteProductController.js";
import { RefreshTokenController } from "../../../modules/users/controllers/RefreshTokenController.js";

//Middlewares
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js";
import { ensureAdmin } from "../middlewares/ensureAdmin.js"; 

const routes = Router();

const registerUserController = new RegisterUserController();
const authenticateUserController = new AuthenticateUserController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();
const createProductController = new CreateProductController();
const listProductsController = new ListProductsController();
const updateProductController = new UpdateProductController();
const deleteProductController = new DeleteProductController();
const refreshTokenController = new RefreshTokenController();

// ==========================================
// 🟢 ROTAS PÚBLICAS
// ==========================================
routes.post("/users", registerUserController.handle);
routes.post("/login", authenticateUserController.handle);
routes.post("/refresh-token", refreshTokenController.handle);

// ==========================================
// 🟡 MURO DE AUTENTICAÇÃO (Apenas logados)
// ==========================================
routes.use(ensureAuthenticated);

// Rotas de Perfil (Qualquer User ou Admin)
routes.put("/profile", updateUserController.handle);
routes.delete("/profile", deleteUserController.handle);

// Leitura de produtos liberada para funcionários (Users)
routes.get("/products", listProductsController.handle);

// ==========================================
// 🔴 MURO DE AUTORIZAÇÃO (Apenas ADMIN)
// ==========================================
// O Express permite passar uma lista de middlewares. Primeiro passa pelo global (logado), depois por este:
routes.post("/products", ensureAdmin, createProductController.handle);
routes.put("/products/:id", ensureAdmin, updateProductController.handle);
routes.delete("/products/:id", ensureAdmin, deleteProductController.handle);

export { routes };