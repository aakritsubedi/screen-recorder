const express = require("express");
var cors = require("cors");
const app = express();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

app.use(cors());
app.use("/uploads", express.static("uploads"));

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".mp4");
  },
});
const upload = multer({ storage: storage });

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.post("/video", upload.single("recording"), function (req, res, next) {
  console.log(req.file);
  const newRecordingInfo = {
    id: uuidv4(),
    status: "SUCCESS",
    path: `http://localhost:8080/${req.file.path}`,
    size: req.file.size,
  };

  let oldRecording = fs.readFileSync("recordings.json");
  oldRecording = JSON.parse(oldRecording);
  oldRecording.push(newRecordingInfo);

  fs.writeFileSync("recordings.json", JSON.stringify(oldRecording));

  return res.json(newRecordingInfo);
});

app.get("/video/:id", (req, res, next) => {
  const id = req.params.id;
  let recordings = fs.readFileSync("recordings.json");
  recordings = JSON.parse(recordings);

  const myRecording = recordings.filter((recording) => recording.id === id);
  if (myRecording.length === 0) {
    return res.json({
      id: id,
      status: "404",
      path: `-`,
      size: "-",
    });
  }

  return res.json(myRecording[0]);
});

app.get("/videos", (req, res, next) => {
  const id = req.params.id;
  let recordings = fs.readFileSync("recordings.json");
  recordings = JSON.parse(recordings);

  return res.json(recordings);
});

app.listen(8080);
