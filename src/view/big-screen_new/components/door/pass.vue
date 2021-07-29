<template>
  <div class="com-container">
    <div class="com-chart" ref="lamp_brightness"></div>
  </div>
</template>

<script>
import * as echarts from "echarts"; // 引入echarts
import layerPass from "../../images/layer_pass2.png";
import { getLocal } from "util/tool";
export default {
  data() {
    return {
      chartInstance: "",
      allData: [],
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

      var option = {
        backgroundColor: "transparent",
        color: [
          {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(0,255,118,1)",
              },
              {
                offset: 1,
                color: "rgba(102,255,169,1)",
              },
            ],
            global: false,
          },
          {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(38,235,225,1)",
              },
              {
                offset: 1,
                color: "rgba(33,237,221,1)",
              },
            ],
            global: false,
          },
        ],
        tooltip: {
          show: true,
        },
        grid: {
          top: "5%",
          left: "0%",
          containLabel: false,
        },
        graphic: {
          elements: [
            {
              type: "image",
              z: 3,
              style: {
                image: layerPass,
                width: 81,
                height: 82,
              },
              left: "center",
              top: "center",
            },
          ],
        },
        legend: {
          icon: 'rect',
          show: true,
          orient: "vertical",
          bottom: "5%",
          left: "center",
          itemWidth: 14,
          itemHeight: 14,
          textStyle: {
            color: "#fff",
          },
        },
        xAxis: [
          {
            show: false,
          },
        ],
        yAxis: [
          {
            type: "category",
            inverse: false,
            z: 3,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
              inside: false,
              textStyle: {
                color: "RGB(78,184,252)",
                fontSize: 25,
              },
              show: false,
            },
            // data: optionData.yAxis
          },
        ],
      };

      this.chartInstance.setOption(option);
    },
    getData() {
      let infoData = getLocal("bigScreenNew")["doorAccessInfo"];
      let data;
      let sum = 0;
      if (infoData) {
        data = [
          {
            name: "身份证验证",
            value: Number(infoData["idCardVerifyRatio"].split("%")[0]),
          },
          {
            name: "人脸验证",
            value: Number(infoData["faceVerifyCountRatio"].split("%")[0]),
          },
        ];
        data.map((item) => {
          sum += item.value;
        });
      }
      this.allData = {
        data: [...data],
        sum: sum,
      };
      this.upDataChart();
    },
    upDataChart() {
      let series = [];
      let { data, sum } = this.allData;
      for (let i = 0; i < data.length; i++) {
        series.push({
          name: data[i].name,
          type: "pie",
          clockWise: true,
          z: 2,
          hoverAnimation: false,
          radius: [59 - i * 15 + "%", 54 - i * 15 + "%"],
          center: ["50%", "50%"],
          label: {
            show: false,
            position: "outside",
            formatter: "{a|{b}：{d}%}\n{hr|}",
            rich: {
              a: {
                color: "#fff",
                fontSize: 13,
                padding: [10, 0, 0, -110],
              },
            },
          },
          labelLine: {
            normal: {
              length: 70 + i * 135,
              length2: 100,
              lineStyle: {
                width: 1,
              },
            },
          },
          data: [
            {
              value: data[i].value,
              name: data[i].name,
            },
            {
              value: sum - data[i].value,
              name: "",
              itemStyle: {
                color: "rgba(0,0,0,0)",
                borderWidth: 0,
              },
              tooltip: {
                show: false,
              },
              label: {
                show: false,
              },
              hoverAnimation: false,
            },
          ],
        });
        series.push({
          name: "背景线",
          type: "pie",
          silent: true,
          z: 1,
          clockWise: true,
          hoverAnimation: false,
          radius: [58 - i * 15 + "%", 56.5 - i * 15 + "%"],
          center: ["50%", "50%"],
          label: {
            show: false,
          },
          itemStyle: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            borderWidth: 5,
            color: "rgba(46,72,111,1)",
          },
          data: [
            {
              value: 100,

              tooltip: {
                show: false,
              },
              hoverAnimation: false,
            },
          ],
        });
      }
      const dataOption = {
        legend: {
          formatter: function (name) {
            let value;
            data.map((item) => {
              if (item.name == name) {
                value = name + "    " + item.value + '%';
              }
            });
            return value;
          },
        },
        series: series,
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