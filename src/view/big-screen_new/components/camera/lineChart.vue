
<template>
  <div class="com-container">
    <div class="com-chart" ref="lineChart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts"; // 引入echarts
// import { cameraAlarmCount } from "@/api/screen/newIndex";
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
        yData.push(e.alarmCount);
      });
      let option = {
        /* grid: {
          left: "3%",
          right: "0%",
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
          axisLabel: {
            interval: 0,
            textStyle: {
              color: "#91A3CE" //坐标值得具体的颜色
            }
          },
          axisLine: {
            lineStyle: {
              color: "#91A3CE" //左边线的颜色
            }
          }
        },
        yAxis: {
          type: "value",
          axisTick: {
            show: false //不显示坐标轴刻度线
          },
          axisLine: {
            show: false //不显示坐标轴轴线
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,0.18)",
              opacity: 0.23
            }
          },
          axisLabel: {
            textStyle: {
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
                        offset: 0.53,
                        color: "rgba(255,81,81,0.53)" // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "rgba(249,91,151,0.00)" // 100% 处的颜色
                      }
                    ],
                    globalCoord: false // 缺省为 false
                  }
                },
                lineStyle: {
                  color: "#FF7A99" //改变折线颜色
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
      let data = getLocal("bigScreenNew")["cameraAlarmCount"];
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