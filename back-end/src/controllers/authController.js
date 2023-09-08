const User = require("../models/users");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

exports.login = async (req, res) => {
  const user = await User.findOne({
    where: { username: req.body.username },
  });
  if (user === null) {
    res
      .status(401)
      .json({ loggedIn: 0, message: "Wrong username or password" });
  } else {
    const isSamePass = await bcrypt.compare(req.body.password, user.password);
    if (isSamePass) {
      req.session.user = {
        username: user.username,
        id: user.id,
        userid: user.userid,
      };
      res.status(200).json({ loggedIn: 1, username: user.username });
    } else {
      res
        .status(401)
        .json({ loggedIn: 0, message: "Wrong username or password" });
    }
  }
};
exports.getLogin = async (req, res) => {
  if (req.session.user && req.session.user.username) {
    res.status(200).json({ loggedIn: 1, username: req.session.username });
  } else {
    res.status(401).json({ loggedIn: 0 });
  }
};

exports.signup = async (req, res) => {
  const user = await User.findOne({ where: { username: req.body.username } });
  if (user !== null) {
    return res.status(400).json({ loggedIn: 0, message: "Username taken" });
  }
  const hashedPass = await bcrypt.hash(req.body.password, 10);
  const USER_MODEL = {
    username: req.body.username,
    password: hashedPass,
    userid: uuidv4(),
  };

  try {
    const user = await User.create(USER_MODEL);
    console.log("User created");
    req.session.user = {
      username: user.username,
      id: user.id,
      userid: user.userid,
    };
    res.status(201).json({ loggedIn: true, username: user.username });
  } catch (error) {
    res.status(500).json(error);
  }
};
