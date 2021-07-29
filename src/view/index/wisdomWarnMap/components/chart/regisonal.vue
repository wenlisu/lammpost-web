<template>
  <!-- 报警地区分布 -->
  <div class="com-container">
    <div class="com-chart" ref="lamp_brightness"></div>
  </div>
</template>

<script>
import layer from "../../images/layer.png";
import { getLocal } from "util/tool";
import { getAlarmPosition } from "@/api/wisdomWarn";
export default {
  data() {
    return {
      chartInstance: "",
      allData: [],
      pieItem: [],
    };
  },
  mounted() {
    this.initChart();
    this.getData();
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
          bottom: "10%",
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
                width: 96,
                height: 72,
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
          itemWidth: 9,
          textStyle: {
            color: "#91A3CE",
          },
          right: "8%",
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
    async getData() {
      let res = await getAlarmPosition({});
      if (res.code === "200") {
        const { data } = res;
        let result = data.map((e) => {
          return {
            name: e.city || '未知地区',
            value: e.total,
          };
        });
        this.upDataChart(result);
      }
      // let data = [
      //   { name: "天河区", value: 100 },
      //   { name: "白云区", value: 100 },
      //   { name: "越秀区", value: 100 },
      //   { name: "黄埔区", value: 100 },
      //   { name: "番禺区", value: 100 },
      // ];
      // this.upDataChart(data);
    },
    upDataChart(data) {
      let that = this;
      const pieItem = [...this.pieItem];
      const dataOption = {
        series: [
          {
            type: "pie",
            name: "",
            clockwise: false,
            radius: ["50%", "60%"],
            // center: ['50%', '50%'],
            hoverAnimation: true,
            labelLine: {
              show: false,
            },
            label: {
              show: false,
            },
            data: data,
            // [
            //   { name: "公司1", value: 100 },
            //   { name: "公司2", value: 100 },
            //   { name: "公司3", value: 100 },
            //   { name: "公司4", value: 100 },
            // ],
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

<style>
</style>