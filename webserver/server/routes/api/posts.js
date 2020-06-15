const express = require("express");
const mongodb = require("mongodb");
const fs = require("fs");
const fsx = require("fs-extra");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "auchhunter@gmail.com",
    pass: "123567Dfvgbh",
  },
});

const router = express.Router();

router.get("/:name/:date/:access/:skip/:limit", async (req, res) => {
  try {
    const date =
      req.params.date === "any" ? {} : { "info.day": req.params.date };
    const access =
      req.params.access === "any"
        ? {}
        : { "info.access": JSON.parse(req.params.access) };
    const skip = 0 || req.params.skip;
    const limit = 0 || req.params.limit;
    const name =
      req.params.name === "any"
        ? {}
        : { "info.name": req.params.name.toLowerCase() };
    console.log(date, access, name);
    const posts = await loadPostsColletion();
    if (
      Object.keys(date).length === "any" &&
      Object.keys(name).length === "any" &&
      Object.keys(access).length === "any"
    ) {
      res.send(
        await posts
          .find()
          .sort({ date: -1 })
          .skip(Number(skip))
          .limit(Number(limit))
          .toArray()
      );
    } else {
      res.send(
        await posts
          .find({
            $and: [date, access, name],
          })
          .sort({ date: -1 })
          .skip(Number(skip))
          .limit(Number(limit))
          .toArray()
      );
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = new mongodb.ObjectID(req.params.id);
    const posts = await loadPostsColletion();
    res.send(await posts.find({ _id: id }).toArray());
  } catch (e) {
    console.log(e);
  }
});

router.get("/month/:number", async (req, res) => {
  let number = req.params.number;
  number = number.length === 1 ? "0" + number : number;
  console.log([/\d\d\d\d-${number}-\d\d/]);
  try {
    const posts = await loadPostsColletion();
    res.send(
      await posts.find({ "info.day": { $regex: `-${number}-` } }).toArray()
    );
  } catch (e) {
    console.log(e);
  }
});

router.post("/img", async (req, res) => {
  const imgName = req.body.imgName;
  let img = req.body.imgBase64;
  img = img.replace("data:image/png;base64,", "", img);
  img = img.replace(" ", "+", img);
  fs.writeFileSync(
    `../facedetect/images/${imgName}.jpg`,
    Buffer.from(img, "base64")
  );
  res.status(201).send();
});

router.get("/posts/delete", async (req, res) => {
  try {
    const posts = await loadPostsColletion();
    posts.deleteMany({ "info.0.day": "2020-06-08" });
    res.status(201).send;
  } catch (e) {
    throw e;
  }
});

function recordsDataToString(data) {
  data = data.map(
    (record, index) =>
      "</td>" +
      "<tr>" +
      `#${index + 1}` +
      "</tr>" +
      "<tr>" +
      "name: " +
      record.info[0].name +
      "</tr>" +
      "<tr>" +
      "confidence: " +
      record.info[0].confidence +
      "</tr>" +
      "<tr>" +
      "date: " +
      record.info[0].day +
      "</tr>" +
      "<tr>" +
      "time: " +
      record.info[0].time +
      "<br>" +
      "</tr>" +
      "<br>"
  );
  return data.join("</td>");
}

router.post("/", async (req, res) => {
  try {
    const posts = await loadPostsColletion();
    await posts.insertOne({
      info: req.body,
      date: new Date().toISOString(),
    });
    posts
      .find({})
      .sort({ $natural: -1 })
      .limit(1)
      .forEach((obj) => {
        posts.updateOne(
          { _id: obj._id },
          {
            $set: { "info.0.name": new String(obj.info[0].name).toLowerCase() },
          }
        );
      });
    const length = await posts.find().count();
    if (length % 100 === 0) {
      const records = recordsDataToString(
        await posts.find().sort({ _id: -1 }).limit(100).toArray()
      );
      const date = new Date().toGMTString();
      let result = await transporter.sendMail({
        from: `"webFace app  ${date}" <auchhunter@gmail.com>`,
        to: "auchcrypto@gmail.com",
        subject: "Message from webFace app",
        text: records,
        html: `<h1>  last 100 records history </h1>
        <br>
        <table>${records}</table>
        `,
      });
    }
    res.status(201).send();
  } catch (e) {
    console.log(e);
  }
});

async function loadPostsColletion() {
  const password = process.env.CLIENT_PASSWORD;
  const client = await mongodb.MongoClient.connect(
    `mongodb+srv://auch:${password}@cluster0-solgr.mongodb.net/test`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  return client.db("test").collection("posts");
}

module.exports = router;
