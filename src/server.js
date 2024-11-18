const express = require("express");
const path = require("path");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const app = express();
const User = require("./models/users.model");
const passport = require("passport");
const cookieSession = require("cookie-session");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const cookieEncryptionKey = "aaaa";

app.use(
  cookieSession({
    name: "cookie-session-name",
    keys: [cookieEncryptionKey],
  })
);

// register regenerate & save after the cookieSession middleware initialization
app.use(function (request, response, next) {
  if (request.session && !request.session.regenerate) {
    request.session.regenerate = (cb) => {
      cb();
    };
  }
  if (request.session && !request.session.save) {
    request.session.save = (cb) => {
      cb();
    };
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.set("strictQuery", false);
mongoose
  .connect(
    `mongodb+srv://goweb:${process.env.DB_PW}@cluster0.nv82m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/static", express.static(path.join(__dirname, "public")));

const port = 4000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

app.get("/", (req, res) => {
  res.json({ message: "AAA" });
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.json({ msg: info });
    }

    req.logIn(user, async (err) => {
      if (err) {
        return next(err);
      }

      const accessToken = jwt.sign(
        {
          email: user.email,
        },
        process.env.JWT_KEY,
        { expiresIn: "15s", issuer: "weather", subject: "user_info" }
      );

      const refreshToken = jwt.sign({}, process.env.JWT_KEY, {
        expiresIn: "1d",
        issuer: "weather",
        subject: "user_info",
      });

      user.token = refreshToken;
      user.save();

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({
        success: true,
        accessToken,
      });
    });
  })(req, res, next);
});

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = app;
