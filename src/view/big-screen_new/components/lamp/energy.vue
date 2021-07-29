<template>
  <!-- 照明灯能耗分析  -->
  <div class="com-container">
    <div class="com-chart" ref="lamp_energy"></div>
  </div>
</template>

<script>
import * as echarts from "echarts"; // 引入echarts
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
    this.getData();
    window.addEventListener("resize", this.sreenAdapter);
    this.sreenAdapter();
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.lamp_energy, "chalk");
      const initOption = {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(0, 255, 233,0)",
                  },
                  {
                    offset: 0.5,
                    color: "rgba(255, 255, 255,1)",
                  },
                  {
                    offset: 1,
                    color: "rgba(0, 255, 233,0)",
                  },
                ],
                global: false,
              },
            },
          },
        },
        grid: {
          top: "15%",
          left: "0%",
          right: "5%",
          bottom: "15%",
          containLabel: true,
        },
        legend: {
          show: true,
          top: 10,
          icon: "stack",
          textStyle: {
            color: "#fff",
            fontSize: 14,
          },
          itemWidth: 9,  // 设置宽度
          itemHeight:5, // 设置高度
          itemGap: 12 // 设置间距
        },
        xAxis: [
          {
            type: "category",
            axisLine: {
              show: false,
              color: "rgba(255,255,255,0.18)",
            },

            axisLabel: {
              color: "rgba(145,163,206,1)",
              width: 100,
              fontSize: 14,
            },
            splitLine: {
              show: false,
            },
            boundaryGap: false,
          },
        ],
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
                fontSize: 14,
              },
            },
            axisTick: {
              show: false,
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    getData() {
      let energyData = getLocal("bigScreenNew")["lampEnergy"][
        "lampStaticsPowerDto"
      ];
      let dataName = [];
      let dataValue_usingPower = [];
      let dataValue_savingPower = [];
      let dataValue_ratedPower = [];
      if (energyData) {
        energyData.map((item) => {
          dataName.push(item.time);
          dataValue_usingPower.push(item.usingPower);
          dataValue_savingPower.push(item.savingPower);
          dataValue_ratedPower.push(item.ratedPower);
        });
      }
      this.allData = {
        dataName: [...dataName],
        dataValue_usingPower: [...dataValue_usingPower],
        dataValue_savingPower: [...dataValue_savingPower],
        dataValue_ratedPower: [...dataValue_ratedPower],
      };
      this.upDataChart();
    },
    upDataChart() {
      // 类目轴是数据
      const dataName = this.allData.dataName;
      // Y轴数据
      const dataValue = this.allData.dataValue;
      const dataOption = {
        xAxis: {
          data: dataName,
        },
        series: [
          {
            name: "实际用电量",
            type: "line",
            showAllSymbol: true,
            smooth: false,
            // symbol: "circle",
            // symbolSize: 10,
            lineStyle: {
              normal: {
                color: "#5BD8F9",
              },
            },
            label: {
              show: false,
              position: "top",
              textStyle: {
                color: "#5BD8F9",
              },
            },
            itemStyle: {
              color: '#5BD8F9',
              borderColor: "#5BD8F9",
              borderWidth: 2,
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(91,216,249,.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(43,193,145,0)",
                    },
                  ],
                  false
                ),
              },
            },
            data: this.allData.dataValue_usingPower, //data.values
          },
          {
            name: "节能用电量",
            type: "line",
            showAllSymbol: true,
            smooth: false,
            // symbol: "circle",
            // symbolSize: 10,
            lineStyle: {
              normal: {
                color: "#5AD8A6",
              },
            },
            label: {
              show: false,
              position: "top",
              textStyle: {
                color: "#5AD8A6",
              },
            },
            itemStyle: {
              color: '#5AD8A6',
              borderColor: "#5AD8A6",
              borderWidth: 2,
            },
            // areaStyle: {
            //   normal: {
            //     color: '#5AD8A6',
            //   },
            // },
            data: this.allData.dataValue_savingPower, //data.values
          },
          {
            name: "总耗电量",
            type: "line",
            showAllSymbol: true,
            smooth: false,
            // symbol: "circle",
            // symbolSize: 10,
            lineStyle: {
              normal: {
                color: "#DA7BFF",
              },
            },
            label: {
              show: false,
              position: "top",
              textStyle: {
                color: "#DA7BFF",
              },
            },
            itemStyle: {
              color: "#DA7BFF",
              borderColor: "#DA7BFF",
              borderWidth: 2,
            },
            // areaStyle: {
            //   normal: {
            //     color: '#DA7BFF',
            //   },
            // },
            data: this.allData.dataValue_ratedPower, //data.values
          },
        ],
      };
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