const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      max: 500,
    },
    img_url: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    postType: {
      type: String,
      required: true,
    },
    comments: {
      type: Array,
      default: [
        {
          user_id: "12",
          comment: "This is comment",
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
