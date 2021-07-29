/* eslint-disable camelcase */
<template>
  <div id="smokeMap">
    <div class="map">
      <div class="topo" style="zindex: 1">
        <ul class="topoItems">
          <li
            class="topoItem"
            v-for="(item, index) in arrangeList"
            :key="index"
            :class="{
              error: item.alarmCount > 0,
              handPand: arrangeIndex === index,
            }"
          >
            <div class="flexCloumn topoInfo">
              <span
                >报警：<span>{{ item.alarmCount }}</span></span
              >
              <span
                >总数：<span>{{ item.deviceCount || 0 }}</span></span
              >
            </div>
          </li>
        </ul>
      </div>
      <div class="topo" ref="topo">
        <img src="../images/img16.png" />
        <ul class="topoItems">
          <li
            class="topoItem"
            v-for="(item, index) in arrangeList"
            :key="index"
            :class="{
              error: item.alarmCount > 0,
              handPand: arrangeIndex === index,
            }"
            @click="topoDetail(item)"
          >
            <span class="img" />
            <!-- <div class="flexCloumn topoInfo">
              <span>报警：<span>{{item.alarmCount}}</span></span>
              <span>总数：<span>{{item.deviceCount || 0}}</span></span>
            </div> -->
          </li>
        </ul>
      </div>
      <div class="infoContent infoCenter" @click="goMonitoring">
        <span class="title">烟感总数</span>
        <span class="number">{{ init1Data.totalCount }}</span>
      </div>
      <div class="infoContent infoLeft">
        <el-row>
          <el-col :span="24">
            <div class="l_item_1">
              <div class="item_title">
                <span>烟感设备运行状态</span>
              </div>
              <div class="detail">
                <img src="../images/img4.png" />
                <img src="../images/img6.png" />
              </div>
              <div id="l_smokechar_1"></div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="l_item_2" :dur="8" :color="['#02368E', '#3377E3']">
              <div class="item_title">
                <span>报警趋势</span>
              </div>
              <div class="charTitle">
                <span
                  :class="{ 'is-active': trendId === '1' }"
                  @click="changeTrend('1')"
                  >本日</span
                >
                <span
                  :class="{ 'is-active': trendId === '2' }"
                  @click="changeTrend('2')"
                  >近一周</span
                >
                <span
                  :class="{ 'is-active': trendId === '3' }"
                  @click="changeTrend('3')"
                  >近30天</span
                >
              </div>
              <div id="l_smokechar_2"></div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="l_item_3" :dur="8" :color="['#02368E', '#3377E3']">
              <div class="item_title">
                <span>故障报警率分析</span>
              </div>
              <div class="charTitle">
                <span
                  :class="{ 'is-active': alarmId === '1' }"
                  @click="changeAlarm('1')"
                  >本月</span
                >
                <span
                  :class="{ 'is-active': alarmId === '2' }"
                  @click="changeAlarm('2')"
                  >本年</span
                >
              </div>
              <div id="l_smokechar_3"></div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="infoContent infoRight">
        <el-row>
          <el-col :span="24">
            <div class="l_item_4" :dur="8" :color="['#02368E', '#3377E3']">
              <div class="item_title">
                <span>报警确认统计</span>
              </div>
              <div class="flexRow">
                <div id="l_smokechar_4"></div>
                <div class="flexCloumn detail">
                  <div class="flexRow">
                    <div class="icon">
                      <i class="iconfont icon-yingyongguanli" />
                    </div>
                    <div class="mainInfo">
                      <span>报警数</span>
                      <span>{{ init4Data.alarmCount }}</span>
                    </div>
                  </div>
                  <div class="flexRow">
                    <div class="icon">
                      <i class="iconfont icon-yingyongguanli" />
                    </div>
                    <div class="mainInfo">
                      <span>未处理报警</span>
                      <span>{{ init4Data.unConfirmAlarmCount }}</span>
                    </div>
                  </div>
                  <div class="flexRow">
                    <div class="icon">
                      <i class="iconfont icon-yingyongguanli" />
                    </div>
                    <div class="mainInfo">
                      <span>隐患数</span>
                      <span>{{ init4Data.warningCount }}</span>
                    </div>
                  </div>
                  <div class="flexRow">
                    <div class="icon">
                      <i class="iconfont icon-yingyongguanli" />
                    </div>
                    <div class="mainInfo">
                      <span>未处理隐患</span>
                      <span>{{ init4Data.unConfirmWarningCount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="l_item_5" :dur="8" :color="['#02368E', '#3377E3']">
              <div class="item_title">
                <span>实时告警</span>
                <p class="more" @click="handleMoreAlarm">更多</p>
              </div>
              <div id="l_smokechar_5">
                <vue-seamless-scroll
                  :data="listData"
                  :classOption="{
                    step: 0.5,
                    autoPlay: true,
                  }"
                  class="seamless-warp"
                >
                  <ul class="item">
                    <li v-for="(item, index) in listData" :key="index">
                      <div class="flexRow seamlessInfo">
                        <div class="flexCloumn">
                          <div class="flexRow titleInfo">
                            <span class="title" v-text="item.deviceName"></span>
                            <span
                              class="alarmType"
                              v-text="item.alarmName"
                            ></span>
                          </div>
                          <div class="timeInfo" v-text="item.alarmTime"></div>
                        </div>
                        <div class="status">
                          <span v-text="item.alarmStatusText">未处理 </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </vue-seamless-scroll>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="l_item_6" :dur="8" :color="['#02368E', '#3377E3']">
              <div class="item_title">
                <span>消防通道违停统计</span>
              </div>
              <div class="charTitle">
                <span
                  :class="{ 'is-active': disobeyId === '1' }"
                  @click="changeDisobey('1')"
                  >本日</span
                >
                <span
                  :class="{ 'is-active': disobeyId === '2' }"
                  @click="changeDisobey('2')"
                  >本周</span
                >
                <span
                  :class="{ 'is-active': disobeyId === '3' }"
                  @click="changeDisobey('3')"
                  >本月</span
                >
              </div>
              <div id="l_smokechar_6"></div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="smokeErrorContainer" v-if="smokeError.show">
      <div class="close" @click="smokeError.show = false">
        <i class="el-icon-close" />
      </div>
      <div class="flexCloumn errorMain">
        <div class="errorImg">
          <videoAddress
            :srcUrl="smokeError.items[0] && smokeError.items[0].videoUrl"
            :serialNumber="
              smokeError.items[0] && smokeError.items[0].serialNumber
            "
            v-if="smokeError.show"
          />
          <!-- <video :src="smokeError.video" /> -->
          <!-- <img :src="smokeError.img" /> -->
          <div class="errorTitle">
            {{ smokeError.items[0] && smokeError.items[0].deviceName }}附近画面
          </div>
        </div>
        <el-collapse
          @change="handleCollapseChange"
          v-model="smokeError.collapseActiveNames"
        >
          <el-collapse-item
            v-for="(item, index) in smokeError.items"
            :key="index"
            :name="`${index}`"
          >
            <template slot="title">
              <div class="flexRow tabTitle">
                <div class="tabIcon">
                  <i class="iconfont icon-yingjiguangbo" />
                </div>
                {{ item.deviceName }}
              </div>
            </template>
            <div class="correct">
              <FormItemText
                :layout="[
                  {
                    id: 'a',
                    label: '报警位置',
                    value: `${item.installAddress || ''}`,
                    span: 24,
                  },
                  {
                    id: 'b',
                    label: '通道位置',
                    value: `${item.access || ''}`,
                    span: 24,
                  },
                  {
                    id: 'c',
                    label: '告警编号',
                    value: `${item.alarmNo || ''}`,
                    span: 24,
                  },
                  {
                    id: 'd',
                    label: '告警时间',
                    value: `${item.alarmTime || ''}`,
                    span: 24,
                  },
                  {
                    id: 'e',
                    label: '告警类型',
                    value: `${item.alarmStatusText || ''}`,
                    class: 'alarmType',
                    span: 24,
                  },
                  {
                    id: 'f',
                    label: '消防安全负责人',
                    value: `${item.securityUser || ''}`,
                    span: 24,
                  },
                  {
                    id: 'g',
                    label: '消防联系电话',
                    value: `${item.securityUserTel || ''}`,
                    span: 24,
                  },
                  {
                    id: 'h',
                    custom: true,
                    label: '火警情况',
                    value: `${item.fireControlTypeText || ''}`,
                    span: 24,
                  },
                ]"
                labelWidth="0px"
              >
                <template slot="h">
                  {{ item.fireControlTypeText }}
                  <div class="flexRow smokeErrorBtnList">
                    <el-button type="primary" @click="currentSituation(item)">
                      <i class="iconfont icon-dianji" />
                      现场情况</el-button
                    >
                  </div>
                </template>
              </FormItemText>
              <div class="flexRow smokeErrorBtnList">
                <el-button type="primary" @click="contactCheck(item)">
                  <i class="iconfont icon-dianji" />
                  联系安全员现场核查</el-button
                >
                <el-button type="primary" @click="clearError(item)">
                  <i class="iconfont icon-dianji" />
                  消除告警</el-button
                >
                <el-button type="primary" @click="alarmLink(item)">
                  <i class="iconfont icon-dianji" />
                  报警联动</el-button
                >
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <dialog-cont
      @on-cancel="smokerListCancel"
      @on-confirm="smokerListSubmit"
      :visible.sync="smokerList.show"
      :confirmShow="false"
      :cancelShow="false"
      width="750px"
      title="烟感设备列表"
      :customClass="'smokerListDialog'"
      append-to-body
    >
      <search-form
        ref="smokerListSearchForm"
        :searchItems="smokerList.searchItems"
        @onSearch="onSmokerListSearch"
      >
      </search-form>
      <page-table
        col-align="center"
        :data="smokerList.tableData"
        :cols="smokerList.tableCols"
        :page-current="smokerList.page.current"
        :total="smokerList.page.total"
        :page-size="smokerList.page.pageSize"
        @current-change="onSmokerListCurrentChange"
        @size-change="onSmokerListPageSizeChange"
        @row-current-change="onSmokerListSelectionChange"
      >
      </page-table>
    </dialog-cont>
    <dialog-cont
      @on-cancel="smokerAlarmCancel"
      @on-confirm="smokerAlarmSubmit"
      :visible.sync="smokerAlarm.show"
      :confirmShow="false"
      :cancelShow="false"
      width="750px"
      title="烟感告警信息"
      append-to-body
      :customClass="'smokerListDialog'"
    >
      <search-form
        ref="smokerAlarmSearchForm"
        :searchItems="smokerAlarm.searchItems"
        @onSearch="onSmokerAlarmSearch"
      >
      </search-form>
      <page-table
        col-align="center"
        :data="smokerAlarm.tableData"
        :cols="smokerAlarm.tableCols"
        :page-current="smokerAlarm.page.current"
        :total="smokerAlarm.page.total"
        :page-size="smokerAlarm.page.pageSize"
        @current-change="onSmokerAlarmCurrentChange"
        @size-change="onSmokerAlarmPageSizeChange"
        @row-current-change="onSmokerAlarmSelectionChange"
      >
      </page-table>
    </dialog-cont>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import * as echarts from "echarts"; // 引入echarts
import vueSeamlessScroll from "vue-seamless-scroll";
import store from "@/store";
import { BmGeolocation, BmMarker } from "vue-baidu-map-v3/components";
import searchForm from "@/components/searchForm/searchForm";
import FormItemText from "@/components/formItemText/formItemText";
import dialogCont from "@/components/dialog";
import PageTable from "@/components/page-table";
import videoAddress from "./videoAddress";
import {
  getSmokeDetectorAlarmByCondition,
  getSmokeDetectorDeviceForPage,
  getSmokeDetectorRunStatus,
  getSmokeDetectorTrend,
  getSmokeDetectorConfirmStatistics,
  getSmokeDetectorRealTimeAlarm,
  getSmokeDetectorAlarmForPage,
  getSmokeDetectorAlarmLevel,
  getSmokeDetectorAlarmAndFaultStats,
  getFireAccessStats,
  clearSmokeDetectorAlarm,
  getSmokeDetectorArrange,
  getSmokeDetectorOnLineStatus,
} from "api/smokeDetectorMap";
// import homeJson from '../home.json';
import smokeErrorImg from "../images/smokeErrorImg.png";
/** 1:灯带、2：灯杆 */
/**
 * 充电桩使用状态：batteryInUse   1:停用；2：闲置；3：使用中
 * 充电桩设备状态：batteryStatus 1:在线，2：故障
 */
/** 空气质量 */
const airQuality = {
  优: "green",
  良好: "greent",
  轻度污染: "yellow",
  重度污染: "orange",
};

export default {
  name: "smokeMap",
  data() {
    return {
      init1Data: {},
      init2Data: {},
      init3Data: {},
      init4Data: {},
      init5Data: {},
      init6Data: {},
      center: "广东",
      titleTypeIndex: "smoke",
      titleTypeList: [
        {
          id: "smoke",
          name: "智慧烟感",
        },
        {
          id: "entrance",
          name: "智慧门禁",
        },
      ],
      bmMarkers: [],
      zoom: 8,
      listData: [],
      disobeyId: null,
      trendId: null,
      alarmId: null,
      smokeError: {
        show: false,
        video: undefined,
        index: undefined,
        img: smokeErrorImg,
        collapseActiveNames: "0",
        items: [],
      },
      smokerList: {
        show: false,
        searchVal: {},
        searchItems: [
          {
            type: "input",
            label: "设备名称",
            props: {
              fieldName: "deviceName",
            },
          },
          {
            type: "select",
            label: "设备状态",
            props: {
              fieldName: "onlineStatus",
              options: [],
            },
          },
        ],
        tableData: [],
        tableCols: [
          { label: "区域", prop: "areaName" },
          { label: "设备名称", prop: "deviceName" },
          {
            label: "位置",
            prop: "installAddress",
            // render: (h, scoped) => {
            //   return (
            //     <div>{`${scoped.row.parkName}-${scoped.row.buildingName}-${scoped.row.floorName}`}</div>
            //   )
            // }
          },
          { label: "设备状态", prop: "onlineStatusText" },
          { label: "告警状态", prop: "alarmStatusText" },
        ],
        page: {
          current: 1,
          pageSize: 10,
          total: 0,
        },
      },
      smokerAlarm: {
        show: false,
        searchVal: {},
        searchItems: [
          {
            type: "dataPicker",
            label: "时间",
            labelWidth: "40px",
            props: {
              fieldName: "time",
              type: "daterange",
              format: "yyyy-MM-dd HH:mm:ss",
            },
          },
          {
            type: "select",
            label: "告警级别",
            labelWidth: "60px",
            props: {
              fieldName: "alarmLevel",
              options: [],
            },
          },
        ],
        tableData: [],
        tableCols: [
          { label: "告警级别", prop: "alarmLevelText" },
          { label: "告警类型", prop: "alarmName" },
          { label: "告警设备", prop: "deviceName" },
          { label: "告警时间", prop: "alarmTime", minWidth: "110px" },
          { label: "告警状态", prop: "alarmProStatusText" },
        ],
        page: {
          current: 1,
          pageSize: 10,
          total: 0,
        },
      },
      dataModel: null,
      arrangeList: [],
      arrangeIndex: 0,
      arrangetime: null,
      updateTime: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.init();
        this.init1();
        this.changeTrend("3");
        this.changeAlarm("1");
        this.init4();
        this.init5();
        this.changeDisobey("1");
      }, 1000);
      // let updateTime = null;
      clearInterval(this.updateTime);
      if (this.$store.state.updateTime.alarmCallTime) {
        this.updateTime = setInterval(
          this.allInit,
          this.$store.state.updateTime.smokeDetectorTime * 1000
        );
      }
    });
  },
  components: {
    FormItemText,
    dialogCont,
    PageTable,
    searchForm,
    vueSeamlessScroll,
    BmGeolocation,
    BmMarker,
    videoAddress,
  },
  computed: {
    ...mapGetters(["common", "openPage"]),
  },
  watch: {
    $route: {
      deep: true,
      handler(newValue) {},
    },
  },
  methods: {
    async allInit() {
      clearInterval(this.arrangetime);
      this.arrangetime = null;
      if (this.openPage === "smokeDetectorMap") {
        setTimeout(() => {
          this.init1();
          this.init4();
        }, 2000);
        setTimeout(() => {
          this.changeTrend("3");
          this.changeAlarm("1");
        }, 5000);
        this.init();
        this.init5();
        this.changeDisobey("1");
      } else {
        this.updateTime && clearInterval(this.updateTime);
      }
    },
    // handler ({ BMap, map }) {
    //   let mapStyle = {style: 'midnight'};
    //   setTimeout(async () => {
    //     map.setMapStyleV2({
    //       styleId: '02b81ab7cd95f6aece86c3500bf9b3cf'
    //     });
    //     this.baiduMapShow = true;
    //   }, 550);
    // },
    handleChangeMap(item) {
      this.titleTypeIndex = item.id;
    },
    topoDetail(item) {
      const parames = {
        areaCode: item.areaCode,
        buildingCode: item.buildingCode,
        parkCode: item.parkCode,
      };
      if (item.alarmCount > 0) {
        this.smokeErrorMarks(parames);
      } else {
        this.smokerList.searchVal = parames;
        this.smokeMarks();
      }
    },
    init() {
      this.arrangetime && clearInterval(this.arrangetime);
      getSmokeDetectorArrange().then((res) => {
        if (res.code === "200") {
          this.arrangeList = res.data;
          this.arrangetime = setInterval(() => {
            this.arrangeIndex = Math.floor(
              Math.random() * this.arrangeList.length
            );
          }, 3000);
        }
      });
      getSmokeDetectorOnLineStatus().then((res) => {
        if (res.code === "200") {
          const statusTypes = res.data.map((data) => {
            return {
              id: data.value,
              name: data.key,
            };
          });
          this.$set(
            this.smokerList.searchItems[1].props,
            "options",
            statusTypes
          );
        }
      });
      getSmokeDetectorAlarmLevel().then((res) => {
        if (res.code === "200") {
          const levelTypes = res.data.map((data) => {
            return {
              id: data.value,
              name: data.key,
            };
          });
          this.$set(
            this.smokerAlarm.searchItems[1].props,
            "options",
            levelTypes
          );
        }
      });
    },
    createNode(shape, p3, r3) {
      let node = new ht.Node();
      node.setStyle(shape);
      const size = 250;
      node.p3(p3);
      node.s3(10000, 10000, 10000);
      this.dataModel.add(node);
      return node;
    },
    onSearch(form) {},
    onZoomend({ target }) {
      this.zoom = target.Na;
    },
    init1() {
      getSmokeDetectorRunStatus().then((res) => {
        if (res.code === "200") {
          const data = res.data;
          this.init1Data = data;
          let dom_1 = document.getElementById("l_smokechar_1");
          let myChart = echarts.init(dom_1);
          let option = null;
          let color = [
            "#FF9023",
            "#4CDC9F",
            "#7F00C0",
            "#0F72FF",
            "#C00000",
            "#4AEAB0",
          ];
          let dataJson = [
            {
              name: "在线",
              value: `${data.onlineCount}`,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "#CEFF5C",
                    },
                    {
                      offset: 1,
                      color: "#34FF86",
                    },
                  ]),
                },
              },
            },
            {
              name: "故障",
              value: `${data.faultCount}`,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "#FFBD47",
                    },
                    {
                      offset: 1,
                      color: "#FFBF57",
                    },
                  ]),
                },
              },
            },
            {
              name: "报警",
              value: `${data.alarmCount}`,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "#FC3F21",
                    },
                    {
                      offset: 1,
                      color: "#FF6B29",
                    },
                  ]),
                },
              },
            },
            {
              name: "离线",
              value: `${data.offlineCount}`,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "#00E0E8",
                    },
                    {
                      offset: 1,
                      color: "#2F7AD8",
                    },
                  ]),
                },
              },
            },
          ];
          option = {
            color: color,
            graphic: {
              elements: [],
            },
            legend: {
              orient: "horizontal",
              itemWidth: 14,
              itemHeight: 10,
              bottom: 0,
              right: "auto",
              borderRadius: 0,
              textStyle: {
                color: "#fff",
                fontSize: 12,
              },
              data: [
                {
                  name: "在线",
                  icon: "rect",
                },
                {
                  name: "故障",
                  icon: "rect",
                },
                {
                  name: "报警",
                  icon: "rect",
                },
                {
                  name: "离线",
                  icon: "rect",
                },
              ],
            },
            series: [
              {
                type: "pie",
                top: 0,
                bottom: 0,
                left: "center",
                radius: ["75%", "90%"],
                data: dataJson,
                hoverAnimation: false,
                label: {
                  // show: false
                  formatter: "{c}",
                  backgroundColor: "#2174A1",
                  padding: [2, 6],
                  color: "#fff",
                },
                labelLine: {
                  lineStyle: {
                    color: "#81B6FF",
                    length2: 0,
                    borderRadius: 4,
                  },
                },
              },
            ],
          };
          myChart.setOption(option, true);
          window.onresize = function () {
            myChart.resize();
          };
        }
      });
    },
    init2(timeInterval) {
      getSmokeDetectorTrend(timeInterval).then((res) => {
        if (res.code === "200") {
          const init2Data = res.data;
          const dom_2 = document.getElementById("l_smokechar_2");
          let myChart = echarts.init(dom_2);
          let option = null;
          const fontColor = "#30eee9";
          let alarmCount = [];
          let faultCount = [];
          let warningCount = [];
          let date = [];
          let all = [];
          res.data.map((item) => {
            date.push(item.time);
            alarmCount.push(item.alarmCount);
            faultCount.push(item.faultCount);
            warningCount.push(item.warningCount);
            all.push(100);
          });
          let ylMax = Math.max(...alarmCount);
          let ylMmin = 0;
          let y2Max = Math.max(...faultCount);
          let y2Mmin = 0;
          let y3Max = Math.max(...warningCount);
          let y3Mmin = 0;
          let legend = [
            {
              name: "报警",
              icon: "rect",
            },
            {
              name: "故障",
              icon: "rect",
            },
            {
              name: "预警",
              icon: "rect",
            },
          ];
          const color = ["#A2FFBC", "#48F7B2", "#3FB9FF"];
          option = {
            grid: {
              left: "10px",
              right: "10px",
              top: "20px",
              bottom: "30px",
              containLabel: true,
            },
            tooltip: {
              show: "true",
              trigger: "axis",
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
              },
              formatter: function (prams) {
                //   console.log(prams);
                return `<div style="font-size:12px;">${prams[0].name}</div>
            <div style="font-size:12px;">${prams[0].seriesName}：${prams[0].data}次</div>
            <div style="font-size:12px;">${prams[1].seriesName}：${prams[1].data}次</div>
            <div style="font-size:12px;">${prams[2].seriesName}：${prams[2].data}次</div>
            `;
              },
            },
            color: color,
            legend: {
              orient: "horizontal",
              itemHeight: 10,
              itemWidth: 10,
              textStyle: { color: "#fff", fontSize: 12 },
              bottom: "0px",
              right: "auto",
              data: legend,
            },
            yAxis: [
              {
                type: "value",
                axisTick: {
                  show: false, // 隐藏Y轴刻度
                },
                axisLabel: {
                  color: "#A0ACD8",
                  fontSize: 12,
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: "#0F6384",
                  },
                },
                splitLine: {
                  show: false,
                  lineStyle: {
                    color: "#0F6384",
                  },
                },
              },
              {
                type: "value",
                gridIndex: 0,
                min: 0,
                max: 100,
                splitNumber: 6,
                splitLine: {
                  show: false,
                  lineStyle: {
                    color: "#28335A",
                  },
                },
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: "#0F6384",
                  },
                },
                axisTick: {
                  show: false,
                },
                axisLabel: {
                  show: false,
                },
                splitArea: {
                  show: false,
                },
              },
            ],
            xAxis: {
              type: "category",
              boundaryGap: true, // 坐标轴两边留白
              axisTick: {
                show: false, // 隐藏Y轴刻度
              },
              axisLabel: {
                color: "#A8EAFF",
                fontSize: 10,
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#0F6384",
                },
              },
              data: date,
            },
            series: [
              {
                name: legend[0].name,
                type: "bar",
                barWidth: 8,
                stack: "1",
                itemStyle: {
                  normal: {
                    show: true,
                    color: "#FF6A6A",
                  },
                },
                data: alarmCount,
                zlevel: 2,
              },
              {
                name: legend[1].name,
                type: "bar",
                barWidth: 8,
                stack: "1",
                itemStyle: {
                  normal: {
                    show: true,
                    color: "#48F7B2",
                  },
                },
                data: faultCount,
                zlevel: 2,
              },
              {
                name: legend[2].name,
                type: "bar",
                barWidth: 8,
                stack: "1",
                itemStyle: {
                  normal: {
                    show: true,
                    color: "#3FB9FF",
                  },
                },
                data: warningCount,
                zlevel: 2,
              },
              {
                name: "",
                type: "bar",
                barWidth: "8px",
                xAxisIndex: 0,
                yAxisIndex: 1,
                barGap: "-108%",
                data: all,
                itemStyle: {
                  normal: {
                    color: "#013a62",
                  },
                },
                zlevel: 1,
              },
            ],
          };
          myChart.setOption(option, true);
          window.onresize = function () {
            myChart.resize();
          };
        }
      });
    },
    init3(parames) {
      getSmokeDetectorAlarmAndFaultStats(parames).then((res) => {
        if (res.code === "200") {
          const dom_3 = document.getElementById("l_smokechar_3");
          let myChart = echarts.init(dom_3);
          let option = null;
          let date = [];
          let alarmCount = [];
          let faultCount = [];
          res.data.map((item) => {
            date.push(item.time);
            alarmCount.push(item.alarmCount);
            faultCount.push(item.faultCount);
          });
          option = {
            // title: {
            //   top: '0',
            //   left: 'center',
            //   textStyle: {
            //     color: '#FFF',
            //     align: 'center'
            //   }
            // },
            // grid: {
            //   left: '40px',
            //   right: '50px',
            //   bottom: '60px',
            //   top: '16px',
            //   containLabel: true
            // },
            grid: {
              left: "10px",
              right: "0px",
              top: "10px",
              bottom: "40px",
              containLabel: true,
            },
            tooltip: {
              show: true,
              trigger: "axis",
              formatter: "{b0}<br />{a0}: {c0}%<br />{a1}：{c1}%",
            },
            legend: {
              orient: "horizontal",
              itemHeight: 10,
              itemWidth: 10,
              textStyle: { color: "#fff", fontSize: 12 },
              bottom: "0px",
              right: "auto",
              borderRadius: 5,
              data: [
                {
                  name: "报警率",
                  icon: "rect",
                  textStyle: {
                    borderRadius: 5,
                  },
                },
                {
                  name: "故障率",
                  icon: "rect",
                  textStyle: {
                    borderRadius: 4,
                  },
                },
              ],
            },
            xAxis: [
              {
                type: "category",
                boundaryGap: false,
                axisLabel: {
                  textStyle: {
                    color: "#fff",
                    fontSize: "10",
                  },
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: "#0F6384",
                  },
                },
                axisTick: {
                  show: false,
                },
                splitLine: {
                  show: false,
                  lineStyle: {
                    color: "#0F6384",
                  },
                },
                data: date,
              },
            ],
            yAxis: [
              {
                type: "value",
                name: "", // 左
                // min: ylMmin,
                // max: ylMax,
                triggerEvent: true,
                axisLabel: {
                  formatter: "{value}",
                  textStyle: {
                    color: "#fff",
                    fontSize: "10",
                  },
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: "#0F6384",
                  },
                },
                axisTick: {
                  show: false,
                },
                splitLine: {
                  show: false,
                  lineStyle: {
                    color: "#0F6384",
                  },
                },
              },
              // {
              //   type: 'value',
              //   name: '', // 右
              //   min: y2Mmin,
              //   // max: y2Max,
              //   axisLabel: {
              //     formatter: '{value}',
              //     textStyle: {
              //       color: '#fff',
              //       fontSize: '10'
              //     }
              //   },
              //   axisLine: {
              //     lineStyle: {
              //       color: '#132465'
              //     }
              //   },
              //   axisTick: {
              //     show: false
              //   },
              //   splitLine: {
              //     show: true,
              //     lineStyle: {
              //       color: '#132465'
              //     }
              //   }
              // }
            ],
            series: [
              {
                name: "报警率",
                type: "line",
                symbol: "circle",
                symbolSize: 3,
                smooth: false,
                lineStyle: {
                  normal: {
                    width: 1,
                    color: "#A2FFBC",
                  },
                },
                itemStyle: {
                  normal: {
                    color: "#A2FFBC",
                  },
                },
                data: alarmCount,
              },
              {
                name: "故障率",
                type: "line",
                symbol: "circle",
                symbolSize: 3,
                smooth: false,
                lineStyle: {
                  normal: {
                    width: 1,
                    color: "#FF6160",
                  },
                },
                itemStyle: {
                  normal: {
                    color: "#FF6160",
                  },
                },
                data: faultCount,
              },
            ],
          };
          myChart.setOption(option, true);
          window.onresize = function () {
            myChart.resize();
          };
        }
      });
    },
    init4() {
      getSmokeDetectorConfirmStatistics().then((res) => {
        if (res.code === "200") {
          this.init4Data = res.data;
          let dom_4 = document.getElementById("l_smokechar_4");
          let myChart = echarts.init(dom_4);
          let demoData = {
            name: "时钟",
            value: this.init4Data.confirmPercentage,
            pos: ["50%", "50%"],
          };
          const option = {
            title: {
              text: demoData.value + "%",
              bottom: "14%",
              left: "center",
              textStyle: {
                fontSize: 28,
                color: "#43FFE5",
                fontFamily: "DINAlternate-Bold, DINAlternate",
              },
              subtext: "火警确认率",
              subtextStyle: {
                color: "#FFFFFF",
                fontSize: 12,
                top: "center",
                fontFamily: "PingFangSC-Semibold, PingFang SC",
              },
            },
            series: [
              // 外侧光线
              {
                name: demoData.name,
                type: "gauge",
                center: demoData.pos,
                radius: "90%",
                startAngle: 225,
                endAngle: -45,
                min: 0,
                max: 100,
                axisLine: {
                  show: true,
                  lineStyle: {
                    width: 2,
                    color: [
                      [
                        1,
                        new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                          {
                            offset: 0,
                            color: "#0966F7",
                          },
                          {
                            offset: 0.3,
                            color: "#2BB9EE",
                          },
                          {
                            offset: 0.7,
                            color: "#2BB9EE",
                          },
                          {
                            offset: 1,
                            color: "#0966F7",
                          },
                        ]),
                      ],
                    ],
                  },
                },
                axisTick: {
                  show: 0,
                },
                splitLine: {
                  show: 0,
                },
                axisLabel: {
                  show: 0,
                },
                pointer: {
                  show: 0,
                },
                detail: {
                  show: 0,
                },
                data: [
                  {
                    value: demoData.value,
                  },
                ],
              },
              // 圆环
              {
                name: "小圆形border",
                type: "pie",
                hoverAnimation: false,
                legendHoverLink: false,
                radius: "10%",
                z: 0,
                center: demoData.pos,
                labelLine: {
                  normal: {
                    show: false,
                  },
                },
                data: [
                  {
                    value: 0,
                  },
                  {
                    value: 10,
                    itemStyle: {
                      normal: {
                        color: "#FFE3E3",
                      },
                    },
                  },
                ],
              },
              {
                name: "小圆形透明层",
                type: "pie",
                hoverAnimation: false,
                legendHoverLink: false,
                radius: ["0%", "10%"],
                z: 0,
                center: demoData.pos,
                labelLine: {
                  normal: {
                    show: false,
                  },
                },
                data: [
                  {
                    value: 0,
                  },
                  {
                    value: 10,
                    itemStyle: {
                      normal: {
                        color: "#fff5f5",
                      },
                    },
                  },
                ],
              },
              // 内侧指针、数值显示
              {
                name: demoData.name,
                type: "gauge",
                center: demoData.pos,
                radius: "80%",
                startAngle: 226,
                endAngle: -46,
                min: 0,
                max: 100,
                axisLine: {
                  show: true,
                  lineStyle: {
                    width: 5,
                    color: [
                      [
                        1,
                        new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                          {
                            offset: 0,
                            color: "#0DC9E7",
                          },
                          {
                            offset: 0.2,
                            color: "#45FFF4",
                          },
                          {
                            offset: 0.4,
                            color: "#9CF3B8",
                          },
                          {
                            offset: 0.6,
                            color: "#9CF3B8",
                          },
                          {
                            offset: 0.7,
                            color: "#45FFF4",
                          },
                          {
                            offset: 1,
                            color: "#0DC9E7",
                          },
                        ]),
                      ],
                    ],
                  },
                },
                axisTick: {
                  show: 0,
                },
                splitLine: {
                  show: 0,
                },
                axisLabel: {
                  show: 0,
                },
                title: {
                  show: false,
                  offsetCenter: [0, "65%"],
                  color: "white",
                  fontSize: 20,
                  // backgroundColor: "#D8d8d8",
                  borderRadius: 30,
                  padding: 5,
                },
                detail: {
                  show: false,
                  offsetCenter: [0, 60],
                  textStyle: {
                    fontSize: 25,
                    color: "#fff",
                  },
                  formatter: ["{value}"].join("\n"),

                  rich: {
                    name: {
                      fontSize: 20,
                      lineHeight: 10,
                      color: "#ddd",
                      padding: [30, 0, 0, 0],
                    },
                  },
                },
                itemStyle: {
                  shadowColor: "#174B8B",
                  normal: {
                    color: [
                      [
                        1,
                        new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                          {
                            offset: 0,
                            color: "#63FFEF",
                          },
                          {
                            offset: 1,
                            color: "#069AE6",
                          },
                        ]),
                      ],
                    ], // 长条指针样式
                  },
                },
                pointer: {
                  show: true,
                  length: "66%",
                  width: 6,
                },
                data: [
                  {
                    value: demoData.value,
                    name: demoData.name,
                  },
                ],
              },
              // 外围刻度
              {
                type: "gauge",
                center: demoData.pos,
                radius: "72%",
                splitNumber: 10,
                min: 0,
                max: 100,
                startAngle: 225,
                endAngle: -45,
                axisLine: {
                  show: true,
                  lineStyle: {
                    width: 1,
                    color: [[1, "rgba(0,0,0,0)"]],
                  },
                }, // 仪表盘轴线
                axisTick: {
                  // 坐标轴小标记
                  splitNumber: 10, // 每份split细分多少段
                  length: 3, // 属性length控制线长
                  lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: "#0DC9E7",
                    width: 1,
                  },
                },
                axisLabel: {
                  color: "#FFF",
                  fontSize: 12,
                }, // 刻度节点文字颜色
                // 刻度样式
                splitLine: {
                  show: true,
                  length: 6,
                  lineStyle: {
                    width: 1,
                    color: "#0DC9E7",
                  },
                },
                pointer: {
                  show: 0,
                },
                detail: {
                  show: 0,
                },
              },
            ],
          };
          myChart.setOption(option, true);
          window.onresize = function () {
            myChart.resize();
          };
        }
      });
    },
    init5() {
      getSmokeDetectorRealTimeAlarm().then((res) => {
        if (res.code === "200") {
          this.listData = res.data;
        }
      });
    },
    init6(parames) {
      getFireAccessStats(parames).then((res) => {
        if (res.code === "200") {
          let dom_6 = document.getElementById("l_smokechar_6");
          let myChart = echarts.init(dom_6);
          let date = [];
          let count1 = [];
          let count2 = [];
          let count3 = [];
          res.data.map((item, index) => {
            date.push(item.time);
            count1.push(Number(item.accessName1));
            count2.push(Number(item.accessName2));
            count3.push(Number(item.accessName3));
          });
          let option = null;
          option = {
            grid: {
              left: "10px",
              right: "0px",
              top: "10px",
              bottom: "40px",
              containLabel: true,
            },
            tooltip: {
              show: true,
              trigger: "axis",
              formatter: "{b0}<br />{a0}: {c0}<br />{a1}：{c1}<br />{a2}：{c2}",
            },
            legend: {
              itemHeight: 10,
              itemWidth: 10,
              textStyle: { color: "#fff", fontSize: 12 },
              bottom: "0px",
              right: "auto",
              borderRadius: 5,
              data: [
                {
                  name: "通道一",
                  icon: "rect",
                },
                {
                  name: "通道二",
                  icon: "rect",
                },
                {
                  name: "通道三",
                  icon: "rect",
                },
              ],
            },
            xAxis: [
              {
                type: "category",
                boundaryGap: false,
                axisLabel: {
                  color: "fff",
                  fontSize: "10",
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: "#0F6384",
                  },
                },
                axisTick: {
                  show: false,
                },
                splitLine: {
                  show: false,
                  lineStyle: {
                    color: "#0F6384",
                  },
                },
                data: date,
              },
            ],
            yAxis: [
              {
                type: "value",
                name: "", // 左
                axisLabel: {
                  formatter: "{value}",
                  textStyle: {
                    color: "#fff",
                    fontSize: "10",
                  },
                },
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: "#0F6384",
                  },
                },
                axisTick: {
                  show: false,
                },
                splitLine: {
                  show: false,
                  lineStyle: {
                    color: "#0F6384",
                  },
                },
              },
            ],
            series: [
              {
                name: "通道一",
                type: "line",
                symbol: "circle",
                symbolSize: 3,
                smooth: false,
                lineStyle: {
                  normal: {
                    width: 1,
                    color: "#A2FFBC",
                  },
                },
                itemStyle: {
                  normal: {
                    color: "#A2FFBC",
                    areaStyle: {
                      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                        {
                          offset: 1,
                          color: "rgba(124, 255, 188, 0.3)",
                        },
                        {
                          offset: 0,
                          color: "rgba(180, 255, 188, 0)",
                        },
                      ]),
                    },
                  },
                },
                data: count1,
              },
              {
                name: "通道二",
                type: "line",
                symbol: "circle",
                symbolSize: 3,
                smooth: false,
                lineStyle: {
                  normal: {
                    width: 1,
                    color: "#D565EC",
                  },
                },
                itemStyle: {
                  normal: {
                    color: "#D565EC",
                    areaStyle: {
                      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                        {
                          offset: 1,
                          color: "rgba(205, 133, 255, 0.3)",
                        },
                        {
                          offset: 0,
                          color: "rgba(255, 134, 251, 0)",
                        },
                      ]),
                    },
                  },
                },
                data: count2,
              },
              {
                name: "通道三",
                type: "line",
                symbol: "circle",
                symbolSize: 3,
                smooth: false,
                lineStyle: {
                  normal: {
                    width: 1,
                    color: "#FF6160",
                  },
                },
                itemStyle: {
                  normal: {
                    color: "#FF6160",
                    areaStyle: {
                      color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                        {
                          offset: 1,
                          color: "rgba(255, 101, 66, 0.3)",
                        },
                        {
                          offset: 0,
                          color: "rgba(255, 184, 93, 0)",
                        },
                      ]),
                    },
                  },
                },
                // yAxisIndex: 1,
                data: count3,
              },
            ],
          };
          myChart.setOption(option, true);
          window.onresize = function () {
            myChart.resize();
          };
        }
      });
    },
    smokeErrorMarks(parames) {
      this.smokeError.show = true;
      getSmokeDetectorAlarmByCondition(parames).then((res) => {
        if (res.code === "200") {
          this.smokeError.index = 0;
          this.smokeError.video =
            res.data[0] && (res.data[0].videoUrl || undefined);
          this.smokeError.items = res.data;
        }
      });
    },
    handleCollapseChange(val) {
      const index = val[val.length - 1];
      if (index && index !== this.smokeError.index) {
        this.smokeError.index = index;
        this.smokeError.video =
          this.smokeError.items[index].videoUrl || undefined;
      }
    },
    smokeMarks() {
      this._getSmokeDetectorDeviceForPage();
      this.smokerList.show = true;
    },
    _getSmokeDetectorDeviceForPage() {
      let parames = {
        data: {
          ...this.smokerList.searchVal,
        },
        pageNo: Number(this.smokerList.page.current), // 查询的分页页码
        pageSize: Number(this.smokerList.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: "",
      };
      getSmokeDetectorDeviceForPage(parames).then((res) => {
        if (res.code === "200") {
          const { data, total } = res.data;
          this.smokerList.page.total = total;
          this.smokerList.tableData = data;
        }
      });
    },
    contactCheck(item) {},
    currentSituation(item) {
      // routePush({
      //   name: 'smokeTimeMonitoring',
      //   parames: {
      //     ...item
      //   },
      //   query: {
      //     activeNumber: item.serialNumber
      //   }
      // });

      const parames = {
        ...item,
      };
      store.commit("set_common", {
        smokeTimeMonitoring: parames,
      });
      const detailURL = this.$router.resolve({
        path: `/adminSmoke/smokeManagement/smokeTimeMonitoring`,
        query: {
          activeNumber: item.serialNumber,
        },
      });
      window.open(detailURL.href, "_blank");
    },
    clearError(item) {
      this.$confirm("此操作将永久清楚该设备告警, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const parames = {
          alarmNo: [item.alarmNo],
          serialNumber: item.serialNumber,
        };
        clearSmokeDetectorAlarm(parames).then((res) => {
          if (res.code === "200") {
            this.$notify({
              title: "成功",
              message: "清除成功",
              type: "success",
              position: "bottom-right",
            });
            this.smokeErrorMarks({
              areaCode: item.areaCode,
              buildingCode: item.buildingCode,
              parkCode: item.parkCode,
              alarmType: 1,
            });
            this.allInit();
          }
        });
      });
    },
    alarmLink(item) {
      console.log("item", item);
      // this.$router.push({
      //   name: 'smokeAlarmLink',
      //   params: {
      //     ...item
      //   }
      // })
      const smokeURL = this.$router.resolve({
        name: "smokeAlarmLink",
      });
      // console.log(cameraURL)
      window.open(smokeURL.href, "_blank");
    },
    onSmokerListSearch(val) {
      this.smokerList.searchVal = {
        ...this.smokerList.searchVal,
        ...val,
      };
      this.onSmokerListCurrentChange(1);
    },
    changeDisobey(index) {
      const indexType = {
        1: 6,
        2: 5,
        3: 4,
      };
      if (this.disobeyId !== index) {
        this.disobeyId = index;
        this.init6({
          dateInterval: indexType[index],
        });
      }
    },
    changeTrend(index) {
      const indexType = {
        1: "",
        2: 7,
        3: 30,
      };
      if (this.trendId !== index) {
        this.trendId = index;
        this.init2({
          timeInterval: indexType[index],
        });
      }
    },
    changeAlarm(index) {
      const indexType = {
        1: "",
        2: 1,
      };
      if (this.alarmId !== index) {
        this.alarmId = index;
        this.init3({
          dateInterval: indexType[index],
        });
      }
    },
    onSmokerListCurrentChange(val) {
      this.smokerList.page.current = val;
      this._getSmokeDetectorDeviceForPage();
    },
    onSmokerListPageSizeChange(val) {
      this.smokerList.page.pageSize = val;
      this.onSmokerListCurrentChange(1);
    },
    onSmokerListSelectionChange(args) {
      this.smokerList.selectsList = args;
    },
    smokerListCancel() {
      this.smokerList.page = {
        current: 1,
        pageSize: 10,
        total: 0,
      };
      this.smokerList.tableData = [];
      this.smokerList.show = false;
      this.smokerList.searchVal = {};
      this.$refs.smokerListSearchForm.onReset();
    },
    smokerListSubmit() {},
    _getSmokeDetectorAlarmForPage() {
      let parames = {
        data: {
          ...this.smokerAlarm.searchVal,
        },
        pageNo: Number(this.smokerAlarm.page.current), // 查询的分页页码
        pageSize: Number(this.smokerAlarm.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: "",
      };
      getSmokeDetectorAlarmForPage(parames).then((res) => {
        if (res.code === "200") {
          const { data, total } = res.data;
          this.smokerAlarm.page.total = total;
          this.smokerAlarm.tableData = data;
        }
      });
    },
    handleMoreAlarm() {
      this._getSmokeDetectorAlarmForPage();
      this.smokerAlarm.show = true;
    },
    onSmokerAlarmSearch(val) {
      this.smokerAlarm.searchVal = {
        alarmLevel: val.alarmLevel,
        timeBegin: val.time && val.time[0],
        timeEnd: val.time && val.time[1],
      };
      this.onSmokerAlarmCurrentChange(1);
    },
    onSmokerAlarmCurrentChange(val) {
      this.smokerAlarm.page.current = val;
      this._getSmokeDetectorAlarmForPage();
    },
    onSmokerAlarmPageSizeChange(val) {
      this.smokerAlarm.page.pageSize = val;
      this.onSmokerAlarmCurrentChange(1);
    },
    onSmokerAlarmSelectionChange(args) {
      this.smokerAlarm.selectsList = args;
    },
    smokerAlarmCancel() {
      this.smokerAlarm.page = {
        current: 1,
        pageSize: 10,
        total: 0,
      };
      this.smokerAlarm.tableData = [];
      this.smokerAlarm.show = false;
      this.smokerAlarm.searchVal = {};
      this.$refs.smokerAlarmSearchForm.onReset();
    },
    smokerAlarmSubmit() {},
    goMonitoring() {
      // routePush({
      //   name: 'smokeTimeMonitoring'
      // });
      const monitoringURL = this.$router.resolve({
        name: "smokeTimeMonitoring",
      });
      window.open(monitoringURL.href, "_blank");
    },
  },
  beforeDestroy() {
    clearInterval(this.updateTime);
    clearInterval(this.arrangetime);
    this.updateTime = null;
    this.arrangetime = null;
  },
};
</script>

<style lang="less" scoped>
#smokeMap {
  width: 100%;
  height: 100%;
  // background: url(../images/img1.png) no-repeat center;
  // background-position: 0px -77px;/*no*/
  background-size: 100% calc(100% + 77px); /*no*/
  display: flex;
  flex-direction: column;
  .map {
    width: 100%;
    // height: calc(100%);/*no*/
    flex: 1;
    position: relative;
    // background: url(../images/bg.png) no-repeat center;
    background-size: cover;
    .topo {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 70%;
      transform: translate(-50%, -50%);
      > img {
        width: 100%;
        height: auto;
      }
      .topoItems {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1001;
        .topoItem {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          cursor: pointer;
          .img {
            display: block;
            width: 72px; /*no*/
            height: 126px; /*no*/
            background: url(../images/img15.png) no-repeat center;
            background-size: 100% 100%;
          }
          .topoInfo {
            display: none;
            width: 138px; /*no*/
            height: 74px; /*no*/
            background: url(../images/img7.png) no-repeat center;
            background-size: 100% 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateY(-100%);
            justify-content: center;
            > span {
              display: flex;
              align-items: center;
              font-size: 12px; /*no*/
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #ffffff;
              padding-left: 25px; /*no*/
              position: relative;
              &:after {
                content: "";
                width: 7px;
                height: 7px;
                background: linear-gradient(135deg, #ff8137 0%, #ff4a19 100%);
                position: absolute;
                left: 11px; /*no*/
                top: 50%;
                transform: translateY(-50%);
              }
              span {
                font-size: 18px; /*no*/
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #ffffff;
              }
              &:last-child {
                &:after {
                  background: linear-gradient(135deg, #4de999 0%, #4ae481 100%);
                }
              }
            }
          }
          &.error {
            .img {
              background: url(../images/img14.png) no-repeat center;
              background-size: 100% 100%;
            }
            .topoInfo {
              background: url(../images/img8.png) no-repeat center;
              background-size: 100% 100%;
            }
          }
          &.handPand {
            .topoInfo {
              display: flex;
            }
          }
          &:first-child {
            margin-top: -19%;
            margin-left: -6%;
          }
          &:nth-of-type(2) {
            margin-top: -19%;
            margin-left: 18%;
          }
          &:nth-of-type(3) {
            margin-top: -9%;
            margin-left: -28%;
          }
          &:nth-of-type(4) {
            margin-top: -9%;
            margin-left: -3%;
          }
          &:nth-of-type(5) {
            margin-top: 5%;
            margin-left: -16%;
          }
          &:nth-of-type(6) {
            margin-top: 7%;
            margin-left: 6%;
          }
        }
      }
    }
    .marks {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      span {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 150px;
        height: 50px;
        transform: translate(-50%, -50%);
        background: #409eff;
        cursor: pointer;
        &:first-child {
          width: 150px;
          height: 90px;
          margin-top: -20.5%;
          margin-left: -27%;
          transform: rotate(31deg);
        }
        &:nth-of-type(2) {
          width: 80px;
          height: 50px;
          margin-top: -9%;
          margin-left: 15%;
        }
        &:nth-of-type(3) {
          width: 150px;
          height: 90px;
          margin-top: -23.5%;
          margin-left: -2%;
          transform: rotate(30deg);
        }
        &.error {
          background: red;
        }
      }
    }
    .el-row {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &::before {
        content: none;
      }
      .el-col {
        display: flex;
        height: 32%;
        // max-height: 250px;/*no*/
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .infoContent {
      width: 25%;
      height: calc(100% - 20px); /*no*/
      position: absolute;
      top: 10px; /*no*/
      &.infoCenter {
        width: 574px;
        height: 77px;
        background: url(../images/img5.png) no-repeat center;
        background-size: 100% 100%;
        top: 27px;
        left: 50%;
        transform: translateX(-50%);
        padding: 0 20px 0 110px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        span {
          &.title {
            font-size: 18px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #f6fcff;
          }
          &.number {
            font-size: 32px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #43ffe5;
            line-height: 32px;
            background: linear-gradient(180deg, #e7ffa4 0%, #13f2d8 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }
      &.infoLeft {
        left: 3%; /*no*/
      }
      &.infoRight {
        right: 3%; /*no*/
      }
      .el-col {
        > div {
          padding: 36px 10px 10px; /*no*/
          width: 100%;
          height: 100%;
          background: url(../images/img11.png) no-repeat center;
          background-size: 100% 100%;
          position: relative;
        }
      }
      .item_title {
        position: absolute;
        width: calc(100% - 20px); /*no*/
        top: 14px;
        span {
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #8de4ff;
          position: relative;
          padding-left: 18px;
          &::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 9px;
            height: 16px;
            background: url(../images/img13.png) no-repeat center;
            background-size: 100% 100%;
          }
        }
        .more {
          position: absolute;
          top: 50%;
          right: 0px; /*no*/
          transform: translateY(-50%);
          font-size: 12px; /*no*/
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #40c7f0;
          cursor: pointer;
        }
      }
      /deep/.border-box-content {
        position: relative;
        background: linear-gradient(
          180deg,
          rgba(22, 24, 48, 0.94) 0%,
          rgba(22, 24, 48, 0.81) 100%
        );
        padding: 10px; /*no*/
      }
      .charTitle {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        span {
          width: 56px; /*no*/
          height: 20px; /*no*/
          border: 1px solid #2184c9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #47b3ff;
          cursor: pointer;
          &.is-active {
            background: #2d86a7;
            border: 1px solid #2fbff8;
            font-size: 12px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #ffffff;
          }
        }
      }
      .l_item_1 {
        height: 100%;
        position: relative;
        #l_smokechar_1 {
          height: calc(100%);
        }
        .detail {
          position: absolute;
          top: calc(50% - 26px); /*no*/
          left: 49.6%;
          transform: translate(calc(-50%), calc(-50% + 39px)); /*no*/
          width: 155px;
          height: 155px;
          background: url(../images/img2.png) no-repeat center;
          background-size: 100% 100%;
          padding: 20px;
          img {
            position: absolute;
            top: 22%;
            left: 22%;
            &:first-child {
              width: 55%;
              animation: circleRoate 5s infinite linear;
            }
            &:last-child {
              top: 30%;
              left: 30%;
              width: 40%;
              animation: againstCircleRoate 4s infinite linear;
            }
          }
        }
      }
      .l_item_2 {
        height: 100%;
        #l_smokechar_2 {
          height: calc(100% - 20px); /*no*/
        }
      }
      .l_item_3 {
        height: 100%;
        #l_smokechar_3 {
          height: calc(100% - 20px); /*no*/
        }
      }
      .l_item_4 {
        height: 100%;
        overflow-y: auto;
        &::-webkit-scrollbar-track-piece {
          //滚动条凹槽的颜色，还可以设置边框属性
          background-color: transparent;
        }
        &::-webkit-scrollbar {
          //滚动条的宽度
          width: 3px; /*no*/
          height: 2px;
          border-radius: 3px; /*no*/
        }
        &::-webkit-scrollbar-thumb {
          //滚动条的设置
          background-color: #63d6ff;
          background-clip: padding-box;
        }
        &::-webkit-scrollbar-thumb:hover {
          background-color: #63d6ff;
        }
        > .flexRow {
          height: calc(100%);
        }
        #l_smokechar_4 {
          width: 60%;
          height: calc(100%);
        }
        .detail {
          width: 40%;
          height: calc(100%);
          justify-content: center;
          > div {
            margin-bottom: 10px; /*no*/
            font-size: 12px; /*no*/
            color: #fff;
            background: linear-gradient(
              135deg,
              rgba(105, 220, 255, 0.06) 0%,
              rgba(18, 123, 232, 0.06) 100%
            );
            border-radius: 5px; /*no*/
            padding: 4px 10px 4px 4px; /*no*/
            .icon {
              width: 32px; /*no*/
              height: 32px; /*no*/
              background: rgba(68, 211, 255, 0.2);
              border-radius: 3px;
              margin-right: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              i {
                font-size: 21px;
                background-image: -webkit-linear-gradient(
                  -45deg,
                  #bff0ff 20%,
                  #61ffea 60%
                );
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
            }
            .mainInfo {
              width: calc(100% - 32px); /*no*/
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              span {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                &:first-child {
                  width: 75%;
                  font-size: 12px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #ffffff;
                }
                &:last-child {
                  width: 25%;
                  font-size: 20px;
                  font-family: DINAlternate-Bold, DINAlternate;
                  font-weight: bold;
                  color: #43ffe5;
                }
              }
            }
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
      .l_item_5 {
        height: 100%;
        #l_smokechar_5 {
          height: 100%;
          .seamless-warp {
            height: calc(100%); /*no*/
            overflow: hidden;
            .item {
              li {
                margin-bottom: 10px; /*no*/
                background: url(../images/img9.png) no-repeat center;
                background-size: 100% 100%;
                padding: 8px 20px; /*no*/
                .seamlessInfo {
                  justify-content: space-between;
                  align-items: center;
                  > div {
                    &:first-child {
                      width: 80%;
                      padding-right: 10px; /*no*/
                      .titleInfo {
                        margin-bottom: 10px; /*no*/
                        .title {
                          font-size: 16px;
                          font-family: PingFangSC-Semibold, PingFang SC;
                          color: #ffffff;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                        }
                        .alarmType {
                          margin-left: 10px; /*no*/
                          font-size: 12px; /*no*/
                          font-family: PingFangSC-Semibold, PingFang SC;
                          color: #ffffff;
                          padding: 1px 6px; /*no*/
                          background: linear-gradient(
                            135deg,
                            #32ccf4 0%,
                            #23a7e6 100%,
                            #2ca4dd 100%
                          );
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                        }
                      }
                      .timeInfo {
                        font-size: 12px; /*no*/
                        font-family: PingFangSC-Semibold, PingFang SC;
                        color: #bfe8ff;
                        line-height: 17px; /*no*/
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      }
                    }
                    &:last-child {
                      display: flex;
                      align-items: center;
                      justify-content: flex-end;
                      width: 20%; /*no*/
                      span {
                        font-size: 14px;
                        height: 20px; /*no*/
                        line-height: 14px; /*no*/
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: #ffffff;
                        padding: 3px 7px; /*no*/
                        background: linear-gradient(
                          135deg,
                          #f87c55 0%,
                          #c72d8d 100%
                        );
                        border-radius: 1px; /*no*/
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      }
                    }
                  }
                }
                // span{
                //   flex: 1;
                //   text-align: center;
                //   overflow: hidden;
                //   text-overflow:ellipsis;
                //   white-space: nowrap;
                //   font-size: 12px;
                //   color: #fff;
                // }
              }
            }
          }
        }
      }
      .l_item_6 {
        height: 100%;
        #l_smokechar_6 {
          height: calc(100% - 20px); /*no*/
        }
      }
    }
  }
}
.smokeErrorContainer {
  width: 410px; /*no*/
  padding: 10px 5px; /*no*/
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(
    135deg,
    rgba(24, 161, 193, 0.62) 0%,
    rgba(22, 139, 211, 0.56) 100%
  );
  border-radius: 1px;
  border: 1px solid;
  border-image: linear-gradient(
      135deg,
      rgba(37, 216, 221, 1),
      rgba(55, 198, 255, 1)
    )
    1 1;
  z-index: 2;
  .close {
    position: absolute;
    right: 0px; /*no*/
    top: -23px; /*no*/
    width: 16px; /*no*/
    height: 16px; /*no*/
    cursor: pointer;
    background: linear-gradient(135deg, #5be0ff 0%, #2fbdfe 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 13px; /*no*/
      color: #fff;
    }
  }
  .errorMain {
    width: 100%;
    height: 60%;
    padding: 0 5px; /*no*/
    max-height: 450px; /*no*/
    .errorImg {
      width: 100%;
      height: 190px; /*no*/
      position: relative;
      overflow: hidden;
      img,
      video {
        width: 100%;
        height: auto;
      }
      #videoAddress {
        position: absolute;
        top: -48px; /*no*/
        left: 0;
        right: 0;
        height: calc(100% + 96px); /*no*/
        bottom: -48px; /*no*/
      }
      .errorTitle {
        position: absolute;
        left: 0;
        // right: 0;
        bottom: 10px;
        // background: rgba(0, 0, 0, 0.3);
        border-radius: 2px; /*no*/
        font-size: 12px; /*no*/
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        padding: 5px 10px; /*no*/
      }
    }

    .el-collapse {
      display: flex;
      flex-direction: column;
      height: calc(100% - 155px); /*no*/
      border: none;
      margin-top: 10px; /*no*/
      overflow-y: auto;
      &::-webkit-scrollbar-track-piece {
        //滚动条凹槽的颜色，还可以设置边框属性
        background-color: transparent;
      }
      &::-webkit-scrollbar {
        //滚动条的宽度
        width: 3px; /*no*/
        height: 2px;
        border-radius: 3px; /*no*/
      }
      &::-webkit-scrollbar-thumb {
        //滚动条的设置
        background-color: #63d6ff;
        background-clip: padding-box;
      }
      &::-webkit-scrollbar-thumb:hover {
        background-color: #63d6ff;
      }
    }
    .el-collapse-item {
      width: 100%;
      background: linear-gradient(
        135deg,
        rgba(16, 64, 84, 0.71) 0%,
        rgba(0, 20, 36, 0.22) 100%
      );
      border-radius: 2px; /*no*/
      padding: 10px; /*no*/
      margin-bottom: 10px; /*no*/
      /deep/.el-collapse-item__header {
        height: auto;
        line-height: initial;
        border-bottom: none;
        background-color: transparent;
        position: relative;
        .tabTitle {
          width: 100%;
          font-size: 14px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          position: relative;
          .tabIcon {
            width: 18px; /*no*/
            height: 18px; /*no*/
            background: linear-gradient(135deg, #ff8f3b 0%, #ff571b 100%);
            margin-right: 6px; /*no*/
            display: flex;
            align-items: center;
            justify-content: center;
            i {
              font-size: 10px; /*no*/
              color: #fff;
            }
          }
        }
        > i {
          width: 19px; /*no*/
          height: 19px; /*no*/
          background: linear-gradient(135deg, #1b85a1 0%, #27709a 100%);
          border-radius: 4px; /*no*/
          position: absolute;
          color: #fff;
          right: 0px; /*no*/
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      /deep/.el-collapse-item__wrap {
        background: transparent;
        border-bottom: none;
        // overflow-x: auto;
        padding-top: 10px; /*no*/
        &::-webkit-scrollbar-track-piece {
          //滚动条凹槽的颜色，还可以设置边框属性
          background-color: transparent;
        }
        &::-webkit-scrollbar {
          //滚动条的宽度
          width: 3px; /*no*/
          height: 2px;
          border-radius: 3px; /*no*/
        }
        &::-webkit-scrollbar-thumb {
          //滚动条的设置
          background-color: #63d6ff;
          background-clip: padding-box;
        }
        &::-webkit-scrollbar-thumb:hover {
          background-color: #63d6ff;
        }
        .el-collapse-item__content {
          padding-bottom: 0px;
          > div {
            background: none;
            #formItemText {
              .el-form-item {
                margin-bottom: 6px; /*no*/
                &.alarmType {
                  .value {
                    color: #ffde87;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .smokeErrorBtnList {
    margin-left: 10px; /*no*/
    button {
      background: linear-gradient(135deg, #23e9ca 0%, #1c8dfa 100%);
      box-shadow: 0px 6px 4px 0px #0f4d79; /*no*/
      padding: 8px 10px; /*no*/
      color: #e6ecff;
      font-size: 12px; /*no*/
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      margin-left: 0;
      margin-right: 10px;
      &:first-child {
        margin-right: 10px; /*no*/
        background: linear-gradient(135deg, #3fa5d6 0%, #218ce2 100%);
        box-shadow: 0px 6px 4px 0px #0f4d79; /*no*/
      }
    }
  }
}
@keyframes circleRoate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes againstCircleRoate {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}
</style>
