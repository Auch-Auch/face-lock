import axios from "axios";

const usersURL = "http://localhost:5000/api/users/";
const faceRecognitionURL = "http://localhost:5000/api/face_recognition/";

class UsersService {
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
  static deleteUser(userId, name) {
    try {
      axios({
        method: "delete",
        url: faceRecognitionURL + "delete" + "/" + "user",
        data: {
          id: userId,
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
}

export default UsersService;
