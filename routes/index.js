const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "우리 동네 붕어빵 - 팥붕슈붕",
    apikey: process.env.APIKEY,
  });
});

module.exports = router;
