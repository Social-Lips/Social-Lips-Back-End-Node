const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3 } = require("../config");

//get image URL handler
const getImageUrl = async (randomImageName) => {
  const getObjectParams = {
    Bucket: process.env.BUCKET,
    Key: randomImageName,
  };
  // const command = new GetObjectCommand(getObjectParams);
  // const url = await getSignedUrl(s3, command, { expiresIn: 50000 });

  const publicUrl = `https://${process.env.BUCKET}.s3.amazonaws.com/${randomImageName}`;

  return publicUrl;
};

module.exports = { getImageUrl };
