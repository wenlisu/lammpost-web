/* eslint-disable camelcase */
<template>
  <pageMain idName='wisdomMonitorWifi'  :currentTitleList="currentTitleList">
    <div v-if="routeName == 'wisdomWifiUserTraffic'">
      <UserTraffic />
    </div>
    <div v-if="routeName == 'wisdomWifiUserDetail'">
      <UserDetail />
    </div>
    <div v-if="routeName == 'wisdomWifiEquipment'">
      <Equipment />
    </div>
    <div v-if="routeName == 'wisdomMonitorWifi'">
      <!-- 智慧WIFI -->
      <header-title
        icon="iconfont icon-shouye"
        title="智慧WIFI"
      >
        <search-form
          slot="searchBox"
          :searchItems="searchItems"
          @onSearch="onSearch"
        />
      </header-title>

      <div class="content-view">
        <ul class="flexRow">
          <li
            class="flexRow flexCenter"
            v-for="(item, index) in items"
            :key="item.id + index"
            :class="activeId === item.id && 'active'"
            @click="() => handleActive(item.id)"
          >
            <el-avatar icon="iconfont icon-wifi"></el-avatar>
            <div class="flexCloumn flexCenter">
              <div class="title">
                {{item.title}}
              </div>
              <div class="number">{{item.value}}<span>{{item.unit}}</span></div>
            </div>
          </li>
        </ul>
        <el-row :gutter="10">
          <el-col :span="12" >
            <echartData id="flowRate" :userOptions="flowOptions" :onClick="showView"/>
          </el-col>
          <el-col :span="12">
            <echartData id="usageRate" :userOptions="usageOptions" :onClick="showView"/>
          </el-col>
        </el-row>
      </div>
    </div>
  </pageMain>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import * as echarts from 'echarts'; // 引入echarts
import pageMain from 'components/pageMain';
import headerTitle from 'components/headerTitle/headerTitle'
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import echartData from '@/view/lightPole/lightPoleStatistical/components/echartData';
import card from '@/view/lightPole/lightPoleStatistical/components/card';
import { cubicInOut } from '@/util/tool';
import { routePush } from '@/util/util';
import Equipment from './equipment';
import UserTraffic from './userTraffic';
import UserDetail from './userDetail';
import {
  flowAnalysis
} from 'api/wisdomMonitor';
export default {
  name: 'wisdomMonitorWifi',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        span: 12,
        type: 'dataPicker',
        label: '时间',
        labelWidth: '45px',
        props: {
          fieldName: 'date',
          isRange: true,
          pickerOptions: {
            onPick: ({ maxDate, minDate }) => {
              if (minDate && this.pickerMinDate) {
                this.pickerMinDate = null;
              } else if (minDate) {
                this.pickerMinDate = minDate.getTime();
              }
            },
            disabledDate: (time) => {
              this.day31 = 31 * 24 * 3600 * 1000;
              if (this.pickerMinDate) {
                return (time.getTime() > (this.pickerMinDate + this.day31)) || (time.getTime() < (this.pickerMinDate - this.day31));
              }
              return false;
            }
          }
        }
      }],
      items: [{
        id: 'wifiNumber',
        title: '全部WIFI热点',
        value: '0',
        unit: '个'
      }, {
        id: 'online',
        title: '当前在线WIFI热点',
        value: '0',
        unit: '个'
      }, {
        id: 'offline',
        title: '离线WIFI热点',
        value: '0',
        unit: '个'
      }, {
        id: 'todayUser',
        title: '今日上网用户数',
        value: '0',
        unit: '人'
      }, {
        id: 'currentUser',
        title: '当前在线用户数',
        value: '0',
        unit: '人'
      }],
      flowOptions: {
        title: '实时客流分析',
        labers: [{
          background: '#FFC860',
          name: '人均流量'
        }],
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
            formatter: '实时客流分析<br />时间：{b0}<br />{a0}: {c0}GB'
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
            name: '单位：(GB)',
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
            nameTextStyle: {
              color: '#A0ACD8'
            },
            splitArea: {
              show: false
            }
          }],
          series: [{
            name: '人均流量',
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
                    color: '#FFC860' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#FFA751' // 100% 处的颜色
                  }]
                  // globalCoord: false // 缺省为 false
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
                    color: 'rgba(255, 200, 96, 0.7)'
                  },
                  {
                    offset: 0,
                    color: 'rgba(255, 167, 81, 0.42)'
                  }
                  ])
                }
              }
            },
            tooltip: {
              show: 'true',
              formatter: '在线用户数：{c}个'
            },
            // animationEasing: 'cubicInOut',
            animationDuration: 1000,
            smooth: true
          }]
        }
      },
      usageOptions: {
        title: '今日在线用户趋势分析',
        labers: [{
          background: '#48FADC',
          name: '在线用户数'
        }, {
          background: '#FFC860',
          name: '产生流量'
        }],
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
            formatter: '今日在线用户趋势分析<br />时间：{b0}点<br />{a0}: {c0}个<br />{a1}: {c1}GB'
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
            name: '单位：(人)',
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
            nameTextStyle: {
              color: '#A0ACD8'
            },
            splitArea: {
              show: false
            }
          }, {
            name: '单位：(GB)',
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
            nameTextStyle: {
              color: '#A0ACD8'
            },
            splitArea: {
              show: false
            }
          }],
          series: [{
            name: '在线用户数',
            yAxisIndex: 0,
            type: 'line',
            data: [],
            symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAvpJREFUSA29VsluE0EQ7eoZj+MgJw5EICEicUmCxCFsZ/6ACIT4mNxy4yv4AoRA8Afc2Q6RknBBCkJCZI+I7dmKej30uGbsGAKBPrhrf+7q6qoh84u1yhy+3d5ocZOaxzYOQgosXFLO8sk8yqjP/Vuzi91VonRcKDpJ+WhtLerNhVO9gKOTbLR8IqN4Yis9fHr9eqzlnh4CYmZ6sP9++nvUmvRGp9nPxd3j550bB0TE2q8CJGmyb442z//uKXQgTeN0t9sLu5LO3MtdvsHgJGcBglj4o4iFmOCxwmIzBunqRa2R95FIAYSBnTF5Ok1h2DQmD4yxGadp39jwIM3yvYYUh4+FHWCIKeQ+eIeIi9+/GsxCUF95nnWo0bhsApLgJ6yMM06SL9YGLqi26nzKtlEgLnWoLq0sac4u0kQ0NxYExvInnJ3Yl74/CR/b4p2MunychJvRpbrjOB728NM2iA0MWv623u5OmrZWujuxfE2fJCeyUc4P2dBdInOF2Xwmw69jS88s8+B+JI1pTuv6zlrH5ijEi5ea0zjGXbzFhRcLIA2mx8ItuUsVc9nn5Xde5HcSMislmKQxJCmcNNvx/sCwaCteUO5SXSUtBE5CzEta5mnIofe822v+wLC+d2nDooQHEqRrwA1TdX3dHxjlg626D9IGOe6kqq9yw/qqP6wtunDVzYkzLcPFa75OD+ttxR8YFq1+yBEvXi1Ul2KHyLredQxlBQyLeaJkBSltRctQwkz0Qcs8DTn0nnd7zR8YFkOrYiQMepeR9+DlKN2EeEWewROp7I9S2123Cw95WdpwwDuCv1rAcM/i3uHGbL07uB6H9nPKxb14S/c8jIxXU4vbruowGevxYEz9+GtdPo6HvQaBrY/tTgTB/b13nVFT9W+6N6bti5mbgzEBIAyp5aPNC/UUQvcn8wgpe9le2PEjvRx8EEiX3R01ZV2DLHrXjokTYMvKimGWJ6ZRCMpfP8o9CBRl6rzVf/k48WDY//nnlgYDjaF1Fh+QPwABs7TSZWsDFQAAAABJRU5ErkJggg==',
            symbolSize: 30,
            lineStyle: {
              normal: {
                width: 3,
                curveness: 0.2,
                color: {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: '#2BF1FF' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#17FFBB' // 100% 处的颜色
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
                    color: 'rgba(43, 241, 255, 0.7)'
                  },
                  {
                    offset: 0,
                    color: 'rgba(23, 255, 187, 0.42)'
                  }
                  ])
                }
              }
            },
            tooltip: {
              show: 'true',
              formatter: '在线用户数：{c}个'
            },
            // animationEasing: 'cubicInOut',
            animationDuration: 1000,
            smooth: true
          }, {
            name: '产生流量',
            type: 'line',
            yAxisIndex: 1,
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
                    color: '#FFC860' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#FFA751' // 100% 处的颜色
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
                    color: 'rgba(255, 200, 96, 0.7)'
                  },
                  {
                    offset: 0,
                    color: 'rgba(255, 167, 81, 0.42)'
                  }
                  ])
                }
              }
            },
            tooltip: {
              show: 'true',
              formatter: '在线用户数：{c}个'
            },
            // animationEasing: 'cubicInOut',
            animationDuration: 1000,
            smooth: true
          }]
        }
      },
      currentTitleList: [{
        name: 'wisdomWifi',
        title: '故障告警'
      }],
      activeId: 'wifiNumber'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._getFlowAnalysis();
    })
  },
  computed: {
    ...mapGetters(['common', 'openPage']),
    routeName () {
      this.setBread(this.$route.name)
      return this.$route.name
    }
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    echartData,
    card,
    pageMain,
    Equipment,
    UserTraffic,
    UserDetail
  },
  watch: {
    routeName (val) {
      this.setBread(val)
    }
  },
  methods: {
    setBread (val) {
      if (val === 'wisdomWifi') {
        this.currentTitleList = [{
          name: 'wisdomWifi',
          title: '智慧WIFI'
        }];
      } else if (val === 'wisdomWifiEquipment') {
        this.currentTitleList = [{
          name: 'wisdomWifi',
          title: '智慧WIFI'
        }, {
          name: 'wisdomWifiEquipment',
          title: 'wifi设备管理'
        }];
      } else if (val === 'wisdomWifiUserTraffic') {
        this.currentTitleList = [{
          name: 'wisdomWifi',
          title: '智慧WIFI'
        }, {
          name: 'wisdomWifiUserTraffic',
          title: '用户流量分析'
        }];
      } else if (val === 'wisdomWifiUserDetail') {
        this.currentTitleList = [{
          name: 'wisdomWifi',
          title: '智慧WIFI'
        }, {
          name: 'wisdomWifiUserTraffic',
          title: '用户流量分析'
        }, {
          name: 'wisdomWifiUserDetail',
          title: '用户流量分析详情'
        }];
      }
    },
    onSearch (val) {
      this.searchVal = {
        beginDate: val.date && val.date[0],
        endDate: val.date && val.date[1]
      }
      this._getFlowAnalysis();
    },
    setUserData (items) {
      let xData = [];
      let seriesData = [];
      let seriesFData = [];
      items.map(item => {
        xData.push(item.time);
        seriesData.push(item.userCount);
        seriesFData.push(item.totalFlow);
      });
      this.usageOptions.options.xAxis[0].data = xData;
      this.usageOptions.options.series[0].data = seriesData;
      this.usageOptions.options.series[1].data = seriesFData;
    },

    setFlowData (items) {
      let xData = [];
      let seriesData = [];
      items.map(item => {
        xData.push(item.date);
        seriesData.push(item.perCapitalFlow);
      });
      this.flowOptions.options.xAxis[0].data = xData;
      this.flowOptions.options.series[0].data = seriesData;
    },
    _getFlowAnalysis () {
      flowAnalysis({ ...this.searchVal }).then(res => {
        if (res.code === '200') {
          this.setFlowData(res.data.psgFlowAnalysis);
          this.setUserData(res.data.userAnalysis);
          this.items = this.items.map(item => {
            return {
              ...item,
              value: res.data[item.id] || 0
            }
          });
        }
      })
    },
    handleActive (id) {
      this.activeId = id;
      routePush({
        name: 'wisdomWifiEquipment',
        parames: {
          toName: 'wisdomWifi'
        }
      });
    },
    showView (row) {
      routePush({
        title: 'wifi设备管理',
        name: 'wisdomWifiUserTraffic',
        parames: {
          toName: 'wisdomWifi'
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
#wisdomMonitorWifi{
  .content-view{
    >ul{
      width: 100%;
      background:rgba(53, 77, 145, 0.13);
      border-radius:4px;
      margin-bottom: 10px;/*no*/
      border: 1px solid RGBA(45, 64, 115, 1);/*no*/
      border-left: 4px solid rgba(43,126,242,1);/*no*/
      li{
        flex:1;
        padding:20px 0;
        cursor: pointer;
        .el-avatar{
          margin-right: 40px;
          width:62px;
          height:62px;
          background:linear-gradient(137deg,rgba(0,92,234,1) 0%,rgba(71,192,230,1) 100%);
          display: none;
          align-items: center;
          justify-content: center;
          i{
            font-size: 28px;
          }
        }
        .title{
          font-size:14px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          color:rgba(204,215,248,1);
        }
        .number{
          font-size:34px;
          line-height: 34px;
          margin-top: 10px;
          font-family:DINAlternate-Bold,DINAlternate;
          font-weight:bold;
          color:rgba(255,255,255,1);
          letter-spacing:2px;
          text-shadow:0px 2px 4px rgba(24,15,63,1);
          span{
            font-size: 14px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(204,215,248,1);
            align-self:flex-end;
          }
        }
        &.active{
          background:rgba(53,77,145,0.49);
          .el-avatar{
            display: flex;
          }
        }
      }
    }
    .el-row{
      display: flex;
      flex-direction: row;
      &::after {
        content: '\20';
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
        overflow: hidden;
      }
      /deep/.el-col{
        min-height: 6rem;
        #echartData{
          height: 100%;
          #card{
            height: 100%;
            #echartTable{
              min-height: 6rem;;
              height: 90%;
            }
          }
        }
      }
      margin-bottom: 10px;/*no*/
      .staticData{
        height: 100%;
        #card{
          height: 100%;
        }
      }
      #staticData{
        padding: 45px;
        .items{
          margin-bottom: 24px;
          align-items: center;
          >span{
            width: 100px;/*no*/
            font-size:12px;/*no*/
            font-family:PingFangSC-Semibold,PingFang SC;
            font-weight:600;
            color:rgba(160,172,216,1);
            margin-right: 15px;/*no*/
          }
          .progress{
            flex: 1;
            height:14px;
            background:rgba(216,216,216,0.06);
            border-radius:7px;
            position: relative;
            span{
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              background:linear-gradient(90deg,rgba(255,116,151,0) 0%,rgba(255,56,123,1) 100%);
              border-radius:7px;
            }
          }
        }

      }
    }
    #echartTable, #card, canvas{
      cursor: pointer;
    }
  }
}
</style>
