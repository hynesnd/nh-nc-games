const express = require("express");
const app = express();
const apiRouter = require("./routes/api.router");
const {
  handle500s,
  handleCustomErrors,
  handlePsqlErrors,
} = require("./controllers/errors.controller");

app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
