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

const getTimelinePostsService = async (userId, res) => {
  try {
    const currentUser = await User.findById(userId);
    const userPosts = await Post.find({ user_id: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ user_id: friendId });
      })
    );

    const _timelinePosts = userPosts.concat(...friendPosts);
    console.log(_timelinePosts);
    const timelinePosts = [];
    for (const post of _timelinePosts) {
      const user = await User.findById(post.user_id).select(
        "first_name last_name profilePicture"
      );
      // console.log(post);
      if (user) {
        const postWithUser = {
          profilePicture: user.profilePicture,
          first_name: user.first_name,
          last_name: user.last_name,
          user_id: user._id,
          description: post.description,
          img_url: post.img_url,
          createdAt: new Date(post.createdAt),
          likes: post.likes,
          comments: post.comments,
          post_id: post._id,
          postType: post.postType,
        };
        timelinePosts.push(postWithUser);
      }
    }
    console.log(timelinePosts);
    // Sort the posts by createdAt in descending order
    const orderedList = timelinePosts.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(orderedList);
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

const addCommentService = async (
  postId,
  userId,
  commentText,
  userName,
  profilePic,
  res
) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      res.status(400).json({ error: "Post Not Found" });
    }

    const newComment = {
      user_id: userId,
      text: commentText,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//get comments service
const getCommentsService = async (postId, res) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ error: "No such post" });
    }
    if (post.comments?.length == 0) {
      return res.status(400).json({ error: "No Comments" });
    }

    //add commenter details
    const commentData = [];
    for (const comment of post.comments) {
      const user = await User.findById(comment.user_id).select(
        "first_name last_name profilePicture"
      );

      if (user) {
        const commentWithUser = {
          ...comment,
          commentBy: user,
        };
        commentData.push(commentWithUser);
      }
    }

    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  likeDislikePostService,
  getPostById,
  createPostService,
  getPostService,
  addCommentService,
  getCommentsService,
  getTimelinePostsService,
};

// ====================
