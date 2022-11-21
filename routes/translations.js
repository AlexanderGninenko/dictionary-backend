const express = require("express");
const {
  getAllTranslations,
  getMyTranslations,
  createTranslation,
  deleteTranslation,
} = require("../controllers/translations");
const {
  translationValidation,
  idValidation,
} = require("../middlewares/validate");
const checkEditorRights = require("../middlewares/checkEditorRights");

const router = express.Router();

router.get("/", getAllTranslations);
router.get("/me", getMyTranslations);
router.post("/", translationValidation, createTranslation);
router.delete("/:id", idValidation, checkEditorRights, deleteTranslation);

module.exports = router;
