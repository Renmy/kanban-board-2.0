const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verifiedUser = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.user = verifiedUser.payload;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Token is invalid" });
  }
};

module.exports = isAuth;
