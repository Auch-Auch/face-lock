import _ from "lodash";
export default {
  data() {
    return {
      page: 1,
      pageSize: 5,
      pageCount: 0,
      allPosts: [],
      items: []
    };
  },
  methods: {
    pageChangeHandler(page) {
      this.$router.push(`${this.$route.path}?page=${page}`);
      this.items = this.allPosts[this.page - 1] || this.allPosts[0];
    },
    setupPagination(allPosts) {
      this.allPosts = _.chunk(allPosts, this.pageSize);
      this.pageCount = _.size(this.allPosts);
      this.items = this.allPosts[this.page - 1] || this.allPosts[0];
    }
  }
};
