const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      return next();
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.json({
        message: "Please login again",
        status: false,
      });
    }
    const decodedToken = jwt.verify(JSON.parse(token), process.env.JWT_KEY);
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    return res.json({
      message: "Please login again",
      expired: true,
    });
  }
};
