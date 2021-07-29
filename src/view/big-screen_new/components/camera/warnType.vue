
<template>
  <div class="com-container">
    <div class="com-chart" ref="warnType"></div>
    <div class="circle"></div>
    <div class="line"></div>
  </div>
</template>

<script>
import * as echarts from "echarts"; // 引入echarts
import { getLocal } from "util/tool";
import { getMaxIndex } from "@/util/util";
export default {
  data() {
    return {
      warnType: null
    };
  },
  methods: {
    transformText(val) {
      switch (val) {
        case "areaDetectionCount":
          return "区域侦测";
          break;
        case "breakBoundsDetectionCount":
          return "越界侦测";
          break;
        case "faceDetectionCount":
          return "人脸检测";
          break;
        case "intrusionDetectionCount":
          return "入侵侦测";
          break;
        case "itemsDetectionCount":
          return "物品侦测";
          break;
        case "keepOutAlarmCount":
          return "遮挡告警";
          break;
        default:
          break;
      }
    },
    initPieChart(data) {
      this.warnType = this.$echarts.init(this.$refs.warnType, "chalk");
      var colorList = [
        "#2FBDFF",
        "#24E9F1",
        "#1DE9B6",
        "#00BFA5",
        "#2F93FF",
        "#2F64FF"
      ];
      let sData = [];
      for (let i in data) {
        if (
          i == "areaDetectionCount" ||
          i == "breakBoundsDetectionCount" ||
          i == "faceDetectionCount" ||
          i == "intrusionDetectionCount" ||
          i == "itemsDetectionCount" ||
          i == "keepOutAlarmCount"
        ) {
          sData.push({
            value: data[i],
            name: this.transformText(i)
          });
        }
      }
      const maxIndex = getMaxIndex(sData, "value");
      let option = {
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "vertical",
          bottom: "10%",
          right: "20%",
          itemWidth: 14,
          itemHeight: 14,
          textStyle: {
            rich: {
              a: {
                fontSize: 14,
                color: "#FFFFFF",
                lineHeight: 20
              },
              b: {
                color: "#FFFFFF",
                fontSize: 14
              }
            }
          },
          formatter: param => {
            if (param == "入侵侦测") {
              return `{a| ${param}}\n{b| ${data.intrusionDetection}}`;
            } else if (param == "越界侦测") {
              return `{a| ${param}}\n{b| ${data.breakBoundsDetection}}`;
            } else if (param == "区域侦测") {
              return `{a| ${param}}\n{b| ${data.areaDetection}}`;
            } else if (param == "物品侦测") {
              return `{a| ${param}}\n{b| ${data.itemsDetection}}`;
            } else if (param == "遮挡告警") {
              return `{a| ${param}}\n{b| ${data.keepOutAlarm}}`;
            } else if (param == "人脸检测") {
              return `{a| ${param}}\n{b| ${data.faceDetection}}`;
            }
          }
        },
        series: [
          {
            name: "摄像头告警类型统计",
            type: "pie",
            center: ["30%", "50%"],
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            itemStyle: {
              normal: {
                color: function(params) {
                  return colorList[params.dataIndex];
                },
                borderColor: "#001A40",
                borderWidth: 4
              }
            },
            labelLine: {
              show: false
            },
            data: sData
          }
        ]
      };
      this.warnType.setOption(option);
      window.addEventListener("resize", () => this.warnType.resize(), false);
      this.warnType.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: maxIndex
      });
      let index = maxIndex;
      this.warnType.on("mouseover", e => {
        this.warnType.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          dataIndex: index
        });
        if (e.dataIndex != index) {
          this.warnType.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: index
          });
        }
        if (e.dataIndex == index) {
          this.warnType.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: e.dataIndex
          });
        }
      });
      this.warnType.on("mouseout", e => {
        index = e.dataIndex;
        this.warnType.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: e.dataIndex
        });
      });
    },
    getList() {
      let data = getLocal("bigScreenNew")["cameraEventStat"];
      if (data && Object.keys(data).length) {
        this.$nextTick(() => {
          this.initPieChart(data);
        });
      }
    }
  },
  created() {
    this.getList();
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
@keyframes inner-circle {
  from {
    offset-distance: 0%;
  }
  to {
    offset-distance: 100%;
  }
}
@keyframes turn {
  0% {
    -webkit-transform: rotate(0deg);
  }
  25% {
    -webkit-transform: rotate(90deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  75% {
    -webkit-transform: rotate(270deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
.com-container {
  position: relative;
}
.circle {
  position: absolute;
  top: 31%;
  left: 16%;
  width: 145px;
  height: 145px;
  background: url("../../images/camera_circle.png") no-repeat;
  background-size: 100% 100%;
  animation: turn 6s linear infinite;
}
.line {
  position: absolute;
  top: 30%;
  left: 30%;
  width: 72px;
  height: 102px;
  background: url("../../images/camera_line.png") no-repeat;
  background-size: 100% 100%;
  /* offset-path: path(
    "M65.5,-1.13686838e-13 C101.674651,-1.13686838e-13 131,29.3585665 131,65.5741935 C131,101.789821 101.674651,131.148387 65.5,131.148387 C29.3253489,131.148387 0,101.789821 0,65.5741935 C0,29.3585665 29.3253489,-1.13686838e-13 65.5,-1.13686838e-13 Z M65.5,1 C29.8778872,1 1,29.910598 1,65.5741935 C1,101.237789 29.8778872,130.148387 65.5,130.148387 C101.122113,130.148387 130,101.237789 130,65.5741935 C130,29.910598 101.122113,1 65.5,1 Z"
  );
  offset-distance: 0%;
  animation: inner-circle 6s linear 0s infinite; */
}
</style>