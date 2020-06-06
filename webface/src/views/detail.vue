<template>
  <div>
    <loader v-if="loading" />
    <div v-else-if="posts">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">История</router-link>
        <a class="breadcrumb">{{this.posts[0].id}}</a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div class="card" :class="[this.posts[0].typeClass]">
            <div class="card-content white-text">
              <p>Time: {{ this.posts[0].time }}</p>
              <p>Confidence: {{this.posts[0].confidence}}</p>
            </div>
          </div>
        </div>
      </div>
      <img class="images" :src="this.src + this.posts[0].imgName + '.jpg'" />
    </div>

    <p class="center" v-else>there is no such record</p>
  </div>
</template>

<script>
import loader from "@/components/loader";
import PostService from "../posts";
export default {
    name: 'detail',
    components: {
      loader,
    },
    data() {
        return {
            loading: true,
            posts: "",
            src: 'http://10.10.10.2:8000/images/'
        }
    },
    async mounted() {
      this.posts = await PostService.getPostById(this.$route.params.id);
      this.posts = await PostService.dataParser(this.posts);
      this.loading = false
    }
    
}

</script>
