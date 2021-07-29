<template>
  <!-- 报警器处理情况 -->
  <div class="com-container">
    <div class="com-chart" ref="alarm_handle"></div>
  </div>
</template>

<script>
import * as echarts from "echarts"; // 引入echarts
import { getLocal } from "util/tool";
import { getAlarmInfoCount } from "@/api/wisdomWarn";
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
      this.chartInstance = this.$echarts.init(this.$refs.alarm_handle, "chalk");
      const initOption = {
        backgroundColor: "transparent",
        tooltip: {
          show: true,
          trigger: "axis",
          formatter: "{a} <br/>{b} :{d}%", // formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "horizontal",
          icon: "rect",
          itemWidth: 14,
          itemHeight: 10,
          textStyle: {
            color: "#FFFFFF",
          },
          bottom: "6%",
          left: "center",
        },
        color: ["#4CDB9F", "#4880FF", "#FF7079"],
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
      let res = await getAlarmInfoCount({});
      if (res.code === "200") {
        const { data } = res;
        let result = [
          { value: data.dealed || 0, name: "已处理" },
          { value: data.undeal || 0, name: "未处理" },
          { value: data.alarming || 0, name: "报警中" },
        ];
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
            name: "2020年中国春节后在线教育类APP新增用户城市分布",
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
            // [
            //   { value: 5.8, name: "已处理" },
            //   { value: 12.4, name: "未处理" },
            //   { value: 12.9, name: "报警中" },
            // ],
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
      // this.chartInstance.dispatchAction({
      //   type: "highlight",
      //   seriesIndex: 1,
      //   dataIndex: 0,
      // });
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