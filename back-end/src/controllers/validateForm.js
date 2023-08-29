const { userSchema } = require("chat-app-mouhamads7");

exports.validateForm = (req, res) => {
  const formData = req.body;
  userSchema
    .validate(formData)
    .then((valid) => {
      if (valid) {
        console.log("Form is good");
      }
    })
    .catch((err) => {
      res.status(422).send();
      console.log(err.errors);
    });
};
