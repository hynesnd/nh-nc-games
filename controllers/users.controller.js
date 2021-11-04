const { selectAllUsers, selectUser } = require("../models/users.model");

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  selectUser()
    .then(() => {})
    .catch(next);
};
