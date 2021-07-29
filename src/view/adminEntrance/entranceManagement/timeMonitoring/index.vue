<template>
  <div id="entranceManagement">
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
              placeholder="请输入门禁的名称"
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
            :default-expand-all="false"
            :default-expanded-keys="treeExpandKeys"
            :filter-node-method="filterNode"
            :load="loadNode"
            @node-click="nodeClick"
            lazy
            ref="tree"
            :check-on-click-node="true"
            :auto-expand-parent="true"
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
                      name: '预警',
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
      <div class="flexCloumn loor" v-if="monitorId === 'building'">
        <div class="flexRow loorName">
          {{floorInfo.name}}
          <div class="flexRow">
            一键开关：
            <el-switch
              v-model="floorInfo.switch"
              :width="34"
              active-color="#12BD69"
              inactive-color="#e0e0e0">
            </el-switch>
          </div>
          <!-- <span>紧急控制</span> -->
        </div>
        <div class="flexRow loorInfo">
          <div>
            <div class="icon">
              <i class="iconfont icon-zongshu" />
            </div>
            <div class="flexCloumn info">
              <span>{{floorInfo.info.totalCount || 0}}</span>
              <span>总数</span>
            </div>
          </div>
          <div>
            <div class="icon">
              <i class="iconfont icon-kaiqi" />
            </div>
            <div class="flexCloumn info">
              <span>{{floorInfo.info.normalCount || 0}}</span>
              <span>在线</span>
            </div>
          </div>
          <div>
            <div class="icon">
              <i class="iconfont icon-guanbi" />
            </div>
            <div class="flexCloumn info">
              <span>{{floorInfo.info.offlineCount}}</span>
              <span>离线</span>
            </div>
          </div>
          <div>
            <div class="icon">
              <i class="iconfont icon-guzhang" />
            </div>
            <div class="flexCloumn info">
              <span>{{floorInfo.info.alarmCount}}</span>
              <span>预警</span>
            </div>
          </div>
        </div>
        <div class="flexCloumn loorDeviceList">
          <swiper class="swiper" ref="swiper" :options="floorInfo.swiperOption">
            <swiper-slide
              v-for="(item, index) in floorInfo.exInfo"
              :key="index"
            >
              <div class="content">
                <el-image
                style="width: 100%; height: 100%"
                :src="`${baseURL || config.baseURL.dev}/upload/${item.closeupPic || ''}`"
                fit="fill"></el-image>
                <span class="status">开</span>
                {{item}}
                <div class="name">东南门门禁口2</div>
              </div>
            </swiper-slide>
          </swiper>
          <div class="swiper-button-prev swiper-button-white"  @click="prev"></div>
          <div class="swiper-button-next swiper-button-white"  @click="next"></div>
        </div>
        <el-tabs v-model="activetLoorTabsName" type="card" @tab-click="handleLoorTabClick">
          <el-tab-pane
            label="出入记录"
            name="1"
            lazy
          >
            <span slot="label"><i class="iconfont icon-chanpinxinxi"></i> 出入记录</span>
            <div class="content">
              <search-form
                ref="alarmListSearchForm"
                :searchItems="orderList.searchItems"
                @onSearch="onOrderListSearch"
              >
              </search-form>
              <page-table
                col-align="center"
                :data="orderList.tableData"
                :cols="orderList.tableCols"
                :page-current="orderList.page.current"
                :total="orderList.page.total"
                :page-size="orderList.page.pageSize"
                @current-change="onOrderListCurrentChange"
                @size-change="onOrderListPageSizeChange"
                @row-current-change="onOrderListSelectionChange"
              >
                <template slot="originalPic" slot-scope="{ row }">
                  <el-popover
                    placement="right"
                    :title="row.personName"
                    trigger="hover">
                    <img :src="`${baseURL || config.baseURL.dev}/upload/${row.originalPic}`" style="max-width: 100%" />
                    <img :src="`${baseURL || config.baseURL.dev}/upload/${row.originalPic}`" slot="reference" style="max-width: 100%" />
                  </el-popover>
                </template>
                <template slot="closeupPic" slot-scope="{ row }">
                  <el-popover
                    placement="right"
                    :title="row.personName"
                    trigger="hover">
                    <img :src="`${baseURL || config.baseURL.dev}/upload/${row.closeupPic}`" style="max-width: 100%" />
                    <img :src="`${baseURL || config.baseURL.dev}/upload/${row.closeupPic}`" slot="reference" style="max-width: 100%" />
                  </el-popover>
                </template>
              </page-table>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="异常告警"
            name="2"
            lazy
          >
            <span slot="label"><i class="iconfont icon-guzhang"></i> 异常告警</span>
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
            label="操作日志"
            name="3"
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
      <div class="flexCloumn door" v-if="monitorId === 'device'">
        <div class="flexCloumn doorHeader">
          <div class="flexRow header">
            <span class="doorTitle">{{doorInfo.info.deviceName}}</span>
            <span class="doorStatus">{{doorInfo.info.doorStatusText}}</span>
          </div>
          <FormItemText
            :layout="doorInfo.baseInfoItems"
            labelWidth="0px"
          >
          <template v-slot:a>
            <el-switch
              v-model="doorInfo.switch"
              :width="34"
              active-color="#12BD69"
              inactive-color="#e0e0e0">
            </el-switch>
          </template>
          </FormItemText>
          <div class="flexRow doorInfo">
            <div>
              <div class="icon">
                <i class="iconfont icon-jinrirenliuliang" />
              </div>
              <div class="flexCloumn info">
                <span>{{doorInfo.info.todayFlow || 0}}</span>
                <span>今日人流量</span>
              </div>
            </div>
            <div>
              <div class="icon">
                <i class="iconfont icon-guzhang" />
              </div>
              <div class="flexCloumn info">
                <span>{{doorInfo.info.alarmCount || 0}}</span>
                <span>今日异常事件</span>
              </div>
            </div>
          </div>
        </div>
        <el-row :gutter="10" class="videoInfo">
          <el-col :span="15">
            <div class="content">
              <el-image
                style="width: 100%; height: 100%"
                :src="`${baseURL || config.baseURL.dev}/upload/${viderInfo.exInfo.length != 0 ? viderInfo.exInfo[0].closeupPic : undefined}`"
                fit="fill">
              </el-image>
              <div class="time">
               {{viderInfo.exInfo.length != 0 ? viderInfo.exInfo[0].createTime : ""}}
              </div>
              <div class="name">
                抓拍记录
              </div>
            </div>
          </el-col>
          <el-col :span="9">
            <card title="目标对比" :className="'adminCard adminCard1'">
              <div class="content">
                <div
                  class="flexRow item"
                  v-for="(item, index) in viderInfo.items"
                  :key="index"
                >
                  <div class="flexRow imgItem">
                    <img :src="`${baseURL || config.baseURL.dev}/upload/${item.closeupPic}`" v-if="item.closeupPic"/>
                    <el-image v-else>
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                    <div class="flexCloumn flexCenter vs">
                      <span>{{item.matchResult}}%</span>
                      <span>VS</span>
                    </div>
                    <img :src="`${baseURL || config.baseURL.dev}/upload/${item.matchPic}`" v-if="item.matchPic"/>
                    <el-image v-else>
                      <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                  </div>
                  <div class="infoItem">
                    <div class="flexRow infoHeader">
                      <div class="flexRow infoTitle">
                        <div class="icon">
                          <i class="iconfont icon-mingzi"/>
                        </div>
                        {{item.personName}}
                      </div>
                      <div class="flexRow infoDetail" v-if="item.visitorType !== -1" @click="infoDetail(item)">
                        详情
                        <div class="icon">
                          <i class="iconfont icon-xiangqing1" />
                        </div>
                      </div>
                    </div>
                    <div class="infoBottom">
                      <ul class="bottomText">
                        <li>{{item.createTime ? item.createTime : ''}}</li>
                      </ul>
                    </div>
                    <!-- <FormItemText
                      :layout="viderInfo.baseInfoItems"
                      labelWidth="0px"
                    >
                    </FormItemText> -->
                  </div>
                </div>
              </div>
            </card>
          </el-col>
        </el-row>
        <el-tabs v-model="activetLoorTabsName" type="card" @tab-click="handleLoorTabClick">
          <el-tab-pane
            label="出入记录"
            name="1"
            lazy
          >
            <span slot="label"><i class="iconfont icon-chanpinxinxi"></i> 出入记录</span>
            <div class="content">
              <search-form
                ref="alarmListSearchForm"
                :searchItems="orderList.searchItems"
                @onSearch="onOrderListSearch"
              >
              </search-form>
              <page-table
                col-align="center"
                :data="orderList.tableData"
                :cols="orderList.tableCols"
                :page-current="orderList.page.current"
                :total="orderList.page.total"
                :page-size="orderList.page.pageSize"
                @current-change="onOrderListCurrentChange"
                @size-change="onOrderListPageSizeChange"
                @row-current-change="onOrderListSelectionChange"
              >
                <template slot="matchPic" slot-scope="{ row }">
                  <el-popover
                    placement="right"
                    :title="row.personName"
                    trigger="hover">
                    <img :src="`${baseURL || config.baseURL.dev}/upload/${row.matchPic}`" style="max-width: 100%" />
                    <img :src="`${baseURL || config.baseURL.dev}/upload/${row.matchPic}`" slot="reference" style="max-width: 100%" />
                  </el-popover>
                </template>
                <template slot="closeupPic" slot-scope="{ row }">
                  <el-popover
                    placement="right"
                    :title="row.personName"
                    trigger="hover">
                    <img :src="`${baseURL || config.baseURL.dev}/upload/${row.closeupPic}`" style="max-width: 100%"/>
                    <img :src="`${baseURL || config.baseURL.dev}/upload/${row.closeupPic}`" slot="reference" style="max-width: 100%"/>
                  </el-popover>
                </template>
              </page-table>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="异常告警"
            name="2"
            lazy
          >
            <span slot="label"><i class="iconfont icon-guzhang"></i> 异常告警</span>
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
            label="操作日志"
            name="3"
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
import config, { baseURL } from '@/config';
import Flex from '@/components/flex';
import labers from '@/components/labers';
import searchForm from 'components/adminSearchForm/searchForm';
import FormItemText from '@/components/formItemText/formItemText';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import PageTable from '@/components/adminPage-table';
import PoleMap from '@/view/index/lightPoleMap/poleMap';
import echartData from '@/view/lightPole/lightPoleStatistical/components/echartData';
import { routePush } from '@/util/util';
import {
  getGroupPolicy,
  getLamp,
  getParkDeviceTree,
  getDoorAccessCloseUpPic,
  getDoorAccessInOutForPage,
  getDoorAccessDeviceDetails,
  getDoorAccessInOutRecordTop10
} from 'api/index';
import {
  getDeviceModuleTree,
  getDetailByID
} from 'api/admin';
import {
  getDoorAccessTree,
  getByFloor,
  doorAccessLogGetOrder,
  getDoorAccessCurrentStatus
} from 'api/entrance';

import 'swiper/swiper-bundle.css';
// import { delete } from 'vue/types/umd';

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
  name: 'entranceManagement',
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
    labers
  },
  data () {
    return {
      baseURL,
      config,
      treeExpandKeys: [],
      isDetail: false,
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
      floorInfo: {
        name: '10F各门禁状态',
        switch: false,
        info: {
          deviceCount: 0,
          normalCount: 0,
          alarmCount: 0,
          offlineCount: 0,
          warningCount: 0
        },
        swiperOption: {
          slidesPerView: 4,
          spaceBetween: 10,
          direction: 'horizontal',
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
          on: {
            resize: () => {
              this.$refs.swiper.$swiper.changeDirection(
                window.innerWidth <= 960
                  ? 'vertical'
                  : 'horizontal'
              )
            }
          }
        },
        exInfo: []
      },
      orderList: {
        show: false,
        searchVal: {},
        searchItems: [{
          type: 'dataPicker',
          label: '时间',
          labelWidth: '40px',
          props: {
            fieldName: 'dateInterval'
          }
        }, {
          type: 'input',
          label: '姓名',
          labelWidth: '60px',
          props: {
            fieldName: 'personName'
          }
        }, {
          type: 'input',
          label: '门禁',
          labelWidth: '60px',
          props: {
            fieldName: 'deviceName'
          }
        }, {
          type: 'select',
          label: '访客类型',
          labelWidth: '60px',
          props: {
            fieldName: 'visitorType',
            options: [{
              id: 1,
              name: '员工'
            }, {
              id: 2,
              name: '访客'
            }]
          }
        }, {
          type: 'select',
          label: '出入类型',
          labelWidth: '60px',
          props: {
            fieldName: 'inOutFlag',
            options: [{
              id: 1,
              name: '进门'
            }, {
              id: 0,
              name: '出门'
            }]
          }
        }],
        tableData: [],
        tableCols: [
          { label: '登记照片',
            prop: 'matchPic',
            custom: true
          },
          { label: '抓拍照片',
            prop: 'closeupPic',
            custom: true
          },
          { label: '门禁',
            prop: 'deviceModuleName',
            minWidth: '110px'
          },
          { label: '姓名',
            prop: 'personName'
          },
          { label: '手机号',
            prop: 'mobilePhone'
          },
          { label: '性别',
            prop: 'sexText'
          },
          { label: '身份证号',
            prop: 'identityNo'
          },
          { label: '访客类型',
            prop: 'visitorTypeText'
          },
          { label: '开门方式',
            prop: 'matchTypeText',
            // render: (h, scope) => {
            //   const types = {
            //     1: '刷脸',
            //     2: '刷卡'
            //   };
            //   return (
            //     <div>{types[scope.row.entrance]}</div>
            //   )
            // }
          },
          { label: '开门时间',
            prop: 'createTime',
            minWidth: '110px'
          },
          { label: '出入类型',
            prop: 'inOutFlagText'
          }
        ],
        page: {
          current: 1,
          pageSize: 10,
          total: 0
        }
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
          type: 'input',
          label: '访客姓名',
          labelWidth: '60px',
          props: {
            fieldName: 'deviceName'
          }
        }, {
          type: 'input',
          label: '门禁点',
          labelWidth: '60px',
          props: {
            fieldName: 'installAddress'
          }
        }, {
          type: 'select',
          label: '出入类型',
          labelWidth: '60px',
          props: {
            fieldName: 'onlineStatus',
            options: [{
              id: 1,
              name: '进门'
            }, {
              id: 2,
              name: '出门'
            }]
          }
        }, {
          type: 'select',
          label: '事件类型',
          labelWidth: '60px',
          props: {
            fieldName: 'alarmStatus',
            options: []
          }
        }],
        tableData: [],
        tableCols: [
          { label: '时间',
            prop: 'deviceName',
            minWidth: '110px'
          },
          { label: '访客姓名',
            prop: 'deviceTypeName'
          },
          { label: '人员编号',
            prop: 'serialNumber'
          },
          { label: '卡号',
            prop: 'installAddress'
          },
          { label: '门禁点',
            prop: 'longitude'
          },
          { label: '验证方式',
            prop: 'latitude'
          },
          { label: '出入类型',
            prop: 'onlineStatusText'
          },
          { label: '事件类型',
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
          type: 'input',
          label: '操作员',
          labelWidth: '60px',
          props: {
            fieldName: 'deviceName'
          }
        }, {
          type: 'input',
          label: '门禁点',
          labelWidth: '60px',
          props: {
            fieldName: 'alarmNo'
          }
        }, {
          type: 'select',
          label: '开关事件',
          labelWidth: '60px',
          props: {
            fieldName: 'alarmStatus',
            options: []
          }
        }],
        tableData: [],
        tableCols: [
          { label: '时间',
            prop: 'deviceName',
            minWidth: '110px'
          },
          { label: '操作员',
            prop: 'alarmName'
          },
          { label: '门禁编号',
            prop: 'alarmNo'
          },
          { label: '门禁点',
            prop: 'alarmTime'
          },
          { label: '控制模式',
            prop: 'clearTime'
          },
          { label: '开关事件',
            prop: 'clearUserName'
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
      doorInfo: {
        info: {},
        switch: false,
        baseInfoItems: [{
          id: 'serialNumber',
          label: 'IMEI',
          value: '',
          unit: '',
          span: 6
        }, {
          id: 'address',
          label: '安装位置',
          value: '',
          unit: '',
          span: 6
        }, {
          id: 'lastReportTime',
          label: '最后上报时间',
          value: '',
          unit: '',
          span: 6
        }, {
          id: 'a',
          label: '一键开关',
          custom: true,
          span: 6
        }]
      },
      viderInfo: {
        exInfo: [],
        items: [],
        baseInfoItems: [{
          id: 'createTime',
          label: '采访时间',
          value: '',
          unit: '',
          class: 'noBottom',
          span: 24
        }, {
          id: 'doorAccessSite',
          label: '门禁位置',
          value: '',
          unit: '',
          class: 'noBottom',
          span: 24
        }]
      }
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
  mounted () {
    this.$nextTick(() => {
      this.onOrderListCurrentChange(1)
    });
  },
  computed: {
    ...mapGetters(['common', 'openPage']),
    routeName () {
      return this.$route.name
    },
    swiper () {
      return this.$refs.swiper.$swiper
    }
  },
  methods: {
    infoDetail(item) {
      if(item.visitorType == 1) {
        this.$router.push({
          path: '/adminEntrance/entrancePersonnelManagement/entrancePersonalInformation',
          query: {personName: item.personName}
        })
      }
      if(item.visitorType == 2) {
        this.$router.push({
          path: '/adminEntrance/entrancePersonnelManagement/entrancePersonalInformation',
          query: {personName: item.personName}
        })
      }
      
    },
    _getDoorAccessInOutRecordTop10(serialNumber) {
      const params = {
        serialNumber: serialNumber
      }
      getDoorAccessInOutRecordTop10(params).then(res => {
        if(res.code == '200') {
          this.viderInfo.items = res.data;
        }
      })
    },
    _getDoorAccessDeviceDetails(serialNumber) {
      getDoorAccessDeviceDetails(serialNumber).then(res => {
        if(res.code == '200') {
          for(let key in res.data) {
            this.doorInfo.info[key] = res.data[key]
          }
          this.doorInfo.baseInfoItems.forEach(item => {
            item.value = res.data[item.id]
          })
        }
      })
    },
    async _getDoorAccessCloseUpPic(nodeCode) {
      const params = {
        treeNodeCode: nodeCode,
      }
      let exInfo = await getDoorAccessCloseUpPic({})
      if(exInfo.code == '200') {
        return exInfo.data
      }
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
        const treeData = await this._getParkDeviceTree({
          parentNodeCode: '0',
          deviceTypeNo: 'DOOR_ACCESS'
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
          deviceTypeNo: 'DOOR_ACCESS'
        }, node, node.parent.data, resolve);
      } else if (node.data.children && node.data.children[0]) {
        // setTimeout(() => {
        //   this.treeExpandKeys = [...this.treeExpandKeys, node.data.children[0].id];
        //   this.$refs.tree.setCheckedKeys([node.data.children[0].id]);
        // }, 500);
        resolve(node.data.children);
      }
    },
    prev () {
      this.swiper.slidePrev();
    },
    next () {
      this.swiper.slideNext();
    },
    async nodeClick (data) {
      console.log('nodeclick', data)
      this.monitorId = data.type;
      if (data.id && data.type === 'building') {
        this.floorInfo.name = `${data.nodeName}各门禁状态`;
        const infoObj = await this._getDoorAccessCurrentStatus(data.nodeCode);
        this.floorInfo.info = {
          ...infoObj,
          deviceCount: infoObj.normalCount +infoObj.alarmCount + infoObj.offlineCount
        }
        this.floorInfo.exInfo = await this._getDoorAccessCloseUpPic(data.nodeCode)
      }
      if (data.id && data.type === 'device') {
        this._getDoorAccessDeviceDetails(data.serialNumber);
        this._getDoorAccessInOutRecordTop10(data.serialNumber)
        const deviceInfo = await this._getDoorAccessCurrentStatus(data.serialNumber)
        for(let key in deviceInfo) {
          this.doorInfo.info[key] = deviceInfo[key]
        }
        this.viderInfo.exInfo = await this._getDoorAccessCloseUpPic(data.nodeCode)
        
      }
    },
    async _getDoorAccessCurrentStatus(nodeCode) {
      let result = await getDoorAccessCurrentStatus({
        treeNodeCode: nodeCode
      })
      if(result.code == '200') {
        return result.data;
      }
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
    handleLoorTabClick (e) {
      if (e.name === '2' && this.alarmList.tableData.length === 0) {
        this.onAlarmListSearch();
      }
      if (e.name === '3' && this.logList.tableData.length === 0) {
        this.onLogListSearch();
      }
    },
    onOrderListSearch (val) {
      this.orderList.searchVal = {
        ...val,
        onTime: val.time && val.time[0],
        closeTime: val.time && val.time[1]
      };
      delete this.orderList.searchVal.time;
      this.onOrderListCurrentChange(1);
    },
    _doorAccessLogGetOrder () {
      let parames = {
        data: {
          ...this.orderList.searchVal,
          beginDate: this.orderList.searchVal.dateInterval ? this.orderList.searchVal.dateInterval[0] : '',
          endDate: this.orderList.searchVal.dateInterval ? this.orderList.searchVal.dateInterval[1] : ''
        },
        pageNo: Number(this.orderList.page.current), // 查询的分页页码
        pageSize: Number(this.orderList.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      };
      delete parames.data.dateInterval
      getDoorAccessInOutForPage(parames).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.orderList.page.total = total;
          this.orderList.tableData = data;
        }
      });
    },
    onOrderListCurrentChange (current) {
      this.orderList.page.current = current;
      this._doorAccessLogGetOrder();
    },
    onOrderListPageSizeChange (val) {
      this.orderList.page.pageSize = val
      this.onOrderListCurrentChange(1);
    },
    onOrderListSelectionChange () {

    },
    onAlarmListSearch (val) {
      this.alarmList.searchVal = {
        ...val,
        timeBegin: val && val.time && val.time[0],
        timeEnd: val && val.time && val.time[1]
      };
      delete this.alarmList.searchVal.time;
      this.onAlarmListCurrentChange(1);
    },
    _getSmokeDetectorDeviceForPage () {
      let parames = {
        data: {
          ...this.alarmList.searchVal
        },
        pageNo: Number(this.alarmList.page.current), // 查询的分页页码
        pageSize: Number(this.alarmList.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      };
      // getSmokeDetectorDeviceForPage(parames).then(res => {
      //   if (res.code === '200') {
      //     const {
      //       data,
      //       total
      //     } = res.data;
      //     this.alarmList.page.total = total;
      //     this.alarmList.tableData = data;
      //   }
      // });
    },
    onAlarmListCurrentChange (current) {
      this.alarmList.page.current = current;
      this._getSmokeDetectorDeviceForPage();
    },
    onAlarmListPageSizeChange (pageSize) {
      this.alarmList.page.pageSize = pageSize;
      this.onAlarmListCurrentChange(1);
    },
    onAlarmListSelectionChange () {

    },
    remoteMethod (query) {
      if (query !== '') {
        this.deviceOptions = [];
      } else {
        this.deviceOptions = [];
      }
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
      // getSmokeDetectorClearAlarmLogForPage(parames).then(res => {
      //   if (res.code === '200') {
      //     const {
      //       data,
      //       total
      //     } = res.data;
      //     this.logList.page.total = total;
      //     this.logList.tableData = data;
      //   }
      // });
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
      this.$confirm('此操作将永久清楚该设备告警, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const parames = {
          alarmNo: [item.alarmNo],
          serialNumber: item.serialNumber
        };
        // clearSmokeDetectorAlarm(parames).then(res => {
        //   if (res.code === '200') {
        //     this.$notify({
        //       title: '成功',
        //       message: '清楚成功',
        //       type: 'success',
        //       position: 'bottom-right'
        //     });
        //     this._getTypeDel(item);
        //   }
        // });
      });
    },
    disposeProgress () {

    },
    getChartOptions () {
      return {
        grid: {
          left: '10px',
          right: '0px',
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
          ...chartOptions.tooltip
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
          ...chartOptions.tooltip
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
          ...chartOptions.tooltip
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
    }
  }
};
</script>
<style lang="less">
#entranceManagement{
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
            position: relative;
            content: '';
            width: 1px;/*no*/
            height: 17px;/*no*/
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            background: #D0D0D0;
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
    .loor{
      width: 100%;
      .loorName{
        font-size: 16px;/*no*/
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #393939;
        padding: 20px 20px 0px;/*no*/
        background: #fff;
        align-items: center;
        justify-content: space-between;
        >div{
          float: right;
          font-size: 12px;/*no*/
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #5D5D5D;
          align-items: center;
          .el-switch{
            height: 16px;/*no*/
            line-height: 16px;/*no*/
            .el-switch__core{
              height: 16px;/*no*/
              &::after{
                width: 12px;/*no*/
                height: 12px;/*no*/
              }
            }
            &.is-checked{
              .el-switch__core{
                &::after{
                  margin-left: -13px;/*no*/
                }
              }
            }
          }
        }
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
        width: 100%;/*no*/
        position: relative;
        .swiper-container{
          width: 100%;
          .content{
            height: 234px;
            background: #FDFEFF;
            position: relative;
            .status{
              width: 27px;/*no*/
              height: 27px;/*no*/
              background: linear-gradient(135deg, #52FFD0 0%, #00CD7D 100%);
              box-shadow: 0px 0px 5px 0px rgba(12,51,52,0.7);/*no*/
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;/*no*/
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #FFFFFF;
              position: absolute;
              top: 10px;/*no*/
              left: 10px;/*no*/
              &.is-active{
                background: linear-gradient(135deg, #FF6F66 0%, #ED0E0E 100%);
                box-shadow: 0px 0px 5px 0px rgba(52,22,12,0.7);/*no*/
              }
            }
            .name{
              padding: 6px 10px 6px 18px;/*no*/
              font-size: 14px;/*no*/
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #FFFFFF;
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.54);
              &::after{
                content: '';
                width: 2px;/*no*/
                height: 14px;/*no*/
                background: #2A96FF;
                position: absolute;
                left: 10px;/*no*/
                top: 50%;
                transform: translateY(-50%);
              }
            }
          }

        }
        .swiper-button-prev, .swiper-button-next{
          width: 28px;/*no*/
          height: 28px;/*no*/
          border-radius: 100px;
          background: rgba(5, 126, 231, 0.85);
          &::after{
            font-size: 10px;/*no*/
          }
        }
      }
      .el-tabs{
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
    .door{
      .doorHeader{
        background: #fff;
        padding: 20px;/*no*/
        .header{
          margin-bottom: 10px;/*no*/
          .doorTitle{
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #393939;
            margin-right: 10px;/*no*/
          }
          .doorStatus{
            background: linear-gradient(135deg, #FD7C22 0%, #F46600 100%);
            color: #fff;
            padding: 5px 11px;/*no*/
            font-size: 12px;/*no*/
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 1;
          }
        }
        #formItemText{
          border-bottom: 1px solid #DADADA;/*no*/
          margin-bottom: 18px;/*no*/
          .el-form-item{
            margin-bottom: 15px;/*no*/
            .el-switch{
              height: 16px;/*no*/
              line-height: 16px;/*no*/
              .el-switch__core{
                height: 16px;/*no*/
                &::after{
                  width: 12px;/*no*/
                  height: 12px;/*no*/
                }
              }
              &.is-checked{
                .el-switch__core{
                  &::after{
                    margin-left: -13px;/*no*/
                  }
                }
              }
            }
          }
        }
        .doorInfo{
          >div{
            flex: 1;
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
                background: linear-gradient(320deg, #FF8F46 0%, #FE5A5A 100%);
              }
            }
          }
        }

      }
      .videoInfo{
        margin-top: 10px;/*no*/
        >.el-col{
          &:first-child > .content{
            width: 100%;
            position: relative;
            height: 455px;
            background: #fff;
            .time{
              padding: 4px 10px 4px 10px;/*no*/
              font-size: 12px;/*no*/
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #FFFFFF;
              position: absolute;
              top: 10px;/*no*/
              left: 10px;/*no*/
              background: rgba(0, 0, 0, 0.54);
            }
            .name{
              padding: 6px 10px 6px 18px;/*no*/
              font-size: 14px;/*no*/
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #FFFFFF;
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.54);
              &::after{
                content: '';
                width: 2px;/*no*/
                height: 14px;/*no*/
                background: #2A96FF;
                position: absolute;
                left: 10px;/*no*/
                top: 50%;
                transform: translateY(-50%);
              }
            }
          }
          &:last-child{
            height: 455px;
            .adminCard1{
              height: 100%;
              padding-top: 30px !important;/*no*/
              padding-right: 10px !important;/*no*/
              .content{
                height: 100%;
                padding-right: 10px;/*no*/
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
                .item{
                  padding: 10px 0;/*no*/
                  border-bottom: 1px solid #E9E9E9;/*no*/
                  .imgItem{
                    position: relative;
                    margin-right: 12px;/*no*/
                    align-items: center;
                    flex: 2;
                    img{
                      width: 46%;
                      height: 120px;
                      &:first-child{
                        margin-right: 15px;/*no*/
                      }
                    }
                    .vs{
                      position: absolute;
                      left: 50%;
                      top: 50%;
                      transform: translate(-50%, -50%);
                      width: 70px;/*no*/
                      height: 70px;/*no*/
                      border-radius: 100px;
                      background: url(./images/img4.png) no-repeat center;
                      background-size: 100% 100%;
                      z-index: 100;
                      span{
                        &:first-child{
                          font-size: 18px;/*no*/
                          font-family: DINAlternate-Bold, DINAlternate;
                          font-weight: bold;
                          color: #37FFD4;
                        }
                        &:last-child{
                          font-size: 10px;/*no*/
                          font-family: PingFangSC-Regular, PingFang SC;
                          font-weight: 400;
                          color: #FFFFFF;
                        }
                      }
                    }
                    .el-image {
                      width: 100%;
                      height: 100%;
                      background: #f5f7fa;
                      .image-slot {
                        display: flex;
                        align-items: center;
                        width: 100%;
                        height: 100%;
                        justify-content: center;
                      }
                      .el-icon-picture-outline {
                        font-size: 30px;
                        color: #909399;
                      }
                    }
                  }
                  .infoItem{
                    flex: 1;
                    .infoHeader{
                      justify-content: space-between;
                      .infoTitle{
                        align-items: center;
                        font-size: 14px;/*no*/
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #3F3F3F;
                        .icon{
                          width: 14px;/*no*/
                          height: 14px;/*no*/
                          background: linear-gradient(135deg, #57BBF3 0%, #2C85E4 100%);
                          border-radius: 1px;/*no*/
                          margin-right: 7px;/*no*/
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          i {
                            font-size: 10px;/*no*/
                            color: #fff;
                          }
                        }
                      }
                      .infoDetail{
                        font-size: 12px;/*no*/
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #265ACA;
                        align-items: center;
                        cursor: pointer;
                        .icon{
                          margin-left: 4px;/*no*/
                          width: 12px;/*no*/
                          height: 12px;/*no*/
                          background: #265ACA;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          i {
                            font-size: 6px;/*no*/
                            color: #fff;
                          }
                        }
                      }
                    }
                    .infoBottom {
                      li {
                        font-size: 12px;/*no*/
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #3F3F3F;
                      }
                    }
                    #formItemText{
                      span{
                        font-size: 12px;/*no*/
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #3F3F3F;
                      }
                    }
                  }
                  &:last-child{
                    border-bottom: none;
                    padding-bottom: 0;
                  }
                }
              }
            }
          }
        }
      }
      .el-tabs{
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

