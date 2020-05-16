<template>
  <div>
    <div class="page-title">
      <h2>History</h2>
    </div>
    <form class="form" @submit.prevent="submitHandler">
      <div class="container">
        <div class="input-field col s12">
          <i class="material-icons prefix">assignment_ind</i>
          <input v-model="name" type="text" id="autocomplete-input" class="autocomplete" />
          <label
            for="autocomplete-input"
          >{{this.$route.query.name === 'any' || !this.name ? "name" : ""}}</label>
        </div>
        <div class="input-field col s12">
          <i class="material-icons prefix">access_time</i>
          <input type="text" id="datepicker-input" class="picker" v-model.lazy="date" />
          <label
            for="datepicker-input"
          >{{this.$route.query.date === 'any' || !this.date ? "pick date" : ""}}</label>
        </div>
        <div class="input-field col s12">
          <select ref="select" v-model="access">
            <option value disabled selected>Choose a access</option>
            <option value="true">access</option>
            <option value="false">no access</option>
          </select>
        </div>
        <button class="btn waves-effect waves-light black" type="submit">
          search
          <i class="material-icons right">send</i>
        </button>
      </div>
    </form>
    <loader v-if="loading" />

    <h5 class="center" v-else-if="!items.length">there are no such records</h5>

    <section class="selection-chart" v-else>
      <HistoryTable :posts="items" />

      <paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      />
    </section>
  </div>
</template>

<script>
import loader from "@/components/loader";
import Pagination from "@/mixins/pagination";
import HistoryTable from "@/components/HistoryTable";
import PostService from "../posts";
export default {
  name: "history",
  mixins: [Pagination],
  components: {
    HistoryTable,
    loader,
  },
  data() {
    return {
      posts: [],
      postsCount: 0,
      error: "",
      text: "0",
      loading: true,
      skip: 0,
      limit: 5,
      name: "",
      access: "",
      date: "",
    };
  },
  async mounted() {
    const self = this;
    var elems = document.querySelectorAll("select");
    var instances = M.FormSelect.init(elems, {});
    var elems = document.querySelectorAll(".datepicker");
    var instancesDate = M.Datepicker.init(elems, {
      format: "yyyy-mm-dd",
      autoClose: true,
      defaultDate: "now",
      showClearBtn: true,
      startView: "years",
    }).toString();
    try {
      const page = +this.$route.query.page
      const name = this.$route.query.name
      const date = this.$route.query.date
      const access = this.$route.query.access
      this.postsCount = await PostService.getPostsCount(name, date, access);
      this.posts = await PostService.getPostsByTags((page - 1) * this.limit, 
      this.limit, name, date, access);
      this.posts = PostService.dataParser(this.posts);
      this.setupPagination(
        page,
        this.postsCount,
        this.posts,
        name,
        date,
        access
        );
      this.loading = false;
    } catch (err) {}
  },
  methods: {
    async submitHandler(event) {
      this.loading = true
      this.page = 1
      this.posts = await PostService.getPostsByTags(
        this.skip,
        this.limit,
        this.name,
        this.date,
        this.access
      );
      this.posts = PostService.dataParser(this.posts);
      this.postsCount = await PostService.getPostsCount(this.name, this.date, this.access);
      this.$router.push(
        `${this.$route.path}?page=${this.page}&name=${this.name || "any"}&date=${this.date || "any"}&access=${this.access || "any"}`
      );
      this.setupPagination(
        this.page, this.postsCount, this.posts, this.name, this.date, this.access
        );
      this.loading = false
      
    },
  },
};
</script>
