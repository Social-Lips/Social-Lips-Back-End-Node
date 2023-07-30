const User = require("../app/models/User");
const bcrypt = require("bcrypt");

const { Upload } = require("@aws-sdk/lib-storage");
const { s3 } = require("../config");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const crypto = require("crypto");

//register
const userSignUpController = async (req, res) => {
  const file = req.file;
  const { email, password } = req.body;

  //create random name for profile picture
  const randomName = (byte = 32) => {
    return crypto.randomBytes(byte).toString("hex");
  };

  try {
    //sign in the user and add to the mongoDb
    const user = await User.signup(email, password);
    console.log(user._id);

    //upload profile picture to the s3
    const randomImageName = randomName();
    const params = {
      Bucket: process.env.BUCKET,
      Key: randomImageName,
      Body: file.buffer,
    };
    const uploadParallel = new Upload({
      client: s3,
      queueSize: 4, // optional concurrency configuration
      partSize: 5542880, // optional size of each part
      leavePartsOnError: false, // optional manually handle dropped parts
      params,
    });
    uploadParallel.done().then(async (data) => {
      //get image URL
      const getObjectParams = {
        Bucket: process.env.BUCKET,
        Key: randomImageName,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command);

      // if the user if successfully registered, update the user's profile picture link
      const existingUser = await User.findById(user._id);
      existingUser.profilePicture = url;
      await existingUser.save();

      // res.send(user);
      res.status(200).json({ existingUser });
    });

    // res.status(200).json({ user });
  } catch (error) {
    // console.log(file);
    res.status(400).json({ error: error.message });
  }
  // // ----------
  // try {
  //   //generate new password
  //   const salt = await bcrypt.genSalt(10);
  //   const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //   //create new user
  //   const newUser = new User({
  //     // username: req.body.username,
  //     email: req.body.email,
  //     password: hashedPassword,
  //   });

  //   //save user and respond
  //   const user = await newUser.save();
  //   res.status(200).json(user);
  // } catch (err) {
  //   res.status(500).json(err);
  // }
};

//login
const userLogInController = async (rea, res) => {};

module.exports = { userSignUpController, userLogInController };
