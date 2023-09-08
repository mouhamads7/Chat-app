const Yup = require("yup");

const friendSchema = Yup.object({
  username: Yup.string().required("Username is required"),
});

module.exports = friendSchema;
