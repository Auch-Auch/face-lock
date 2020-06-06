import axios from "axios";

const lengthURL = "http://10.10.10.2:5000/api/length/";
const postsURL = "http://10.10.10.2:5000/api/posts/";
const monthURL = "http://10.10.10.2:5000/api/posts/month/";
const settingsURL = "http://10.10.10.2:5000/api/settings/";
const usersURL = "http://10.10.10.2:5000/api/users/";
const uploadURL = "http://10.10.10.2:5000/api/upload/";
const faceRecognitionURL = "http://10.10.10.2:5000/api/face_recognition/";

class PostService {
  static getPostsCount(name, date, access) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          lengthURL +
            "/" +
            String(name || "any").trim() +
            "/" +
            String(date || "any").trim() +
            "/" +
            String(access || "any").trim()
        );
        const data = res.data;
        resolve(Number(data));
      } catch (err) {
        reject(err);
      }
    });
  }

  static getPostById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(postsURL + String(id));
        const data = res.data;
        resolve(
          data.map((post) => ({
            ...post,
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }
  static getPostsByMonth(month) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(monthURL + String(month));
        const data = res.data;
        resolve(
          data.map((post) => ({
            ...post,
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }
  static getPostsByTags(skip, limit, name, date, access) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          postsURL +
            String(name || "any").trim() +
            "/" +
            String(date || "any").trim() +
            "/" +
            String(access || "any").trim() +
            "/" +
            String(skip || "any").trim() +
            "/" +
            String(limit || "any").trim()
        );
        const data = res.data;
        resolve(
          data.map((post) => ({
            ...post,
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }
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

  static getUsers() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(usersURL);
        const data = res.data;
        resolve(
          data.map((users) => ({
            ...users,
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  static createNewUser(name) {
    try {
      axios({
        method: "post",
        url: usersURL,
        data: {
          name: name,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  static sendImg(img, name, id) {
    console.log(img);
    try {
      axios({
        method: "post",
        url: faceRecognitionURL + "newuser",
        data: {
          imgBase64: img,
          id: id,
          name: name,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  static predict(img) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: "post",
          url: faceRecognitionURL + "predict",
          data: {
            imgBase64: img,
          },
        });
        const data = res.data;
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }

  static dataParser(Allposts) {
    const posts = Allposts.map((post) => ({
      id: post._id,
      date: post.info[0].day,
      time: post.info[0].time,
      imgName: post.info[0].imgName,
      confidence: post.info[0].confidence,
      name: post.info[0].name,
      access: post.info[0].access,
      typeClass: post.info[0].access ? "green" : "red",
    }));
    return posts;
  }
}

export default PostService;
