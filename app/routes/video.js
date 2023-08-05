const router = require("express").Router();

//controllers
const {
  uploadFileController,
} = require("../../controllers/videoUploadController");

//aws configuration
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: "cpsu81YFWpq7Y7Z0uVOT8dPTcAZRwdB3wnIXUnF",
  accessKeyId: "AKIATVMCFFMCIUHMGIXF",
  region: "ap-south-1",
});

const BUCKET = process.env.BUCKET;
const s3 = new aws.S3();

// const upload = multer({
//   storage: multerS3({
//     bucket: BUCKET,
//     s3: s3,
//     acl: "public-read",
//     key: (req, file, cb) => {
//       cb(null, file.originalname);
//     },
//   }),
// });

// Set up Multer middleware to handle file uploads
// by default, multer will store files in memory
const upload = multer();

// Handle the file upload
router.post("/upload", upload.single("imageFile"), uploadFileController);

module.exports = router;
