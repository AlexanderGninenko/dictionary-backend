const express = require("express");
const userRouter = require("./users");
const translationRouter = require("./translations");
const auth = require("../middlewares/auth");
const {
  loginValidation,
  registerUserValidation,
} = require("../middlewares/validate");
const { login, createUser } = require("../controllers/users");
const NotFoundError = require("../errors/NotFoundError");

const router = express.Router();
router.use(express.json());

router.use("/api/translations", auth, translationRouter);
router.use("/api/users", auth, userRouter);

router.post("/api/signin", loginValidation, login);
router.post("/api/signup", registerUserValidation, createUser);
router.get("/api/signout", (req, res) => {
  res
    .clearCookie("jwt", {
      sameSite: "none",
      secure: true,
    })
    .send({ message: "Успешный выход" });
});
router.use(auth, () => {
  throw new NotFoundError("Такой страницы не существует");
});

module.exports = router;
