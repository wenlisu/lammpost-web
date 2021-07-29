<!-- 烟感温度指标两条直线面积折线图 -->
<template>
  <div class="com-container">
    <lineChart
      :chartData="smokeLineChartData"
      :chartId="'smokeTemp'"
      :legend="legendData"
      :smooth="false"
      :axisInterval="1"
    />
  </div>
</template>
<script>
import echarts from "echarts"; //引入echarts
import lineChart from "../comLineChart";
import { getLocal } from "util/tool";
export default {
  name: "smokeLineChart",
  props: {
    chartData: {
      type: Array,
      default() {
        return [];
      },
    },
    title: {
      type: String,
      default: "",
    },
    chartId: {
      type: String,
      default: "",
    },
    // 是否为平滑曲线折线，默认是true
    smooth: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    lineChart,
  },
  data() {
    return {
      smokeLineChartData: {},
      legendData: [
        {
          id: "high",
          name: "最高温度",
          itemColor: "#F9825B",
        },
        {
          id: "low",
          name: "最低温度",
          itemColor: "#5BF9BB",
          areaColor: ["rgba(0,187,87,0.34)", "rgba(0,187,87,0.1)"],
        },
      ],
    };
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      let smokeData = getLocal("bigScreenNew")["smokeTrendStat"]
      let dataName = []
      let dataValueMax = []
      let dataValueMin = []
      if(smokeData && smokeData.length) {
        smokeData.map(item => {
          dataName.push(item.simpleTimeAxis)
          dataValueMax.push(item.maxTemperatureValue)
          dataValueMin.push(item.minTemperatureValue)
        })
      }
      this.smokeLineChartData = {
        dataName: [...dataName],
        dataValue: [[...dataValueMax], [...dataValueMin]]
      }
    },
  },
  watch: {},
  //注销window.onresize事件
  destroyed() {
    window.onresize = null;
  },
};
</script>
<style lang="less" scoped>
</style>
