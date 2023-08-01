const crypto = require("crypto");
const Post = require("../../app/models/Post");
const { getImageUrl } = require("../../utils");
const { Upload } = require("@aws-sdk/lib-storage");
const { s3 } = require("../../config");

//post create service
const createPostService = async (user_id, description, file, res) => {
  console.log(user_id, description, file);
  //create random name for upload file
  const randomName = (byte = 32) => {
    return crypto.randomBytes(byte).toString("hex");
  };

  try {
    //upload post_picture to the s3
    const randomImageName = randomName();
    const params = {
      Bucket: process.env.BUCKET,
      Key: randomImageName,
      Body: file.buffer,
      ACL: "public-read",
    };
    const uploadParallel = new Upload({
      client: s3,
      queueSize: 4, // optional concurrency configuration
      partSize: 5542880, // optional size of each part
      leavePartsOnError: false, // optional manually handle dropped parts
      params,
    });

    //after uploaded a post_image
    uploadParallel.done().then(async (data) => {
      //get image URL
      const img_url = await getImageUrl(randomImageName);

      const post = await Post.create({ user_id, description, img_url });

      // res.send(user);
      res.status(200).json(post);
      //   res.status(200).json({ savedPost });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createPostService };
