<template>
  <div id="timeMonitoring">
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
              placeholder="请输入水电的名称"
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
            :filter-node-method="filterNode"
            :load="loadNode"
            @node-click="nodeClick"
            highlight-current
            lazy
            ref="tree"
            :check-on-click-node="true"
            :auto-expand-parent="true"
            :current-node-key="currentNodeKey"
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
      <div class="flexCloumn building" v-show="monitorId === 'building'">
        <div class="flexCloumn buildingHeader">
          <div class="flexRow buildingName">
            {{buildingInfo.name}}
            <div class="flexRow">
              <div class="flexRow batchWater">
                <div class="icon"><i class="iconfont icon-dianji" /></div>
                批量远程抄表
              </div>
              一键通电/断电：
              <el-switch
                v-model="buildingInfo.switch"
                :width="34"
                active-color="#12BD69"
                inactive-color="#e0e0e0">
              </el-switch>
            </div>
          </div>
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
        </div>
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
            :key="item.serialNumber"
          >
            <div class="flexCloumn content">
              <div class="flexRow header">
                <div class="flexCenter icon">
                  <i class="iconfont icon-dianji"/>
                </div>
                {{`${item.installAddress}${item.deviceName}`}}
              </div>
              <div class="flexRow body">
                <div class="flexCloumn flexCenter info">
                  <span class="value">{{item.readingValue}}</span>
                  <span class="title">当前水表度数</span>
                </div>
                <div class="flexCloumn flexCenter info">
                  <span class="value">
                    <span class="unit">￥</span>{{!item.accountDto.arrearsMoney ? `${item.accountDto.balance || 0}` : `-${item.accountDto.arrearsMoney}`}}
                  </span>
                  <span class="title">当前{{!item.accountDto.arrearsMoney ? '余额' : '欠费'}}</span>
                </div>
              </div>
              <span class="flexRow status">
                <div class="flexCenter icon">
                  <i class="iconfont icon-dianji"/>
                </div>
                {{item.onlineStatusText}}
              </span>
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
      <div class="flexCloumn loor" v-show="monitorId === 'floor'">
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
              <span>{{floorInfo.info.deviceCount}}</span>
              <span>总数</span>
            </div>
          </div>
          <div>
            <div class="icon">
              <i class="iconfont icon-zhengchang" />
            </div>
            <div class="flexCloumn info">
              <span>{{floorInfo.info.normalCount}}</span>
              <span>正常</span>
            </div>
          </div>
          <div>
            <div class="icon">
              <i class="iconfont icon-guzhang" />
            </div>
            <div class="flexCloumn info">
              <span>{{floorInfo.info.offlineCount}}</span>
              <span>故障</span>
            </div>
          </div>
          <div>
            <div class="icon">
              <i class="iconfont icon-yujing" />
            </div>
            <div class="flexCloumn info">
              <span>{{floorInfo.info.alarmCount}}</span>
              <span>未缴费</span>
            </div>
          </div>
        </div>
        <div class="flexCloumn loorDeviceList">
          <span class="infoTitle">本楼层水表情况</span>
          <el-row :gutter="10" class="floorData">
          <el-col
            :span="6"
            v-for="item in buildingInfo.tableData"
            :key="item.serialNumber"
          >
            <div class="flexCloumn content">
              <div class="flexRow header">
                <div class="flexCenter icon">
                  <i class="iconfont icon-dianji"/>
                </div>
                <div class="installAddr">{{`${item.installAddress}${item.deviceName}`}}</div>
              </div>
              <div class="flexRow body">
                <div class="flexCloumn flexCenter info">
                  <span class="value">{{item.readingValue}}</span>
                  <span class="title">当前水表度数</span>
                </div>
                <div class="flexCloumn flexCenter info">
                  <span class="value">
                    <span class="unit">￥</span>{{!item.accountDto.arrearsMoney ? `${item.accountDto.balance || 0}` : `-${item.accountDto.arrearsMoney}`}}
                  </span>
                  <span class="title">当前{{!item.accountDto.arrearsMoney ? '余额' : '欠费'}}</span>
                </div>
              </div>
              <span class="flexRow status">
                <div class="flexCenter icon">
                  <i class="iconfont icon-dianji"/>
                </div>
                {{item.onlineStatusText}}
              </span>
            </div>
          </el-col>
        </el-row>
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
      <div class="flexCloumn alarm" v-show="monitorId === 'device' && onlineStatus">
        <div class="flexRow alarmHeader">
          <div class="flexRow flexCenter">
            <span class="alarmTitle">{{deviceInfo.info.deviceName}}</span>
            <span class="alarmStatus">{{deviceInfo.info.onlineStatusText}}</span>
          </div>
          <div class="flexRow rightBtn">
            <div class="flexRow batchWater">
              <div class="icon"><i class="iconfont icon-dianji" /></div>
              批量远程抄表
            </div>
            一键通电/断电：
            <el-switch
              v-model="buildingInfo.switch"
              :width="34"
              active-color="#12BD69"
              inactive-color="#e0e0e0">
            </el-switch>
          </div>
        </div>
        <div>
          <el-tabs v-model="activeDeviceTabsName" type="card" @tab-click="handleDeviceTabClick">
          <el-tab-pane
            label="基本信息"
            name="1"
            lazy
          >
            <span slot="label"><i class="iconfont icon-chanpinxinxi"></i> 基本信息</span>
            <div class="content">
              <el-row class="list2">
                <el-col :span="24">
                  <div class="content">
                    <FormItemText
                      :layout="deviceInfo.baseInfoItems"
                      labelWidth="0px"
                    >
                    </FormItemText>
                  </div>
                </el-col>
              </el-row>
              <div class="flexRow deviceInfo">
                <div>
                  <div class="icon">
                    <i class="iconfont icon-zongshu" />
                  </div>
                  <div class="flexCloumn info">
                    <span>{{deviceInfo.info.waterMeterInfoDto.totalConsumptionValue ? deviceInfo.info.waterMeterInfoDto.totalConsumptionValue : 0}}</span>
                    <span>累计流量</span>
                  </div>
                </div>
                <div>
                  <div class="icon">
                    <i class="iconfont icon-zhengchang" />
                  </div>
                  <div class="flexCloumn info">
                    <span>{{deviceInfo.info.waterMeterInfoDto.instantaneousFlow  || 0}}</span>
                    <span>当日最大值</span>
                  </div>
                </div>
                <div>
                  <div class="icon">
                    <i class="iconfont icon-guzhang" />
                  </div>
                  <div class="flexCloumn info">
                    <span>{{deviceInfo.info.waterMeterInfoDto.valveControl || 0}}</span>
                    <span>开关阀状态</span>
                  </div>
                </div>
                <div>
                  <div class="icon">
                    <i class="iconfont icon-yujing" />
                  </div>
                  <div class="flexCloumn info">
                    <span>{{deviceInfo.info.waterMeterInfoDto.totalConsumptionValue ? deviceInfo.info.waterMeterInfoDto.totalConsumptionValue : 0}}</span>
                    <span>电池状态</span>
                  </div>
                </div>
              </div>
              <div>
                <!-- <div class="meterRecord"></div>
                <div id="chart_3" class="chart"/> -->
                <el-row class="list2">
                  <el-col :span="24">
                    <div class="content">
                      <div class="title">72小时用水量趋势分析</div>
                      <div id="chart_3" class="chart"/>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="用户缴费"
            name="2"
            lazy
          >
            <span slot="label"><i class="iconfont icon-fuwunengli"></i> 用户缴费</span>
            <div class="content">
              <card>
                <div class="userInfo flexRow spaceBetween">
                  <div class="title">用户地址</div>
                  <div class="payStatus">未缴纳</div>
                  <div class="payTime">未缴纳</div>
                </div>
                <div class="flexRow userData">
                  <div class="item borderLine">
                    <p>用户名</p>
                    <div><span>李四{{}}</span></div>
                  </div>
                  <div class="item borderLine">
                    <p class="normalMark">联系电话</p>
                    <div><span>{{}}</span></div>
                  </div>
                  <div class="item borderLine">
                    <p class="alarmMark">抄表读数</p>
                    <div><span>{{}}</span></div>
                    <div class="line"></div>
                  </div>
                  <div class="item borderLine">
                    <p class="malfunctionMark">用水量</p>
                    <div><span>{{}}</span></div>
                  </div>
                  <div class="item">
                    <p class="malfunctionMark">水费单价</p>
                    <div><span>{{}}</span></div>
                  </div>
                </div>
                <div>水费：<span style="border-bottom: 1px solid">110.30</span>元</div>
              </card>
              <el-row class="list2">
                <el-col :span="12">
                  <div class="content">
                    <div class="userInfoBox">
                      
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="content">
                    <div class="title">进两个月水量走势</div>
                    <div id="chart_3" class="chart"/>
                  </div>
                </el-col>
              </el-row>
              <el-row class="list2">
                <el-col :span="24">
                  <div class="content">
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
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="实时抄表"
            name="3"
            lazy
          >
            <span slot="label"><i class="iconfont icon-weihunengli"></i> 实时抄表</span>
            <div class="content">
              <el-row class="list2">
                <el-col :span="24">
                  <div class="content">
                    <div class="btnList">
                      <el-button type="primary" size="mini" @click="remoteReading">
                      远程抄表</el-button>
                      <el-button type="primary" size="mini" @click="doorControl">
                      阀门控制</el-button>
                    </div>
                      <div class="meterRecord">抄表记录</div>
                      <page-table
                        col-align="center"
                        :data="baseInfoList.tableData"
                        :cols="baseInfoList.tableCols"
                        :page-current="baseInfoList.page.current"
                        :total="baseInfoList.page.total"
                        :page-size="baseInfoList.page.pageSize"
                        @current-change="onBaseListCurrentChange"
                        @size-change="onBaseListPageSizeChange"
                      >
                      </page-table>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane
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
          </el-tab-pane> -->
         </el-tabs>
        </div>
      </div>
      <div class="flexCloumn alarm" v-show="monitorId === 'device' && !onlineStatus">
        <div class="flexRow alarmHeader">
          <div class="flexRow flexCenter">
            <span class="alarmTitle">{{deviceInfo.info.deviceName}}</span>
            <span class="alarmStatus">{{deviceInfo.info.onlineStatusText}}</span>
          </div>
          <div class="btnList">
            <!-- <el-button type="primary" @click="contactCheck(item)">
            联系安全员现场核查</el-button>
            <el-button type="primary" @click="clearError(item)">
            消除告警</el-button> -->
          </div>
        </div>
        <card title="基本信息" :className="'adminCard adminCard1'">
          <div class="flexRow content">
               <el-image class="flexCenter">
                  <i class="el-icon-picture-outline"></i>
              </el-image>
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
         <card title="应急处理预案" :className="'adminCard adminCard3'">
           <el-checkbox-group v-model="alarmInfo.disposeSelect">
              <el-checkbox
                v-for="item in alarmInfo.disposeList"
                :key="item.id"
                :label="item.name"
              >
              </el-checkbox>
           </el-checkbox-group>
           <el-button type="primary" @click="disposeProgress(item)">
            同步处理进度</el-button>
        </card>
        <card title="消防相关负责人" :className="'adminCard adminCard4'">
          <ul class="flexCloumn">
            <li
            v-for="item in alarmInfo.fireControl"
            :key="item.code"
            class="flexRow"
            >
              <div class="position">{{item.position}}</div>
              <div class="flexCloumn controlInfo">
                <div>{{item.realName}}</div>
                <div>{{item.tel}}</div>
              </div>
            </li>
          </ul>
        </card>
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
import searchForm from 'components/adminSearchForm/searchForm';
import FormItemText from '@/components/formItemText/formItemText';
import card from 'view/lightPole/lightPoleStatistical/components/card';
import PageTable from '@/components/adminPage-table';
import PoleMap from '@/view/index/lightPoleMap/poleMap';
import echartData from '@/view/lightPole/lightPoleStatistical/components/echartData';
import { routePush } from '@/util/util';
import {
  getGroupPolicy,
  getLamp
} from 'api/index';
import {
  getDeviceModuleTree,
  getDetailByID
} from 'api/admin';
import {
  getSmokeDetectorDeviceForPage,
  getSmokeDetectorAlarmForPage,
  getSmokeDetectorAlarmLevel,
  getSmokeDetectorAlarmStatus,
  getSmokeDetectorAlarmType,
  getSmokeDetectorOnLineStatus,
  getSmokeDetectorWorkOrderForPage,
  getSmokeDetectorClearAlarmLogForPage,
} from 'api/smokeDetectorMap';
import {
  getRecentRealWaterConsumption,
  getMeterReadingData,
  remoteMeterReading,
  getWaterMeterDeviceDtl,
  getFloorInfo,
  getWaterMeterCurrentStatus,
  getWaterMeterDeviceForPage
} from 'api/water';
import {
  getParkDeviceTree
} from 'api/index';
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
  name: 'timeMonitoring',
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
      init_3_Chart: null,
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
      activeDeviceTabsName: '1',
      activetNormalTabsName: '2',
      monitorId: undefined,
      buildingInfo: {
        switch: false,
        name: 'A区A1栋大厦烟感设备状态',
        info: {
          deviceCount: 0,
          normalCount: 0,
          alarmCount: 0,
          offlineCount: 0,
          warningCount: 0
        },
        searchItems: [{
          type: 'select',
          label: '楼层',
          props: {
            fieldName: 'floorCode',
            options: []
          }
        }, {
          type: 'input',
          label: '水表名称',
          props: {
            fieldName: 'deviceName'
          }
        }, {
          type: 'radio',
          label: '水表状态',
          labelWidth: '90px',
          props: {
            fieldName: 'name',
            options: [{
              id: '',
              name: '全部'
            }, {
              id: '1',
              name: '在线'
            }, {
              id: '2',
              name: '预警'
            }, {
              id: '3',
              name: '故障'
            }, {
              id: '4',
              name: '未缴费'
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
      floorInfo: {
        name: 'A区A1栋大厦',
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
          { label: '经度',
            prop: 'longitude'
          },
          { label: '纬度',
            prop: 'latitude'
          },
          { label: '在线状态',
            prop: 'onlineStatusText'
          },
          { label: '告警状态',
            prop: 'alarmStatusText'
          },
          { label: '最后上报时间',
            prop: 'lastReportTime'
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
        tableData: [],
        tableCols: [
          { label: '属性名称',
            prop: 'deviceName'
          },
          { label: '中文描述',
            prop: 'alarmName'
          },
          { label: '数据类型',
            prop: 'alarmTime',
            minWidth: '110px'
          },
          { label: '取值范围',
            prop: 'dealer'
          },
          { label: '单位',
            prop: 'completeTime',
            minWidth: '110px'
          },
          // { label: '故障持续时长',
          //   prop: 'alarmStatusText',
          // },
          { label: '访问权限',
            prop: 'dealNote',
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
      deviceInfo: {
        info: {
          waterMeterInfoDto: {
            totalConsumptionValue : 0
          }
        },
        baseInfoItems: [{
          id: 'serialNumber',
          label: 'IMEI',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'installAddress',
          label: '水表地址',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'lastReportTime',
          label: '最后上报时间',
          value: '',
          unit: '',
          span: 8
        }],
      },
      baseInfoList: {
        tableData: [],
        tableCols: [
          { label: '水表编号',
            prop: 'serialNumber'
          },
          { label: '水表地址',
            prop: 'installAddress'
          },
          { label: '当前水表读数',
            prop: 'currentReadingValue'
          },
          { label: '上次水表读数',
            prop: 'beforeReadingValue',
          },
          { label: '抄表时间',
            prop: 'readingTime'
          },
          { label: '本次用水量',
            prop: 'readingValue'
          },
          { label: '抄表人',
            prop: 'readingUser'
          }
        ],
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
          span: 24
        }, {
          id: 'installAddress',
          label: '报警位置',
          value: '',
          unit: '',
          span: 24
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
          span: 24
        }, {
          id: 'temperature',
          label: '温度',
          value: '',
          unit: 'ºC',
          span: 24
        }, {
          id: 'humidity',
          label: '湿度',
          value: '',
          unit: '%',
          span: 24
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
          id: 'alarmTypeText',
          label: '告警类型',
          value: '',
          unit: '',
          span: 8
        }, {
          id: 'securityUsera',
          label: '消防安全负责人',
          value: '',
          unit: '',
          class: 'noBottom',
          span: 8
        }, {
          id: 'userTel',
          label: '消防联系电话',
          value: '',
          unit: '',
          class: 'noBottom',
          span: 8
        }],
        disposeSelect: [],
        disposeList: [{
          id: 0,
          name: '【消防中心】消防控制中心接到报警信号，在控制器上确认火警信息，通知人员现场确认。'
        }, {
          id: 1,
          name: '【消防中心 及 现场人员】值班人员现场确认，并报告现场情况。'
        }, {
          id: 2,
          name: '【消防中心 及 消防系统】确认误报，查明原因、复位、记录。'
        }, {
          id: 3,
          name: '【消防中心 及 消防系统】火灾确认后，立即确认消防系统属于自动状态。'
        }, {
          id: 4,
          name: '【消防中心】火灾通报。'
        }, {
          id: 5,
          name: '【疏散组】引导人员疏散。'
        }, {
          id: 6,
          name: '【灭火组】火灾扑救。'
        }, {
          id: 7,
          name: '【值班主管】园区微型消防站：通报现场情况、组织人员救灾。'
        }, {
          id: 8,
          name: '【权限主管】通知园区政府消防队。'
        }, {
          id: 9,
          name: '【响应人员】拨打119电话。'
        }],
        fireControl: []
      },
      currentNodeKey: undefined,
      onlineStatus: '',
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
      this.initWaterTrends();
      this.initWater2Trends();
    });
  },
  computed: {
    ...mapGetters(['common', 'openPage']),
    routeName () {
      return this.$route.name
    }
  },
  methods: {
    _getWaterMeterDeviceDtl() {
      getWaterMeterDeviceDtl(this.currentNodeKey).then(res => {
        if(res.code == '200') {
          this.deviceInfo.info = res.data
          this.deviceInfo.baseInfoItems.map(item => {
            item.value = res.data[item.id] || ''
          })
        }
      })
    },
    _getFloorInfo (code) {
      getFloorInfo(code).then(res => {
        if(res.code == '200') {
          this.buildingInfo.searchItems[0].props.options = res.data.map(item => {
            return {
              name: item.floorName,
              id: item.floorCode
            }
          })
        }
      })
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
        const treeData = await this._getParkDeviceTree({
          parentNodeCode: '0',
          deviceTypeNo: 'WATER_METER'
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
          deviceTypeNo: 'WATER_METER'
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
      console.log(data)
      this.monitorId = data.type;
      this.currentNodeKey = data.id;
      if (data.id && data.type === 'building') {
        this.buildingInfo.name = `${data.label}水表设备状态`;
        this._getFloorInfo(data.id)
        getWaterMeterCurrentStatus({
          treeNodeCode: data.id
        }).then(res => {
          if (res.code === '200') {
            this.buildingInfo.info = res.data;
          }
        });
        this.buildingInfo.searchVal = {
          streetCode: data.id
        };
        this.onBuildingCurrentChange(1);
      }
      if (data.id && data.type === 'floor') {
        this.floorInfo.name = `${data.label}各水表设备状态`;
        this.floorCode = data.id;
        getWaterMeterCurrentStatus({
          treeNodeCode: data.id
        }).then(res => {
          if (res.code === '200') {
            this.floorInfo.info = res.data;
          }
        });
        this.buildingInfo.searchVal = {
          streetCode: data.id
        };
        this.onBuildingCurrentChange(1);
      }
      if (data.id && data.type === 'device') {
        this.onlineStatus = data.onlineStatus
        this._getWaterMeterDeviceDtl()
        this.init_3()
        this.chart_3_data()
      }
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
                let type = 'device';
                return {
                  id: dto['serialNumber'],
                  label: dto['deviceModuleName'],
                  ...dto,
                  type,
                  isLeaf: true
                }
              });
            }
            let type = null;
            if (daItem['nodeLevel'] === 4) {
              type = 'building';
            }
            if (daItem['nodeLevel'] === 5) {
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
    async init_3 () {
      let dom_3 = document.getElementById('chart_3');
      this.init_3_Chart = echarts.init(dom_3);
      const chartOptions = await this.getCharts_3_options();
      this.init_3_Chart.setOption(chartOptions)
      this.init_3_Chart.resize()
    },
    getCharts_3_options () {
     const option = {
        backgroundColor: '#fff',
        color: ['#73DEB3'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                crossStyle: {
                    color: '#999'
                },
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        grid: {
            left: '25',
            right: '25',
            bottom: '24',
            top: '10',
            containLabel: true
        },
        legend: {
            data: ['用水量'],
            orient: 'horizontal',
            icon: "rect",
            show: true,
            bottom: 0,
        },
        xAxis: {
            type: 'category',
            data: [],
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
              show: true,
              lineStyle:{
                color:'#999'
              }
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#999',
                textStyle: {
                    fontSize: 12
                },
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: '#F3F4F4'
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle:{
                color:'#999'
              }
            },
        },
        series: [
          {
            name: '用水量',
            type: 'line',
            smooth: true,
            data: []
          }
        ]
      };
      return option
    },
    // 72小时用水量趋势分析
    chart_3_data () {
      getRecentRealWaterConsumption(this.currentNodeKey).then(res => {
        if(res.code == '200' && res.data.length) {
          let axisData = res.data.map(item => {
            return item.statsTime
          })
          let value = res.data.map(item => {
            return item.readingValue
          })

          let newOptions = {
            xAxis: {
              data: axisData,
            },
            series: [
              {
                name: '用水量',
                type: 'line',
                smooth: true,
                data: value
              }
            ]
          }
          this.init_3_Chart.setOption(newOptions)
        }
      })
    },
    // 实时抄表数据
    _getMeterReadingData() {
     let data = {
        data: {
          serialNumber: this.currentNodeKey
        },
        pageNo: Number(this.baseInfoList.page.current), // 查询的分页页码
        pageSize: Number(this.baseInfoList.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: ''
      }
      getMeterReadingData(data).then(res => {
        if (res.code === '200') {
          const {
            data,
            total
          } = res.data;
          this.baseInfoList.page.total = total;
          this.baseInfoList.tableData = data;
        }
      })
    },
    onBaseListCurrentChange (current) {
      this.baseInfoList.page.current = current;
      this._getMeterReadingData()
    },
    onBaseListPageSizeChange (size) {
      this.baseInfoList.page.pageSize = size;
      this.onBaseListCurrentChange(1)
    },
    handleDeviceTabClick (e) {
      this.activeDeviceTabsName = e.name
      if (e.name === '1') {
        this.init_3()
        this.chart_3_data()
      }
      if (e.name === '2') {
        
      }
      if (e.name === '3') {
        this.onBaseListCurrentChange(1)
      }
    },
    handleLoorTabClick (e) {},
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
    // 远程抄表
    remoteReading () {
      // remoteMeterReading().then(res => {
      //   if(res.code == '200') {

      //   }
      // })
    },
    // 阀门控制
    doorControl () {},
    disposeProgress () {

    },
    getChartOptions () {
      return {
        grid: {
          left: '10px',
          right: '10px',
          top: '10px',
          bottom: '10px',
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
    async initWaterTrends (data) {
      const dom_1 = document.getElementById('waterTrendsChart');
      let myChart = echarts.init(dom_1);
      let option = null;
      const chartOptions = await this.getChartOptions();
      option = {
        grid: {
          ...chartOptions.grid,
          top: '60px',
          right: '20px'
        },
        tooltip: {
          ...chartOptions.tooltip
        },
        legend: {
          ...chartOptions.legend,
          show: false,
          data: [{
            name: '用水量',
            icon: 'rect'
          }]
        },
        xAxis: [
          {
            ...chartOptions.xAxis[0],
            data: (data && data.date) || [1, 5, 3, 7, 5, 6]
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
            markPoint: {
              data: [
                {type: 'max',
                  name: '最大值'}
              ]
            },
            symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA8CAMAAAAJ1/l9AAABNVBMVEUAAAD///9Av/8zmcwzzP8rqtUrqv8r1f8kttsas+Yas/8Xuf8nsesiqu4iu/8gr+8etPAcqvEbrvIas/IYqucYtvMXufMWsfQVteoVtfQdsfUbre0Zsu4Zre8Zte8ZtfcYt/cXsvAXsvcXrfAXtPAWr/AWtvAVsfEUtfISsvMSuPMVr/QVtfQUs/AUsesUsfAXsOwXsu0XsvEWse4Vru4Vre8XsPAWse0Vr/EYsPEYse4XsvIWr+8WruwWru8YsfAYr/AYsvAXse4XrO4Xre4Zr/EYruwYru8Yr+wYr+8Xr/AXr/IXrfAXru0Wru4VsO4YrvAWru8YsO8XsO4Wru0WsO8WsO8WsPEXsO8WsfAXsPEWsfAXsPAXsfEVsPEWsfAWsfAWsO8WsfEXsPEWsPEWsfEWsPAvO4ktAAAAZnRSTlMAAQQFBQYGBgcKCgsNDw8QERITFBUVFhcYGBocHh8fHyAhISIiIyMkJisrMDAyNDQ3ODg7PD5ERUlKS09QUlJVVlZYWVpdXl9gYGNjZGVoa3V+gYiOjq6xsr3I3ezs7/H09ff4+/4KVSy4AAACIUlEQVRIx61X51oCQQxc7IoNERQ7Cq69N9QTu6KcvYG93fs/giKfSfbYKxjn3+7MXMnlsokQetQ2Rbr64kmZjPd1RZpqRRkIBGODUsVgZzDgz1wRTkgdEuEKb3NlVDoj6nGBQGtSuiHZ6vYKVT3SCz1Vju76hPRGot7B3SL9oUX72lHpF1FNACLSPyIl7ma7ZGQ2ZWwfZA+2jdTsiJ1strkbbPy8cWQijox5G9+guGvUmM/smnbszqjxr6Fh66XUWNrUIT1GRb0kfCFKTGVMPTJTVBbCZBsm24tZ0wnZRaIbhvSjX3zBdMMC/fq/PxnZmzx2tR9PEm1l0d6OO6OHpjsOR1HcXgz7EO6sm15YIxXoJ/hB8uiK8vzu/unj6f7uXNkljx8s2DtwvUVkZ/lPq4jP/BnZ30R5R8Eeh+U0UV0+W4jnS8JMg36gkK94tRXUXLxbFG8XSK2goVqIRlztg+T00VLxcArcPhoahWiDxQTe4day4xbJCXC0CRHDdAXByWuJ/eUEWEzdmBDdsFgGwbVViitgl8DRLQTW5lUQ3GjsN8CuYtUWoh8WGyDIaew5YDfA0c+2Mx+eGTrmhys/bcZp2pSdtHtK0jJ/GeYPS8vF5h/KBbNYMUvlnwt1+F+OCeYhxT0imQc0tz1gNifc1kjXmM2ljJ3vxmzHT2PGbQu5TSmzJWY35NxxgDuMcEch9iDmNAbG/I6BRdQpQ2idk+wLMI+LE0zQBlkAAAAASUVORK5CYII=',
            symbolSize: 30,
            smooth: true,
            lineStyle: {
              normal: {
                width: 3,
                color: {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: '#16B0F0' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#517EF6' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#517EF6',
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 1,
                      color: 'rgba(22, 176, 240, 0.3)'
                    },
                    {
                      offset: 0,
                      color: 'rgba(81, 126, 246, 0)'
                    }
                  ])
                }
              }
            },
            data: (data && data.count1) || [1, 5, 3, 7, 5, 6],
            markLine: {
              symbol: ['none', 'none'],
              label: {
                show: true
              },
              animation: false,
              data: [{
                yAxis: '5',
                lineStyle: {
                  type: 'solid',
                  color: '#F64F1A',
                  width: 1
                }
              }],
              silent: true

            }
          }
        ]
      };
      myChart.setOption(option, true);
      window.onresize = function () {
        myChart.resize();
      };
    },
    async initWater2Trends (data) {
      const dom_1 = document.getElementById('water2TrendsChart');
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
          show: false,
          data: [{
            name: '本月',
            icon: 'rect'
          }, {
            name: '上月',
            icon: 'rect'
          }]
        },
        xAxis: [
          {
            ...chartOptions.xAxis[0],
            data: (data && data.date) || [1, 5, 3, 7, 5, 6]
          }
        ],
        yAxis: [
          {
            ...chartOptions.yAxis[0]
          }
        ],
        series: [
          {
            name: '本月',
            type: 'line',
            smooth: true,
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
                      color: 'rgba(35, 229, 175, 0.3)'
                    },
                    {
                      offset: 0,
                      color: 'rgba(24, 194, 137, 0)'
                    }
                  ])
                }
              }
            },
            data: (data && data.count1) || [1, 5, 3, 7, 5, 6]
          },
          {
            name: '上月',
            type: 'line',
            smooth: true,
            lineStyle: {
              normal: {
                width: 3,
                color: {
                  type: 'linear',
                  colorStops: [{
                    offset: 0,
                    color: '#FFA14C' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#D63D17' // 100% 处的颜色
                  }],
                  globalCoord: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#D63D17',
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 1,
                      color: 'rgba(255, 161, 76, 0.3)'
                    },
                    {
                      offset: 0,
                      color: 'rgba(214, 61, 23, 0)'
                    }
                  ])
                }
              }
            },
            data: (data && data.count2) || [1, 6, 8, 3, 2, 2]
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
    onBuildingSearch (val) {
      // Object.assign(this.buildingInfo.searchVal, val)
      this.buildingInfo.searchVal = {
        ...val,
        streetCode: this.buildingInfo.searchVal.streetCode
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
      getWaterMeterDeviceForPage(data).then(res => {
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
    }
  }
};
</script>
<style lang="less">
#timeMonitoring{
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
          }
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
      .buildingSearch{
        margin: 10px 0;/*no*/
        background: #fff;
        padding: 12px 15px;/*no*/
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
              .installAddr {
                flex: 8;
              }
            }
            .body{
              padding: 20px 0;/*no*/
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
        .infoTitle{
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
      .floorData{
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
              .installAddr {
                flex: 8;
              }
            }
            .body{
              padding: 20px 0;/*no*/
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
        .rightBtn{
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
          }
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
      .meterRecord {
        font-size: 0.186667rem;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #5F5F5F;
        margin-bottom: 15px;
        margin-top: 15px;
      }
      .userInfoBox {
        height: 300px;
      }
      .userData {
        .line {
          width: 1px;
          border-right: 1px solid;
        }
        .borderLine {
          border-right: 1px solid;
        }
        .item {
          font-size: 14px;
          padding-right: 10px;
          margin-right: 25px;
        }
      }
      .deviceInfo{
        margin-top: 15px;
        padding: 30px 30px 10px;/*no*/
        justify-content: space-between;
        background: #FFF;
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
        }
        #formItemText{

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
      .normalHeader{
        padding: 20px;/*no*/
        background: #fff;
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
        >div.fastInfoAction{
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
          }
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
      .normalBaseInfo{
        .baseInfoHeader{
          background: #fff;
          padding: 20px;/*no*/
          .baseItems{
            .item .content{
              width: 100%;
              padding: 15px;/*no*/
              background: linear-gradient(135deg, #FFFFFF 0%, #F6FBFF 100%);
              border: 1px solid;
              border-image: linear-gradient(135deg, rgba(237, 247, 255, 1), rgba(230, 243, 255, 1)) 1 1;
              position: relative;
              .icon{
                width: 64px;/*no*/
                height: 64px;/*no*/
                background: linear-gradient(135deg, #40E07B 0%, #30E2B0 100%);
                box-shadow: 0px 2px 6px 0px rgba(205,255,246,1);/*no*/
                border-radius: 27px;/*no*/
                margin-right: 15px;/*no*/
                i{
                  color: #fff;
                  font-size: 32px;/*no*/
                }
              }
              .label{
                position: absolute;
                top: 0;
                right: 0;
                background: linear-gradient(135deg, #36CF90 0%, #1FC1A0 100%);
                border-radius: 0px 0px 0px 9px;/*no*/
                padding: 4px 6px 4px 10px;/*no*/
                font-size: 12px;/*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                line-height: 1;
              }
              .info{
                width: calc(100% - 79px);/*no*/
                justify-content: space-around;
                .title{
                  font-size: 12px;/*no*/
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #5D5D5D;
                  width: 100%;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                }
                .value{
                  font-size: 24px;/*no*/
                  font-family: DINAlternate-Bold, DINAlternate;
                  font-weight: bold;
                  color: #353535;
                  width: 100%;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                }
              }
            }
          }
        }
        .waterTrends{
          background: #fff;
          margin-top: 10px;/*no*/
          padding: 10px 15px;/*no*/
          .title{
            font-size: 14px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #5F5F5F;
            margin-bottom: 15px;/*no*/
            justify-content: space-between;
            .laber {
              font-size: 12px;/*no*/
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #3D3D3D;
              align-items: center;
              span{
                width: 15px;/*no*/
                height: 4px;/*no*/
                background: #20A8F1;
                border-radius: 2px;/*no*/
                margin-right: 6px;/*no*/
              }
            }
          }
          .chart{
            width: 100%;
            height: 400px;
          }
        }
      }
      .usersPayInfo{
        >.el-row{
          position: relative;
        }
        .userPayInfo{
          .itemContent{
            width: 100%;
            padding: 10px;/*no*/
            background: #fff;
            .titleHead{
              font-size: 14px;/*no*/
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #454545;
              align-items: center;
              span{
                width: 4px;/*no*/
                height: 13px;/*no*/
                background: #265ACA;
                margin-right: 5px;/*no*/
              }
            }
            .address{
              padding: 7px 14px;/*no*/
              background: linear-gradient(90deg, #E6F6FF 0%, rgba(245, 251, 255, 0) 100%);
              border: 1px solid;/*no*/
              border-image: linear-gradient(270deg, rgba(212, 230, 252, 0.29), rgba(169, 200, 248, 1)) 1 1;
              border-left: 4px solid #265ACA;/*no*/
              font-size: 14px;/*no*/
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #1F1F1F;
              align-items: center;
              justify-content: space-between;
              margin: 17px 0 14px;/*no*/
              .addressInfo{
                width: calc(100% - 50px);/*no*/
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
              .status{
                padding: 2px 6px;/*no*/
                font-size: 12px;/*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                background: linear-gradient(132deg, #FF9952 0%, #FA7034 100%);
              }
            }
            .item1{
              align-items: center;
              margin-bottom: 15px;/*no*/
              .icon{
                width: 34px;/*no*/
                height: 34px;/*no*/
                background: linear-gradient(148deg, #F84B39 0%, #FA9228 100%);
                border-radius: 100px;/*no*/
                margin-right: 8px;/*no*/
                i{
                  color: #fff;
                  font-size: 18px;/*no*/
                }
              }
              .item1Info{
                width: calc(100% - 42px);/*no*/
                justify-content: space-around;
                .title{
                  font-size: 16px;/*no*/
                  font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                  color: #1F1F1F;
                }
              }
            }
            .item2{
              .item2SunItem .item2SunItemContent{
                padding: 11px 20px;
                border-radius: 7px;/*no*/
                align-items: center;
                .icon{
                  width: 42px;
                  height: 42px;
                  border-radius: 100px;/*no*/
                  background: #FFFFFF;
                  margin-right: 17px;
                  i{
                    font-size: 20px;
                    background-image: -webkit-linear-gradient(-45deg, #F0F2FF 20%, #AECAFF 60%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                  }
                }
                .item2Info{
                  flex: 1;
                  width: calc(100% - 59px);
                  .value {
                    font-size: 22px;
                    font-family: DINAlternate-Bold, DINAlternate;
                    font-weight: bold;
                    color: #FFFFFF;
                  }
                  .title {
                    font-size: 12px;/*no*/
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #FFFFFF;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                  }
                }
              }
            }
            .item3{
              margin: 14px 0;
              padding: 5px 10px;/*no*/
              background: linear-gradient(90deg, #F5FBFF 0%, rgba(245, 251, 255, 0) 100%);
              border: 1px solid;
              border-image: linear-gradient(270deg, rgba(201, 215, 255, 0.34), rgba(198, 227, 255, 1)) 1 1;
              font-size: 14px;/*no*/
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #5C5C5C;
              align-items: center;
              span{
                font-size: 20px;/*no*/
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #E84B17;
                margin-right: 5px;/*no*/
              }
            }
            .collection{
              display: flex;
              justify-content: flex-end;
              .btn{
                display: flex;
                padding: 7px 8px;/*no*/
                background: #265ACA;
                font-size: 12px;/*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                width: fit-content;
              }
            }
          }
        }
        .water2Trends{
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          height: 100%;
          .itemContent{
            height: 100%;
            width: 100%;
            padding: 10px;/*no*/
            background: #fff;
            .title{
              margin-bottom: 15px;/*no*/
              justify-content: space-between;
              .titleHead{
                font-size: 14px;/*no*/
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #454545;
                align-items: center;
                span{
                  width: 4px;/*no*/
                  height: 13px;/*no*/
                  background: #265ACA;
                  margin-right: 5px;/*no*/
                }
              }
              .labers {
                .laberItem{
                  font-size: 12px;/*no*/
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #3D3D3D;
                  align-items: center;
                  margin-right: 10px;/*no*/
                  span{
                    display: flex;
                    width: 10px;/*no*/
                    height: 3px;/*no*/
                    background: #19C48B;
                    border-radius: 2px;/*no*/
                    margin-right: 6px;/*no*/
                  }
                  &:last-child{
                    span{
                      background: #FA4949;
                    }
                  }
                }
              }
            }
            .chart{
              width: 100%;
              height: calc(100% - 35px);/*no*/
            }
          }
        }
        .payTable{
          margin-top: 10px;/*no*/
          padding: 10px;/*no*/
          background: #fff;
          .titleHead{
            font-size: 14px;/*no*/
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #454545;
            align-items: center;
            span{
              width: 4px;/*no*/
              height: 13px;/*no*/
              background: #265ACA;
              margin-right: 5px;/*no*/
            }
          }
          .adminComp-page-table{
            margin-top: 20px;/*no*/
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
          // padding: 20px;/*no*/
          // background: #fff;
          position: relative;
          overflow:visible;
          >div.el-tab-pane{
            height: 100%;
          }
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
  // echarts图表
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
        position: relative;
        .title{
          font-size: 14px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #5F5F5F;
          margin-bottom: 15px;/*no*/
        }
        .controller {
          display: flex;
          position: absolute;
          margin-left: 50%;
          transform: translate(-50%);
          span {
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 4px;
            font-size: 12px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #6B6B6B;
            
          }
          .isActive {
            background: #3fa2e2;
            color: #ffffff;
          }
        }
      }
    }
    .chart{
      width: 100%;
      height: 300px;
      margin-top: 50px;
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
      // background: #fff;
      position: relative;
      overflow:visible;
      >div.el-tab-pane{
        height: 100%;
      }
    }
  }
</style>

