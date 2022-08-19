const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res, next) => {
  try {
    const { userName, name, email, password } = req.body;

    const userNameCheck = await User.findOne({ userName });

    if (userNameCheck) {
      return res.json({ message: "Username already used", status: false });
    }

    const emailCheck = await User.findOne({ email });

    if (emailCheck) {
      return res.json({ message: "Email already used", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      userName,
      name,
      password: hashedPassword,
    });

    let token;
    try {
      token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
    } catch (err) {
      console.log(err);
      return res.json({ message: "Could not login", status: false });
    }
    user.password = undefined;
    user.contacts = undefined;

    return res.json({ status: true, user: user, token: token });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ userName: email });

    if (!user) {
      user = await User.findOne({ email });

      if (!user) {
        return res.json({
          message: "Incorrect user or password",
          status: false,
        });
      }
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.json({ message: "Incorrect user or password", status: false });
    }

    let token;
    try {
      token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
    } catch (err) {
      console.log(err);
      return res.json({ message: "Could not login", status: false });
    }
    user.password = undefined;
    user.contacts = undefined;
    return res.json({ status: true, user: user, token: token });
  } catch (err) {
    next(err);
  }
};
