const { celebrate, Joi } = require("celebrate");

const urlRegex =
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

const idValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const registerUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const translationValidation = celebrate({
  body: Joi.object().keys({
    description: Joi.string(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    category: Joi.string().valid("NSI", "LNGC", "OrgStructure").required(),
  }),
});

const userProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    category: Joi.string().valid("user", "editor", "admin"),
  }),
});

const myUserProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    category: Joi.string().valid("user", "editor", "admin"),
  }),
});

module.exports = {
  urlRegex,
  registerUserValidation,
  translationValidation,
  userProfileValidation,
  myUserProfileValidation,
  loginValidation,
  idValidation,
};
