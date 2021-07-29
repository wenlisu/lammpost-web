<template>
  <div id="callLeft" :class="{ componentView: true, show: show }">
    <div class="part_1">
      <ChartTitle partTitle="报警器今日报警情况分析"/>
      <LineChart />
    </div>
    <div class="parat_2">
      <ChartTitle partTitle="报警器报警处理情况分析"/>
      <RadarChart />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ChartTitle from '../../components/chartTitle/index'
import RadarChart from '../../components/call/radarChart'
import LineChart from '../../components/call/lineChart'
export default {
  data() {
    return {
      screenEnergyConsump: {},
      chart1Options: {
        chart: {
          className: "chartBg",
          backgroundColor: "transparent",
          // plotBackgroundImage: pieBgImg,
          type: "pie",
          height: "215px",
          options3d: {
            enabled: true,
            alpha: 60,
            beta: 0,
          },
        },
        credits: {
          enabled: false,
        },
        legend: {
          align: "center",
        },
        title: {
          text: "",
        },
        tooltip: {
          pointFormat: "{series.value}",
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            depth: 25,
            dataLabels: {
              enabled: true,
              format: "{y}",
              connectorColor: "#1B6CCC",
              color: "#fff",
              style: {
                fontSize: "16px",
              },
            },
          },
        },
        series: [],
      },
    };
  },
  components: {
    ChartTitle,
    LineChart,
    RadarChart
  },
  computed: {
  },
  created () {
  },
  methods: {
  },
  watch: {
  },
  mounted () {
  },
  created() {},
  destroyed() {},
};
</script>
<style lang="less">
#callLeft {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .part_1 {
    width: 100%;
    height: 50%;
  }
  .parat_2 {
    width: 100%;
    height: 50%;
  }
}
</style>
