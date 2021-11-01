const categoriesRouter = require("express").Router();
const { getCategories } = require("../controllers/categories.controller");

categoriesRouter.route("/").get(getCategories);

module.exports = categoriesRouter;
