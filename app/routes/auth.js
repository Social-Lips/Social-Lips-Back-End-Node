const router = require("express").Router();

const multer = require("multer");
const upload = multer();


const {
    userSignUpController,
    userLogInController,
} = require("../controllers/authController");

//REGISTER or signup
router.post("/register", upload.single("file"), userSignUpController);

//LOGIN
router.post("/login", userLogInController);

module.exports = router;
