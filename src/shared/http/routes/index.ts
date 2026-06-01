import { Router } from "express";
import { RegisterUserController } from "../../../modules/users/controllers/RegisterUserController";

const routes = Router();

const registerUserController = new RegisterUserController();

routes.post("/register", (req, res) => registerUserController.handle(req, res));

export { routes };
