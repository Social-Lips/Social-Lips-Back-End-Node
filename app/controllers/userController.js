const User = require("../models/User");
const bcrypt = require("bcrypt");
const {
  updateUserService,
  getAllUsersService,
  getUserService,
} = require("../services/userService");

//edit profile
const updateUserController = async (req, res) => {
  const profilePicture = req.files.profilePicture;
  const coverPicture = req.files.coverPicture;

  const {
    first_name,
    last_name,
    bio,
    studying_at,
    lives_in,
    in_relationship,
    work_at,
    adminId,
  } = req.body;

  const paramsId = req.params.id;

  await updateUserService(
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
  );
};

//get all users
const getAllUsersController = async (req, res) => {
  const { user_id } = req.query;
  await getAllUsersService(user_id, res);
};

//get a user
const getUsersController = async (req, res) => {
  const user_id = req.params.id;
  await getUserService(user_id, res);
};

// // Update user
// async function updateUser(req, res) {
//   if (req.body.userId === req.params.id || req.body.isAdmin) {
//     if (req.body.password) {
//       try {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(req.body.password, salt);
//       } catch (err) {
//         return res.status(500).json(err);
//       }
//     }
//     try {
//       const user = await User.findByIdAndUpdate(req.params.id, {
//         $set: req.body,
//       });
//       res.status(200).json("Account has been updated");
//     } catch (err) {
//       return res.status(500).json(err);
//     }
//   } else {
//     return res.status(403).json("You can update only your account!");
//   }
// }

// // Delete user
// async function deleteUser(req, res) {
//   if (req.body.userId === req.params.id || req.body.isAdmin) {
//     try {
//       await User.findByIdAndDelete(req.params.id);
//       res.status(200).json("Account has been deleted");
//     } catch (err) {
//       return res.status(500).json(err);
//     }
//   } else {
//     return res.status(403).json("You can delete only your account!");
//   }
// }

// // Get a user
// async function getUser(req, res) {
//   try {
//     const user = await User.findById(req.params.id);
//     const { password, updatedAt, ...other } = user._doc;
//     res.status(200).json(other);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// }

// // Follow a user
// async function followUser(req, res) {
//   if (req.body.userId !== req.params.id) {
//     try {
//       const user = await User.findById(req.params.id);
//       const currentUser = await User.findById(req.body.userId);
//       if (!user.followers.includes(req.body.userId)) {
//         await user.updateOne({ $push: { followers: req.body.userId } });
//         await currentUser.updateOne({ $push: { followings: req.params.id } });
//         res.status(200).json("User has been followed");
//       } else {
//         res.status(403).json("You already follow this user");
//       }
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   } else {
//     res.status(403).json("You can't follow yourself");
//   }
// }

// // Unfollow a user
// async function unfollowUser(req, res) {
//   if (req.body.userId !== req.params.id) {
//     try {
//       const user = await User.findById(req.params.id);
//       const currentUser = await User.findById(req.body.userId);
//       if (user.followers.includes(req.body.userId)) {
//         await user.updateOne({ $pull: { followers: req.body.userId } });
//         await currentUser.updateOne({ $pull: { followings: req.params.id } });
//         res.status(200).json("User has been unfollowed");
//       } else {
//         res.status(403).json("You don't follow this user");
//       }
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   } else {
//     res.status(403).json("You can't unfollow yourself");
//   }
// }

module.exports = {
  //   updateUser,
  //   deleteUser,
  //   getUser,
  //   followUser,
  //   unfollowUser,
  updateUserController,
  getAllUsersController,
  getUsersController,
};
