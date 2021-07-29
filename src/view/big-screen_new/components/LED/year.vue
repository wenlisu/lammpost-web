<template>
  <!-- 近7天播放情况 -->
  <div class="com-container">
    <div class="com-chart" ref="led_year"></div>
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
      this.chartInstance = this.$echarts.init(this.$refs.led_year, "chalk");
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
          containLabel: true,
        },
        legend: {
          show: true,
          top: 10,
          icon: "stack",
          textStyle: {
            color: "#fff",
            fontSize: 14,
          },
          itemWidth: 9,  // 设置宽度
          itemHeight:5, // 设置高度
          itemGap: 12 // 设置间距
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
              fontSize: 14,
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
                fontSize: 14,
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
      let yearData = getLocal("bigScreenNew")["ledPlayStateYear"];
      let dataName = [];
      let dataValue = [[], []];
      if(yearData && yearData.length) {
        yearData.map(item => {
          dataValue[0].push(item.sumPlayTime)
          dataValue[1].push(item.sumPlayCount)
          dataName.push(item.simplePlayTimeAxis)
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
            name: "月播放时长",
            type: "line",
            showAllSymbol: false,
            smooth: true,
            symbol: "none",
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
              color: "rgba(91,216,249,1)",
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
                      color: "rgba(106,133,255,1)",
                    },
                    {
                      offset: 1,
                      color: "rgba(255,193,193,0)",
                    },
                  ],
                  false
                ),
              },
            },
            data: this.allData.dataValue[0], //data.values
          },
          {
            name: "月播放次数",
            type: "line",
            showAllSymbol: false,
            smooth: true,
            symbol: "none",
            // symbolSize: 10,
            lineStyle: {
              normal: {
                color: "rgba(90,216,155,1)",
              },
            },
            label: {
              show: true,
              position: "top",
              textStyle: {
                color: "rgba(90,216,155,1)",
              },
            },
            itemStyle: {
              color: "rgba(90,216,155,1)",
              borderColor: "rgba(90,216,155,1)",
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
            data: this.allData.dataValue[1], //data.values
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