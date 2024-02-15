const bcrypt = require("bcryptjs");

const User = require("../../models/user");

module.exports = {
  createUser: (args) => {
    return User.findOne({ email: args.userInput.email })
      .then((res) => {
        if (res) {
          throw new Error(`User exist already.`);
        } else {
          return bcrypt.hash(args.userInput.password, 12);
        }
      })
      .then((res) => {
        const user = new User({
          email: args.userInput.email,
          password: res,
        });

        return user.save();
      })
      .then((res) => {
        return { ...res._doc, password: "", _id: res.id };
      })
      .catch((err) => {
        throw err;
      });
  },
};
