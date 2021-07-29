<template>
  <!-- 近7天播放情况 -->
  <div class="com-container">
    <div class="com-chart" ref="radio_today"></div>
  </div>
</template>

<script>
import * as echarts from "echarts"; // 引入echarts
import { getLocal } from "util/tool";
export default {
  data() {
    return {
      chartInstance: "",
      allData: {},
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.sreenAdapter);
    this.sreenAdapter();
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.radio_today, "chalk");
      const initOption = {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(0, 255, 233,0)",
                  },
                  {
                    offset: 0.5,
                    color: "rgba(255, 255, 255,1)",
                  },
                  {
                    offset: 1,
                    color: "rgba(0, 255, 233,0)",
                  },
                ],
                global: false,
              },
            },
          },
        },
        grid: {
          top: "15%",
          left: "10%",
          right: "10%",
          bottom: "15%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              show: false,
              color: "rgba(255,255,255,0.18)",
            },

            axisLabel: {
              color: "rgba(145,163,206,1)",
              width: 100,
              fontSize: 14
            },
            splitLine: {
              show: false,
            },
            boundaryGap: false,
          },
        ],

        yAxis: [
          {
            type: "value",
            min: 0,
            splitNumber: 4,
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(255,255,255,0.18)",
                opacity: 0.23,
              },
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              margin: 20,
              textStyle: {
                color: "#91A3CE",
                fontSize: 14
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    getData() {
      let weekData = getLocal("bigScreenNew")["audioStatisticsWeek"]
      let dataName = [];
      let dataValue = [];
      if(weekData && weekData.length) {
        weekData.map(item => {
          let splitArr = item.simplePlayTimeAxis.split('-')
          let newAxis = splitArr[1] + '-' + splitArr[2]
          dataName.push(newAxis)
          dataValue.push(item.sumplayCount)
        })
      }
      this.allData = {
        dataName: [...dataName],
        dataValue: [...dataValue],
      };
      this.upDataChart();
    },
    upDataChart() {
      // 类目轴是数据
      const dataName = this.allData.dataName;
      // Y轴数据
      const dataValue = this.allData.dataValue;
      const dataOption = {
        xAxis: {
          data: dataName,
        },
        series: [
          {
            name: "",
            type: "line",
            showAllSymbol: true,
            smooth: false,
            // symbol: "circle",
            // symbolSize: 10,
            lineStyle: {
              normal: {
                color: "rgba(91,216,249,1)",
              },
            },
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "rgba(91,216,249,1)",
              },
            },
            itemStyle: {
              color: "#fff",
              borderColor: "rgba(91,216,249,1)",
              borderWidth: 2,
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(91,216,249,.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(43,193,145,0)",
                    },
                  ],
                  false
                ),
              },
            },
            data: [4, 7, 5, 4, 3, 5, 8], //data.values
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    sreenAdapter() {
      const adapterOption = {};
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
};
</script>

<style>
</style>