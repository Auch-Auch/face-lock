<template>
  <div>
    <canvas ref="canvas" height="300" width="300"></canvas>
  </div>
</template>

<script>
import { Doughnut } from "vue-chartjs";
export default {
  name: "ChartDoughnut",
  extends: Doughnut,
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
     let data = []
     let access = this.data.map(i => i.access)
     data.push(access.reduce((total, item) => item ? total += 1 : total))
     data.push(access.length - data[0])
     this.renderChart({
      labels: ["access", "no access"],
      datasets: [
        {
          label: "THE LESS THE BETTER",
          data: data,
          borderWidth: 1,
          backgroundColor: [
            "green",
            "red"
          ],
          borderColor: [
            "green",
            "red"
          ],
        },
      ],
    },
      {
        maintainAspectRatio: false,
        'onClick' : (evt, item) => {
          console.log(item[0]._view.borderColor)
          item[0]._view.borderColor === 'rgb(0, 117, 0)' ? 
          this.$router.push(`/history/?page=${1}&name=any&date=any&access=true`) :
          this.$router.push(`/history/?page=${1}&name=any&date=any&access=false`)

        },
      },
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
