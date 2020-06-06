<template>
  <div>
    <loader v-if="loading" />
    <div class="container" v-else>
      <div id="target" class="row">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>date of registration</th>
              <th>time</th>
              <th>registered photo</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(user, idx) of users" :key="user.id">
              <td>{{idx + 1}}</td>
              <td>{{user.name}}</td>
              <td v-if="!showImg">{{user.regDate}}</td>
              <td v-if="!showImg">{{user.time}}</td>
              <td>
                <img :src="src + user.name + '/' + '1.jpg'" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script>
import loader from "@/components/loader";
import PostService from "../posts";
export default {
  name: "listofusers",
  data() {
    return {
      users: [],
      src: 'http://10.10.10.2:8000/faces/',
      showImg: false,
      loading: false,
    }
  },
  components: {
    loader,
  },
  async mounted() {
    this.loading = true
    this.users = await PostService.getUsers()
    this.users = this.users.map((user) => ({
      name: user.name,
      regDate: user.regDate,
      time: user.time,
      id: user._id
    }))
    this.loading = false
  },
  methods: {

  }
}
</script>
