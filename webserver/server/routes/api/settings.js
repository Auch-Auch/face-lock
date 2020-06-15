const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const settings = await loadSettingsColletion();
    res.send(await settings.find().toArray());
  } catch (e) {
    console.log(e);
  }
});

router.post("/", async (req, res) => {
  try {
    const path = req.body;
    const settings = await loadSettingsColletion();
    settings.find({}).forEach((obj) => {
      settings.updateOne(
        { _id: obj._id },
        {
          $set: { campath: path.campath },
        }
      );
    });
    res.status(201).send();
  } catch (e) {
    console.log(e);
  }
});

router.post("/cameras/", async (req, res) => {
  try {
    const camera = req.body;
    const settings = await loadSettingsColletion();
    settings.find({}).forEach((obj) => {
      settings.updateOne(
        { _id: obj._id },
        {
          $push: { cameras: camera.camera },
        }
      );
    });
    res.status(201).send();
  } catch (e) {
    console.log(e);
  }
});

router.get("/cameras/", async (req, res) => {
  try {
    const settings = await loadSettingsColletion();
    res.send(await settings.find({}, { cameras: true, _id: false }).toArray());
  } catch (e) {
    console.log(e);
  }
});

router.post("/locks/", async (req, res) => {
  try {
    const lock = req.body;
    const settings = await loadSettingsColletion();
    settings.find({}).forEach((obj) => {
      settings.updateOne(
        { _id: obj._id },
        {
          $push: { locks: lock.lock },
        }
      );
    });
    res.status(201).send();
  } catch (e) {
    console.log(e);
  }
});

router.post("/lock", async (req, res) => {
  try {
    const path = req.body;
    const settings = await loadSettingsColletion();
    settings.find({}).forEach((obj) => {
      settings.updateOne(
        { _id: obj._id },
        {
          $set: { lockpath: path.lockpath },
        }
      );
    });
    res.status(201).send();
  } catch (e) {
    console.log(e);
  }
});

router.get("/locks/", async (req, res) => {
  try {
    const settings = await loadSettingsColletion();
    res.send(await settings.find({}, { locks: true, _id: false }).toArray());
  } catch (e) {
    console.log(e);
  }
});

async function loadSettingsColletion() {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://auch:123567@cluster0-solgr.mongodb.net/test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  return client.db("test").collection("settings");
}

module.exports = router;
