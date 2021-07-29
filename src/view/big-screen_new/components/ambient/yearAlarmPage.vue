<template>
  <YearAlarm :chartData="barData"/>
</template>

<script>
import YearAlarm from "./yearAlarm";
import { getLocal } from "util/tool";
export default {
  data() {
    return {
      barData: {},
    };
  },
  components: {
    YearAlarm,
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      let ambientData = getLocal("bigScreenNew")["ambientAlarmAnalysisY"];
      let dataName = []
      let dataValue = []
      if (ambientData && ambientData.length) {
        ambientData.map(item => {
          dataName.push(item.simpleTimeAxis)
          dataValue.push({
            name: item.simpleTimeAxis,
            value: item.alarmCount
          })
        })
        this.barData = {
          dataName: dataName,
          dataValue: dataValue
        }
      }
    },
  },
};
</script>

<style>
</style>