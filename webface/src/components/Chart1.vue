<template>
    <div> 
       <div class="history-chart">
          <canvas ref="canvas"></canvas>
      </div>
    </div>
</template>

<script>
export default {
    name: "Chart1",
    extends: Bar,
    props: ['posts'],
    async mounted() {
        this.renderChart({labels: posts.map(t => t.time),
        datasets: [
          {
            label: "THE LESS THE BETTER",
            data: posts.map(c => c.confidence),
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
        ]})
    }
}
</script>