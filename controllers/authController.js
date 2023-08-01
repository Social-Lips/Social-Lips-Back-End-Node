const User = require("../app/models/User");
const bcrypt = require("bcrypt");

const { Upload } = require("@aws-sdk/lib-storage");
const { s3 } = require("../config");

const crypto = require("crypto");
const { getImageUrl } = require("../utils");

const {
  userSignUpService,
  userLogInService,
} = require("../app/services/authService");

//register
const userSignUpController = async (req, res) => {
  const file = req.file;
  const { email, password } = req.body;

  await userSignUpService(email, password, file, res);
};

//login user
const userLogInController = async (req, res) => {
  const { email, password } = req.body;

  await userLogInService(email, password, res);
};

module.exports = { userSignUpController, userLogInController };
