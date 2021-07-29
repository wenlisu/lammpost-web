<template>
  <SmokeStatics :chartData="cData" />
</template>

<script>
import SmokeStatics from "./smokeStatics";
import { getLocal } from "util/tool";
export default {
  components: {
    SmokeStatics
  },
  data() {
    return {
      cData: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    transformText(val) {
      switch (val) {
        case "Jan":
          return "1";
          break;
        case "Feb":
          return "2";
          break;
        case "Mar":
          return "3";
          break;
        case "Apr":
          return "4";
          break;
        case "May":
          return "5";
          break;
        case "Jun":
          return "6";
          break;
        case "Jul":
          return "7";
          break;
        case "Aug":
          return "8";
          break;
        case "Sep":
          return "9";
          break;
        case "Oct":
          return "10";
          break;
        case "Nov":
          return "11";
          break;
        case "Dec":
          return "12";
          break;
        default:
          break;
      }
    },
    getData() {
      let smokeData = getLocal("bigScreenNew")["smokeAlarmCount"];
      let dataName = [];
      let dataValue = [];
      if (smokeData && smokeData.length) {
        smokeData.map(item => {
          dataName.push(this.transformText(item.simpleTimeAxis));
          dataValue.push(item.alarmCount);
        });
      }
      this.cData = [[...dataName], [...dataValue]];
    }
  }
};
</script>

<style>
</style>