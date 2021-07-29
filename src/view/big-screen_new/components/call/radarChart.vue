
<template>
  <div class="com-container">
    <div class="com-chart" ref="radarChart"></div>
    <div class="radar-img"></div>
  </div>
</template>

<script>
import * as echarts from "echarts"; // 引入echarts
import { getLocal } from "util/tool";
export default {
  data() {
    return {
      radarChart: null
    };
  },
  created() {
    this.getList();
  },
  methods: {
    transformText(val) {
      switch (val) {
        case "finishedCount":
          return "已处理";
          break;
        case "handleCount":
          return "处理中";
          break;
        case "unProcessCount":
          return "未处理";
          break;
        default:
          break;
      }
    },
    initRadarChart(data) {
      this.radarChart = this.$echarts.init(this.$refs.radarChart, "chalk");
      // 数据处理
      let indicatorData = [];
      let sData = [];
      for (var i in data) {
        if (
          i == "finishedCount" ||
          i == "handleCount" ||
          i == "unProcessCount"
        ) {
          indicatorData.push({
            name: this.transformText(i),
            max: data.sumCount
          });
          sData.push(data[i]);
        }
      }
      let option = {
        backgroundColor: "transparent",
        color: ["#FF50B7"],
        tooltip: {
          show: false // 弹层数据去掉
        },
        radar: {
          center: ["45%", "70%"], // 外圆的位置
          radius: "80%",
          name: {
            textStyle: {
              color: "#fff",
              fontSize: 12,
              fontWeight: 400,
              fontFamily: "PingFangSC-Regular,PingFang SC",
              fontStyle: "normal"
            },
            formatter: param => {
              if (param == "未处理") {
                return `{a| ${param}}\n{b| ${data.unProcessCountRatio}}`;
              } else if (param == "处理中") {
                return `{a| ${param}}\n{b| ${data.handleCountRatio}}`;
              } else if (param == "已处理") {
                return `{a| ${param}}\n{b| ${data.finishedCountRatio}}`;
              }
            },
            rich: {
              a: {
                fontSize: 14,
                color: "#fff",
                lineHeight: "22"
                // padding: [0, 5, 0, 5],
              },
              b: {
                color: "#41E1FF",
                fontSize: 16
                // padding: [0, 0, 0, 5],
              },
              triggerEvent: true
            }
          },
          indicator: indicatorData,
          splitArea: {
            // 坐标轴在 grid 区域中的分隔区域，默认不显示。
            show: true,
            areaStyle: {
              // 分隔区域的样式设置。
              color: "rgba(40,177,242,0.16)" // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
            }
          },
          axisLine: {
            // 指向外圈文本的分隔线样式
            lineStyle: {
              color: "rgba(255,255,255,0.2)"
            }
          },
          splitLine: {
            lineStyle: {
              type: "solid",
              color: "rgba(21,173,225,1)", // 分隔线颜色
              width: 1 // 分隔线线宽
            }
          }
        },
        series: [
          {
            type: "radar",
            symbolSize: 5,
            data: [
              {
                value: sData,
                name: "",
                areaStyle: {
                  normal: {
                    color: "#FF50B7"
                  }
                },
                label: {
                  show: false
                },
                itemStyle: {
                  // 折线拐点标志的样式。
                  normal: {
                    // 普通状态时的样式
                    lineStyle: {
                      width: 1
                    },
                    opacity: 0.3
                  },
                  emphasis: {
                    // 高亮时的样式
                    lineStyle: {
                      width: 5
                    },
                    opacity: 0
                  }
                }
              }
            ]
          }
        ]
      };
      this.radarChart.setOption(option);
      window.addEventListener("resize", () => this.radarChart.resize(), false);
    },
    // 获取数据
    getList() {
      let data = getLocal("bigScreenNew")["alarmCallStats"];
      if (data && Object.keys(data).length) {
        this.$nextTick(() => {
          this.initRadarChart(data);
        });
      }
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
@keyframes turn {
  0% {
    -webkit-transform: rotateX(0deg);
  }
  /* 25% {
    -webkit-transform: rotateX(90deg);
  }
  50% {
    -webkit-transform: rotateX(180deg);
  }
  75% {
    -webkit-transform: rotateX(270deg);
  } */
  100% {
    -webkit-transform: rotateX(360deg);
  }
}
@keyframes rollImg {
  0% {
    transform: skewY(0deg);
  }
  100% {
    transform: skewY(360deg);
  }
}
.com-container {
  position: relative;
  .radar-img {
    position: absolute;
    top: 25%;
    left: 21%;
    width: 250px;
    height: 214px;
    background: url("../../images/radar_circle.png") no-repeat;
    background-size: 100% 100%;
    // transform: rotateX(68deg);
    transform: scaleY(0.3);
    // transform: skewY(0) rotateZ(88deg) rotateX(8deg) rotateY(-79deg);
    // animation: turn 6s linear infinite;
    // animation: 2s rollImg linear infinite normal;
  }
}
</style>