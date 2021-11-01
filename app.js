const express = require("express");
const app = express();
const apiRouter = require("./routes/api.router");

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = app;
