const express = require("express");
const router = express.Router();
const FoundItem = require("../models/found");

// Middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
};

// Show all lost items
router.get("/", async (req, res) => {
    res.locals.founditem = true;
    const founditems = await FoundItem.find().populate("createdBy");
    res.render("campus/found", { founditems });
});

// Form to create lost item
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campus/newfoundItem");
});

// Create lost item
router.post("/", isLoggedIn, async (req, res) => {
  const item = new FoundItem(req.body.foundItem);
  item.createdBy = req.user._id;
  await item.save();
  res.redirect("/found");
});

module.exports = router;