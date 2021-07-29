<template>
  <!-- 门禁本月通过人员类型统计 -->
  <div class="com-container">
    <div class="com-chart" ref="door_types"></div>
  </div>
</template>

<script>
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
    this.getData()
    window.addEventListener("resize", this.sreenAdapter);
    this.sreenAdapter();
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.door_types, "chalk");

      const initOption = {
        backgroundColor: "transparent",
        color: ["#FF50B7"],
        tooltip: {
          show: false, // 弹层数据去掉
        },
        radar: {
          center: ["50%", "50%"], // 外圆的位置
          radius: "55%",
          name: {
            textStyle: {
              color: "#fff",
              fontSize: 12,
              fontWeight: 400,
              fontFamily: "PingFangSC-Regular,PingFang SC",
              fontStyle: "normal",
            },
            rich: {
              a: {
                fontSize: 14,
                color: "#fff",
                lineHeight: "22",
                // padding: [0, 5, 0, 5],
              },
              b: {
                color: "#41E1FF",
                fontSize: 16,
                // padding: [0, 0, 0, 5],
              },
              triggerEvent: true,
            }
          },
          
          splitArea: {
            // 坐标轴在 grid 区域中的分隔区域，默认不显示。
            show: true,
            areaStyle: {
              // 分隔区域的样式设置。
              color: "rgba(40,177,242,0.16)", // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
            },
          },
          axisLine: {
            // 指向外圈文本的分隔线样式
            lineStyle: {
              color: "rgba(255,255,255,0.2)",
            },
          },
          splitLine: {
            lineStyle: {
              type: "solid",
              color: "rgba(21,173,225,1)", // 分隔线颜色
              width: 1, // 分隔线线宽
            },
          },
        },
      };

      this.chartInstance.setOption(initOption);
    },
    getData() {
      // TODO:
      const indicator = [
        {
          name: "陌生人",
          max: 100,
          id: 'strangerCount'
        },
        {
          name: "黑名单人员",
          max: 100,
          id: 'blackListCount'
        },
        {
          name: "访客",
          max: 100,
          id: 'visitorCount'
        },
        {
          name: "白名单人员",
          max: 100,
          id: 'whiteListCount'
        },
      ]
      let typeData = getLocal("bigScreenNew")["doorAccessType"];
      const value = []
      if(typeData) {
        indicator.map(item => {
          value.push(typeData[item.id])
        })
      }
      this.allData['indicator'] = indicator
      this.allData['value'] = [...value]
      this.upDataChart();
    },
    upDataChart() {
      const dataOption = {
        radar: {
          indicator: this.allData['indicator'],
          name: {
            formatter: (a) => {
              let i;
              this.allData['indicator'].map((item, index) => {
                if(item.name == a) {
                  i = index
                }
              })
              if(a.length > 3) {
                return `{a| ${a}}\n{b| ${this.allData['value'][i]}}`;
              } else {
                return `{a| ${a}} {b| ${this.allData['value'][i]}}`;
              }
            }
          },
        },
        series: [{
          type: "radar",
          symbolSize: 5,
          data: [
            {
              // TODO:
              value: this.allData['value'],
              name: "",
              areaStyle: {
                normal: {
                  color: "rgba(255,46,159,0.56)",
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
                    width: 1,
                  },
                  opacity: 0.3,
                },
                emphasis: {
                  // 高亮时的样式
                  lineStyle: {
                    width: 5,
                  },
                  opacity: 0,
                },
              },
            },
          ],
        }]
      }

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