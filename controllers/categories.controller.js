const { selectCategories } = require("../models/categories.model");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then(() => {})
    .catch(next);
};
