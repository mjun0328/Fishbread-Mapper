const express = require("express");
const router = express.Router();
const { forceLogin } = require("./middleware");

const mongoose = require("mongoose");
const Store = require("../../models/store");
const Review = require("../../models/review");
const ReviewReport = require("../../models/reviewReport");

router.get("/:store", forceLogin, async (req, res, next) => {
  const { store } = req.params;
  if (!store || !/^[a-fA-F0-9]{24}$/.test(store))
    return res.status(400).json({ error: "Invalid request" });
  else if (!(await Store.exists({ id: store }))) {
    return res.status(404).json({ error: "Store not found" });
  }

  let page = req.query.page ?? 0;
  if (isNaN(page) || page < 0) page = 0;
  else page = parseInt(page);

  const LIMIT = 10;
  const reviews = await Review.find({ store })
    .sort({ date: -1 })
    .limit(LIMIT)
    .skip(page * LIMIT);

  const result = [];
  for (const review of reviews) {
    result.push({
      id: review.id,
      comment: review.comment,
      time: review.date.toISOString(),
      isAuthor: review.user.equals(req.session.user),
    });
  }

  res.json(result);
});

router.post("/:store", forceLogin, async (req, res, next) => {
  const { store } = req.params;
  const { comment, rating } = req.body;
  if (!store || !comment || !rating || typeof comment !== "string") {
    return res.status(400).json({ error: "Invalid request" });
  } else if (comment.trim().length < 5 || comment.trim().length > 100) {
    return res
      .status(400)
      .json({ error: "Content must be 5-100 characters long" });
  } else if (isNaN(rating) || parseInt(rating) < 1 || parseInt(rating) > 5) {
    return res.status(400).json({ error: "Invalid rating" });
  } else if (!/^[a-fA-F0-9]{24}$/.test(store)) {
    return res.status(400).json({ error: "Invalid store ID" });
  } else if (!(await Store.exists({ id: store }))) {
    return res.status(404).json({ error: "Store not found" });
  }

  const newReview = new Review({
    id: new mongoose.Types.ObjectId(),
    store,
    rating: parseInt(rating),
    comment: comment.trim(),
    user: req.session.user,
    date: new Date(),
  });
  await newReview.save();

  res.status(201).json({ id: newReview.id });
});

router.delete("/:review", forceLogin, async (req, res, next) => {
  const { review } = req.params;
  if (!review || !/^[a-fA-F0-9]{24}$/.test(review))
    return res.status(400).json({ error: "Invalid request" });

  const reviewDoc = await Review.findOne({ id: review });
  if (!reviewDoc) return res.status(404).json({ error: "Review not found" });
  else if (!reviewDoc.user.equals(req.session.user))
    return res.status(403).json({ error: "Unauthorized" });

  await Review.deleteOne({ id: review });
  res.status(204).end();
});

router.post("/:review/report", forceLogin, async (req, res, next) => {
  const { review } = req.params;
  if (!review || !/^[a-fA-F0-9]{24}$/.test(review))
    return res.status(400).json({ error: "Invalid request" });
  else if (!(await Review.exists({ id: review })))
    return res.status(404).json({ error: "Review not found" });

  const newReport = new ReviewReport({
    id: new mongoose.Types.ObjectId(),
    review,
    user: req.session.user,
    date: new Date(),
  });
  await newReport.save();

  res.status(201).json({ id: newReport.id });
});

module.exports = router;
