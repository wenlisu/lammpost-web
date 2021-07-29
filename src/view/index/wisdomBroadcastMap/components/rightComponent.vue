<template>
  <div class="rightTable">
    <partTitle :title="title" />
    <div ref="rightLine" class="rightLine"></div>
    <div class="pieBox">
      <partTitle :title="bottomTitle" />
      <div ref="pieChart" class="pieChart"></div>
    </div>
  </div>
</template>

<script>
import partTitle from "../../components/commonTitle";
import * as echarts from "echarts"; // 引入echarts
import {
  getDeviceAudioLatelyStatistics,
  getDeviceAudioSceneStatistics,
} from "api/screen/newIndex";

export default {
  data() {
    return {
      title: "广播器本年度播放情况分析",
      bottomTitle: "广播器应用场景情况分析",
      rightLine: null,
      pieChart: null,
    };
  },
  components: {
    partTitle,
  },
  mounted() {
    this.$nextTick(() => {
      this.handleInitLine();
      this.handleInitPie();
    });
  },
  methods: {
    async handleInitLine() {
      this.rightLine = this.$echarts.init(this.$refs.rightLine, "chalk");
      let res = await this.getLineData();
      let timeData = [],
        valueData = [];
      res.map((item) => {
        timeData.push(item.simplePlayTimeAxis);
        valueData.push(item.sumPlayCount);
      });
      let data = {
        dataX: timeData,
        dataY: valueData,
      };
      let option = {
        grid: {
          left: "3%",
          right: "4%",
          bottom: "6%",
          containLabel: true,
        },
        tooltip: {
          show: true,
          // trigger: 'axis'
        },
        xAxis: {
          type: "category",
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14,
              color: "rgba(145,163,206,1)",
            },
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "rgba(255,255,255,0.18)",
            },
          },
          axisTick: {
            show: false,
          },
          boundaryGap: false,
          data: data.dataX,
        },
        yAxis: {
          type: "value",
          min: 0,
          splitNumber: 4,
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,0.18)",
              // opacity: 0.23
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
        series: [
          {
            name: "",
            type: "bar",
            barWidth: "7px",
            itemStyle: {
              normal: {
                barBorderRadius: [100, 100, 100, 0],
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(223,186,78,1)", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(223,186,78,0)", // 100% 处的颜色
                    },
                  ],
                  false
                ),
              },
            },
            data: data.dataY,
          },
        ],
      };
      this.rightLine.setOption(option);
      window.addEventListener("resize", () => this.rightLine.resize(), false);
    },
    getLineData() {
      return getDeviceAudioLatelyStatistics({ dateInterval: 1 }).then((res) => {
        if (res.code === "200") {
          const { data } = res;
          return data;
        }
      });
    },
    async handleInitPie() {
      this.pieChart = this.$echarts.init(this.$refs.pieChart, "chalk");
      let result = await this.getPieData();
      let nameData = [],
        valueData = [];
      result.map((item) => {
        nameData.push(item.programScenarioDesc);
        valueData.push(item.programCount);
      });
      let data = {
        name: nameData,
        value: valueData,
      };
      let option = {
        backgroundColor: "transparent",
        color: ["#2EFFD2"],
        tooltip: {
          show: false, // 弹层数据去掉
        },
        radar: {
          center: ["50%", "60%"], // 外圆的位置
          radius: "80%",
          name: {
            textStyle: {
              color: "#AABEEE",
              fontSize: 16,
              fontWeight: 400,
              fontFamily: "PingFang SC",
            },
          },
          indicator: data.name.map((e) => {
            return {
              name: e,
              max: 10,
            };
          }),
          // [
          //   { name: "政策宣传", max: 10 },
          //   { name: "文化传播", max: 10 },
          //   { name: "交通指引", max: 10 },
          //   { name: "应急传媒", max: 10 },
          //   { name: "公益", max: 10 },
          // ],
          splitArea: {
            // 坐标轴在 grid 区域中的分隔区域，默认不显示。
            show: true,
            areaStyle: {
              // 分隔区域的样式设置。
              color: "transparent", // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
            },
          },
          axisLine: {
            // 指向外圈文本的分隔线样式
            lineStyle: {
              color: "rgba(0,255,200,0.44)",
            },
          },
          splitLine: {
            lineStyle: {
              type: "solid",
              color: "#465893", // 分隔线颜色
              width: 1, // 分隔线线宽
            },
          },
        },
        series: [
          {
            type: "radar",
            symbolSize: 5,
            data: [
              {
                value: data.value,
                name: "",
                areaStyle: {
                  normal: {
                    color: "rgba(0,255,200,0.44)",
                  },
                },
                label: {
                  show: false,
                },
                itemStyle: {
                  // 折线拐点标志的样式。
                  normal: {
                    // 普通状态时的样式
                    lineStyle: {
                      width: 0,
                    },
                    opacity: 0,
                  },
                  emphasis: {
                    // 高亮时的样式
                    lineStyle: {
                      width: 1,
                    },
                    opacity: 0.3,
                  },
                },
              },
            ],
          },
        ],
      };
      this.pieChart.setOption(option);
      window.addEventListener("resize", () => this.pieChart.resize(), false);
    },
    getPieData() {
      return getDeviceAudioSceneStatistics({}).then((res) => {
        if (res.code === "200") {
          const { data } = res;
          return data;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.rightTable {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 500px;
  bottom: 10px;
  background: url("../images/right_bg.png") center center no-repeat;
  background-size: 100% 100%;
  padding: 0 20px;
  padding-top: 60px; /*no*/
  z-index: 11;
  .rightLine {
    width: 100%;
    height: 300px;
  }
  .pieBox {
    margin-top: 25px;
    .pieChart {
      width: 100%;
      height: 300px;
    }
  }
}
</style>