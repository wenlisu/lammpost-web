<!-- 古树信息统计 -->
<template>
<div class="treeInfoBarChart_chart_item">
  <div :id="chartId" class="treeInfoBarChart_chart"></div>
 </div>
</template>
<script>
  import echarts from "echarts"; //引入echarts
  export default {
    name: "treeInfoBarChart",
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
      this.inittreeInfoBarChart();
    },
    methods: {
      inittreeInfoBarChart() {
        this.treeInfoBarChart = echarts.init(document.getElementById(this.chartId));
        this.treeInfoBarChart.showLoading();
        let that = this;
        window.addEventListener('resize', () => that.treeInfoBarChart.resize(), true)
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
        console.log('newValue- ',newValue)
        if(newValue.length!=0){
          var timeData = newValue[0];
          dataOneList = newValue[1];
          dataTwoList = newValue[2];
        }else{
          var timeData = ['12月', '11月','10月', '9月','8月','7月', '6月','5月', '4月', '3月', '2月', '1月'];
          dataOneList = [320, 302, 301, 334, 390, 330, 320, 150,450,547,451,120];
          dataTwoList = [120, 132, 101, 134, 90, 230, 210,51,271,12,45,150];
        }



        //初始化数据
        var option = {
          backgroundColor: 'rgba(128, 128, 128, 0)',
          tooltip: {
            trigger: 'axis',
            axisPointer: { // Use axis to trigger tooltip
              type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
            }
          },
          color: ['#00FCFF', '#FFD853'],
          legend: {
            itemHeight: 10,
            itemWidth: 20,
            top: 'bottom',
            data: ['正常', '异常'],
            textStyle: {
              fontSize: 14, //字体大小
              color: ['#00FCFF', '#FFD853']
            }
          },
          xAxis: {
            type: 'value',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#01ACAE'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#7FC1E5"
            }
          },
          yAxis: {
            type: 'category',
            data: timeData,
            axisLabel: {
              interval: 1,
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
          series: [{
              barWidth:6,
              name: '正常',
              type: 'bar',
              stack: 'total',
              emphasis: {
                focus: 'series'
              },
              data: dataOneList
            },
            {
              barWidth:6,
              name: '异常',
              type: 'bar',
              stack: 'total',
              emphasis: {
                focus: 'series'
              },
              data: dataTwoList
            }
          ]
        };
        this.treeInfoBarChart.hideLoading();
        this.treeInfoBarChart.setOption(option);
      }
    },
    //注销window.onresize事件
    destroyed() {
      window.onresize = null;
    }
  };
</script>
<style lang="less" scoped>

  .treeInfoBarChart_chart_item {
    position: relative;
    width: calc(100% - 10px);
    // box-shadow: 0px 2px 11px 0px rgba(216, 209, 210, 1);
    margin-top: -44px;
    margin-left: 10px;
    .treeInfoBarChart_chart {
      height: 320px;
    }
  }
</style>
