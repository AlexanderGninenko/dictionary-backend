const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "some-secret-key"
    );
  } catch (err) {
    throw new UnauthorizedError("Необходима авторизация");
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
