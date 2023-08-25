const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const multer = require("multer");
const upload = multer();

const {
  updateUserController,
  getAllUsersController,
  getUsersController,
  followUserController,
  unFollowUserController,
} = require("../controllers/userController");

//edit user
router.put(
  "/:id",
  upload.fields([{ name: "profilePicture" }, { name: "coverPicture" }]),
  updateUserController
);

// GET all users
router.get("/", getAllUsersController);

// GET a user
router.get("/:id", getUsersController);

// // Update user
// router.put("/:id", userController.updateUser);

// // Delete user
// router.delete("/:id", userController.deleteUser);

// // Get a user
// router.get("/:id", userController.getUser);

// Follow a user
router.put("/:id/follow", followUserController);

// // Unfollow a user
router.put("/:id/unfollow", unFollowUserController);

module.exports = router;
