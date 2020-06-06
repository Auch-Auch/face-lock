<template>
  <div>
    <div class="container" v-if="this.whatOpen === 'add'">
      <div class="row">
        <div class="input-field col s10">
          <i class="material-icons prefix">assignment_ind</i>
          <input v-model="name" type="text" id="autocomplete-input" class="autocomplete" />
          <label for="autocomplete-input">{{ "name"}}</label>
        </div>
        <div class="col s2">
          <a class="btn-floating btn-small waves-effect waves-light black" v-on:click="openCamera">
            <i class="material-icons">add</i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "addUser",
  data() {
    return {
      whatOpen: this.$route.query.pagee || "add",
      name: "",
      
    }
  },
  components: {
    
  },
  methods: {
    openCamera() {
      this.$router.push(`/users/?page=camera`)
      this.whatOpen = 'camera'
    }
  },
  mounted() {
    
  }
  
}
</script>
