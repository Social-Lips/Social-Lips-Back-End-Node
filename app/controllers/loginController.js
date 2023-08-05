const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json("user not found");
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json("wrong password");
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};
