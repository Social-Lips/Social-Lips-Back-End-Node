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

module.exports = { uploadFile };
