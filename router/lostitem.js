const express = require("express");
const router = express.Router();
const LostItem = require("../models/lost");

// Middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
};

// Show all lost items
router.get("/", async (req, res) => {
    res.locals.lostitem = true;
    const items = await LostItem.find().populate("createdBy");
    res.render("campus/lost", { items });
});

// Form to create lost item
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campus/newLostItem");
});

// Create lost item
router.post("/", isLoggedIn, async (req, res) => {
  const item = new LostItem(req.body.lostItem);
  item.createdBy = req.user._id;
  await item.save();
  res.redirect("/lost");
});

module.exports = router;
