<template>
  <div>
    <div class="page-title">
      <h2>Home</h2>
    </div>
    <loader v-if="loading" />
    <div v-else>
      <div class="container">
        <div class="row">
          <form></form>
          <div class="col s11">
            <h6>Current camera: {{this.camera === "default" ? "default" : this.camera}}</h6>
          </div>
          <a
            class="btn-floating btn-small waves-effect waves-light black"
            v-show="!this.add"
            v-on:click="changeAdd"
          >
            <i class="material-icons">add</i>
          </a>
          <div v-show="this.add">
            <div class="input-field col s10">
              <input v-model="camera" type="text" id="autocomplete-input" class="autocomplete" />
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
        </div>
      </div>
      <camera :adress="this.camera" v-if="this.camera === '0'" />
      <ipCamera :adress="this.camera" v-else />
    </div>
  </div>
</template>

<script>
import PostService from "../posts";
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
      add: false,
      loading: false
    }
  },
  async mounted() {

    var elems = document.querySelectorAll("select");
    var instances = M.FormSelect.init(elems, {});
    this.loading = true
    try {
      const camera = await PostService.getSettings()
      this.camera = camera[0].campath
      console.log(this.camera)
      this.cameras = await PostService.getSettings()
      this.cameras = this.cameras[0].cameras
      console.log(this.cameras)
      this.loading = false
    } catch(e) {
      console.log(e)
    }
    
  },
  methods: {
    changeAdd() {
      
      this.add = !this.add
      
    },
    addCamera() {
      try { 
        PostService.pushCamera(this.camera)
        PostService.changeCamera(this.camera)
        this.camera = this.camera
        this.cameras.push(this.camera)
        this.add = !this.add
      } catch (e) {
        console.log(e)
      }
      
    },
    changeCamera(event) {
      try {
        this.camera = event.target.value
        PostService.changeCamera(event.target.value)
        this.$router.push(`?camera=${event.target.value}`)
        
        console.log(this.camera)
      } catch(e) {
        console.log(e)
      }
      
    }
  }
};
</script>
