const router = require("express").Router();
const postController = require("../controllers/postController");

// router.post("/", postController.createPost);
// router.put("/:id", postController.updatePost);
// router.delete("/:id", postController.deletePost);
// router.put("/:id/like", postController.likeDislikePost);
// router.get("/:id", postController.getPostById);
// router.get("/timeline/all", postController.getTimelinePosts);

const multer = require("multer");
const upload = multer();

const {
  createPostController,
  getPostController,
  likeDislikePostController,
} = require("../controllers/postController");
const { route } = require("./auth");

//get posts
router.get("/", getPostController);

//create a post
router.post("/", upload.single("file"), createPostController);

//likeDislikePost
router.put("/:id/like", likeDislikePostController);

module.exports = router;
