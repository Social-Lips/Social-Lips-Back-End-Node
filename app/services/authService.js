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

    // //upload profile picture to the s3
    // const randomImageName = randomName();
    // const params = {
    //   Bucket: process.env.BUCKET,
    //   Key: randomImageName,
    //   Body: file.buffer,
    //   ACL: "public-read",
    // };
    // const uploadParallel = new Upload({
    //   client: s3,
    //   queueSize: 4, // optional concurrency configuration
    //   partSize: 5542880, // optional size of each part
    //   leavePartsOnError: false, // optional manually handle dropped parts
    //   params,
    // });
    // uploadParallel.done().then(async (data) => {
    //   //get image URL
    //   const url = await getImageUrl(randomImageName);

    //   // if the user if successfully registered, update the user's profile picture link
    //   const existingUser = await User.findById(user._id);
    //   existingUser.profilePicture = img_url;
    //   await existingUser.save();

    //   // res.send(user);
    //   res.status(200).json({ email, _id: userId });
    // });
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
