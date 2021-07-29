<!-- 公共折线图 -->
<template>
  <div :id="chartId" class="com-chart"></div>
</template>
<script>
import echarts from "echarts"; //引入echarts
export default {
  name: "comLineChart",
  components: {},
  props: {
    chartData: {
      type: Object,
      default() {
        return {
          dataName: [],
          dateValue: []
        };
      }
    },
    chartId: {
      type: String,
      default: ""
    },
    // 是否为平滑曲线折线，默认是true
    smooth: {
      type: Boolean,
      default: true
    },
    legend: {
      type: Array,
      default() {
        return [
          {
            id: "high",
            name: "最高温度",
            itemColor: "#AD6BEF",
            areaColor: ["rgba(173,107,239,.5)", "rgba(173,107,239,.1)"]
          },
          {
            id: "low",
            name: "最低温度",
            itemColor: "#5AD7D8"
            // areaColor: ,
          }
        ];
      }
    },
    // 是否展示legend
    showLegend: {
      type: Boolean,
      default: true
    },
    // x轴是都旋转
    labelRotate: {
      type: Number,
      default: 0
    },
    axisInterval: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      twoLineChart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      console.log(this.chartData);
      this.initLineChart();
    })
  },
  methods: {
    initLineChart() {
      this.twoLineChart = echarts.init(document.getElementById(this.chartId));
      this.twoLineChart.showLoading();
      let that = this;
      window.addEventListener("resize", () => that.twoLineChart.resize(), true);
      this.twoLineChart.hideLoading();
      const options = that.getOptions(that.chartData)
      this.twoLineChart.setOption(options);
    },
    // 图表配置项
    getOptions(chartData) {
      // 传入数据格式模板
      var timeData = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
      var dataOneList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
      var dataTwoList = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10"
      ].reverse();
      const allData = {
        dataName: [...timeData],
        dataValue: [[...dataOneList], [...dataTwoList]]
      };

      if (!chartData.dataName) {
        chartData = allData;
      }
      let serizes = this.legend.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          smooth: this.smooth,
          symbolSize: 2,
          showSymbol: false,
          emphasis: {
            focus: "series"
          },
          itemStyle: {
            normal: {
              color: item.itemColor,
              lineStyle: {
                color: item.itemColor,
                width: 2
              }
            }
          },
          areaStyle: item.areaColor
            ? {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: item.areaColor[0]
                  },
                  {
                    offset: 1,
                    color: item.areaColor[1]
                  }
                ])
              }
            : {
                opacity: 0
              },
          data: chartData.dataValue[index]
        };
      });
      var option = {
        // grid: {
        //   top: "40",
        //   left: "2%",
        //   right: "2%",
        //   bottom: "0",
        //   containLabel: true,
        // },
        // backgroundColor: "rgba(128, 128, 128, 0)",
        // tooltip: {
        //   trigger: "axis",
        //   axisPointer: {
        //     // Use axis to trigger tooltip
        //     type: "shadow",
        //   },
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          top: "10",
          show: this.showLegend,
          itemWidth: 9,
          itemHeight: 5,
          data: this.legend.map(e => {
            return {
              name: e.name,
              icon: "rect", //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
              itemWidth: 9, // 设置宽度
              itemHeight: 1, // 设置高度
              itemGap: 20, // 设置间距
              textStyle: {
                color: "#ffffff"
              }
            };
          }),
          textStyle: {
            fontSize: 14 //字体大小
          }
        },
        xAxis: {
          type: "category",
          data: chartData.dataName,
          axisLabel: {
            interval: this.axisInterval,
            color: "#91A3CE",
            fontSize: 14
          },
          axisTick: {
            show: false
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "#ffffff",
              opacity: "0.18"
            }
          }
        },
        yAxis: {
          // name: "%",
          nameTextStyle: {
            // padding: [0, 0, -10, 21],
            color: "#91A3CE"
          },
          type: "value",
          axisLine: {
            show: false,
            lineStyle: {
              color: "#01ACAE"
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            fontSize: 14,
            color: "#91A3CE", //刻度线标签颜色
            fontSize: 14
          },
          splitLine: {
            show: true,
            lineStyle: {
              // color: "#01ACAE",
              color: "#ffffff",
              type: "solid",
              opacity: 0.18
            }
          }
        },
        series: serizes
      };
      return option;
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler: function(newValue, oldValue) {
        console.log(newValue, "++++");
        //初始化数据
        let option = this.getOptions(newValue);
        this.twoLineChart.hideLoading();
        this.twoLineChart.setOption(option);
      }
    }
  },
  //注销window.onresize事件
  destroyed() {
    window.onresize = null;
  }
};
</script>
<style lang="less" scoped>
.LineChart_chart {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
