const router = require("express").Router();
const authController = require("../controllers/authController");
const loginController = require("../controllers/loginController");

//REGISTER
router.post("/register", authController.registerUser);

//LOGIN
router.post("/login", loginController.loginUser);

module.exports = router;
