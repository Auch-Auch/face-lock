const cv = require("opencv4nodejs");
const fs = require("fs");
const express = require("express");
const path = require("path");

const router = express.Router();

const facesPath = `../facedetect/faces/`;

const lbph = new cv.LBPHFaceRecognizer();
const names = fs.readdirSync(facesPath);
const faceCascade = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
const camFps = 10;
const camInterval = 1000 / camFps;

function getFaces() {
  let facesData = {
    faces: [],
    labels: [],
  };
  for (let name in names) {
    let faces = fs.readdirSync(facesPath + names[name]);
    for (face in faces) {
      let curFace = cv.imread(
        `../facedetect/faces/${names[name]}/${+face + 1}.jpg`
      );
      facesData.faces.push(curFace.bgrToGray().resize(100, 100));
      facesData.labels.push(+name);
    }
  }
  return facesData;
}

function trainAlgorithms() {
  const faceData = getFaces();
  const trainImgs = faceData.faces;
  const labels = faceData.labels;
  lbph.train(trainImgs, labels);
}

trainAlgorithms();

var recognitionInterval;

function recognition(videoCap, socket, action) {
  if (action === "stop") {
    socket.emit("end");
    clearInterval(recognitionInterval);
  }
  let img = videoCap.read();
  socket.emit("frame", {
    buffer: cv.imencode(".jpg", img),
  });
  faces = faceCascade.detectMultiScale(img.bgrToGray());

  if (faces.objects.length) {
    faces.objects.forEach((rect, i) => {
      const face = img.getRegion(rect);
      const result = lbph.predict(face.bgrToGray().resize(100, 100));
      socket.emit("face", {
        buffer: cv.imencode(".jpg", face.resize(100, 100).bgrToGray()),
        name: names[result.label],
        confidence: result.confidence,
      });
    });
  }
}

router.get("/:action", async (req, res) => {
  try {
    const action = req.params.action;
    const socket = req.app.locals.io;

    const videoCap = new cv.VideoCapture("http://10.10.10.1:8080/video");
    if (action === "stop") {
      clearInterval(recognitionInterval);
    }
    recognitionInterval = setInterval(
      () => recognition(videoCap, socket, action, recognitionInterval),
      camInterval
    );
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
