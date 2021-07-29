
<template>
  <div class="com-container">
    <div class="com-chart" ref="rightLineChart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts"; // 引入echarts
import { getLocal } from "util/tool";
export default {
  data() {
    return {
      rightLineChart: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    transformText(val) {
      switch (val) {
        case "Jan":
          return "1月";
          break;
        case "Feb":
          return "2月";
          break;
        case "Mar":
          return "3月";
          break;
        case "Apr":
          return "4月";
          break;
        case "May":
          return "5月";
          break;
        case "Jun":
          return "6月";
          break;
        case "Jul":
          return "7月";
          break;
        case "Aug":
          return "8月";
          break;
        case "Sep":
          return "9月";
          break;
        case "Oct":
          return "10月";
          break;
        case "Nov":
          return "11月";
          break;
        case "Dec":
          return "12月";
          break;
        default:
          break;
      }
    },
    initRightLineChart(data) {
      this.rightLineChart = this.$echarts.init(
        this.$refs.rightLineChart,
        "chalk"
      );
      var category = [];
      var lineData = []; //报警
      var barData = []; //处理
      data.map(e => {
        category.push(this.transformText(e.simpleTimeAxis));
        lineData.push(e.alarmCallCount);
        barData.push(e.handleCount);
      });
      var option = {
        /* grid: {
          left: "3%",
          right: "0%",
          bottom: "5%",
          containLabel: true
        }, */
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          formatter: function(param) {
            var num = param[0].data - param[1].data;
            var text1 =
              "<div><p>月份：" + param[0].axisValueLabel + "</p></div>";
            var text2 =
              "<div><p>" +
              param[0].seriesName +
              "：" +
              param[0].data +
              "</p></div>";
            var text3 =
              "<div><p>" +
              param[1].seriesName +
              "：" +
              param[1].data +
              "</p></div>";
            var text4 = "<div><p>" + "未处理次数：" + num + "</p></div>";
            var res = text1 + text2 + text3 + text4;
            return res;
          }
        },
        /* legend: {
          data: ["报警次数", "处理次数"],
          textStyle: {
            color: "#ccc"
          }
        }, */
        legend: [
          {
            data: ["报警次数"],
            left: "30%",
            top: "3%",
            textStyle: {
              color: "#fff",
              fontSize: 14,
              fontFamily: "PingFangSC",
              fontWeight: 400
            }
          },
          {
            data: ["处理次数"],
            left: "52%",
            top: "3%",
            textStyle: {
              color: "#fff",
              fontSize: 14,
              fontFamily: "PingFangSC",
              fontWeight: 400
            },
            itemWidth: 8,
            itemHeight: 14
          }
        ],
        xAxis: {
          data: category,
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
            name: "报警次数",
            type: "line",
            smooth: true,
            showAllSymbol: true,
            symbol: "emptyCircle",
            symbolSize: 6,
            itemStyle: {
              normal: {
                borderColor: "#fff",
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(255,255,255, 0.2)" },
                  { offset: 1, color: "rgba(255,255,255,0.2)" }
                ]),
                borderWidth: 3,
                lineStyle: {
                  color: "#929EFF" //改变折线颜色
                }
              }
            },
            data: lineData
          },
          {
            name: "处理次数",
            type: "bar",
            barWidth: 6,
            itemStyle: {
              barBorderRadius: 100,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#14c8d4" },
                { offset: 1, color: "#43eec6" }
              ])
            },
            data: barData
          },
          {
            name: "报警次数",
            type: "bar",
            barGap: "-100%",
            barWidth: 6,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(20,200,212,0.5)" },
                { offset: 0.2, color: "rgba(20,200,212,0.2)" },
                { offset: 1, color: "rgba(20,200,212,0)" }
              ])
            },
            z: -12,
            data: lineData
          },
          {
            name: "",
            type: "pictorialBar",
            symbol: "rect",
            itemStyle: {
              color: "#0f375f"
            },
            symbolRepeat: true,
            symbolSize: [10, 4],
            symbolMargin: 1,
            z: -10,
            data: lineData
          }
        ]
      };
      this.rightLineChart.setOption(option);
      window.addEventListener(
        "resize",
        () => this.rightLineChart.resize(),
        false
      );
    },
    // 获取数据
    getList() {
      let data = getLocal("bigScreenNew")["callTrendStats"];
      if (data && data.length) {
        this.$nextTick(() => {
          this.initRightLineChart(data);
        });
      }
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
</style>