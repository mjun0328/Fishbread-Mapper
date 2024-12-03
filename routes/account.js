const express = require("express");
const router = express.Router();

router.get("/signin", (req, res, next) => {
  res.render("signin", { title: "로그인" });
});

router.get("/signup", (req, res, next) => {
  res.render("signup", { title: "회원가입" });
});

router.get("/password", (req, res, next) => {
  res.render("password", { title: "비밀번호 변경" });
});

module.exports = router;
