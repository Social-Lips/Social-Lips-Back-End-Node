const router = require("express").Router();
const postController = require("../controllers/postController");

router.post("/", postController.createPost);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);
router.put("/:id/like", postController.likeDislikePost);
router.get("/:id", postController.getPostById);
router.get("/timeline/all", postController.getTimelinePosts);

module.exports = router;
