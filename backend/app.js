const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

//Login user
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);
    // const token = await requestManager.loginUser(username, password);
    res.status(200).json({
      message: "Login successful.",
      authorization: "helloImToken!",
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
