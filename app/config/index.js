require("dotenv").config();
const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.ACCESS_SECRET,
  },
});

const firebaseConfig = {
  apiKey: "AIzaSyBpn-3FuCTmlmYjne2qLkoztWFdtdFm1U8",
  authDomain: "social-lips.firebaseapp.com",
  projectId: "social-lips",
  storageBucket: "social-lips.appspot.com",
  messagingSenderId: "104096899605",
  appId: "1:104096899605:web:fd549c313c5e010c34241c",
};

module.exports = { s3, firebaseConfig };
