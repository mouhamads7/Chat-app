const controller = require("../controllers/users");
const router = require("express").Router();

router
  .get("/", controller.getAll)
  // .get(":/id", controller.getOne)
  .post("/", controller.createOne);
// .delete("/id", controller.deleteOne);

module.exports = router;
