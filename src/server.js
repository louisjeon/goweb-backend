const express = require("express");
const path = require("path");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const app = express();
const User = require("./models/users.model");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.set("strictQuery", false);
mongoose
  .connect(
    `mongodb+srv://admin:3rIqjfTuf6UCaBYQ@bike-web.focyt.mongodb.net/?retryWrites=true&w=majority&appName=bike-web`
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

// tmp
app.get("/", (req, res) => {
  res.json({ message: "AAA" });
});

//tmp
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
