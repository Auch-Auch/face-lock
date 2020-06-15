<template>
  <div>
    <canvas ref="canvas" height="300" width="300"></canvas>
  </div>
</template>

<script>
import { Radar } from "vue-chartjs";
export default {
  name: "ChartRadar",
  extends: Radar,
  props: ["data"],
  mounted() {
    this.renderLineChart();
  },
  computed: {
    chartData: function() {
      return this.data;
    }
  },
  methods: {
    renderLineChart: function() {
      let labels = [' January', ' February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', ' December']
     this.renderChart({
      labels: labels,
      datasets: [
        {
          label: "THE LESS THE BETTER",
          data: this.data.map((c) => c.confidence),
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
    },
      {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
                left: 25,
                right: 25,
                top: 10,
                bottom: 10,
            },
        }
      }
    );      
    }
  },
  watch: {
    data: function() {
      this.renderLineChart();
    }
  }
};
</script>
