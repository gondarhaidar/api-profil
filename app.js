const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const port = 5500;
const fs = require("fs");

app.get("/project", (req, res) => {
  const db = JSON.parse(fs.readFileSync("data.json", "utf-8")).project;
  res.status(200).json(db);
});

app.use((req, res) => {
  res.status(404).json({ msg: "not found" });
});
app.listen(port, () => {
  console.log("API running on port " + port);
});
