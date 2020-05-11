<template>
  <div class="">
    <div class="page-title">
      <h2>Statistics</h2>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import PostService from "../posts";
import Chart1 from "@/components/Chart1";
import Chart2 from "@/components/Chart2";
export default {
  name: "statistics",
  extends: Bar,
  data() {
    return {
      posts: [],
    };
  },
  components: {
    Chart1,
    Chart2,
  },
  async mounted() {
    this.posts = await PostService.getPosts(0, 0);
    this.posts = PostService.dataParser(this.posts);
    this.renderChart({
      labels: this.posts.map((t) => t.time),
      datasets: [
        {
          label: "THE LESS THE BETTER",
          data: this.posts.map((c) => c.confidence),
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });
  },
};
</script>
