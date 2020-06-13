<template>
  <div>
    <div class v-if="!loading">
      <div class="container" v-if="!isCameraOpen">
        <div class="row">
          <div class="input-field col s10">
            <i class="material-icons prefix">assignment_ind</i>
            <input v-model="userName" type="text" id="autocomplete-input" class="autocomplete" />
            <label for="autocomplete-input">{{ "name" }}</label>
            <small
              class="helper-text invalid"
              v-if="this.users.indexOf(this.userName) != -1"
            >{{ `user name exists` }}</small>
          </div>
          <div
            class="col s2"
            v-if="
              this.userName.length > 3 &&
              this.users.indexOf(this.userName) === -1
            "
          >
            <a
              class="btn-floating btn-small waves-effect waves-light black"
              v-on:click="openCamera"
            >
              <i class="material-icons">add</i>
            </a>
          </div>
        </div>
      </div>
      <div v-show="isCameraOpen">
        <div class="container">
          <div class="row">
            <button
              class="btn waves-effect waves-light black input-field col s8"
              type="submit"
              @click="takeShot"
              id="download-btn"
            >Take a shot</button>
            <canvas id="faceCanvas" width="100" height="100"></canvas>
          </div>
        </div>
        <div class="webcam">
          <video
            class="webcam-video"
            ref="videoSrc"
            :width="videoWidth"
            :height="videoHeight"
            v-on:canplay="onSourceReady"
          >Your browser does not support this application.</video>
          <canvas ref="canvas" class="webcam-canvas" :width="videoWidth" :height="videoHeight"></canvas>
        </div>
      </div>
      <p class="msg">{{ msg }}</p>
    </div>
    <loader v-else />
  </div>
</template>

<script>
import getUserMedia from "getusermedia";
import UsersService from "../users.js";
import loader from "@/components/loader";
const publicPath = process.env.BASE_URL;
let cv = null;

export default {
  name: "app",
  components: {
    loader,
  },
  data() {
    return {
      videoWidth: 640,
      videoHeight: 480,
      stream: null,
      canvasCtx: null,
      faceClassifier: null,
      detectMat: null,
      videoCap: null,
      faceVect: null,
      processTimer: null,
      msg: "",
      roi_gray: null,
      faceCanvas: null,

      shots: 0,
      userName: "",
      isCameraOpen: false,
      users: [],
      loading: false,
      ifUserExists: false,
    };
  },
  methods: {
    startCamera() {
      const constraints = {
        audio: false,
        video: {
          width: {
            facingMode: "user",
            min: 640,
            ideal: 1280,
            max: 1920,
          },
          height: {
            min: 480,
            ideal: 720,
            max: 1080,
          },
        },
      };

      getUserMedia(constraints, (err, s) => {
        if (err) {
          this.setMsg("getUserMedia failed", "warn");
          console.warn(err);
          return;
        }
        if (this.isCameraOpen) {
          this.setMsg("getUserMedia success");
          this.stream = s;
          this.$refs.videoSrc.srcObject = s;
          this.$refs.videoSrc.play();
        }
      });
    },
    stopCamera() {
      if (!this.stream) return;
      this.setMsg("stopCamera");
      this.stopVideoProcessing();
      this.$refs.videoSrc.pause();
      this.$refs.videoSrc.srcObject = null;
      this.stream.getVideoTracks()[0].stop();
      this.stream = null;
    },
    onSourceReady() {
      this.setMsg("onSourceReady.");
      this.videoWidth = this.$refs.videoSrc.videoWidth;
      this.videoHeight = this.$refs.videoSrc.videoHeight;
      console.log(this.videoWidth, this.videoHeight);
      if (window.Module) {
        cv = window.Module;
        this.startVideoProcessing();
      } else {
        this.loadOpenCv();
      }
    },

    loadOpenCv() {
      if (!window.WebAssembly) {
        this.setMsg("Your web browser doesn't support WebAssembly.", "warn");
        return;
      }
      this.setMsg("loading OpenCv.js");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = "async";
      script.src = `${publicPath}libs/opencv.js`;
      document.body.appendChild(script);
      script.onload = () => {
        this.setMsg("OpenCV.js is loaded.");
      };

      window.Module = {
        wasmBinaryFile: `${publicPath}libs/opencv_js.wasm`, // for wasm mode
        preRun: () => {
          this.setMsg("loading haarcascade_frontalface_default.xml");
          window.Module.FS_createPreloadedFile(
            "/",
            "haarcascade_frontalface",
            `${publicPath}data/haarcascade_frontalface_default.xml`,
            true,
            false
          );
        },
        _main: () => {
          this.setMsg("OpenCV.js is ready.");
          cv = window.cv;
          // console.log(cv.getBuildInformation())
          this.startVideoProcessing();
        },
      };
    },

    startVideoProcessing() {
      this.setMsg("startVideoProcessing.");

      if (!this.stream) {
        this.setMsg("Please startup your webcam.", "warn");
        return;
      }
      this.canvasCtx = this.$refs.canvas.getContext("2d");
      this.faceClassifier = new cv.CascadeClassifier();
      this.faceClassifier.load("haarcascade_frontalface");
      this.srcMat = new cv.Mat(this.videoHeight, this.videoWidth, cv.CV_8UC4);
      this.detectMat = new cv.Mat();
      this.videoCap = new cv.VideoCapture(this.$refs.videoSrc);
      this.faceVect = new cv.RectVector();
      this.faceCanvas = document.getElementById("faceCanvas");
      console.log(this.name);

      this.processTimer = requestAnimationFrame(this.processVideo);
    },

    stopVideoProcessing() {
      cancelAnimationFrame(this.processTimer);

      if (this.faceClassifier && !this.faceClassifier.isDeleted()) {
        this.faceClassifier.delete();
      }
      this.srcMat.delete();
      this.detectMat.delete();
      this.faceVect.delete();
      this.canvasCtx.clearRect(0, 0, this.videoWidth, this.videoHeight);
    },

    processVideo() {
      if (!this.$refs.videoSrc) {
        this.setMsg("Video stream not found.", "warn");
        return;
      }

      this.videoCap.read(this.srcMat);
      cv.cvtColor(this.srcMat, this.detectMat, cv.COLOR_RGBA2GRAY, 0);

      cv.pyrDown(this.detectMat, this.detectMat);
      cv.pyrDown(this.detectMat, this.detectMat);
      this.faceClassifier.detectMultiScale(
        this.detectMat,
        this.faceVect,
        1.1,
        5,
        0
      );
      this.drawFace();

      this.processTimer = requestAnimationFrame(this.processVideo);
    },

    drawFace() {
      this.canvasCtx.clearRect(0, 0, this.videoWidth, this.videoHeight);
      for (let i = 0; i < this.faceVect.size(); ++i) {
        const rect = this.faceVect.get(i);
        let dsize = new cv.Size(100, 100);
        this.roi_gray = this.detectMat.roi(this.faceVect.get(i));
        cv.imshow("faceCanvas", this.roi_gray);
        let src = cv.imread("faceCanvas");
        cv.resize(src, this.roi_gray, dsize, 0, 0, cv.INTER_AREA);
        cv.imshow("faceCanvas", this.roi_gray);

        if (rect.width > 0 && rect.height > 0) {
          this.canvasCtx.lineWidth = 2;
          this.canvasCtx.strokeStyle = "green";
          this.canvasCtx.strokeRect(
            rect.x * 4,
            rect.y * 4,
            rect.width * 4,
            rect.height * 4
          );
        }
      }
    },

    async takeShot() {
      const imgURL = this.faceCanvas.toDataURL();
      console.log(imgURL);
      await UsersService.sendImg(imgURL, this.userName, this.shots);
      this.shots += 1;
      if (this.shots === 9) {
        this.$longMessage(`you added new user with name ${this.userName}`);
        this.userName = "";
        this.isCameraOpen = false;
        this.stopCamera();
      }
      this.$message("take another shot");
    },

    async openCamera() {
      this.startCamera();
      UsersService.createNewUser(this.userName);
      this.isCameraOpen = true;
    },
    setMsg(msg, type = "log") {
      this.msg = msg;
      console[type](msg);
    },
  },
  async mounted() {
    this.loading = true;
    this.users = await UsersService.getUsers();
    this.users = this.users.map((user) => user.name);
    this.loading = false;
  },

  beforeDestroy() {
    this.stopCamera();
  },
};
</script>
<style lang="less">
.btn {
  margin: 0px;
  padding: 5px 20px;
}
.webcam {
  position: relative;
  width: 50%;
  @media (max-width: 480px) {
    width: 75%;
  }
  height: auto;
  margin-left: auto;
  margin-right: auto;

  transform: rotateY(180deg);

  &-video {
    display: block;
    width: 100%;
    height: auto;
  }
  &-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
}
.msg {
  position: fixed;
  top: 0;
  right: 0;
  padding: 10px;
  text-align: right;
  background: rgba(255, 255, 255, 0.3);
  font-size: 20px;
}
</style>
