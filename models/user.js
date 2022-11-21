const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { isEmail } = require("validator");
const UnauthorizedError = require("../errors/UnauthorizedError");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator(email) {
        return isEmail(email);
      },
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  category: {
    type: String,
    enum: ["user", "editor", "admin"],
    required: true,
    default: "user",
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError("Неправильные почта или пароль");
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError("Неправильные почта или пароль");
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
