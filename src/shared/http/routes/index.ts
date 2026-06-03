import { Router } from "express";
import { RegisterUserController } from "../../../modules/users/controllers/RegisterUserController.js";
import { AuthenticateUserController } from "../../../modules/users/controllers/AuthenticateUserController.js";
import { UpdateUserController } from "../../../modules/users/controllers/UpdateUserController.js";
import { DeleteUserController } from "../../../modules/users/controllers/DeleteUserController.js";
import { CreateProductController } from "../../../modules/products/controllers/CreateProductController.js";
import { ListProductsController } from "../../../modules/products/controllers/ListProductsController.js";
import { UpdateProductController } from "../../../modules/products/controllers/UpdateProductController.js";
import { DeleteProductController } from "../../../modules/products/controllers/DeleteProductController.js";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js";

const routes = Router();

const registerUserController = new RegisterUserController();
const authenticateUserController = new AuthenticateUserController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();
const createProductController = new CreateProductController();
const listProductsController = new ListProductsController();
const updateProductController = new UpdateProductController();
const deleteProductController = new DeleteProductController();

//rotas publicas
routes.post("/users", registerUserController.handle);
routes.post("/login", authenticateUserController.handle);

//rotas protegidas
routes.use(ensureAuthenticated);

routes.put("/profile", updateUserController.handle);
routes.delete("/profile", deleteUserController.handle);

routes.get("/products", listProductsController.handle);
routes.post("/products", createProductController.handle);
routes.put("/products/:id", updateProductController.handle);
routes.delete("/products/:id", deleteProductController.handle);

export { routes };
