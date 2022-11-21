const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");

module.exports = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError("NotFound");
    })
    .then((user) => {
      if (user.category === "editor") {
        next();
      } else throw new ForbiddenError("Запрещено");
    })
    .catch(next);
};
