const Yup = require("yup");
const formSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "The password is too short!"),
});

exports.login = async (req, res, next) => {
  const formData = req.body;
  formSchema
    .validate(formData)
    .then((valid) => {
      if (valid) console.log("Form is good");
    })
    .catch((err) => {
      res.status(422).send();
      console.log(err.errors);
    });
};
