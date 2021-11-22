const express = require("express");
const cors = require("cors");
const app = express();
const apiRouter = require("./routes/api.router");
const {
  handle500s,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors.controller");

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
