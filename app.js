require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");

const GitHubStrategy = require("passport-github2").Strategy;
const LocalStrategy = require("passport-local");


const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const User = require("./models/user");


const dbUrl = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus";
mongoose.connect(dbUrl)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/* ================= SESSION ================= */

const session = require("express-session");
const MongoStore = require("connect-mongo")(session); // ✅ v3 syntax

app.use(session({
  store: new MongoStore({
    url: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus",
    touchAfter: 24 * 3600
  }),
  name: "session",
  secret: process.env.SECRET || "hackathon-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Render pe deploy se pehle true kar sakte ho
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

/* ================= PASSPORT ================= */
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currUser = req.user;   // 👈 MAGIC LINE
  next();
});

const ADMIN_GITHUB_IDS = ["YOUR_GITHUB_ID_HERE"];

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          user = new User({
            githubId: profile.id,
            username: profile.username,
            email: profile.emails?.[0]?.value || "",
            role: ADMIN_GITHUB_IDS.includes(profile.id) ? "admin" : "user",
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);


passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/* ================= GLOBAL USER ================= */
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.showCreateNotice = false;
  res.locals.raisecomplain = false;
  res.locals.lostitem = false;
  res.locals.founditem = false;
  next();
});

/* ================= AUTH ROUTES ================= */
app.get("/login", (req, res) => {
  res.render("user/login");
});

app.get("/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get("/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => res.redirect("/home")
);

app.get("/logout", (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash("error", "You have logged out of this website");
    res.redirect("/"); // flash yahi dikhega
  });
});


/* ================= PAGES ================= */
app.get("/", (req, res) => res.redirect("/home"));


app.get("/home", (req, res) => {
  res.render("campus/index");
});

const noticeRoutes = require("./router/notice");
app.use("/notice", noticeRoutes);

const issueRoutes = require("./router/issue");
app.use("/issue", issueRoutes);

const lostItemRoutes = require("./router/lostitem");
app.use("/lost", lostItemRoutes);

const foundItemRoutes = require("./router/founditem");
app.use("/found", foundItemRoutes);




app.get("/signup", (req, res) => {
  res.render("user/signup");
});



app.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const newUser = new User({
      username,
      email,
      role: role || "user", // fallback safety
    });

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.redirect("/home");
      req.flash("success", "you have successfully register to campus service");
    });

  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    req.flash("error", err);
    res.redirect("/signup");
  }
});


app.get("/login", (req, res) => {
  res.render("user/login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "login successful, welcome back to campus-service");
    res.redirect("/home");
  }
);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
