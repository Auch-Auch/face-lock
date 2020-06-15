<template>
  <div class>
    <div class>
      <div class="container">
        <div class="row">
          <div class="input-field col s12">
            <button
              v-if="!this.newFrame"
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

          <h5 v-show="!this.newFrame">{{this.error}}</h5>
          <div class="col s5">
            <div class="container">
              <div class="row">
                <div class="col">{{ this.confidence ? "Who are you?" : "" }}</div>
                <div class="col">
                  <canvas id="faceCanvas" width="100" height="100"></canvas>
                </div>
              </div>
            </div>
          </div>
          <div class="col s3">
            <div class="container">
              <div class="row">
                <div class="col s12">
                  {{
                  this.confidence
                  ? Number(this.confidence).toFixed(2).toString()
                  : ""
                  }}
                </div>
                <div class="col s12 m4 l8">
                  <i v-show="this.confidence" class="medium material-icons">trending_flat</i>
                </div>
                <div class="col s12"></div>
              </div>
            </div>
          </div>
          <div class="col s3">
            <div class="container">
              <div class="row">
                <div
                  class="col s12"
                >{{ this.name && Number(this.confidence).toFixed(2) > 130 ? unknown : this.name }}</div>
                <div class="col s12">
                  <canvas id="registeredPhoto" width="100" height="100"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="webcam">
        <canvas id="canvas-video" width="640" height="480"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import getUserMedia from "getusermedia";
import PostService from "../posts";
import io from "socket.io-client";
const publicPath = process.env.BASE_URL;
var socket = io.connect("ws://localhost:3000");
export default {
  name: "ipCamera",
  props: ['adress'],
  data() {
    return {
     
      src: "http://localhost:8000/faces/",
      registeredPhoto: null,
      faceCtx: null,
      faceCanvas: null,
      isCameraOpen: false,
      videoCtx: null,
      videoCanvas: null,
      newFace: null,
      newFrame: null,
      photoCtx: null,
      registeredPhoto: null,
      photo: null,
      error: null,
      unknown: 'unknown',
      name: null,
      confidence: null,
      timer: 0,
    };
  },
 
  methods: {
    getFaceFromSocket() {
      socket.on('face', (data) => {
      this.name = data.name
      this.confidence = data.confidence
      let uint8Arr = new Uint8Array(data.buffer);
      let str = String.fromCharCode.apply(null, uint8Arr);
      let base64String = btoa(str);
      
      this.newFace = new Image()
      this.photo = new Image()
      this.newFace.onload = () => {
        this.faceCtx.drawImage(this.newFace, 0, 0);
      }
      this.newFace.src = 'data:image/png;base64,' + base64String;
      this.photo.src = this.src + this.name + '/' + '1.jpg'
      this.photoCtx.drawImage(this.photo, 0, 0)
      let imgName =
            new Date().toISOString().slice(0, 10) +
            new Date().toISOString().slice(11, 19);
      let newImg = this.videoCanvas.toDataURL()
      if (this.confidence < 120 && this.timer < Date.now()) {
        this.$message(`user ${this.name} detected`)
        PostService.createNewRecord(this.name, this.confidence.toFixed(2), imgName, true)
        PostService.createRecordImg(newImg, imgName)
        this.timer = Date.now() + 1000
      } 
      if (this.confidence > 120 && this.timer < Date.now()) {
        this.$message(`unknown`)
        PostService.createNewRecord('unknown', this.confidence.toFixed(2), imgName, true)
        PostService.createRecordImg(newImg, imgName)
        this.timer = Date.now() + 1000
      }
      
        
      
      
      
      });
    },

    getVideoFromSocket() {
      socket.on('frame', (data) => {
      let uint8Arr = new Uint8Array(data.buffer);
      let str = String.fromCharCode.apply(null, uint8Arr);
      let base64String = btoa(str);

      this.newFrame = new Image()
      this.newFrame.onload = () => {
        this.videoCtx.drawImage(this.newFrame, 0, 0)
      }
      this.newFrame.src = 'data:image/png;base64,' + base64String;
    });
   
  },
  startDetecting() {
    socket.connect("ws://localhost:3000");
    socket.emit('startDetecting', {action: "start", adress: this.adress})
    this.getVideoFromSocket()
    this.getFaceFromSocket()
    socket.on("error", (data) => {
      this.error = data.error
    })
  },
  stopDetecting() {
    socket.emit('startDetecting', {action: "stop", adress: this.adress})
    socket.disconnect(0)
    this.faceCtx.clearRect(0, 0, 100, 100)
    this.videoCtx.clearRect(0, 0, 640, 480)
    this.photoCtx.clearRect(0, 0, 100, 100)
    this.newFrame = null
    this.confidence = null
    this.name = null
    

  }

 },

 mounted() {
      this.videoCanvas = document.getElementById('canvas-video')
      this.videoCtx = this.videoCanvas.getContext('2d')
      this.faceCanvas = document.getElementById("faceCanvas")
      this.faceCtx = this.faceCanvas.getContext("2d")
      this.registeredPhoto = document.getElementById("registeredPhoto")
      this.photoCtx = this.registeredPhoto.getContext("2d")
 },

 beforeDestroy() {
   socket.emit('startDetecting', {action: "stop"})
   

 },
 beforeRouteUpdate() {
   socket.emit('startDetecting', {action: "stop"})
   socket.disconnect(0)
  },

}
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
    width: 100%;
  }
  height: auto;
  margin: auto;
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
