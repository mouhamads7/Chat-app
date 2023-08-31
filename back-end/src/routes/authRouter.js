const auth = require("../controllers/authController");
const router = require("express").Router();

router.route("/login").post(auth.login).get(auth.getLogin);

router.post("/signup", auth.signup);
module.exports = router;
