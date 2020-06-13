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
              <th>delete</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(user, idx) of users" :key="user.id">
              <td>{{ idx + 1 }}</td>
              <td>{{ user.name }}</td>
              <td v-if="!showImg">{{ user.regDate }}</td>
              <td v-if="!showImg">{{ user.time }}</td>
              <td>
                <img :src="src + user.name + '/' + '1.jpg'" />
              </td>
              <td>
                <button class="btn-small btn black" @click="deleteUser(user.id, user.name)">
                  <i class="material-icons">delete</i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="container">
      <paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      />
    </div>
  </div>
</template>

<script>
import loader from "@/components/loader";
import UsersService from "../users.js";
import Pagination from "@/mixins/usersPagination.js";
export default {
  name: "listofusers",
  data() {
    return {
      users: [],
      src: "http://localhost:8000/faces/",
      showImg: false,
      loading: false,
    };
  },
  mixins: [Pagination],
  components: {
    loader,
  },
  async mounted() {
    this.loading = true;
    this.users = await UsersService.getUsers();
    this.users = this.users.map((user) => ({
      name: user.name,
      regDate: user.regDate,
      time: user.time,
      id: user._id,
    }));
    this.loading = false;
  },
  methods: {
    deleteUser(userId, name) {
      UsersService.deleteUser(userId, name);
      this.$longMessage(`user named ${name} deleted`);
      this.users = this.users.filter((user) => user.id !== userId);
    },
  },
};
</script>
