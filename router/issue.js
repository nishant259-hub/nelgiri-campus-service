const express = require("express");
const router = express.Router();
const Issue = require("../models/issue");

/* ================= MIDDLEWARE ================= */

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  res.redirect("/home");
};

/* ================= LIST ISSUES ================= */

router.get("/", isLoggedIn, async (req, res) => {
  res.locals.raisecomplain = true;

  let complaints;

  if (req.user.role === "admin") {
    complaints = await Issue.find().populate("createdBy");
  } else {
    complaints = await Issue.find({ createdBy: req.user._id });
  }

  res.render("campus/issue", { complaints });
});

/* ================= CREATE ISSUE ================= */

router.post("/", isLoggedIn, async (req, res) => {
  const complaint = new Issue(req.body.complaint);
  complaint.createdBy = req.user._id;
  await complaint.save();
  req.flash("success", "congrats! your complain has been register.");
  res.redirect("/issue");
});

/* ================= UPDATE STATUS (ADMIN) ================= */

router.put("/:id/status", isAdmin, async (req, res) => {
  await Issue.findByIdAndUpdate(req.params.id, {
    status: req.body.status
  });
  res.redirect("/issue");
});


//new
// show form
router.get("/new", isLoggedIn, (req, res) => {
  res.locals.raisecomplain = true;
  res.render("campus/newIssue");
});

// submit form
router.post("/", isLoggedIn, async (req, res) => {
  const complaint = new Issue(req.body.complaint);
  complaint.createdBy = req.user._id;
  await complaint.save();
  res.redirect("/issue");
});

router.put("/:id/status", isLoggedIn, isAdmin, async (req, res) => {
  await Issue.findByIdAndUpdate(req.params.id, {
    status: req.body.status
  });
  res.redirect("/issue");
});



module.exports = router;
