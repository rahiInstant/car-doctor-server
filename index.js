const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT | 8080;

app.use(cors());
app.use(express.json());




app.get("/", (req, res) => {
  res.send("Welcome to car-doctor server.");
});

app.listen(port, () => {
  console.log(`server is running ${port}`);
});
