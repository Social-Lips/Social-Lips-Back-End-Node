const { Upload } = require("@aws-sdk/lib-storage");
const { s3 } = require("../config");

const BUCKET = process.env.BUCKET;

let uploadProgress = 0; // Variable to store the upload progress

// upload file to s3 parallelly in chunks
module.exports.uploadFileController = async (req, res) => {
  const file = req.file;
  // params for s3 upload
  const params = {
    Bucket: BUCKET,
    Key: file.originalname,
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

    uploadParallel.on("httpUploadProgress", (progress) => {
      uploadProgress = progress.loaded / progress.total; // Calculate the progress percentage
      console.log(uploadProgress * 100);
    });

    // after completion of upload
    uploadParallel.done().then((data) => {
      console.log("upload completed!", { data });
      res.send(data);
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
      data: file,
    });
  }
};
