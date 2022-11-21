const express = require("express");
const {
  updateMyProfile,
  updateUserProfile,
  getMyUser,
  getAllUsers,
  deleteUser,
} = require("../controllers/users");
const checkAdminRights = require("../middlewares/checkAdminRights");
const {
  userProfileValidation,
  myUserProfileValidation,
  idValidation,
} = require("../middlewares/validate");

const router = express.Router();

router.get("/", checkAdminRights, getAllUsers);
router.get("/me", getMyUser);
router.patch("/me", myUserProfileValidation, updateMyProfile);
router.patch(
  "/:id",
  userProfileValidation,
  checkAdminRights,
  updateUserProfile
);
router.delete("/:id", idValidation, checkAdminRights, deleteUser);
module.exports = router;
