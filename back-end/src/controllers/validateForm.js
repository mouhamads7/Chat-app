const { userSchema } = require("chat-app-mouhamads7");

const validateForm = (req, res, next) => {
  const formData = req.body;
  userSchema
    .validate(formData)
    .then((valid) => {
      if (valid) {
        console.log("Form is good");
        next();
      } else {
        res.status(422).send();
      }
    })
    .catch((err) => {
      res.status(422).send();
      console.log(err.errors);
    });
};

module.exports = validateForm;
