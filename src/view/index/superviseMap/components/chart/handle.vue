<template>
  <!-- 环境监测器本年度报警分析 -->
  <div class="com-container">
    <div class="com-chart" ref="enviroment"></div>
  </div>
</template>

<script>
import * as echarts from "echarts"; // 引入echarts
import { getLocal } from "util/tool";
import {
  getAmbientMonitoringAlarmCount
} from 'api/supervise';

export default {
  data() {
    return {
      chartInstance: "",
      allData: {},
    };
  },
  mounted() {
    this.initChart();
    this.getData({
      dateInterval: 1
    });
    window.addEventListener("resize", this.sreenAdapter);
    this.sreenAdapter();
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.enviroment, "chalk");
      const initOption = {
        backgroundColor: "transparent",
        color: ["#3cefff"],
        tooltip: {},
        grid: {
          borderWidth: 0,
          top: "10%",
          left: "5%",
          bottom: "5%",
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
    getData(parames) {
      // let yearData = getLocal("bigScreenNew")["audioStatisticsYear"]
      // let dataName = [];
      // let dataValue = [];
      // if(yearData && yearData.length) {
      //   yearData.map(item => {
      //     dataName.push(item.simplePlayTimeAxis)
      //     dataValue.push(item.sumPlayCount)
      //   })
      // }
      // this.allData = {
      //   dataName: [...dataName],
      //   dataValue: [...dataValue],
      // };
      getAmbientMonitoringAlarmCount(parames).then(async (res) => {
        if (res.code === '200') {
          let dataName = [];
          let dataValue = [];
          await res.data.map(data => {
            dataName.push(data.simpleTimeAxis);
            dataValue.push(data.alarmCount);
          })
          this.allData = {
            dataName,
            dataValue
          }
          this.upDataChart();
        }
      })
    },
    upDataChart() {
      // 类目轴是数据
      const dataName = this.allData.dataName;
      // Y轴数据
      const dataValue = this.allData.dataValue;
      const dataOption = {
        xAxis: {
          data: dataName
          // data: [1,2,3,4,5,6,7,8,9]
        },
        series: [
          // {
          //   name: "",
          //   type: "pictorialBar",
          //   symbolSize: [10, 6],
          //   symbolOffset: [0, -3],
          //   symbolPosition: "end",
          //   z: 12,
          //   itemStyle: {
          //     normal: {
          //       color: "rgba(169,243,255,1)",
          //     },
          //   },
          //   data: [10,20,30,40,50,60,70,80,90],
          // },
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
            barWidth: "6",
            // data: [10,20,30,40,50,60,70,80,90],
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