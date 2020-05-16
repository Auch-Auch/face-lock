const express = require("express");
const mongodb = require("mongodb");

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
    res.status(201).send();
  } catch (e) {
    console.log(e);
  }
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
