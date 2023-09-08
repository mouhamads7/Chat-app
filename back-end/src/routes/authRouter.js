const validateForm = require("../controllers/validateForm");
const auth = require("../controllers/authController");
const router = require("express").Router();
const { reqLimiter } = require("../controllers/loginLimiter");

router
  .route("/login")
  .post(validateForm, reqLimiter(10, 60), auth.login)
  .get(auth.getLogin);

router.post("/signup", validateForm, reqLimiter(3, 4), auth.signup);
module.exports = router;
