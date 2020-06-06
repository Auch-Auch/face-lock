const cv = require("opencv4nodejs");
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const facesPath = `../facedetect/faces/`;
const lbph = new cv.LBPHFaceRecognizer();
const fisher = new cv.FisherFaceRecognizer();
const eigen = new cv.EigenFaceRecognizer();
const names = fs.readdirSync(facesPath);

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
  fisher.train(trainImgs, labels);
  eigen.train(trainImgs, labels);
  lbph.train(trainImgs, labels);
}

const Prediction = (recognizer, face) => {
  const result = recognizer.predict(face.bgrToGray().resize(100, 100));
  console.log(
    "predicted: %s, confidence: %s",
    names[result.label],
    result.confidence
  );
  let data = {
    name: names[result.label],
    confidence: result.confidence,
  };
  return data;
};

router.post("/predict", async (req, res) => {
  try {
    let face = req.body.imgBase64;
    face = face.replace("data:image/png;base64,", "", face);
    face = face.replace(" ", "+", face);
    fs.writeFileSync(`../images/faceImg/1.jpg`, Buffer.from(face, "base64"));
    face = cv.imread(`../images/faceImg/1.jpg`);
    let data = Prediction(lbph, face);
    res.send(data);
    res.status(201).send();
  } catch (e) {
    console.log(e);
  }
});

router.post("/newuser", async (req, res) => {
  try {
    let img = req.body.imgBase64;
    const name = req.body.name;
    const id = req.body.id;
    img = img.replace("data:image/png;base64,", "", img);
    img = img.replace(" ", "+", img);
    let dir = `../facedetect/faces/${name}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(
      `../facedetect/faces/${name}/${+id + 1}.jpg`,
      Buffer.from(img, "base64")
    );
    trainAlgorithms();
    res.status(201).send();
  } catch (e) {
    console.log(e);
  }
});

trainAlgorithms();
module.exports = router;
