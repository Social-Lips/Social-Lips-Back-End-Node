const {
  createPostService,
  getPostService,
} = require("../app/services/postService");
//create post
const createPostController = async (req, res) => {
  const file = req.file;
  const { user_id, description } = req.body;

  await createPostService(user_id, description, file, res);
};

const getPostController = async (req, res) => {
  const { user_id } = req.query;
  console.log(user_id);

  await getPostService(user_id, res);
};

module.exports = { createPostController, getPostController };
