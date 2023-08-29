const controller = require("../controllers/validateForm");
const router = require("express").Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  controller.validateForm(req, res);
  const user = await User.findOne({
    where: { username: req.body.username },
  });
  console.log(req.session);

  if (user === null) {
    console.log("not good1");
    res.json({ loggedIn: false, status: "Wrong username or password" });
  } else {
    const isSamePass = await bcrypt.compare(req.body.password, user.password);
    if (isSamePass) {
      req.session.user = { username: user.username, id: user.id };
      res.status(200).json({ loggedIn: true, username: user.username });
    } else {
      console.log("not good2");
      res
        .status(401)
        .json({ loggedIn: false, status: "Wrong username or password" });
    }
  }
});

router.post("/signup", async (req, res) => {
  controller.validateForm(req, res);
  const user = await User.findByPk(req.params.id);
  if (user !== null) {
    res.json(400).json({ loggedIn: false, status: "Username taken" });
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
});

module.exports = router;
