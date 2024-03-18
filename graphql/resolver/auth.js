const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist!");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "supersecretkey",
      { expiresIn: "1h" }
    );

    return { userId: user.id, token: token, tokenExpiration: 1 };
  },
};
