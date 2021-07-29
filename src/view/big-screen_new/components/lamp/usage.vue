<template>
  <div class="com-container">
    <div class="com-chart" ref="lamp_usage"></div>
  </div>
</template>

<script>
import * as echarts from "echarts"; // 引入echarts
import { getLocal } from "util/tool";
export default {
  data() {
    return {
      chartInstance: '',
      allData: {}
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.sreenAdapter)
    this.sreenAdapter()
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.lamp_usage, 'chalk')
      const initOption= {
        backgroundColor:'transparent',
        tooltip: {},
        grid: {
          top: '20%',
          left: '2%',
          right: '5%',
          bottom: '15%',
          containLabel: true
        },
        legend: {
          icon: 'rect',
          top:"4%",
          textStyle: {
            color: "#fff",
            fontSize: 14
          },
          itemStyle: {
          },
          itemWidth: 12,  // 设置宽度
          itemHeight:12, // 设置高度
          itemGap: 12 // 设置间距
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            margin: 10,
            color: 'rgba(145,163,206,1)',
            textStyle: {
              fontSize: 14,
              color: 'rgba(145,163,206,1)'
            },
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.18)',
            }
          },
          axisTick: {
            show: false
          },
          boundaryGap: false
        },
        yAxis: [
          {
            type: "value",
            min: 0,
            splitNumber: 4,
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(255,255,255,0.18)",
                opacity: 0.23,
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
                fontSize: 14
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
      }
      this.chartInstance.setOption(initOption)
    },
    getData () {
      let usageData = getLocal("bigScreenNew")["lampWork"][
        "lampStaticsUseDto"
      ];
      let getsyzl = []
      let getlkrs = []
      let getlkrw = []
      if(usageData) {
        usageData.map(item => {
          getsyzl.push(item.time)
          getlkrw.push(item.workScale)
          getlkrs.push(item.faultScale)
        })
      }
      this.allData = {
        getsyzl: [...getsyzl],
        getlkrs: [...getlkrs],
        getlkrw: [...getlkrw]
      }
      this.upDataChart()
    },
    upDataChart () {
      // 类目轴是数据
      const {getsyzl, getlkrs, getlkrw} = this.allData
      const dataOption = {
        xAxis: {
          data: getsyzl
        },
        series: [{
          name: "亮灯率",
          type: 'bar',
          data: getlkrw,
          barWidth: '7px',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(40,165,158,1)' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: 'rgba(36,237,255,0)' // 100% 处的颜色
                }], false),
              }
            },
          },{
          name: "离线率",
          type: 'bar',
          data: getlkrs,
          barWidth: '7px',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(238,181,1,1)' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: 'rgba(255,186,51,0.1)' // 100% 处的颜色
                }], false),
              }
            },
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    sreenAdapter () {
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style>

</style>