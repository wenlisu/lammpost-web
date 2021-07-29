/* eslint-disable camelcase */
<template>
  <div idName='userTraffic'>
      <header-title
        icon="iconfont icon-shouye"
        title="用户流量分析"
      >
        <search-form
          slot="searchBox"
          :searchItems="searchItems"
          @onSearch="onSearch"
        />
      </header-title>

      <div class="content-view">
        <el-row :gutter="10">
          <el-col :span="12">
            <echartData id="usageRate" :userOptions="usageOptions" />
          </el-col>
          <el-col :span="12">
            <div class="staticData">
              <card title="今日TOP10网站流量分析">
                <div id="staticData">
                  <div
                    class="flexRow items"
                    v-for="(item, index) in staticItems"
                    :key="index"
                  >
                    <span>{{index + 1}}  {{item.urlName}}</span>
                    <div class="progress">
                      <span :style="{right: item.value, background: item.background}"></span>
                      <div
                        :style="{
                          position: 'absolute',
                          right: '-20px',
                          top: 0,
                          zIndex: 11,
                          fontSize: '12px',
                          lineHeight: '12px',
                          color: 'rgba(160,172,216,1)'
                        }"
                      >{{item.totalFlow}}GB</div>
                    </div>
                  </div>
                </div>
              </card>
            </div>
          </el-col>
        </el-row>
        <div class="Modeltable">
          <page-table
            col-align="center"
            operator-width="110"
            operator
            :data="tableData"
            :cols="tableCols"
            :page-current="page.current"
            :total="page.total"
            :page-size="page.pageSize"
            @current-change="onCurrentChange"
            @size-change="onPageSizeChange"
          >
            <template slot-scope="scope" slot="operator">
              <el-button
                  type="text"
                  size="small"
                  title="详情"
                  @click.prevent.stop="showView({
                  ...scope.row
                  })"
                  v-if="true || $_hasOperation($options.name,'detail')"
              >
                  <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2EDEF4" />
              </el-button>
            </template>
          </page-table>
        </div>
      </div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import * as echarts from 'echarts'; // 引入echarts
import headerTitle from 'components/headerTitle/headerTitle'
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import echartData from '@/view/lightPole/lightPoleStatistical/components/echartData';
import card from '@/view/lightPole/lightPoleStatistical/components/card';
import { cubicInOut } from '@/util/tool';
import { routePush } from '@/util/util';
import {
  todayAnalysis,
  userRecord
} from 'api/wisdomMonitor';
export default {
  name: 'userTraffic',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'select',
        label: '状态',
        labelWidth: '45px',
        props: {
          fieldName: 'status',
          options: [{
            id: 1,
            name: '在线'
          }, {
            id: 2,
            name: '离线'
          }]
        }
      }],
      usageOptions: {
        title: '今日各时段流量趋势分析',
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
            formatter: '今日各时段流量趋势分析<br />时间：{b0}:00<br />{a0}: {c0}GB'
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
              color: '#A0ACD8',
              formatter: function (value, index) {
                const time = parseInt(value, 10);
                return `${time < 10 ? `0${time}` : time}:00`
              }
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
              formatter: '故障率：{c}%'
            },
            // animationEasing: 'cubicInOut',
            animationDuration: 1000,
            smooth: true
          }]
        }
      },
      staticColorItems: [
        'linear-gradient(90deg,rgba(255,116,151,0) 0%,rgba(255,56,123,1) 100%)',
        'linear-gradient(90deg,rgba(255,94,23,0) 0%,rgba(255,151,51,1) 100%)',
        'linear-gradient(90deg,rgba(35,203,118,0) 0%,rgba(74,230,206,1) 100%)',
        'linear-gradient(90deg,rgba(0,92,234,0) 0%,rgba(27,200,255,1) 100%)'
      ],
      staticItems: [],
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: 'wifi设备名称', prop: 'apName' },
        { label: '灯杆名称',
          prop: 'address',
          render: (h, scope) => {
            return (<el-button type="text" onClick={() => { this.showMapDetail(scope.row) } }>{scope.row.address}</el-button>)
          }
        },
        { label: '用户MAC地址', prop: 'userMac' },
        { label: '手机号码', prop: 'tel' },
        { label: '认证时间', prop: 'connectTime' },
        { label: '驻留时长(分钟)', prop: 'totalTime' },
        { label: '上行流量(MB)', prop: 'upFlow' },
        { label: '下行流量(MB)', prop: 'downFlow' },
        { label: '总流量(MB)', prop: 'totalFlow' },
        { label: '在线状态', prop: 'wifiStatusText' }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getDataAllList();
      this._getTodayAnalysis();
    })
  },
  computed: {
    ...mapGetters(['common', 'openPage']),
    routeName () {
      return this.$route.name
    }
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    echartData,
    card
  },
  watch: {
    routeName (val) {
    }
  },
  methods: {
    onSearch (val) {
      this.searchVal = {
        ...val
      }
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList () {
      let data = {
        data: {
          ...this.searchVal
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      };
      userRecord(data).then(res => {
        if (res.code === '200') {
          const { data, total } = res.data;
          this.page.total = total;
          this.tableData = data;
        }
      });
    },
    onCurrentChange (val) {
      this.page.current = val;
      this.getDataAllList();
    },
    onPageSizeChange (val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    setUserData (items) {
      let xData = [];
      let seriesData = [];
      items.map(item => {
        xData.push(item.time);
        seriesData.push(item.totalFlow);
      });
      this.usageOptions.options.xAxis[0].data = xData;
      this.usageOptions.options.series[0].data = seriesData;
    },
    setStaticItems (items) {
      const allCount = (items[0].totalFlow / 2) + items[items.length - 1].totalFlow;
      items.map((data, index) => {
        const count = (1 - (data.totalFlow / allCount)) * 100;
        this.staticItems.push({
          ...data,
          background: this.staticColorItems[index > 2 ? 3 : index],
          value: `${count}%`,
          totalFlow: data.totalFlow
        })
      });
    },
    _getTodayAnalysis () {
      todayAnalysis().then(res => {
        if (res.code === '200') {
          this.setUserData(res.data.analysisPerHour);
          if (res.data.analysisPerUrl.length > 0) {
            this.setStaticItems(res.data.analysisPerUrl.splice(0, 10));
          }
        }
      })
    },
    showView (row) {
      let parames = {
        ...row,
        toName: 'wisdomWifiUserTraffic'
      };
      routePush({
        name: 'wisdomWifiUserDetail',
        parames
      });
    },
    showMapDetail (row) {
      routePush({
        name: 'lightPoleMap',
        parames: {
          ...row
        }
      });
    }
  }
}
</script>

<style lang="less">
#userTraffic{
              .progressNumber{
              position: absolute;
              right: 0;
              z-index: 11;
              font-size:12px;/*no*/
              font-family:PingFangSC-Semibold,PingFang SC;
              font-weight:600;
              color:rgba(160,172,216,1);
            }
  .content-view{
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
  }
}
</style>
