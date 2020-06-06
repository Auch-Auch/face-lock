const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await loadUsersColletion();
    res.send(await users.find().toArray());
  } catch (e) {
    console.log(e);
  }
});

router.post("/", async (req, res) => {
  try {
    const users = await loadUsersColletion();
    await users.insertOne({
      name: req.body.name,
      regDate: new Date().toISOString().slice(0, 10),
      time: new Date().toISOString().slice(11, 19),
    });
    res.status(201).send();
  } catch (e) {
    console.log(e);
  }
});

async function loadUsersColletion() {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://auch:123567@cluster0-solgr.mongodb.net/test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  return client.db("test").collection("users");
}

module.exports = router;
