const { createPostService } = require("../app/services/postService");
//create post
const createPostController = async (req, res) => {
  const file = req.file;
  const { user_id, description } = req.body;

  await createPostService(user_id, description, file, res);
};

module.exports = { createPostController };
