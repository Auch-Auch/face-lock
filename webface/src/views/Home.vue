<template>
  <div>
    <div class="page-title">
      <h2>Home</h2>
    </div>
    <loader v-if="loading" />
    <div v-else>
      <div class="container">
        <div class="row">
          <div class="col s11">
            <h6>Current camera: {{this.camera === "default" ? "default" : this.camera}}</h6>
          </div>
          <a
            class="btn-floating btn-small waves-effect waves-light black"
            v-show="!this.addCam"
            v-on:click="changeAdd"
          >
            <i class="material-icons">add</i>
          </a>
          <div v-show="this.addCam">
            <div class="input-field col s10">
              <input v-model="camera" type="text" id="autocomplete-camera" class="autocomplete" />
              <label for="autocomplete-input"></label>
            </div>
            <div class="col s2">
              <a
                class="btn-floating btn-small waves-effect waves-light black"
                v-on:click="addCamera"
              >
                <i class="material-icons">add</i>
              </a>
            </div>
          </div>
          <div class="input-field col s12 select">
            <select @change="changeCamera($event)" ref="select" class="browser-default">
              <option value disabled selected>Cameras</option>
              <option v-for="camera in cameras" :key="camera" v-bind:value="camera">{{camera}}</option>
            </select>
          </div>
          <div class="col s11">
            <h6>Current lock: {{this.lock === "default" ? "default" : this.lock}}</h6>
          </div>
          <a
            class="btn-floating btn-small waves-effect waves-light black"
            v-show="!this.addLock"
            v-on:click="changeAddLock"
          >
            <i class="material-icons">add</i>
          </a>
          <div v-show="this.addLock">
            <div class="input-field col s10">
              <input v-model="lock" type="text" id="autocomplete-input" class="autocomplete" />
              <label for="autocomplete-input"></label>
            </div>
            <div class="col s2">
              <a
                class="btn-floating btn-small waves-effect waves-light black"
                v-on:click="addLockToDataBase"
              >
                <i class="material-icons">add</i>
              </a>
            </div>
          </div>
          <div class="input-field col s12 select">
            <select @change="changeLock($event)" ref="select2" class="browser-default">
              <option value disabled selected>locks</option>
              <option v-for="lock_ in locks" :key="lock_" v-bind:value="lock_">{{lock_}}</option>
            </select>
          </div>
        </div>
      </div>
      <camera :lock="this.lock" :adress="this.camera" v-if="this.camera === '0'" />
      <ipCamera :lock="this.lock" :adress="this.camera" v-else />
    </div>
  </div>
</template>

<script>
import SettingsService from "../settings.js";
import loader from "@/components/loader";
import camera from "@/components/camera";
import ipCamera from "@/components/ipCamera";
export default {
  name: "home",
  components: {
    loader,
    camera,
    ipCamera
  },
 
  data() {
    return {
      camera: 'default',
      cameras: [],
      addCam: false,
      addLock: false,
      loading: false,
      lock: 'default',
      locks: [],
    }
  },
  async mounted() {

    var elems = document.querySelectorAll("select");
    var instances = M.FormSelect.init(elems, {});
    this.loading = true
    try {
      const settings = await SettingsService.getSettings()
      this.camera = settings[0].campath
      this.cameras = settings[0].cameras
      this.locks = settings[0].locks
      this.lock = settings[0].lockpath
      console.log(this.lock, this.camera)
      this.loading = false
    } catch(e) {
      console.log(e)
    }
    
  },
  methods: {
    changeAddLock() {
      this.addLock = !this.addLock
    },
    changeAdd() {
      
      this.addCam = !this.addCam
      
    },
    addCamera() {
      try { 
        SettingsService.pushCamera(this.camera)
        SettingsService.changeCamera(this.camera)
        this.camera = this.camera
        this.cameras.push(this.camera)
        this.addCam = !this.addCam
      } catch (e) {
        console.log(e)
      }
      
    },
    changeCamera(event) {
      try {
        this.camera = event.target.value
        SettingsService.changeCamera(event.target.value)
        this.$router.push(`?camera=${event.target.value}&lock=${this.lock}`)
        
        console.log(this.camera)
      } catch(e) {
        console.log(e)
      }
      
    },
     addLockToDataBase() {
      try { 
        SettingsService.pushLock(this.lock)
        SettingsService.changeLock(this.lock)
        this.lock = this.lock
        this.locks.push(this.lock)
        this.addLock = !this.addLock
      } catch (e) {
        console.log(e)
      }
      
    },
    changeLock(event) {
      try {
        this.lock = event.target.value
        SettingsService.changeLock(event.target.value)
        this.$router.push(`?camera=${this.camera}&lock=${event.target.value}`)
        console.log(this.lock)
      } catch(e) {
        console.log(e)
      }
      
    }
  }
};
</script>
