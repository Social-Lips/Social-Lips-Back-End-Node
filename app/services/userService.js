const { Upload } = require("@aws-sdk/lib-storage");
const User = require("../models/User");
const crypto = require("crypto");
const { s3 } = require("../config");
const { getImageUrl, uploadFile } = require("../utils");

//update user details
const updateUserService = async (
  adminId,
  paramsId,
  first_name,
  last_name,
  bio,
  studying_at,
  in_relationship,
  lives_in,
  work_at,
  profilePicture,
  coverPicture,
  res,
  req
) => {
  if (adminId === paramsId) {
    try {
      if (coverPicture) {
        const img_url = await uploadFile(coverPicture[0], "users");
        const user = await User.findOneAndUpdate(
          { _id: adminId },
          { coverPicture: img_url }
        );
      }
      if (profilePicture) {
        const img_url = await uploadFile(profilePicture[0], "users");
        const user = await User.findOneAndUpdate(
          { _id: adminId },
          { profilePicture: img_url }
        );
      }
      if (first_name) {
        const user = await User.findOneAndUpdate(
          { _id: adminId },
          { first_name: first_name }
        );
      }
      if (last_name) {
        const user = await User.findOneAndUpdate(
          { _id: adminId },
          { last_name: last_name }
        );
      }
      if (bio) {
        const user = await User.findOneAndUpdate(
          { _id: adminId },
          { bio: bio }
        );
      }
      if (studying_at) {
        const user = await User.findOneAndUpdate(
          { _id: adminId },
          { studying_at: studying_at }
        );
      }
      if (lives_in) {
        const user = await User.findOneAndUpdate(
          { _id: adminId },
          { lives_in: lives_in }
        );
      }
      if (work_at) {
        const user = await User.findOneAndUpdate(
          { _id: adminId },
          { work_at: work_at }
        );
      }
      if (in_relationship) {
        const user = await User.findOneAndUpdate(
          { _id: adminId },
          { in_relationship: in_relationship }
        );
      }
      return res.status(200).json({ Message: "Updated" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

// get all users
const getAllUsersService = async (_id, res) => {
  try {
    const users = await User.find({ _id: { $ne: _id } }); // Exclude the document with _id equal to "12333"
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get a user
const getUserService = async (_id, res) => {
  try {
    const users = await User.find({ _id });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//follow user
const followUserService = async (paramsId, userId, res) => {
  if (userId !== paramsId) {
    try {
      const user = await User.findById(paramsId);
      const currentUser = await User.findById(userId);
      if (!user.followers.includes(userId)) {
        await user.updateOne({ $push: { followers: userId } });
        await currentUser.updateOne({ $push: { followings: paramsId } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
};

//un follow user
const unFollowUserService = async (paramsId, userId, res) => {
  if (userId !== paramsId) {
    try {
      const user = await User.findById(paramsId);
      console.log("user", user);
      const currentUser = await User.findById(userId);
      console.log("currentUser", userId);

      if (user.followers.includes(userId)) {
        await user.updateOne({ $pull: { followers: userId } });
        await currentUser.updateOne({ $pull: { followings: paramsId } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You don't follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
};

module.exports = {
  updateUserService,
  getAllUsersService,
  getUserService,
  followUserService,
  unFollowUserService,
};
