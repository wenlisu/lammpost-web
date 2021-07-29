<template>
  <div id="smokeLeft" :class="{ componentView: true, show: show }">
    <div class="part_1">
      <ChartTitle partTitle="当日烟雾浓度指标趋势分析"/>
      <SmokeConcent />
    </div>
    <div class="part_2">
      <ChartTitle partTitle="当日温度指标趋势分析"/>
      <SmokeTemp />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
let GD = require("common/js/map/guangdong.json");
import ChartTitle from '../../components/chartTitle/index'
import SmokeConcent from '../../components/smokeDevice/smokeConcent'
import SmokeTemp from '../../components/smokeDevice/smokeTemp'
export default {
  data() {
    return {
      screenEnergyConsump: {},
      chart1Options: {
        chart: {
          className: "chartBg",
          backgroundColor: "transparent",
          // plotBackgroundImage: pieBgImg,
          type: "pie",
          height: "215px",
          options3d: {
            enabled: true,
            alpha: 60,
            beta: 0,
          },
        },
        credits: {
          enabled: false,
        },
        legend: {
          align: "center",
        },
        title: {
          text: "",
        },
        tooltip: {
          pointFormat: "{series.value}",
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            depth: 25,
            dataLabels: {
              enabled: true,
              format: "{y}",
              connectorColor: "#1B6CCC",
              color: "#fff",
              style: {
                fontSize: "16px",
              },
            },
          },
        },
        series: [],
      },
    };
  },
  components: {
    ChartTitle,
    SmokeConcent,
    SmokeTemp
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["bigScreenNew", "openPage"]),
  },
  methods: {
    getInit() {
      if (this.bigScreenNew && this.bigScreenNew.screenEnergyConsump) {
        this.screenEnergyConsump = this.bigScreenNew.screenEnergyConsump;
        this.init2();
      }
    },
    init2() {
      let option = null;
      let colors = ["#FFA81C", "#EA2E18", "#42E3FF", "#9035DF"];
      let chartData = [
        [
          "节能能耗/度",
          parseInt(this.bigScreenNew.screenEnergyConsump.energySaving),
        ],
        [
          "总能耗/度",
          parseInt(this.bigScreenNew.screenEnergyConsump.totalEnergy),
        ],
        [
          "节能率",
          parseInt(this.bigScreenNew.screenEnergyConsump.energySavingRate),
        ],
        ["故障率", parseInt(this.bigScreenNew.screenEnergyConsump.failureRate)],
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
  watch: {
    bigScreenNew (val) {
      if (JSON.stringify(val.screenEnergyConsump) !== JSON.stringify(this.screenEnergyConsump)) {
        console.log('watch', val);
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getInit();
    });
  },
  created() {},
  destroyed() {},
};
</script>
<style lang="less">
#smokeLeft {
  height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .part_1 {
    width: 100%;
    height: 50%;
  }
  .part_2 {
    width: 100%;
    height: 50%;
  }
}
</style>
