<template>
  <PieChart :chartData="pieData" />
</template>

<script>
import PieChart from "./staticsPieChart";
import { getLocal } from "util/tool";
export default {
  data() {
    return {
      pieData: [],
    };
  },
  components: {
    PieChart,
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      let ambientData = getLocal("bigScreenNew")["ambientAlarmAnalysis"];
      if (ambientData) {
        let data = [
          {
            value: Number(ambientData.temperatureAlarmRatio.split("%")[0]),
            name: "温度上限告警",
          },
          {
            value: Number(ambientData.humidityAlarmRatio.split("%")[0]),
            name: "湿度上限告警",
          },
          {
            value: Number(ambientData.noiseAlarmRatio.split("%")[0]),
            name: "噪声上限告警",
          },
          {
            value: Number(ambientData.pmAlarmRatio.split("%")[0]),
            name: "PM2.5上限告警",
          },
          {
            value: Number(ambientData.pmTenAlarmRatio.split("%")[0]),
            name: "PM10上限告警",
          },
        ];
        this.pieData = [...data]
      }
    },
  },
};
</script>

<style>
</style>