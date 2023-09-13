const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoute = require("./app/routes/auth");
const userRoute = require("./app/routes/users");
const postRoute = require("./app/routes/posts");
const uploadRoute = require("./app/routes/video");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);

const corsOptions = {
  origin: "*", // Replace '*' with the allowed origin(s) you want to specify.
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Specify the HTTP methods you want to allow.
  preflightContinue: false,
  optionsSuccessStatus: 204, // A 204 status code indicates success for preflight requests.

  // Include the relevant headers you need:
  exposedHeaders: ["Content-Length", "X-Foo"],
  allowedHeaders: [
    "Content-Type",
    "Access-Control-Allow-Origin",
    "Authorization",
  ],
};
app.use(cors(corsOptions));

dotenv.config();

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

//routes
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/users", userRoute);
app.use("/api/video", uploadRoute);

// listening at port no. 8800
server.listen(8800, () => {
  console.log("Backend server is running!");
});
