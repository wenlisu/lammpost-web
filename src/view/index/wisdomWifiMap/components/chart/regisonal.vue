<template>
  <!-- AP负载统计 -->
  <div class="com-container">
    <div class="com-chart" ref="lamp_brightness"></div>
  </div>
</template>

<script>
import layer from "../../images/layer.png";
import { getLocal } from "util/tool";
export default {
  data() {
    return {
      chartInstance: "",
      allData: [],
      pieItem: [],
    };
  },
  props: {
    seriesData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    seriesData: {
      handler(newValue, oldValue) {
        this.getData(newValue);
      },
      deep: true,
    },
  },
  mounted() {
    this.initChart();
    // this.getData();
    window.addEventListener("resize", this.sreenAdapter);
    this.sreenAdapter();
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(
        this.$refs.lamp_brightness,
        "chalk"
      );
      const initOption = {
        backgroundColor: "transparent",
        grid: {
          // bottom: "10%",
          right: 0,
          left: 0,
        },
        color: ["#5B80F9", "#03FBEF", "#26FAB4", "#F6ED1D", "#FF794D"],
        graphic: {
          elements: [
            {
              type: "image",
              z: 3,
              style: {
                image: layer,
                width: 103,
                height: 122,
              },
              left: "center",
              top: "center",
              position: [100, 100],
            },
          ],
        },
        legend: {
          orient: "vertical",
          icon: "circle",
          textStyle: {
            color: "#91A3CE",
          },
          right: "10%",
          top: "center",
        },
        tooltip: {
          show: true,
        },
        toolbox: {
          show: false,
        },
      };
      this.chartInstance.setOption(initOption);
    },
    getData(newValue) {
      let data = [
        { name: "2.4G用户", value: Number(newValue.fiveGApLoad) },
        { name: "5G用户", value: Number(newValue.towGApLoad) },
      ];
      this.upDataChart(data);
    },
    upDataChart(data) {
      let that = this;
      const pieItem = [...this.pieItem];
      const dataOption = {
        series: [
          {
            type: "pie",
            name: "",
            radius: ["60%", "75%"],
            // center: ['50%', '50%'],
            hoverAnimation: true,
            labelLine: {
              show: false,
            },
            label: {
              show: false,
            },
            data: data,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    sreenAdapter() {
      const adapterOption = {};
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
};
</script>

<style scoped>
.com-container {
  height: calc(100% - 70px);
}
</style>