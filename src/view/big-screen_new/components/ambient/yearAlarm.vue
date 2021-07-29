<!-- 环境监测器本年度报警情况分析柱状图 -->
<template>
  <div class="pieChart_chart_item">
    <div :id="chartId" class="pieChart_chart"></div>
  </div>
</template>
<script>
import { getColor } from "./utils";
import echarts from "echarts"; //引入echarts
export default {
  components: {},
  props: {
    chartData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      chart: null,
      chartId: "chartId",
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    })
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.chartId));
      this.chart.showLoading();
      let that = this;
      window.addEventListener("resize", () => that.chart.resize(), true);
      this.chart.hideLoading();
      const options = that.getOptions(that.chartData);
      this.chart.setOption(options);
    },
    // 图表配置项
    getOptions(chartData) {
      // 数据格式模板
      const dataValue = [
        { value: 40, name: "温度上限告警" },
        { value: 38, name: "湿度上限告警" },
        { value: 32, name: "噪声上限告警" },
        { value: 30, name: "PM2.5上限告警" },
        { value: 28, name: "PM10上限告警" },
      ];
      const dataName = [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月"
      ];
      const color = [
        ["rgba(255,238,90,0)", "rgba(255,238,90,1)"],
        ["rgba(21,236,255,0)", "rgba(21,236,255,1)"],
        ["rgba(255,98,92,0)", "rgba(255,98,92,1)"],
      ];
      let valuesArr = [];
      if (!chartData || !chartData.dataName) {
        valuesArr = {
          dataName,
          dataValue
        };
      } else {
        // 处理数据格式
        valuesArr = {...chartData};
        valuesArr['dataValue'].map((item, index) => {
          if (index < 4) {
            item["itemStyle"] = {
              color: getColor(color[0]),
            };
          } else if (index >= 4 && index < 9) {
            item["itemStyle"] = {
              color: getColor(color[1]),
            };
          } else {
            item["itemStyle"] = {
              color: getColor(color[2]),
            };
          }
        });
      }
      
      // 指定图表的配置项和数据
      var option = {
        title: {
          show: false,
          // text: "",
          // subtext: "",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
        },
        legend: {
          show: false,
          data: ["本年度"],
        },
        grid: {
          top: "2%",
          // left: "3%",
          // right: "4%",
          bottom: "25%",
          // height: "96%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
          splitLine: {
            show: false,
            lineStyle: {
              // color: "#01ACAE",
            },
          },
          axisLabel: {
            color: "#91A3CE",
            fontSize: 14
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            onZero: false,
            show: true,
            lineStyle: {
              color: "#ffffff",
              opacity: "0.18",
            },
          },
        },
        yAxis: {
          type: "category",
          data: [...valuesArr["dataName"]].reverse(),
          axisLine: {
            show: false,
            lineStyle: {
              color: "#01ACAE",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: true,
            color: "#91A3CE", //刻度线标签颜色
            fontSize: 14
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#ffffff",
              type: "solid",
              opacity: 0.18,
            },
          },
        },
        series: [
          {
            name: "本年度报警情况",
            type: "bar",
            data: [...valuesArr.dataValue].reverse(),
            barWidth: 4,
            itemStyle: {
              borderRadius: 4,
            },
          },
        ],
      };
      return option;
    },
  },
  watch: {
    chartData: {
      deep: true,
      handler: function (newValue, oldValue) {
        console.log(newValue, "++++");
        //初始化数据
        let option = this.getOptions(newValue);
        this.chart.hideLoading();
        this.chart.setOption(option);
      },
    },
  },
  //注销window.onresize事件
  destroyed() {
    window.onresize = null;
  },
};
</script>
<style lang="less" scoped>
.pieChart_chart_item {
  position: relative;
  width: calc(100% - 10px);
  // box-shadow: 0px 2px 11px 0px rgba(216, 209, 210, 1);
  top: 0px;
  left: 0px;
  .pieChart_chart {
    height: 400px;
  }
}
</style>
