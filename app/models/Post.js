const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: {
      type: String,
      max: 500,
    },
    img_url: {
      type: String,
    },
    subtitle_url: {
      type: String,
      default: "",
    },
    subtitle_status: {
      type: String,
      // default: "generating",
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
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
