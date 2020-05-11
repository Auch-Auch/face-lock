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
            String(name || 0) +
            "/" +
            String(date || 0) +
            "/" +
            String(access || 0)
        );
        const data = res.data;
        resolve(Number(data));
      } catch (err) {
        reject(err);
      }
    });
  }
  static getPosts(skip, limit) {
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
  static getPostsByTags(skip, limit, name, date, access) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          url2 +
            String(name || 0) +
            "/" +
            String(date || 0) +
            "/" +
            String(access || 0) +
            "/" +
            String(skip || 0) +
            "/" +
            String(limit || 0)
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
