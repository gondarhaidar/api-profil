const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const session = require("express-session");
require("dotenv").config();

app.use(
  session({
    secret:
      "ujshfuiyr8SDGASDRGAEJ/tjgweTWE?GJweGVejfawWR?U2YRFGWjtgaPasjkf:iHIw",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.set("views", "views");
app.set("view engine", "ejs");
const port = 5500;
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "public/img/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });
// const imageValidation = (req, res, next) => {
//   const file = req.body.file.split(".")[1];
//   if (file !== "jpg" || file !== "jpeg" || file !== "png ") {
//     return res.status(403).json({ msg: "file tidak valid" });
//   }
//   next();
// };

const userAuthenticate = (req, res, next) => {
  if (req.session.username) {
    return next();
  }
  res.status(403).redirect("/login");
};
const guestUser = (req, res, next) => {
  if (!req.session.username) {
    return next();
  }
  res.status(403).redirect("/dashboard");
};

app.get("/project", (req, res) => {
  const db = JSON.parse(fs.readFileSync("data.json", "utf-8")).project;
  res.status(200).json(db);
});

app.get("/edit", userAuthenticate, (req, res) => {
  res.render("edit");
});
app.get("/add", userAuthenticate, (req, res) => {
  res.render("add");
});
app.get("/dashboard", userAuthenticate, (req, res) => {
  res.render("index");
});
app.post("/add", userAuthenticate, upload.single("file"), (req, res) => {
  const { nama, linkPreview, linkCode } = req.body;
  const img = req.file.filename;
  const db = JSON.parse(fs.readFileSync("data.json", "utf-8"));
  let lastId = 0;
  if (db.project.length < 1) {
    lastId = 1;
  } else {
    lastId = Math.max(...db.project.map((item) => item.id));
  }
  console.log(lastId);
  const newDb = {
    ...db,
    project: [
      ...db.project,
      { id: lastId + 1, nama, linkPreview, linkCode, img },
    ],
  };
  fs.writeFileSync("data.json", JSON.stringify(newDb, null, 4));
  res.status(201).redirect("/dashboard");
});
app.get("/delete/:id", userAuthenticate, (req, res) => {
  const id = req.params.id;
  const db = JSON.parse(fs.readFileSync("data.json", "utf-8"));
  deleteDb = db.project.filter((item) => item.id != id);
  const newDb = { ...db, project: deleteDb };
  fs.writeFileSync("data.json", JSON.stringify(newDb, null, 4));
  res.status(200).redirect("/dashboard");
});

app.get("/login", guestUser, (req, res) => {
  res.render("login");
});

app.post("/login", guestUser, (req, res) => {
  const { username, password } = req.body;
  if (username == process.env.NAME && password == process.env.PASSWORD) {
    req.session.username = {
      username,
    };
    return res.redirect("/dashboard");
  }
  res.status(403).redirect("/login");
});

app.get("/edit/:id", userAuthenticate, (req, res) => {
  const db = JSON.parse(fs.readFileSync("data.json", "utf-8")).project.filter(
    (item) => item.id == req.params.id
  )[0];
  console.log(db);
  res.render("edit", { data: db });
});

app.post("/edit", userAuthenticate, (req, res) => {
  const { id, nama, linkPreview, linkCode } = req.body;
  const db = JSON.parse(fs.readFileSync("data.json", "utf-8"));
  res.status(503).json({ msg: "fitur belum selesai dibuat" });
});

app.use((req, res) => {
  res.status(404).json({ msg: "not found" });
});
app.listen(port, () => {
  console.log("API running on port " + port);
});
