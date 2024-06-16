const router = require("express").Router();
const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const isAuth = require("../middleware/jwt.middleware.js");

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //CHECK IF ALL FIELDS ARE FILLED IN
    if (!username || !password || !email)
      return res
        .status(400)
        .json({ message: "Please provide an username, email and password." });
    //CHECK IF USERNAME OR EMAIL ALREADY EXISTS
    const user = await User.findOne({ $or: { username, email } });
    console.log(user);
    if (user) {
      return res.status(400).json({
        message: "An user with that username or email already exists.",
      });
    }
    //REGEX FOR PASSWORD VALIDATION
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must have at least 8 characters and contain numbers, lowercase and uppercase letters and a special characters.",
      });
      return;
    }
    //REGEX FOR EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Provide a valid email address." });
      return;
    }
    //HASH THE PASSWORD BEFORE INSERTING IN DATABASE
    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10)
    );
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //CHECK IF ALL FIELDS ARE FILLED IN
    if (!password || !email)
      return res
        .status(400)
        .json({ message: "Please provide email and password." });
    //CHECK IF USER EXISTS
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "User don't exists, please Signup first" });
    }
    //CHECK THE PASSWORD
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    //EXCLUDE PASSWORD FOR JWTOKEN CREATION
    delete user._doc.password;
    //IF VALID CREDENTIALS THEN CREATE LOGGING AND SEND JWTOKEN
    const authToken = jwt.sign(
      { payload: user },
      process.env.TOKEN_SECRET_KEY,
      { algorithm: "HS256", expiresIn: "24h" }
    );
    res.json({ authToken, user });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/verify", isAuth, async (req, res) => {
  try {
    res.json({ message: "User is logged in", user: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
