const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

const multer = require("multer");
const upload = multer();

const crypto = require("crypto");

const {
  userSignUpController,
  userLogInController,
} = require("../../controllers/authController");

//REGISTER or signup
router.post("/register", upload.single("file"), userSignUpController);

//LOGIN
router.post("/login", userLogInController);

module.exports = router;
