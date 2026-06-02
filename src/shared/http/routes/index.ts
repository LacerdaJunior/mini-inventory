import { Router } from "express";
import { RegisterUserController } from "../../../modules/users/controllers/RegisterUserController.js";
import { AuthenticateUserController } from "../../../modules/users/controllers/AuthenticateUserController.js";
import { UpdateUserController } from "../../../modules/users/controllers/UpdateUserController.js";
import { CreateProductController } from "../../../modules/products/controllers/CreateProductController.js";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js";

const routes = Router();

const registerUserController = new RegisterUserController();
const authenticateUserController = new AuthenticateUserController();
const updateUserController = new UpdateUserController();
const createProductController = new CreateProductController();

//rotas publicas
routes.post("/users", registerUserController.handle);
routes.post("/login", authenticateUserController.handle);

//rotas protegidas
routes.use(ensureAuthenticated);

routes.put("/profile", updateUserController.handle);

routes.post("/products", createProductController.handle);

export { routes };
