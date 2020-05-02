<template>
  <div>
    <div >
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">История</router-link>
        <a class="breadcrumb">
          {{this.$route.params.id}}
        </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div class="card">
            <div class="card-content white-text">
            </div>
          </div>
        </div>
      </div>
    </div>
    <p class="center"> </p>
    <div id="app">
        <img class='images' :src="this.src + this.$route.params.id + '.jpg'" />
    </div>
  </div>

</template>

<script>
export default {
    name: 'detail',
    data() {
        return {
            posts: [],
            src: 'http://localhost:8080/'
        }
    },
    
}

</script>