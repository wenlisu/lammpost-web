<template>
  <div id="superviseTimeMonitoring">
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
            placeholder="请输入监测器的名称"
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
                    color: '#FFB14F',
                    name: '上限预警',
                    width: '6px',
                    height: '6px'
                }, {
                    color: '#FF3C30',
                    name: '超上限',
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
            <span>{{buildingInfo.name}}</span>
            <el-button type="primary" @click="setFaValue()">
            设置阀值</el-button>
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
                <i class="iconfont icon-zhengchang" />
              </div>
              <div class="flexCloumn info">
                <span>{{buildingInfo.info.onlineCount || 0}}</span>
                <span>在线</span>
              </div>
            </div>
            <div>
              <div class="icon">
                <i class="iconfont icon-baojing" />
              </div>
              <div class="flexCloumn info">
                <span>{{buildingInfo.info.alarmCount}}</span>
                <span>预警</span>
              </div>
            </div>
            <div>
              <div class="icon">
                <i class="iconfont icon-guzhang" />
              </div>
              <div class="flexCloumn info">
                <span>{{buildingInfo.info.offlineCount || 0}}</span>
                <span>报警</span>
              </div>
            </div>
            <div>
              <div class="icon">
                <i class="iconfont icon-yujing" />
              </div>
              <div class="flexCloumn info">
                <span>{{buildingInfo.info.offlineCount || 0}}</span>
                <span>离线</span>
              </div>
            </div>
          </div>
        </div>
        <el-tabs v-model="activeBuildingTabsName" type="card" @tab-click="handleBuildingTabClick">
          <el-tab-pane
            label="设备列表"
            name="1"
            lazy
          >
            <span slot="label"><i class="iconfont icon-chanpinxinxi"></i> 设备列表</span>
            <div>
              <div class="flexCloumn buildingSearch">
                <search-form
                  :searchItems="buildingInfo.searchItems"
                  @onSearch="onBuildingSearch"
                />
              </div>
              <el-row :gutter="10" class="buildingData">
                <el-col
                  :span="6"
                  v-for="item in buildingInfo.tableData"
                  :key="item.floorName"
                >
                  <div class="flexCloumn content" @click="() => handleCurrentBuilding(item)">
                    <div class="flexRow header">
                      <div class="flexCenter icon">
                        <i class="iconfont icon-dianji"/>
                      </div>
                      {{item.floorName}}监测器
                    </div>
                    <div class="flexRow body">
                      <div class="flexCloumn flexCenter info">
                        <span class="value">{{item.temperatureValue}}</span>
                        <span class="title">温度</span>
                      </div>
                      <div class="flexCloumn flexCenter info">
                        <span class="value">{{item.humidityValue}}</span>
                        <span class="title">湿度</span>
                      </div>
                      <div class="flexCloumn flexCenter info">
                        <span class="value">{{item.noiseValue}}</span>
                        <span class="title">噪声</span>
                      </div>
                    </div>
                    <div class="flexRow body">
                      <div class="flexCloumn flexCenter info">
                        <span class="value">{{item.pmValue}}</span>
                        <span class="title">PM2.5</span>
                      </div>
                      <div class="flexCloumn flexCenter info">
                        <span class="value">{{item.pmTenValue}}</span>
                        <span class="title">PM10</span>
                      </div>
                      <div class="flexCloumn flexCenter info"></div>
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
          </el-tab-pane>
          <el-tab-pane
            label="报警事件"
            name="2"
            lazy
          >
            <span slot="label"><i class="iconfont icon-chanpinxinxi"></i> 报警事件</span>
            <div>
            <page-table
              col-align="center"
              :operator="false"
              :selection="false"
              :data="buildingInfo.table.tableData"
              :cols="buildingInfo.table.tableCols"
              :page-current="buildingInfo.table.page.current"
              :total="buildingInfo.table.page.total"
              :page-size="buildingInfo.table.page.pageSize"
              @current-change="onBuildingTableCurrentChange"
              @size-change="onBuildingTablePageSizeChange"
            >
            </page-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="flexCloumn buildingId" v-if="monitorId === 'buildingId'">
        <el-button type="text" @click="monitorId = 'address'">返回</el-button>
        <span class="title">{{buildingId.info.deviceName}}近一小时实时曲线</span>
        <el-row :gutter="10">
          <el-col :span="12">
            <echartData id="buildingoption1" :userOptions="buildingId.option1" height="300px">
            </echartData>
          </el-col>
          <el-col :span="12">
            <echartData id="buildingoption2" :userOptions="buildingId.option2" height="300px">
            </echartData>
          </el-col>
          <el-col :span="24">
            <echartData id="buildingoption3" :userOptions="buildingId.option3" height="300px">
            </echartData>
          </el-col>
        </el-row>
      </div>
      <div class="flexCloumn normal" v-if="monitorId === 'normal'">
        <div class="flexRow normalHeader">
          <div class="flexRow flexCenter">
            <span class="normalTitle">{{normalInfo.name}}</span>
            <span class="normalStatus" :class="`normalStatus${normalInfo.statusType}`">{{normalInfo.statusText}}</span>
          </div>
        </div>
        <div class="flexCloumn baseInfoHeader">
          <FormItemText
            :layout="normalInfo.baseInfoItems"
            labelWidth="0px"
          >
          </FormItemText>
          <el-row :gutter="10" class="flexRow baseItems">
            <el-col
              v-for="item in normalInfo.baseInfoItemDoms"
              :key="item.id"
              class="item"
              :span="6"
            >
              <div class="flexRow content">
                <div class="icon">
                  <i :class="`iconfont ${item.icon}`"/>
                </div>
                <div class="flexCloumn baseInfo">
                  <div class="name">{{item.name}}</div>
                  <div
                  class="value"
                  :class="item.alarm"
                >
                  {{item.value}}{{item.unit}}
                </div>
                </div>
                <div class="maxInfo">
                  <div class="fa">报警范围  <span v-if="item.thresholdValue">{{item.thresholdValue}}</span></div>
                  <div class="maxValue">当日最大值  <span v-if="item.maxValue">{{item.maxValue}}</span></div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="waterTrends">
          <span class="title">{{normalInfo.info.deviceNam}}近一小时实时曲线</span>
          <el-row :gutter="10">
            <el-col :span="12">
              <echartData id="normaloption1" :userOptions="buildingId.option1" height="300px">
              </echartData>
            </el-col>
            <el-col :span="12">
              <echartData id="normaloption2" :userOptions="buildingId.option2" height="300px">
              </echartData>
            </el-col>
            <el-col :span="24">
              <echartData id="normaloption3" :userOptions="buildingId.option3" height="300px">
              </echartData>
            </el-col>
          </el-row>
        </div>
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
        :formItems="addDialog.formItems"
        :rules="addDialog.formRules"
        :disabled="addDialog.inputDisabled"
        :isEdit="addDialog.isEdit"
        :form="addDialog.form"
        :midway="addDialog.midway"
        :labelWidth="'85px'"
      />
    </dialog-cont>
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
import searchForm from 'components/adminSearchForm/searchForm';
import FormItemText from '@/components/formItemText/formItemText';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import PageTable from '@/components/adminPage-table';
import PoleMap from '@/view/index/lightPoleMap/poleMap';
import echartData from '@/view/lightPole/lightPoleStatistical/components/echartData';
import dialogCont from '@/components/adminDialog';
import FormItem from '@/components/adminFormItem';
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
  getAmbientMonitoringRunStatus,
  getLastAmbientReportDataForPage,
  getAmbientMonitoringDeviceDtl,
  getAmbientMonitoringAlarmCount,
  getAmbientMonitoringTrendStat,
  saveAmbientMonitoringThreshold
} from 'api/supervise';
import {
  getWaterMeterSiteTree,
  getWaterMeterCurrentStatus,
  getWaterMeterDeviceForPage
} from 'api/water';
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
  name: 'superviseTimeMonitoring',
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
    dialogCont,
    FormItem
  },
  data () {
    return {
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
      activeBuildingTabsName: '1',
      activetLoorTabsName: '1',
      activetNormalTabsName: '2',
      monitorId: undefined,
      buildingInfo: {
        switch: false,
        name: 'A区A1栋大厦烟感设备状态',
        info: {
          totalCount: 0,
          onlineCount: 0,
          alarmCount: 0,
          offlineCount: 0,
          warningCount: 0
        },
        searchItems: [{
          type: 'input',
          label: '设备名称',
          labelWidth: '60px',
          props: {
            fieldName: 'deviceName'
          }
        }, {
          type: 'radio',
          label: '设备状态',
          labelWidth: '80px',
          props: {
            fieldName: 'deviceStatus',
            options: [{
              id: '',
              name: '全部'
            }, {
              id: '1',
              name: '在线'
            }, {
              id: '3',
              name: '预警'
            }, {
              id: '4',
              name: '报警'
            }, {
              id: '2',
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
        tableData: [],
        table: {
          page: {
            current: 1,
            pageSize: 10,
            total: 0
          },
          tableData: [],
          tableCols: [
            { label: '设备名称', prop: 'deviceName' },
            { label: '报警类型', prop: 'alarmTypeText' },
            { label: '报警内容', prop: 'calUserTel', minWidth: '150px' },
            { label: '报警值', prop: 'alarmValue' },
            { label: '报警范围', prop: 'finishedTime' },
            { label: '记录时间', prop: 'waitingTimeLen' },
            { label: '处理状态', prop: 'alarmHandleStatusText' }
          ]
        }
      },
      buildingId: {
        info: {},
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
        }
      },
      normalInfo: {
        switch: false,
        name: '智慧水表001',
        statusText: '在线',
        statusType: 1,
        info: {},
        baseInfoItems: [{
          id: 'imei',
          label: 'IMEI',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'address',
          label: '安装位置',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'lastReportDate',
          label: '最后上报时间',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'longitude',
          label: '经度',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'latitude',
          label: '纬度',
          value: '',
          unit: '',
          span: 8
        }],
        baseInfoItemDoms: [{
          id: 'b',
          name: '温度',
          value: '',
          thresholdValue: '',
          maxValue: '',
          icon: 'icon-wendu',
          unit: '℃'
        }, {
          id: 'c',
          name: '湿度',
          value: '',
          thresholdValue: '',
          maxValue: '',
          icon: 'icon-shidu',
          unit: '%'
        }, {
          id: 'd',
          name: '噪声',
          value: '',
          thresholdValue: '',
          maxValue: '',
          icon: 'icon-shidu',
          unit: '%'
        }, {
          id: 'e',
          name: 'PM2.5',
          value: '',
          thresholdValue: '',
          maxValue: '',
          icon: 'icon-shidu',
          unit: '%'
        }, {
          id: 'f',
          name: 'PM10',
          value: '',
          thresholdValue: '',
          maxValue: '',
          icon: 'icon-shidu',
          unit: '%'
        }],
        addressInfoItemDoms: [{
          id: 'a',
          name: '抄表度数',
          value: '',
          unit: '',
          icon: 'dianji',
          iconImage: '-webkit-linear-gradient(-45deg, #E66A0B 20%, #FFAB13 60%)',
          background: 'linear-gradient(135deg, #FFD56E 0%, #FFA133 100%)',
          boxShadow: '0px 2px 4px 0px rgba(255,231,170,1)'
        }, {
          id: 'b',
          name: '用水量',
          value: '',
          unit: 'm³',
          icon: 'dianji',
          iconImage: '-webkit-linear-gradient(-45deg, #8AB332 20%, #7BE370 60%)',
          background: 'linear-gradient(135deg, #9DE66A 0%, #55C444 100%)',
          boxShadow: '0px 2px 4px 0px rgba(200,236,177,1);'
        }, {
          id: 'c',
          name: '水费单价-阶梯水价',
          value: '',
          unit: '元/m³',
          icon: 'dianji',
          iconImage: '-webkit-linear-gradient(-45deg, #32A9F2 20%, #63D8FF 60%)',
          background: 'linear-gradient(135deg, #6BCCFF 0%, #1D9CED 100%)',
          boxShadow: '0px 2px 4px 0px rgba(170,219,255,1);'
        }]
      },
      currentNodeKey: undefined,
      addDialog: {
        show: false,
        item: null,
        title: '全部环境监测器阀值设置',
        inputDisabled: false,
        isEdit: true,
        form: {
          temperatureLowThreshold: undefined,
          temperatureMaxThreshold: undefined,
          humidityLowThreshold: undefined,
          humidityMaxThreshold: undefined,
          noiseLowThreshold: undefined,
          noiseMaxThreshold: undefined,
          pmLowThreshold: undefined,
          pmMaxThreshold: undefined,
          pmTenLowThreshold: undefined,
          pmTenMaxThreshold: undefined
        },
        formItems: [{
          label: '温度下限',
          prop: 'temperatureLowThreshold',
          inputType: 'input',
          required: true,
          span: 12
        }, {
          label: '温度上限',
          prop: 'temperatureMaxThreshold',
          inputType: 'input',
          required: true,
          span: 12
        }, {
          label: '湿度下限',
          prop: 'humidityLowThreshold',
          inputType: 'input',
          required: true,
          span: 12
        }, {
          label: '湿度上限',
          prop: 'humidityMaxThreshold',
          inputType: 'input',
          required: true,
          span: 12
        }, {
          label: '噪声下限',
          prop: 'noiseLowThreshold',
          inputType: 'input',
          required: true,
          span: 12
        }, {
          label: '噪声上限',
          prop: 'noiseMaxThreshold',
          inputType: 'input',
          required: true,
          span: 12
        }, {
          label: 'PM2.5下限',
          prop: 'pmLowThreshold',
          inputType: 'input',
          required: true,
          span: 12
        }, {
          label: 'PM2.5上限',
          prop: 'pmMaxThreshold',
          inputType: 'input',
          required: true,
          span: 12
        }, {
          label: 'PM10下限',
          prop: 'pmTenLowThreshold',
          inputType: 'input',
          required: true,
          span: 12
        }, {
          label: 'PM10上限',
          prop: 'pmTenMaxThreshold',
          inputType: 'input',
          required: true,
          span: 12
        }],
        formRules: {
        },
        midway: true
      }
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
    initData () {
      const query = this.$route.query;
      if (query.activeNumber) {
        const parames = this.common['superviseTimeMonitoring'];
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
    setFaValue () {
      this.addDialog.show = true;
    },
    searchTree () {
      this.$refs.tree.filter({val: this.filterText, type: 'label'});
    },
    filterNode (value, data) {
      if (!value.val) return true;
      return data[value.type] && data[value.type].indexOf(value.val) !== -1;
    },
    async loadNode (node, resolve) {
      if (node.level === 0) {
        const tree0 = await this._getTerminalTree({
          'address': '',
          'area': '',
          'city': '',
          'imei': ''
        }, 'city', 'city', 'city', resolve);
        this.treeExpandKeys = [tree0[0].id];
      }
      if (node.level === 1) {
        const tree1 = await this._getTerminalTree({
          city: node.data.city,
          cityCode: node.data.cityCode
        }, 'area', 'area', 'area', resolve);
        this.treeExpandKeys = [ ...this.treeExpandKeys, tree1[0].id ];
      }
      if (node.level === 2) {
        const tree1 = await this._getTerminalTree({
          city: node.data.city,
          area: node.data.area,
          cityCode: node.data.cityCode,
          areaCode: node.data.areaCode
        }, 'address', 'address', 'address', resolve);
        this.treeExpandKeys = [ ...this.treeExpandKeys, tree1[0].id ];
      }
      if (node.level === 3) {
        const tree2 = await this._getTerminalTree({
          city: node.data.city,
          area: node.data.area,
          cityCode: node.data.cityCode,
          areaCode: node.data.areaCode,
          address: node.data.address
        }, 'imei', 'terminalName', 'imei', resolve);
        this.treeExpandKeys = [ ...this.treeExpandKeys, tree2[0].id ];
      }
      if (node.level === 4) {
        getTerminalTree({
          city: node.data.city,
          area: node.data.area,
          cityCode: node.data.cityCode,
          areaCode: node.data.areaCode,
          address: node.data.address,
          imei: node.data.imei,
          deviceTypeNo: 'AMBIENT'
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
            this.treeExpandKeys = [ ...this.treeExpandKeys, treeData[0].id ];
            this.$refs.tree.setCheckedKeys([treeData[0].id]);
            this.nodeClick({
              ...treeData[0],
              type: 'device',
              id: treeData[0].serialNumber
            });
          }
        })
      }
      if (node.level === 5) {
        resolve([])
      }
    },
    async _getTerminalTree (data, id, label, type, resolve) {
      let treeData = [];
      await getTerminalTree({
        ...data,
        deviceTypeNo: 'AMBIENT'
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
    nodeClick (data) {
      this.monitorId = data.type;
      this.currentNodeKey = data.id;
      if (data.id && data.type === 'address') {
        this.buildingInfo.name = `${data.address}`;
        getAmbientMonitoringRunStatus().then(res => {
          if (res.code === '200') {
            console.log('resss', res)
            this.buildingInfo.info = res.data;
          }
        });
        this.buildingInfo.searchVal = {
          installAddress: data.address
        };
        this.onBuildingCurrentChange(1);
        this.onBuildingTableCurrentChange(1);
      }
      if (data.id && data.type === 'device') {
        this._getTypeDel(data);
      }
    },
    _getTypeDel (data) {
      this._getSmokeDetectorDeviceDtl(data, 'normal');
      this.getTrendChart(data);
    },
    handleCurrentBuilding (item) {
      this.getTrendChart(item);
      this.monitorId = 'buildingId';
      this.buildingId.info = item;
    },
    getTrendChart (data) {
      this._getAmbientMonitoringTrendStat({
        dateInterval: 8,
        deviceName: data.deviceName,
        deviceNo: data.deviceNo,
        serialNumber: data.serialNumber,
        installAddress: data.installAddress
      }, true, true, true);
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
    async init1 (data) {
      const chartOptions = await this.getChartOptions();
      this.buildingId.option1.options = {
        grid: {
          ...chartOptions.grid
        },
        tooltip: {
          ...chartOptions.tooltip,
          formatter: '{b0}<br />{a0}: {c0}℃<br />{a1}：{c1}%'
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
      this.buildingId.option2.options = {
        grid: {
          ...chartOptions.grid
        },
        tooltip: {
          ...chartOptions.tooltip,
          formatter: '{b0}<br />{a0}: {c0}分贝'
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
            name: '噪声',
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
      this.buildingId.option3.options = {
        grid: {
          ...chartOptions.grid
        },
        tooltip: {
          ...chartOptions.tooltip,
          formatter: '{b0}<br />{a0}: {c0}ug/m³<br />{a1}：{c1}ug/m³'
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
    },
    getAlarmColor (status) {
      return status === 1 ? 'orang' : (status === 2 ? 'warn' : '');
    },
    _getSmokeDetectorDeviceDtl (item, type) {
      this.monitorId = type;
      let statusText;
      let statusType;
      getAmbientMonitoringDeviceDtl(item.serialNumber).then(async res => {
        if (res.code === '200') {
          const data = res.data;
          if (data.onlineStatus !== 1) {
            statusText = data.onlineStatusText
            statusType = '2';
            if (data.onlineStatus === 3) {
              statusType = '3';
            }
          } else {
            statusText = data.alarmStatusText;
            statusType = '2';
            if (data.alarmStatus === 0) {
              statusType = '1';
            }
          }
          this.normalInfo.info = data;
          this.normalInfo.name = data.deviceName;
          this.normalInfo.statusText = statusText;
          this.normalInfo.statusType = statusType;
          const baseInfoItems = await this.$_setItem(this.normalInfo.baseInfoItems, data);
          this.normalInfo.baseInfoItems = baseInfoItems;
          this.normalInfo.baseInfoItemDoms = [{
            id: 'b',
            name: '温度',
            value: data.temperatureValue || 0,
            thresholdValue: `${data.temperatureLowThreshold || 0}~${data.temperatureMaxThreshold || 0}`,
            maxValue: data.maxTemperatureValue || 0,
            alarm: this.getAlarmColor(data.temperatureAlarm),
            icon: 'icon-wendu',
            unit: '℃'
          }, {
            id: 'c',
            name: '湿度',
            value: data.humidityValue || 0,
            thresholdValue: `${data.humidityLowThreshold || 0}~${data.humidityMaxThreshold || 0}`,
            maxValue: data.maxHumidityValue || 0,
            minValue: data.minHumidityValue || 0,
            alarm: this.getAlarmColor(data.humidityAlarm),
            icon: 'icon-shidu',
            unit: '%'
          }, {
            id: 'd',
            name: '噪声',
            value: data.noiseValue || 0,
            thresholdValue: `${data.noiseLowThreshold || 0}~${data.noiseMaxThreshold || 0}`,
            maxValue: data.maxNoiseValue || 0,
            minValue: data.minNoiseValue,
            alarm: this.getAlarmColor(data.noiseAlarm),
            icon: 'icon-shidu',
            unit: '分贝'
          }, {
            id: 'e',
            name: 'PM2.5',
            value: data.pmValue || 0,
            thresholdValue: `${data.pmLowThreshold || 0}~${data.pmMaxThreshold || 0}`,
            maxValue: data.maxPmValue || 0,
            minValue: data.minPmValue || 0,
            alarm: this.getAlarmColor(data.pmAlarm),
            icon: 'icon-shidu',
            unit: 'ug/m³'
          }, {
            id: 'f',
            name: 'PM10',
            value: data.pmTenValue || 0,
            thresholdValue: `${data.pmTenLowThreshold || 0}~${data.pmTenMaxThreshold || 0}`,
            maxValue: data.maxPmTenValue || 0,
            minValue: data.minPmTenValue || 0,
            alarm: this.getAlarmColor(data.pmTenAlarm),
            icon: 'icon-shidu',
            unit: 'ug/m³'
          }];
        }
      });
    },
    handleBuildingTabClick (e) {

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
          formatter: '{b0}<br />{a0}: {c0}<br />{a1}：{c1}'
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
    onBuildingSearch (val) {
      this.buildingInfo.searchVal = {
        ...val
      };
      this.onBuildingCurrentChange(1);
    },
    getBuildingDataAllList () {
      let parames = {
        data: {
          ...this.buildingInfo.searchVal
        },
        pageNo: Number(this.buildingInfo.page.current), // 查询的分页页码
        pageSize: Number(this.buildingInfo.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getLastAmbientReportDataForPage(parames).then(res => {
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
    // 分页切换页面
    onBuildingCurrentChange (val) {
      this.buildingInfo.page.current = val;
      this.getBuildingDataAllList()
    },
    onBuildingPageSizeChange (val) {
      this.buildingInfo.page.pageSize = val
      this.onBuildingCurrentChange(1)
    },
    getBuildingTableDataAllList () {
      let data = {
        data: {
          ...this.buildingInfo.table.searchVal
        },
        pageNo: Number(this.buildingInfo.table.page.current), // 查询的分页页码
        pageSize: Number(this.buildingInfo.table.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getAmbientMonitoringAlarmCount(data).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.buildingInfo.table.page.total = total;
          this.buildingInfo.table.tableData = data;
        }
      })
    },
    // 分页报警事件列表切换页面
    onBuildingTableCurrentChange (val) {
      this.buildingInfo.table.page.current = val;
      this.getBuildingTableDataAllList()
    },
    onBuildingTablePageSizeChange (val) {
      this.buildingInfo.table.page.pageSize = val
      this.onBuildingTableCurrentChange(1)
    },
    dialogAddCancel () {
      this.addDialog.show = false;
      this.$refs.formItem.resetForm();
      this.addDialog.inputDisabled = false;
      this.addDialog.isEdit = true;
      this.addDialog.item = null;
      this.addDialog.form = {
        temperatureLowThreshold: undefined,
        temperatureMaxThreshold: undefined,
        humidityLowThreshold: undefined,
        humidityMaxThreshold: undefined,
        noiseLowThreshold: undefined,
        noiseMaxThreshold: undefined,
        pmLowThreshold: undefined,
        pmMaxThreshold: undefined,
        pmTenLowThreshold: undefined,
        pmTenMaxThreshold: undefined
      };
    },
    async dialogAddSubmit (val) {
      const formData = await this.$refs.formItem.getValue();
      const parames = {
        temperatureLowThreshold: +formData.temperatureLowThreshold,
        temperatureMaxThreshold: +formData.temperatureMaxThreshold,
        humidityLowThreshold: +formData.humidityLowThreshold,
        humidityMaxThreshold: +formData.humidityMaxThreshold,
        noiseLowThreshold: +formData.noiseLowThreshold,
        noiseMaxThreshold: +formData.noiseMaxThreshold,
        pmLowThreshold: +formData.pmLowThreshold,
        pmMaxThreshold: +formData.pmMaxThreshold,
        pmTenLowThreshold: +formData.pmTenLowThreshold,
        pmTenMaxThreshold: +formData.pmTenMaxThreshold
      };
      if (this.addDialog.item) {
        parames.address = this.addDialog.item.address;
        parames.area = this.addDialog.item.area;
        parames.city = this.addDialog.item.city;
        parames.serialNumberList = [this.addDialog.item.serialNumber];
      } else {
        parames.serialNumberList = [...this.selectsList]
      }
      saveAmbientMonitoringThreshold(parames).then(res => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '设置成功',
            type: 'success',
            position: 'bottom-right'
          });
          this.dialogCancel();
          this.getDataAllList();
        }
      });
    }
  }
};
</script>
<style lang="less">
#superviseTimeMonitoring{
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
            // background: #6275bf;
          }
          i{
            font-size: 16px;/*no*/
            color: #4A80F5;
          }
        }
      }
      .infoTree{
        height: calc(100% - 61px);/*no*/
        padding:10px 0 20px;/*no*/
        // background: transparent;
        .el-tree{
          height: 100%;
          overflow: auto;
          // background: transparent;
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
        background:#fff;
      }
      .buildingName{
        justify-content: space-between;
        >span{
          font-size: 16px;/*no*/
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #000;
          align-items: center;
          justify-content: space-between;
        }
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
      .buildingInfo{
        padding: 20px 0px 0px;/*no*/
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
              color: #FFF;
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
      .el-tabs {
        height: 100%;
        margin-top: 10px;/*no*/
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
          // padding: 10px;/*no*/
          // background: #fff;
          position: relative;
          overflow:visible;
          >div.el-tab-pane{
            height: 100%;
          }
        }
      }
      .comp-page-table{
        margin-top: 10px;/*no*/
      }
      .buildingSearch{
        position: relative;
        margin: 0px 0 10px;/*no*/
        background: #fff;
        padding: 20px 20px 10px;
        &::before{
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 4px;
          background: #2b7ef2;
          border-radius: 1px;
        }
      }
      .buildingData{
        .el-col{
          margin-bottom: 10px;/*no*/
          .content{
            width: 100%;
            padding: 14px;/*no*/
            background: linear-gradient(180deg, #FFFFFF 0%, #F6FAFF  100%);
            box-shadow: 0px 2px 6px 0px rgba(218,218,218,1);/*no*/
            cursor: pointer;
            .header{
              font-size: 14px;/*no*/
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #404040;
              align-items: center;
              .icon{
                width: 20px;/*no*/
                height: 20px;/*no*/
                background: linear-gradient(135deg, #0E80D4 0%, #3C7EFF 100%);
                box-shadow: 0px 2px 4px 0px  rgba(211,231,255,1);/*no*/
                border-radius: 100px;/*no*/
                margin-right: 5px;/*no*/
                i{
                  font-size: 9px;/*no*/
                  color: #fff;
                }
              }
            }
            .body{
              padding-top: 20px;/*no*/
              .info{
                flex: 1;
                .value{
                  font-size: 26px;
                  font-family: DINAlternate-Bold, DINAlternate;
                  font-weight: bold;
                  color: #313131;
                  margin-bottom: 6px;/*no*/
                  .unit{
                    font-size: 14px;
                  }
                  &.warm{
                    color: #FF553E;
                  }
                }
                .title{
                  font-size: 12px;/*no*/
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #3B3B3B;
                }
              }
            }
            .status{
              width: fit-content;
              font-size: 12px;/*no*/
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #595959;
              border: 1px solid #08C57E;/*no*/
              padding-right: 6px;/*no*/
              .icon{
                width: 17px;/*no*/
                height: 17px;/*no*/
                background: linear-gradient(135deg, #26C3A2 0%, #00C574 100%);
                box-shadow: 0px 2px 4px 0px rgba(103,208,140,0.5);/*no*/
                border-radius: 2px;/*no*/
                margin-right: 5px;/*no*/
                i{
                  font-size: 10px;/*no*/
                  color: #fff;
                }
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
    .buildingId{
      .title{
        background:#fff;
        padding: 20px;/*no*/
        display: block;
        font-size: 16px;/*no*/
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #393939;
      }
      button{
       display: flex;
      }
      .cardLabers > div{
        color: #3D3D3D;
      }
    }
    .normal{
      .normalHeader{
        padding: 20px;/*no*/
        background: #fff;
        align-items: center;
        justify-content: space-between;
        .normalTitle{
          font-size: 16px;/*no*/
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #393939;
          margin-right: 10px;/*no*/
        }
        .normalStatus{
          color: #fff;
          padding: 5px 11px;/*no*/
          font-size: 12px;/*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 1;
          &.normalStatus3{
            background: #A6A6A6;
          }
                    &.normalStatus1{
            background:linear-gradient(135deg, #2FCE7D 0%, #22B58E 100%);
          }
                    &.normalStatus2{
            background: linear-gradient(135deg, #FD7C22 0%, #F46600 100%);
          }
        }
      }
      .baseInfoHeader{
        background: #fff;
        padding: 0 20px 20px;/*no*/
        .baseItems{
          margin-top: 10px;/*no*/
          flex-wrap: wrap;
          .item{
            width: 33.3%;
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
                  font-size: 28px;/*no*/
                  background-image: -webkit-linear-gradient(-45deg, #63A0EC 20%, #3366D4 60%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                }
              }
              .baseInfo{
                flex: 1;
                justify-content: space-between;
                .name{
                  font-size: 14px;/*no*/
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #5D5D5D;
                }
                .value {
                  font-size: 18px;/*no*/
                  font-family: DINAlternate-Bold, DINAlternate;
                  font-weight: bold;
                  color: #1C71C7;
                  &.orang{
                    color:#FF720D;
                  }
                  &.warn{
                    color:#FF3C30;
                  }
                }
              }
              .maxInfo{
                justify-content: flex-end;
                align-self: flex-end;
                span{
                  font-size: 14px;
                  // font-family: DINAlternate-Bold, DINAlternate;
                  // font-weight: bold;
                  color: #FF720D;
                  margin-left: 6px;/*no*/
                }
                .fa{
                  font-size: 12px;/*no*/
                  // font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #5D5D5D;
                  margin-bottom: 6px;
                }
                .maxValue{
                  font-size: 12px;/*no*/
                  // font-family: PingFangSC-Regular, PingFang SC;
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
              .content{
                border-right: none;
              }
              .icon{
                background: #E9F3FF;
                i{
                  background-image: -webkit-linear-gradient(-45deg, #37D9F5 20%, #00ADDA  60%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                }
              }
            }
            &:nth-of-type(4){
              margin-top: 10px;/*no*/
            }
            &:last-child{
              margin-top: 10px;/*no*/
              .content{
                border-right: none;
              }
            }
          }
        }
      }
      .waterTrends{
        margin-top: 10px;/*no*/
        .title{
          background:#fff;
          padding: 20px;/*no*/
          display: block;
          font-size: 16px;/*no*/
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #393939;
        }
        .cardLabers > div{
            color: #3D3D3D;
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

