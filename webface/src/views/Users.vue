<template>
  <div>
    <div class="page-title">
      <h2>History</h2>
    </div>
    <div class="container">
      <div class="row">
        <div class="input-field col s12">
          <select ref="select" @change="onChange($event)">
            <option value disabled selected>what do you want?</option>
            <option value="list">list of users</option>
            <option value="add">add new user</option>
          </select>
        </div>
      </div>
    </div>
    <addUser v-if="component === 'add'" />

    <listofusers v-else-if="component === 'list'" />
  </div>
</template>
<script>
import loader from "@/components/loader";
import addUser from "@/components/addUser";
import listofusers from "@/components/listofusers";
export default {
  name: "users",
  components: {
    addUser,
    listofusers,
    loader,
    
  },
  data() {
    return {
      component: this.$route.query.page || null,
      loading: false
    }
  },
  mounted() {
    var elems = document.querySelectorAll("select");
    var instances = M.FormSelect.init(elems, {});
  },
  methods: {
    onChange(evt) {
      if (evt.target.value === "list") {
        this.component = "list"
        this.$router.push(`/users/?page=list`)
      } else{
        
        this.component = "add"  
        this.$router.push(`/users/?page=add`)
      } 
    },
  }
};
</script>
