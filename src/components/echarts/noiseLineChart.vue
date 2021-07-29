<!-- 噪音信息统计 -->
<template>
  <div class="noiseLineChart_chart_item">
    <div :id="chartId" class="noiseLineChart_chart"></div>
  </div>
</template>
<script>
  import echarts from "echarts"; //引入echarts
  export default {
    name: "noiseLineChart",
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
      this.initnoiseLineChart();
    },
    methods: {
      initnoiseLineChart() {
        this.noiseLineChart = echarts.init(document.getElementById(this.chartId));
        this.noiseLineChart.showLoading();
        let that = this;
        window.addEventListener('resize', () => that.noiseLineChart.resize(), true)
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

        if(newValue.length!=0){
          var timeData = newValue[0];//月份
          dataTwoList = newValue[1];//分贝
        }else{
          var timeData = ['2020-1', '2020-2','2020-3', '2020-4','2020-5','2020-6', '2020-7','2020-8', '2020-9', '2020-10', '2020-11', '2020-12'];
          dataTwoList = [120, 132, 101, 134, 90, 230, 210,51,271,12,45,150];
        }


        //初始化数据
        var option = {
          backgroundColor: 'rgba(128, 128, 128, 0)',
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            data: timeData,
            axisLabel: {
              interval: 0,
              color: "#7FC1E5",
              formatter: (param) => {
                   return parseInt(param.split('-')[1]) + '月';
              }
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
            name: '(分贝)',
            nameTextStyle: {
              padding: [0, 0, 0, -40], // 四个数字分别为上右下左与原位置距离
              color: '#7FC1E5'
            },
            type: 'value',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#01ACAE'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#7FC1E5"
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
            name: '今年',
            type: 'line',
            symbolSize: 0,
            emphasis: {
              focus: 'series'
            },
            lineStyle: {
              color: '#00FFEA',
              width: 1
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  1,
                  0,
                  0,
                  [{
                      offset: 0,
                      color: "#051B32"
                    },
                    {
                      offset: 1,
                      color: "#00FFEA"
                    }
                  ],
                  false
                )
              }
            },
            data: dataTwoList,
          }]
        };
        this.noiseLineChart.hideLoading();
        this.noiseLineChart.setOption(option);
      }
    },
    //注销window.onresize事件
    destroyed() {
      window.onresize = null;
    }
  };
</script>
<style lang="less" scoped>
  .noiseLineChart_chart_item {
    position: relative;
    width: calc(100% - 10px);
    // box-shadow: 0px 2px 11px 0px rgba(216, 209, 210, 1);
    top: -10px;
    left: 0px;
    .noiseLineChart_chart {
    height: 400px;
    }
  }
</style>
