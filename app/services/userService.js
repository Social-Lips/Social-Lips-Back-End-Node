const User = require("../models/User");

//update user details
const updateUserService = async (
  adminId,
  paramsId,
  // firstName,
  // lastName,
  // bio,
  // studying,
  // relationship,
  // lives,
  // work,
  // profile_img_file,
  // cover_img_file,
  res,
  req
) => {
  if (adminId === paramsId) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: adminId },
        {
          ...req.body,
        }
      );
      res.status(200).json(user);
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
