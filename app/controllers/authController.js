const {
  userSignUpService,
  userLogInService,
} = require("../services/authService");

//register
const userSignUpController = async (req, res) => {
  const file = req.file;
  const { email, password, first_name, last_name } = req.body;

  await userSignUpService(email, password, file, res, first_name, last_name);
};

//login user
const userLogInController = async (req, res) => {
  const { email, password } = req.body;

  await userLogInService(email, password, res);
};

module.exports = { userSignUpController, userLogInController };
