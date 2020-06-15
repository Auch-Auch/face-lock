import axios from "axios";

const lengthURL = "http://localhost:5000/api/length/";
const postsURL = "http://localhost:5000/api/posts/";
const monthURL = "http://localhost:5000/api/posts/month/";
const faceRecognitionURL = "http://localhost:5000/api/face_recognition/";

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

  static createRecordImg(img, name) {
    try {
      axios({
        method: "post",
        url: postsURL + "img",
        data: {
          imgBase64: img,
          imgName: name,
        },
      });
      return 201;
    } catch (err) {
      console.log(err);
    }
  }
  static createNewRecord(name, confidence, imgName, access) {
    let data = [];
    data[0] = {
      name: name,
      confidence: confidence,
      day: new Date().toISOString().slice(0, 10),
      time: new Date().toISOString().slice(11, 19),
      access: access,
      imgName: imgName,
    };
    try {
      axios({
        method: "post",
        url: postsURL,
        data: data,
      });
      return 201;
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
      date: post.info[0].day ? post.info[0].day : "null",
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
