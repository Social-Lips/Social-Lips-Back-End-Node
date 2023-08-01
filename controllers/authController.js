const User = require("../app/models/User");
const bcrypt = require("bcrypt");

const { Upload } = require("@aws-sdk/lib-storage");
const { s3 } = require("../config");

const crypto = require("crypto");
const { getImageUrl } = require("../utils");

const { userSignUpService } = require("../app/services/authService");

//register
const userSignUpController = async (req, res) => {
  const file = req.file;
  const { email, password } = req.body;

  await userSignUpService(email, password, file, res);
};

//login user
const userLogInController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    //create token
    // const token = createToken(user._id);
    const url = user.profilePicture;

    res.status(200).json({ email, url });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { userSignUpController, userLogInController };
