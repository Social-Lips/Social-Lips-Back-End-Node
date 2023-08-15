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

module.exports = { updateUserService, getAllUsersService, getUserService };
