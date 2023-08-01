const User = require("../../app/models/User");
const bcrypt = require("bcrypt");

const { Upload } = require("@aws-sdk/lib-storage");
const { s3 } = require("../../config");

const crypto = require("crypto");
const { getImageUrl } = require("../../utils");

const userSignUpService = async (email, password, file, res) => {
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
      ACL: "public-read",
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
      const url = await getImageUrl(randomImageName);

      // if the user if successfully registered, update the user's profile picture link
      const existingUser = await User.findById(user._id);
      existingUser.profilePicture = url;
      await existingUser.save();

      // res.send(user);
      res.status(200).json({ email, url });
    });
  } catch (error) {
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

const userLogInService = async (email, password, res) => {
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

module.exports = { userSignUpService, userLogInService };
