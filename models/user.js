const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: mongoose.Types.ObjectId, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  salt: { type: String, required: true },
  password: { type: String, required: true },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
