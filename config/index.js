const { S3Client } = require("@aws-sdk/client-s3");

module.exports.s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIATVMCFFMCIUHMGIXF",
    secretAccessKey: "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",
  },
});
