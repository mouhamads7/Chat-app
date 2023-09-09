const User = require("../models/users");

exports.createOne = async (req, res, next) => {
  try {
    const USER_MODEL = {
      username: req.body.username,
      password: req.body.password,
    };

    try {
      const user = await User.create(USER_MODEL);
      console.log("User crerated");
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
