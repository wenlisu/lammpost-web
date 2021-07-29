<!-- 灯杆耗能信息 -->
<template>
  <div class="treeBarChart_chart_item">
    <div :id="chartId" class="treeBarChart_chart"></div>
  </div>
</template>
<script>
  import echarts from "echarts"; //引入echarts
  export default {
    name: "treeBarChart",
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
      this.inittreeBarChart();
    },
    methods: {
      inittreeBarChart() {
        this.treeBarChart = echarts.init(document.getElementById(this.chartId));
        this.treeBarChart.showLoading();
        let that = this;
        window.addEventListener('resize', () => that.treeBarChart.resize(), true)
      }
    },
    watch: {
      chartData(newValue, oldValue) {
        //计算传过来的参数
        let nameList = []; //x左边值
        let dataOneList = []; //数据
        let dataTwoList = []; //数据
        var dataThreeList = [];

        // 数据模拟展示，后面可直接删除
        /* nameList = ['数字电器', '以太网专线', 'MPLS-VPN', '互联网专线(DIA)', '语音中继电路', '裸光纤', '数据基础'];
        dataOneList = [1800, 1800, 1800, 1800, 1800, 1800, 1800];
        dataTwoList = [1300, 1300, 1300, 1300, 1300, 1300, 1300]; */

        // 数据格式模板
        // console.log('23323223- ',newValue)
        if(newValue.length!=0){
          var timeData = newValue[0];//月份
          dataOneList = newValue[1];//节能
          var newDataOneList = [];
          for(var i = 0;i < dataOneList.length; i++){
            newDataOneList.push(-dataOneList[i]);
          }
          dataOneList = newDataOneList;
          dataTwoList = newValue[2];//实际耗电
          dataThreeList = newValue[3];//总耗能
        }else{
          var timeData = ['2021-12-01', '2021-12-02', '2021-12-03', '2021-12-04', '2021-12-05', '2021-12-06', '2021-12-07', '2021-12-08', '2021-12-09', '2021-12-10', '2021-12-11', '2021-12-12'];
          dataOneList = [-320, -302, -301, -334, -390, -330, -320, -150, -450, -547, -451, -120];
          dataTwoList = [120, 130, 100, 130, 90, 230, 210, 510, 270, 120, 450, 150];
          dataThreeList = [320, 302, 301, 334, 390, 330, 320, 150, 450, 547, 451, 120];
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
          color: ['#05FF98', '#00FCFF', '#FFD853'],
          legend: {
            itemHeight: 8,
            itemWidth: 20,
            top: 'bottom',
            data: ['节能', '实际耗电', '总耗能'],
            textStyle: {
              fontSize: 14, //字体大小
              color: ['#05FF98', '#00FCFF', '#FFD853']
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
              color: "#7FC1E5" //刻度线标签颜色
            }
          },
          yAxis: [{
            type: 'category',
            axisLine: {
              show: true,
              interval: 1,
              lineStyle: {
                color: '#01ACAE'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: "#7FC1E5", //刻度线标签颜色
              formatter: (param) => {
                   return param.split('-')[2];
              }
            },
            splitLine: {
              show: false
            },
            data: timeData,
          }],
          series: [{
              name: '实际耗电',
              type: 'bar',
              barGap:'70%',
              emphasis: {
                focus: 'series'
              },
              itemStyle: {
                normal: {
                  color: '#00FCFF'
                }
              },
              barWidth: 6,
              data: dataTwoList,
            },
            {
              name: '节能',
              type: 'bar',
              stack: 'same',
              emphasis: {
                focus: 'series'
              },
              itemStyle: {
                normal: {
                  color: '#05FF98'
                }
              },
              barWidth: 6,
              data: dataOneList,
            }, {
              name: '总耗能',
              type: 'bar',
              stack: 'same',
              emphasis: {
                focus: 'series'
              },
              itemStyle: {
                normal: {
                  color: '#FFD853'
                }
              },
              barWidth: 6,
              data: dataThreeList,
            }
          ]
        };
        this.treeBarChart.hideLoading();
        this.treeBarChart.setOption(option);
      }
    },
    //注销window.onresize事件
    destroyed() {
      window.onresize = null;
    }
  };
</script>
<style lang="less" scoped>
  .treeBarChart_chart_item {
    position: relative;
    width: calc(100% - 10px);
    // box-shadow: 0px 2px 11px 0px rgba(216, 209, 210, 1);
    top: -10px;
    left: 0px;
  .treeBarChart_chart {
    height: 400px;
    }
  }
</style>
