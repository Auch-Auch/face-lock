const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

router.get("/:name/:date/:access/", async (req, res) => {
  const date = req.params.date === "0" ? {} : { "info.day": req.params.date };
  const access =
    req.params.access === "0"
      ? {}
      : { "info.access": JSON.parse(req.params.access) };
  const name =
    req.params.name === "0"
      ? {}
      : { "info.name": req.params.name.toLowerCase() };
  console.log(date, access, name);
  const posts = await loadPostsColletion();
  const length = await posts.find({ $and: [date, access, name] }).count();
  res.send(String(length));
});

router.post("/", async (req, res) => {
  try {
    const posts = await loadPostsColletion();
    await posts.insertOne({
      info: req.body,
    });
    res.status(201).send();
  } catch (e) {}
});

async function loadPostsColletion() {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://auch:123567@cluster0-solgr.mongodb.net/test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  return client.db("test").collection("posts");
}

module.exports = router;
