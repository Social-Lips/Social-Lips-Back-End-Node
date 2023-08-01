const {
  userSignUpService,
  userLogInService,
} = require("../app/services/authService");

//register
const userSignUpController = async (req, res) => {
  const file = req.file;
  const { email, password } = req.body;

  await userSignUpService(email, password, file, res);
};

//login user
const userLogInController = async (req, res) => {
  const { email, password } = req.body;

  await userLogInService(email, password, res);
};

module.exports = { userSignUpController, userLogInController };
