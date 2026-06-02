import { Router } from "express";
import { RegisterUserController } from "../../../modules/users/controllers/RegisterUserController";
import { AuthenticateUserController } from "../../../modules/users/controllers/AuthenticateUserController"; 

const routes = Router();

const registerUserController = new RegisterUserController();
const authenticateUserController = new AuthenticateUserController();


routes.post("/register", registerUserController.handle);


routes.post("/login", authenticateUserController.handle);

export { routes };
