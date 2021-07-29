<template>
  <div id="smokeStatisticAnalysis1">
    <header-title
      icon="iconfont icon-shouye"
      title="统计分析"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
      />
    </header-title>
      <div class="flexCloumn item detectData">
          <span class="title">
              烟感探测数据
          </span>
          <div class="flexRow content">
              <div
                class="flexRow contentItem"
                v-for="item in detectData.items"
                :key="item.id"
                :class="item.class"
              >
                  <div class="flexCenter icon" :style="item.iconStyle">
                      <i :class="`iconfont icon-${item.icon}`" />
                  </div>
                  <div class="flexRow infoContainer">
                    <div class="flexCloumn info">
                        <span class="infoTitle">{{item.title}}</span>
                        <span class="infoValue">{{item.value}}{{item.unit}}</span>
                    </div>
                    <div class="flexCloumn maxInfo">
                        <span>
                          当日最小值：
                          <span>{{item.min}}</span>
                        </span>
                        <span>
                          当日最大值：
                          <span>{{item.max}}</span>
                        </span>
                    </div>
                  </div>
              </div>
          </div>
      </div>
      <el-row :gutter="10">
        <el-col :span="12">
          <echartData id="normaloption1" :userOptions="option1" height="270px" isTime>
            <div class="flexRow" slot="time">
              <div class="charTitle">
                <span :class="{'is-active': alarmId1 === '1'}" @click="changeAlarm1('1')">当日</span>
                <span :class="{'is-active': alarmId1 === '2'}" @click="changeAlarm1('2')">当月</span>
              </div>
            </div>
          </echartData>
        </el-col>
        <el-col :span="12">
          <echartData id="normaloption2" :userOptions="option2" height="270px" isTime>
            <div class="flexRow" slot="time">
              <div class="charTitle">
                <span :class="{'is-active': alarmId2 === '1'}" @click="changeAlarm2('1')">当日</span>
                <span :class="{'is-active': alarmId2 === '2'}" @click="changeAlarm2('2')">当月</span>
              </div>
            </div>
          </echartData>
        </el-col>
        <el-col :span="24">
          <echartData id="normaloption3" :userOptions="option3" height="270px" isTime>
            <div class="flexRow" slot="time">
              <div class="charTitle">
                <span :class="{'is-active': alarmId3 === '1'}" @click="changeAlarm3('1')">当日</span>
                <span :class="{'is-active': alarmId3 === '2'}" @click="changeAlarm3('2')">当月</span>
              </div>
            </div>
          </echartData>
        </el-col>
      </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'; // 引入echarts
import echartData from '@/view/lightPole/lightPoleStatistical/components/echartData';
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import 'echarts-liquidfill';
import labers from '@/components/labers';
import { routePush, currentDate } from '@/util/util';
import {
  getSmokeDetectorTrendStat,
  getAllSmokeDetectorAlarmStats,
  getSmokeDetectorAvgData
} from '@/api/smokeDetectorMap';

export default {
  data () {
    return {
      detectData: {
        items: [{
          id: 'avgSmokeConcentration',
          icon: 'yanwu',
          title: '烟雾',
          value: '',
          iconStyle: 'background: linear-gradient(320deg, #25D3FF 0%, #3FBAF2 100%);',
          unit: 'db/m'
        }, {
          id: 'avgTemperatureValue',
          icon: 'wendu',
          title: '温度',
          value: '',
          iconStyle: 'background: linear-gradient(320deg, #FF8364 0%, #FF6433 100%);',
          unit: '℃'
        }, {
          id: 'alarmStatusText',
          icon: 'baojing1',
          title: '报警状态',
          value: '正常',
          iconStyle: 'background: linear-gradient(138deg, #FB841A 0%, #FDB638 100%);',
          unit: ''
        }]
      },
      alarmId1: '1',
      alarmId2: '1',
      alarmId3: '1',
      option1: {
        title: '烟雾浓度',
        labers: [],
        options: {}
      },
      option2: {
        title: '温度',
        labers: [],
        options: {}
      },
      option3: {
        title: '报警次数',
        labers: [],
        options: {}
      },
      searchVal: {
      },
      searchItems: [{
        type: 'dataPicker',
        label: '时间',
        labelWidth: '45px',
        props: {
          type: 'date',
          fieldName: 'timeBegin',
          format: 'yyyy-MM-dd HH:mm:ss',
          defaultValue: '',
          defaultTime: ''
        }
      }]
    };
  },
  mounted () {
    this.$nextTick(() => {
      this._getSmokeDetectorAvgData({
        dateInterval: 6
      });
      this._getAllSmokeDetectorAlarmStats({
        dateInterval: 6
      });
      this._getSmokeDetectorTrendStat({
        dateInterval: 6
      }, true, true);
    });
  },
  created () {
    this.searchItems.forEach(item => {
      item.initValue = currentDate();
    })
  },
  components: {
    labers,
    echartData,
    headerTitle,
    searchForm
  },
  methods: {
    onSearch (val) {
      this.searchVal = {
        ...val
      };
      const parames = {
        timeBegin: val.timeBegin,
        dateInterval: 6
      };
      this.trendId1 = '1';
      this.trendId2 = '1';
      this.trendId3 = '1';
      this._getSmokeDetectorAvgData(parames);
      this._getAllSmokeDetectorAlarmStats(parames);
      this._getSmokeDetectorTrendStat(parames, true, true);
    },
    _getSmokeDetectorAvgData (parames) {
      getSmokeDetectorAvgData(parames).then(res => {
        if (res.code === '200') {
          const data = res.data;
          this.detectData = {
            items: [{
              id: 'avgSmokeConcentration',
              icon: 'yanwu',
              title: '烟雾',
              value: data.avgSmokeConcentration,
              min: data.minSmokeConcentration,
              max: data.maxSmokeConcentration,
              iconStyle: 'background: linear-gradient(320deg, #25D3FF 0%, #3FBAF2 100%);',
              unit: 'db/m'
            }, {
              id: 'avgTemperatureValue',
              icon: 'wendu',
              title: '温度',
              min: data.minTemperatureValue,
              max: data.maxTemperatureValue,
              value: data.avgTemperatureValue,
              iconStyle: 'background: linear-gradient(320deg, #FF8364 0%, #FF6433 100%);',
              unit: '℃'
            }, {
              id: 'alarmStatusText',
              icon: 'baojing1',
              title: '报警状态',
              value: data.alarmStatusText,
              iconStyle: 'background: linear-gradient(138deg, #FB841A 0%, #FDB638 100%);',
              unit: ''
            }]
          }
        }
      });
    },
    _getSmokeDetectorTrendStat (parames, init1, init2) {
      getSmokeDetectorTrendStat(parames).then(res => {
        if (res.code === '200') {
          const date = [];
          const concentration = [];
          const temperature = [];
          res.data.map(data => {
            concentration.push(data.avgSmokeConcentration);
            temperature.push(data.avgTemperatureValue);
            date.push(data.simpleTimeAxis);
          });
          if (init1) {
            this.init1({
              date: date,
              count1: concentration
            });
          }
          if (init2) {
            this.init2({
              date: date,
              count1: temperature
            });
          }
        }
      });
    },
    _getAllSmokeDetectorAlarmStats (parames) {
      getAllSmokeDetectorAlarmStats(parames).then(res => {
        if (res.code === '200') {
          const date = [];
          const alarmCount = [];
          res.data.map(data => {
            alarmCount.push(data.alarmCount);
            date.push(data.simpleTimeAxis);
          });
          this.init3({
            date: date,
            count1: alarmCount
          });
        }
      })
    },
    changeAlarm1 (index) {
      const indexType = {
        '1': 6,
        '2': 4
      }
      if (this.alarmId1 !== index) {
        this.alarmId1 = index;
        this._getSmokeDetectorTrendStat({
          dateInterval: indexType[index]
        }, true, false);
      }
    },
    changeAlarm2 (index) {
      const indexType = {
        '1': 6,
        '2': 4
      }
      if (this.alarmId2 !== index) {
        this.alarmId2 = index;
        this._getSmokeDetectorTrendStat({
          dateInterval: indexType[index]
        }, false, true);
      }
    },
    changeAlarm3 (index) {
      const indexType = {
        '1': 6,
        '2': 4
      }
      if (this.alarmId3 !== index) {
        this.alarmId3 = index;
        this._getAllSmokeDetectorAlarmStats({
          dateInterval: indexType[index]
        });
      }
    },
    getChartOptions () {
      return {
        grid: {
          right: '10px',
          left: '10px',
          top: '10px',
          bottom: '10px',
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: '{b0}<br />{a0}: {c0}'
        },
        legend: {
          show: false,
          itemHeight: 10,
          itemWidth: 10,
          textStyle: { color: '#555555', fontSize: 12 },
          bottom: '0px',
          right: '0',
          borderRadius: 2
        },
        xAxis: [
          {
            type: 'category',
            axisLabel: {
              color: '#7E7E7E',
              fontSize: '12'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#E0E0E0'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#E0E0E0'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '', // 左
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                color: '#7E7E7E',
                fontSize: '12'
              }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#E0E0E0'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#E0E0E0'
              }
            }
          }
        ]
      };
    },
    async init1 (data) {
      const chartOptions = await this.getChartOptions();
      this.option1.options = {
        grid: {
          ...chartOptions.grid
        },
        tooltip: {
          ...chartOptions.tooltip,
          formatter: '{b0}<br />{a0}: {c0}ug/m³'
        },
        legend: {
          ...chartOptions.legend
          // data: [{
          //   name: '烟雾浓度',
          //   icon: 'rect'
          // }, {
          //   name: '阀值',
          //   icon: 'rect'
          // }]
        },
        xAxis: [
          {
            ...chartOptions.xAxis[0],
            data: data.date
          }
        ],
        yAxis: [
          {
            ...chartOptions.yAxis[0]
          }
        ],
        series: [
          {
            name: '烟雾浓度',
            type: 'line',
            symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAACYUlEQVRIS71WTW/TQBCdGa+TkK/SRBVQJCTEAQVxS38BQeIER7j0xK/gRrjxKzj1AleulF+Q3FBTDoBUqRFS1BTyRRKvZ9BasmMndhpRUx/t9b59b968WYQLnnqrZd+uF3PjoWSAskrhlMwvWnIMPNOFEs5P26Npe2/PWbcVJn2sS8u+PiyUycLsRYcx39mV2a/SeNDGeMBYoMf9b1uYdQqbACyvkZk9/lS593v5fRSo2aTG6xfbNNmMRdJBOC+zwzfvz6HZZH9NBKghneplQfyNPTCsna0ArZPLQYuUpbeRsKw15pQiS2t2lZKpsAy0q85tcYPT+5uHZfQYmcJXJsWdOClE0RaS7AqQSpIKgbUwdlHzSm36+VHPGMQDagw61Th3kY07LtLNTU1hCf9kR3rh9caNh+XaGZo+qdRW2RgmQHhnU5BgHcvJMrN+Z9TDZ3Jc+jOBUnhDUxPb5vthuQghA0zPEeURABiZeyL4GYg/sMB8UXTWjkNfwzW7lochxskmSqpAatf/2YAQ41sAeBDD8IhJXoXBgHUXNQaOM/JhY/T9BuHcimyQgbsCVjEAEtonkP3EvgE8YOSDBSt3BHP4EVhdMi4+GR/dYqBIP2nCmqUWLrMA36FAwHAlDRC6LshL/72rWSuWTnBQYIkFgoz1UAACcAvwIwrYSYwEwXFBnoaaU2DufokAxUmXNiM20sX2UNo1MmaIs3farvPsHdewafeR17BJEZRWMgQRtC5U08i6SKgasKQxcZn0XhkTvt+TBt+/zKPEweeBXdUo95n9/8tJKGOu5LoVzrS0LpB/AWs6whqjtUE7AAAAAElFTkSuQmCC',
            symbolSize: 30,
            animationEasing: 'cubicInOut',
            animationDuration: 1000,
            smooth: true,
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
                color: '#17FFBB',
                borderWidth: 10,
                borderColor: '#F5A623',
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 1,
                    color: 'rgba(43, 241, 255, 0.3)'
                  },
                  {
                    offset: 0,
                    color: 'rgba(23, 255, 187, 0)'
                  }
                  ])
                }
              }
            },
            tooltip: {
              show: 'true',
              formatter: '湿度：{c}%'
            },
            data: data.count1
          }
        ]
      };
    },
    async init2 (data) {
      const chartOptions = await this.getChartOptions();
      this.option2.options = {
        grid: {
          ...chartOptions.grid
        },
        tooltip: {
          ...chartOptions.tooltip,
          formatter: '{b0}<br />{a0}: {c0}℃'
        },
        legend: {
          ...chartOptions.legend
        },
        xAxis: [
          {
            ...chartOptions.xAxis[0],
            data: data.date
          }
        ],
        yAxis: [
          {
            ...chartOptions.yAxis[0]
          }
        ],
        series: [
          {
            name: '温度',
            type: 'line',
            symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAACf0lEQVRIS71WMW/TUBC+e+85SVOc0oQIKBIVEhJKVQZImZAYCBITjEyd+AlMbISNiZ/A1ImVlTAgMdHAACJCQkJFIgKZphA3aRK/9w7Zkh0nttOImmaLfb7vfd99d/cQDvltV7eN6rnVnN3LZhgcCBSMuZ+Q1FrDgjQXh6Pm953BRnPDmZUKk15SlQz7pF3gbJg97DDue6WzQ/O32cUmxgLGAnVudZayqBbnAZiOGRLvFV8W/0w/nwCqQ509qj1Y7s/JIukgeZ0dPm483atDXfsxE0BU65aOCuIndsGwUdiNAM2SCx3GuMBlhk5BSsoJYXApHSUEDjQZXSVpjwwdnN5PHpbRY+QWvl/8VY6TQhAuMYQVIBSJNUOSmqAtkSK1yXdOWa5BPKBurVuKc5fBRBmVPjOvKYizH46WVjjedWOhUdhFt08qxdUIG48J4Pl5Qfw4DfRtmlmrs2Mh3bXM/gGY4YRuTQyDLoXlwpyTgcqXe5Dv3wSuy6CYBf38K2hdfE4DYxR8jyQdBz+Ha5ZfABvjZBPESwxoJXBMzsnQ1Q9PQMi1CEMpPuG7yw/DYBqwLVEFjnPlw/3az9PIGA8nyIC+ACROBEBXWptk2ptJMqJtbtH7ytaYldwfAfvq/yetFfZuW2dBw0Q/MakqghuBy/B68xlxFTCMdL3ibXpTve8/l8qRWvBWEMeAYoEywNaBxuB44+0LAjISGQE69PranTEjoBHojxNAcdKlzciTLs4MadfIM0OcvdN2nWfvuIZNu4+8hk0aQWlNhmAEzRqqacy6iaHqgiWtiaNM78iaCDo4YfH9yz5KXHwu2LGtcp/Zf7+chEfMsVy3woBpXSD/AuK30ba/enEZAAAAAElFTkSuQmCC',
            symbolSize: 30,
            animationEasing: 'cubicInOut',
            animationDuration: 1000,
            smooth: true,
            lineStyle: {
              normal: {
                width: 3,
                curveness: 0.2,
                color: {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: '#FF85B2' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#BB4DFF' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#FF85B2',
                borderWidth: 10,
                borderColor: '#F5A623',
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 1,
                    color: 'rgba(255, 133, 178, 0.3)'
                  },
                  {
                    offset: 0,
                    color: 'rgba(187, 77, 255, 0)'
                  }
                  ])
                }
              }
            },
            tooltip: {
              show: 'true',
            },
            data: data.count1
          }
        ]
      };
    },
    async init3 (data) {
      const chartOptions = await this.getChartOptions();
      this.option3.options = {
        grid: {
          ...chartOptions.grid
        },
        tooltip: {
          ...chartOptions.tooltip,
          formatter: '{b0}<br />{a0}: {c0}次'
        },
        legend: {
          ...chartOptions.legend
        },
        xAxis: [
          {
            ...chartOptions.xAxis[0],
            data: data.date
          }
        ],
        yAxis: [
          {
            ...chartOptions.yAxis[0]
          }
        ],
        series: [
          {
            name: '报警次数',
            type: 'line',
            symbol: 'circle',
            symbolSize: 3,
            lineStyle: {
              normal: {
                width: 3,
                color: {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: '#ABFC5D' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#ABFC5D' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#ABFC5D',
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 1,
                    color: 'rgba(171, 252, 93, 0.3)'
                  },
                  {
                    offset: 0,
                    color: 'rgba(171, 252, 93, 0)'
                  }
                  ])
                }
              }
            },
            tooltip: {
              show: 'true',
              formatter: 'PM2.5：{c}ug/m³'
            },
            animationEasing: 'cubicInOut',
            animationDuration: 1000,
            smooth: true,
            data: data.count1
          }
        ]
      };
    }
  }
};
</script>

<style lang="less">
#smokeStatisticAnalysis1{
    .item{
        padding: 10px 24px;/*no*/
        background: #fff;
        .title {
            font-size: 14px;/*no*/
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #5F5F5F;
        }
    }
    .detectData{
        width: 100%;
        margin-bottom: 10px;/*no*/
        .content{
            width: 100%;
            padding: 24px 0 13px;/*no*/
            .contentItem{
                 flex: 3;
                 border-right: 1px solid #EBEBEB;/*no*/
                 margin-right: 40px;/*no*/
                 .icon{
                    width: 60px;/*no*/
                    height: 57px;/*no*/
                    border-radius: 8px;/*no*/
                    margin-right: 14px;/*no*/
                    i{
                        font-size: 28px;/*no*/
                        color: #fff;
                    }
                 }
                 .infoContainer{
                   flex: 1;
                   justify-content: space-between;
                   padding-right: 20px;/*no*/
                 }
                .info{
                    .infoTitle{
                        font-size: 14px;/*no*/
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #5D5D5D;
                    }
                    .infoValue{
                        font-size: 28px;/*no*/
                        font-family: DINAlternate-Bold, DINAlternate;
                        font-weight: bold;
                        color: #FF7A46;
                    }
                }
                .maxInfo{
                  justify-content: flex-end;
                  >span{
                    font-size: 12px;/*no*/
                    font-weight: 400;
                    color: #5D5D5D;
                    &:first-child{
                      margin-bottom: 10px;/*no*/
                    }
                    >span{
                      font-size: 14px;/*no*/
                      color: #FF720D;
                      margin-left: 6px;
                    }
                  }
                }
                &:last-child{
                    flex: 2;
                    border-right: none;
                    margin-right: 0;
                    .info{
                        .infoValue{
                            color: #15A26A;
                        }
                    }
                    .maxInfo{
                      display: none;
                    }
                }
            }
        }
    }
    #echartData{
      .charTitle{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        .flexRow{
          background: transparent;
          padding: 0;
        }
        span{
          padding: 4px 12px;/*no*/
          font-size: 12px;/*no*/
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #6B6B6B;
          cursor: pointer;
          &.is-active{
            color: #fff;
            background: #3471F5;
            border-radius: 4px;/*no*/
          }
        }
      }
    }
}
</style>
