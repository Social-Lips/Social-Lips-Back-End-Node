// require("dotenv").config();
// const express = require("express");
// const app = express();
// const connection = require("./db");
// const userRoutes = require("./app/routes/auth");
//
// // database connection
// connection();
//
// // middlewares
// app.use(express.json());
// app.use(cors());
//
// // routes
// app.use("/api/users", userRoutes);
//
// const port = process.env.PORT || 8800;
// app.listen(port, console.log(`Listening on port ${port}...`));
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoute = require("./app/routes/auth");
const userRoute = require("./app/routes/users");
const postRoute = require("./app/routes/posts");
const cors = require("cors");

const corsOptions = {
  origin: "http://127.0.0.1:5173",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

dotenv.config();

// create a (.env) file and add mongo url in the form of strings

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

//Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

//aws configuration
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: process.env.ACCESS_SECRET,
  accessKeyId: process.env.ACCESS_KEY,
  region: process.env.REGION,
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

//controllers
const { uploadFileController } = require("./controllers");

// Set up Multer middleware to handle file uploads
// by default, multer will store files in memory
const upload = multer();

// Handle the file upload
app.post("/upload", upload.single("file"), uploadFileController);

//------------------------------------------------------------

// app.post("/upload", upload.single("file"), (req, res) => {
//   console.log(req.file);

//   res.send("SuccessFully uploaded " + req.file.location + "location");
// });

app.get("/list", async (req, res) => {
  let r = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
  let x = r.Contents.map((item) => item.Key);
  res.send(x);
});

app.get("/download/:filename", async (req, res) => {
  const filename = req.params.filename;
  let x = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise();
  res.send(x.Body);
});

app.delete("/delete/:filename", async (req, res) => {
  const filename = req.params.filename;
  await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
  res.send("File deleted successfully");
});
// listening at port no. 8800
app.listen(8800, () => {
  console.log("Backend server is running!");
});
