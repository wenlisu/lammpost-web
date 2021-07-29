<template>
  <!-- 报警器处理情况 -->
  <div class="com-container">
    <div class="com-chart" ref="alarm_handle"></div>
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
      this.chartInstance = this.$echarts.init(this.$refs.alarm_handle, "chalk");
      const initOption = {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          formatter: "{a} <br/>{b} :{d}%", // formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ["#4CDB9F", "#4880FF", "#FF7079"],
        grid: {
          bottom: "10%",
          right: 0,
          left: 0
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
    getData() {
      // let weekData = getLocal("bigScreenNew")["audioStatisticsWeek"];
      // let dataName = [];
      // let dataValue = [];
      // if (weekData && weekData.length) {
      //   weekData.map((item) => {
      //     let splitArr = item.simplePlayTimeAxis.split("-");
      //     let newAxis = splitArr[1] + "-" + splitArr[2];
      //     dataName.push(newAxis);
      //     dataValue.push(item.sumplayCount);
      //   });
      // }
      // this.allData = {
      //   dataName: [...dataName],
      //   dataValue: [...dataValue],
      // };
      this.upDataChart();
    },
    upDataChart() {
      // 类目轴是数据
      // const dataName = this.allData.dataName;
      // Y轴数据
      // const dataValue = this.allData.dataValue;
      const dataOption = {
        series: [
          {
            name: "2020年中国春节后在线教育类APP新增用户城市分布",
            type: "pie",
            radius: "50%",
            center: ["50%", "50%"],
            // roseType: "radius",
            itemStyle: {
              normal: {
                shadowColor: "rgba(166,185,200,0.42)",
                shadowBlur: 8,
              },
            },
            data: [
              { value: 5.8, name: "一线城市" },
              { value: 12.4, name: "新一线城市" },
              { value: 12.9, name: "二线城市" },
            ],
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