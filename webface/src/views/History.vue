<template>
  <div>
    <div class="page-title">
      <h2>History</h2>
    </div>
    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>
    <loader v-if="loading" />
    <section class="selection-chart" v-else>
      <HistoryTable :posts="items" />

      <paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'waves-effect waves-black darken-4'"
      />
    </section>
  </div>
</template>

<script>
import loader from "@/components/loader";
import Pagination from "@/mixins/pagination";
import HistoryTable from "@/components/HistoryTable";
import PostService from "../posts";
import { Bar } from "vue-chartjs";
export default {
  name: "history",
  extends: Bar,
  mixins: [Pagination],
  components: {
    HistoryTable,
    loader
  },
  data() {
    return {
      posts: [],
      error: "",
      text: "",
      loading: true,
    };
  },
  async mounted() {
    try {
      this.posts = await PostService.getPosts();
      console.log(this.posts)
      this.setup();
      this.loading = false;
      console.log();
    } catch (err) {}
  },
  methods: {
    statisticF() {
      i = 0
      while (this.posts[i].time.slice(0, 10) == this.posts[i + 1].time.slice(0, 10)) {
        i += 1
      }
      console.log(i)
    },
    setup() {
      
      this.posts = this.posts.map(post => ({
        id: post._id,
        time: post.info[0].time,
        confidence: +post.info[0].confidence,
        name: post.info[0].name,
        access: post.info[0].access,
        typeClass: post.info[0].access ? "green" : "red"
      }));
      console.log(this.posts)
      this.setupPagination(this.posts.reverse());
      this.renderChart({
        labels: this.posts.map(d => d.time),
        datasets: [
          {
            label: "THE LESS THE BETTER",
            data: this.posts.map(a => a.accuracy),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      });
    }
  }
};
</script>
