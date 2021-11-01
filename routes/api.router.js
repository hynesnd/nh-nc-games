const app = require("../app");
const apiRouter = require("express").Router();
const categoriesRouter = require("./categories.router");

apiRouter.use("/api/categories", categoriesRouter);

module.exports = apiRouter;
