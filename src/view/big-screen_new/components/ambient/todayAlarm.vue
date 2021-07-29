<!-- 今日报警次数分析 -->
<template>
  <div class="com-container">
    <lineChart
      :chartData="chartData"
      :chartId="'todayAlarmId'"
      :legend="legendData"
      :showLegend="false"
      :axisInterval="4"
    />
  </div>
</template>
<script>
import lineChart from "../comLineChart";
import { getLocal } from "util/tool";
export default {
  name: "todayTrend",
  props: {},
  components: {
    lineChart,
  },
  data() {
    return {
      chartData: {},
      legendData: [
        {
          id: "1",
          name: "报警次数",
          itemColor: "#FF914C",
          areaColor: ["rgba(255,134,81,0.53)", "rgba(255,134,81,0.00)"],
        },
      ],
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 获取数据
    getData() {
      let ambientData = getLocal("bigScreenNew")["ambientAlarmCount"]
      let dataName = []
      let dataValue = []
      if(ambientData && ambientData.length) {
        ambientData.map(item => {
          dataName.push(item.simpleTimeAxis)
          dataValue.push(item.alarmCount)
        })
      }
      this.chartData = {
        dataName: [...dataName],
        dataValue: [[...dataValue]],
      };
    },
  },
  watch: {},
};
</script>
<style lang="less" scoped>
</style>
