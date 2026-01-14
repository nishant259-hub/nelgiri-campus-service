const express = require("express");
const router = express.Router();
const Notice = require("../models/notice");

/* ================= ADMIN CHECK ================= */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  req.flash("error", "Access Denied! You are not an admin.");
  return res.redirect("/home");
};

/* ================= NOTICE LIST ================= */
router.get("/", async (req, res) => {
  res.locals.showCreateNotice = true;
  const allnotice = await Notice.find();
  res.render("campus/notice", { allnotice });
});

/* ================= NEW NOTICE FORM ================= */
router.get("/new", isAdmin, (req, res) => {
  console.log("ADMIN USER:", req.user);
  res.render("campus/newnotice");
});

/* ================= CREATE NOTICE ================= */
router.post("/", isAdmin, async (req, res) => {
  try {
    const notice = new Notice(req.body.notice);
    console.log(req.body.notice);
    await notice.save();
    req.flash("success", "New notice has been posted");
    res.redirect("/notice");
  } catch (e) {
    res.send("Error saving notice");
  }
});


// Delete notice
router.delete("/:id", isAdmin, async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.redirect("/notice");
});


module.exports = router;

