const mongoose = require("mongoose");

const storeReportSchema = new mongoose.Schema({
  id: { type: mongoose.Types.ObjectId, required: true, unique: true },
  store: { type: mongoose.Types.ObjectId, required: true },
  user: { type: mongoose.Types.ObjectId, required: true },
  date: { type: Date, required: true },
  content: { type: String, required: true },
});

const storeReportModel = mongoose.model("StoreReport", storeReportSchema);
module.exports = storeReportModel;
