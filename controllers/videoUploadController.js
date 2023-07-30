const { Upload } = require("@aws-sdk/lib-storage");
const { s3 } = require("../config");
const crypto = require("crypto");
const BUCKET = "social-lips";

const randomImage = (byte = 32) => {
  return crypto.randomBytes(byte).toString("hex");
};

let uploadProgress = 0; // Variable to store the upload progress

// upload file to s3 parallelly in chunks
const uploadFileController = async (req, res) => {
  const file = req.file;
  const { email } = req.body;
  console.log(file);
  console.log(email);
  // params for s3 upload
  const params = {
    Bucket: "social-lips",
    Key: randomImage(),
    Body: file.buffer,
  };

  try {
    // upload file to s3 parallelly in chunks
    // it supports a minimum of 5MB file size
    const uploadParallel = new Upload({
      client: s3,
      queueSize: 4, // optional concurrency configuration
      partSize: 5542880, // optional size of each part
      leavePartsOnError: false, // optional manually handle dropped parts
      params,
    });

    // checking progress of upload

    // uploadParallel.on("httpUploadProgress", (progress) => {
    //   uploadProgress = progress.loaded / progress.total; // Calculate the progress percentage
    //   console.log(uploadProgress * 100);
    // });

    // after completion of upload
    uploadParallel.done().then((data) => {
      // console.log("upload completed!", { data });
      res.send(data.Key);
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
      data: file,
    });
  }
};

module.exports = { uploadFileController };
