const User = require("../models/users");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
      jwt.sign(
        {
          username: user.username,
          id: user.id,
          userid: user.userid,
        },
        process.env.JWT_SECRET,
        { expiresIn: "60min" },
        (err, token) => {
          if (err) {
            console.log(err);
            res.status(401).json({
              loggedIn: 0,
              message: "Something went wrong try again later",
            });
          }
          res.status(200).json({ loggedIn: 1, username: user.username, token });
        }
      );
    } else {
      res
        .status(401)
        .json({ loggedIn: 0, message: "Wrong username or password" });
    }
  }
};
exports.getLogin = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.status(401).json({ loggedIn: 0 });
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      res.status(401).json({ loggedIn: 0 });
    } else {
      res.status(200).json({ loggedIn: 1, token });
    }
  });
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
    jwt.sign(
      {
        username: user.username,
        id: user.id,
        userid: user.userid,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1min" },
      (err, token) => {
        if (err) {
          res.status(401).json({
            loggedIn: 0,
            message: "Something went wrong try again later",
          });
        }
        res.status(200).json({ loggedIn: 1, username: user.username, token });
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};
