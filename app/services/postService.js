const crypto = require("crypto");
// const Post = require("../../app/models/Post");
const { getImageUrl } = require("../utils");
const { Upload } = require("@aws-sdk/lib-storage");
const { s3 } = require("../config");

const { uploadFile } = require("../utils");

// services/postService.js

const Post = require("../models/Post");
const User = require("../models/User");

const createPost = async (postData) => {
  const newPost = new Post(postData);
  try {
    const savedPost = await newPost.save();
    return savedPost;
  } catch (err) {
    throw err;
  }
};

const updatePost = async (postId, userId, postData) => {
  try {
    const post = await Post.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: postData });
      return "The post has been updated";
    } else {
      throw new Error("You can update only your post");
    }
  } catch (err) {
    throw err;
  }
};

const deletePost = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);
    if (post.userId === userId) {
      await post.deleteOne();
      return "The post has been deleted";
    } else {
      throw new Error("You can delete only your post");
    }
  } catch (err) {
    throw err;
  }
};

const likeDislikePostService = async (postId, userId) => {
  try {
    const post = await Post.findById(postId);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      return "liked";
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      return "disliked";
    }
  } catch (err) {
    throw err;
  }
};

const getPostById = async (postId) => {
  try {
    const post = await Post.findById(postId);
    return post;
  } catch (err) {
    throw err;
  }
};

const getTimelinePosts = async (userId) => {
  try {
    const currentUser = await User.findById(userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    return userPosts.concat(...friendPosts);
  } catch (err) {
    throw err;
  }
};

//post create service
const createPostService = async (user_id, description, file, postType, res) => {
  try {
    const img_url = await uploadFile(file, "posts");
    const post = await Post.create({
      user_id,
      description,
      img_url,
      postType,
    });
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

    //after uploaded a post_image
    // uploadParallel.done().then(async (data) => {
    //   //get image URL
    //   const img_url = await getImageUrl(randomImageName);

    //   const post = await Post.create({
    //     user_id,
    //     description,
    //     img_url,
    //     postType,
    //   });

    //   // res.send(user);
    //   res.status(200).json(post);
    //   //   res.status(200).json({ savedPost });
    // });
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get post service
const getPostService = async (user_id, res) => {
  const posts = await Post.find({ user_id }).sort({ createdAt: -1 });
  if (!posts) {
    res.status(400).json({ error: "No such posts" });
  }
  res.status(200).json(posts);
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  likeDislikePostService,
  getPostById,
  getTimelinePosts,
  createPostService,
  getPostService,
};

// ====================
