<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="input-field col s12 select">
          <button
            v-if="!this.videoCap"
            v-on:click="startDetecting"
            class="btn waves-effect waves-light black input-field col s12"
          >
            start recognition
            <i class="material-icons right"></i>
          </button>
          <button
            v-else
            v-on:click="stopDetecting"
            class="btn waves-effect waves-light black input-field col s12"
          >
            stop recognition
            <i class="material-icons right"></i>
          </button>
        </div>
        <div class="col s5">
          <div class="container">
            <div class="row" v-show="this.videoCap">
              <div class="col">{{ this.data ? "Who are you?" : "" }}</div>
              <div class="col">
                <canvas id="faceCanvas" width="100" height="100"></canvas>
              </div>
            </div>
          </div>
        </div>
        <div class="col s3">
          <div class="container">
            <div class="row" v-show="this.videoCap">
              <div class="col s12"></div>
              <div class="col s12 m4 l8" v-show="this.data">
                {{
                this.data
                ? Number(this.data.confidence).toFixed(2).toString()
                : ""
                }}
                <i
                  class="medium material-icons"
                >trending_flat</i>
              </div>
              <div class="col s12"></div>
            </div>
          </div>
        </div>
        <div class="col s3">
          <div class="container">
            <div class="row" v-show="this.videoCap">
              <div class="col s12">{{ this.data ? this.data.name : "" }}</div>
              <div class="col s12">
                <canvas id="registeredPhoto" width="100" height="100"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
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
</template>

<script>
import getUserMedia from "getusermedia";
import PostService from "../posts";

const publicPath = process.env.BASE_URL;
let cv = null;

export default {
  name: "camera",
  props: ["adress"],
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
      faceRecognizer: null,
      processTimer: null,
      msg: "",
      roi_gray: null,
      faceCanvas: null,
      shots: 0,
      data: null,
      src: "http://10.10.10.2:8000/faces/",
      registeredPhoto: null,

      isCameraOpen: false,

      camera: null,
      newImg: null,
    };
  },
  methods: {
    startCamera() {
      const constraints = {
        audio: false,
        video: {
          width: {
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

        this.setMsg("getUserMedia success");
        this.stream = s;
        this.$refs.videoSrc.srcObject = s;
        this.$refs.videoSrc.play();
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
      this.newImg = new Image();
      this.registeredPhoto = document.getElementById("registeredPhoto");
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
        let srcFace = cv.imread("faceCanvas");
        cv.resize(srcFace, this.roi_gray, dsize, 0, 0, cv.INTER_AREA);
        cv.imshow("faceCanvas", this.roi_gray);
        this.predict();
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
    async predict() {
      const imgURL = this.faceCanvas.toDataURL();
      this.data = await PostService.predict(imgURL);
      this.newImg.src = this.src + this.data.name + "/" + "1.jpg";
      let ctx = this.registeredPhoto.getContext("2d");
      ctx.drawImage(this.newImg, 0, 0);
    },
    setMsg(msg, type = "log") {
      this.msg = msg;
      console[type](msg);
    },
    startDetecting() {
      this.startCamera();
    },
    stopDetecting() {
      this.stopCamera()
      this.videoCap = null
    }
  },
  beforeDestroy() {
    this.stopCamera();
  },
   beforeRouteUpdate() {
    this.stopCamera();
  },
};
</script>
<style lang="less">
.btn {
  margin: 20px;
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
