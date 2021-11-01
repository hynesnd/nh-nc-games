const app = require("../app");
const apiRouter = require("express").Router();
const categoriesRouter = require("./categories.router");

app.use("/api/categories", categoriesRouter);

module.exports = apiRouter;
