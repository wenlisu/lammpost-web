/* eslint-disable camelcase */
<template>
  <div id='userDetail'>
    <echartData id="usageRate" :userOptions="usageOptions" />
    <card title="基本信息">
       <FormItemText
          :layout="baseItems"
          labelWidth="0px"
        >
        </FormItemText>
    </card>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import * as echarts from 'echarts'; // 引入echarts
import echartData from '@/view/lightPole/lightPoleStatistical/components/echartData';
import card from '@/view/lightPole/lightPoleStatistical/components/card';
import FormItemText from '@/components/formItemText/formItemText';
import {
  userTodayAnalysis,
  latestRecordDetail
} from 'api/wisdomMonitor';
export default {
  name: 'userDetail',
  data () {
    return {
      usageOptions: {
        title: `今日访问网站流量统计`,
        labers: [{
          background: '#17FFBB',
          name: '流量'
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
            formatter: '网站：{b0}<br />{a0}: {c0}GB'
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
            nameTextStyle: {
              color: '#A0ACD8'
            },
            splitArea: {
              show: false
            }
          }, {
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
            name: '流量',
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
                borderColor: '#F5A623'
              }
            },
            animationEasing: 'cubicInOut',
            animationDuration: 1000,
            smooth: true
          }]
        }
      },
      baseItems: [{
        id: 'serialNumber',
        label: 'WIFI设备ID',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'userMac',
        label: '用户MAC地址',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'connectTime',
        label: '认证时间',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'tel',
        label: '手机号码',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'sourceIp',
        label: '源IP',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'sourcePort',
        label: '源端口',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'targetIp',
        label: '目标IP',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'targetPort',
        label: '目标端口',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'totalTime',
        label: '驻留时长(分钟)',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'url',
        label: '网站URL',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'urlTypeName',
        label: '网站类型',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'upFlow',
        label: '上行流量(MB)',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'downFlow',
        label: '下行流量(MB)',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'totalFlow',
        label: '总流量(MB)',
        value: '',
        unit: '',
        span: 8
      }, {
        id: 'wifiStatusText',
        label: '在线状态',
        value: '',
        unit: '',
        span: 8
      }],
      editData: {}
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.editData = this.common['wisdomWifiUserDetail'];
      this.getDataAllList();
      this.getDetail();
    })
  },
  computed: {
    ...mapGetters(['common', 'openPage'])
  },
  components: {
    FormItemText,
    echartData,
    card
  },
  methods: {
    setUserData (items) {
      let xData = [];
      let seriesData = [];
      items.map(item => {
        xData.push(item.urlName);
        seriesData.push(item.totalFlow);
      });
      this.usageOptions.options.xAxis[0].data = xData;
      this.usageOptions.options.series[0].data = seriesData;
    },
    // 获取所有/查询数据列表
    getDataAllList () {
      userTodayAnalysis(this.editData.userMac).then(res => {
        if (res.code === '200') {
          this.setUserData(res.data);
          this.usageOptions.title = `${this.editData.tel} 今日访问网站流量统计`
        }
      });
    },
    getDetail () {
      latestRecordDetail(this.editData.userMac).then(res => {
        if (res.code === '200') {
          this.baseItems = this.baseItems.map(item => {
            return {
              ...item,
              value: res.data[item.id]
            }
          });
        }
      });
    }
  }
}
</script>

<style lang="less">
#userDetail{
  >#card{
    margin-top: 10px;/*no*/
     #formItemText{
      padding:10px 20px;/*no*/
     }
  }
}
</style>
