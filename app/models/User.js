const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // username: {
    //   type: String,
    //   require: true,
    //   min: 3,
    //   max: 20,
    //   unique: true,
    // },
    first_name: {
      type: String,
      max: 50,
      default: "",
    },
    last_name: {
      type: String,
      max: 50,
      default: "",
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      max: 50,
      default: "This is BIO",
    },
    studying_at: {
      type: String,
      max: 50,
      default: "This is Studying at SUSL",
    },
    lives_in: {
      type: String,
      max: 50,
      default: "Matara",
    },
    work_at: {
      type: String,
      max: 50,
      default: "HNB Bank",
    },
    // relationship: {
    //   type: Number,
    //   enum: [1, 2, 3],
    // },
    in_relationship: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//static signup method
userSchema.statics.signup = async function (
  email,
  password,
  first_name,
  last_name
) {
  //validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  // if (!validator.isEmail(email)) {
  //   throw Error("Email is not valid");
  // }
  // if (!validator.isStrongPassword(password)) {
  //   throw Error("Password not strong enough");
  // }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    email,
    password: hash,
    first_name,
    last_name,
  });

  return user;
};

//static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All field must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
