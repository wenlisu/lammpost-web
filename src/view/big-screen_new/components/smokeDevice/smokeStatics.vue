<!-- 烟感立体柱状图 -->
<template>
  <div class="com-container">
    <div :id="chartId" class="com-chart"></div>
  </div>
</template>
<script>
import echarts from "echarts"; //引入echarts
export default {
  name: "cubeBarChart",
  components: {},
  props: {
    chartData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      cubeBarChart: null,
      chartId: "barChartId"
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initCubeBarChart();
    })
  },
  methods: {
    initCubeBarChart() {
      this.cubeBarChart = echarts.init(document.getElementById(this.chartId));
      this.cubeBarChart.showLoading();
      let that = this;
      window.addEventListener("resize", () => that.cubeBarChart.resize(), true);
      this.cubeBarChart.hideLoading();
      const options = that.getOptions(that.chartData);
      this.cubeBarChart.setOption(options);
    },
    // 图表配置项
    getOptions(chartData) {
      // 数据格式模板
      const timeData = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15"
      ];
      const data = [
        220,
        182,
        191,
        234,
        290,
        330,
        310,
        310,
        220,
        182,
        191,
        234,
        290,
        330,
        310
      ];
      let timeArr = [],
        valuesArr = [];
      if (!chartData || !chartData.length) {
        timeArr = timeData;
        valuesArr = data;
      } else {
        // 处理数据格式
        timeArr = chartData[0];
        valuesArr = chartData[1];
      }
      // 指定图表的配置项和数据
      var option = {
        roam: false, // 禁止滚轮事件
        tooltip: {
          show: true
        },
        /* grid: {
          top: "15",
          left: "2%",
          right: "2%",
          bottom: "10%",
          containLabel: true
        }, */
        xAxis: {
          axisLabel: {
            interval: 0, //横轴信息全部显示
            rotate: 0, //0度角倾斜显示
            show: true,
            textStyle: {
              color: "#91A3CE",
              fontSize: 14
            }
          },
          axisLine: {
            lineStyle: {
              color: "#ffffff",
              type: "solid",
              opacity: 0.18
            }
          },
          axisTick: {
            show: false
          },
          data: timeArr
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
            color: "#91A3CE" //刻度线标签颜色
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#ffffff",
              type: "solid",
              opacity: 0.18
            }
          }
          // boundaryGap: [20, 20]
        },
        series: [
          {
            name: "次数",
            tooltip: {
              show: true
            },
            data: valuesArr,
            type: "bar",
            barWidth: 6,
            barGap: 0,
            barCategoryGap: 200,
            // 基准线
            // markLine: {
            //   silent: true, // 不响应鼠标事件
            //   symbol: ["none", "none"],
            //   position: "top",
            //   label: {
            //     show: false,
            //   },
            //   lineStyle: {
            //     show: false,
            //     normal: {
            //       color: "#D3D3D3", // 这儿设置安全基线颜色
            //     },
            //   },
            //   data: [
            //     {
            //       name: "平均线",
            //       // 支持 'average', 'min', 'max'
            //       type: "average",
            //     },
            //   ],
            // },
            label: {
              show: false, // 柱子顶部的数值
              position: "top",
              top: 0,
              fontSize: 6,
              offset: [0, -10],
              formatter: function(params) {
                let num = params.value;
                if (num > 1024) {
                  return (num / 1024).toFixed(2) + "GB";
                } else if (num < 1024 && num > 0) {
                  return num.toFixed(2) + "MB";
                } else {
                  return "";
                }
              }
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    {
                      offset: 0,
                      color: "rgba(133,239,241,0)" // 0% 处的颜色
                    },
                    // {
                    //   offset: 0.5,
                    //   color: "#3077F7", // 50% 处的颜色
                    // },
                    {
                      offset: 1,
                      color: "rgba(78,219,223,1)" // 100% 处的颜色
                    }
                  ],
                  false
                )
              }
            }
            // barGap: 0
          },
          {
            type: "bar",
            barWidth: 6,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [
                    {
                      offset: 0,
                      color: "rgba(133,239,241,0)" // 0% 处的颜色
                    },
                    // {
                    //   offset: 0.5,
                    //   color: "#59ACF7", // 50% 处的颜色
                    // },
                    {
                      offset: 1,
                      color: "rgba(12,163,167,1)" // 100% 处的颜色
                    }
                  ],
                  false
                )
              }
            },
            barGap: 0,
            data: valuesArr.map(item => item)
          },
          {
            name: "b",
            tooltip: {
              show: false
            },
            type: "pictorialBar",
            itemStyle: {
              borderWidth: 0,
              borderColor: "rgba(146,245,255,1)",
              color: "rgba(146,245,255,1)"
            },
            // symbol: "path://M 0,0 l 120,0 l -30,60 l -120,0 z",
            symbol: "diamond",
            symbolSize: ["12", "5"],
            symbolOffset: ["0", "-2"], // 左右 ，上下
            symbolRotate: 0,
            symbolPosition: "end",
            data: valuesArr,
            z: 3
          }
        ]
        // 可左右滑动
        // dataZoom: [
        //   {
        //     show: false,
        //     realtime: true,
        //     start: 30,
        //     end: 50,
        //   },
        //   {
        //     type: "inside",
        //     realtime: false,
        //     start: 30,
        //     end: 50,
        //     zoomOnMouseWheel: false, // 禁用滚轮
        //   },
        // ],
      };
      return option;
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler: function(newValue, oldValue) {
        console.log(newValue, "++++===");
        //初始化数据
        let option = this.getOptions(newValue);
        this.cubeBarChart.hideLoading();
        this.cubeBarChart.setOption(option);
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
</style>
