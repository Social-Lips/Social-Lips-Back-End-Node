const crypto = require("crypto");
const { firebaseConfig } = require("../config/firebase");
const { initializeApp } = require("firebase/app");
const {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} = require("firebase/storage");

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
    // Resize and compress the image
    const compressedImageBuffer = await sharp(file.buffer)
      .resize({ width: 800 }) // Adjust the width as needed
      .jpeg({ quality: 50 }) // Adjust quality as needed
      .toBuffer();

    const snapshot = await uploadBytesResumable(
      storageRef,
      compressedImageBuffer,
      metadata
    );
    downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;

    // const snapshot = await uploadBytesResumable(
    //   storageRef,
    //   file.buffer,
    //   metadata
    // );
    // downloadURL = await getDownloadURL(snapshot.ref);
    // return downloadURL;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { uploadFile };
