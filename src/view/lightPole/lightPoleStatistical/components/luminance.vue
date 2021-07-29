<template>
  <!-- 灯杆照明亮度分析 -->
  <div id="luminance"></div>
</template>

<script>
import * as echarts from "echarts"; // 引入echarts
import { getLocal } from "util/tool";
import { getAlarmInfoCount } from "@/api/wisdomWarn";
import {
  getLampBrightnessCount,
} from "api/lightPoleStatistical/index";
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
      this.chartInstance = this.$echarts.init(document.getElementById('luminance'), "chalk");
      const initOption = {
        backgroundColor: "transparent",
        tooltip: {
          show: true,
          trigger: "axis",
          formatter: "{a} <br/>{b} :{d}%", // formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          icon: "rect",
          itemWidth: 14,
          itemHeight: 10,
          textStyle: {
            color: "#FFFFFF",
          },
          bottom: "6%",
          right: "5%",
        },
        color: ["#4CDB9F", "#4880FF", "#FF7079", "#03FBEF"],
        grid: {
          bottom: "8%",
          right: 0,
          left: 0,
        },
        labelLine: {
          show: true,
        },
      };
      this.chartInstance.setOption(initOption);
      // 默认选中突出
      this.chartInstance.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: 0,
      });
    },
    async getData() {
      let res = await getLampBrightnessCount();
      if (res.code === "200") {
        const { data } = res;
        let result = data.map(item => {
          return {
            value: item.brightnessCount || 0,
            name: item.brightnessValue + '%亮度'
          }
        })
        this.upDataChart(result);
      }
    },
    upDataChart(data) {
      // 类目轴是数据
      // const dataName = this.allData.dataName;
      // Y轴数据
      // const dataValue = this.allData.dataValue;
      const dataOption = {
        series: [
          {
            name: "灯杆照明亮度分析",
            type: "pie",
            radius: "56%",
            center: ["50%", "50%"],
            // roseType: "radius",
            itemStyle: {
              normal: {
                shadowColor: "rgba(166,185,200,0.42)",
                shadowBlur: 8,
              },
            },
            label: {
              show: true,
              formatter: "{d}%",
              textStyle: {
                color: "#FFFFFF",
                fontFamily: "DINAlternate",
                fontWeight: 700,
              },
            },
            data: data,
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

<style scoped>
#luminance {
  height: 100%;
  width: 100%;
}
</style>