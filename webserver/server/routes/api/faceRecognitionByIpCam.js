const cv = require("opencv4nodejs");
const fs = require("fs");

const express = require("express");
const path = require("path");

const router = express.Router();

const facesPath = `../facedetect/faces/`;

const lbph = new cv.LBPHFaceRecognizer();
const faceCascade = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
const camFps = 10;
const camInterval = 1000 / camFps;
var recognitionInterval;
var videoCap;
let timer;
let wasFace = false;

function getFaces(names) {
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

function trainAlgorithm(names) {
  const faceData = getFaces(names);
  const trainImgs = faceData.faces;
  const labels = faceData.labels;
  lbph.train(trainImgs, labels);
}

function recognition(videoCap, socket, action, names) {
  try {
    if (action === "stop") {
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
        cv.drawDetection(img, rect);
        socket.emit("frame", {
          buffer: cv.imencode(".jpg", img),
        });

        socket.emit("face", {
          buffer: cv.imencode(".jpg", face.resize(100, 100).bgrToGray()),
          name: names[result.label],
          confidence: result.confidence,
        });
      });
    }
  } catch (e) {
    console.log(e);
  }
}

function startVideo(adress) {
  try {
    console.log(adress);
    videoCap = new cv.VideoCapture(adress);
    return videoCap;
  } catch (e) {
    throw new Error("something wrong with camera's adress or ip cam");
  }
}

module.exports = (sockets) => {
  try {
    sockets.on("startDetecting", (data) => {
      let names = fs.readdirSync(facesPath);
      trainAlgorithm(names);
      if (data.action === "stop") {
        clearInterval(recognitionInterval);
        return;
      }
      cap = startVideo(data.adress);
      recognitionInterval = setInterval(
        () => recognition(cap, sockets, data.action, names),
        camInterval
      );
    });
  } catch (e) {
    throw new Error("something wrong with sockets");
  }
};
