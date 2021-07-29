<template>
  <div id="smokeRight" :class="{ componentView: true, show: show }">
    <div class="part_3">
      <ChartTitle partTitle="烟感设备本年度告警次数统计"/>
      <SmokeAlarmCount />
    </div>
    <div class="parat_4">
      <ChartTitle partTitle="烟感设备告警消息"/>
      <SmokeTable />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import * as echarts from "echarts"; // 引入echarts
import ChartTitle from '../../components/chartTitle/index'
import SmokeAlarmCount from '../../components/smokeDevice/smokeAlarmCount'
import SmokeTable from '../../components/smokeDevice/smokeTable'

// import './js/aframe.min.js';
import store from "@/store";
import {
  screenEnergyConsump,
} from "api/screen/index";

export default {
  data() {
    return {
      
    };
  },
  components: {
    ChartTitle,
    SmokeAlarmCount,
    SmokeTable
  },
  computed: {
    ...mapGetters(["common", "openPage"]),
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapMutations(["set_common"]),
    getInit() {
      this._screenEnergyConsump();
    },
    // 灯杆能耗状态
    _screenEnergyConsump() {
      let params = {
        area: "",
        city: "",
        type: null,
      };
      screenEnergyConsump(params).then((res) => {
        const { data } = res;
        this.data_2 = {
          ...data,
          // statisticsTime: moment(data.statisticsTime).format('YYYY-MM-DD HH:mm:ss')
        };
        this.$nextTick(() => {
          this.init2();
        });
      });
    },
    init2() {
      let option = null;

      let colors = ["#FFA81C", "#EA2E18", "#42E3FF", "#9035DF"];
      let chartData = [
        ["节能能耗/度", parseInt(this.data_2.energySaving)],
        ["总能耗/度", parseInt(this.data_2.totalEnergy)],
        ["节能率", parseInt(this.data_2.energySavingRate)],
        ["故障率", parseInt(this.data_2.failureRate)],
      ];
      option = {
        ...this.chart1Options,
        colors: colors,
        series: [
          {
            type: "pie",
            name: "能耗状态",
            data: chartData,
          },
        ],
      };
      this.chart1Options = option;
    },
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      // this.getInit();
    });
  },
  created() {},
  destroyed() {},
};
</script>
<style lang="less">
#smokeRight {
  height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .part_3 {
    width: 100%;
    height: 50%;
    overflow: hidden;
  }
  .parat_4 {
    width: 100%;
    height: 50%;
    overflow: hidden;
  }
}
</style>
