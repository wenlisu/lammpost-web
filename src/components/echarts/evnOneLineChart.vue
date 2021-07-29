<!-- 土壤检测信息1 -->
<template>
  <div class="evnOneLineChart_chart_item">
    <div :id="chartId" class="evnOneLineChart_chart"></div>
  </div>
</template>
<script>
  import echarts from "echarts"; //引入echarts
  export default {
    name: "evnOneLineChart",
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
      this.initevnOneLineChart();
    },
    methods: {
      initevnOneLineChart() {
        this.evnOneLineChart = echarts.init(document.getElementById(this.chartId));
        this.evnOneLineChart.showLoading();
        let that = this;
        window.addEventListener('resize', () => that.evnOneLineChart.resize(), true)
      }
    },
    watch: {
      chartData(newValue, oldValue) {
        // 数据格式模板
        if(newValue.length!=0){
          var timeData = newValue[0];
          var dataOneList = newValue[1];
        }else{
          var timeData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
            '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24',
          ];
          var dataOneList = [320, 302, 301, 334, 390, 330, 320, 150, 450, 547, 451, 120,
            124, 153, 103, 123, 129, 233, 212, 531, 237, 142, 445, -155
          ];
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
            top: 'bottom',
            data: [{

              name: '土壤温度',
              textStyle: {
                color: '#00C6FF'
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
              interval: 1,
              color: "#7FC1E5"
            },
            axisTick: {
              show: false
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: '#01ACAE'
              }
            }
          },
          yAxis: {
            name: '℃',
            nameTextStyle: {
              padding: [0, 0, -10, 21],
              color: '#7FC1E5'
            },
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
            name: '土壤温度',
            type: 'line',
            symbolSize: 5,
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
            data: dataOneList,
          }]
        };
        this.evnOneLineChart.hideLoading();
        this.evnOneLineChart.setOption(option);
      }
    },
    //注销window.onresize事件
    destroyed() {
      window.onresize = null;
    }
  };
</script>
<style lang="less" scoped>
  .evnOneLineChart_chart_item {
    position: relative;
    width: calc(100% - 10px);
    // box-shadow: 0px 2px 11px 0px rgba(216, 209, 210, 1);
    top: -30px;
    left: 0px;

    .evnOneLineChart_chart {
      height: 240px;
    }
  }
</style>
