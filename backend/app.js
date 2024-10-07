const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const authLib = require("./lib/authLib");

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  })
);

app.get("/", authLib.validateAuthorization, (req, res) => {
  res.send("Hello World");
});

//Login user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await authLib.loginUser(email, password);

    res.status(200).json({
      message: "Login successful!",
      token: token,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//Register user
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const token = await authLib.registerUser(email, username, password);

    res.status(200).json({
      message: "Register successful!",
      token: token,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
