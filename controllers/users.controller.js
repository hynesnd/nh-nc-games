const { selectAllUsers } = require("../models/users.model");

exports.getAllUsers = (req, res, next) => {
  selectAllUsers()
    .then(() => {})
    .catch(next);
};
