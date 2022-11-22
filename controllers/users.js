const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const sendConfirmationEmail = require("../utils/nodemailer");

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user);
      if (user.status !== "Active") {
        throw new UnauthorizedError(
          "Необходимо завершить регистрацию по электронной почте"
        );
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "some-secret-key",
        { expiresIn: "2d" }
      );
      res
        .cookie("jwt", token, {
          maxAge: 3600000 * 24 * 2,
          httpOnly: true,
          // sameSite: "none",
          // secure: true,
        })
        .send({ token });
    })
    .catch(next);
};

const getAllUsers = (req, res, next) => {
  User.find()
    .then((users) => res.send(users))
    .catch(next);
};

const getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError("Пользователь с таким id не найден");
    })
    .then((user) =>
      res.send({ name: user.name, email: user.email, category: user.category })
    )
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  const token = jwt.sign(
    { email },
    NODE_ENV === "production" ? JWT_SECRET : "some-secret-key",
    { expiresIn: "2d" }
  );
  bcrypt
    .hash(password, 7)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
        confirmationCode: token,
      })
        .then((user) => {
          res.send({
            name: user.name,
            email: user.email,
            category: user.category,
          });
          sendConfirmationEmail(user.name, user.email, user.confirmationCode);
        })
        .catch((e) => {
          if (e.code === 11000) {
            next(new ConflictError("Такой пользователь уже существует"));
          } else if (e.name === "ValidationError") {
            next(new BadRequestError("Переданы неверные данные"));
          } else next(e);
        });
    })
    .catch(next);
};

const verifyUserEmail = (req, res, next) => {
  User.findOneAndUpdate(
    { confirmationCode: req.params.confirmationCode },
    { status: "Active" },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError("NotFound");
    })
    .then((data) => res.send({ data }))
    .catch(next);
};

const deleteUser = (req, res, next) => {
  User.findByIdAndRemove(req.params.id)
    .orFail(() => {
      throw new NotFoundError("NotFound");
    })
    .then((data) => res.send(data))
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const { name, email, category } = req.body;
  User.findByIdAndUpdate(
    req.params.id,
    { name, email, category },
    { new: true, runValidators: true }
  )
    .then((data) => res.send({ data }))
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError("Переданы неверные данные"));
      } else if (e.code === 11000) {
        next(new ConflictError("Такая почта уже существует"));
      } else next(e);
    });
};

const updateMyProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  )
    .then((data) => res.send({ data }))
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError("Переданы неверные данные"));
      } else if (e.code === 11000) {
        next(new ConflictError("Такая почта уже существует"));
      } else next(e);
    });
};

module.exports = {
  createUser,
  updateMyProfile,
  updateUserProfile,
  login,
  getMyUser,
  getAllUsers,
  deleteUser,
  verifyUserEmail,
};
