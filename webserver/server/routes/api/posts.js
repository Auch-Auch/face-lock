const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

router.get("/:name/:date/:access/:skip/:limit", async (req, res) => {
  const date = req.params.date === "0" ? {} : { "info.day": req.params.date };
  const access =
    req.params.access === "0"
      ? {}
      : { "info.access": JSON.parse(req.params.access) };
  const skip = 0 || req.params.skip;
  const limit = 0 || req.params.limit;
  const name =
    req.params.name === "0"
      ? {}
      : { "info.name": req.params.name.toLowerCase() };
  console.log(date, access, name);
  const posts = await loadPostsColletion();
  posts.find({ "info.name": { $exists: true } }).forEach((obj) => {
    posts.updateOne(
      { _id: obj._id },
      { $set: { "info.0.name": new String(obj.info[0].name).toLowerCase() } }
    );
  });
  if (
    Object.keys(date).length === 0 &&
    Object.keys(name).length === 0 &&
    Object.keys(access).length === 0
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
});

router.get("/", async (req, res) => {
  const posts = await loadPostsColletion();
  res.send(await posts.find({}).toArray());
});

router.post("/", async (req, res) => {
  try {
    const posts = await loadPostsColletion();
    await posts.insertOne({
      info: req.body,
      date: new Date().toISOString(),
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
