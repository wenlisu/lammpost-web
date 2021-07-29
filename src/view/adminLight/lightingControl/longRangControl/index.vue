<template>
  <div id="longRangControl" :class="type === 'template' ? 'template' : ''">
    <div class="accessSelect">
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
              placeholder="请输入灯杆的名称"
              v-model="filterText"
            >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="searchTree"></i>
          </el-input>
        </div>
        <div class="infoTree">
          <el-tree
            class="filter-tree"
            :data="defaultOptions"
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
                      color: '#FFB14F',
                      name: '报警',
                      width: '6px',
                      height: '6px'
                  }, {
                      color: '#FF3C30',
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
      <div class="flexCloumn building" v-if="monitorId === 'address'">
        <div class="flexCloumn buildingHeader">
          <div class="flexRow buildingName">
            {{buildingInfo.name}}
            <div class="flexRow">
              <div class="flexRow batchWater" @click="fastOpen">
                <!-- <div class="icon"><i class="iconfont icon-dianji" /></div> -->
                一键开启
              </div>
              <div class="flexRow batchWater" @click="fastClose">
                <!-- <div class="icon"><i class="iconfont icon-dianji" /></div> -->
                一键关闭
              </div>
            </div>
          </div>
          <div class="flexRow buildingInfo">
            <div>
              <div class="icon">
                <i class="iconfont icon-zongshu" />
              </div>
              <div class="flexCloumn info">
                <span>{{buildingInfo.info.totalCount || 0}}</span>
                <span>总数</span>
              </div>
            </div>
            <div>
              <div class="icon">
                <i class="iconfont icon-shebeijierupingtai" />
              </div>
              <div class="flexCloumn info">
                <span>{{buildingInfo.info.onCount || 0}}</span>
                <span>开启</span>
              </div>
            </div>
            <div>
              <div class="icon">
                <i class="iconfont icon-shebeijierupingtai" />
              </div>
              <div class="flexCloumn info">
                <span>{{buildingInfo.info.offCount || 0}}</span>
                <span>关闭</span>
              </div>
            </div>
            <div>
              <div class="icon">
                <i class="iconfont icon-guzhang" />
              </div>
              <div class="flexCloumn info">
                <span>0</span>
                <span>故障</span>
              </div>
            </div>
            <div>
              <div class="icon">
                <i class="iconfont icon-lixianshu" />
              </div>
              <div class="flexCloumn info">
                <span>{{buildingInfo.info.offlineCount || 0}}</span>
                <span>离线</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flexCloumn buildingSearch">
          <admin-search-form
            :searchItems="buildingInfo.searchItems"
            @onSearch="onBuildingSearch"
            v-if="type !== 'template'"
          />
          <search-form
            :searchItems="buildingInfo.searchItems"
            @onSearch="onBuildingSearch"
            v-else
          />
        </div>
        <el-row :gutter="10" class="buildingData">
          <el-col
            :span="6"
            v-for="(item, index) in buildingInfo.tableData"
            :key="`buildingInfo${index}`"
          >
            <div class="flexCloumn content">
              <div class="flexRow header">
                <div class="flexCenter icon">
                  <i class="iconfont icon-shebeijierupingtai"/>
                </div>
                {{item.deviceModuleName}}
                <el-switch
                  v-model="item.powerStatus"
                  active-color="#1794FF"
                  inactive-color="#2650A7"
                  :active-value="1"
                  :inactive-value="0"
                  @change="changeSingSwitch(item, index)"
                >
                </el-switch>
              </div>
              <div class="flexCloumn flexCenter body">
                <div
                  class="flexCenter icon"
                  :style="{opacity: item.brightness * 0.01 !== 0 ? item.brightness * 0.01 : 0.1, cursor: 'pointer'}"
                  @click="jumpToControl(item)"
                >
                  <i class="iconfont icon-shebeijierupingtai"/>
                </div>
                <div class="number">{{`${item.brightness}%`}}</div>
                <div class="currentText">当前亮度</div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-pagination
          @size-change="onBuildingPageSizeChange"
          @current-change="onBuildingCurrentChange"
          :current-page.sync="buildingInfo.page.current"
          :page-size="buildingInfo.page.pageSize"
          layout="total, prev, pager, next"
          :total="buildingInfo.page.total">
        </el-pagination>
      </div>
      <div class="flexCloumn deviceContainer" v-if="monitorId === 'device'">
        <Control :imei="monitorData.imei"/>
        <!-- <div class="flexCloumn timeContainer">
          <div class="deviceTitle">
            {{monitorData.label}}
          </div>
            <div
              class="deviceContralItem"
              v-for="(item, index) in deviceModuleList"
              :key="`${item.deviceTypeCode}${index}`"
            >
              <div class="title">
                {{item.info.title}}
              </div>
              <div class="body">
                <div
                  class="contralItem"
                >
                  <el-form ref="form" :model="item.form" label-width="45px">
                    <el-form-item
                      label="开关："
                      v-if="item.info.formType !== '3'"
                    >
                      <el-switch
                        v-model="item.lampSettingInfoDto.power === 1"
                        @change="powerChange(item.lampSettingInfoDto.power, index)"
                      ></el-switch>
                    </el-form-item>
                    <el-form-item
                      label="设备状态："
                      label-width="60px"
                      v-else
                    >
                      <div>{{item.onlineStatusText}}</div>
                    </el-form-item>
                    <el-form-item
                      label="亮度："
                      v-if="item.info.formType === '1'"
                    >
                      <el-slider
                        v-model="item.lampSettingInfoDto.brightness"
                        @change="val => brightnessChange(val, index)"
                        :marks="{
                          0: '0',
                          100: '100'
                        }"
                      >
                      </el-slider>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </div>
          <div class="imgContent">
            <img class="lampPost" src="./images/img1.png"/>
            <img class="lampLight" src="./images/light.png" v-if="deviceModuleList.length > 0 && judgeDeviceModule('LAMP') && judgeDeviceModule('LAMP').power" :style="{opacity: deviceModuleList.length > 0 && judgeDeviceModule('LAMP') && judgeDeviceModule('LAMP').brightness}"/>
            <div class="imgTitleItem flexRow linght" @click="lightDetail" v-if="deviceModuleList.length > 0 && judgeDeviceModule('LAMP').status">
              智慧照明<div class="flexCenter icon">
                <i class="el-icon-arrow-right"/>
              </div>
            </div>
            <div class="imgTitleItem flexRow camera" v-if="deviceModuleList.length > 0 && judgeDeviceModule('CAMERA').status" @click="cameraDetail">
              智慧监控<div class="flexCenter icon">
                <i class="el-icon-arrow-right"/>
              </div>
            </div>
            <div class="imgTitleItem flexRow ambient" v-if="deviceModuleList.length > 0 && judgeDeviceModule('AMBIENT').status" @click="ambientDetail">
              环境监测<div class="flexCenter icon">
                <i class="el-icon-arrow-right"/>
              </div>
            </div>
            <div class="imgTitleItem flexRow airing" v-if="deviceModuleList.length > 0 && judgeDeviceModule('AIRING').status" @click="airingDetail">
              智慧音响<div class="flexCenter icon">
                <i class="el-icon-arrow-right"/>
              </div>
            </div>
            <div class="imgTitleItem flexRow led" v-if="deviceModuleList.length > 0 && judgeDeviceModule('LED').status" @click="ledDetail">
              智慧LED<div class="flexCenter icon">
                <i class="el-icon-arrow-right"/>
              </div>
            </div>
            <div class="imgTitleItem flexRow battery" v-if="deviceModuleList.length > 0 && judgeDeviceModule('BATTERY').status" @click="batteryDetail">
              智慧充电<div class="flexCenter icon">
                <i class="el-icon-arrow-right"/>
              </div>
            </div>
            <div class="imgTitleItem flexRow battery" v-if="deviceModuleList.length > 0 && judgeDeviceModule('AUDIO').status" @click="batteryDetail">
              智慧广播<div class="flexCenter icon">
                <i class="el-icon-arrow-right"/>
              </div>
            </div>
            <div class="imgTitleItem flexRow call" v-if="deviceModuleList.length > 0 && judgeDeviceModule('CALL').status" @click="callDetail">
              一键报警<div class="flexCenter icon">
                <i class="el-icon-arrow-right"/>
              </div>
            </div>
          </div> -->
        </div>
        <div class="flexRow flexCenter btnList">
          <el-button
              type="text"
              size="small"
              title="取消"
              :style="{marginRight: '10px'}"
              v-if="type !== 'template'"
              @click.prevent.stop="handleCancel"
              >
              取消
          </el-button>
          <el-button
              type="primary"
              size="small"
              title="保存"
              v-if="type !== 'template'"
              @click.prevent.stop="handleSave"
              >
              设置
          </el-button>
        </div>
      </div>
    </div>
  </div>
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
import adminSearchForm from 'components/adminSearchForm/searchForm';
import searchForm from 'components/searchForm/searchForm';
import FormItemText from '@/components/formItemText/formItemText';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import PageTable from '@/components/adminPage-table';
import PoleMap from '@/view/index/lightPoleMap/poleMap';
import echartData from '@/view/lightPole/lightPoleStatistical/components/echartData';
import LightPoleMap from '@/view/lightPole/lightPoleDetail/index';
import Control from './components/control'
import { routePush } from '@/util/util';
import {
  getGroupPolicy,
  getLamp
} from 'api/index';
import {
  getDeviceModuleTree,
  getDetailByID,
  getTerminalTree
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
  getSmokeDetectorDevice
} from 'api/smokeDetectorMap';
import {
  getWaterMeterSiteTree,
  getWaterMeterCurrentStatus,
  getWaterMeterDeviceForPage
} from 'api/water';
import {
  getLampWorkStatus,
  getLampForPage,
  getDeviceAndCommand,
  setDeviceCommand,
  setLampPower
} from 'api/lightPole';
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
  name: 'longRangControl',
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
    adminSearchForm,
    PoleMap,
    labers,
    LightPoleMap,
    Control
  },
  props: {
    type: {
      type: String,
      default: 'default'
    }
  },
  data () {
    return {
      powerSwitch: false,
      isDetail: false,
      treeExpandAll: false,
      treeExpandKeys: [],
      sping: false,
      filterText: '',
      filterSelect: '',
      filterList: [],
      defaultOptions: [{
        id: 1,
        label: '一级 1',
        children: null
      }],
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      monitorId: undefined,
      buildingInfo: {
        switch: false,
        name: 'A区A1栋大厦照明设备状态',
        info: {
          offCount: 0,
          offlineCount: 0,
          onCount: 0,
          totalCount: 0
        },
        searchItems: [{
          type: 'input',
          label: '设备名称',
          labelWidth: '65px',
          props: {
            fieldName: 'deviceModuleName'
          }
        }, {
          type: 'radio',
          label: '设备状态',
          labelWidth: '65px',
          props: {
            fieldName: 'onlineStatus',
            options: [{
              id: '',
              name: '全部'
            }, {
              id: '1',
              name: '在线'
            }, {
              id: '2',
              name: '故障'
            }, {
              id: '3',
              name: '离线'
            }]
          }
        }],
        searchVal: {},
        // 分页
        page: {
          current: 1,
          pageSize: 10,
          total: 0
        },
        tableData: []
      },
      deviceInfo: {
        form: {},
        a: undefined,
        b: undefined
      },
      currentNodeKey: undefined,
      brightnessAndPowerItems: [{
        id: 'power',
        label: '开关',
        span: '24'
      }, {
        id: 'brightness',
        label: '亮度',
        span: '24'
      }],
      deviceModuleList: [],
      deviceModules: {
        'LAMP': {
          title: '照明灯',
          formType: '1',
          deviceId: 'lampSettingCommand',
          settingId: 'lampSettingInfoDto',
          formItem: {
            brightness: undefined,
            power: undefined,
            serialNumber: undefined
          }
        },
        'CAMERA': {
          title: '摄像头',
          formType: '3',
          deviceId: 'cameraSettingCommand',
          settingId: 'cameraSettingInfoDto',
          formItem: {
            brightness: undefined,
            power: undefined,
            serialNumber: undefined
          }
        },
        'WIFI': {
          title: 'WIFI',
          formType: '3',
          deviceId: 'wifiSettingCommand',
          settingId: 'wifiSettingInfoDto',
          formItem: {
            brightness: undefined,
            power: undefined,
            serialNumber: undefined
          }
        },
        'BATTERY': {
          title: '充电桩',
          formType: '3',
          deviceId: 'batterySettingCommand',
          settingId: 'batterySettingInfoDto',
          formItem: {
            brightness: undefined,
            power: undefined,
            serialNumber: undefined
          }
        },
        'AMBIENT': {
          title: '环境监测',
          formType: '3',
          deviceId: 'ambientSettingCommand',
          settingId: 'ambientSettingInfoDto',
          formItem: {
            brightness: undefined,
            power: undefined,
            serialNumber: undefined
          }
        },
        'AUDIO': {
          title: '广播器',
          formType: '3',
          deviceId: 'audioSettingCommand',
          settingId: 'audioSettingInfoDto',
          formItem: {
            brightness: undefined,
            power: undefined,
            serialNumber: undefined
          }
        },
        'LED': {
          title: 'LED显示屏',
          formType: '1',
          deviceId: 'ledSettingAddCommand',
          settingId: 'ledSettingInfoDto',
          formItem: {
            brightness: undefined,
            power: undefined,
            id: undefined,
            resolution: undefined,
            serialNumber: undefined,
            settingCode: undefined,
            software: undefined,
            volume: undefined
          }
        },
        'CALL': {
          title: '一键报警',
          formType: '3',
          deviceId: 'callSettingCommand',
          settingId: 'callSettingInfoDto',
          formItem: {
            brightness: undefined,
            power: undefined,
            serialNumber: undefined
          }
        },
        'STATION': {
          title: '微基站',
          formType: '3',
          deviceId: 'stationSettingCommand',
          settingId: 'stationSettingInfoDto',
          formItem: {
            brightness: undefined,
            power: undefined,
            serialNumber: undefined
          }
        }
      },
      monitorData: {}
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
    });
  },
  computed: {
    ...mapGetters(['common', 'openPage']),
    routeName () {
      return this.$route.name
    }
  },
  methods: {
    initData () {
      const query = this.$route.query;
      if (query.activeNumber) {
        const parames = this.common['longRangControl'];
        this.treeExpandAll = true;
        this.sping = true;
        this.nodeClick({
          ...parames,
          label: parames.deviceModuleName,
          type: 'device',
          imei: parames.imei,
          id: query.activeNumber
        });
        this.filterText = parames.deviceModuleName;
        setTimeout(() => {
          // this.searchTree();
          this.$refs.tree.setCheckedKeys([query.activeNumber]);
        }, 500);
      } else {
        this.sping = true;
      }
    },
    clearnData () {
      this.sping = true;
      this.filterText = '';
      this.monitorId = '';
      this.currentNodeKey = '';
      setTimeout(() => {
        this.searchTree();
        this.$refs.tree.setCheckedKeys([]);
      }, 500);
    },
    searchTree () {
      this.$refs.tree.filter({val: this.filterText, type: 'label'});
    },
    filterNode (value, data) {
      if (!value.val) return true;
      return data[value.type] && data[value.type].indexOf(value.val) !== -1;
    },
    async loadNode (node, resolve) {
      const activeNumber = this.$route.query.activeNumber;
      if (node.level === 0) {
        const tree0 = await this._getTerminalTree({
          'address': '',
          'area': '',
          'city': '',
          'imei': ''
        }, 'city', 'city', 'city', resolve);
        if (!activeNumber) {
          this.treeExpandKeys = [tree0[0].id];
        }
      }
      if (node.level === 1) {
        const tree1 = await this._getTerminalTree({
          city: node.data.city,
          cityCode: node.data.cityCode
        }, 'area', 'area', 'area', resolve);
        if (!activeNumber) {
          this.treeExpandKeys = [ ...this.treeExpandKeys, tree1[0].id ];
        }
      }
      if (node.level === 2) {
        const tree2 = await this._getTerminalTree({
          city: node.data.city,
          area: node.data.area,
          cityCode: node.data.cityCode,
          areaCode: node.data.areaCode
        }, 'address', 'address', 'address', resolve);
        if (!activeNumber) {
          this.treeExpandKeys = [ ...this.treeExpandKeys, tree2[0].id ];
        }
      }
      if (node.level === 3) {
        const tree3 = await this._getTerminalTree({
          city: node.data.city,
          area: node.data.area,
          cityCode: node.data.cityCode,
          areaCode: node.data.areaCode,
          address: node.data.address
        }, 'imei', 'terminalName', 'imei', resolve);
        if (!activeNumber) {
          this.treeExpandKeys = [ ...this.treeExpandKeys, tree3[0].id ];
        }
      }
      if (node.level === 4) {
        getTerminalTree({
          city: node.data.city,
          area: node.data.area,
          cityCode: node.data.cityCode,
          areaCode: node.data.areaCode,
          address: node.data.address,
          imei: node.data.imei,
          deviceTypeNo: 'LAMP'
        }).then(res => {
          if (res.code === '200') {
            const treeData = res.data.map(daItem => {
              return {
                id: daItem['serialNumber'],
                label: daItem['deviceModuleName'],
                type: 'device',
                city: node.data.city,
                area: node.data.area,
                address: node.data.address,
                imei: node.data.imei,
                ...daItem,
                leaf: true
              }
            });
            resolve(treeData);
            if (!activeNumber) {
              this.treeExpandKeys = [ ...this.treeExpandKeys, treeData[0].id ];
              this.$refs.tree.setCheckedKeys([treeData[0].id]);
              this.nodeClick({
                ...treeData[0],
                type: 'device',
                id: treeData[0].serialNumber
              });
            }
          }
        })
      }
      if (node.level === 5) {
        resolve([])
      }
    },
    nodeClick (data) {
      console.log('dayaaaa', data)
      this.monitorId = data.type;
      this.monitorData = data;
      this.currentNodeKey = data.id;
      if (data.id && data.type === 'address') {
        this.buildingInfo.name = `${data.label}照明设备状态`
        this.onBuildingCurrentChange(1);
        this._getLampWorkStatus();
      }
      if (data.id && data.type === 'device') {
        this._getTypeDel(data);
      }
    },
    jumpToControl (data) {
      const params = {
        ...data,
        type: 'device',
        id: data.serialNumber,
        label: data.deviceModuleName,
        address: data.installAddress

      }
      this.nodeClick(params)
    },
    _getLampWorkStatus () {
      getLampWorkStatus().then(res => {
        if (res.code === '200') {
          this.buildingInfo.info = res.data;
        }
      });
    },
    _getDeviceAndCommand (data) {
      getDeviceAndCommand(data.imei).then(res => {
        if (res.code === '200') {
          const deviceModuleList = res.data.map(data => {
            const info = this.deviceModules[data.deviceTypeNo];
            const settingId = info && info.settingId;
            const lampSettingInfoDto = {
              power: (data[settingId] && data[settingId].power) ? data[settingId].power : 0,
              brightness: (data[settingId] && data[settingId].brightness) ? data[settingId].brightness : 0
            };
            return {
              ...data,
              info,
              formItem: info.formItem,
              form: {},
              lampSettingInfoDto
            }
          });
          this.deviceModuleList = deviceModuleList;
        }
      })
    },
    // 判断是否存在该设备
    judgeDeviceModule (deviceTypeNo) {
      const modules = this.deviceModuleList.filter(list => list.deviceTypeNo === deviceTypeNo);
      return {
        status: modules.length > 0,
        power: modules.length > 0 ? modules[0].lampSettingInfoDto.power === 1 : false,
        brightness: modules.length > 0 ? modules[0].lampSettingInfoDto.brightness * 0.01 : 0
      }
    },
    _getTypeDel (data) {
      const type = data.onlineStatus === 1 ? data.alarmStatusText : data.onlineStatusText;
      this._getDeviceAndCommand(data, type);
    },
    async _getTerminalTree (data, id, label, type, resolve) {
      let treeData = [];
      await getTerminalTree({
        ...data,
        deviceTypeNo: 'LAMP'
      }).then(res => {
        if (res.code === '200') {
          treeData = res.data.map(daItem => {
            return {
              id: daItem[id],
              label: daItem[label],
              type: type,
              ...data,
              ...daItem,
              children: null
            }
          });
          resolve(treeData)
        }
      });
      return treeData;
    },
    // 分页切换页面
    onBuildingCurrentChange (val) {
      this.buildingInfo.page.current = val;
      this.getBuildingDataAllList()
    },
    onBuildingPageSizeChange (val) {
      this.buildingInfo.page.pageSize = val
      this.onBuildingCurrentChange(1)
    },
    onBuildingSearch (val) {
      this.buildingInfo.searchVal = {
        ...val
      };
      this.onBuildingCurrentChange(1);
    },
    getBuildingDataAllList () {
      let data = {
        data: {
          ...this.buildingInfo.searchVal
        },
        pageNo: Number(this.buildingInfo.page.current), // 查询的分页页码
        pageSize: Number(this.buildingInfo.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getLampForPage(data).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.buildingInfo.page.total = total;
          this.buildingInfo.tableData = data;
        }
      })
    },
    powerChange (power, index) {
      const deviceModuleList = [...this.deviceModuleList];
      const powerNumber = power === 1 ? 0 : 1;
      const brightnessNumber = powerNumber === 1 ? 50 : 0;
      this.deviceModuleList[index].lampSettingInfoDto.brightness = brightnessNumber;
      deviceModuleList[index] = {
        ...deviceModuleList[index],
        lampSettingInfoDto: {
          brightness: brightnessNumber,
          power: powerNumber
        }
      };
      this.deviceModuleList = deviceModuleList;
    },
    brightnessChange (brightness, index) {
    },
    // 设置保存
    async handleSave () {
      let deviceModules = {};
      await this.deviceModuleList.map(data => {
        const info = data.info;
        const formItem = data.formItem;
        let infoObject = {};
        Object.keys(formItem).map(item => {
          infoObject[item] = data[item] || data.lampSettingInfoDto[item]
        });
        deviceModules[info.deviceId] = infoObject;
        return deviceModules
      });
      setDeviceCommand(deviceModules).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            position: 'bottom-right'
          });
        }
      })
    },
    handleCancel () {},
    // 一键开启
    fastOpen () {
      this.changeSingSwitch({
        offStatus: 0,
        area: this.monitorData.area,
        city: this.monitorData.city,
        street: this.monitorData.address,
        areaCode: this.monitorData.areaCode,
        cityCode: this.monitorData.cityCode,
        streetCode: this.monitorData.streetCode,
        powerStatus: 1
      });
    },
    // 一键关闭
    fastClose () {
      this.changeSingSwitch({
        offStatus: 1,
        area: this.monitorData.area,
        city: this.monitorData.city,
        street: this.monitorData.address,
        areaCode: this.monitorData.areaCode,
        cityCode: this.monitorData.cityCode,
        streetCode: this.monitorData.streetCode,
        powerStatus: 0
      });
    },
    // 单个设备更新开关状态
    changeSingSwitch (item, index) {
      if (index) {
        this.buildingInfo.tableData[index] = {
          ...this.buildingInfo.tableData[index],
          offStatus: item.powerStatus === 1 ? 0 : 1
        };
      }
      const parames = {
        area: item.area,
        areaCode: item.areaCode,
        city: item.city,
        cityCode: item.cityCode,
        serialNumber: item.serialNumber,
        street: item.street,
        streetCode: item.streetCode,
        power: item.powerStatus
      };
      setLampPower(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            position: 'bottom-right'
          });
          if (!index) {
            this.getBuildingDataAllList();
            this._getLampWorkStatus();
          }
        }
      });
    },
    lightDetail () {
      routePush({
        title: '灯杆详情',
        name: 'lightPoleDetail',
        parames: {
          imei: this.monitorData.imei
        }
      });
    },
    cameraDetail () {
      routePush({
        title: '灯杆详情',
        name: 'lightPoleDetail',
        parames: {
          imei: this.monitorData.imei
        }
      });
    },
    ambientDetail () {
      const items = this.deviceModuleList.filter(list => list.deviceTypeNo === 'AMBIENT');
      routePush({
        title: '实时监控详情',
        name: 'superviseTimeMonitoring',
        parames: {
          ...items,
          deviceName: items[0].deviceModuleName
        },
        query: {
          activeNumber: items[0].serialNumber
        }
      });
    },
    airingDetail () {
      routePush({
        title: '灯杆详情',
        name: 'lightPoleDetail',
        parames: {
          imei: this.monitorData.imei
        }
      });
    },
    ledDetail () {
      const items = this.deviceModuleList.filter(list => list.deviceTypeNo === 'LED')
      routePush({
        name: 'fastScreen',
        parames: {
          ...items,
          imei: this.monitorData.imei,
          ledDeviceName: items[0].deviceModuleName
        },
        query: {
          activeNumber: items[0].serialNumber
        }
      });
    },
    batteryDetail () {
      routePush({
        title: '灯杆详情',
        name: 'lightPoleDetail',
        parames: {
          imei: this.monitorData.imei
        }
      });
    },
    audioDetail () {
      routePush({
        title: '灯杆详情',
        name: 'lightPoleDetail',
        parames: {
          imei: this.monitorData.imei
        }
      });
    },
    callDetail () {
      const items = this.deviceModuleList.filter(list => list.deviceTypeNo === 'CALL')
      routePush({
        name: 'fastWarn',
        parames: {
          ...items,
          imei: this.monitorData.imei,
          deviceName: items[0].deviceModuleName
        },
        query: {
          serialNumber: items[0].serialNumber
        }
      });
    }
  }
};
</script>
<style lang="less">
#longRangControl{
  display: flex;
  flex-direction: row;
  .accessSelect{
    width: 20%;
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
          i{
            font-size: 16px;/*no*/
            color: #4A80F5;
          }
        }
      }
      .infoTree{
        height: calc(100% - 61px);/*no*/
        padding-bottom: 20px;/*no*/
        #labers .laberItem {
          color: #fff;
        }
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
                font-size: 14px;/*no*/
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 400;
                color: #3F3F3F;
              }
              &.building, &.floor {
                font-size: 12px;/*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #3F3F3F;
              }
              &.device{
                padding-left: 15px;/*no*/
                font-size: 12px;/*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                &::before{
                  content: '';
                  width: 5px;/*no*/
                  height: 5px;/*no*/
                  border-radius: 100%;
                  background: linear-gradient(136deg, #35BA70 0%, #2EB67C 100%);
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
    width: 80%;
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
      .buildingHeader{
        padding: 20px;/*no*/
        background: #fff;
      }
      .buildingName{
        font-size: 16px;/*no*/
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #393939;
        align-items: center;
        justify-content: space-between;
        >div{
          float: right;
          font-size: 12px;/*no*/
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #5D5D5D;
          align-items: center;
          .batchWater{
            background: #265ACA;
            box-shadow: 0px 2px 4px 0px rgba(211,223,231,1);/*no*/
            border-radius: 3px;/*no*/
            padding: 6px 7px;/*no*/
            cursor: pointer;
            margin-right: 14px;/*no*/
            line-height: 1;
            align-items: center;
            .icon{
              padding: 2px;/*no*/
              background: #265ACA;
              border-radius: 3px;/*no*/
              line-height: 1;
              margin-right: 4px;/*no*/
              i{
                font-size: 10px;/*no*/
              }
            }
            font-size: 12px;/*no*/
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            &:last-child{
              margin-right: 0;
            }
          }
        }
      }
      .buildingInfo{
        padding: 30px 30px 10px;/*no*/
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
            // cursor: pointer;
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
              background: linear-gradient(320deg, #0A93F7 0%, #3F74F2 100%);
            }
          }
          &:nth-of-type(4) {
            .icon{
               background: linear-gradient(320deg, #FF8F46 0%, #FE5A5A 100%);
            }
          }
          &:nth-of-type(5) {
            .icon{
              background: linear-gradient(320deg, #AC60F8 0%, #8856E1 100%);
            }
          }
        }
      }
      .buildingSearch{
        margin: 10px 0;/*no*/
        background: #fff;
        padding: 12px 15px 2px;/*no*/
      }
      .buildingData{
        .el-col{
          margin-bottom: 10px;/*no*/
          .content{
            width: 100%;
            padding: 14px;/*no*/
            background: linear-gradient(180deg, #FFFFFF 0%, #F6FAFF 100%);
            box-shadow: 0px 2px 6px 0px rgba(218,218,218,1);/*no*/
            .header{
              font-size: 14px;/*no*/
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #404040;
              align-items: center;
              position: relative;
              .icon{
                width: 20px;/*no*/
                height: 20px;/*no*/
                background: linear-gradient(135deg, #0E80D4 0%, #3C7EFF 100%);
                box-shadow: 0px 2px 4px 0px rgba(211,231,255,1);/*no*/
                border-radius: 100px;/*no*/
                margin-right: 5px;/*no*/
                i{
                  font-size: 9px;/*no*/
                  color: #fff;
                }
              }
              .el-switch{
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
              }
            }
            .body{
              padding: 20px 0 0;/*no*/
              .icon{
                width: 66px;
                height: 66px;
                background: linear-gradient(180deg, #FF9202 0%, #FFB92A 100%);
                border-radius: 41px;
                cursor: pointer;
                i{
                  font-size: 30px;
                  color: #fff;
                }
              }
              .number{
                font-size: 24px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #404040;
                line-height: 28px;
                margin-top: 10px;/*no*/
                margin-bottom: 5px;/*no*/
              }
              .currentText{
                font-size: 12px;/*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #9E9E9E;
                line-height: 17px;
              }
            }
            &.n1{

            }
            &.n2{
              background: linear-gradient(180deg, #FFFFFF 0%, #FFFAF6 100%);
              .header{
                .icon{
                  background: linear-gradient(135deg, #FD7859 0%, #FC570F 100%);
                  box-shadow: 0px 2px 4px 0px rgba(255,229,218,1);/*no*/
                }
              }
              .status{
                border-color: #FC8445;
                .icon{
                  background: linear-gradient(135deg, #FEA358 0%, #F9622F 100%);
                  box-shadow: 0px 2px 4px 0px rgba(230,178,135,0.5);/*no*/
                }
              }
            }
          }
        }
      }
      .el-pagination{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
    }
    .deviceContainer{
      width: 100%;
      height: 100%;
      .timeContainer{
        height: 100%;
        width: 100%;
        flex: 1;
        // padding: 70px 280px 20px 20px;/*no*/
        background: #fff;
        position: relative;
        flex-wrap: wrap;
        .itemContent {
          .linkButton {
            i {color: #fff;}
          }
          .itemMain{
            .item {
              // background: #ffffff;
              background: linear-gradient(270deg, rgba(34, 36, 77, 0.5) 0%, rgba(23, 43, 99, 0.5) 50%, rgba(35, 35, 74, 0.5) 100%);
              .charge_car_title {
                // color: #393939;
                color: #fff;
              }
              #formItemText .el-form-item .el-form-item__content {
                  // color: #393939;
                  color: #fff;
              }
            }
            &:nth-of-type(2n) .item .charge_car_title {
              // color: #393939;
              color: #fff;
            }
          }
          
        }
        // 大屏
        .imgContent{
            // width: auto;
            // height: 100%;
            // position: absolute;
            // top: 50%;
            // right: 50%;
            // bottom: 0;
            // transform: translate(40%, -50%);
            // padding-right: 80px;/*no*/
            // transform: translateY(-50%);
          // >img{
          //   &.lampPost{
          //     width: auto;
          //     height: 100%;
          //   }
          //   &.lampLight{
          //     position: absolute;
          //     left: 45%;
          //     top: 5%;
          //     transform: translateX(-132%);
          //     width: 64%;
          //     height: auto;
          //   }
          // }
          .itemMain{
            .item {
              background: #ffffff
            }
          }
          .imgTitleItem{
            cursor: pointer;
            position: absolute;
            background: linear-gradient(135deg, #37B4FF 0%, #1A78F1 100%);
            padding: 5px 7px;/*no*/
            font-size: 14px;/*no*/
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
            align-items: center;
            .icon{
              width: 14px;/*no*/
              height: 14px;/*no*/
              background: #FFFEFE;
              margin-left: 6px;/*no*/
              i{
                font-size: 10px;/*no*/
                color:#1A78F1;
              }
            }
            &::before{
              content: '';
              position: absolute;
              left: 0;
              right: 0;
              top: -3px;/*no*/
              height: 1px;/*no*/
              background: #1A78F1;
            }
            &::after{
              content: '';
              position: absolute;
              top: -17px;
              right: -27px;
              width: 34px;
              transform: rotate(-50deg);
              height: 1px;/*no*/
              background: #1A78F1;
            }
            &.linght{
              top: 10%;
              left: -7%;
              &::after{
                // top: -17px;
                // right: -27px;
                // width: 34px;
                // transform: rotate(-50deg);
              }
            }
            &.camera{
              top: 25%;
              left: 57%;
              &::after{
                top: -17px;
                right: auto;
                left: -27px;
                width: 34px;
                transform: rotate(50deg);
              }
            }
            &.ambient{
              top: 13%;
              left: 57%;
              &::after{
                top: -17px;
                right: auto;
                left: -27px;
                width: 34px;
                transform: rotate(50deg);
              }
            }
            &.airing{
              bottom: 39%;
              left: 16%;
            }
            &.led{
              bottom: 30%;
              right: 5%;
              &::after{
                top: -17px;
                right: auto;
                left: -27px;
                width: 34px;
                transform: rotate(50deg);
              }
            }
            &.battery{
              bottom: 10%;
              left: 10%;
            }
            &.call{
              bottom: 10%;
              right: 5%;
              &::after{
                top: -17px;
                right: auto;
                left: -27px;
                width: 34px;
                transform: rotate(50deg);
              }
            }
          }
        }
        .deviceTitle {
          position: absolute;
          top: 20px;/*no*/
          left: 20px;/*no*/
          font-size: 16px;/*no*/
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #393939;
          line-height: 22px;/*no*/
        }
        .deviceContralItem{
          width: 220px;/*no*/
          margin-bottom: 10px;/*no*/
          background: #FFFFFF;
          border-radius: 1px;
          border: 1px solid;
          border-image: linear-gradient(180deg, rgba(153, 199, 255, 1), rgba(241, 249, 255, 1)) 1 1;
          .title{
            padding: 7px 28px;/*no*/
            background: linear-gradient(270deg, rgba(200, 219, 255, 0) 0%, #E1EDFF 100%);
            border-radius: 1px;
            position: relative;
            font-size: 14px;/*no*/
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #393939;
            line-height: 20px;/*no*/
            &::before{
              content: '';
              width: 4px;/*no*/
              height: 14px;/*no*/
              background: #3471F5;
              position: absolute;
              top: 50%;
              left: 15px;/*no*/
              transform: translateY(-50%);
            }
          }
          .body{
            padding: 8px 25px 8px 15px;/*no*/
            .contralItem{
              .el-form{
                .el-form-item{
                  .el-form-item__label{
                    font-size: 12px;/*no*/
                    line-height: 25px;/*no*/
                  }
                  .el-form-item__content{
                    height: 25px;/*no*/
                    line-height: 25px;/*no*/
                    display: flex;
                    align-items: center;
                  }
                  .el-slider{
                    width: 100%;
                    .el-slider__runway{
                      margin-left: 7px;/*no*/
                      width: calc(100% - 7px);/*no*/
                      margin-bottom: 25px;/*no*/
                      .el-slider__button-wrapper{
                        width: 25px;/*no*/
                        height: 25px;/*no*/
                        top: -10px;/*no*/
                        .el-slider__button{
                          width: 14px;/*no*/
                          height: 14px;/*no*/
                          background: #0484D6;
                          border: 2px solid #FFFFFF;/*no*/
                        }
                      }
                      .el-slider__marks{
                        .el-slider__marks-text{
                          margin-top: 8px;/*no*/
                        }
                      }
                      .el-slider__marks-stop{
                        visibility: hidden;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      .btnList{
        height: 70px;
        margin-top: 10px;/*no*/
        background: #fff;
        justify-content: center !important;
        align-items: center !important;
        button{
          padding: 7px 25px;/*no*/
          // background:rgba(21,27,46,1);
          border-radius:4px;/*no*/
          border:1px solid #ddd;
          color: #888;
          font-size:12px;/*no*/
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:400;
          &.el-button--primary{
              background:linear-gradient(318deg,rgba(29,91,250,1) 0%,rgba(29,144,250,1) 100%);
              color:rgba(230,236,255,1);
              border-color: #1d5bfa;
          }
        }
      }
    }
  }
  &.template{
    .accessSelect{
      >.info{
        background: linear-gradient(276deg, rgba(22, 33, 77, 0.46) 0%, rgba(24, 40, 90, 0.46) 100%);
        border: 1px solid;/*no*/
        border-image: linear-gradient(90deg, rgba(102, 160, 255, 1), rgba(2, 54, 142, 1)) 1 1;
        .infoInput{
          border: none;
          input{
            background: #012F5D;
            border: 1px solid #1577D6;/*no*/
            font-size: 12px;/*no*/
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #EBF5FF;
          }
          .el-input__suffix{
            i{
              color: #FFFFFF;
            }
          }
        }
        .infoTree{
          padding: 0 10px 20px 10px;/*no*/
          .el-tree{
            background: transparent;
            >.el-tree-node{
              >.el-tree-node__content{
                background: #00488E;
                padding: 10px 15px;/*no*/
                height: 40px;/*no*/
                >.el-tree-node__expand-icon{
                  color: #fff;
                }
                >.custom-tree-node{
                  font-size: 14px;/*no*/
                  font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                  color: #FFFFFF;
                  line-height: 20px;
                }
              }
              >.el-tree-node__children{
                >.el-tree-node{
                  >.el-tree-node__content{
                    padding: 10px 15px;/*no*/
                    height: 40px;/*no*/
                    >.el-tree-node__expand-icon{
                      color: #fff;
                    }
                    >.custom-tree-node{
                      color: #A2BFFF;
                      font-size: 14px;/*no*/
                      font-family: PingFangSC-Semibold, PingFang SC;
                      font-weight: 600;
                      .area {
                        color: #A2BFFF !important;
                      }
                    }
                  }
                  >.el-tree-node__children{
                    >.el-tree-node {
                      >.el-tree-node__content{
                        background: #00305E;
                        padding: 10px 15px;/*no*/
                        height: 40px;/*no*/
                        >.custom-tree-node{
                          color: #fff;
                        }
                      }
                      >.el-tree-node__children{
                        >.el-tree-node {
                          >.el-tree-node__content{
                            background: #00305E;
                            height: 40px;/*no*/
                            padding: 10px 15px;/*no*/
                            >.custom-tree-node{
                              color: #fff;
                            }
                          }
                          >.el-tree-node__children{
                            >.el-tree-node{
                              >.el-tree-node__content{
                                background: #00305E;
                                height: 40px;/*no*/
                                padding: 10px 15px;/*no*/
                                >.custom-tree-node{
                                  color: #fff !important;
                                }
                              }
                              >.el-tree-node__children{
                                >.el-tree-node {
                                  >.el-tree-node__content{
                                    height: 40px;/*no*/
                                    padding: 10px 15px;/*no*/
                                    >.custom-tree-node{
                                      color: #95BDFF !important;
                                    }
                                  }
                                  &.is-checked{
                                    >.el-tree-node__content{
                                      background: #01396F;
                                      height: 40px;/*no*/
                                      padding: 10px 15px;/*no*/
                                      >.custom-tree-node{
                                        color: #fff !important;
                                        .device{
                                          color: #fff !important;
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .timeMonitoringSelect{
      .building{
        .buildingHeader{
          background: linear-gradient(135deg, rgba(3, 71, 109, 0.45) 0%, rgba(8, 50, 107, 0.43) 100%);
          border: 1px solid;/*no*/
          border-image: linear-gradient(135deg, rgba(9, 132, 241, 1), rgba(31, 78, 236, 0.68)) 1 1;
          .buildingName{
            font-size: 16px;/*no*/
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
            justify-content: flex-start;
            .flexRow{
              margin-left: 15px;/*no*/
            }
            .batchWater{
              background: #00C17A;
              border-radius: 0;
              box-shadow: none;
              &:last-child{
                background: #006DB8;
              }
            }
          }
          .buildingInfo{
            padding-bottom: 0;
            >div{
              .icon{
                width: 56px;/*no*/
                height: 56px;/*no*/
                border-radius: 0;
                background: linear-gradient(141deg, rgba(3, 3, 52, 0.2) 0%, rgba(75, 117, 255, 0.2) 100%);
                margin-right: 20px;/*no*/
                i{
                  font-size: 36px;/*no*/
                  background-image: -webkit-linear-gradient(-45deg, #FFFFFF 20%, #C097FF 60%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                }
              }
              .info{
                span{
                  font-size: 28px;/*no*/
                  font-family: DINAlternate-Bold, DINAlternate;
                  font-weight: bold;
                  color: #FFFFFF;
                  &:last-child{
                    font-size: 14px;/*no*/
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #FFFFFF;
                  }
                }
              }
              &:nth-of-type(2n) {
                i{
                  background-image: -webkit-linear-gradient(-45deg, #EAFFFC 20%, #2EF7FF 60%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                }
              }
            }
          }
        }
        .buildingSearch{
          background: transparent;
          padding-left: 30px;/*no*/
          // border-left: 4px solid #0094E4;/*no*/
          position: relative;
          &::before{
            content: '';
            width: 4px;/*no*/
            height: 30px;/*no*/
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            background: #0094E4;
          }
          /deep/#searchForm{
            input{
              background: #012F5D;
              border: 1px solid #1577D6;/*no*/
            }
            .el-form-item__label, .el-radio__label{
              color: #fff !important;
            }
            .el-radio-group{
              .el-radio{
                margin-left:0;
                margin-bottom: 3px;/*no*/
                .el-radio__input{
                  .el-radio__inner{
                    width: 12px;/*no*/
                    height: 12px;/*no*/
                    border-color: #FFFFFF;
                    background: transparent;
                  }
                }
                &.is-checked{
                  .el-radio__inner{
                    border-color: #1890ff;
                    &::after{
                      background: #1890ff;
                    }
                  }
                }
              }
            }
            .btnInfo{
              button {
                padding: 6px 20px;/*no*/
                display: flex;
                align-items: center;
                justify-content: center;
                span{
                  color: #FFFFFF;
                }
              }
              .submitBtn{
                background: #03ACFF;
              }
              .resetBtn{
                background: #26468B !important;
                border: 1px solid #6AA4FF;/*no*/
              }
            }
          }
        }
        .buildingData{
          .el-col{
            .content{
              background: linear-gradient(180deg, #00326C 0%, rgba(8, 50, 107, 0.9) 100%);
              border: 1px solid;
              border-image: linear-gradient(136deg, rgba(9, 194, 241, 0.3), rgba(31, 134, 236, 0.46)) 1 1;
                  box-shadow: none;
              .header{
                color: #FFFFFF;
                .el-switch{

                }
              }
              .body{
                .icon{
                  width: 66px;
                  height: 66px;
                  background: linear-gradient(141deg, #12DCAD 0%, #297EFF 100%);
                  box-shadow: 0px 0px 11px 0px rgba(67, 236, 241, 0.62);
                  border-radius: 100px;
                  box-shadow: none;
                  i{
                    font-size: 35px;
                  }
                }
                .number{
                  font-size: 24px;
                  font-family: DINAlternate-Bold, DINAlternate;
                  font-weight: bold;
                  color: #FFFFFF;
                }
                .currentText{
                  font-size: 12px;/*no*/
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #FFFFFF;
                }
              }
            }
          }
        }
        .el-pagination{
          .el-pagination__total{
            color: #fff;
          }
          button{
            background: transparent;
            color: #fff;
          }
          .el-pager{
            li{
              background: transparent;
            }
          }
        }
      }
      .deviceContainer{
        .timeContainer{
          background: transparent;
          .deviceTitle{
            color: #fff;
          }
          .deviceContralItem{
            background: linear-gradient(180deg, #00326C 0%, rgba(8, 50, 107, 0.9) 100%);
            border: 1px solid;/*no*/
            border-image: linear-gradient(136deg, rgba(9, 194, 241, 0.3), rgba(31, 134, 236, 0.46)) 1 1;
            .title{
              color: #fff;
              background: transparent;
            }
            .body{
              label, .el-form-item__content, .el-slider__marks .el-slider__marks-text {
                color: #fff;
              }
            }
          }
        }
        .btnList{
          background: transparent;
        }
      }
    }
  }
  &.mainContent {
    .timeMonitoringSelect .deviceContainer .timeContainer {
      .itemContent {
        .linkButton {
          i {color: #fff;}
        }
        .itemMain{
          .item {
            background: #ffffff;
            max-width: 360px;
            // background: linear-gradient(270deg, rgba(34, 36, 77, 0.5) 0%, rgba(23, 43, 99, 0.5) 50%, rgba(35, 35, 74, 0.5) 100%);
            .charge_car_title {
              color: #393939;
            }
            #formItemText .el-form-item .el-form-item__content {
                color: #393939;
            }
          }
          &:nth-of-type(2n) .item .charge_car_title {
            color: #393939;
          }
        }
        
      }
      // 后台管理
      .imgContent{
          width: auto;
          height: 100%;
          position: absolute;
          top: 50%;
          right: 46%;
          bottom: 0;
          // padding-right: 80px;/*no*/
          // transform: translateY(-50%);
        >img{
          &.lampPost{
            width: auto;
            height: 100%;
          }
          &.lampLight{
            position: absolute;
            left: 45%;
            top: 5%;
            transform: translateX(-132%);
            width: 64%;
            height: auto;
          }
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

