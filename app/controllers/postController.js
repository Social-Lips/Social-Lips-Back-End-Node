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

const addCommentController = async (req, res) => {
  console.log(req.body);
  const { postId, userId, commentText, userName, profilePic } = req.body;

  await postService.addCommentService(
    postId,
    userId,
    commentText,
    userName,
    profilePic,
    res
  );
};

const getCommentsController = async (req, res) => {
  const { postId } = req.query;
  console.log("postId", postId);

  await postService.getCommentsService(postId, res);
};

const getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getTimelinePostsController = async (req, res) => {
  const { user_id } = req.query;

  await postService.getTimelinePostsService(user_id, res);
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
  createPostController,
  getPostController,
  addCommentController,
  getCommentsController,
  getTimelinePostsController,
};
