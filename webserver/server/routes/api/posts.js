const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await loadPostsColletion();
  res.send(await posts.find({}).toArray());
});

router.post("/", async (req, res) => {
  try {
    const posts = await loadPostsColletion();
    await posts.insertOne({
      info: req.body,
      date: new Date().toISOString()
    });
    res.status(201).send();
  } catch (e) {}
});

async function loadPostsColletion() {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://auch:123567@cluster0-solgr.mongodb.net/test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );

  return client.db("test").collection("posts");
}

module.exports = router;
