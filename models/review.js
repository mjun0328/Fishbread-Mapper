const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: { type: mongoose.Types.ObjectId, required: true, unique: true },
  store: { type: mongoose.Types.ObjectId, required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  user: { type: mongoose.Types.ObjectId, required: true },
  date: { type: Date, required: true },
});

const storeModel = mongoose.model("Review", userSchema);
module.exports = storeModel;
