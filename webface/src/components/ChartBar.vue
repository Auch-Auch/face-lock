<template>
  <div>
    <canvas ref="canvas" height="300" width="300"></canvas>
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
export default {
  name: "ChartBar",
  extends: Bar,
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
     const data = this.data
     this.renderChart({
      labels: this.data.map((t) => t.time + " / " + t.name),
      datasets: [
        {
          label: "THE LESS THE BETTER",
          data: this.data.map((c) => c.confidence),
          borderWidth: 1,
          backgroundColor: function(context) {
            if (data[context.dataIndex].access) 
              return "green"
           return "red" 
          }
        },
      ],
    },
      {
        maintainAspectRatio: false,
        responsive: true,
        layout: {
          padding: {
                left: 20,
                right: 25,
                top: 10,
                bottom: 10,
            },
        },
        title: {
            display: true,
            text: 'Visits per day per for ' + this.monthName
          },
        'onClick' : (evt, item) => {
          const index = item[0]._index
          this.$router.push('/detail/' + data[index].id)

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
