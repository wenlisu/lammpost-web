<template>
  <!-- 广播器本年度播放情况分析 -->
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
        color: ["#3cefff"],
        tooltip: {},
        grid: {
          borderWidth: 0,
          top: "15%",
          left: "12%",
          bottom: "10%",
          height: "70%",
          width: "82%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            // nameTextStyle: {
            //   color: '#82b0ec',
            // },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.18)",
              },
            },
            axisLabel: {
              // rotate: 30,
              textStyle: {
                color: "rgba(145,163,206,1)",
                fontSize: 14,
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              textStyle: {
                color: "rgba(145,163,206,1)",
                fontSize: 14,
              },
              axisLabel: {
                margin: 17,
              },
              // formatter: '{value}%',
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(255,255,255,0.18)",
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "rgba(255,255,255,0.18)",
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    getData() {
      let yearData = getLocal("bigScreenNew")["audioStatisticsYear"]
      let dataName = [];
      let dataValue = [];
      if(yearData && yearData.length) {
        yearData.map(item => {
          dataName.push(item.simplePlayTimeAxis)
          dataValue.push(item.sumPlayCount)
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
            type: "pictorialBar",
            symbolSize: [10, 6],
            symbolOffset: [0, -3],
            symbolPosition: "end",
            z: 12,
            // label: {
            //   normal: {
            //     show: true,
            //     position: 'top',
            //     formatter: '{c}%',
            //   },
            // },
            itemStyle: {
              normal: {
                color: "rgba(169,243,255,1)",
              },
            },
            data: dataValue,
          },
          {
            type: "bar",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(78,219,223,1)", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(133,239,241,0)", // 100% 处的颜色
                    },
                  ],
                  false
                ),
              },
            },
            barWidth: "10",
            data: dataValue,
            markLine: {
              silent: true,
              symbol: "none",
              label: {
                position: "middle",
                formatter: "{b}",
              },
            },
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