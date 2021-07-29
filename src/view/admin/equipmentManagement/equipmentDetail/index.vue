<template>
  <div id="equipmentDetail">
    <div class="accessSelect" v-if="!editData.serialNumber">
      <div class="info flexCloumn">
        <div class="infoInput">
          <el-input placeholder="请输入设备的名称" v-model="filterText">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
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
            lazy
            ref="tree"
            :check-on-click-node="true"
            :auto-expand-parent="false"
          >
          </el-tree>
        </div>
      </div>
    </div>
    <div class="flexCloumn equipmentSelect">
      <div class="baseInfo">
        <div class="baseInfoTitle">
          {{ detailInfo.deviceName }}
          <span
            :class="{ isActive: detailInfo.status === '1' }"
            v-if="detailInfo.status"
          >
            {{ detailInfo.statusText }}
          </span>
        </div>
        <FormItemText :layout="baseInfoItems" labelWidth="0px">
          <template v-slot:productName>
            <el-button type="text" @click="goProductDetail">{{
              detailInfo.productName
            }}</el-button>
          </template>
          <template v-slot:securityKey v-if="detailInfo.securityKey">
            <div class="securityKeyInfo">
              <el-tooltip
                class="formItem value"
                effect="light"
                placement="top-start"
              >
                <div slot="content">{{ detailInfo.securityKey }}</div>
                <span>{{ detailInfo.securityKey }}</span>
              </el-tooltip>
              <el-button
                type="text"
                v-clipboard:copy="detailInfo.securityKey"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              >
                复制
              </el-button>
            </div>
          </template>
        </FormItemText>
      </div>
      <el-tabs v-model="activetTabsName" type="card" @tab-click="handleClick">
        <div class="update" @click="updateData">刷新</div>
        <el-tab-pane label="基本信息" name="1" lazy>
          <span slot="label"
            ><i class="iconfont icon-jibenxinxi1"></i> 基本信息</span
          >
          <card title="基本信息" :className="'adminCard adminCard1'">
            <el-row :gutter="10">
              <el-col :span="16">
                <FormItemText :layout="adminItem1" labelWidth="0px">
                </FormItemText>
              </el-col>
              <el-col :span="8">
                <div>位置：</div>
                <poleMap :zoom="mapZoom" :marker="mapMarker" :styleId="''" />
                <div v-if="detailInfo.address">
                  {{ detailInfo.address
                  }}{{
                    `（经度：${detailInfo.latitude} 纬度：${detailInfo.longitude}）`
                  }}
                </div>
              </el-col>
            </el-row>
          </card>
          <card title="状态信息" :className="'adminCard'">
            <FormItemText :layout="adminItem2" labelWidth="0px">
              <template v-slot:status>
                <el-tag
                  :type="detailInfo.bindStatus === 1 ? 'success' : ''"
                  v-if="
                    detailInfo.bindStatus === 0 || detailInfo.bindStatus === 1
                  "
                  >{{ detailInfo.bindStatus === 1 ? "是" : "否" }}</el-tag
                >
              </template>
              <template v-slot:activateStatus>
                <el-tag
                  :type="detailInfo.activateStatus === 1 ? 'success' : ''"
                  v-if="
                    detailInfo.activateStatus === 0 ||
                    detailInfo.activateStatus === 1
                  "
                  >{{ detailInfo.activateStatus ? "是" : "否" }}</el-tag
                >
              </template>
            </FormItemText>
          </card>
          <card title="特殊信息" :className="'adminCard'">
            <FormItemText :layout="adminItem3" labelWidth="0px"> </FormItemText>
          </card>
        </el-tab-pane>
        <el-tab-pane label="运行状态" name="2" lazy>
          <span slot="label"
            ><i class="iconfont icon-zhengzaiyunhangliebiao"></i> 运行状态</span
          >
          <div class="runningStatus">
            <div class="statusInfo">
              <swiper class="swiper" ref="swiper" :options="swiperOption">
                <swiper-slide
                  :key="`swiper${index}`"
                  v-for="(item, index) in statusItems"
                >
                  <div
                    class="flexCloumn itemInfo"
                    :class="{ 'is-active': item.id === statusIndex.id }"
                    @click.prevent.stop="changeStatus(item)"
                  >
                    <div class="itemInfoTitle">{{ item.propertiesDesc }}</div>
                    <div class="itemInfoNumber">
                      <span>{{ item.value }}</span>
                    </div>
                    <div class="time">{{ item.eventTime }}</div>
                  </div>
                </swiper-slide>
                <div
                  class="swiper-button-prev"
                  slot="button-prev"
                  @click="swiperPrev"
                ></div>
                <div
                  class="swiper-button-next"
                  slot="button-next"
                  @click="swiperNext"
                ></div>
              </swiper>
            </div>
            <div class="statusTab">
              <div class="statusLabel">
                <span
                  :style="{ background: runningOptions.labers[0].background }"
                />
                {{ runningOptions.labers[0].name }}
              </div>
              <div class="flexRow flexCenter btnList">
                <span
                  v-for="timeItem in timeItems"
                  :key="timeItem.id"
                  :class="{ 'is-active': chartTime === timeItem.id }"
                  @click="changeChartTime(timeItem.id)"
                >
                  {{ timeItem.name }}
                </span>
              </div>
              <div
                ref="runningTable"
                id="echartTable"
                v-show="
                  activetTabsName === '2' &&
                  statusIndex &&
                  statusIndex.propertiesDataType === 'Decimal'
                "
              />
              <div
                id="echartTableData"
                v-show="
                  activetTabsName === '2' &&
                  statusIndex &&
                  statusIndex.propertiesDataType === 'String'
                "
              >
                <page-table
                  col-align="center"
                  :data="chartTable"
                  :cols="[
                    {
                      label: '上报时间',
                      prop: 'eventTime',
                      minWidth: '100px',
                    },
                    {
                      label: '上报属性',
                      prop: 'propertiesName',
                      minWidth: '100px',
                    },
                    {
                      label: '上报数据',
                      prop: 'value',
                      minWidth: '100px',
                    },
                  ]"
                  :border="false"
                >
                </page-table>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="设备接入平台" name="3" lazy>
          <span slot="label"
            ><i class="iconfont icon-shebeijierupingtai"></i> 设备接入平台</span
          >
          <card title="接入平台方式" :className="'adminCard'">
            <FormItemText :layout="adminItem4" labelWidth="0px"> </FormItemText>
          </card>
          <card title="设备安全连接" :className="'adminCard'">
            <FormItemText :layout="adminItem5" labelWidth="0px">
              <template v-slot:key>
                <div class="keyWord">
                  {{ platformInfo.key }}
                  <el-button type="text" v-if="platformInfo.key"
                    >重置</el-button
                  >
                </div>
              </template>
            </FormItemText>
          </card>
        </el-tab-pane>
        <!-- <el-tab-pane
          label="订阅消息"
          name="4"
          lazy
        >
          <span slot="label"><i class="iconfont icon-chanpinxinxi"></i> 数据报文</span>
          <div class="flexCloumn newsContainer">
            <div class="flexRow nav">
              <div
              :class="newActiveId === '1' ? 'isActive' : ''"
              @click="newActiveId = '1'"
              ><span>上报消息</span></div>
              <div
              :class="newActiveId === '2' ? 'isActive' : ''"
              @click="newActiveId = '2'"
              ><span>下发指令</span></div>
            </div>
            <div class="content">
              <div v-if="newActiveId === '1'">
                <el-row :gutter="10" class="flexRow row">
                  <el-col :span="12">
                    <div class="title">请求参数</div>
                    <div class="main">
                      <page-table
                        col-align="center"
                        :data="protocolInfo.requestUpDetailDtoList"
                        :cols="requestTableCols"
                        :showPage="false"
                        :border="false"
                      >
                      </page-table>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="title">请求示例</div>
                    <div class="main" v-text="protocolInfo.requestUpProtocolTemplate">
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="10" class="flexRow row">
                  <el-col :span="12">
                    <div class="title">响应参数</div>
                    <div class="main">
                      <page-table
                        col-align="center"
                        :data="protocolInfo.responseUpDetailDtoList"
                        :cols="requestTableCols"
                        :showPage="false"
                        :border="false"
                      >
                      </page-table>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="title">响应示例</div>
                    <div class="main" v-text="protocolInfo.responseUpProtocolTemplate">

                    </div>
                  </el-col>
                </el-row>
              </div>
              <div v-if="newActiveId === '2'">
                <el-row :gutter="10" class="flexRow row">
                  <el-col :span="12">
                    <div class="title">请求参数</div>
                    <div class="main">
                      <page-table
                        col-align="center"
                        :data="protocolInfo.requestDownDetailDtoList"
                        :cols="requestTableCols"
                        :showPage="false"
                        :border="false"
                      >
                      </page-table>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="title">请求示例</div>
                    <div class="main" v-text="protocolInfo.requestDownProtocolTemplate">
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="10" class="flexRow row">
                  <el-col :span="12">
                    <div class="title">响应参数</div>
                    <div class="main">
                      <page-table
                        col-align="center"
                        :data="protocolInfo.responseDownDetailDtoList"
                        :cols="requestTableCols"
                        :showPage="false"
                        :border="false"
                      >
                      </page-table>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="title">响应示例</div>
                    <div class="main"  v-text="protocolInfo.responseDownProtocolTemplate">
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-tab-pane> -->
        <el-tab-pane label="消息跟踪" name="5" lazy>
          <span slot="label"
            ><i class="iconfont icon-dingyuexiaoxi"></i> 消息跟踪</span
          >
          <div class="flexCloumn newsContainer messageTrackContainer">
            <div class="flexRow nav">
              <div
                :class="messageTrack.activeId === '1' ? 'isActive' : ''"
                @click="changeMessageTrack('1')"
              >
                <span>上报消息</span>
              </div>
              <div
                :class="messageTrack.activeId === '2' ? 'isActive' : ''"
                @click="changeMessageTrack('2')"
              >
                <span>下发消息</span>
              </div>
            </div>
            <div class="content">
              <div v-if="messageTrack.activeId === '1'">
                <el-row :gutter="10" class="flexRow row">
                  <el-col :span="24">
                    <search-form
                      :searchItems="messageTrack.searchItems"
                      @onSearch="onMessageTrackSearch"
                    />
                    <div class="main">
                      <page-table
                        col-align="center"
                        :data="messageTrack.tableData"
                        :cols="messageTrack.tableCols"
                        :border="false"
                        :page-current="messageTrack.page.current"
                        :total="messageTrack.page.total"
                        :page-size="messageTrack.page.pageSize"
                        @current-change="onMessageTrackCurrentChange"
                        @size-change="onMessageTrackPageSizeChange"
                      >
                      </page-table>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div v-if="messageTrack.activeId === '2'">
                <el-row :gutter="10" class="flexRow row">
                  <el-col :span="24">
                    <search-form
                      :searchItems="messageTrack.searchItems"
                      @onSearch="onMessageTrackSearch"
                    />
                    <div class="main">
                      <page-table
                        col-align="center"
                        :data="messageTrack.tableData"
                        :cols="messageTrack.tableCols"
                        :border="false"
                        :page-current="messageTrack.page.current"
                        :total="messageTrack.page.total"
                        :page-size="messageTrack.page.pageSize"
                        @current-change="onMessageTrackCurrentChange"
                        @size-change="onMessageTrackPageSizeChange"
                      >
                      </page-table>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import * as echarts from "echarts"; // 引入echarts
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import Treeselect, { LOAD_CHILDREN_OPTIONS } from "@riophae/vue-treeselect";
import Flex from "@/components/flex";
import searchForm from "components/adminSearchForm/searchForm";
import FormItemText from "@/components/formItemText/formItemText";
import card from "view/lightPole/lightPoleStatistical/components/card";
import PageTable from "@/components/adminPage-table";
import PoleMap from "@/view/index/lightPoleMap/poleMap";
import echartData from "@/view/lightPole/lightPoleStatistical/components/echartData";
// 局部引入剪切板插件VueClipboard
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import { routePush } from "@/util/util";
import { getGroupPolicy, getLamp } from "api/index";
Vue.use(VueClipboard)
import {
  getDeviceModuleTree,
  getDetailByID,
  getPlatformInfo,
  getDeviceProtocolView,
  getDeviceModuleChart,
  getDeviceModuleStatus,
  getDownMessage,
  getUpMessage,
  getMessageStatus,
} from "api/admin";
import "swiper/swiper-bundle.css";

export default {
  name: "equipmentDetail",
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
  },
  data() {
    return {
      isDetail: false,
      filterText: "",
      options: [
        {
          id: 1,
          label: "一级 1",
          children: null,
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf",
      },
      activetTabsName: "1",
      detailInfo: {},
      platformInfo: {},
      protocolInfo: {
        requestDownDetailDtoList: [],
        requestDownProtocolTemplate: "",
        requestUpDetailDtoList: [],
        requestUpProtocolTemplate: "",
        responseDownDetailDtoList: [],
        responseDownProtocolTemplate: "",
        responseUpDetailDtoList: [],
        responseUpProtocolTemplate: "",
      },
      baseInfoItems: [
        {
          id: "productName",
          label: "产品名称",
          value: "",
          unit: "",
          custom: true,
          class: "noBottom",
          span: 8,
        },
        {
          id: "productNo",
          label: "产品ID",
          value: "",
          unit: "",
          class: "noBottom",
          span: 8,
        },
        {
          id: "securityKey",
          label: "设备密钥",
          value: "vfdvgfbgbgbgfbgbg",
          unit: "",
          class: "noBottom securityKey",
          custom: true,
          span: 8,
        },
      ],
      adminItem1: [
        {
          id: "imei",
          label: "IMEI号",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "deviceModuleName",
          label: "设备名称：",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "deviceTypeName",
          label: "设施类型：",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "factoryName",
          label: "厂商名称：",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "deviceName",
          label: "设备类型：",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "version",
          label: "硬件版本号",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "ratedVoltage",
          label: "电流",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "ratedCurrent",
          label: "电压：",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "ratedPower",
          label: "额定功率",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "createTime",
          label: "安装时间",
          value: "",
          unit: "",
          class: "noBottom",
          span: 8,
        },
        {
          id: "createTime",
          label: "注册时间",
          value: "",
          unit: "",
          class: "noBottom",
          span: 8,
        },
        {
          id: "createTime",
          label: "最后通讯时间",
          value: "",
          unit: "",
          class: "noBottom",
          span: 8,
        },
      ],
      adminItem2: [
        {
          id: "status",
          label: "设备关联状态",
          custom: true,
          unit: "",
          class: "noBottom",
          span: 8,
        },
        {
          id: "activateStatus",
          label: "激活状态",
          custom: true,
          unit: "",
          class: "noBottom",
          span: 8,
        },
      ],
      adminItem3: [
        {
          id: "deviceModuleName",
          label: "距离地面高度",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "deviceModuleName",
          label: "防护等级：",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "deviceModuleName",
          label: "寿命：",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "deviceModuleName",
          label: "照射角度：",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "deviceModuleName",
          label: "光照距离：",
          value: "",
          unit: "",
          span: 8,
        },
      ],
      adminItem4: [
        {
          id: "productName",
          label: "所属产品名称",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "productNo",
          label: "所属产品ID",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "platformType",
          label: "平台类型",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "protocolType",
          label: "通信协议",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "dataType",
          label: "数据格式",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "createDate",
          label: "注册设备时间",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "encryptionType",
          label: "数据加密方式",
          value: "",
          unit: "",
          span: 8,
        },
      ],
      adminItem5: [
        {
          id: "serialNumber",
          label: "设备识别码",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "key",
          label: "设备密钥",
          custom: true,
          unit: "",
          span: 16,
        },
        {
          id: "gateway",
          label: "网关ID",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "serverIP",
          label: "服务IP",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "serverPort",
          label: "服务端口",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "username",
          label: "登录账号",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "password",
          label: "登录密码",
          value: "",
          unit: "",
          span: 8,
        },
        {
          id: "url",
          label: "URL",
          value: "",
          unit: "",
          span: 8,
        },
      ],
      newActiveId: "1",
      requestTableCols: [
        { label: "请求参数", prop: "detailName" },
        { label: "参数说明", prop: "detailRemark" },
      ],
      editData: {},
      swiperOption: {
        slidesPerView: 4,
        spaceBetween: 10,
        slidesPerGroup: 4,
        loop: true,
        loopFillGroupWithBlank: true,
        autoUpdate: false,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      runningOptions: {
        title: "实时客流分析",
        labers: [
          {
            background: "#0EA89D",
            name: "光照强度",
          },
        ],
        options: {
          grid: {
            show: true,
            borderWidth: 0,
            borderColor: "#fff",
            left: "0%",
            right: "0%",
            bottom: "10%",
            containLabel: true,
          },
          tooltip: {
            show: "true",
            trigger: "item",
            position: function (p) {
              // 其中p为当前鼠标的位置
              return [p[0] + 10, p[1] - 10];
            },
            formatter:
              '<div class="toolDiv">光照强度 <br />时间：{b0}<br />{a0}: {c0}</div>',
          },
          xAxis: [
            {
              type: "category",
              data: [],
              axisLine: {
                lineStyle: {
                  color: "#D0D0D0",
                },
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                color: "#7E7E77",
              },
            },
          ],
          yAxis: [
            {
              name: "GB",
              type: "value",
              splitLine: {
                lineStyle: {
                  type: "solid",
                  color: "#D0D0D0",
                },
              },
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: "#7E7E7E",
                },
              },
              nameTextStyle: {
                color: "#FFF",
              },
              splitArea: {
                show: false,
              },
            },
          ],
          series: [
            {
              name: "光照强度",
              type: "line",
              data: [],
              symbol:
                "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAilBMVEUAAAD///+AgIBVqlVVqqoktm0ktpIgv4AVv4AUxHYPtHgPw3gNvHkNv4AMtnkLvHoKuHoKunYJvXEJtnYIu3cIuXQGvHkLv3UKuXMKtXEKunEJvXcJvnUMunULunILvHQLvnMKvXMKwHMKu3QKvHIKunYOvXQNu3MNvnQNvnQNvXMNvnMNvnMNvXNQTeEgAAAALXRSTlMAAQIDAwcHCAwNERETFBUXGRobHB4hKjAzNDQ6Oz9DREdJSUtMToSHrL/k5vb80ulWAAABv0lEQVRIx6VXa5OCMAxERHkoQhUFRARBRV7//++dc+c1KeXlZD85pquZZDdNFaUXqm5aO8dlzHV2lqmrymxohs06sA1tFnW1Zb3Yriapa5sNwl6PJ7xho9iMJK+7bAKuPsQ12AwYvdSFxWbBWsjc5Y7NxG4p/e9s7pvd/W8p56MfxUmWJXHkH6XMR2vlhdcc4Rp6I1XThdAhyPIOsuAgHEEd04T+ntK8B+lJ6DeoRdBVkA8gELTG9Yy+3F/yQVz26OC/zrEXRrhvNnbJx4NzcpYz/3Mo8u8pnwCq2va31KhH6RQ5RR3TRH0IST+KsmqaqiweA4kbQrk8rI1n3X5QP7FaPFwyFX7qDGfurxbhdYdICOdVrEykZ4H7ZiOdY42a4COUc9sByhw8ZiIv+lCrukuuoWo+ciYMgYjHi1ZCwYMRDAXF4Z9jHi9lcsmDMSc4Crgx4fFKJlc8mIAvFSgedLmRyQ10GhiIfJtHviEyKW1SwUitIomEJE+SMZAlw68tSRoGtDFEGoCk0Usb+qTrhnbRka5Y2uVOWivkheb8xUJDW6VoSxxpfaQtrrSVmbis054JtAcK8WlEfJR98Rz8AXg9H4gNQ18VAAAAAElFTkSuQmCC",
              symbolSize: 30,
              lineStyle: {
                normal: {
                  width: 3,
                  curveness: 0.2,
                  color: {
                    type: "linear",
                    colorStops: [
                      {
                        offset: 0,
                        color: "#0DBE73", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#0DA79F", // 100% 处的颜色
                      },
                    ],
                    // globalCoord: false // 缺省为 false
                  },
                },
              },
              itemStyle: {
                normal: {
                  color: "#0DA79F",
                  borderWidth: 10,
                  borderColor: "#0DBE73",
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 1,
                        color: "rgba(72, 231, 181, 0.62)",
                      },
                      {
                        offset: 0,
                        color: "rgba(223, 255, 233, 0.18)",
                      },
                    ]),
                  },
                },
              },
              // animationEasing: 'cubicInOut',
              animationDuration: 1000,
              smooth: true,
            },
          ],
        },
      },
      messageTrack: {
        activeId: "1",
        searchVal: {},
        searchItems: [
          {
            type: "select",
            label: "时间",
            labelWidth: "120px",
            props: {
              fieldName: "time",
              options: [],
            },
          },
          {
            type: "input",
            label: "消息ID",
            labelWidth: "120px",
            props: {
              fieldName: "code",
              options: [],
            },
          },
          {
            type: "select",
            label: "状态",
            labelWidth: "120px",
            props: {
              fieldName: "respondStatus",
              options: [],
            },
          },
        ],
        page: {
          current: 1,
          pageSize: 10,
          total: 0,
        },
        tableData: [],
        tableCols: [
          { label: "时间", prop: "eventTime", minWidth: "100px" },
          { label: "消息ID", prop: "capabilityName" },
          { label: "设备ID", prop: "serialNumber" },
          { label: "设备名称", prop: "deviceName" },
          { label: "消息内容", prop: "reportData", minWidth: "150px" },
          { label: "应答内容", prop: "respondData", minWidth: "150px" },
          { label: "消息状态", prop: "respondStatus" },
        ],
      },
      mapZoom: 8,
      mapMarker: [],
      chartTime: 1,
      statusItems: [],
      statusIndex: {
        propertiesDataType: "Decimal",
      },
      timeItems: [
        {
          id: 1,
          name: "近1小时",
        },
        {
          id: 2,
          name: "近7小时",
        },
        {
          id: 3,
          name: "近24小时",
        },
        {
          id: 4,
          name: "近7天",
        },
      ],
      tableChart: null,
      chartTable: [],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.editData =
        this.routeName === "equipmentListDetail" &&
        this.common["equipmentListDetail"];
      if (this.editData && this.editData.id) {
        this.isDetail = true;
        this.nodeClick({
          id: this.editData.id,
          type: "DEVICE",
        });
      }
      this.$set(
        this.messageTrack.searchItems[0].props,
        "options",
        this.timeItems
      );
      getMessageStatus().then((res) => {
        if (res.code === "200") {
          const messageStatus = res.data.map((data) => {
            return {
              id: data.key,
              name: data.value,
            };
          });
          this.$set(
            this.messageTrack.searchItems[2].props,
            "options",
            messageStatus
          );
        }
      });
    });
  },
  computed: {
    ...mapGetters(["common", "openPage"]),
    routeName() {
      return this.$route.name;
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleClick(tag) {
      this.activetTabsName = tag.name;
      if (tag.name === "2") {
        setTimeout(() => {
          this.initTable();
        }, 500);
      }
      if (tag.name === "5") {
        this.onMessageTrackCurrentChange(1);
      }
    },
    initTable() {
      this.tableChart = echarts.init(this.$refs["runningTable"]);
      this.tableChart.setOption(this.runningOptions.options);
      window.addEventListener("resize", () => {
        this.tableChart.resize();
      });
    },
    _getDeviceModuleTree(data, resolve) {
      getDeviceModuleTree(data).then((res) => {
        if (res.code === "200") {
          const treeData = res.data.map((daItem) => {
            return {
              id: daItem.id,
              type: daItem.type,
              label: daItem.label,
              leaf:
                (daItem.children && daItem.children.length === 0) ||
                daItem.type === "DEVICE",
              children: null,
            };
          });
          resolve(treeData);
        }
      });
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this._getDeviceModuleTree(
          {
            type: "",
            id: 0,
          },
          resolve
        );
      }
      if (node.level >= 1) {
        this._getDeviceModuleTree(
          {
            type: node.data.type,
            id: node.data.id,
          },
          resolve
        );
      }
    },
    nodeClick(data) {
      if (data.id && data.type === "DEVICE") {
        this.editData = {
          ...this.editData,
          id: data.id,
        };
        this.activetTabsName = "1";
        this._getDetailByID(data.id);
        this._getPlatformInfo({ id: data.id, type: data.type });
        this._getDeviceProtocolView({ id: data.id, type: data.type });
      }
    },
    _getDetailByID(id) {
      getDetailByID(id).then(async (res) => {
        if (res.code === "200") {
          this.mapMarker = [
            {
              longitude: res.data.longitude,
              latitude: res.data.latitude,
              status: 1,
            },
          ];
          this.mapZoom = 13;
          this.detailInfo = res.data;
          let adminItem3 = [];
          this.baseInfoItems = await this.$_setItem(
            this.baseInfoItems,
            res.data
          );
          this.adminItem1 = await this.$_setItem(this.adminItem1, res.data);
          this.adminItem2 = await this.$_setItem(this.adminItem2, res.data);
          const extengLength = res.data.deviceModuleExtendList.length % 3;
          const extendBottom = extengLength - (extengLength % 3);
          if (
            res.data.deviceModuleExtendList &&
            res.data.deviceModuleExtendList.length > 0
          ) {
            res.data.deviceModuleExtendList.map((listItem, index) => {
              adminItem3.push({
                id: listItem.fieldNo,
                label: listItem.fieldName,
                value: listItem.fieldValue,
                class: extendBottom >= index ? "noBottom" : "",
                span: 8,
              });
            });
          }
          this.adminItem3 = adminItem3;
          this._getDeviceModuleStatus(res.data.serialNumber);
        }
      });
    },
    _getPlatformInfo(data) {
      getPlatformInfo(data).then(async (res) => {
        if (res.code === "200") {
          this.platformInfo = res.data;
          this.adminItem4 = await this.$_setItem(this.adminItem4, res.data);
          this.adminItem5 = await this.$_setItem(this.adminItem5, res.data);
        }
      });
    },
    _getDeviceProtocolView(data) {
      getDeviceProtocolView(data).then(async (res) => {
        if (res.code === "200") {
          this.protocolInfo = res.data;
        }
      });
    },
    _getDeviceModuleStatus(serialNumber) {
      getDeviceModuleStatus(serialNumber).then((res) => {
        if (res.code === "200") {
          if (res.data && res.data.length > 0) {
            this.statusItems = res.data;
            console.log(this.statusItems);
            // this.statusIndex = res.data[0];
            this.changeStatus(res.data[0]);
          }
        }
      });
    },
    _getDeviceModuleChart(data) {
      getDeviceModuleChart(data).then((res) => {
        if (res.code === "200") {
          const propertiesName =
            res.data && res.data.length > 0 ? res.data[0].propertiesName : "";
          this.chartTable = res.data;
          const timeOption = res.data.map((data) => {
            return data.time;
          });
          const valueOption = res.data.map((data) => {
            return data.value;
          });
          this.$set(this.runningOptions.options.xAxis[0], "data", timeOption);
          this.$set(
            this.runningOptions.options.series[0],
            "name",
            propertiesName
          );
          this.$set(this.runningOptions.options.series[0], "data", valueOption);
          this.$set(this.runningOptions.labers[0], "name", data.propertiesDesc);
          this.$set(
            this.runningOptions.options.tooltip,
            "formatter",
            `<div class="toolDiv">${data.propertiesDesc} <br />时间：{b0}<br />{a0}: {c0}</div>`
          );
          this.tableChart = echarts.init(this.$refs["runningTable"]);
          this.tableChart.setOption(this.runningOptions.options);
        }
      });
    },
    swiperPrev() {
      this.$refs.swiper.$swiper.slidePrev();
    },
    swiperNext() {
      this.$refs.swiper.$swiper.slideNext();
    },
    showRunningView() {},
    // 复制成功
    onCopy(e) {
      this.$notify({
        title: "成功",
        message: "设备密钥复制成功",
        type: "success",
        position: "bottom-right",
      });
    },
    // 复制失败
    onError(e) {
      this.$notify.error({
        title: "失败",
        message: "设备密钥复制失败!!!",
        position: "bottom-right",
      });
    },
    onMessageTrackSearch(val) {
      this.messageTrack.searchVal = {
        ...val,
      };
      this.onMessageTrackCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getMessageTrackDataAllList() {
      let data = {
        data: {
          ...this.messageTrack.searchVal,
          serialNumber: this.detailInfo.serialNumber,
        },
        pageNo: Number(this.messageTrack.page.current), // 查询的分页页码
        pageSize: Number(this.messageTrack.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: "",
      };
      const activeId = this.messageTrack.activeId;
      if (activeId === "1") {
        this._getUpMessage(data);
      } else {
        this._getDownMessage(data);
      }
    },
    changeMessageTrack(activeId) {
      this.messageTrack.activeId = activeId;
    },
    // 分页切换页面
    onMessageTrackCurrentChange(val) {
      this.messageTrack.page.current = val;
      this.getMessageTrackDataAllList();
    },
    onMessageTrackPageSizeChange(val) {
      this.messageTrack.page.pageSize = val;
      this.onMessageTrackCurrentChange(1);
    },
    changeChartTime(timeId) {
      if (timeId !== this.chartTime) {
        this.chartTime = timeId;
        this._getDeviceModuleStatus(this.detailInfo.serialNumber);
      }
    },
    changeStatus(item) {
      this.statusIndex = item;
      this._getDeviceModuleChart({
        capabilityCode: item.capabilityCode,
        productNo: item.productNo,
        propertiesName: item.propertiesName,
        serialNumber: item.serialNumber,
        time: this.chartTime,
        propertiesDesc: item.propertiesDesc,
      });
    },
    updateData() {
      this.activetTabsName = "1";
      this.messageTrack.activeId = "1";
      this.tableData = [];
      this.nodeClick({
        id: this.editData.id,
        type: "DEVICE",
      });
    },
    _getDownMessage(parames) {
      getDownMessage(parames).then((res) => {
        if (res.code === "200") {
          const { data, total } = res.data;
          this.messageTrack.page.total = total;
          this.messageTrack.tableData = data;
        }
      });
    },
    _getUpMessage(parames) {
      getUpMessage(parames).then((res) => {
        if (res.code === "200") {
          const { data, total } = res.data;
          this.messageTrack.page.total = total;
          this.messageTrack.tableData = data;
        }
      });
    },
    goProductDetail() {
      routePush({
        title: "产品管理详情",
        name: "productManagementPage",
        parames: {
          id: this.detailInfo.productId,
          toName: "equipmentDetail",
        },
      });
    },
  },
};
</script>
<style lang="less">
#equipmentDetail {
  display: flex;
  flex-direction: row;
  .accessSelect {
    flex: 2;
    height: 100%;
    padding-right: 20px; /*no*/
    .info {
      height: 100%;
      background: #fff;
      .infoInput {
        padding: 15px 10px; /*no*/
        border-bottom: 1px solid rgba(238, 238, 238, 1); /*no*/
        input {
          background: rgba(255, 255, 255, 1);
          border-radius: 5px; /*no*/
          border: 1px solid rgba(165, 186, 250, 1); /*no*/
          line-height: 30px !important; /*no*/
        }
        .el-input__suffix {
          display: flex;
          align-items: center;
          padding-left: 8px; /*no*/
          cursor: pointer;
          &::after {
            position: relative;
            content: "";
            width: 1px; /*no*/
            height: 17px; /*no*/
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            background: #d0d0d0;
          }
          i {
            font-size: 23px; /*no*/
            color: #4a80f5;
          }
        }
      }
      .infoTree {
        height: calc(100% - 61px); /*no*/
        padding-bottom: 20px; /*no*/
        .el-tree {
          height: 100%;
          overflow: auto;
        }
      }
    }
  }
  .equipmentSelect {
    flex: 8;
    overflow-y: auto;
    &::-webkit-scrollbar-track-piece {
      //滚动条凹槽的颜色，还可以设置边框属性
      background-color: #ebebeb;
    }
    &::-webkit-scrollbar {
      //滚动条的宽度
      width: 4px;
      height: 2px;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      //滚动条的设置
      background-color: #b6b5b5;
      background-clip: padding-box;
      min-height: 28px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: #b6b5b5;
    }
    .update {
      position: absolute;
      right: 0px;
      top: -45px; /*no*/
      display: inline-block;
      width: auto;
      height: auto !important;
      padding: 5px 8px; /*no*/
      background: rgba(255, 255, 255, 1);
      border-radius: 3px; /*no*/
      border: 1px solid rgba(163, 192, 255, 1); /*no*/
      font-size: 12px; /*no*/
      line-height: 12px; /*no*/
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(38, 92, 245, 1);
      cursor: pointer;
    }
    #formItemText {
      .el-form-item {
        .el-form-item__content {
          color: rgba(73, 73, 73, 1);
          .keyWord {
            display: inline-block;
            button {
              padding: 0;
            }
          }
        }
      }
    }
    .baseInfo {
      background: #fff;
      padding: 20px; /*no*/
      margin-bottom: 10px; /*no*/
      .baseInfoTitle {
        font-size: 16px; /*no*/
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(85, 85, 85, 1);
        margin-bottom: 15px; /*no*/
        span {
          background: #a6a6a6;
          border-radius: 10px; /*no*/
          padding: 2px 11px; /*no*/
          font-size: 12px; /*no*/
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          margin-left: 10px; /*no*/
          &.isActive {
            background: rgba(30, 198, 147, 1);
          }
        }
      }
      #formItemText {
        .securityKey {
          .flexRow {
            display: flex;
            flex-direction: row;
            word-break: keep-all;
            overflow: hidden;
            .securityKeyInfo {
              width: 50%;
              display: flex;
              flex-direction: row;
            }
          }
        }
        .el-button--text {
          padding: 0;
          font-size: 12px; /*no*/
          height: 17px !important; /*no*/
          line-height: 17px; /*no*/
          span {
            display: flex;
            align-items: center;
          }
        }
      }
    }
    .el-tabs {
      height: 100%;
      .el-tabs__header {
        border-color: #d5d5d5;
        margin-bottom: 10px; /*no*/
        .el-tabs__nav-next,
        .el-tabs__nav-prev {
          z-index: 1;
        }
        .el-tabs__nav {
          .el-tabs__item {
            background: rgba(255, 255, 255, 1);
            font-size: 14px; /*no*/
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(69, 69, 69, 1);
            margin-right: 4px; /*no*/
            i {
              font-size: 15px; /*no*/
              color: #a6a6a6;
            }
            &.is-active {
              background: rgba(38, 90, 202, 1);
              color: rgba(255, 255, 255, 1);
              border-bottom: none;
              i {
                color: #fff;
              }
            }
          }
        }
      }
      .el-tabs__content {
        height: calc(100% - 56px); /*no*/
        position: relative;
        overflow: visible;
        > div.el-tab-pane {
          height: 100%;
          // &:first-child{
          #card {
            background: #fff;
            margin-bottom: 10px; /*no*/
            padding-top: 40px; /*no*/
            padding-right: 20px; /*no*/
            padding-left: 20px; /*no*/
            .cardTitle {
              color: #333333;
              font-weight: normal;
            }
            &.adminCard1 {
              > div.el-row {
                padding-bottom: 10px; /*no*/
                display: flex;
                align-items: center;
                .el-col {
                  &:last-child {
                    #poleMap {
                      height: 100px; /*no*/
                      margin: 10px 0; /*no*/
                      .readyMap {
                        height: 100%;
                      }
                    }
                  }
                }
              }
            }
          }
          // }
        }
        .newsContainer {
          height: 100%;
          .nav {
            width: 100%;
            height: auto;
            position: relative;
            > div {
              position: relative;
              cursor: pointer;
              height: 0;
              width: 180px; /*no*/
              border-bottom: 30px solid #8ca7e5; /*no*/
              border-right: 15px solid transparent; /*no*/
              &:first-child {
                position: absolute;
                width: 90px; /*no*/
                z-index: 1;
              }
              span {
                position: absolute;
                top: 8px; /*no*/
                right: 5px; /*no*/
                font-size: 14px; /*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
              }
              &.isActive {
                border-color: #2359d9;
              }
            }
          }
          .content {
            background: #fff;
            padding: 10px; /*no*/
            height: calc(100% - 29px); /*no*/
            > div {
              height: 100%;
            }
            .row {
              height: calc(100% - 51%);
              &:first-child {
                margin-bottom: 15px; /*no*/
              }
              .el-col {
                display: flex;
                flex-direction: column;
                .title {
                  font-size: 16px; /*no*/
                  font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                  color: rgba(69, 69, 69, 1);
                  margin-bottom: 10px; /*no*/
                }
                .main {
                  height: calc(100% - 32px); /*no*/
                  border: 1px solid rgba(220, 220, 220, 1); /*no*/
                  .adminComp-page-table {
                    height: 100%;
                    .el-table {
                      height: 100%;
                      .el-table__header-wrapper {
                        thead {
                          tr {
                            th {
                              background: #ebefff;
                            }
                          }
                        }
                      }
                      .el-table__body-wrapper {
                        height: calc(100% - 38px); /*no*/
                        overflow: auto;
                      }
                    }
                  }
                }
                &:last-child {
                  .main {
                    height: 100%;
                    background: rgba(243, 244, 249, 1);
                    overflow: auto;
                  }
                }
              }
            }
          }
        }
        .messageTrackContainer {
          .content {
            .row {
              height: 100%;
              .el-table {
                height: calc(100% - 62px) !important; /*no*/
              }
            }
          }
        }
        .runningStatus {
          .statusInfo {
            margin-bottom: 10px; /*no*/
            .itemInfo {
              padding: 20px; /*no*/
              background: rgba(255, 255, 255, 1) url(./images/img3.png)
                no-repeat;
              background-position: calc(100% - 10px) 100%; /*no*/
              background-size: 58px 36px; /*no*/
              box-shadow: 0px 2px 6px 0px rgba(171, 171, 171, 0.5); /*no*/
              border-radius: 4px; /*no*/
              cursor: pointer;
              .itemInfoTitle {
                font-size: 14px; /*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(57, 57, 57, 1);
              }
              .itemInfoNumber {
                width: 100%;
                font-size: 12px; /*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(106, 106, 106, 1);
                margin: 6px 0; /*no*/
                span {
                  display: block;
                  width: 100%;
                  font-size: 38px;
                  font-family: DINAlternate-Bold, DINAlternate;
                  font-weight: bold;
                  color: rgba(255, 102, 29, 1);
                  line-height: 45px;
                  letter-spacing: 1px; /*no*/
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
              .time {
                font-size: 12px; /*no*/
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(115, 115, 115, 1);
              }
              &.is-active {
                border: 1px solid rgba(30, 83, 197, 1); /*no*/
                background: linear-gradient(
                  135deg,
                  rgba(255, 255, 255, 1) 0%,
                  rgba(246, 250, 255, 1) 100%
                );
                background: rgba(255, 255, 255, 1) url(./images/img2.png)
                  no-repeat;
                background-position: calc(100% - 10px) 100%; /*no*/
                background-size: 58px 36px; /*no*/
              }
            }
            .swiper-button-prev,
            .swiper-button-next {
              width: 28px; /*no*/
              height: 28px; /*no*/
              background: rgba(64, 64, 64, 0.43);
              box-shadow: 0px 4px 4px 0px rgba(208, 216, 243, 0.5); /*no*/
              border-radius: 50%;
              &::after {
                font-size: 10px; /*no*/
                color: #ffffff;
              }
            }
          }
          .statusTab {
            padding: 20px; /*no*/
            background: #fff;
            position: relative;
            .statusLabel {
              position: absolute;
              bottom: 20px; /*no*/
              right: 20px; /*no*/
              font-size: 12px; /*no*/
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(61, 61, 61, 1);
              display: flex;
              align-items: center;
              span {
                display: inline-block;
                width: 14px; /*no*/
                height: 4px; /*no*/
                border-radius: 2px; /*no*/
                margin-right: 5px; /*no*/
              }
            }
            .btnList {
              span {
                padding: 5px 10px; /*no*/
                cursor: pointer;
                border-radius: 4px; /*no*/
                font-size: 12px; /*no*/
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #6b6b6b;
                &.is-active {
                  background: rgba(63, 162, 226, 1);
                  color: rgba(255, 255, 255, 1);
                }
              }
            }
            #echartTable {
              height: 450px;
              // >div, canvas{
              //   width: 100% !important;
              // }
            }
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

