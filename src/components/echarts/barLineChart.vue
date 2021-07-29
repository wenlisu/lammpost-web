<!-- 人流量，PM2.5信息统计 -->
<template>
  <div class="barLineChart_chart_item">
    <div :id="chartId" class="barLineChart_chart"></div>
  </div>
</template>
<script>
  import echarts from "echarts"; //引入echarts
  export default {
    name: "barLineChart",
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
      this.initbarLineChart();
    },
    methods: {
      initbarLineChart() {
        this.barLineChart = echarts.init(document.getElementById(this.chartId));
        this.barLineChart.showLoading();
        let that = this;
        window.addEventListener('resize', () => that.barLineChart.resize(), false)
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
          dataOneList = newValue[1];//人流量
          dataTwoList = newValue[2];//PM2.5
        }else{
          var timeData = ['2020-1', '2020-2','2020-3', '2020-4','2020-5','2020-6', '2020-7','2020-8', '2020-9', '2020-10', '2020-11', '2020-12'];
          dataOneList = [320, 302, 301, 334, 390, 330, 320, 150, 450, 547, 451, 120];
          dataTwoList = [12, 13, 10, 13, 9, 23, 21, 51, 27, 12, 45, 15];
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
          legend: {
            itemHeight: 8,
            itemWidth: 20,
            top: 'bottom',
            data: [{
              name: '人流量',
              textStyle: {
                color: '#00C6FF'
              }
            }, {
              name: 'PM2.5',
              textStyle: {
                color: '#00FFEA'
              }
            }],
            textStyle: {
              fontSize: 14, //字体大小
              color: ['#00C6FF', '#00C6FF']
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
          yAxis: [{
            name: '(人数)',
            nameTextStyle: {
              padding: [0, 0, 0, -40],
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
              color: "#7FC1E5" //刻度线标签颜色
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#01ACAE',
                type: 'dashed',
                opacity: 0.5
              }
            }
          }, {
            name: '(PM2.5)',
            nameTextStyle: {
              padding: [0, 0, 0, 0],
              color: '#7FC1E5'
            },
            type: 'value',
            axisLine: {
              show: false
            },
            axisLabel: {
              color: "#7FC1E5" //刻度线标签颜色
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#01ACAE',
                type: 'dashed',
                opacity: 0.5
              }
            }
          }],
          series: [{
              name: '人流量',
              type: 'bar',
              barWidth:12,
              emphasis: {
                focus: 'series'
              },
              itemStyle: {
                normal: {
                  color: '#00C6FF'
                }
              },
              data: dataOneList,
            },
            {
              name: 'PM2.5',
              type: 'line',
              symbolSize: 5,
              yAxisIndex: 1,
              emphasis: {
                focus: 'series'
              },
              itemStyle: {
                normal: {
                  color: '#00FFEA',
                  lineStyle: {
                    color: '#00FFEA',
                    width: 1
                  }
                }
              },
              data: dataTwoList,
            }
          ]
        };
        this.barLineChart.hideLoading();
        this.barLineChart.setOption(option);
      }
    },
    //注销window.onresize事件
    destroyed() {
      window.onresize = null;
    }
  };
</script>
<style lang="less" scoped>
  .barLineChart_chart_item {
    position: relative;
    width: calc(100% - 10px);
    // box-shadow: 0px 2px 11px 0px rgba(216, 209, 210, 1);
    top: -10px;
    left: 0px;

    .barLineChart_chart {
      height: 400px;
    }
  }
</style>
