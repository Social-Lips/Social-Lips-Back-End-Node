const postService = require("../services/postService");

const createPost = async (req, res) => {
  try {
    const savedPost = await postService.createPost(req.body);
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
};

const updatePost = async (req, res) => {
  try {
    const message = await postService.updatePost(
      req.params.id,
      req.body.userId,
      req.body
    );
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deletePost = async (req, res) => {
  try {
    const message = await postService.deletePost(
      req.params.id,
      req.body.userId
    );
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json(err);
  }
};

const likeDislikePostController = async (req, res) => {
  try {
    const message = await postService.likeDislikePostService(
      req.params.id,
      req.body.userId
    );
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getTimelinePosts = async (req, res) => {
  try {
    const posts = await postService.getTimelinePosts(req.body.userId);
    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};

const createPostController = async (req, res) => {
  const file = req.file;
  const { user_id, description, postType } = req.body;

  await postService.createPostService(
    user_id,
    description,
    file,
    postType,
    res
  );
};

const getPostController = async (req, res) => {
  const { user_id } = req.query;

  await postService.getPostService(user_id, res);
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  likeDislikePostController,
  getPostById,
  getTimelinePosts,
  createPostController,
  getPostController,
};
