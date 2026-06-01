import express from "express";
import { routes } from "./src/shared/http/routes";
import errorHandler from "./src/shared/http/middlewares/errorHandler";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);

app.use(errorHandler);

export { app };
