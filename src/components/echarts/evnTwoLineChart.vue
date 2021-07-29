<!-- 土壤检测信息2 -->
<template>
  <div class="evnTwoLineChart_chart_item">
    <div :id="chartId" class="evnTwoLineChart_chart"></div>
  </div>
</template>
<script>
import echarts from "echarts"; //引入echarts
export default {
  name: "evnTwoLineChart",
  props: {
    chartData: {
      type: Array,
      default() {
        return [];
      },
    },
    chartId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  mounted() {
    this.initevnTwoLineChart();
  },
  methods: {
    initevnTwoLineChart() {
      this.evnTwoLineChart = echarts.init(
        document.getElementById(this.chartId)
      );
      this.evnTwoLineChart.showLoading();
      let that = this;
      window.addEventListener(
        "resize",
        () => that.evnTwoLineChart.resize(),
        true
      );
    },
  },
  watch: {
    chartData(newValue, oldValue) {
      // 数据格式模板
      // var timeData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
      //   '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24',
      // ];
      // var dataOneList = [100, 32, 12, 34, 90, 33, 20, 50,45,57,41,12,
      // 12, 53, 3, 13, 19, 33, 21,51,27,12,45,55];
      // var dataTwoList = [12, 22, 32, 44, 50, 63, 70, 80,95,57,41,12,
      // 12, 3, 53, 53, 99, 39, 31,11,37,52,15,55];
      var timeData = [],
        dataOneList = [],
        dataTwoList = [];
      if (newValue.length) {
        timeData = newValue[0];
        dataOneList = newValue[1];
        dataTwoList = newValue[2];
      }

      //初始化数据
      var option = {
        height: 130,
        backgroundColor: "rgba(128, 128, 128, 0)",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // Use axis to trigger tooltip
            type: "shadow",
          },
        },
        legend: {
          top: "bottom",
          data: [
            {
              name: "土壤水分",
              textStyle: {
                color: "#0DE6B1",
              },
            },
            {
              name: "电导率",
              textStyle: {
                color: "#FFD853",
              },
            },
          ],
          textStyle: {
            fontSize: 14, //字体大小
            color: ["#00C6FF", "#00C6FF"],
          },
        },
        xAxis: {
          type: "category",
          data: timeData,
          axisLabel: {
            interval: 1,
            color: "#7FC1E5",
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "#01ACAE",
            },
          },
        },
        yAxis: {
          name: "%",
          nameTextStyle: {
            padding: [0, 0, -10, 21],
            color: "#7FC1E5",
          },
          type: "value",
          axisLine: {
            show: true,
            lineStyle: {
              color: "#01ACAE",
            },
          },
          axisLabel: {
            color: "#7FC1E5", //刻度线标签颜色
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#01ACAE",
              type: "dashed",
              opacity: 0.5,
            },
          },
        },
        series: [
          {
            name: "土壤水分",
            type: "line",
            symbolSize: 5,
            emphasis: {
              focus: "series",
            },
            itemStyle: {
              normal: {
                color: "#0DE6B1",
                lineStyle: {
                  color: "#0DE6B1",
                  width: 1,
                },
              },
            },
            data: dataOneList,
          },
          {
            name: "电导率",
            type: "line",
            symbolSize: 5,
            emphasis: {
              focus: "series",
            },
            itemStyle: {
              normal: {
                color: "#FFD853",
                lineStyle: {
                  color: "#FFD853",
                  width: 1,
                },
              },
            },
            data: dataTwoList,
          },
        ],
      };
      this.evnTwoLineChart.hideLoading();
      this.evnTwoLineChart.setOption(option);
    },
  },
  //注销window.onresize事件
  destroyed() {
    window.onresize = null;
  },
};
</script>
<style lang="less" scoped>
.evnTwoLineChart_chart_item {
  position: relative;
  width: calc(100% - 10px);
  // box-shadow: 0px 2px 11px 0px rgba(216, 209, 210, 1);
  top: -70px;
  left: 0px;

  .evnTwoLineChart_chart {
    height: 240px;
  }
}
</style>
