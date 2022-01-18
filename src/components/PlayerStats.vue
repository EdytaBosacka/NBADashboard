<template>
  <h1>{{ $route.params.name }}</h1>
  <div class="slider">
    <vue-slider
      v-model="sliderValues"
      :width="300"
      :height="8"
      :minRange="1"
      :min="2000"
      :max="2021"
      :enable-cross="false"
      :lazy="true"
      :marks="
        (value) => (value % 5 === 0 ? { labelStyle: { color: '#ccc' } } : false)
      "
      :process-style="{ backgroundColor: '#003366' }"
      :tooltip-style="{ backgroundColor: '#003366', borderColor: '#9fbbd1' }"
      @change="(value, index) => this.getPlayerStats(value[0], value[1])"
    >
      <template v-slot:dot="{}">
        <div :class="['custom-dot']"><span>🏀</span></div>
      </template>
    </vue-slider>
  </div>
  <div class="playerDashboard">
    <div class="chart left">
      <BarChart
        :chartData="leftChartData"
        :options="leftChartOptions"
        :styles="myStyles"
      />
    </div>
    <div class="chart right">
      <LineChart
        :chartData="rightChartData"
        :options="rightChartOptions"
        :styles="myStyles"
      />
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";
import { BarChart, LineChart } from "vue-chart-3";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

export default defineComponent({
  name: "PlayerStats",
  components: {
    BarChart,
    LineChart,
    VueSlider,
  },
  data() {
    return {
      gamesPlayed: [] as number[],
      points: [] as number[],
      assists: [] as number[],
      steals: [] as number[],
      blocks: [] as number[],
      seasons: [] as number[],
      leftChartData: { labels: [] as any[], datasets: [] as any[] },
      rightChartData: { labels: [] as any[], datasets: [] as any[] },
      leftChartOptions: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Games in a season",
          fontSize: 20,
          fontColor: "#003366",
        },
      },
      rightChartOptions: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: "bottom",
        },
        title: {
          display: true,
          text: "Average stats in a season",
          fontSize: 20,
          fontColor: "#003366",
        },
      },
      myStyles: {
        height: "100%",
        width: "100%",
        position: "relative",
      },
      sliderValues: [2011, 2021] as number[],
    };
  },
  methods: {
    async getPlayerStats(seasonStart: number, seasonEnd: number) {
      this.leftChartData.labels = [];
      this.leftChartData.datasets = [];
      this.rightChartData.labels = [];
      this.rightChartData.datasets = [];
      this.gamesPlayed = [];
      this.seasons = [];
      this.points = [];
      this.assists = [];
      this.steals = [];
      this.blocks = [];
      let i: number;
      for (i = seasonStart; i <= seasonEnd; i++) {
        await axios
          .get(
            "https://www.balldontlie.io/api/v1/season_averages?season=" +
              i +
              "&player_ids[]=" +
              this.$route.params.id
          )
          .then(function (response) {
            return response.data.data[0];
          })
          .then((result) => {
            this.gamesPlayed.push(result ? result.games_played : 0);
            this.points.push(result ? result.pts : 0);
            this.assists.push(result ? result.ast : 0);
            this.steals.push(result ? result.stl : 0);
            this.blocks.push(result ? result.blk : 0);
            this.seasons.push(i);
          });
      }
      console.log(this.gamesPlayed);
      console.log(this.points);
      this.leftChartData.labels = this.seasons;
      this.leftChartData.datasets = [
        {
          data: this.gamesPlayed,
          backgroundColor: "#003366",
        },
      ];
      this.rightChartData.labels = this.seasons;
      this.rightChartData.datasets = [
        {
          data: this.points,
          borderColor: "#db0f32",
          fill: false,
          label: "PTS (points)",
        },
        {
          data: this.assists,
          borderColor: "#087830",
          fill: false,
          label: "AST (assists)",
        },
        {
          data: this.steals,
          borderColor: "#FF5F15",
          fill: false,
          label: "STL (steals)",
        },
        {
          data: this.blocks,
          borderColor: "#003366",
          fill: false,
          label: "BLK (blocks)",
        },
      ];
    },
  },
  mounted() {
    this.getPlayerStats(2011, 2021);
  },
});
</script>


<style scoped>
h1 {
  color: white;
  margin-top: 0px;
  padding-top: 40px;
}
.playerDashboard {
  position: fixed;
  top: 80px;
  bottom: 50px;
  left: 0px;
  right: 0px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: minmax(500px, auto);
}
.chart {
  background-color: #9fbbd1;
  border-radius: 10px;
  flex: 1 1 500px;
  grid-row: 1;
}
.left {
  margin: 20px 20px 20px 40px;
  grid-column: 1;
}
.right {
  margin: 20px 40px 20px 20px;
  grid-column: 2;
}
.slider {
  position: fixed;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
}
.custom-dot {
  width: 100%;
  height: 100%;
  background-color: transparent;
  transform: translateY(-35%) translateX(-25%);
}
</style>
