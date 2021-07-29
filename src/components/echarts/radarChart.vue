<!-- 雷达图 -->
<template>
  <div class="radarChart_chart_item">
    <div :id="chartId" class="radarChart_chart"></div>
  </div>
</template>
<script>
import echarts from "echarts"; //引入echarts
export default {
  name: "radarChart",
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
    this.initradarChart();
  },
  methods: {
    initradarChart() {
      this.radarChart = echarts.init(document.getElementById(this.chartId));
      this.radarChart.showLoading();
      let that = this;
      window.addEventListener("resize", () => that.radarChart.resize(), true);
    },
  },
  watch: {
    chartData(newValue, oldValue) {
      //计算传过来的参数
      let nameList = []; //x左边值
      let dataOneList = []; //数据
      let dataTwoList = []; //数据
      for (var i = 0; i < newValue.length; i++) {
        nameList.push(newValue[i].name);
        if (newValue[i].value[0] == undefined || newValue[i].value[0] == null) {
          dataOneList.push(0);
        } else {
          dataOneList.push(newValue[i].value[0]);
        }
        if (newValue[i].value[1] == undefined || newValue[i].value[1] == null) {
          dataTwoList.push(0);
        } else {
          dataTwoList.push(newValue[i].value[1]);
        }
      }
      // 数据模拟展示，后面可直接删除
      /* nameList = ['数字电器', '以太网专线', 'MPLS-VPN', '互联网专线(DIA)', '语音中继电路', '裸光纤', '数据基础'];
        dataOneList = [1800, 1800, 1800, 1800, 1800, 1800, 1800];
        dataTwoList = [1300, 1300, 1300, 1300, 1300, 1300, 1300]; */

      // 数据格式模板
      var data =
        newValue && newValue.length
          ? newValue
          : [
              {
                value: [0.4, 0.4, 60, 28],
              },
            ];

      //初始化数据
      var option = {
        height: 100,
        backgroundColor: "rgba(128, 128, 128, 0)",
        radar: {
          indicator: [
            {
              name: "氨气",
              max: 1,
            },
            {
              name: "硫化氢",
              max: 1.5,
            },
            {
              name: "湿度",
              max: 100,
            },
            {
              name: "温度",
              max: 70,
            },
          ],
          nameGap: 3,
          center: ["50%", "50%"],
          splitNumber: 4,
          splitLine: {
            lineStyle: {
              color: "#03C8D2",
              width: 1,
              opacity: 0.5,
            },
          },
          name: {
            textStyle: {
              color: "#8BD1F7",
            },
          },
          splitArea: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#03C8D2",
            },
          },
        },
        series: [
          {
            type: "radar",
            symbol: "none",
            itemStyle: {
              color: "#00F3F7",
            },
            areaStyle: {
              opacity: 0.5,
            },
            lineStyle: {
              color: "#00F3F7",
              width: 2,
            },
            data: data,
          },
        ],
      };
      this.radarChart.hideLoading();
      this.radarChart.setOption(option);
    },
  },
  //注销window.onresize事件
  destroyed() {
    window.onresize = null;
  },
};
</script>
<style lang="less" scoped>
.radarChart_chart_item {
  position: relative;
  width: calc(100% - 10px);
  // box-shadow: 0px 2px 11px 0px rgba(216, 209, 210, 1);
  top: 65px;
  left: 0px;
  .radarChart_chart {
    height: 132px;
  }
}
</style>
