const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  id: { type: mongoose.Types.ObjectId, required: true, unique: true },
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  user: { type: mongoose.Types.ObjectId, required: true },
  date: { type: Date, required: true },
});

const storeModel = mongoose.model("Store", storeSchema);
module.exports = storeModel;
