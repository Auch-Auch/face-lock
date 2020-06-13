const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

const posts = require("./routes/api/posts");
const length = require("./routes/api/length");
const settings = require("./routes/api/settings");
const users = require("./routes/api/users");
const faceRecognitionByimg = require("./routes/api/faceRecognitionByImg");

app.use("/api/posts", posts);
app.use("/api/settings", settings);
app.use("/api/length", length);
app.use("/api/users", users);
app.use("/api/face_recognition", faceRecognitionByimg);

app.use(express.static("../images/"));

const port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

const io = require("socket.io")();
io.on("connection", require("./routes/api/faceRecognitionByIpCam"));
io.listen(3000);

process.on("uncaughtException", function (err) {
  console.log(err);
  io.emit("error", { error: err.message });
});

app.locals.io = io;
