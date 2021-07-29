<template>
  <div class="com-container">
    <div class="com-chart" ref="radio_scenarios">
      <highcharts :options="option" />
    </div>
  </div>
</template>

<script>
import highcharts from 'highcharts'
import highcharts3d from 'highcharts/highcharts-3d'
import { Chart } from "highcharts-vue";
import { getLocal } from "util/tool";
highcharts3d(highcharts)
export default {
  data() {
    return {
      chartInstance: "",
      allData: {},
      option: {},
    };
  },
  mounted() {
    this.initChart();
  },
  components: {
    highcharts: Chart,
  },
  methods: {
    initChart() {
      let scenData = getLocal("bigScreenNew")["audioScene"];
      let seriesData = [];
      let sum = 0;
      if (scenData && scenData.length) {
        sum = scenData.reduce((pre, curr) => {
          return !isNaN(pre.programCount)
            ? pre.programCount + curr.programCount
            : pre + curr.programCount;
        });
        scenData.map((item, index) => {
          if (index == 0) {
            seriesData.push({
              name: item.programScenarioDesc,
              y: Number(((item.programCount / sum) * 100).toFixed(2)),
              sliced: true,
              selected: true,
              slicedOffset: 30,
            });
          } else {
            seriesData.push([
              item.programScenarioDesc,
              Number(((item.programCount / sum) * 100).toFixed(2)),
            ]);
          }
        });
      }
      const initOption = {
        chart: {
          type: "pie",
          options3d: {
            enabled: true,
            alpha: 60,
            beta: 0,
          },
          backgroundColor: "transparent",
        },
        credits: {
          enabled: false,
        },
        title: {
          text: null,
        },
        legend: {
          enabled: true,
          align: "center",
          symbolRadius: 0,
          lineHeight: 20,
          itemMarginBottom: 10, // 图例项底部间距
          itemDistance: 40, // 图例项间的距离
          itemStyle: {
            color: "#fff",
            fontWeight: 400,
            fontSize: 14,
            fontFamily: 'PingFangSC, PingFangSC-Regular'
          },
          itemHoverStyle: {
            color: "#fff",
          },
          labelFormatter: function () {
            return '<span style="white-space:pre;">' + this.name + '    ' + this.y + '%</span>'
            // return this.name + `    ` + this.y + "%";
          },
        },
        tooltip: {
          pointFormatter: function () {
            return (
              '<span style="color: ' +
              this.series.color +
              '">\u25CF</span> ' +
              this.series.name +
              ": <b>" +
              this.y +
              "%" +
              "</b><br/>."
            );
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            depth: 35,
            dataLabels: {
              enabled: false,
              inside: true,
              crop: false,
              format: "{point.name}",
              color: "#fff",
              style: {
                fontSize: "14px",
              },
            },
            showInLegend: true,
          },
        },
        colors: ["#5FDD9B", "#57E2E9", "#68CEFF", "#6898FE", "#556DE4"],
        series: [
          {
            type: "pie",
            name: "应用场景",
            data: seriesData,
            tooltip: {
              valueSuffix: "%",
            },
          },
        ],
      };
      this.option = initOption;
    },
  },
};
</script>

<style lang="less" scoped>
.com-chart {
  > div {
    height: 100%;
    width: 100%;
  }
}
</style>