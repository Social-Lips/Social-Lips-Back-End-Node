const router = require("express").Router();
const postController = require("../controllers/postController");

// router.post("/", postController.createPost); added
// router.put("/:id", postController.updatePost);
// router.delete("/:id", postController.deletePost);
// router.put("/:id/like", postController.likeDislikePost); added
// router.get("/:id", postController.getPostById);
// router.get("/timeline/all", postController.getTimelinePosts); added

const multer = require("multer");
const upload = multer();

const {
  createPostController,
  getPostController,
  likeDislikePostController,
  addCommentController,
  getCommentsController,
  getTimelinePostsController,
  deletePostController,
} = require("../controllers/postController");
const { route } = require("./auth");

//get posts
router.get("/", getPostController);

//create a post
router.post("/", upload.single("file"), createPostController);

//likeDislikePost
router.put("/:id/like", likeDislikePostController);

//add comment
router.post("/addComment", addCommentController);

//get comments
router.get("/comments", getCommentsController);

//get timeline post
router.get("/timeline/all", getTimelinePostsController);

//delete post
router.delete("/:id", deletePostController);

module.exports = router;
