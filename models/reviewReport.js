const mongoose = require("mongoose");

const reviewReportSchema = new mongoose.Schema({
  id: { type: mongoose.Types.ObjectId, required: true, unique: true },
  review: { type: mongoose.Types.ObjectId, required: true },
  user: { type: mongoose.Types.ObjectId, required: true },
  date: { type: Date, required: true },
});

const reviewReportModel = mongoose.model("ReviewReport", reviewReportSchema);
module.exports = reviewReportModel;
