const User = require("../../app/models/User");
const bcrypt = require("bcrypt");

const { Upload } = require("@aws-sdk/lib-storage");
const { s3 } = require("../config");

const crypto = require("crypto");
const { getImageUrl, uploadFile } = require("../utils");

//register
const userSignUpService = async (
  email,
  password,
  file,
  res,
  first_name,
  last_name
) => {
  try {
    //sign in the user and add to the mongoDb
    const user = await User.signup(email, password, first_name, last_name);
    const userId = user._id;

    const img_url = await uploadFile(file, "users");
    const existingUser = await User.findById(user._id);
    existingUser.profilePicture = img_url;
    await existingUser.save();
    res.status(200).json({ email, _id: userId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//login
const userLogInService = async (email, password, res) => {
  console.log(email, password);

  try {
    const user = await User.login(email, password);

    //create token
    // const token = createToken(user._id);
    const url = user.profilePicture;
    const userId = user._id;

    res.status(200).json({ email, profilePicture: url, _id: userId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { userSignUpService, userLogInService };
