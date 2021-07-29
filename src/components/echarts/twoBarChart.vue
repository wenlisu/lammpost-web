<!-- 土壤水分变化图 -->
<template>
  <div class="twoBarChart_chart_item">
    <div :id="chartId" class="twoBarChart_chart"></div>
  </div>
</template>
<script>
  import echarts from "echarts"; //引入echarts
  export default {
    name: "twoBarChart",
    props: {
      chartData: {
        type: Array,
        default () {
          return [];
        }
      },
      chartId: {
        type: String,
        default: ""
      }
    },
    data() {
      return {};
    },
    mounted() {
      this.inittwoBarChart();
    },
    methods: {
      inittwoBarChart() {
        this.twoBarChart = echarts.init(document.getElementById(this.chartId));
        this.twoBarChart.showLoading();
        let that = this;
        window.addEventListener('resize', () => that.twoBarChart.resize(), true)
      }
    },
    watch: {
      chartData(newValue, oldValue) {
        //计算传过来的参数
        let nameList = []; //x左边值
        let dataOneList = []; //数据
        let dataTwoList = []; //数据
        // 数据模拟展示，后面可直接删除
        /* nameList = ['数字电器', '以太网专线', 'MPLS-VPN', '互联网专线(DIA)', '语音中继电路', '裸光纤', '数据基础'];
        dataOneList = [1800, 1800, 1800, 1800, 1800, 1800, 1800];
        dataTwoList = [1300, 1300, 1300, 1300, 1300, 1300, 1300]; */

        // 数据格式模板
        if(newValue.length!=0){
          var timeData = newValue[0];
          dataOneList = newValue[1];//去年
          dataTwoList = newValue[2];//今年
        }else{
          var timeData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
          dataOneList = [320, 302, 301, 334, 390, 330, 320, 150, 450, 547, 451, 120];
          dataTwoList = [120, 132, 101, 134, 90, 230, 210, 51, 271, 12, 45, 150];
        }


        //初始化数据
        var option = {
          backgroundColor: 'rgba(128, 128, 128, 0)',
          tooltip: {
            trigger: 'axis',
            axisPointer: { // Use axis to trigger tooltip
              type: 'shadow'
            }
          },
          color: ['#00C6FF', '#05FF98'],
          legend: {
            itemHeight: 8,
            itemWidth: 20,
            top: 'bottom',
            data: ['去年', '今年'],
            textStyle: {
              fontSize: 14, //字体大小
              color: ['#00C6FF', '#05FF98']
            }
          },
          xAxis: {
            type: 'category',
            data: timeData,
            axisLabel: {
              interval: 0,
              color: "#7FC1E5"
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#01ACAE'
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#01ACAE'
              }
            },
            axisLabel: {
              color: "#7FC1E5" //刻度线标签颜色
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#01ACAE',
                type: 'dashed',
                opacity: 0.5
              }
            }
          },
          series: [{
              name: '去年',
              type: 'bar',
              barWidth: 12,
              emphasis: {
                focus: 'series'
              },
              data: dataOneList
            },
            {
              name: '今年',
              type: 'bar',
              barWidth: 12,
              emphasis: {
                focus: 'series'
              },
              data: dataTwoList,
              barGap: '20%'
            }
          ]
        };
        this.twoBarChart.hideLoading();
        this.twoBarChart.setOption(option);
      }
    },
    //注销window.onresize事件
    destroyed() {
      window.onresize = null;
    }
  };
</script>
<style lang="less" scoped>
  .twoBarChart_chart_item {
    position: relative;
    width: calc(100%);
    // box-shadow: 0px 2px 11px 0px rgba(216, 209, 210, 1);
    top: -20px;
    left: 0px;
  .twoBarChart_chart {
    height: 430px;
  }
  }
</style>
