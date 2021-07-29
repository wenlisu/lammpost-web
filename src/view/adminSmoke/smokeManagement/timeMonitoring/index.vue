<template>
  <div id="smokeTimeMonitoring">
    <div class="accessSelect" v-if="type !== 'template'">
      <div class="info flexCloumn">
        <div class="flexRow infoInput">
          <el-select v-model="filterSelect" placeholder="请选择">
            <el-option
              v-for="item in filterList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input
              placeholder="请输入烟感的名称"
              v-model="filterText"
            >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="searchTree"></i>
          </el-input>
        </div>
        <div class="infoTree">
          <el-tree
            class="filter-tree"
            :data="options"
            node-key="id"
            :props="defaultProps"
            :default-expand-all="treeExpandAll"
            :default-expanded-keys="treeExpandKeys"
            :filter-node-method="filterNode"
            :load="loadNode"
            @node-click="nodeClick"
            highlight-current
            lazy
            ref="tree"
            :check-on-click-node="true"
            :auto-expand-parent="true"
            :current-node-key="currentNodeKey"
            v-if="sping"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span
                class="treeLabel"
                :class="[
                  `${data.type} device${data.onlineStatus}${data.alarmStatus}`
                ]"
              >
                {{ node.label }}
              </span>
            </span>
          </el-tree>
          <div class="flexRow labers">
              <labers
                  location="center"
                  type="circle"
                  :items="[{
                      color: '#33B974',
                      name: '在线',
                      width: '6px',
                      height: '6px'
                  }, {
                      color: '#FF3C30',
                      name: '报警',
                      width: '6px',
                      height: '6px'
                  }, {
                      color: '#FFB14F',
                      name: '故障',
                      width: '6px',
                      height: '6px'
                  }, {
                      color: '#8D8D8D',
                      name: '离线',
                      width: '6px',
                      height: '6px'
                  }]"
              />
          </div>
        </div>
      </div>
    </div>
    <div class="flexCloumn timeMonitoringSelect">
      <div class="flexCloumn building" v-if="monitorId === 'building'">
        <div class="buildingName">{{buildingInfo.name}}</div>
        <div class="flexRow buildingInfo">
          <div>
            <div class="icon">
              <i class="iconfont icon-zongshu" />
            </div>
            <div class="flexCloumn info">
              <span>{{buildingInfo.info.deviceCount || 0}}</span>
              <span>总数</span>
            </div>
          </div>
          <div>
            <div class="icon">
              <i class="iconfont icon-zhengchang" />
            </div>
            <div class="flexCloumn info">
              <span>{{buildingInfo.info.normalCount || 0}}</span>
              <span>正常</span>
            </div>
          </div>
          <div>
            <div class="icon">
              <i class="iconfont icon-baojing" />
            </div>
            <div class="flexCloumn info">
              <span>{{buildingInfo.info.alarmCount || 0}}</span>
              <span>报警</span>
            </div>
          </div>
          <div>
            <div class="icon">
              <i class="iconfont icon-guzhang" />
            </div>
            <div class="flexCloumn info">
              <span>{{buildingInfo.info.offlineCount || 0}}</span>
              <span>故障</span>
            </div>
          </div>
          <div>
            <div class="icon">
              <i class="iconfont icon-yujing" />
            </div>
            <div class="flexCloumn info">
              <span>{{buildingInfo.info.warningCount || 0}}</span>
              <span>预警</span>
            </div>
          </div>
        </div>
        <div class="flexCloumn buildingEx">
          <span>楼层详情图</span>
          <div class="flexCloumn buildExMain">
            <div
              v-for="item in buildingInfo.exInfo"
              :key="item.floorCode"
              :class="`n${item.floorStatus}`"
              @click="getCheckedKeys(item.floorCode)"
            >
            {{item.floorName}}
            </div>
          </div>
          <img src="./images/img4.png"/>
        </div>
        <div class="flexRow buildingLabel">
          <div class="n1">
            <span />
            正常
          </div>
          <div class="n2">
              <span />
              报警
          </div>
          <div class="n3">
              <span />
              故障
          </div>
          <div class="n4">
              <span />
              离线
          </div>
        </div>
      </div>
      <div class="flexCloumn loor" v-if="monitorId === 'floor'">
        <div class="loorName">
          {{floorInfo.name}}
          <!-- <span>紧急控制</span> -->
        </div>
        <div class="flexRow loorInfo">
          <div>
            <div class="icon">
              <i class="iconfont icon-zongshu" />
            </div>
            <div class="flexCloumn info">
              <span>{{floorInfo.info.deviceCount || 0}}</span>
              <span>总数</span>
            </div>
          </div>
          <div>
            <div class="icon">
              <i class="iconfont icon-zhengchang" />
            </div>
            <div class="flexCloumn info">
              <span>{{floorInfo.info.normalCount || 0}}</span>
              <span>正常</span>
            </div>
          </div>
          <div>
            <div class="icon">
              <i class="iconfont icon-baojing" />
            </div>
            <div class="flexCloumn info">
              <span>{{floorInfo.info.alarmCount || 0}}</span>
              <span>报警</span>
            </div>
          </div>
          <div>
            <div class="icon">
              <i class="iconfont icon-guzhang" />
            </div>
            <div class="flexCloumn info">
              <span>{{floorInfo.info.offlineCount || 0}}</span>
              <span>故障</span>
            </div>
          </div>
          <div>
            <div class="icon">
              <i class="iconfont icon-yujing" />
            </div>
            <div class="flexCloumn info">
              <span>{{floorInfo.info.warningCount || 0}}</span>
              <span>预警</span>
            </div>
          </div>
        </div>
        <div class="flexCloumn loorDeviceList">
          <span>本楼层烟雾分布状态情况</span>
          <div class="flexRow listItems">
            <div
            v-for="item in floorInfo.exInfo"
            :key="item.serialNumber"
            :class="`device${item.onlineStatus}${item.alarmStatus}`"
            @click="getCheckedKeys(item.serialNumber)"
            >
             <el-tooltip class="item" effect="light" :content="item.deviceName" placement="top-start">
                <i class="iconfont icon-dianji"/>
              </el-tooltip>
            </div>
          </div>
        </div>
        <el-tabs v-model="activetLoorTabsName" type="card" @tab-click="handleLoorTabClick">
          <el-tab-pane
            label="告警列表"
            name="1"
            lazy
          >
            <span slot="label"><i class="iconfont icon-chanpinxinxi"></i> 告警列表</span>
            <div class="content">
              <search-form
                ref="alarmListSearchForm"
                :searchItems="alarmList.searchItems"
                @onSearch="onAlarmListSearch"
              >
              </search-form>
              <page-table
                col-align="center"
                :data="alarmList.tableData"
                :cols="alarmList.tableCols"
                :page-current="alarmList.page.current"
                :total="alarmList.page.total"
                :page-size="alarmList.page.pageSize"
                @current-change="onAlarmListCurrentChange"
                @size-change="onAlarmListPageSizeChange"
                @row-current-change="onAlarmListSelectionChange"
              >
              </page-table>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="设备列表"
            name="2"
            lazy
          >
            <span slot="label"><i class="iconfont icon-fuwunengli"></i> 设备列表</span>
            <div class="content">
              <search-form
                ref="deviceListSearchForm"
                :searchItems="deviceList.searchItems"
                @onSearch="onDeviceListSearch"
              >
              <template v-slot:a>
                <el-select
                  v-model="deviceList.deviceValue"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="remoteMethod"
                  :loading="deviceList.loading">
                  <el-option
                    v-for="item in deviceList.deviceOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
              </search-form>
              <page-table
                col-align="center"
                :data="deviceList.tableData"
                :cols="deviceList.tableCols"
                :page-current="deviceList.page.current"
                :total="deviceList.page.total"
                :page-size="deviceList.page.pageSize"
                @current-change="onDeviceListCurrentChange"
                @size-change="onDeviceListPageSizeChange"
                @row-current-change="onDeviceListSelectionChange"
              >
              </page-table>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="历史维修记录"
            name="3"
            lazy
          >
            <span slot="label"><i class="iconfont icon-weihunengli"></i> 历史维修记录</span>
            <div class="content">
              <search-form
                ref="historyListSearchForm"
                :searchItems="historyList.searchItems"
                @onSearch="onHistoryListSearch"
              >
              <template v-slot:a>
                <el-select
                  v-model="historyList.deviceValue"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="remoteMethod"
                  :loading="historyList.loading">
                  <el-option
                    v-for="item in historyList.deviceOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
              </search-form>
              <page-table
                col-align="center"
                :data="historyList.tableData"
                :cols="historyList.tableCols"
                :page-current="historyList.page.current"
                :total="historyList.page.total"
                :page-size="historyList.page.pageSize"
                @current-change="onHistoryListCurrentChange"
                @size-change="onHistoryListPageSizeChange"
                @row-current-change="onHistoryListSelectionChange"
              >
              </page-table>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="操作日志"
            name="4"
            lazy
          >
            <span slot="label"><i class="iconfont icon-chanpinxinxi"></i> 操作日志</span>
            <div class="content">
              <search-form
                ref="logListSearchForm"
                :searchItems="logList.searchItems"
                @onSearch="onLogListSearch"
              >
              <template v-slot:a>
                <el-select
                  v-model="logList.deviceValue"
                  multiple
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="remoteMethod"
                  :loading="logList.loading">
                  <el-option
                    v-for="item in logList.deviceOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
              </search-form>
              <page-table
                col-align="center"
                :data="logList.tableData"
                :cols="logList.tableCols"
                :page-current="logList.page.current"
                :total="logList.page.total"
                :page-size="logList.page.pageSize"
                @current-change="onLogListCurrentChange"
                @size-change="onLogListPageSizeChange"
                @row-current-change="onLogListSelectionChange"
              >
              </page-table>
            </div>
          </el-tab-pane>
         </el-tabs>
      </div>
      <div class="flexCloumn alarm" v-if="monitorId === 'alarm'">
        <div class="flexRow alarmHeader">
          <div class="flexRow flexCenter">
            <span class="alarmTitle">{{alarmInfo.info.deviceName}}</span>
            <span class="alarmStatus">{{alarmInfo.info.alarmStatusText}}</span>
          </div>
          <div class="btnList">
            <el-button type="primary" @click="contactCheck(item)">
            联系安全员现场核查</el-button>
            <el-button type="primary" @click="clearError(item)">
            消除告警</el-button>
          </div>
        </div>
        <card title="基本信息" :className="'adminCard adminCard1'">
          <div class="flexRow content">
               <!-- <videoAddress /> -->
              <videoAddress :srcUrl="alarmInfo.info.videoUrl" :serialNumber='alarmInfo.info.serialNumber' />
              <FormItemText
                :layout="alarmInfo.baseInfoItems"
                labelWidth="0px"
              >
              </FormItemText>
          </div>
        </card>
        <card title="告警信息" :className="'adminCard adminCard2'">
          <FormItemText
            :layout="alarmInfo.alarmInfoItems"
            labelWidth="0px"
          >
          </FormItemText>
        </card>
         <card title="应急处理预案" :className="'adminCard adminCard3'" v-if="alarmInfo.info.alarmProStatus === 0">
           火警情况：
           <el-radio-group
            v-model="alarmInfo.fireControlType"
            @change="fireControlChange"
           >
              <el-radio :label="1">误报警情</el-radio>
              <el-radio :label="2">确认火警</el-radio>
            </el-radio-group>
           <el-checkbox-group v-model="alarmInfo.planCodes" style="marginTop: 6px">
              <el-checkbox
                v-for="item in alarmInfo.fireControlType === 1 ? alarmInfo.falseAlarmList : alarmInfo.disposeList"
                :key="item.code"
                :label="item.code"
              >
              {{item.plan}}
              </el-checkbox>
           </el-checkbox-group>
           <div><span style="color: #F56C6C;marginRight: 4px">*</span>一、现场确认情况</div>
           <el-input
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="alarmInfo.confirmSituation"
              style="margin: 5px 0 10px"
              maxlength="200"
              show-word-limit
            >
            </el-input>
          <div>二、误报警情或火灾原因</div>
           <el-input
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="alarmInfo.reasonSituation"
              style="margin: 5px 0 10px"
              maxlength="200"
              show-word-limit
            >
            </el-input>
          <div>三、现场救援情况</div>
           <el-input
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="alarmInfo.rescueSituation"
              style="margin: 5px 0 10px"
              maxlength="200"
              show-word-limit
            >
            </el-input>
           <el-button type="primary" @click="disposeProgress()">
            提交</el-button>
        </card>
        <card title="消防相关负责人" :className="'adminCard adminCard4'">
          <ul class="flexCloumn">
            <li
            v-for="item in alarmInfo.fireControl"
            :key="item.code"
            class="flexRow"
            >
              <div class="position">{{item.position}}</div>
              <div class="flexRow controlInfo">
                <div
                  class="flexCloumn"
                  v-for="sunItem in item.securityDtoList"
                  :key="sunItem.userName"
                >
                  <div>{{sunItem.realName}}</div>
                  <div>{{sunItem.tel}}</div>
                </div>
              </div>
            </li>
          </ul>
        </card>
      </div>
      <div class="flexCloumn normal" v-if="monitorId === 'normal'">
        <div class="flexCloumn headerCard">
          <div class="flexRow normalHeader">
            <div class="flexRow flexCenter">
              <span class="normalTitle">{{normalInfo.name}}</span>
              <span class="normalStatus" :class="`normalStatus${normalInfo.statusType}`">{{normalInfo.statusText}}</span>
            </div>
            <el-button type="primary" size="small" class="setValue" @click="setThreshold(normalInfo.name)">设置阈值</el-button>
          </div>
          <FormItemText
            :layout="normalInfo.baseInfoItems"
            labelWidth="0px"
          >
          </FormItemText>
          <el-row :gutter="10" class="flexRow list1">
            <el-col
              v-for="item in normalInfo.listItems"
              :key="item.id"
              :span="8"
            >
              <div class="flexRow content">
                <div class="icon">
                  <i :class="`iconfont ${item.icon}`"/>
                </div>
                <div class="flexCloumn baseInfo">
                  <div class="name">{{item.name}}</div>
                  <div class="value">{{item.value}}{{item.unit}}</div>
                </div>
                <div class="maxInfo" v-if="item.id !== 'd'">
                  <div class="fa">阀值  <span v-if="item.thresholdValue">{{item.thresholdValue}}{{item.unit}}</span></div>
                  <div class="maxValue">当日最大值  <span v-if="item.maxValue">{{item.maxValue}}{{item.unit}}</span></div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <el-row :gutter="10" class="list2">
          <el-col :span="12">
            <div class="content">
              <div class="title">24小时烟雾趋势分析</div>
              <div id="chart1" class="chart"/>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="content">
              <div class="title">24小时温度趋势分析</div>
              <div id="chart2" class="chart"/>
            </div>
          </el-col>
          <!-- <el-col :span="12">
            <div class="content">
              <div class="title">24小时湿度趋势分析</div>
              <div id="chart3" class="chart"/>
            </div>
          </el-col> -->
          <el-col :span="24">
            <div class="content">
              <div class="title">24小时告警数趋势分析</div>
              <div id="chart4" class="chart"/>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="flexCloumn malfunction" v-if="monitorId === 'malfunction'">
        <div class="flexCloumn headerCard">
          <div class="flexRow malfunctionHeader">
            <div class="flexRow flexCenter">
              <span class="malfunctionTitle">{{malfunctionInfo.info.deviceName}}</span>
              <span class="malfunctionStatus">{{malfunctionInfo.info.onlineStatusText}}</span>
            </div>
          </div>
          <FormItemText
            :layout="malfunctionInfo.baseInfoItems"
            labelWidth="0px"
          >
          </FormItemText>
        </div>
        <card title="告警数趋势分析" :className="'adminCard adminCard1'">
          <div class="content">
            <ul class="flexRow typeSelect">
              <li
                :class="{
                  'is-active': malfunctionInfo.chartActive === 0
                }"
                @click="handleAlarmStats(0)"
              >
                24小时
              </li>
              <li
                :class="{
                  'is-active': malfunctionInfo.chartActive === 1
                }"
                @click="handleAlarmStats(1)"
              >
              近7天
              </li>
              <li
                :class="{
                  'is-active': malfunctionInfo.chartActive === 2
                }"
                @click="handleAlarmStats(2)"
              >
              近30天
              </li>
            </ul>
            <div id="chart5" class="chart"/>
          </div>
        </card>
        <card title="故障处理进展" :className="'adminCard adminCard2'">
          <div class="flexCloumn content">
            <div
              class="infoMain"
              v-for="(item, index) in malfunctionInfo.stepList"
              :key="item"
            >
              <span class="index">{{index + 1}}</span>
              <div class="title">{{item.dealNodeText}}</div>
              <div class="name">{{item.dealer}}</div>
              <div class="time">{{item.dealTime}}</div>
              <div class="info">{{item.dealReason}}</div>
            </div>
          </div>
        </card>
      </div>
    </div>
    <dialog-cont
      @on-cancel="dialogAddCancel"
      @on-confirm="dialogAddSubmit"
      :visible.sync="addDialog.show"
      width="550px"
      :title="addDialog.title"
      append-to-body
    >
      <FormItem
        ref="formItem"
        :formItems="formItems"
        :rules="formRules"
        :disabled="inputDisabled"
        :isEdit="isEdit"
        :form="form"
        :midway="midway"
        :labelWidth="'105px'"
      />
    </dialog-cont>
  </div>
</template>
<script>
import {
  mapGetters
} from 'vuex';
import moment from 'moment';
import * as echarts from 'echarts'; // 引入echarts
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect';
import Flex from '@/components/flex';
import labers from '@/components/labers';
import searchForm from 'components/adminSearchForm/searchForm';
import FormItemText from '@/components/formItemText/formItemText';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import PageTable from '@/components/adminPage-table';
import PoleMap from '@/view/index/lightPoleMap/poleMap';
import echartData from '@/view/lightPole/lightPoleStatistical/components/echartData';
import videoAddress from '@/view/smokeDetector/smokeDetectorMap/components/videoAddress';
import dialogCont from '@/components/adminDialog';
import FormItem from '@/components/adminFormItem';
import { routePush } from '@/util/util';
import {
  getGroupPolicy,
  getLamp,
  getParkDeviceTree
} from 'api/index';
import {
  getDeviceModuleTree,
  getDetailByID,
  setThresholdValue
} from 'api/admin';
import {
  getSmokeDetectorAlarmByCondition,
  getSmokeDetectorDeviceForPage,
  getSmokeDetectorRunStatus,
  getSmokeDetectorTrend,
  getSmokeDetectorConfirmStatistics,
  getSmokeDetectorRealTimeAlarm,
  getSmokeDetectorAlarmForPage,
  getSmokeDetectorAlarmLevel,
  getSmokeDetectorAlarmStatus,
  getSmokeDetectorAlarmAndFaultStats,
  getFireAccessStats,
  getSmokeDetectorAlarmType,
  clearSmokeDetectorAlarm,
  getSmokeDetectorArrange,
  getSmokeDetectorOnLineStatus,
  getSmokeDetectorSiteTree,
  getSmokeDetectorCurrentStatus,
  getSmokeDetectorWorkOrderForPage,
  getSmokeDetectorClearAlarmLogForPage,
  getSmokeDetectorDeviceDtl,
  getSmokeDetectorTodayAlarmStats,
  getSmokeDetectorTodayStats,
  getSmokeDetectorFinalAlarm,
  getFireControlSecurity,
  getSmokeDetectorAlarmStats,
  getSmokeDetectorWorkOrder,
  getSmokeDetectorInBuilding,
  getSmokeDetectorDevice,
  saveFireControlPlanRecord,
  getFireControlPlan,
  getFireControlPlanRecord
} from 'api/smokeDetectorMap';
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
  name: 'smokeTimeMonitoring',
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
    videoAddress,
    dialogCont,
    FormItem
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    currentData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      locationInfo: {
        parkCode: '',
        areaCode: '',
        buildingCode: '',
        floorCode: ''
      },
      midway: true,
      isEdit: true,
      inputDisabled: false,
      form: {
        smokeConcentrationLowThreshold: undefined,
        temperatureLowThreshold: undefined
      },
      formItems: [{
        label: '烟雾浓度预警值',
        prop: 'smokeConcentrationLowThreshold',
        inputType: 'input',
        required: false,
        span: 24
      }, {
        label: '温度预警阈值',
        prop: 'temperatureLowThreshold',
        inputType: 'input',
        required: false,
        span: 24
      }],
      formRules: {},
      addDialog: {
        show: false,
        item: null,
        title: '全部烟雾探测器阈值设置'
      },
      isDetail: false,
      treeExpandAll: false,
      treeExpandKeys: [],
      sping: false,
      filterText: '',
      filterSelect: '',
      filterList: [],
      options: [{
        id: 1,
        label: '一级 1',
        children: null
      }],
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      activetLoorTabsName: '1',
      monitorId: undefined,
      buildingInfo: {
        name: 'A区A1栋大厦烟雾设备状态',
        info: {
          deviceCount: 0,
          normalCount: 0,
          alarmCount: 0,
          offlineCount: 0,
          warningCount: 0
        },
        exInfo: []
      },
      floorInfo: {
        name: 'A区A1栋大厦烟感设备状态',
        info: {
          deviceCount: 0,
          normalCount: 0,
          alarmCount: 0,
          offlineCount: 0,
          warningCount: 0
        },
        exInfo: []
      },
      alarmList: {
        show: false,
        searchVal: {},
        searchItems: [{
          type: 'dataPicker',
          label: '时间',
          labelWidth: '40px',
          props: {
            fieldName: 'time'
          }
        }, {
          type: 'select',
          label: '告警级别',
          labelWidth: '60px',
          props: {
            fieldName: 'alarmLevel',
            options: []
          }
        }],
        tableData: [],
        tableCols: [
          { label: '告警级别',
            prop: 'alarmLevelText'
          },
          { label: '告警类型',
            prop: 'alarmName'
          },
          { label: '告警设备',
            prop: 'deviceName'
          },
          { label: '告警时间',
            prop: 'alarmTime',
            minWidth: '110px'
          },
          { label: '告警状态',
            prop: 'alarmStatusText'
          }
        ],
        page: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      },
      deviceList: {
        show: false,
        searchVal: {},
        searchItems: [{
          type: 'dataPicker',
          label: '时间',
          labelWidth: '40px',
          props: {
            fieldName: 'time'
          }
        }, {
          type: 'custom',
          label: '设备名称',
          labelWidth: '60px',
          props: {
            fieldName: 'deviceName'
          }
        }, {
          type: 'input',
          label: '安装地址',
          labelWidth: '60px',
          props: {
            fieldName: 'installAddress'
          }
        }, {
          type: 'select',
          label: '在线状态',
          labelWidth: '60px',
          props: {
            fieldName: 'onlineStatus',
            options: []
          }
        }, {
          type: 'select',
          label: '告警状态',
          labelWidth: '60px',
          props: {
            fieldName: 'alarmStatus',
            options: []
          }
        }],
        tableData: [],
        tableCols: [
          { label: '设备名称',
            prop: 'deviceName'
          },
          { label: '设施类型',
            prop: 'deviceTypeName'
          },
          { label: 'IMEI',
            prop: 'serialNumber'
          },
          { label: '安装地址',
            prop: 'installAddress',
            minWidth: '110px'
          },
          // { label: '经度',
          //   prop: 'longitude'
          // },
          // { label: '纬度',
          //   prop: 'latitude'
          // },
          { label: '在线状态',
            prop: 'onlineStatusText'
          },
          { label: '最后上报时间',
            minWidth: '120px',
            prop: 'lastReportTime'
          },
          { label: '当前烟雾浓度',
            minWidth: '120px',
            prop: 'smokeConcentration'
          },
          { label: '烟雾浓度阀值',
            minWidth: '120px',
            prop: 'smokeConcentrationLowThreshold'
          },
          { label: '当前温度(℃)',
            minWidth: '90px',
            prop: 'temperature'
          },
          { label: '温度阀值(℃)',
            minWidth: '90px',
            prop: 'temperatureLowThreshold'
          },
          // { label: '当前湿度(%)',
          //   minWidth: '90px',
          //   prop: 'onlineStatusText'
          // },
          // { label: '湿度阀值(%)',
          //   minWidth: '90px',
          //   prop: 'onlineStatusText'
          // },
          { label: '报警状态',
            minWidth: '120px',
            prop: 'alarmStatusText'
          }
        ],
        deviceValue: undefined,
        deviceOptions: [],
        loading: false,
        page: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      },
      historyList: {
        show: false,
        searchVal: {},
        searchItems: [{
          type: 'dataPicker',
          label: '告警时间',
          labelWidth: '40px',
          props: {
            fieldName: 'time'
          }
        }, {
          type: 'input',
          label: '设备名称',
          labelWidth: '60px',
          props: {
            fieldName: 'deviceName'
          }
        }, {
          type: 'input',
          label: '维修人员',
          labelWidth: '60px',
          props: {
            fieldName: 'dealer'
          }
        }, {
          type: 'select',
          label: '故障持续时间',
          labelWidth: '60px',
          hide: true,
          props: {
            fieldName: 'alarmLevel',
            options: []
          }
        }, {
          type: 'select',
          label: '状态',
          labelWidth: '60px',
          props: {
            fieldName: 'dealNode',
            options: []
          }
        }],
        tableData: [],
        tableCols: [
          { label: '设备名称',
            prop: 'deviceName'
          },
          { label: '告警类型',
            prop: 'alarmName'
          },
          { label: '告警时间',
            prop: 'alarmTime',
            minWidth: '110px'
          },
          { label: '维修人员',
            prop: 'dealer'
          },
          { label: '维修完成时间',
            prop: 'completeTime',
            minWidth: '110px'
          },
          // { label: '故障持续时长',
          //   prop: 'alarmStatusText',
          // },
          { label: '维修情况',
            prop: 'dealNote',
            minWidth: '110px'
          },
          { label: '故障原因定界',
            prop: 'dealReason'
          },
          { label: '状态',
            prop: 'alarmStatusText'
          }
        ],
        deviceValue: undefined,
        deviceOptions: [],
        loading: false,
        page: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      },
      logList: {
        show: false,
        searchVal: {},
        searchItems: [{
          type: 'dataPicker',
          label: '消除时间',
          labelWidth: '40px',
          props: {
            fieldName: 'time'
          }
        }, {
          type: 'custom',
          label: '设备名称',
          labelWidth: '60px',
          props: {
            fieldName: 'deviceName'
          }
        }, {
          type: 'input',
          label: '告警编号',
          labelWidth: '60px',
          props: {
            fieldName: 'alarmNo'
          }
        }],
        tableData: [],
        tableCols: [
          { label: '设备名称',
            prop: 'deviceName'
          },
          { label: '告警类型',
            prop: 'alarmName'
          },
          { label: '告警编号',
            prop: 'alarmNo'
          },
          { label: '告警时间',
            prop: 'alarmTime',
            minWidth: '110px'
          },
          { label: '消除时间',
            prop: 'clearTime',
            minWidth: '110px'
          },
          { label: '操作人员',
            prop: 'clearUserName'
          },
          { label: '状态',
            prop: 'a',
            render: () => {
              return <div>已消除</div>
            }
          }
        ],
        deviceValue: undefined,
        deviceOptions: [],
        loading: false,
        page: {
          current: 1,
          pageSize: 10,
          total: 0
        }
      },
      alarmInfo: {
        info: {},
        baseInfoItems: [{
          id: 'serialNumber',
          label: 'IMEI',
          value: '',
          unit: '',
          span: 12
        }, {
          id: 'installAddress',
          label: '报警位置',
          value: '',
          unit: '',
          span: 12
        }, {
          id: 'access',
          label: '通道位置',
          value: '',
          unit: '',
          span: 24
        }, {
          id: 'smokeConcentration',
          label: '烟雾浓度',
          value: '',
          unit: '',
          span: 12
        }, {
          id: 'temperature',
          label: '温度',
          value: '',
          unit: 'ºC',
          span: 12
        }, {
          id: 'nbElectricityQuantity',
          label: 'NB板电量',
          value: '',
          unit: '',
          class: 'noBottom',
          span: 12
        }, {
          id: 'lastReportTime',
          label: '最后上报时间',
          value: '',
          unit: '',
          class: 'noBottom',
          span: 12
        }],
        alarmInfoItems: [{
          id: 'alarmNo',
          label: '告警编号',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'alarmTime',
          label: '告警时间',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'alarmStatusText',
          label: '告警类型',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'securityUser',
          label: '消防安全负责人',
          value: '',
          unit: '',
          class: 'noBottom',
          span: 8
        }, {
          id: 'securityUserTel',
          label: '消防联系电话',
          value: '',
          unit: '',
          class: 'noBottom',
          span: 8
        }],
        planCodes: [],
        fireControlType: 1,
        confirmSituation: undefined,
        reasonSituation: undefined,
        rescueSituation: undefined,
        falseAlarmList: [],
        disposeList: [],
        fireControl: []
      },
      normalInfo: {
        name: '烟感设备1',
        statusText: '在线',
        statusType: 1,
        info: {},
        baseInfoItems: [{
          id: 'serialNumber',
          label: 'IMEI',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'installAddress',
          label: '安装位置',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'lastReportTime',
          label: '最后上报时间',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'nbModelVersion',
          label: 'NB模块版本号',
          value: '',
          unit: '',
          span: 6
        }, {
          id: 'iccId',
          label: 'NB卡ICCID',
          value: '',
          unit: '',
          span: 6
        }, {
          id: 'version',
          label: '烟感版本号',
          value: '',
          unit: '',
          span: 6
        }, {
          id: 'nbMcu',
          label: 'NB-MCU版本号',
          value: '',
          unit: '',
          span: 6
        }, {
          id: 'signal',
          label: '信号强度',
          value: '',
          unit: '',
          span: 6
        }, {
          id: 'signalRSRP',
          label: 'RSRP',
          value: '',
          unit: '',
          span: 6
        }, {
          id: 'signalRSRQ',
          label: 'RSRQ',
          value: '',
          unit: '',
          span: 6
        }, {
          id: 'signalSNR',
          label: 'SNR',
          value: '',
          unit: '',
          span: 6
        }, {
          id: 'longitude',
          label: '经度',
          value: '',
          unit: '',
          span: 6
        }, {
          id: 'latitude',
          label: '纬度',
          value: '',
          unit: '',
          span: 6
        }, {
          id: 'nbElectricityQuantity',
          label: 'NB板电量',
          value: '',
          unit: '',
          span: 6
        }],
        listItems: [{
          id: 'a',
          name: '烟雾',
          value: '10.7',
          thresholdValue: '20',
          icon: 'icon-yanwu',
          maxValue: '17.7'
        }, {
          id: 'b',
          name: '温度',
          value: '25',
          thresholdValue: '30',
          maxValue: '25',
          icon: 'icon-wendu',
          unit: '℃'
        }, {
          id: 'd',
          name: '报警状态',
          value: '正常',
          thresholdValue: '',
          icon: 'icon-baojing1',
          maxValue: ''
        }]
      },
      malfunctionInfo: {
        info: {},
        baseInfoItems: [{
          id: 'serialNumber',
          label: 'IMEI',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'installAddress',
          label: '安装位置',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'alarmNo',
          label: '告警编号',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'alarmName',
          label: '故障类型',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'alarmTime',
          label: '故障时间',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'securityUser',
          label: '维护负责人',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'securityUserTel',
          label: '联系电话',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'alarmStatusText',
          label: '告警状态',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'faultTimeLen',
          label: '故障持续时长',
          value: '',
          unit: '',
          span: 8
        }],
        chartActive: 0,
        stepActive: 0,
        stepList: []
      },
      currentNodeKey: undefined
    };
  },
  watch: {
    // filterSelect (val) {
    //   this.$refs.tree.filter({val, type: 'statusText'});
    // },
    // filterText (val) {
    //   this.$refs.tree.filter({val, type: 'label'});
    // },
    '$route.query': {
      deep: true,
      handler (newValue) {
        if (!newValue.activeNumber) {
          this.clearnData();
        } else {
          this.initData();
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.filterList = [{
        id: '',
        name: '全部状态'
      }];
      this.treeExpandAll = false;
      this.sping = false;
      this.initData();
      getSmokeDetectorAlarmStatus().then(res => {
        if (res.code === '200') {
          const disposeTypes = res.data.map(data => {
            return {
              id: data.value,
              name: data.key
            }
          });
          this.$set(this.historyList.searchItems[4].props, 'options', disposeTypes);
        }
      });
      getSmokeDetectorAlarmType().then(res => {
        if (res.code === '200') {
          const alrmTypes = res.data.map(data => {
            this.filterList.push({
              id: data.key,
              name: data.key
            });
            return {
              id: data.value,
              name: data.key
            }
          });
          this.$set(this.deviceList.searchItems[4].props, 'options', alrmTypes);
          // this.$set(this.logList.searchItems[4].props, 'options', alrmTypes);
        }
      });
      getSmokeDetectorOnLineStatus().then(res => {
        if (res.code === '200') {
          const statusTypes = res.data.map(data => {
            this.filterList.push({
              id: data.key,
              name: data.key
            });
            return {
              id: data.value,
              name: data.key
            }
          });
          this.$set(this.deviceList.searchItems[3].props, 'options', statusTypes);
          // this.$set(this.logList.searchItems[3].props, 'options', statusTypes);
        }
      });
      getSmokeDetectorAlarmLevel().then(res => {
        if (res.code === '200') {
          const levelTypes = res.data.map(data => {
            return {
              id: data.value,
              name: data.key
            }
          });
          this.$set(this.alarmList.searchItems[1].props, 'options', levelTypes);
        }
      });
      let falseAlarmList = [];
      let disposeList = [];
      getFireControlPlan({planType: null}).then(async res => {
        if (res.code === '200') {
          await res.data.map(data => {
            if (data.planType === '1') {
              falseAlarmList.push(data)
            } else {
              disposeList.push(data)
            }
          });
          this.alarmInfo.falseAlarmList = falseAlarmList;
          this.alarmInfo.disposeList = disposeList;
        }
      });
    });
  },
  computed: {
    ...mapGetters(['common', 'openPage']),
    routeName () {
      return this.$route.name
    }
  },
  methods: {
    dialogAddCancel () {
      this.addDialog.show = false;
      this.$refs.formItem.resetForm();
      this.inputDisabled = false;
      this.isEdit = true;
      this.addDialog.item = null;
    },
    async dialogAddSubmit () {
      const formData = await this.$refs.formItem.getValue();
      const parames = {
        smokeConcentrationLowThreshold: +formData.smokeConcentrationLowThreshold,
        temperatureLowThreshold: +formData.temperatureLowThreshold,
        parkCode: this.normalInfo.info.parkCode,
        floorCode: this.normalInfo.info.floorCode,
        buildingCode: this.normalInfo.info.buildingCode,
        areaCode: this.normalInfo.info.areaCode,
        serialNumberList: [this.normalInfo.info.serialNumber],
        smokeConcentrationMaxThreshold: +formData.smokeConcentrationLowThreshold,
        temperatureMaxThreshold: +formData.temperatureLowThreshold
      };
      const updateNum = {serialNumber: parames.serialNumberList[0]}
      setThresholdValue(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.dialogAddCancel();
          this._getSmokeDetectorDeviceDtl(updateNum, 'normal');
        }
      })
    },
    // 阈值设置
    setThreshold (title) {
      this.addDialog.show = true;
      this.addDialog.title = title + '阈值设置'
    },
    searchTree () {
      if (this.$refs.tree) {
        this.$refs.tree.filter({val: this.filterText, type: 'label'});
      }
    },
    clearnData () {
      this.sping = true;
      this.treeExpandAll = false;
      this.filterText = '';
      this.monitorId = '';
      this.currentNodeKey = '';
      setTimeout(() => {
        this.searchTree();
        this.$refs.tree.setCheckedKeys([]);
      }, 500);
    },
    filterNode (value, data) {
      if (!value.val) return true;
      return data[value.type] && data[value.type].indexOf(value.val) !== -1;
    },
    initData () {
      const query = this.$route.query;
      if (query.activeNumber || this.type === 'template') {
        let parames = this.currentData;
        if (query.activeNumber) {
          parames = this.common['smokeTimeMonitoring'];
        }
        this.treeExpandAll = true;
        this.sping = true;
        this.nodeClick({
          ...parames,
          type: 'device',
          id: parames.serialNumber
        });
        this.filterText = parames.deviceName;
        setTimeout(() => {
          // this.searchTree();
          this.$refs.tree.setCheckedKeys([query.activeNumber]);
        }, 500);
      } else {
        this.sping = true;
      }
    },
    initTemplate () {
      if (this.type === 'template') {
        this.clearnInfo();
        this.monitorId = 'device';
      }
    },
    async loadNode (node, resolve) {
      const activeNumber = this.$route.query.activeNumber;
      if (node.level === 0) {
        const treeData = await this._getParkDeviceTree({
          parentNodeCode: '0',
          deviceTypeNo: 'SMOKE_DETECTOR'
        }, {data: {optionsData: []}}, {parentData: []}, resolve);
        setTimeout(() => {
          if (treeData[0]) {
            this.treeExpandKeys = [treeData[0].id];
            this.$refs.tree.setCheckedKeys([treeData[0].id]);
          }
        }, 500);
      }
      if (node.level > 0 && !node.data.children) {
        const nodeData = node.data;
        const treeData = await this._getParkDeviceTree({
          parentNodeCode: nodeData.nodeCode,
          deviceTypeNo: 'SMOKE_DETECTOR'
        }, node, node.parent.data, resolve);
        setTimeout(() => {
          if (treeData[0]) {
            this.treeExpandKeys = [...this.treeExpandKeys, treeData[0].id];
            this.$refs.tree.setCheckedKeys([treeData[0].id]);
          }
        }, 500);
      } else if (node.data.children && node.data.children[0]) {
        setTimeout(() => {
          this.treeExpandKeys = [...this.treeExpandKeys, node.data.children[0].id];
          this.$refs.tree.setCheckedKeys([node.data.children[0].id]);
        }, 500);
        resolve(node.data.children);
      }
    },
    nodeClick (data) {
      this.monitorId = data.type;
      this.currentNodeKey = data.id;
      if (data.id && data.type === 'building') {
        this.buildingInfo.name = `${data.label}烟感设备状态`;
        getSmokeDetectorCurrentStatus({
          parkCode: data.parkCode,
          areaCode: data.areaCode,
          treeNodeCode: data.id
        }).then(res => {
          if (res.code === '200') {
            this.buildingInfo.info = res.data;
          }
        });
        this.locationInfo.parkCode = data.parkCode;
        this.locationInfo.areaCode = data.areaCode;
        this.locationInfo.buildingCode = data.id;
        getSmokeDetectorInBuilding({
          parkCode: data.parkCode,
          areaCode: data.areaCode,
          treeNodeCode: data.id,
          treeLevel: 3
        }).then(res => {
          if (res.code === '200') {
            this.buildingInfo.exInfo = res.data.reverse();
          }
        });
      }
      if (data.id && data.type === 'floor') {
        this.floorInfo.name = `${data.label}各烟感设备状态`;
        this.locationInfo.parkCode = data.parkCode;
        this.locationInfo.areaCode = data.areaCode;
        this.locationInfo.buildingCode = data.buildingCode;
        this.locationInfo.floorCode = data.id;
        this.floorCode = data.id;
        getSmokeDetectorCurrentStatus({
          parkCode: data.parkCode,
          areaCode: data.areaCode,
          buildingCode: data.buildingCode,
          treeNodeCode: data.id
        }).then(res => {
          if (res.code === '200') {
            this.floorInfo.info = res.data;
            this.onAlarmListSearch({
              treeNodeCode: data.id,
              buildingCode: data.buildingCode,
              parkCode: data.parkCode,
              areaCode: data.areaCodef
            });
          }
        });
        getSmokeDetectorDevice({
          parkCode: data.parkCode,
          areaCode: data.areaCode,
          buildingCode: data.buildingCode,
          treeNodeCode: data.id,
          treeLevel: 4
        }).then(res => {
          if (res.code === '200') {
            this.floorInfo.exInfo = res.data.reverse();
          }
        });
      }
      if (data.id && data.type === 'device') {
        this._getTypeDel(data);
      }
    },
    _getTypeDel (data) {
      let type = 'normal';
      if (data.onlineStatus === 1 && data.alarmStatus > 0) {
        type = 'alarm'
      }
      if (data.onlineStatus === 2) {
        type = 'malfunction'
      }
      this._getSmokeDetectorDeviceDtl(data, type);
    },
    _getSmokeDetectorDeviceDtl (item, type) {
      const { types, labels } = this.$_useTypes(statusPandType);
      this.monitorId = type;
      if (this.monitorId === 'normal' || this.monitorId === 'malfunction') {
        getSmokeDetectorDeviceDtl(item.serialNumber).then(async res => {
          if (res.code === '200') {
            const data = res.data;
            if (this.monitorId === 'normal') {
              this.normalInfo.info = data;
              this.normalInfo.name = data.deviceName;
              this.normalInfo.statusText = data.onlineStatusText;
              this.normalInfo.statusType = {
                在线: 1,
                离线: 0
              }[data.onlineStatus];
              this.normalInfo.listItems = [{
                ...this.normalInfo.listItems[0],
                id: 'a',
                name: '烟雾',
                value: data.smokeConcentration,
                thresholdValue: data.smokeConcentrationLowThreshold,
                maxValue: data.smokeConcentrationMax
              }, {
                ...this.normalInfo.listItems[1],
                id: 'b',
                name: '温度',
                value: data.temperature,
                thresholdValue: data.temperatureLowThreshold,
                maxValue: data.temperatureMax,
                unit: '℃'
              }, {
                ...this.normalInfo.listItems[2],
                id: 'd',
                name: '报警状态',
                value: data.alarmStatusText,
                thresholdValue: '',
                maxValue: ''
              }];
              const baseInfoItems = await this.$_setItem(this.normalInfo.baseInfoItems, data);
              this.normalInfo.baseInfoItems = baseInfoItems;
              getSmokeDetectorTodayAlarmStats(item.serialNumber).then(chartRes => {
                if (chartRes.code === '200') {
                  const alarmAnalyze = {
                    date: [],
                    count1: []
                  }
                  chartRes.data.map(dchartData => {
                    alarmAnalyze.date.push(dchartData.simpleTimeAxis);
                    alarmAnalyze.count1.push(dchartData.alarmCount);
                  });
                  this.init4(alarmAnalyze)
                }
              });
              getSmokeDetectorTodayStats(item.serialNumber).then(chartRes => {
                if (chartRes.code === '200') {
                  const threeAnalyze = {
                    date: [],
                    smokeConcentration: [],
                    smokeConcentrationThreshold: [],
                    temperature: [],
                    temperatureThreshold: [],
                    humidity: [],
                    humidityThreshold: []
                  }
                  chartRes.data.map(dchartData => {
                    threeAnalyze.date.push(dchartData.simpleTimeAxis);
                    threeAnalyze.smokeConcentration.push(dchartData.smokeConcentration);
                    threeAnalyze.smokeConcentrationThreshold.push(data.smokeConcentrationLowThreshold);
                    threeAnalyze.temperature.push(dchartData.temperature);
                    threeAnalyze.temperatureThreshold.push(data.temperatureLowThreshold);
                    threeAnalyze.humidity.push(dchartData.humidity);
                    threeAnalyze.humidityThreshold.push(data.humidityThreshold);
                  });
                  this.init1({
                    date: threeAnalyze.date,
                    count1: threeAnalyze.smokeConcentration,
                    count2: threeAnalyze.smokeConcentrationThreshold
                  });
                  this.init2({
                    date: threeAnalyze.date,
                    count1: threeAnalyze.temperature,
                    count2: threeAnalyze.temperatureThreshold
                  });
                  // this.init3({
                  //   date: threeAnalyze.date,
                  //   count1: threeAnalyze.humidity,
                  //   count2: threeAnalyze.humidityThreshold
                  // });
                }
              });
            }
            if (this.monitorId === 'malfunction') {
              this.malfunctionInfo.info = data;
              const baseInfoItems = await this.$_setItem(this.malfunctionInfo.baseInfoItems, data);
              this.malfunctionInfo.baseInfoItems = baseInfoItems;
              this._getSmokeDetectorAlarmStats({
                timeInterval: ''
              }, item.serialNumber);
              this._getSmokeDetectorWorkOrder({
                alarmNo: data.alarmNo,
                serialNumber: data.serialNumber
              });
            }
          }
        });
      }
      if (this.monitorId === 'alarm') {
        getSmokeDetectorFinalAlarm(item.serialNumber, item.alarmNo).then(async res => {
          if (res.code === '200') {
            const data = res.data;
            this.alarmInfo.info = {
              ...data
            };
            const baseInfoItems = await this.$_setItem(this.alarmInfo.baseInfoItems, data);
            const alarmInfoItems = await this.$_setItem(this.alarmInfo.alarmInfoItems, data);
            this.alarmInfo.baseInfoItems = baseInfoItems;
            this.alarmInfo.alarmInfoItems = alarmInfoItems;
            if (data.alarmProStatus === 0) {
              this.alarmInfo.fireControlType = res.data.fireControlType;
              this.alarmInfo.planCodes = [];
              this.alarmInfo.confirmSituation = undefined;
              this.alarmInfo.reasonSituation = undefined;
              this.alarmInfo.rescueSituation = undefined;
              const parames = {
                alarmNo: data.alarmNo,
                serialNumber: data.serialNumber
              };
              getFireControlPlanRecord(parames).then(recodeRes => {
                if (res.code === '200') {
                  this.alarmInfo.planCodes = recodeRes.data && recodeRes.data.planCodes ? [...recodeRes.data.planCodes] : [];
                  this.alarmInfo.confirmSituation = recodeRes.data.confirmSituation;
                  this.alarmInfo.reasonSituation = recodeRes.data.reasonSituation;
                  this.alarmInfo.rescueSituation = recodeRes.data.rescueSituation;
                }
              });
            }
          }
        });
        getFireControlSecurity().then(res => {
          if (res.code === '200') {
            this.alarmInfo.fireControl = res.data;
          }
        });
      }
    },
    _getSmokeDetectorWorkOrder (data) {
      getSmokeDetectorWorkOrder(data).then(res => {
        if (res.code === '200') {
          this.malfunctionInfo.stepList = res.data;
        }
      });
    },
    _getSmokeDetectorAlarmStats (data, serialNumber) {
      getSmokeDetectorAlarmStats(data, serialNumber).then(res => {
        if (res.code === '200') {
          const alarmAnalyze = {
            date: [],
            count1: []
          };
          res.data.map(data => {
            alarmAnalyze.date.push(data.simpleTime);
            alarmAnalyze.count1.push(data.alarmCount);
          });
          this.init5(alarmAnalyze)
        }
      });
    },
    async init5 (data) {
      var dom_5 = document.getElementById('chart5');
      let myChart = echarts.init(dom_5);
      let option = null;
      const chartOptions = await this.getChartOptions();
      option = {
        grid: {
          ...chartOptions.grid
        },
        tooltip: {
          ...chartOptions.tooltip
        },
        legend: {
          ...chartOptions.legend,
          data: [{
            name: '告警数',
            icon: 'rect'
          }]
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
            name: '告警数',
            type: 'line',
            symbol: 'circle',
            symbolSize: 3,
            smooth: false,
            lineStyle: {
              normal: {
                width: 3,
                color: {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: '#F9892E' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#F66351' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#F66351',
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 1,
                      color: 'rgba(246, 99, 81, 0.3)'
                    },
                    {
                      offset: 0,
                      color: 'rgba(246, 99, 81, 0)'
                    }
                  ])
                }
              }
            },
            data: data.count1
          }
        ]
      };
      myChart.setOption(option, true);
      window.onresize = function () {
        myChart.resize();
      };
    },
    handleAlarmStats (index) {
      this.malfunctionInfo.chartActive = index;
      const indexType = {
        0: '',
        1: 7,
        2: 30
      };
      this._getSmokeDetectorAlarmStats({
        timeInterval: indexType[index]
      }, this.malfunctionInfo.info.serialNumber);
    },
    // async _getSmokeDetectorSiteTree (data, id, label, type, resolve) {
    //   let treeData = [];
    //   await getSmokeDetectorSiteTree(data).then(res => {
    //     if (res.code === '200') {
    //       treeData = res.data.map(daItem => {
    //         return {
    //           id: daItem[id],
    //           label: daItem[label],
    //           type: type,
    //           ...daItem,
    //           children: null
    //         }
    //       });
    //       resolve(treeData);
    //     }
    //   });
    //   return treeData;
    // },
    async _getParkDeviceTree (data, parentData, parentOptionData, resolve) {
      let treeData = [];
      let parentOptionsData = [];
      await getParkDeviceTree(data).then(async res => {
        if (res.code === '200') {
          treeData = res.data.map(daItem => {
            let children = null;
            if (daItem.deviceModuleBaseDtoList && daItem.deviceModuleBaseDtoList.length > 0) {
              children = daItem.deviceModuleBaseDtoList.map(dto => {
                // this._getTypeDel(dto);
                return {
                  id: dto['serialNumber'],
                  label: dto['deviceModuleName'],
                  ...dto,
                  type: 'device',
                  isLeaf: true
                }
              });
            }
            let type = null;
            if (daItem['nodeLevel'] === 3) {
              type = 'building';
            }
            if (daItem['nodeLevel'] === 4) {
              type = 'floor';
            }
            return {
              id: daItem['nodeCode'],
              label: daItem['nodeName'],
              type,
              ...daItem,
              children
            }
          });
          resolve(treeData);
        }
      });
      return treeData;
    },
    async mergeOption (nodeList, id, parentData, optionsData) {
      const list = nodeList.data ? nodeList.data.optionsData : nodeList.children;
      let listData = [];
      if (!list[0].children) {
        await list.map(pd => {
          if (pd.value === id) {
            listData = [{ ...pd, children: optionsData }];
          }
        });
      } else {
        await list.map(async pd => {
          let listd = pd;
          if ((parentData.parentData && parentData.parentData.length > 1) || nodeList.level === 4) {
            listd.children = await this.mergeOption(pd, id, parentData, nodeList.data.currentOptionsData);
          }
          if (nodeList.isLeaf) {
            listd.children = nodeList.data.currentOptionsData;
          }
          listData.push(listd);
        });
      }
      return listData;
    },
    handleLoorTabClick (e) {
      if (e.name === '2' && this.deviceList.tableData && this.deviceList.tableData.length === 0) {
        this.onDeviceListSearch({
          treeNodeCode: this.floorCode
        });
      }
      if (e.name === '3' && this.historyList.tableData && this.historyList.tableData.length === 0) {
        this.onHistoryListSearch();
      }
      if (e.name === '4' && this.logList.tableData && this.logList.tableData.length === 0) {
        this.onLogListSearch();
      }
    },
    onAlarmListSearch (val) {
      this.alarmList.searchVal = {
        ...val,
        timeBegin: val.time && val.time[0],
        timeEnd: val.time && val.time[1]
      };
      delete this.alarmList.searchVal.time;
      this.onAlarmListCurrentChange(1);
    },
    _getSmokeDetectorAlarmForPage () {
      let parames = {
        data: {
          ...this.alarmList.searchVal
        },
        pageNo: Number(this.alarmList.page.current), // 查询的分页页码
        pageSize: Number(this.alarmList.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      };
      getSmokeDetectorAlarmForPage(parames).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.alarmList.page.total = total;
          this.alarmList.tableData = data;
        }
      });
    },
    onAlarmListCurrentChange (current) {
      this.alarmList.page.current = current;
      this._getSmokeDetectorAlarmForPage();
    },
    onAlarmListPageSizeChange (val) {
      this.alarmList.page.pageSize = val
      this.onAlarmListCurrentChange(1);
    },
    onAlarmListSelectionChange () {

    },
    onDeviceListSearch (val) {
      this.deviceList.searchVal = {
        ...val,
        timeBegin: val && val.time && val.time[0],
        timeEnd: val && val.time && val.time[1]
      };
      delete this.deviceList.searchVal.time;
      this.onDeviceListCurrentChange(1);
    },
    _getSmokeDetectorDeviceForPage () {
      let parames = {
        data: {
          ...this.deviceList.searchVal
        },
        pageNo: Number(this.deviceList.page.current), // 查询的分页页码
        pageSize: Number(this.deviceList.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      };
      getSmokeDetectorDeviceForPage(parames).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.deviceList.page.total = total;
          this.deviceList.tableData = data;
        }
      });
    },
    onDeviceListCurrentChange (current) {
      this.deviceList.page.current = current;
      this._getSmokeDetectorDeviceForPage();
    },
    onDeviceListPageSizeChange (pageSize) {
      this.deviceList.page.pageSize = pageSize;
      this.onDeviceListCurrentChange(1);
    },
    onDeviceListSelectionChange () {

    },
    remoteMethod (query) {
      if (query !== '') {
        this.deviceOptions = [];
      } else {
        this.deviceOptions = [];
      }
    },
    onHistoryListSearch (val) {
      this.historyList.searchVal = {
        ...val,
        timeBegin: val && val.time && val.time[0],
        timeEnd: val && val.time && val.time[1]
      };
      delete this.historyList.searchVal.time;
      this.onHistoryListCurrentChange(1);
    },
    onHistoryListCurrentChange (current) {
      this.historyList.page.current = current;
      this._getSmokeDetectorWorkOrderForPage();
    },
    _getSmokeDetectorWorkOrderForPage () {
      let parames = {
        data: {
          ...this.historyList.searchVal
        },
        pageNo: Number(this.historyList.page.current), // 查询的分页页码
        pageSize: Number(this.historyList.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      };
      getSmokeDetectorWorkOrderForPage(parames).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.historyList.page.total = total;
          this.historyList.tableData = data;
        }
      });
    },
    onHistoryListPageSizeChange (pageSize) {
      this.historyList.page.pageSize = pageSize;
      this.onHistoryListCurrentChange(1);
    },
    onHistoryListSelectionChange () {

    },
    onLogListSearch (val) {
      this.logList.searchVal = {
        ...val,
        timeBegin: val && val.time && val.time[0],
        timeEnd: val && val.time && val.time[1]
      };
      delete this.logList.searchVal.time;
      this.onLogListCurrentChange(1);
    },
    _getSmokeDetectorClearAlarmLogForPage () {
      let parames = {
        data: {
          ...this.logList.searchVal
        },
        pageNo: Number(this.logList.page.current), // 查询的分页页码
        pageSize: Number(this.logList.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      };
      getSmokeDetectorClearAlarmLogForPage(parames).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.logList.page.total = total;
          this.logList.tableData = data;
        }
      });
    },
    onLogListCurrentChange (current) {
      this.logList.page.current = current;
      this._getSmokeDetectorClearAlarmLogForPage();
    },
    onLogListPageSizeChange (pageSize) {
      this.logList.page.pageSize = pageSize;
      this.onLogListCurrentChange(1);
    },
    onLogListSelectionChange () {

    },
    contactCheck (item) {

    },
    clearError (item) {
      this.$confirm('此操作将永久清除该设备告警, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const parames = {
          alarmNo: [item.alarmNo],
          serialNumber: item.serialNumber
        };
        clearSmokeDetectorAlarm(parames).then(res => {
          if (res.code === '200') {
            this.$notify({
              title: '成功',
              message: '清除成功',
              type: 'success',
              position: 'bottom-right'
            });
            this._getTypeDel(item);
          }
        });
      });
    },
    disposeProgress () {
      const alarmInfo = this.alarmInfo;
      if (alarmInfo.confirmSituation === undefined || alarmInfo.confirmSituation === '') {
        this.$notify({
          title: '失败',
          message: '请检查现场确认情况是否有输入',
          type: 'error',
          position: 'bottom-right'
        });
        return;
      }
      let planCodes = alarmInfo.planCodes;
      let planCodeLists = alarmInfo.disposeList.map(list => list.code);
      if (alarmInfo.fireControlType === 1) {
        planCodeLists = alarmInfo.falseAlarmList.map(list => list.code);
      }
      planCodes = this.filterData(planCodes, planCodeLists);
      const parames = {
        planCodes: planCodes,
        confirmSituation: alarmInfo.confirmSituation,
        reasonSituation: alarmInfo.reasonSituation,
        rescueSituation: alarmInfo.rescueSituation,
        alarmNo: alarmInfo.info.alarmNo,
        serialNumber: this.currentNodeKey,
        createTime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        fireControlType: alarmInfo.fireControlType
      };
      saveFireControlPlanRecord(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '提交预警成功',
            type: 'success',
            position: 'bottom-right'
          });
        }
      })
    },
    filterData (a, b) { // 循环判断数组a里的元素在b里面有没有，有的话就放入新建立的数组中
      let result = new Array();
      for (let i = 0; i < a.length; i++) {
        if (b.indexOf(a[i]) != -1) {
          result.push(a[i]);
        }
      }
      return result;
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
            boundaryGap: false,
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
      var dom_1 = document.getElementById('chart1');
      let myChart = echarts.init(dom_1);
      let option = null;
      const chartOptions = await this.getChartOptions();
      option = {
        grid: {
          ...chartOptions.grid
        },
        tooltip: {
          ...chartOptions.tooltip,
          formatter: '{b0}<br />{a0}: {c0}ug/m³'
        },
        legend: {
          ...chartOptions.legend,
          data: [{
            name: '烟雾浓度',
            icon: 'rect'
          }, {
            name: '阀值',
            icon: 'rect'
          }]
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
            symbol: 'circle',
            symbolSize: 3,
            smooth: false,
            lineStyle: {
              normal: {
                width: 3,
                color: {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: '#38C5FF' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#287BFF' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#287BFF',
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 1,
                      color: 'rgba(40, 123, 255, 0.3)'
                    },
                    {
                      offset: 0,
                      color: 'rgba(56, 197, 255, 0)'
                    }
                  ])
                }
              }
            },
            data: data.count1
          },
          {
            name: '阀值',
            type: 'line',
            symbol: 'circle',
            symbolSize: 3,
            smooth: false,
            lineStyle: {
              normal: {
                width: 1,
                color: '#F36132'
              }
            },
            data: data.count2
          }
        ]
      };
      myChart.setOption(option, true);
      window.onresize = function () {
        myChart.resize();
      };
    },
    async init2 (data) {
      var dom_2 = document.getElementById('chart2');
      let myChart = echarts.init(dom_2);
      let option = null;
      const chartOptions = await this.getChartOptions();
      option = {
        grid: {
          ...chartOptions.grid
        },
        tooltip: {
          show: true,
          trigger: 'item',
          // formatter: function (params) {
          //   let relVal = params.name
          //   relVal += '<br/>' + params.marker + params.seriesName + ' : ' + params.value + '℃';
          //   return relVal
          // }
          formatter: '{b0}<br />{a0}: {c0}℃'
        },
        legend: {
          ...chartOptions.legend,
          data: [{
            name: '温度',
            icon: 'rect'
          }, {
            name: '阀值',
            icon: 'rect'
          }]
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
            smooth: false,
            lineStyle: {
              normal: {
                width: 3,
                color: {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: '#23E5AF' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#18C289' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#18C289',
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 1,
                      color: 'rgba(24, 194, 137, 0.3)'
                    },
                    {
                      offset: 0,
                      color: 'rgba(35, 229, 175, 0)'
                    }
                  ])
                }
              }
            },
            data: data.count1
          },
          {
            name: '阀值',
            type: 'line',
            symbol: 'circle',
            symbolSize: 3,
            smooth: false,
            lineStyle: {
              normal: {
                width: 1,
                color: '#F36132'
              }
            },
            data: data.count2
          }
        ]
      };
      myChart.setOption(option, true);
      window.onresize = function () {
        myChart.resize();
      };
    },
    async init3 (data) {
      var dom_3 = document.getElementById('chart3');
      let myChart = echarts.init(dom_3);
      let option = null;
      const chartOptions = await this.getChartOptions();
      option = {
        grid: {
          ...chartOptions.grid
        },
        tooltip: {
          ...chartOptions.tooltip
        },
        legend: {
          ...chartOptions.legend,
          data: [{
            name: '湿度',
            icon: 'rect'
          }, {
            name: '阀值',
            icon: 'rect'
          }]
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
            name: '湿度',
            type: 'line',
            symbol: 'circle',
            symbolSize: 3,
            smooth: false,
            lineStyle: {
              normal: {
                width: 3,
                color: {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: '#F77411' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#F05A22' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#F05A22',
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 1,
                      color: 'rgba(240, 90, 34, 0.3)'
                    },
                    {
                      offset: 0,
                      color: 'rgba(247, 116, 17 , 0)'
                    }
                  ])
                }
              }
            },
            data: data.count1
          },
          {
            name: '阀值',
            type: 'line',
            symbol: 'circle',
            symbolSize: 3,
            smooth: false,
            lineStyle: {
              normal: {
                width: 1,
                color: '#F36132'
              }
            },
            data: data.count2
          }
        ]
      };
      myChart.setOption(option, true);
      window.onresize = function () {
        myChart.resize();
      };
    },
    async init4 (data) {
      var dom_4 = document.getElementById('chart4');
      let myChart = echarts.init(dom_4);
      let option = null;
      const chartOptions = await this.getChartOptions();
      option = {
        grid: {
          ...chartOptions.grid
        },
        tooltip: {
          ...chartOptions.tooltip,
          formatter: '{b0}<br />{a0}: {c0}次'
        },
        legend: {
          ...chartOptions.legend,
          data: [{
            name: '告警数',
            icon: 'rect',
            backgroundColor: '#F05A22'
          }]
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
        color: ['#C37EFF'],
        series: [
          {
            name: '告警数',
            type: 'line',
            symbol: 'circle',
            symbolSize: 3,
            smooth: false,
            lineStyle: {
              normal: {
                width: 3,
                color: {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: '#C37EFF' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#B314F6' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            // itemStyle: {
            //   normal: {
            //     color: '#A2FFBC',
            //     areaStyle: {
            //       color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            //         {
            //           offset: 1,
            //           color: 'rgba(124, 255, 188, 0.3)'
            //         },
            //         {
            //           offset: 0,
            //           color: 'rgba(180, 255, 188, 0)'
            //         }
            //       ])
            //     }
            //   }
            // },
            data: data.count1
          }
        ]
      };
      myChart.setOption(option, true);
      window.onresize = function () {
        myChart.resize();
      };
    },
    getCheckedKeys (key) {
      this.$nextTick(() => {
        const store = this.$refs.tree.store;
        const node = store.getNode(key);
        store.setCurrentNode(node);
        this.$refs.tree.currentNode = node;
        store.setCurrentNodeKey(key);
        store.currentNodeKey = key;
        this.$refs.tree.$emit('node-click', node.data, node, this.$refs.tree);
        store.nodesMap[node.data.id].expanded = true;
        store.nodesMap[node.data.id].parent.expanded = true;
      });
    },
    fireControlChange () {

    }
  }
};
</script>
<style lang="less">
#smokeTimeMonitoring{
  display: flex;
  flex-direction: row;
  .accessSelect{
    flex: 2;
    height: 100%;
    padding-right: 10px;/*no*/
    .info{
      height: 100%;
      background: #fff;
      .infoInput{
        padding: 15px 10px;/*no*/
        border-bottom: 1px solid rgba(238,238,238,1);/*no*/
        input{
          background:rgba(255,255,255,1);
          border-radius:5px;/*no*/
          border:1px solid rgba(165,186,250,1);/*no*/
          line-height: 30px !important;/*no*/
        }
        >.el-select{
          display: flex;
          flex: 1;
          margin-right: 10px;/*no*/
        }
        >.el-input{
          display: flex;
          flex: 2;
        }
        .el-input__suffix{
          display: flex;
          align-items: center;
          padding-left:8px;/*no*/
          cursor: pointer;
          &::after{
            // position: relative;
            // content: '';
            // width: 1px;/*no*/
            // height: 17px;/*no*/
            // position: absolute;
            // top: 50%;
            // left: 0;
            // transform: translateY(-50%);
            // background: #D0D0D0;
          }
          i{
            font-size: 16px;/*no*/
            color: #4A80F5;
          }
        }
      }
      .infoTree{
        height: calc(100% - 61px);/*no*/
        padding-bottom: 20px;/*no*/
        .el-tree{
          height: 100%;
          overflow: auto;
          .el-tree-node__children{
            .is-expanded{
              .area{
                color: #2573F2 !important;
                font-weight: 600 !important;
                .building, .floor {
                  color: #2573F2 !important;
                }
              }
              .is-expanded{
                .building {
                  color: #2573F2 !important;
                  font-weight: 600 !important;
                }
                .is-expanded{
                  .floor {
                    color: #2573F2 !important;
                  }
                  .is-checked{
                    .device{
                      color: #2573F2 !important;
                    }
                  }
                }
              }
            }
          }
          .custom-tree-node{
            .treeLabel{
              position: relative;
              &.park{
                font-size: 14px;/*no*/
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #3F3F3F;
              }
              &.area{
                font-size: 14px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 400;
                color: #3F3F3F;
              }
              &.building, &.floor {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #3F3F3F;
              }
              &.device{
                padding-left: 15px;/*no*/
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                &::before{
                  content: '';
                  width: 5px;/*no*/
                  height: 5px;/*no*/
                  border-radius: 100%;
                  background: #FF3C30;
                  position: absolute;
                  top: 50%;
                  left: 5px;/*no*/
                  transform: translateY(-50%);
                }
                &.device11{
                  &::before{
                    background: #FF3C30;
                  }
                }
                &.device10{
                  &::before{
                     background: linear-gradient(136deg, #35BA70 0%, #2EB67C 100%);
                  }
                }
                &.device20{
                  &::before{
                    background: #FFA330;
                  }
                }
                &.device30{
                  &::before{
                    background: #8D8D8D;
                  }
                }
              }
            }
          }
        }
        .labers{
          padding: 0px 10px;/*no*/
        }
      }
    }
  }
  .timeMonitoringSelect{
    flex: 8;
    overflow-y: auto;
    // padding: 20px;/*no*/
    &::-webkit-scrollbar-track-piece {
      //滚动条凹槽的颜色，还可以设置边框属性
      background-color: #EBEBEB;
    }
    &::-webkit-scrollbar {
      //滚动条的宽度
      width: 4px;
      height: 2px;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      //滚动条的设置
      background-color: #B6B5B5;
      background-clip: padding-box;
      min-height: 28px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: #B6B5B5;
    }
    .building{
      height: 100%;
      padding: 20px;/*no*/
      background: #fff;
      .buildingName{
        font-size: 16px;/*no*/
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #393939;
      }
      .buildingInfo{
        padding: 30px 30px;/*no*/
        margin-bottom: 10px;/*no*/
        border-bottom: 1px solid #D8D8D8;/*no*/
        justify-content: space-between;
        >div{
          // flex: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          .icon{
            width: 49px;
            height: 49px;
            border-radius: 100px;
            background: linear-gradient(320deg, #25D3FF 0%, #3FBAF2 100%);
            margin-right: 15px;/*no*/
            display: flex;
            align-items: center;
            justify-content: center;
            i{
              font-size: 24px;
              color: #fff;
            }
          }
          .info{
            justify-content: space-around;
            span{
              font-size: 20px;/*no*/
              font-family: DINAlternate-Bold, DINAlternate;
              font-weight: bold;
              color: #5D5D5D;
              &:last-child{
                font-size: 12px;/*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #5D5D5D;
              }
            }
          }
          &:nth-of-type(2) {
            .icon{
              background: linear-gradient(320deg, #1FD3A4 0%, #1DCE8D 100%);
            }
          }
          &:nth-of-type(3) {
            .icon{
              background: linear-gradient(320deg, #F267E6 0%, #BB49F3 100%);
            }
          }
          &:nth-of-type(4) {
            .icon{
              background: linear-gradient(320deg, #FF8F46 0%, #FE5A5A 100%);
            }
          }
          &:nth-of-type(5) {
            .icon{
              background: linear-gradient(320deg, #F2B83F 0%, #FF9A25 100%);
            }
          }
        }
      }
      .buildingEx{
        height: calc(100% - 124px - 17px - 15px);/*no*/
        span{
          font-size: 12px;/*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #5D5D5D;
        }
        .buildExMain{
          margin-top: 20px;/*no*/
          align-items: center;
          >div{
            width: 441px;
            height: 34px;
            background: #DCFFF5;
            border: 1px solid #8AEDD5;/*no*/
            margin-bottom: 10px;/*no*/
            display: flex;
            align-items: center;
            padding: 0 5px;/*no*/
            cursor: pointer;
            &.n1{
            background: #DCFFF5;
            border-color:#8AEDD5;
            }
            &.n2{
            background: #FFD7A6;
            border-color:#FF3232;
            }
            &.n3{
            background: #FF8A8A;
            border-color:#FF9A4C ;
            }
            &.n4{
            background: #D5D5D5;
            border-color:#858585;
            }
            &:last-child{
              margin-bottom: 0;
            }
          }
        }
        img{
          width: 655px;
          height: auto;
          margin: 0 auto;
          margin-bottom: 10px;/*no*/
        }
      }
      .buildingLabel{
        margin-top: 15px;/*no*/
        justify-content: flex-end;
        >div{
          display: flex;
          align-items: center;
          margin-right: 10px;/*no*/
          span{
            width: 8px;/*no*/
            height: 8px;/*no*/
            margin-right: 5px;/*no*/
          }
          font-size: 12px;/*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #5D5D5D;
          &.n1{
            span{
              background: #33B974;
            }
          }
                    &.n2{
            span{
              background: #FFB14F;
            }
          }
                    &.n3{
            span{
              background: #FF3C30;
            }
          }
                    &.n4{
            span{
              background: #8D8D8D;
            }
          }
        }
      }
    }
    .loor{
      .loorName{
        font-size: 16px;/*no*/
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #393939;
        padding: 20px 20px 0px;/*no*/
        background: #fff;
      }
      .loorInfo{
        padding: 30px 30px;/*no*/
        margin-bottom: 10px;/*no*/
        justify-content: space-between;
        background: #fff;
        >div{
          // flex: 1;
          display: flex;
          flex-direction: row;
          align-items: center;
          .icon{
            width: 49px;
            height: 49px;
            border-radius: 100px;
            background: linear-gradient(320deg, #25D3FF 0%, #3FBAF2 100%);
            margin-right: 15px;/*no*/
            display: flex;
            align-items: center;
            justify-content: center;
            i{
              font-size: 24px;
              color: #fff;
            }
          }
          .info{
            justify-content: space-around;
            span{
              font-size: 20px;/*no*/
              font-family: DINAlternate-Bold, DINAlternate;
              font-weight: bold;
              color: #5D5D5D;
              &:last-child{
                font-size: 12px;/*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #5D5D5D;
              }
            }
          }
          &:nth-of-type(2) {
            .icon{
              background: linear-gradient(320deg, #1FD3A4 0%, #1DCE8D 100%);
            }
          }
          &:nth-of-type(3) {
            .icon{
              background: linear-gradient(320deg, #F267E6 0%, #BB49F3 100%);
            }
          }
          &:nth-of-type(4) {
            .icon{
              background: linear-gradient(320deg, #FF8F46 0%, #FE5A5A 100%);
            }
          }
          &:nth-of-type(5) {
            .icon{
              background: linear-gradient(320deg, #F2B83F 0%, #FF9A25 100%);
            }
          }
        }
      }
      .loorDeviceList{
        background: #FDFEFF;
        border: 1px solid #E6EFF6;/*no*/
        padding: 10px 20px 20px;/*no*/
        span{
          margin-bottom: 17px;/*no*/
          font-size: 14px;/*no*/
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #454545;
          position: relative;
          padding-left: 10px;/*no*/
          &::after{
            content: '';
            width: 4px;/*no*/
            height: 13px;/*no*/
            position: absolute;
            left: 0px;
            top: 50%;
            transform: translateY(-50%);
            background: #265ACA;
          }
        }
        .listItems{
          >div{
            width: 30px;/*no*/
            height: 30px;/*no*/
            background: #E6FFF8;
            border-radius: 4px;/*no*/
            border: 1px solid #03C590;/*no*/
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;/*no*/
            cursor: pointer;
            i{
              font-size: 20px;/*no*/
            }
            &.device11{
              border-color: #FF3C30;
              background: #FFFBFB;
              i{
                color: #FF3C30;
              }
            }
            &.device10{
              border-color: #03C590;
              background: #E6FFF8;
              i{
                color: #03C590;
              }
            }
            &.device20{
              border-color: #FFA330;
              background: #f3dcad;
              i{
                color: #FFA330;
              }
            }
            &.device30{
              border-color: #8D8D8D;
              background: #F9F9F9;
              i{
                color: #8D8D8D;
              }
            }
          }
        }

      }
      .el-tabs{
        height: 100%;
        margin-top: 20px;/*no*/
        .el-tabs__header{
          border-color: #D5D5D5;
          margin-bottom: 10px;/*no*/
          .el-tabs__nav-next, .el-tabs__nav-prev {
            z-index: 1;
          }
          .el-tabs__nav{
            .el-tabs__item{
              background:rgba(255,255,255,1);
              font-size:14px;/*no*/
              font-family:PingFangSC-Regular,PingFang SC;
              font-weight:400;
              color:rgba(69,69,69,1);
              i{
                font-size: 15px;/*no*/
                color: #A6A6A6;
              }
              &.is-active{
                background:rgba(38,90,202,1);
                color:rgba(255,255,255,1);
                border-bottom: none;
                i{
                  color: #fff;
                }
              }
            }
          }
        }
        .el-tabs__content{
          height: calc(100% - 56px);/*no*/
          padding: 10px;/*no*/
          background: #fff;
          position: relative;
          overflow:visible;
          >div.el-tab-pane{
            height: 100%;
          }
        }
      }
    }
    .alarm{
      .alarmHeader{
        align-items: center;
        justify-content: space-between;
        padding: 15px 10px 15px 20px;/*no*/
        margin-bottom: 10px;/*no*/
        background: #fff;
        .alarmTitle{
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #393939;
          margin-right: 10px;/*no*/
        }
        .alarmStatus{
          background: linear-gradient(135deg, #FD7C22 0%, #F46600 100%);
          color: #fff;
          padding: 5px 11px;/*no*/
          font-size: 12px;/*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 1;
        }
        .btnList{
          button{
            padding: 6px 12px;/*no*/
            font-size: 12px;/*no*/
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            background: #265ACA;
            border-radius: 0;
            margin-left: 0;
            &:first-child{
              margin-right: 10px;/*no*/
            }
          }
        }
      }
      .adminCard1{
        .content{
          .el-image{
            background: #D8D8D8;
            width: 238px;/*no*/
            height: auto;
            margin-right: 10px;/*no*/
            i{
             font-size: 36px;/*no*/
            }
          }
          #videoAddress{
            flex: 1;
            height: 300px;
            margin-right: 10px;/*no*/
          }
        }
        #formItemText{
          flex: 2;
          display: flex;
          align-items: center;
          .el-form{
            display: flex;
          }
        }
      }
      .adminCard3{
        .el-checkbox-group{
          display: flex;
          flex-direction: column;
          >label{
            background: #FCFCFC;
            border-radius: 1px;/*no*/
            border: 1px solid #D8D8D8;/*no*/
            padding: 8px 10px;/*no*/
            margin-right: 0;
            margin-bottom: 6px;/*no*/
            &.is-checked{
              background: #F7FBFF;
              border: 1px solid #569EE5;/*no*/
              .el-checkbox__inner{
                border-color: #1890ff;
              }
              .el-checkbox__label{
                color: #454545;
              }
            }
          }
        }
        .el-button {
          float: right;
          padding: 6px 12px;/*no*/
          font-size: 12px;/*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          background: #265ACA;
          border-radius: 0;
          margin-left: 0;
        }
      }
      .adminCard4{
        ul{
          li{
            background: #FFFFFF;
            margin-bottom: 6px;/*no*/
            .position{
              width: 110px;/*no*/
              text-align: center;
              padding: 20px 0px;/*no*/
              background: #CADEFF;
              border-radius: 1px;/*no*/
              font-size: 12px;/*no*/
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #1E579B;
            }
            .controlInfo{
              flex: 1;
              align-items: center;
              padding: 0 20px;/*no*/
              border: 1px solid #D8D8D8;/*no*/
              border-left: none;
              >div{
                margin-right: 10px;/*no*/
                &:last-child{
                  margin-right: 0;
                }
              }
              div{
                font-size: 12px;/*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #454545;
              }
            }
          }
        }
      }
    }
    .normal{
      >.headerCard{
        padding: 20px;/*no*/
        background: #fff;
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
      .setValue {
        min-width: 70px;
        font-size: 14px !important;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        border-radius: 0 !important;
        background: #2573f1;
      }
      #formItemText{
        margin-top: 10px;/*no*/
      }
      .list1{
        padding-top: 15px;/*no*/
        margin-top: 8px;/*no*/
        border-top: 1px solid #DADADA;/*no*/
        .el-col{
          height: 100%;
          .content{
            height: 100%;
            border-right: 1px solid #EBEBEB;/*no*/
            padding: 0 15px 0 5px;/*no*/
            .icon{
              width: 60px;
              height: 60px;
              background: #E9F3FF;
              border-radius: 8px;
              margin-right: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
              i{
                font-size: 35px;
                background-image: -webkit-linear-gradient(-45deg, #63A0EC 20%, #3366D4 60%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
            }
            .baseInfo{
              flex: 1;
              justify-content: space-between;
              .name{
                font-size: 14px; /*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #5D5D5D;
              }
              .value {
                font-size: 28px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #1C71C7;
              }
            }
            .maxInfo{
              justify-content: flex-end;
              align-self: flex-end;
              span{
                font-size: 14px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #FF720D;
                margin-left: 6px;/*no*/
              }
              .fa{
                font-size: 14px;/*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #5D5D5D;
                margin-bottom: 6px;
              }
              .maxValue{
                font-size: 14px;/*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #5D5D5D;
              }
            }
          }
          &:nth-of-type(2) {
            .icon{
              background: #E9F3FF;
              i{
                 background-image: -webkit-linear-gradient(-45deg, #6F9AFF 20%, #6662ED 60%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
            }
          }
          &:nth-of-type(3) {
            .icon{
              background: #E9F3FF;
              i{
                 background-image: -webkit-linear-gradient(-45deg, #37D9F5 20%, #00ADDA  60%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
            }
          }
          &:nth-of-type(4) {
            .content{
              border-right: none;
              justify-content: center;
              .baseInfo{
                flex: none;
              }
              .icon{
                background: #E9F3FF;
                i{
                  background-image: -webkit-linear-gradient(-45deg, #FFA26A 20%, #FF6838 60%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                }
              }
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
          .content{
            background: #fff;
            margin-bottom: 10px;/*no*/
            padding: 10px 15px;/*no*/
            .title{
              font-size: 14px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #5F5F5F;
              margin-bottom: 15px;/*no*/
            }
          }
        }
        .chart{
          width: 100%;
          height: 300px;
        }
      }
    }
    .malfunction{
      >.headerCard{
        padding: 20px;/*no*/
        background: #fff;
        margin-bottom: 10px;/*no*/
      }
      .malfunctionHeader{
        align-items: center;
        justify-content: space-between;
        .malfunctionTitle{
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #393939;
          margin-right: 10px;/*no*/
        }
        .malfunctionStatus{
          background: linear-gradient(135deg, #44A4FF 0%, #297EF0 100%);
          color: #fff;
          padding: 5px 11px;/*no*/
          font-size: 12px;/*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 1;
        }
      }
      .adminCard1{
        .cardTitle{
          padding-left: 0;
          font-size: 14px;/*no*/
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #5F5F5F;
          &::after{
            content: none;
          }
        }
        .content{
          .typeSelect{
            width: 100%;
            justify-content: center;
            align-items: center;
            li{
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
          .chart{
            width: 100%;
            height: 380px;
          }
        }
      }
      .adminCard2{
        .content{
          padding-left: 30px;/*no*/
          padding-bottom: 30px;/*no*/
          border-left:1px solid #E6E6E6;/*no*/
          margin-top: 30px;/*no*/
          margin-left: 12px;/*no*/
          .infoMain{
            padding: 10px 20px;/*no*/
            width: 100%;
            background: #FFFFFF;
            box-shadow: 0px 2px 4px 0px rgba(231,235,238,1);/*no*/
            border: 1px solid;/*no*/
            border-image: linear-gradient(136deg, rgba(160, 213, 255, 1), rgba(65, 158, 251, 1)) 1 1;
            position: relative;
            margin-bottom: 10px;/*no*/
            &::before{
              content: '';
              width:4px;/*no*/
              height: 100%;
              background: linear-gradient(180deg, #1694E4 0%, #015DD2 100%);
              border-radius: 1px;/*no*/
              position: absolute;
              left: 0px;
              top: 0;
            }
            .index{
              width: 25px;/*no*/
              height: 25px;/*no*/
              background: linear-gradient(130deg, #14C3F3 0%, #206AE1 100%);
              font-size: 16px;/*no*/
              font-family: DINAlternate-Bold, DINAlternate;
              font-weight: bold;
              color: #FFFFFF;
              display: flex;
              align-items: center;
              justify-content: center;
              position: absolute;
              left: -45px;/*no*/
              top: 50%;
              transform: translateY(-50%);
            }
            .title{
              font-size: 16px;/*no*/
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #333333;
              margin-bottom: 10px;/*no*/
            }
            .name{
              font-size: 12px;/*no*/
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #0F2E42;
              margin-bottom: 10px;/*no*/
            }
            .time{
              font-size: 12px;/*no*/
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #4F4F4F;
              margin-bottom: 10px;/*no*/
            }
            .info{
              font-size: 12px;/*no*/
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #4F4F4F;
            }
            &:last-child{
              margin-bottom: 0;
            }
          }
        }
      }
    }
    #formItemText{
      .el-form-item{
        .el-form-item__content{
          color:rgba(73,73,73,1);
        }
      }
    }
  }
}

  @media (max-width: 1200px) {
    .swiper-button-next {
      right: 20px;
      transform: rotate(90deg);
    }

    .swiper-button-prev {
      left: 20px;
      transform: rotate(90deg);
    }
  }
</style>

