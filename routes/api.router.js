const app = require("../app");
const apiRouter = require("express").Router();
const categoriesRouter = require("./categories.router");
const commentsRouter = require("./comments.router");
const reviewsRouter = require("./reviews.router");

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
