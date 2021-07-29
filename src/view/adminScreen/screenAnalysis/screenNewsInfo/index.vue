/* eslint-disable camelcase */
<template>
  <div id='screenNewsInfo'>
    <!-- 报警事件 -->
    <InfoItem :items="items"/>
      <el-row :gutter="10">
        <el-col :span="24">
          <div style="width: 100%">
          <echartData id="usageRate" :userOptions="usageOptions" height="300px" isTime>
            <div slot="time">
              <div v-if="searchVal.timeBegin">{{searchVal.timeBegin}}~{{searchVal.timeEnd}}</div>
              <div v-else>今日</div>
            </div>
          </echartData>
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
  name: 'screenNewsInfo',
  data () {
    return {
      searchVal: {},
      searchItems: [{
        type: 'dataPicker',
        label: '时间',
        labelWidth: '60px',
        props: {
          type: 'datetimerange',
          fieldName: 'time',
          format: 'yyyy-MM-dd HH:mm:ss'
        }
      }, {
        type: 'select',
        label: '消息类型',
        labelWidth: '60px',
        props: {
          fieldName: 'alarmLevel',
          options: []
        }
      }],
      usageOptions: {
        title: '消息发送/响应次数对比',
        labers: [],
        options: {
          color: ['#FF6A6A', '#48F7B2'],
          grid: {
            left: '10px',
            right: '10px',
            top: '10px',
            bottom: '30px',
            containLabel: true
          },
          tooltip: {
            show: true,
            trigger: 'item'
          },
          legend: {
            orient: 'horizontal',
            itemHeight: 10,
            itemWidth: 10,
            textStyle: { color: '#000', fontSize: 12 },
            bottom: '0px',
            right: 'auto',
            data: [{
              name: '下发指令次数',
              icon: 'rect'
            }, {
              name: '响应次数',
              icon: 'rect'
            }]
          },
          yAxis: [
            {
              type: 'value',
              axisTick: {
                show: false // 隐藏Y轴刻度
              },
              axisLabel: {
                color: '#7E7E7E',
                fontSize: 12
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#E0E0E0'
                }
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#0F6384'
                }
              }
            },
            {
              type: 'value',
              gridIndex: 0,
              min: 0,
              max: 100,
              splitNumber: 6,
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#28335A'
                }
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#0F6384'
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              splitArea: {
                show: false
              }
            }
          ],
          xAxis: {
            type: 'category',
            boundaryGap: true, // 坐标轴两边留白
            axisTick: {
              show: false // 隐藏Y轴刻度
            },
            axisLabel: {
              color: '#7E7E7E',
              fontSize: 12
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#E0E0E0'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#E0E0E0'
              }
            },
            data: []
          },
          series: [{
            name: '下发指令次数',
            type: 'bar',
            data: [],
            barWidth: 8,
            itemStyle: {
              normal: {
                show: true,
                color: '#FF6A6A'
              }
            }
          }, {
            name: '响应次数',
            type: 'bar',
            data: [],
            barWidth: 8,
            itemStyle: {
              normal: {
                show: true,
                color: '#48F7B2'
              }
            }
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
        { label: '订阅/发布主题', prop: 'serialNumber', minWidth: '120px' },
        { label: '操作码', prop: 'deviceName' },
        { label: '消息内容', prop: 'alarmTypeText', minWidth: '120px' },
        { label: '消息类型', prop: 'alarmLevelText' },
        { label: '发送时间', prop: 'alarmName', minWidth: '120px' }
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
        name: '下发指令次数',
        unit: '次',
        value: '',
        click: () => {}
      }, {
        id: 'monthAlarmCount',
        src: img8,
        class: 'pink',
        name: '响应次数',
        unit: '次',
        value: '',
        click: () => {}
      }, {
        id: 'unHandleCount',
        src: img9,
        class: 'green',
        name: '响应率 ',
        unit: '%',
        value: '',
        click: () => {}
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
      }
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
    setUserData (items) {
      let xData = [];
      let seriesData = [];
      items.map(item => {
        xData.push(item.simpleTimeAxis);
        seriesData.push(item.alarmCount);
      });
      this.usageOptions.options.xAxis.data = xData;
      this.usageOptions.options.series[0].data = seriesData;
      this.usageOptions.options.series[1].data = seriesData;
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
#screenNewsInfo{
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
