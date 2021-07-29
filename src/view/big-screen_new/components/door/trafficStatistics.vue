<template>
  <!--门禁进出流量统计  -->
  <div class="com-container">
    <div class="com-chart" ref="door_traffic"></div>
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
      this.chartInstance = this.$echarts.init(this.$refs.door_traffic);
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
        legend: {
          show: false
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
                color: "rgba(255,255,255,0.18)",
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
      let outInData = getLocal("bigScreenNew")["doorAccessFlow"]
      let dataName = [];
      let dataValue = [];
      if(outInData && outInData.length) {
        outInData.map(item => {
          dataName.push(item.simpleDateAxis)
          dataValue.push(item.inFlowCount)
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
            name: "今日进出人流量",
            type: "line",
            showAllSymbol: false,
            smooth: true,
            symbol: "none",
            // symbolSize: 10,
            lineStyle: {
              normal: {
                color: "rgba(255,103,103,1)",
              },
            },
            label: {
              show: false,
              position: "top",
              textStyle: {
                color: "rgba(255,103,103,1)",
              },
            },
            itemStyle: {
              color: "rgba(255,103,103,1)",
              borderColor: "rgba(255,103,103,1)",
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
                      color: "rgba(255,89,93,1)",
                    },
                    {
                      offset: 1,
                      color: "rgba(255,89,93,0)",
                    },
                  ],
                  false
                ),
              },
            },
            data: dataValue, //data.values
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