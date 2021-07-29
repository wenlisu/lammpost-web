<template>
  <div class="com-container">
    <div class="com-chart" ref="led_week"></div>
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
      this.chartInstance = this.$echarts.init(this.$refs.led_week, "chalk");
      const initOption = {
        backgroundColor: "transparent",
        tooltip: {},
        color: ['rgba(90,200,237,1)', 'rgba(94,252,155,1)'],
        grid: {
          top: "20%",
          left: "3%",
          right: "10%",
          bottom: "15%",
          containLabel: true,
        },
        legend: {
          // data: ['文科','理科'],
          top: "4%",
          textStyle: {
            color: "#A1D5FF",
            fontSize: 14,
          },
          itemStyle: {
            
          },
          itemWidth: 9, // 设置宽度
          itemHeight: 5, // 设置高度
          itemGap: 12, // 设置间距
        },
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
      let weekData = getLocal("bigScreenNew")["ledPlayStateWeek"];
      let getsyzl = [];
      let getlkrs = [];
      let getTime = [];
      if (weekData && weekData.length) {
        weekData.map((item) => {
          let splitArr = item.simplePlayTimeAxis.split('-')
          let newAxis = splitArr[1] + '-' + splitArr[2]
          getsyzl.push(newAxis);
          getlkrs.push(item.sumPlayCount);
          getTime.push(item.sumPlayTime);
        });
      }
      this.allData = {
        getsyzl: [...getsyzl],
        getlkrs: [...getlkrs],
        getTime: [...getTime],
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
            name: "播放时长",
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
                      color: "rgba(94,217,255,1)", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(151,238,255,0)", // 100% 处的颜色
                    },
                  ],
                  false
                ),
              },
            },
          },
          {
            name: "播放次数",
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
                      color: "rgba(94,255,156,1)", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(151,255,203,0)", // 100% 处的颜色
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