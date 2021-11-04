const { getAllUsers, getUser } = require("../controllers/users.controller");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getAllUsers);
usersRouter.route("/:username").get(getUser);

module.exports = usersRouter;
