const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3 } = require("../config");

//get image URL handler
const getImageUrl = async (randomImageName) => {
  const getObjectParams = {
    Bucket: process.env.BUCKET,
    Key: randomImageName,
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command, { expiresIn: undefined });

  return url;
};

module.exports = { getImageUrl };
