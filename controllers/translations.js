const Translation = require("../models/translation");
const ForbiddenError = require("../errors/ForbiddenError");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");

const getAllTranslations = (req, res, next) => {
  Translation.find()
    .then((translations) => res.send({ data: translations }))
    .catch(next);
};

const getMyTranslations = (req, res, next) => {
  Translation.find({ owner: req.user._id })
    .then((translations) => res.send({ data: translations }))
    .catch(next);
};

const createTranslation = (req, res, next) => {
  const { nameRU, nameEN, description, category } = req.body;
  const owner = req.user._id;
  Translation.create({
    nameRU: nameRU.toLowerCase(),
    nameEN: nameEN.toLowerCase(),
    description,
    category,
    owner,
  })
    .then((translation) => {
      res.send({ translation });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError("Переданы неверные данные"));
      } else if (e.code === 11000) {
        next(new ConflictError("Такой перевод уже существует"));
      } else next(e);
    });
};

const deleteTranslation = (req, res, next) => {
  Translation.findById({ _id: req.params.id })
    .orFail(() => {
      throw new NotFoundError("NotFound");
    })
    .then((translation) => {
      if (translation.owner.toString() === req.user._id) {
        return Translation.findByIdAndRemove(req.params.id)
          .then((data) => res.send(data))
          .catch(next);
      }
      throw new ForbiddenError("Запрещено");
    })
    .catch(next);
};

module.exports = {
  getAllTranslations,
  getMyTranslations,
  createTranslation,
  deleteTranslation,
};
