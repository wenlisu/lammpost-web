/* eslint-disable camelcase */
<template>
  <div id='lightAlarmAnalysis'>
    <!-- 报警事件 -->
    <InfoItem :items="items"/>
      <el-row :gutter="10">
        <el-col :span="12">
          <div style="width: 100%">
          <echartData id="usageRate" :userOptions="usageOptions" height="300px" isTime>
            <div slot="time">
              <div v-if="searchVal.timeBegin">{{searchVal.timeBegin}}~{{searchVal.timeEnd}}</div>
              <div v-else>今日</div>
            </div>
          </echartData>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="width: 100%">
            <card title="本月告警次数TOP10排名">
                <div id="staticData">
                  <div
                    class="flexRow items"
                    v-for="(item, index) in staticItems"
                    :key="index"
                  >
                    <span>{{index + 1}}  {{item.alarmContent}}</span>
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
                      >{{item.alarmCount}}次</div>
                    </div>
                  </div>
                </div>
              </card>
          </div>
        </el-col>
      </el-row>
    <header-title
      icon="iconfont icon-shouye"
      title="历史报警"
    >
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        otherBtnVisible
        :otherBtnLists="[{
          label: '处理',
          disabled: selectsList.length === 0,
          click: () => {
            showView('dealine')
          }
        }]"
        @onSearch="onSearch"
      />
    </header-title>
    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="center"
          operator-width="60"
          operator
          selection
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          @selection-change="onSelectionChange"
        >
          <template
            slot-scope="scope"
            slot="operator"
          >
            <flex>
              <el-button
                type="text"
                size="small"
                title="处理"
                :style="{marginRight: '10px'}"
                @click.prevent.stop="showView('dealine', {
                  ...scope.row
                })"
                v-if="true || $_hasOperation($options.name,'detail')">
                <i class="iconfont icon-xiangqing" style="fontSize: 20px; color: #2573f1"/>
              </el-button>
              <!-- <el-button
                type="text"
                size="small"
                title="删除"
                @click.prevent.stop="showView('del', {
                  ...scope.row
                })"
                v-if="true || ($_hasOperation($options.name,'edit'))">
                <i class="iconfont icon-shanchu" style="fontSize: 20px; color: #FF5736"/>
              </el-button> -->
            </flex>
          </template>
        </page-table>
      </div>
    </div>
    <dialogCont
        @on-cancel="dialogCancel"
        @on-confirm="dialogSubmit"
        :visible.sync="dialog.show"
        :title="dialog.title"
      >
      <div style="marginBottom: 10px"><span style="color:#F56C6C;marginRight: 4px">*</span>请输入报警原因和处理方法：</div>
        <FormItem
          ref="formItem"
          :formItems="formItems"
          :rules="formRules"
          :disabled="inputDisabled"
          placeholder=""
          :isEdit="isEdit"
          :form="form"
          :labelWidth="'0px'"
          :midway="true"
        >
        </FormItem>
      </dialogCont>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex';
import * as echarts from 'echarts'; // 引入echarts
import pageMain from 'components/pageMain';
import Flex from '@/components/flex';
import dialogCont from '@/components/adminDialog';
import FormItem from '@/components/adminFormItem';
import headerTitle from 'components/adminHeaderTitle/headerTitle'
import searchForm from 'components/adminSearchForm/searchForm';
import PageTable from '@/components/adminPage-table';
import echartData from '@/view/lightPole/lightPoleStatistical/components/echartData';
import card from '@/view/lightPole/lightPoleStatistical/components/card';
import { cubicInOut } from '@/util/tool';
import { routePush } from '@/util/util';
import img7 from '@/view/index/wisdomWarnMap/images/img7.png';
import img8 from '@/view/index/wisdomWarnMap/images/img8.png';
import img9 from '@/view/index/wisdomWarnMap/images/img9.png';
import img10 from '@/view/index/wisdomWarnMap/images/img10.png';
import InfoItem from '@/view/adminSupervise/superviseRecord/info';
import {
  getAmbientMonitoringAlarmHandleCount,
  getAmbientMonitoringRunStatus,
  getAmbientMonitoringAlarmEventForPage,
  getAmbientMonitoringAlarmCount,
  handleAmbientMonitoringAlarm
} from 'api/supervise';
export default {
  name: 'lightAlarmAnalysis',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'dataPicker',
        label: '告警日期',
        labelWidth: '60px',
        props: {
          type: 'datetimerange',
          fieldName: 'time',
          format: 'yyyy-MM-dd HH:mm:ss'
        }
      }, {
        type: 'input',
        label: '告警编号',
        labelWidth: '60px',
        props: {
          fieldName: 'deviceName'
        }
      }, {
        type: 'input',
        label: '设备名称',
        labelWidth: '60px',
        props: {
          fieldName: 'deviceName'
        }
      }],
      usageOptions: {
        title: '报警数量趋势分析',
        labers: [{
          background: '#17FFBB',
          name: '报警次数'
        }],
        options: {
          grid: {
            left: '10px',
            right: '10px',
            top: '10px',
            bottom: '20px',
            containLabel: true
          },
          tooltip: {
            show: true,
            trigger: 'item'
          },
          xAxis: [{
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
              alignWithLabel: true
              // show: false
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#E0E0E0'
              }
            }
          }],
          yAxis: [ {
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
          }],
          series: [{
            name: '报警次数',
            type: 'line',
            data: [],
            symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAvpJREFUSA29VsluE0EQ7eoZj+MgJw5EICEicUmCxCFsZ/6ACIT4mNxy4yv4AoRA8Afc2Q6RknBBCkJCZI+I7dmKej30uGbsGAKBPrhrf+7q6qoh84u1yhy+3d5ocZOaxzYOQgosXFLO8sk8yqjP/Vuzi91VonRcKDpJ+WhtLerNhVO9gKOTbLR8IqN4Yis9fHr9eqzlnh4CYmZ6sP9++nvUmvRGp9nPxd3j550bB0TE2q8CJGmyb442z//uKXQgTeN0t9sLu5LO3MtdvsHgJGcBglj4o4iFmOCxwmIzBunqRa2R95FIAYSBnTF5Ok1h2DQmD4yxGadp39jwIM3yvYYUh4+FHWCIKeQ+eIeIi9+/GsxCUF95nnWo0bhsApLgJ6yMM06SL9YGLqi26nzKtlEgLnWoLq0sac4u0kQ0NxYExvInnJ3Yl74/CR/b4p2MunychJvRpbrjOB728NM2iA0MWv623u5OmrZWujuxfE2fJCeyUc4P2dBdInOF2Xwmw69jS88s8+B+JI1pTuv6zlrH5ijEi5ea0zjGXbzFhRcLIA2mx8ItuUsVc9nn5Xde5HcSMislmKQxJCmcNNvx/sCwaCteUO5SXSUtBE5CzEta5mnIofe822v+wLC+d2nDooQHEqRrwA1TdX3dHxjlg626D9IGOe6kqq9yw/qqP6wtunDVzYkzLcPFa75OD+ttxR8YFq1+yBEvXi1Ul2KHyLredQxlBQyLeaJkBSltRctQwkz0Qcs8DTn0nnd7zR8YFkOrYiQMepeR9+DlKN2EeEWewROp7I9S2123Cw95WdpwwDuCv1rAcM/i3uHGbL07uB6H9nPKxb14S/c8jIxXU4vbruowGevxYEz9+GtdPo6HvQaBrY/tTgTB/b13nVFT9W+6N6bti5mbgzEBIAyp5aPNC/UUQvcn8wgpe9le2PEjvRx8EEiX3R01ZV2DLHrXjokTYMvKimGWJ6ZRCMpfP8o9CBRl6rzVf/k48WDY//nnlgYDjaF1Fh+QPwABs7TSZWsDFQAAAABJRU5ErkJggg==',
            symbolSize: 30,
            lineStyle: {
              normal: {
                width: 3,
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
            animationEasing: 'cubicInOut',
            animationDuration: 1000,
            smooth: true
          }]
        }
      },
      page: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableCols: [
        { label: '告警编号', prop: 'serialNumber' },
        { label: '设备ID', prop: 'deviceName' },
        { label: '设备名称', prop: 'alarmTypeText' },
        { label: '设备类型', prop: 'alarmLevelText' },
        { label: '告警类型', prop: 'alarmName' },
        { label: '告警内容', prop: 'alarmValue' },
        { label: '告警时间', prop: `` },
        { label: '本月告警次数(次)', prop: 'alarmTime', minWidth: '120px' },
        { label: '告警状态', prop: 'alarmHandleStatusText' },
        { label: '是否派单', prop: 'handleUser' }
      ],
      selectsList: [],
      currentTitleList: [{
        name: 'faultWarn',
        title: '报警事件记录'
      }],
      trendId: 6,
      items: [{
        id: 'todayAlarmCount',
        src: img7,
        class: 'blue',
        name: '告警设备数',
        unit: '个',
        value: '',
        click: () => {}
      }, {
        id: 'monthAlarmCount',
        src: img8,
        class: 'pink',
        name: '告警次数',
        unit: '次',
        value: '',
        click: () => {}
      }, {
        id: 'unHandleCount',
        src: img9,
        class: 'green',
        name: '未处理告警 ',
        unit: '次',
        value: '',
        click: () => {}
      }, {
        id: 'doHandleCount',
        src: img10,
        class: 'orang',
        name: '已处理告警',
        unit: '次',
        value: '',
        click: () => {
          routePush({
            name: 'wisdomPublishAnalyse',
            parames: {}
          });
        }
      }],
      inputDisabled: false,
      isEdit: true,
      form: {
        handleRemark: undefined
      },
      options: [],
      formItems: [{
        label: '',
        prop: 'handleRemark',
        inputType: 'textarea',
        placeholder: '请输入报警原因和处理方法',
        minRows: 3,
        maxlength: 200,
        required: true,
        span: 24
      }],
      formRules: {},
      dialog: {
        show: false,
        item: null,
        title: '报警事件处理'
      },
      staticItems: []
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getDataAllList();
      this._getAlarmCallTrendStats({
        dateInterval: 6
      });
      this._getTerminalCount();
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
    card,
    pageMain,
    InfoItem,
    Flex,
    dialogCont,
    FormItem
  },
  watch: {
    routeName (val) {
    }
  },
  methods: {
    onSearch (val) {
      this.searchVal = {
        ...val,
        timeBegin: val.time && val.time[0],
        timeEnd: val.time && val.time[1]
      };
      delete this.searchVal.time;
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
      getAmbientMonitoringAlarmEventForPage(data).then(res => {
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
    onSelectionChange (args) {
      this.selectsList = args.map(arg => {
        return {
          serialNumber: arg.serialNumber,
          alarmNo: arg.alarmNo,
          alarmType: arg.alarmType,
          ambientCode: arg.ambientCode
        }
      });
    },
    _getAlarmCallTrendStats (parames) {
      if (!parames.timeBegin) {
        parames.dateInterval = 6
      }
      getAmbientMonitoringAlarmCount(parames).then(res => {
        if (res.code === '200') {
          this.setUserData(res.data)
        }
      })
    },
    setStaticItems (items) {
      let allCount = 0;
      items.map(item => {
        allCount = allCount + item.alarmCount;
      });
      allCount = allCount / 1.5;
      items.map((data, index) => {
        const count = (1 - (data.alarmCount / allCount)) * 100;
        this.staticItems.push({
          ...data,
          background: this.staticColorItems[index > 2 ? 3 : index],
          value: `${count}%`,
          alarmCount: data.alarmCount
        })
      });
    },
    setUserData (items) {
      let xData = [];
      let seriesData = [];
      items.map(item => {
        xData.push(item.simpleTimeAxis);
        seriesData.push(item.alarmCount);
      });
      this.usageOptions.options.xAxis[0].data = xData;
      this.usageOptions.options.series[0].data = seriesData;
    },
    _getTerminalCount () {
      getAmbientMonitoringRunStatus({}).then(res => {
        if (res.code === '200') {
          this.items = this.items.map(item => {
            return {
              ...item,
              value: res.data[item.id] || item.value || 0
            };
          });
        }
      });
      getAmbientMonitoringAlarmHandleCount({}).then(res => {
        if (res.code === '200') {
          this.items = this.items.map(item => {
            return {
              ...item,
              value: res.data[item.id] || item.value || 0
            };
          });
        }
      });
    },
    showView (action, row) {
      this.dialog.show = true;
      this.dialog.item = row;
    },
    dialogCancel () {
      this.dialog.show = false;
      this.dialog.item = null;
      this.$refs.formItem.resetForm();
      this.inputDisabled = false;
      this.isEdit = true;
      this.form = {
        handleRemark: undefined
      };
    },
    async dialogSubmit (val) {
      const formData = await this.$refs.formItem.getValue();
      const parames = {
        ...formData
      };
      if (this.dialog.item) {
        parames.alarmCommands = [{
          serialNumber: this.dialog.item.serialNumber,
          alarmNo: this.dialog.item.alarmNo,
          alarmType: this.dialog.item.alarmType,
          ambientCode: this.dialog.item.ambientCode
        }]
      } else {
        parames.alarmCommands = this.selectsList;
      }
      this._handleAmbientMonitoringAlarm(parames);
    },
    _handleAmbientMonitoringAlarm (parames) {
      handleAmbientMonitoringAlarm(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '处理成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.getDataAllList();
          this.dialogCancel();
        }
      });
    }
  }
}
</script>

<style lang="less">
#lightAlarmAnalysis{
  // #card{
  //   padding-left: 0 !important;
  //   padding-right: 0 !important;
  // }
  .cardLabers > div{
    color: #3D3D3D !important;
  }
  .content-view{
    >.el-row{
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
        min-height: 5.5rem;
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
