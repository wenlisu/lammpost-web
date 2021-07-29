<!-- 风向图 -->
<template>
  <div class="windChart_chart_item">
    <div :id="chartId" class="windChart_chart"></div>
  </div>
</template>
<script>
  import echarts from "echarts"; //引入echarts
  export default {
    name: "windChart",
    props: {
      chartData: {
        type: Object,
        default () {
          return "";
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
      this.initwindChart();
    },
    methods: {
      initwindChart() {
        this.windChart = echarts.init(document.getElementById(this.chartId));
        this.windChart.showLoading();
        let that = this;
        window.addEventListener('resize', () => that.windChart.resize(), true)
      }
    },
    watch: {
      chartData(newValue, oldValue) {
        //计算传过来的参数
        var rawData = {
            "data": [
              {
                "time": "2017-06-27T11:00:00.000Z",
                "windSpeed": 9,
                "R": "NNW",
                "waveHeight": 2.64
              },
              {
                "time": "2017-06-28T11:00:00.000Z",
                "windSpeed": 9,
                "R": "NNW",
                "waveHeight": 2.64
              },
              {
                "time": "2017-06-29T11:00:00.000Z",
                "windSpeed": 9,
                "R": "NNW",
                "waveHeight": 2.64
              }
            ]
        };
        if(newValue.length!=0 && newValue != undefined){
          rawData = newValue;
        }
        var directionMap = {};
        ['W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW'].forEach(
          function(name, index) {
            directionMap[name] = Math.PI / 8 * index;
          }
        );
        console.log("rawData",rawData);
        var data = rawData.data.map(function (entry) {
           return [entry.time, entry.windSpeed, entry.R, entry.waveHeight];
        });

        var dims = {
          time: 0,
          windSpeed: 1,
          R: 2,
          waveHeight: 3
        };
        var arrowSize = 18;
        var weatherIconSize = 45;

        function renderArrow(param, api) {
          var point = api.coord([
            api.value(dims.time),
            api.value(dims.windSpeed)
          ]);

          return {
            type: 'path',
            shape: {
              pathData: 'M31 16l-15-15v9h-26v12h26v9z',
              x: -arrowSize / 2,
              y: -arrowSize / 2,
              width: arrowSize,
              height: arrowSize
            },
            rotation: directionMap[api.value(dims.R)],
            position: point,
            style: api.style({
              stroke: '#555',
              lineWidth: 1
            })
          };
        }

        var option = {
          width: 1250,
          height: 250,
          backgroundColor: 'rgba(128, 128, 128, 0)',
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              return [
                echarts.format.formatTime('yyyy-MM-dd', params[0].value[dims.time]) +
                ' ' + echarts.format.formatTime('hh:mm', params[0].value[dims.time]),
                '风速：' + params[0].value[dims.windSpeed],
                '风向：' + params[0].value[dims.R],
                '温度：' + params[0].value[dims.waveHeight]
              ].join('<br>');
            }
          },
          grid: {
            left: '4%',
            right: '4%',
            bottom: '12%',
            top: '12%'
          },
          xAxis: {
            type: 'time',
            maxInterval: 3600 * 1000 * 24,
            axisLabel: {
              color: "#7FC1E5",
              formatter: (value,index) => {
                   return echarts.format.formatTime('yyyy-MM-dd', value).split("-")[2];
              }
            },
            axisTick: {
              show: false
            },
            "splitLine": {
              "show": false
            },
            axisLine: {
              lineStyle: {
                color: '#01ACAE'
              }
            }
          },
          yAxis: [{
            name: '风速（节）',
            nameTextStyle: {
              color: '#7FC1E5'
            },
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
          }, {
            name: '温度(℃)',
            nameTextStyle: {
              color: '#7FC1E5'
            },
            max: 6,
            axisLabel: {
              color: "#7FC1E5"
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false
            }
          }, {
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          }],
          visualMap: {
            type: 'piecewise',
            show: false,
            orient: 'horizontal',
            left: 'center',
            bottom: 10,
            pieces: [{
              gte: 17,
              color: '#18BF12',
            }, {
              gte: 11,
              lt: 17,
              color: '#f4e9a3',
              label: '中风（11  ~ 17 节）'
            }, {
              lt: 11,
              color: '#D33C3E',
              label: '微风（小于 11 节）'
            }],
            seriesIndex: 1,
            dimension: 1
          },
          series: [{
            type: 'line',
            yAxisIndex: 1,
            showSymbol: false,
            hoverAnimation: false,
            symbolSize: 10,
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
            lineStyle: {
              normal: {
                color: '#00FFEA',
                width: 1
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(88,160,253,1)'
              }
            },
            encode: {
              x: dims.time,
              y: dims.waveHeight
            },
            data: data,
            z: 2
          }, {
            type: 'custom',
            renderItem: renderArrow,
            encode: {
              x: dims.time,
              y: dims.windSpeed
            },
            data: data,
            z: 10
          }, {
            type: 'line',
            symbol: 'none',
            encode: {
              x: dims.time,
              y: dims.windSpeed
            },
            lineStyle: {
              normal: {
                color: '#31B3C6',
                type: 'dotted',
              }
            },
            data: data,
            z: 1
          }]
        };
        this.windChart.hideLoading();
        this.windChart.setOption(option);
      },
    },
    //注销window.onresize事件
    destroyed() {
      window.onresize = null;
    }
  };
</script>
<style lang="less" scoped>
  .windChart_chart_item {
    position: relative;
    width: calc(100% - 10px);
    // box-shadow: 0px 2px 11px 0px rgba(216, 209, 210, 1);
    top: 0px;
    left: 0px;

    .windChart_chart {
      height: 320px;
    }
  }
</style>
