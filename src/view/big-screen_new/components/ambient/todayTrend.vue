<!-- 今日指标趋势 -->
<template>
  <div class="com-container">
    <lineChart
      :chartData="chartData"
      :chartId="'todayTrendId'"
      :legend="legendData"
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
          name: "温度(℃)",
          itemColor: "#FFE86D",
          // areaColor: ["rgba(173,107,239,.5)", "rgba(173,107,239,.1)"],
        },
        {
          id: "2",
          name: "湿度(%)",
          itemColor: "#72FF73",
        },
        {
          id: "3",
          name: "噪声(分贝)",
          itemColor: "#D59EFF",
        },
        {
          id: "4",
          name: "PM2.5(ug/m³)",
          itemColor: "#FF8872",
        },
        {
          id: "5",
          name: "PM10(ug/m³)",
          itemColor: "#33EBFF",
          areaColor: ["rgba(51,235,255,0.73)", "rgba(51,235,255,0)"],
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
      // this.smokeConcentData
      let ambientData = getLocal("bigScreenNew")["ambientToday"];
      let dataName = []
      let dataValue = [[],[],[],[],[]]
      if(ambientData && ambientData.length) {
        ambientData.map(item => {
          dataName.push(item.simpleTimeAxis)
          dataValue[0].push(item.maxTemperatureValue)
          dataValue[1].push(item.maxHumidityValue)
          dataValue[2].push(item.maxNoiseValue)
          dataValue[3].push(item.maxPmValue)
          dataValue[4].push(item.maxPmTenValue)
        })
      }
      this.chartData = {
        dataName: [...dataName],
        dataValue: [...dataValue],
      };
    },
  },
  watch: {},
};
</script>
<style lang="less" scoped>
</style>
