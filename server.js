const express = require("express");
const chalk = require("chalk");
const morgan = require("morgan");
require("dotenv").config();
const apiTaskRoutes = require("./routes/api-task-routes");
const apiDayRoutes = require("./routes/api-day-routes");
const apiDeptRoutes = require("./routes/api-dept-routes");
const createPath = require("./utils/create-path");

const errorMsg = chalk.bgKeyword("white").redBright;
const successMsg = chalk.bgKeyword("green").white;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("styles"));
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 5000;
app.listen(PORT, (error) => {
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
