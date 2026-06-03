import express from "express";
import { routes } from "./routes";
import { swaggerRouter } from "./swagger";
import errorHandler from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok1" });
});

app.use("/docs", swaggerRouter);

app.use("/api", routes);

app.use(errorHandler);

export { app };
