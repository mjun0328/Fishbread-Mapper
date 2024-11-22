const express = require("express");
const router = express.Router();

router.get("/signin", (req, res, next) => {
  res.render("signin", { title: "로그인" });
});

router.get("/signup", (req, res, next) => {
  res.render("signup", { title: "회원가입" });
});

module.exports = router;
