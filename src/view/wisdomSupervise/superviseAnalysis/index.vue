<template>
  <pageMain idName='superviseAnalysis' :currentTitleList="currentTitleList">
    <div class="superviseAnalysis-wrap">
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
        <div class="flexCloumn headerCard">
            <el-row :gutter="10" class="flexRow list1">
              <el-col
                v-for="item in listItems"
                :key="item.id"
                :span="6"
              >
                <div class="flexCloumn content" :class="item.iconClass">
                  <div class="flexRow baseInfo">
                    <div class="icon">
                      <i :class="`iconfont ${item.icon}`"/>
                    </div>
                    <div class="name">{{item.name}}</div>
                    <div class="value">{{item.value}}<span>{{item.value ? item.unit : ''}}</span></div>
                  </div>
                  <div class="flexRow maxInfo">
                    <div class="fa">
                      <span>{{item.minValue}}</span>
                      <span>最小值</span>
                    </div>
                    <div class="fa">
                      <span>{{item.maxValue}}</span>
                      <span>最大值</span>
                    </div>
                    <div class="fa">
                      <span>{{item.thresholdValue}}</span>
                      <span>报警范围</span>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <el-row :gutter="10" class="list2">
            <el-col :span="12">
              <echartData id="usageRate" :userOptions="option1" height="400px" isTime>
                <div class="flexRow" slot="time">
                  <span :class="{'is-active': trendId1 === 6}" @click="changeTrend1(6)">当日</span>
                  <span :class="{'is-active': trendId1 === 5}" @click="changeTrend1(5)">当月</span>
                </div>
              </echartData>
            </el-col>
            <el-col :span="12">
              <echartData id="usageRate" :userOptions="option2" height="400px" isTime>
                <div class="flexRow" slot="time">
                <span :class="{'is-active': trendId2 === 6}" @click="changeTrend2(6)">当日</span>
                <span :class="{'is-active': trendId2 === 5}" @click="changeTrend2(5)">当月</span>
              </div>
              </echartData>
            </el-col>
            <el-col :span="24">
              <echartData id="usageRate" :userOptions="option3" height="400px" isTime>
                <div class="flexRow" slot="time">
                <span :class="{'is-active': trendId3 === 6}" @click="changeTrend3(6)">当日</span>
                <span :class="{'is-active': trendId3 === 5}" @click="changeTrend3(5)">当月</span>
              </div>
              </echartData>
            </el-col>
          </el-row>
    </div>
  </pageMain>
</template>
<script>
import {
  mapGetters
} from 'vuex';
import * as echarts from 'echarts'; // 引入echarts
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect';
import Flex from '@/components/flex';
import labers from '@/components/labers';
import headerTitle from 'components/headerTitle/headerTitle'
import searchForm from 'components/searchForm/searchForm';
import FormItemText from '@/components/formItemText/formItemText';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import PageTable from '@/components/adminPage-table';
import PoleMap from '@/view/index/lightPoleMap/poleMap';
import pageMain from 'components/pageMain';
import echartData from '@/view/lightPole/lightPoleStatistical/components/echartData';
import { routePush, currentDate } from '@/util/util';
import {
  getAmbientMonitoringStat,
  getAmbientMonitoringTrendStat
} from 'api/supervise';
import 'swiper/swiper-bundle.css';

const onlineStatusType = {
  1: '在线',
  2: '故障',
  3: '离线'
};

const alarmStatusType = {
  1: '报警',
  0: '在线'
};

const statusPandType = {
  正常: 'normal',
  离线: 'normal',
  故障: 'malfunction',
  报警: 'alarm'
};

export default {
  name: 'superviseAnalysis',
  components: {
    Treeselect,
    Flex,
    FormItemText,
    card,
    PageTable,
    Swiper,
    SwiperSlide,
    echartData,
    searchForm,
    PoleMap,
    labers,
    headerTitle,
    pageMain
  },
  data () {
    return {
      currentTitleList: [
        {
          name: 'superviseMap',
          title: '环境监测'
        },
        {
          name: 'superviseAnalysis',
          title: '统计分析'
        }
      ],
      listItems: [{
        id: 'b',
        name: '温度',
        value: '25',
        thresholdValue: '30',
        maxValue: '25',
        minValue: '25',
        icon: 'icon-wendu',
        iconClass: 'orange',
        unit: '℃'
      }, {
        id: 'c',
        name: '湿度',
        value: '10.7',
        thresholdValue: '20',
        maxValue: '17.7',
        minValue: '25',
        icon: 'icon-shidu',
        iconClass: 'orange',
        unit: '%'
      }, {
        id: 'd',
        name: '噪声',
        value: '10.7',
        thresholdValue: '20',
        maxValue: '17.7',
        minValue: '25',
        icon: 'icon-shidu',
        iconClass: 'orange',
        unit: '分贝'
      }, {
        id: 'e',
        name: 'PM2.5',
        value: '10.7',
        thresholdValue: '20',
        maxValue: '17.7',
        minValue: '25',
        icon: 'icon-shidu',
        iconClass: 'orange',
        unit: '%'
      }, {
        id: 'f',
        name: 'PM10',
        value: '10.7',
        thresholdValue: '20',
        maxValue: '17.7',
        minValue: '25',
        icon: 'icon-shidu',
        iconClass: 'orange',
        unit: '%'
      }],
      trendId1: 6,
      trendId2: 6,
      trendId3: 6,
      option1: {
        title: '温度湿度',
        labers: [{
          background: '#FA9D48',
          name: '温度'
        }, {
          background: '#48FADC',
          name: '湿度'
        }],
        options: {}
      },
      option2: {
        title: '噪声',
        labers: [],
        options: {}
      },
      option3: {
        title: '空气质量',
        labers: [{
          background: '#ABFC5D',
          name: 'PM2.5'
        }, {
          background: '#FA9D48',
          name: 'PM10'
        }],
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
  watch: {
    filterSelect (val) {
      this.$refs.tree.filter({val, type: 'statusText'});
    },
    filterText (val) {
      this.$refs.tree.filter({val, type: 'label'});
    }
  },
  created () {
    this.searchItems.forEach(item => {
      item.props.defaultValue = currentDate();
    })
  },
  mounted () {
    this.$nextTick(() => {
      this._getAmbientMonitoringStat({});
      this._getAmbientMonitoringTrendStat({
        dateInterval: 6
      }, true, true, true);
    });
  },
  computed: {
    ...mapGetters(['common', 'openPage']),
    routeName () {
      return this.$route.name
    }
  },
  methods: {
    _getAmbientMonitoringStat (parames) {
      getAmbientMonitoringStat(parames).then(res => {
        if (res.code === '200') {
          const data = res.data;
          this.listItems = [{
            id: 'b',
            name: '温度',
            value: data.avgTemperatureValue,
            thresholdValue: `${data.temperatureLowThreshold || 0}~${data.temperatureMaxThreshold || 0}`,
            maxValue: data.maxTemperatureValue,
            minValue: data.minTemperatureValue,
            icon: 'icon-wendu',
            iconClass: 'orange',
            unit: '℃'
          }, {
            id: 'c',
            name: '湿度',
            value: data.avgHumidityValue,
            thresholdValue: `${data.humidityLowThreshold || 0}~${data.humidityMaxThreshold || 0}`,
            maxValue: data.maxHumidityValue,
            minValue: data.minHumidityValue,
            icon: 'icon-shidu',
            iconClass: 'c2',
            unit: '%'
          }, {
            id: 'd',
            name: '噪声',
            value: data.avgNoiseValue,
            thresholdValue: `${data.noiseLowThreshold || 0}~${data.noiseMaxThreshold || 0}`,
            maxValue: data.maxNoiseValue,
            minValue: data.minNoiseValue,
            icon: 'icon-shidu',
            iconClass: 'c3',
            unit: '分贝'
          }, {
            id: 'e',
            name: 'PM2.5',
            value: data.avgPmValue,
            thresholdValue: `${data.pmLowThreshold || 0}~${data.pmMaxThreshold || 0}`,
            maxValue: data.maxPmValue,
            minValue: data.minPmValue,
            icon: 'icon-shidu',
            iconClass: 'c4',
            unit: 'ug/m³'
          }, {
            id: 'f',
            name: 'PM10',
            value: data.avgPmTenValue,
            thresholdValue: `${data.pmTenLowThreshold || 0}~${data.pmTenMaxThreshold || 0}`,
            maxValue: data.maxPmTenValue,
            minValue: data.minPmTenValue,
            icon: 'icon-shidu',
            iconClass: 'c5',
            unit: 'ug/m³'
          }];
        }
      })
    },
    _getAmbientMonitoringTrendStat (parames, init1, init2, init3) {
      getAmbientMonitoringTrendStat(parames).then(res => {
        if (res.code === '200') {
          const temperatureList = [];
          const humidityList = [];
          const noiseList = [];
          const pmList = [];
          const pmTenList = [];
          const date = [];
          res.data.map(data => {
            temperatureList.push(data.avgTemperatureValue);
            humidityList.push(data.avgHumidityValue);
            noiseList.push(data.avgNoiseValue);
            pmList.push(data.avgPmValue);
            pmTenList.push(data.avgPmTenValue);
            date.push(data.simpleTimeAxis);
          });
          if (init1) {
            this.init1({
              date: date,
              count1: temperatureList,
              count2: humidityList
            });
          }
          if (init2) {
            this.init2({
              date: date,
              count1: noiseList
            });
          }
          if (init3) {
            this.init3({
              date: date,
              count1: pmList,
              count2: pmTenList
            });
          }
        }
      })
    },
    onSearch (val) {
      this.searchVal = {
        ...val
      };
      const parames = {
        timeBegin: val.timeBegin,
        dateInterval: 6
      };
      this.trendId1 = 6;
      this.trendId2 = 6;
      this.trendId3 = 6;
      this._getAmbientMonitoringStat(parames);
      this._getAmbientMonitoringTrendStat(parames, true, true, true);
    },
    changeTrend1 (index) {
      console.log(index)
      if (index !== this.trendId1) {
        this.trendId1 = index;
        this._getAmbientMonitoringTrendStat({
          timeBegin: this.searchVal.timeBegin,
          dateInterval: index
        }, true, false, false);
      }
    },
    changeTrend2 (index) {
      if (index !== this.trendId2) {
        this.trendId2 = index;
        this._getAmbientMonitoringTrendStat({
          timeBegin: this.searchVal.timeBegin,
          dateInterval: index
        }, false, true, false);
      }
    },
    changeTrend3 (index) {
      if (index !== this.trendId3) {
        this.trendId3 = index;
        this._getAmbientMonitoringTrendStat({
          timeBegin: this.searchVal.timeBegin,
          dateInterval: index
        }, false, false, true);
      }
    },
    getChartOptions () {
      return {
        grid: {
          left: '10px',
          right: '10px',
          top: '10px',
          bottom: '40px',
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'item'
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
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '', // 左
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
          show: true,
          trigger: 'axis',
          formatter: '{b0}<br />{a0}: {c0}<br />{a1}：{c1}'
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
            name: '温度',
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
                    color: '#FFAE4D' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#FFAE4D' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#FFAE4D',
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 1,
                      color: 'rgba(255, 174, 77, 0.3)'
                    },
                    {
                      offset: 0,
                      color: 'rgba(255, 174, 77, 0)'
                    }
                  ])
                }
              }
            },
            tooltip: {
              show: 'true',
              formatter: '温度：{c}℃'
            },
            animationEasing: 'cubicInOut',
            animationDuration: 1000,
            smooth: true,
            data: data.count1
          },
          {
            name: '湿度',
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
            data: data.count2
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
          ...chartOptions.tooltip
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
              formatter: '噪声：{c}分贝'
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
          show: true,
          trigger: 'axis',
          formatter: '{b0}<br />{a0}: {c0}<br />{a1}：{c1}'
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
            name: 'PM2.5',
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
          },
          {
            name: 'PM10',
            type: 'line',
            symbol: 'circle',
            symbolSize: 3,
            animationEasing: 'cubicInOut',
            animationDuration: 1000,
            smooth: true,
            lineStyle: {
              normal: {
                width: 3,
                color: {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: '#FF7B39' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#FF7B39' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#FF7B39',
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 1,
                    color: 'rgba(255, 123, 57, 0.3)'
                  },
                  {
                    offset: 0,
                    color: 'rgba(255, 123, 57, 0)'
                  }
                  ])
                }
              }
            },
            tooltip: {
              show: 'true',
              formatter: 'PM10：{c}ug/m³'
            },
            data: data.count2
          }
        ]
      };
    }
  }
};
</script>
<style lang="less">
#superviseAnalysis{
      >.headerCard{
      }
      .normalHeader{
        align-items: center;
        justify-content: space-between;
        .normalTitle{
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #393939;
          margin-right: 10px;/*no*/
        }
        .normalStatus{
          background: linear-gradient(135deg, #2FCE7D 0%, #22B58E 100%);
          color: #fff;
          padding: 5px 11px;/*no*/
          font-size: 12px;/*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 1;
          &.normalStatus0{
            background: #A6A6A6;
          }
        }
      }
      #formItemText{
        margin-top: 10px;/*no*/
      }
      .list1{
        .el-col{
          height: 100%;
          .content{
            height: 100%;
            padding: 13px 15px;/*no*/
            justify-content: space-between;
            background: linear-gradient(270deg, rgba(45, 61, 123, 0.49) 0%, rgba(118, 96, 40, 0.47) 100%);
            border-radius: 4px;/*no*/
            .icon{
              position: absolute;
              left: -18px;/*no*/
              top: 50%;
              transform: translateY(-50%);
              width: 36px;/*no*/
              height: 36px;/*no*/
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              i{
                font-size: 24px;/*no*/
                color:#fff;
              }

            }
            .baseInfo{
              flex: 1;
              height: 36px;/*no*/
              justify-content: space-between;
              position: relative;
              background: linear-gradient(270deg, rgba(83, 111, 152, 0) 0%, rgba(14, 88, 137, 0.5) 100%);
              border-radius: 1px;/*no*/
              padding-left: 30px;/*no*/
              margin-left: 20px;
              align-items: center;
              .name{
                font-size: 16px;/*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                display: flex;
                align-items: center;
              }
              .value {
                height: 23px;/*no*/
                font-size: 26px;/*no*/
                // font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #FFFFFF;
                background: linear-gradient(180deg, #FFF7E8 0%, #FFF0D8 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                display: flex;
                align-items: center;
                span{
                  line-height: 1;
                  font-size: 16px;/*no*/
                  margin-left: 5px;
                  align-self: flex-end;
                }
              }
            }
            .maxInfo{
              width: 100%;
              margin-top: 35px;/*no*/
              justify-content: space-between;
              >div{
                display: flex;
                flex-direction: column;
              }
              span{
                font-size: 16px;/*no*/
                // font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #FFFFFF;
                text-align: center;
                &:last-child{
                  font-size: 12px;/*no*/
                  margin-top: 5px;/*no*/
                  color:#5BB0F1;
                }
              }
            }
            &.orange{
              .icon{
                background: linear-gradient(130deg, #E4701F 0%, #FFC441 100%);
              }
            }
            &.c2{
                background: linear-gradient(270deg, #2D3D7B 0%, rgba(4, 87, 141, 0.75) 100%);
              .icon{
                background: linear-gradient(130deg, #10B57E 0%, #21B6CA 100%);
              }
            }
            &.c3{
                 background: linear-gradient(270deg, #2D3D7B 0%, rgba(67, 38, 133, 0.81) 100%);
              .icon{
                background: linear-gradient(130deg, #B327FF 0%, #F06565 100%);
              }
            }
            &.c4{
                background: linear-gradient(270deg, #2D3D7B 0%, rgba(89, 59, 22, 0.53) 100%);
              .icon{
                background: linear-gradient(130deg, #8C6C0C 0%, #DDA55C 100%);
              }
            }
            &.c5{
                background: linear-gradient(270deg, #2D3F7B 0%, rgba(32, 48, 153, 0.55) 100%);
              .icon{
                background: linear-gradient(130deg, #0C448C 0%, #5D5CDD 100%);
              }
            }
          }
          &:last-child{
            .content{
              border-right: none;
            }
          }
        }
      }
      .list2{
        margin-top: 10px;/*no*/
        &::after{
          content: none;
        }
        .el-col{
          margin-bottom:10px;/*no*/
        }
        .chart{
          width: 100%;
          height: 300px;
        }
      }
}

</style>

