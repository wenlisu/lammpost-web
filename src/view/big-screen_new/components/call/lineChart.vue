
<template>
  <div class="com-container">
    <div class="com-chart" ref="lineChart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts"; // 引入echarts
import { getLocal } from "util/tool";
export default {
  data() {
    return {
      lineChart: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    initPieChart(data) {
      this.lineChart = this.$echarts.init(this.$refs.lineChart, "chalk");
      let timeData = [];
      let yData = [];
      data.map(e => {
        timeData.push(e.simpleTimeAxis);
        yData.push(e.alarmCallCount);
      });
      let option = {
        /* grid: {
          left: "3%",
          right: "3%",
          bottom: "5%",
          containLabel: true
        }, */
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: timeData,
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.18)"
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#91A3CE", //更改坐标轴文字颜色
              fontSize: 14 //更改坐标轴文字大小
            }
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            show: true,
            textStyle: {
              color: "#91A3CE", //更改坐标轴文字颜色
              fontSize: 14 //更改坐标轴文字大小
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["rgba(255,255,255,0.18)"],
              width: 1,
              type: "solid"
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#91A3CE"
            }
          }
        },
        series: [
          {
            data: yData,
            type: "line",
            smooth: true,
            symbol: "none",
            areaStyle: {},
            itemStyle: {
              normal: {
                areaStyle: {
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "rgba(40,145,165,1)" // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "rgba(87,124,255,0)" // 100% 处的颜色
                      }
                    ],
                    globalCoord: false // 缺省为 false
                  }
                },
                lineStyle: {
                  color: "#5EEFFF" //改变折线颜色
                }
              }
            }
          }
        ]
      };
      this.lineChart.setOption(option);
      window.addEventListener("resize", () => this.lineChart.resize(), false);
    },
    // 获取数据
    getList() {
      let data = getLocal("bigScreenNew")["callTrend"];
      if (data && data.length) {
        this.$nextTick(() => {
          this.initPieChart(data);
        });
      }
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
</style>