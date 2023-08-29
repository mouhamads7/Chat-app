const Yup = require("yup");

const userSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "The password is too short!"),
});

module.exports = userSchema;
