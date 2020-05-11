import _ from "lodash";
import PostService from "../posts";
export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      pageCount: 1,
      posts: [],
      items: [],
      name: "",
      date: "",
      access: "",
    };
  },
  methods: {
    async pageChangeHandler(page) {
      this.$router.push(`${this.$route.path}?page=${page}`);
      this.posts = await PostService.getPostsByTags(
        (page - 1) * 10,
        this.pageSize,
        this.name,
        this.date,
        this.access
      );
      this.posts = PostService.dataParser(this.posts);
      this.items = this.posts;
    },
    setupPagination(postsCount, allPosts, name, date, access) {
      this.page = 1;
      this.name = name;
      this.date = date;
      this.access = access;
      this.posts = allPosts;
      this.pageCount = Math.ceil(postsCount / this.pageSize);
      this.items = allPosts;
    },
  },
};
