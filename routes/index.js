const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("map", { title: "우리 동네 붕어빵 - 팥붕슈붕" });
});

module.exports = router;
