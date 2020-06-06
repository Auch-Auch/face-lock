<template>
  <div class>
    <div class="page-title">
      <h2>Statistics</h2>
    </div>
    <form>
      <div class="container">
        <div class="row">
          <div class="input-field col s12">
            <select ref="select" @change="onChange($event)" v-model="curChart">
              <option value disabled selected>Types of charts</option>
              <option value="doughnut" data-icon>Doughnut(access and no access)</option>
              <option value="barLine" data-icon>Bar and Line(confidence range)</option>
              <option value="Radar" data-icon>Radar(max confidence)</option>
            </select>
          </div>
          <div class="input-field col s12" v-show="curChart === 'barLine'">
            <i class="material-icons prefix">access_time</i>
            <input
              type="text"
              id="datepicker-input"
              class="datepicker"
              @change="changeDataByDate"
              v-model.lazy="date"
            />
            <label for="datepicker-input"></label>
          </div>
        </div>
        <div class="input-field" v-if="curChart === 'doughnut'">
          <month-picker :show-year="false" @change="changeMonth"></month-picker>
        </div>
      </div>
    </form>
    <div v-if="curChart === 'barLine' && this.chartData.length">
      <ChartBar :data="this.chartData" />
      <ChartLine :data="this.chartData" />
    </div>
    <div v-else-if="curChart === 'barLine' && !this.chartData.length">
      <h5 class="center">there are no records on {{this.date}}</h5>
    </div>
    <div v-if="curChart === 'doughnut' && this.chartData.length">
      <ChartDoughnut :data="this.chartData" />
    </div>
    <div v-else-if="curChart === 'doughnut' && !this.chartData.length">
      <h5 class="center">there are no records</h5>
    </div>
    <div v-if="curChart === 'Radar' && this.chartData.length">
      <ChartRadar :data="this.chartData" />
    </div>
  </div>
</template>

<script>
import { MonthPicker } from "vue-month-picker";
import PostService from "../posts";
import ChartBar from "@/components/ChartBar";
import ChartLine from "@/components/ChartLine";
import ChartDoughnut from "@/components/ChartDoughnut";
import ChartRadar from "@/components/ChartRadar";
export default {
  name: "statistics",
  data() {
    return {
      date: this.$route.query.date || new Date().toISOString().slice(0, 10),
      curChart: this.$route.query.chart || "",
      month: this.$route.query.month || "",
      range: "",
      chartData: []
    };
  },
  components: {
    ChartBar,
    ChartLine,
    ChartDoughnut,
    MonthPicker,
    ChartRadar
  },
  async mounted() {
    var elems = document.querySelectorAll("select");
    var instances = M.FormSelect.init(elems, {});
    var elems = document.querySelectorAll(".datepicker");
    var instancesDate = M.Datepicker.init(elems, {
      format: "yyyy-mm-dd",
      autoClose: true,
      defaultDate: "now",
      showClearBtn: true
    }).toString();
    if (this.curChart === 'barLine') {
      this.changeData(this.date)
    } else if (this.curChart === 'doughnut'){
      this.changeData("any")
    }
  },
  methods: {
    async changeData(date) {
      this.chartData = await PostService.getPostsByTags(0, 0, "", date, "")
      this.chartData = await PostService.dataParser(this.chartData)
    },
    async changeDataByDate() {
      this.chartData = await PostService.getPostsByTags(0, 0, "", this.date, "")
      this.chartData = await PostService.dataParser(this.chartData)
      this.$router.push(`${this.$route.path}?chart=${this.curChart}&date=${this.date}`)
    },
    async changeMonth(date) {
      this.month = date.monthIndex;
      this.chartData = await PostService.getPostsByMonth(this.month)
      this.chartData = await PostService.dataParser(this.chartData)
      this.$router.push(`${this.$route.path}?chart=${this.curChart}&month=${this.month}`)
      console.log(this.month);
    },
    onChange(event) {
      this.curChart = event.target.value
      
      if (this.curChart === "doughnut") {
        this.changeData("any")
        this.$router.push(`${this.$route.path}?chart=${this.curChart}&month=${'any'}`)
      } else {
        this.changeData(this.date)
        this.$router.push(`${this.$route.path}?chart=${this.curChart}&date=${this.date}`)
      }
    },
  },
};
</script>
