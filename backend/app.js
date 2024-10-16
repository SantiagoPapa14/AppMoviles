const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const authLib = require("./lib/authLib");
const e = require("express");

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  })
);

app.get("/", authLib.validateAuthorization, (req, res) => {
  const message = "Welcome to the secret backend " + req.userData.username;
  res.send(message);
});

//Login user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Please provide email and password",
      });
      return;
    }
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
    if (!email || !password || !username) {
      res.status(400).json({
        message: "Please provide email and password",
      });
      return;
    }
    const token = await authLib.registerUser(email, username, password);

    res.status(200).json({
      message: "Register successful!",
      token: token,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//Get user data
app.get("/user/:id?", authLib.validateAuthorization, (req, res) => {
  if (req.params.id) {
    //TODO: Para cuando necesitemos ver los datos de otros usuarios.
    res.json({
      message: "Functionality not yet implemented!",
    });
  } else {
    delete req.userData.hashedPassword;
    res.json(req.userData);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;