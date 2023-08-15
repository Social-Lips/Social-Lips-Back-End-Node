const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3 } = require("../config");
const crypto = require("crypto");

const { firebaseConfig } = require("../config/firebase");
const { initializeApp } = require("firebase/app");
const {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} = require("firebase/storage");

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

//upload file to firebase
const uploadFile = async (file, folder) => {
  let downloadURL;
  //create random name for upload file
  const randomName = (byte = 32) => {
    return crypto.randomBytes(byte).toString("hex");
  };
  const randomImageName = randomName();
  initializeApp(firebaseConfig.firebaseConfig);
  const storage = getStorage();

  try {
    const storageRef = ref(storage, `${folder}/${randomImageName}`);
    const metadata = {
      contentType: file.mimetype,
    };

    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );
    downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getImageUrl, uploadFile };
