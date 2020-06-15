import _ from "lodash";
import PostService from "../posts";
export default {
  data() {
    return {
      page: +this.$route.query.page || 1,
      pageSize: 5,
      pageCount: 1,
      posts: [],
      items: [],
      name: "",
      date: new Date().toISOString().slice(0, 10),
      access: "",
    };
  },
  methods: {
    async pageChangeHandler(page) {
      this.$router.push(
        `${this.$route.path}?page=${this.page}&name=${
          this.name || "any"
        }&date=${this.date || "any"}&access=${this.access || "any"}`
      );
      this.posts = await PostService.getPostsByTags(
        (page - 1) * this.pageSize,
        this.pageSize,
        this.name,
        this.date,
        this.access
      );
      this.posts = PostService.dataParser(this.posts);
      this.items = this.posts;
    },
    setupPagination(page, postsCount, allPosts, name, date, access) {
      this.page = page;
      name === "any" ? (this.name = "") : (this.name = name);
      date === "any" ? (this.date = "") : (this.date = date);
      access === "any" ? (this.access = "") : (this.access = access);
      this.posts = allPosts;
      this.pageCount = Math.ceil(postsCount / this.pageSize);
      this.items = allPosts;
    },
  },
};
