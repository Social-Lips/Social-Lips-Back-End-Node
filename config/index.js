const { S3Client } = require("@aws-sdk/client-s3");

const REGION = "ap-south-1";
const ACCESS_KEY = "AKIATVMCFFMCIUHMGIXF";
const ACCESS_SECRET = "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";

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: ACCESS_SECRET,
  },
});

module.exports = { s3 };
