import axios from "axios";

const settingsURL = "http://localhost:5000/api/settings/";

class SettingsService {
  static getSettings() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(settingsURL);
        const data = res.data;
        resolve(
          data.map((settings) => ({
            ...settings,
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  static pushCamera(camera) {
    try {
      axios({
        method: "post",
        url: settingsURL + "cameras",
        data: {
          camera: camera,
        },
      });
      return 201;
    } catch (err) {
      console.log(err);
    }
  }

  static changeCamera(camera) {
    try {
      axios({
        method: "post",
        url: settingsURL,
        data: {
          campath: camera,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  static getCameras() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(settingsURL + "cameras");
        const data = res.data;
        resolve(
          data.map((cameras) => ({
            ...cameras,
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  static pushLock(lock) {
    try {
      axios({
        method: "post",
        url: settingsURL + "locks",
        data: {
          lock: lock,
        },
      });
      return 201;
    } catch (err) {
      console.log(err);
    }
  }

  static changeLock(lock) {
    try {
      axios({
        method: "post",
        url: settingsURL + "lock",
        data: {
          lockpath: lock,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  static getLock() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(settingsURL + "locks");
        const data = res.data;
        resolve(
          data.map((locks) => ({
            ...locks,
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default SettingsService;
