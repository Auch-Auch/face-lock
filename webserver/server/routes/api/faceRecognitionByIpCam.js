const cv = require("opencv4nodejs");
const fs = require("fs");
const express = require("express");
const path = require("path");
const cluster = require("cluster");

const router = express.Router();

const facesPath = `../facedetect/faces/`;

const lbph = new cv.LBPHFaceRecognizer();
const names = fs.readdirSync(facesPath);
const faceCascade = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
const camFps = 10;
const camInterval = 1000 / camFps;
var recognitionInterval;
var videoCap;

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

function trainAlgorithm() {
  const faceData = getFaces();
  const trainImgs = faceData.faces;
  const labels = faceData.labels;
  lbph.train(trainImgs, labels);
}

function recognition(videoCap, socket, action) {
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
        socket.emit("face", {
          buffer: cv.imencode(".jpg", face.resize(100, 100).bgrToGray()),
          name: names[result.label],
          confidence: result.confidence,
        });
      });
    }
  } catch (e) {
    throw new Error("something wrong with video processing");
  }
}

trainAlgorithm();

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
      if (data.action === "stop") {
        clearInterval(recognitionInterval);
        return;
      }
      cap = startVideo(data.adress);
      recognitionInterval = setInterval(
        () => recognition(cap, sockets, data.action),
        camInterval
      );
    });
  } catch (e) {
    throw new Error("something wrong with sockets");
  }
};
