const express = require("express");
const router = express.Router();
const { forceLogin } = require("./middleware");

const mongoose = require("mongoose");
const Store = require("../../models/store");
const StoreReport = require("../../models/storeReport");
const Review = require("../../models/review");

router.get("/", async (req, res, next) => {
  let { east, west, south, north } = req.query;
  for (const value of [east, west, south, north]) {
    if (value === undefined || isNaN(value))
      return res.status(400).json({ error: "Invalid query" });
  }
  [east, west, south, north] = [east, west, south, north].map(parseFloat);

  if (east < west || north < south)
    return res.status(400).json({ error: "Invalid query" });
  else if (east - west > 0.3 || north - south > 0.3)
    return res.status(400).json({ error: "Too large area" });

  const stores = await Store.find({
    latitude: { $gte: south, $lte: north },
    longitude: { $gte: west, $lte: east },
  });

  const result = [];
  for (const store of stores) {
    result.push({
      id: store.id,
      latitude: store.latitude,
      longitude: store.longitude,
    });
  }
  res.send(result);
});

router.post("/", forceLogin, async (req, res, next) => {
  const name = String(req.body.name ?? "").trim();
  const { latitude, longitude } = req.body;
  if (!name || !latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: "Invalid request" });
  } else if (name.length < 2 || name.length > 20) {
    return res.status(400).json({ error: "Name must be 2-20 characters long" });
  }

  const newStore = new Store({
    id: new mongoose.Types.ObjectId(),
    name,
    latitude,
    longitude,
    user: req.session.user,
    date: new Date(),
  });
  await newStore.save();

  res.status(201).json({ id: newStore.id });
});

router.get("/:store", async (req, res, next) => {
  const { store } = req.params;
  if (!/^[a-fA-F0-9]{24}$/.test(store)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const storeDoc = await Store.findOne({ id: store });
  if (!storeDoc) return res.status(404).json({ error: "Store not found" });

  const reviews = await Review.find({ store });
  const avgRating = reviews.length
    ? Math.round(
        (reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length) *
          10
      ) / 10
    : 0;

  res.json({
    id: storeDoc.id,
    name: storeDoc.name,
    latitude: storeDoc.latitude,
    longitude: storeDoc.longitude,
    review: {
      count: reviews.length,
      average: avgRating,
    },
  });
});

router.post("/report", forceLogin, async (req, res, next) => {
  const { store, content } = req.body;
  if (!store || !content || typeof content !== "string") {
    return res.status(400).json({ error: "Invalid request" });
  } else if (content.length < 10 || content.length > 500) {
    return res
      .status(400)
      .json({ error: "Content must be 10-500 characters long" });
  } else if (!/^[a-fA-F0-9]{24}$/.test(store)) {
    return res.status(400).json({ error: "Invalid store ID" });
  } else if (!(await Store.exists({ id: store }))) {
    return res.status(404).json({ error: "Store not found" });
  }

  const newReport = new StoreReport({
    id: new mongoose.Types.ObjectId(),
    store,
    user: req.session.user,
    date: new Date(),
    content,
  });
  await newReport.save();

  res.status(201).json({ id: newReport.id });
});

module.exports = router;
