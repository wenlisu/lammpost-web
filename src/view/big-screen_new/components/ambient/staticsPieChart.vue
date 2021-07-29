<!-- 环境监测器报警情况分析饼图 -->
<template>
  <div class="com-container">
    <div :id="chartId" class="com-chart"></div>
  </div>
</template>
<script>
import centerIcon from "../../images/envPieIcon.png";
import echarts from "echarts"; //引入echarts
export default {
  components: {},
  props: {
    chartData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      chart: null,
      chartId: "piechartId",
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
      const options = that.getOptions(that.chartData)
      this.chart.setOption(options);
      // 默认选中突出
      this.chart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: 0,
      });
      this.chart.on("mouseover", function (e) {
        //downplay;
        for (var i = 0; i < that.chartData.length; i++) {
          if (i != e.dataIndex) {
            that.chart.dispatchAction({
              type: "downplay", //取消突出高亮显示;
              seriesIndex: 0,
              dataIndex: i,
            });
          }
        }
      });
      //鼠标离开图表时,将鼠标移出的部分突出高亮显示,保持鼠标hover的状态;
      this.chart.on("mouseout", function (e) {
        //highlight;;
        // e.dataIndex 鼠标移出部分的数据索引;
        that.chart.dispatchAction({
          type: "highlight", //突出高亮显示;
          seriesIndex: 0,
          dataIndex: e.dataIndex,
        });
      });
    },
    // 图表配置项
    getOptions(chartData) {
      // 数据格式模板
      const data = [
        { value: 40, name: "温度上限告警" },
        { value: 38, name: "湿度上限告警" },
        { value: 32, name: "噪声上限告警" },
        { value: 30, name: "PM2.5上限告警" },
        { value: 28, name: "PM10上限告警" },
      ];
      let valuesArr = [];
      if (!chartData || !chartData.length) {
        valuesArr = data;
      } else {
        // 处理数据格式
        valuesArr = chartData;
      }

      let colors = [
        {
          name: "温度上限告警",
          color: "#14EEF5",
        },
        {
          name: "湿度上限告警",
          color: "#27C3F8",
        },
        {
          name: "噪声上限告警",
          color: "#18A5FF",
        },
        {
          name: "PM2.5上限告警",
          color: "#2488FF",
        },
        {
          name: "PM10上限告警",
          color: "#2865FF",
        },
      ];
      // 指定图表的配置项和数据
      var option = {
        grid: {
          top: "5%",
          left: "center",
          containLabel: false,
        },
        legend: {
          top: "bottom",
          left: "center",
          bottom: "0",
          fontSize: 14,
          itemWidth: 9, // 设置宽度
          itemHeight: 5, // 设置高度
          itemGap: 12, // 设置间距
          // 重写legend显示样式
          formatter: function (name) {
            // 获取legend显示内容
            let data = option.series[0].data;
            let total = 0;
            let tarValue = 0;
            for (let i = 0, l = data.length; i < l; i++) {
              total += data[i].value;
              if (data[i].name == name) {
                tarValue = data[i].value;
              }
            }
            let p = ((tarValue / total) * 100).toFixed(2);
            return name + " " + " " + p + "%";
          },
          data: valuesArr.map((e, i) => {
            return {
              name: e.name,
              icon: "rect", //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
              itemWidth: 14, // 设置宽度
              itemHeight: 14, // 设置高度
              itemGap: 60, // 设置间距
              textStyle: {
                color: "#ffffff",
              },
              itemStyle: {
                color: colors[i].color,
              },
            };
          }),
          textStyle: {
            fontSize: 14, //字体大小
            // color: this.legend.map((e) => {
            //   return '#ffffff';
            // }),
            // color: ["#ffffff", "#ffffff"],
          },
        },
        graphic: {
          elements: [
            {
              type: "image",
              z: 3,
              style: {
                image: centerIcon,
                width: 102,
                height: 104,
              },
              left: "center",
              top: "26%",
              // left: '50%',
              position: [0, 0],
            },
          ],
        },
        series: [
          {
            name: "情况占比",
            type: "pie",
            // radius: [22, 80],
            radius: ["45%", "65%"],
            center: ["50%", "40%"],
            // roseType: "area",
            top: "5%",
            itemStyle: {
              // borderRadius: 10,
              borderColor: "#001A40",
              borderWidth: 3,
            },
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            splitLine: {
              length: 60,
              lineStyle: {
                width: 5,
                color: "#061740",
              },
            },
            data: valuesArr.map((e, i) => {
              return {
                value: e.value,
                name: e.name,
                itemStyle: {
                  color: colors[i].color,
                  // borderRadius: 8,
                  borderRadius: [0, 10],
                },
              };
            }),
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
</style>
