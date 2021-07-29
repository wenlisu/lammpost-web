/* eslint-disable camelcase */
<template>
  <pageMain idName='wisdomPublishAnalyse' :currentTitleList="currentTitleList">
    <el-row :gutter="10" class="statisticalRow">
      <el-col :span="24">
        <el-row :gutter="10">
          <el-col :span="12">
            <div class="energy">
              <echartData id="energy" :userOptions="energyOptions" @click="toMonthAnalysis" />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="luminance">
              <echartData id="luminance" :userOptions="luminanceOptions" @click="toMonthAnalysis" />
            </div>
          </el-col>
        </el-row>
        <div class="usageRate">
          <echartData id="usageRate" :userOptions="usageOptions" @click="toMonthAnalysis" />
        </div>
      </el-col>
    </el-row>
  </pageMain>
</template>

<script>
import * as echarts from 'echarts'; // 引入echarts
import pageMain from 'components/pageMain';
import echartData from './components/echartData';
import {
  getLedPlayStats
} from 'api/screen';
import card from './components/card';
import img2 from './images/img2.svg';
import {
// listInstancesByCondition,
} from 'api';
import {
  routePush
} from '@/util/util';
import {
  cubicInOut
} from '@/util/tool';
export default {
  name: 'wisdomPublishAnalyse',
  data () {
    return {
      usageOptions: {
        title: '本年播放时长分析',
        labers: [{
          background: '#4880FF',
          name: '日均播放次数'
        },
        {
          background: 'rgba(255,196,0,1)',
          name: '日均播放时长 '
        }
        ],
        options: {
          grid: {
            show: true,
            borderWidth: 0,
            borderColor: '#fff',
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          tooltip: {
            show: 'true',
            trigger: 'axis',
            formatter: '{b0}<br />{a0}: {c0}次<br />{a1}: {c1}小时'
          },
          xAxis: [{
            type: 'category',
            data: [],
            axisLine: {
              lineStyle: {
                color: '#28335A'
              }
            },
            axisTick: {
              alignWithLabel: true,
              lineStyle: {
                color: '#28335A'
              }
            },
            axisLabel: {
              color: '#A0ACD8'
            }
          }],
          yAxis: [{
            type: 'value',
            splitLine: {
              lineStyle: {
                type: 'solid',
                color: '#28335A'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#A0ACD8'
              }
            },
            axisTick: {
              show: false
            },
            nameTextStyle: {
              color: '#A0ACD8'
            },
            splitArea: {
              show: false
            }
          }, {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#A0ACD8'
              }
            },
            axisTick: {
              show: false
            },
            nameTextStyle: {
              color: '#A0ACD8'
            },
            splitArea: {
              show: false
            }
          }],
          series: [{
            name: '日均播放次数',
            type: 'line',
            data: [],
            symbol: 'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzBweCIgaGVpZ2h0PSIzMHB4IiB2aWV3Qm94PSIwIDAgMzAgMzAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYzICg5MjQ0NSkgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+R3JvdXAgQ29weeWkh+S7vTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSLmmbrmhadXaS1GaSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IldpLUZp5L2/55So6K6w5b2VIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTMxLjAwMDAwMCwgLTYzOC4wMDAwMDApIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY0LjAwMDAwMCwgNTU3LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLUNvcHnlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ2Ny4wMDAwMDAsIDgxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtQ29weS0yIiBmaWxsLW9wYWNpdHk9IjAuMSIgZmlsbD0iI0Y1QTYyMyIgY3g9IjE1IiBjeT0iMTUiIHI9IjE1Ij48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLUNvcHkiIGZpbGwtb3BhY2l0eT0iMC4yIiBmaWxsPSIjRjVBNjIzIiBjeD0iMTUiIGN5PSIxNSIgcj0iMTAiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIGZpbGw9IiNGRkIwMTgiIGN4PSIxNSIgY3k9IjE1IiByPSI1Ij48L2NpcmNsZT4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+',
            symbolSize: 30,
            lineStyle: {
              normal: {
                width: 3,
                curveness: 0.2,
                color: {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: '#FAD961' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#F76B1C' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#FFB018',
                borderWidth: 10,
                borderColor: '#F5A623',
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 1,
                    color: 'rgba(250, 217, 97, 0.21)'
                  },
                  {
                    offset: 0,
                    color: 'rgba(247, 107, 28, 0.09)'
                  }
                  ])
                }
              }
            },
            tooltip: {
              show: 'true',
              formatter: '日均播放次数：{c}%'
            },
            smooth: true,
            animationEasing: 'cubicInOut',
            animationDuration: 1000
          }, {
            name: '日均播放时长',
            type: 'line',
            data: [],
            yAxisIndex: 1,
            lineStyle: {
              normal: {
                width: 3,
                color: {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: '#48D7FF' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#4880FF' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                opacity: 0,
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 1,
                    color: 'rgba(250, 217, 97, 0.21)'
                  },
                  {
                    offset: 0,
                    color: 'rgba(247, 107, 28, 0.09)'
                  }
                  ])
                }
              }
            },
            smooth: true,
            animationEasing: 'cubicInOut',
            animationDuration: 1000
          }]
        }
      },
      energyOptions: {
        title: '今日播放时长分析',
        labers: [{
          background: '#4880FF',
          name: '播放时长'
        },
        {
          background: 'rgba(247, 28, 237, 1)',
          name: '播放次数'
        }
        ],
        options: {
          grid: {
            show: true,
            borderWidth: 0,
            borderColor: '#fff',
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          tooltip: {
            show: 'true',
            trigger: 'axis',
            formatter: '{b0}<br />{a0}: {c0}小时<br />{a1}: {c1}次'
          },
          xAxis: [{
            type: 'category',
            data: [],
            axisLine: {
              lineStyle: {
                color: '#28335A'
              }
            },
            axisTick: {
              alignWithLabel: true,
              lineStyle: {
                color: '#28335A'
              }
            },
            axisLabel: {
              color: '#A0ACD8'
            }
          }],
          yAxis: [{
            type: 'value',
            splitLine: {
              lineStyle: {
                type: 'solid',
                color: '#28335A'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#A0ACD8'
              }
            },
            axisTick: {
              show: false
            },
            nameTextStyle: {
              color: '#A0ACD8'
            },
            splitArea: {
              show: false
            }
          }, {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#A0ACD8'
              }
            },
            axisTick: {
              show: false
            },
            nameTextStyle: {
              color: '#A0ACD8'
            },
            splitArea: {
              show: false
            }
          }],
          series: [
            {
              name: '播放时长',
              type: 'bar',
              barWidth: '20px',
              yAxisIndex: 0,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0, 1, 0, 0, [{
                      offset: 1,
                      color: '#6161FA'
                    }, {
                      offset: 1,
                      color: '#F71CED'
                    }]
                  )
                }
              },
              data: [
              ],
              animationEasing: 'cubicInOut',
              animationDuration: 1000
            },
            {
              name: '播放次数',
              type: 'line',
              data: [],
              yAxisIndex: 1,
              lineStyle: {
                normal: {
                  width: 3,
                  color: {
                    type: 'linear',
                    colorStops: [{
                      offset: 0,
                      color: 'rgba(247, 28, 237, 1)' // 0% 处的颜色
                    }, {
                      offset: 1,
                      color: 'rgba(247, 28, 237, 1)' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                  }
                }
              },
              itemStyle: {
                normal: {
                  opacity: 0,
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                      offset: 1,
                      color: 'rgba(97, 121, 250, 0.31)'
                    },
                    {
                      offset: 0,
                      color: 'rgba(247, 28, 182, 0.06)'
                    }
                    ])
                  }
                }
              },
              smooth: true,
              animationEasing: 'cubicInOut',
              animationDuration: 1000
            }]
        }
      },
      luminanceLabers: [{
        background: '#4CDB9F',
        name: '节能'
      }, {
        background: '#4880FF',
        name: '中'
      }, {
        background: '#EA2E18',
        name: '高'
      }],
      luminanceOptions: {
        title: '近30天播放时长分析',
        labers: [{
          background: '#4880FF',
          name: '播放时长'
        },
        {
          background: 'rgba(247, 28, 237, 1)',
          name: '播放次数'
        }
        ],
        options: {
          grid: {
            show: true,
            borderWidth: 0,
            borderColor: '#fff',
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          tooltip: {
            show: 'true',
            trigger: 'axis',
            formatter: '{b0}<br />{a0}: {c0}小时<br />{a1}: {c1}次'
          },
          xAxis: [{
            type: 'category',
            data: [],
            axisLine: {
              lineStyle: {
                color: '#28335A'
              }
            },
            axisTick: {
              alignWithLabel: true,
              lineStyle: {
                color: '#28335A'
              }
            },
            axisLabel: {
              color: '#A0ACD8'
            }
          }],
          yAxis: [{
            type: 'value',
            splitLine: {
              lineStyle: {
                type: 'solid',
                color: '#28335A'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#A0ACD8'
              }
            },
            axisTick: {
              show: false
            },
            nameTextStyle: {
              color: '#A0ACD8'
            },
            splitArea: {
              show: false
            }
          }, {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#A0ACD8'
              }
            },
            axisTick: {
              show: false
            },
            nameTextStyle: {
              color: '#A0ACD8'
            },
            splitArea: {
              show: false
            }
          }],
          series: [{ // 节能
            name: '播放时长',
            type: 'bar',
            barWidth: '20px',
            data: [],
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 1, 0, 0, [{
                    offset: 1,
                    color: '#6161FA'
                  }, {
                    offset: 1,
                    color: '#F71CED'
                  }]
                )
              }
            },
            smooth: true,
            animationEasing: 'cubicInOut',
            animationDuration: 1000
          }, {
            name: '播放次数',
            type: 'line',
            data: [],
            yAxisIndex: 1,
            lineStyle: {
              normal: {
                width: 3,
                color: {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: 'rgba(247, 28, 237, 1)' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: 'rgba(247, 28, 237, 1)' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                opacity: 0,
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 1,
                    color: 'rgba(97, 121, 250, 0.31)'
                  },
                  {
                    offset: 0,
                    color: 'rgba(247, 28, 182, 0.06)'
                  }
                  ])
                }
              }
            },
            smooth: true,
            animationEasing: 'cubicInOut',
            animationDuration: 1000
          }]
        }
      },
      labers: [{
        name: '更多'
      }],
      currentTitleList: [{
        name: 'publishPoleMap',
        title: '智慧发布'
      }, {
        name: 'wisdomPublishAnalyse',
        title: '统计分析'
      }]
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._ledYearWork({
        dateInterval: 1
      });
      this._ledTodayWork({
        dateInterval: 6
      });
      this._ledMonthWork({
        dateInterval: 4
      });
    });
  },
  components: {
    echartData,
    card,
    pageMain
  },
  methods: {
    init () {
      let _this = this
      var myChart = echarts.init(this.$refs.luminance);
      myChart.setOption(this.luminanceOptions);
      myChart.on('click', function (param) {
        console.log(param); // 这里根据param填写你的跳转逻辑
        _this.toMonthAnalysis(param)
      });
      window.addEventListener('resize', () => {
        myChart.resize();
      });
    },
    // 本年播放时长分析
    _ledYearWork (parames) {
      getLedPlayStats(parames).then((res) => {
        const {
          data
        } = res
        let time = []
        let counts = []
        let times = []
        data.map(item => {
          time.push(item.simplePlayTimeAxis)
          counts.push(item.sumPlayCount)
          times.push(item.sumPlayTime)
        });
        this.usageOptions.options.xAxis[0].data = time;
        this.usageOptions.options.series[0].data = counts.map(da => cubicInOut(da));
        this.usageOptions.options.series[1].data = times.map(da => cubicInOut(da));
      })
    },
    // 今日播放时长分析
    _ledTodayWork (parames) {
      getLedPlayStats(parames).then((res) => {
        const {
          data
        } = res
        let time = []
        let counts = []
        let times = []
        data.map(item => {
          time.push(item.simplePlayTimeAxis)
          counts.push(item.avgPlayCount)
          times.push(item.avgPlayTime)
        });
        this.energyOptions.options.xAxis[0].data = time
        this.energyOptions.options.series[0].data = counts.map(da => cubicInOut(da));
        this.energyOptions.options.series[1].data = times.map(da => cubicInOut(da));
      })
    },
    // 本月播放时长分析
    _ledMonthWork (parames) {
      getLedPlayStats(parames).then((res) => {
        const {
          data
        } = res
        let time = []
        let counts = []
        let times = []
        data.map(item => {
          time.push(item.simplePlayTimeAxis)
          counts.push(item.avgPlayCount)
          times.push(item.avgPlayTime)
        });
        this.luminanceOptions.options.xAxis[0].data = time
        this.luminanceOptions.options.series[0].data = counts.map(da => da);
        this.luminanceOptions.options.series[1].data = times.map(da => da);
      })
    },
    // 跳转月分析
    toMonthAnalysis (parames) {
      // console.log("点击", parames)
      routePush({
        name: 'lightPoleMonthAnalysis'
        // parames: parames
      });
    },
    // 跳转到智慧灯杆
    tolightPoleList () {
      routePush({
        name: 'lightPoleList'
        // parames: parames
      });
    }
  }
}
</script>

<style lang="less">
  #wisdomPublishAnalyse {
    #pageMain{
      height: 100%;
      .statisticalRow{
        height: calc(100% - 24px);/*no*/
        .el-col-24{
          height: 100%;
          .usageRate, .el-row{
            height: calc(50% - 5px);/*no*/
            #echartData, .el-col, #card, .energy, .luminance{
              height: 100%;
            }
          }
        }
      }
    }
    .usageRate {
      margin-top: 10px;/*no*/
    }

    .luminance {
      .laberItems {
        position: absolute;
        bottom: 20px;
        right: 45px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);

        >div {
          margin-bottom: 8px;

          &:last-child {
            margin-bottom: 0;
          }
        }

        span {
          display: inline-block;
          width: 14px;
          height: 10px;
          margin-right: 4px;
        }
      }

      #luminance {
        width: 100%;
        height: 450px;
      }
    }
    #echartTable{
      height: calc(100%) !important;/*no*/
    }
  }
</style>
