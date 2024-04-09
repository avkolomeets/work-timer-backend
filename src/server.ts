import dotenv from "dotenv";
dotenv.config();

import { Application } from "express";
import { apiDayRoutes } from "./routes/api-day-routes";
import { apiDeptRoutes } from "./routes/api-dept-routes";
import { apiTaskRoutes } from "./routes/api-task-routes";
import { createPath } from "./utils/create-path";

import chalk from "chalk";
import cors from "cors";
import express from "express";
import morgan from "morgan";

const errorMsg = chalk.bgKeyword("white").redBright;
const successMsg = chalk.bgKeyword("green").white;

const app: Application = express();
app.use(cors());
app.set("view engine", "ejs");
app.use(express.static("styles"));
//app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const PORT = process.env.PORT || 5000;
(app as any).listen(PORT, (error: any) => {
  error
    ? console.log(errorMsg(error))
    : console.log(successMsg(`listening to port ${PORT}`));
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.get("/", (req, res) => {
  const title = "Home";
  res.render(createPath("index"), { title });
});
app.use(apiTaskRoutes);
app.use(apiDayRoutes);
app.use(apiDeptRoutes);
app.use((req, res) => {
  const title = "Error Page";
  res.status(404).render(createPath("error"), { title });
});
