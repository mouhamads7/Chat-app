const validator = require("../controllers/validateForm");
const User = require("../models/users");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  validator.validateForm(req, res);
  const user = await User.findOne({
    where: { username: req.body.username },
  });
  if (user === null) {
    res
      .status(401)
      .json({ loggedIn: false, message: "Wrong username or password" });
  } else {
    const isSamePass = await bcrypt.compare(req.body.password, user.password);
    if (isSamePass) {
      req.session.user = { username: user.username, id: user.id };
      res.status(200).json({ loggedIn: true, username: user.username });
    } else {
      res
        .status(401)
        .json({ loggedIn: false, message: "Wrong username or password" });
    }
  }
};
exports.getLogin = async (req, res) => {
  console.log("session: ", req.session.user);
  if (req.session.user && req.session.user.username) {
    res.status(200).json({ loggedIn: true, username: req.session.username });
  } else {
    res.status(401).json({ loggedIn: false });
  }
};

exports.signup = async (req, res) => {
  validator.validateForm(req, res);
  const user = await User.findOne({ where: { username: req.body.username } });
  if (user !== null) {
    return res.status(400).json({ loggedIn: false, message: "Username taken" });
  }
  const hashedPass = await bcrypt.hash(req.body.password, 10);
  const USER_MODEL = {
    username: req.body.username,
    password: hashedPass,
  };

  try {
    const user = await User.create(USER_MODEL);
    console.log("User created");
    req.session.user = { username: user.username, id: user.id };
    res.status(201).json({ loggedIn: true, username: user.username });
  } catch (error) {
    res.status(500).json(error);
  }
};
