const crypto = require("crypto");
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const User = require("../../models/user");

const getIterationCnt = process.env.ITERATION_CNT * 1;

router.post("/signup", async (req, res, next) => {
  const email = String(req.body.email ?? "").trim();
  const password = req.body.password;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: "Invalid email format" });
  else if (password.length < 6)
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });

  const user = await User.findOne({
    email,
  });
  if (user) return res.status(409).json({ error: "Email already exists" });

  const salt = crypto.randomBytes(32).toString("hex");
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, getIterationCnt, 64, "sha512")
    .toString("hex");

  const newUser = new User({
    id: new mongoose.Types.ObjectId(),
    email,
    salt,
    password: hashedPassword,
  });
  await newUser.save();

  res.status(201).json({ message: "User created" });
});

router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const hashedPassword = crypto
    .pbkdf2Sync(password, user.salt, getIterationCnt, 64, "sha512")
    .toString("hex");

  if (user.password !== hashedPassword)
    return res.status(401).json({ error: "Password is wrong" });

  req.session.user = user.id;
  res.json({ message: "Login success" });
});

router.post("/logout", async (req, res, next) => {
  req.session.user = undefined;
  res.json({ message: "Logout success" });
});

module.exports = router;
