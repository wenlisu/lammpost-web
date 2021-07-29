<!-- 烟感浓度指标两条平滑面积折线图 -->
<template>
  <div class="com-container">
    <lineChart
      :chartData="smokeConcentData"
      :chartId="'smokeConcent'"
      :legend="legendData"
      :smooth="true"
      :axisInterval="1"
    />
  </div>
</template>
<script>
import lineChart from "../comLineChart";
import { getLocal } from "util/tool";
export default {
  name: "smokeConcent",
  props: {},
  components: {
    lineChart,
  },
  data() {
    return {
      smokeConcentData: [],
      legendData: [
        {
          id: "high",
          name: "最高浓度",
          itemColor: "#AD6BEF",
          areaColor: ["rgba(173,107,239,.5)", "rgba(173,107,239,.1)"],
        },
        {
          id: "low",
          name: "最低浓度",
          itemColor: "#5AD7D8",
          // areaColor: ,
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
          dataValueMax.push(item.maxSmokeConcentration)
          dataValueMin.push(item.minSmokeConcentration)
        })
      }
      this.smokeConcentData = {
        dataName: [...dataName],
        dataValue: [[...dataValueMax], [...dataValueMin]]
      }
    },
  },
  watch: {},
};
</script>
<style lang="less" scoped>
</style>
