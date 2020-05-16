import axios from "axios";

const url1 = "http://localhost:5000/api/length/";
const url2 = "http://localhost:5000/api/posts/";

class PostService {
  static getPostsCount(name, date, access) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          url1 +
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
  static getPosts(skip, limit) {
    console.log(url2 + String(skip) + "/" + String(limit));
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url2 + String(skip) + "/" + String(limit));
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
  static getPostById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url2 + String(id));
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
    console.log(
      url2 +
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
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          url2 +
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
