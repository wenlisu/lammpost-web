<template>
  <div class="com-container">
    <div class="com-chart" ref="led_application">
      <!-- <highcharts :options="option" /> -->
    </div>
  </div>
</template>

<script>
import { getLocal } from "util/tool";
export default {
  data() {
    return {
      chartInstance: "",
      allData: {},
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
        this.$refs.led_application,
        "chalk"
      );
      const initOption = {
        backgroundColor: "transparent",
        color: [
          "rgba(72,236,187,1)",
          "rgba(54,208,248,1)",
          "rgba(74,134,246,1)",
          "rgba(89,94,241,1)",
          "rgba(76,66,213,1)",
        ],
        legend: {
          bottom: "5%",
          textStyle: {
            color: "#A1D5FF",
            fontSize: 14,
          },
          itemWidth: 9, // 设置宽度
          itemHeight: 5, // 设置高度
          itemGap: 12, // 设置间距
        },
        calculable: true,
        grid: {
          top: "20%",
          left: "5%",
          right: "10%",
          bottom: "3%",
          containLabel: true,
        },
      };
      this.chartInstance.setOption(initOption);
    },
    getData() {
      let programData = getLocal("bigScreenNew")["ledprogram"];
      let getlkrs = [];
      let sum = 0;
      let addUp = 0;
      let minHeight = 2; //最小高度
      let top = 5;
      let finalData;
      if (programData && programData.length) {
        sum = programData.reduce((pre, curr) => {
          return !isNaN(pre.programCount)
            ? pre.programCount + curr.programCount
            : pre + curr.programCount;
        });
        programData.map((item) => {
          getlkrs.push({
            value: item.programCount,
            name: item.programScenarioDesc,
          });
        });
        finalData = getlkrs.map((item) => {
          let itemValue = 0;
          if ((item.value / sum) * 100 < minHeight) {
            itemValue = minHeight;
          } else itemValue = Number(((item.value / sum) * 100).toFixed(2));
          typeof itemValue;
          top += itemValue;
          return {
            value: (addUp += itemValue),
            name: item.name,
            realValue: Number(((item.value / sum) * 100).toFixed(2)),
            itemStyle: {
              height: `${itemValue}%`,
            },
          };
        });
      }
      this.allData = {
        getlkrs: [...finalData],
        top,
      };
      this.upDataChart();
    },
    upDataChart() {
      const getlkrs = this.allData.getlkrs;
      const top = this.allData.top;
      const dataOption = {
        legend: {
          formatter: function (name) {
            let legendLabel = "";
            getlkrs.map((item, index) => {
              if (item.name == name) {
                legendLabel = name + " " + item.realValue + "%";
              }
            });

            return legendLabel;
          },
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            var res = params.name;
            res +=
              "<br>" +
              params.marker +
              params.seriesName +
              "：" +
              params.data.realValue + "%";
            return res;
          },
        },
        series: [
          {
            name: "DATA",
            type: "funnel",
            width: 214,
            left: "center",
            // right: 100,
            height: 222,
            top: '5%',
            // top: `${top - 100}%`,
            min: 0,
            maxSize: "100%",
            sort: "ascending",
            gap: 0,
            label: {
              show: false,
              position: "inside",
              fontSize: 14,
              fontWeight: "400",
              color: "#fff",
            },
            // labelLine: {
            //   length: 10,
            //   lineStyle: {
            //     width: 1,
            //     type: "solid",
            //   },
            // },
            itemStyle: {
              borderColor: "transparent",
              borderWidth: 0,
            },
            data: getlkrs,
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