const express = require("express");
const router = express.Router();

router.use("/account", require("./account"));
router.use("/store", require("./store"));

module.exports = router;
