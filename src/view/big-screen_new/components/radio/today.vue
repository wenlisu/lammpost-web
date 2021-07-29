<template>
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
        tooltip: {},
        grid: {
          top: "15%",
          left: "5%",
          right: "5%",
          bottom: "15%",
          containLabel: true,
        },
        // legend: {
        //   data: ['文科','理科'],
        //   right: "3%",
        //   top:"4%",
        //   textStyle: {
        //     color: "#A1D5FF",
        //     fontSize: 12
        //   },
        //   itemWidth: 12,  // 设置宽度
        //   itemHeight:16, // 设置高度
        //   itemGap: 12 // 设置间距
        // },
        xAxis: {
          type: "category",
          axisLabel: {
            margin: 10,
            color: "rgba(145,163,206,1)",
            textStyle: {
              fontSize: 14,
              color: "rgba(145,163,206,1)",
            },
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.18)",
            },
          },
          axisTick: {
            show: false,
          },
          boundaryGap: false,
        },
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
      let dayData = getLocal("bigScreenNew")["audioStatisticsDay"];
      let getsyzl = [];
      let getlkrs = [];
      if(dayData && dayData.length) {
        dayData.map(item => {
          getsyzl.push(item.simplePlayTimeAxis)
          getlkrs.push(item.sumPlayCount)
        })
      }
      this.allData = {
        getsyzl: [...getsyzl],
        getlkrs: [...getlkrs],
      };
      this.upDataChart();
    },
    upDataChart() {
      // 类目轴是数据
      const getsyzl = this.allData.getsyzl;

      const getlkrs = this.allData.getlkrs;
      const dataOption = {
        xAxis: {
          data: getsyzl,
        },
        series: [
          {
            name: "今日播放情况",
            type: "bar",
            data: getlkrs,
            barWidth: "7px",
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
                      color: "rgba(137,92,255,1)", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(149,250,255,0)", // 100% 处的颜色
                    },
                  ],
                  false
                ),
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