/* eslint-disable camelcase */
<template>
  <pageMain idName="historyWarn" :currentTitleList="currentTitleList">
    <!-- 故障告警 -->
    <InfoItem :items="items" />
    <header-title icon="iconfont icon-shouye" title="历史报警">
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
      />
    </header-title>

    <div class="content-view">
      <el-row :gutter="10">
        <el-col :span="24">
          <echartData id="usageRate" :userOptions="usageOptions" isTime>
            <div class="flexRow" slot="time">
              <span
                :class="{ 'is-active': trendId === 6 }"
                @click="changeTrend(6)"
                >今日</span
              >
              <span
                :class="{ 'is-active': trendId === 5 }"
                @click="changeTrend(5)"
                >近1周</span
              >
              <span
                :class="{ 'is-active': trendId === 4 }"
                @click="changeTrend(4)"
                >近1月</span
              >
              <span
                :class="{ 'is-active': trendId === 2 }"
                @click="changeTrend(2)"
                >近半年</span
              >
            </div>
          </echartData>
        </el-col>
      </el-row>
      <div class="Modeltable">
        <page-table
          col-align="center"
          :operator="true"
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
          <template slot-scope="scope" slot="operator">
            <Flex style="justify-content: center">
              <el-button
                type="text"
                size="small"
                title="查看"
                :style="{ marginRight: '10px' }"
                @click.prevent.stop="
                  showView({
                    ...scope.row,
                  })
                "
                v-if="true || $_hasOperation($options.name, 'detail')"
              >
                <i
                  class="iconfont icon-xiangqing"
                  style="fontsize: 20px; color: #2edef4"
                />
              </el-button>
            </Flex>
          </template>
        </page-table>
      </div>
    </div>
  </pageMain>
</template>

<script>
import { mapGetters } from "vuex";
import * as echarts from "echarts"; // 引入echarts
import pageMain from "components/pageMain";
import headerTitle from "components/headerTitle/headerTitle";
import searchForm from "components/searchForm/searchForm";
import PageTable from "@/components/page-table";
import echartData from "@/view/lightPole/lightPoleStatistical/components/echartData";
import card from "@/view/lightPole/lightPoleStatistical/components/card";
import { cubicInOut } from "@/util/tool";
import { routePush } from "@/util/util";
import img7 from "@/view/index/wisdomWarnMap/images/img7.png";
import img8 from "@/view/index/wisdomWarnMap/images/img8.png";
import img9 from "@/view/index/wisdomWarnMap/images/img9.png";
import img10 from "@/view/index/wisdomWarnMap/images/img10.png";
import InfoItem from "./info";
import Flex from "@/components/flex";
import {
  getAlarmCallStats,
  getAlarmCallWorkingStats,
  getAlarmCallTrendStats,
  getAlarmCallRecordForPage,
} from "api/wisdomMonitor";
export default {
  name: "historyWarn",
  data() {
    return {
      searchVal: {},
      searchItems: [
        {
          type: "dataPicker",
          label: "报警时间",
          labelWidth: "60px",
          props: {
            type: "datetimerange",
            fieldName: "time",
            format: "yyyy-MM-dd HH:mm:ss",
          },
        },
        {
          type: "input",
          label: "报警设备名称",
          labelWidth: "85px",
          props: {
            fieldName: "deviceName",
          },
        },
        {
          type: "input",
          label: "位置",
          labelWidth: "45px",
          props: {
            fieldName: "installAddress",
          },
        },
      ],
      usageOptions: {
        title: "报警次数趋势分析",
        labers: [
          {
            background: "#17FFBB",
            name: "报警次数",
          },
        ],
        options: {
          grid: {
            show: true,
            borderWidth: 0,
            borderColor: "#fff",
            left: "3%",
            right: "4%",
            bottom: "10%",
            containLabel: true,
          },
          tooltip: {
            show: "true",
            trigger: "axis",
            formatter: "{b0}<br />{a0}: {c0}次",
          },
          xAxis: [
            {
              type: "category",
              data: [],
              axisLine: {
                lineStyle: {
                  color: "#28335A",
                },
              },
              axisTick: {
                alignWithLabel: true,
                lineStyle: {
                  color: "#28335A",
                },
              },
              axisLabel: {
                color: "#A0ACD8",
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              splitLine: {
                lineStyle: {
                  type: "solid",
                  color: "#28335A",
                },
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: "#A0ACD8",
                },
              },
              nameTextStyle: {
                color: "#A0ACD8",
              },
              splitArea: {
                show: false,
              },
            },
            {
              type: "value",
              splitLine: {
                lineStyle: {
                  type: "solid",
                  color: "#28335A",
                },
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: "#A0ACD8",
                },
              },
              nameTextStyle: {
                color: "#A0ACD8",
              },
              splitArea: {
                show: false,
              },
            },
          ],
          series: [
            {
              name: "告警次数",
              type: "line",
              data: [],
              symbol:
                "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAvpJREFUSA29VsluE0EQ7eoZj+MgJw5EICEicUmCxCFsZ/6ACIT4mNxy4yv4AoRA8Afc2Q6RknBBCkJCZI+I7dmKej30uGbsGAKBPrhrf+7q6qoh84u1yhy+3d5ocZOaxzYOQgosXFLO8sk8yqjP/Vuzi91VonRcKDpJ+WhtLerNhVO9gKOTbLR8IqN4Yis9fHr9eqzlnh4CYmZ6sP9++nvUmvRGp9nPxd3j550bB0TE2q8CJGmyb442z//uKXQgTeN0t9sLu5LO3MtdvsHgJGcBglj4o4iFmOCxwmIzBunqRa2R95FIAYSBnTF5Ok1h2DQmD4yxGadp39jwIM3yvYYUh4+FHWCIKeQ+eIeIi9+/GsxCUF95nnWo0bhsApLgJ6yMM06SL9YGLqi26nzKtlEgLnWoLq0sac4u0kQ0NxYExvInnJ3Yl74/CR/b4p2MunychJvRpbrjOB728NM2iA0MWv623u5OmrZWujuxfE2fJCeyUc4P2dBdInOF2Xwmw69jS88s8+B+JI1pTuv6zlrH5ijEi5ea0zjGXbzFhRcLIA2mx8ItuUsVc9nn5Xde5HcSMislmKQxJCmcNNvx/sCwaCteUO5SXSUtBE5CzEta5mnIofe822v+wLC+d2nDooQHEqRrwA1TdX3dHxjlg626D9IGOe6kqq9yw/qqP6wtunDVzYkzLcPFa75OD+ttxR8YFq1+yBEvXi1Ul2KHyLredQxlBQyLeaJkBSltRctQwkz0Qcs8DTn0nnd7zR8YFkOrYiQMepeR9+DlKN2EeEWewROp7I9S2123Cw95WdpwwDuCv1rAcM/i3uHGbL07uB6H9nPKxb14S/c8jIxXU4vbruowGevxYEz9+GtdPo6HvQaBrY/tTgTB/b13nVFT9W+6N6bti5mbgzEBIAyp5aPNC/UUQvcn8wgpe9le2PEjvRx8EEiX3R01ZV2DLHrXjokTYMvKimGWJ6ZRCMpfP8o9CBRl6rzVf/k48WDY//nnlgYDjaF1Fh+QPwABs7TSZWsDFQAAAABJRU5ErkJggg==",
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
                        color: "#2BF1FF", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#17FFBB", // 100% 处的颜色
                      },
                    ],
                    globalCoord: false, // 缺省为 false
                  },
                },
              },
              itemStyle: {
                normal: {
                  color: "#FFB018",
                  borderWidth: 10,
                  borderColor: "#F5A623",
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 1,
                        color: "rgba(43, 241, 255, 0.7)",
                      },
                      {
                        offset: 0,
                        color: "rgba(23, 255, 187, 0.42)",
                      },
                    ]),
                  },
                },
              },
              tooltip: {
                show: "true",
                formatter: "故障率：{c}%",
              },
              animationEasing: "cubicInOut",
              animationDuration: 1000,
              smooth: true,
            },
          ],
        },
      },
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      tableCols: [
        { label: "报警设备名称", prop: "deviceName" },
        { label: "位置", prop: "installAddress", minWidth: "150px" },
        { label: "报警人", prop: "callUser" },
        { label: "报警人联系电话", prop: "calUserTel", minWidth: "110px" },
        { label: "报警开始时间", prop: "callTime", minWidth: "110px" },
        { label: "报警结束时间", prop: "finishedTime", minWidth: "110px" },
        { label: "呼叫时长", prop: "waitingTimeLen" },
        { label: "处理时长", prop: "handleTimeLen" },
        { label: "接警人", prop: "handleUser" },
        {
          label: "报警状态",
          prop: "text",
          render: (h, scoped) => {
            const row = scoped.row;
            return <div>{row.alarmCallStatusText}</div>;
          },
        },
      ],
      currentTitleList: [
        {
          name: "wisdomWarnMap",
          title: "智慧报警",
        },
        {
          name: "historyWarn",
          title: "历史报警",
        },
      ],
      trendId: 4,
      items: [
        {
          id: "todayAlarmCallCount",
          src: img7,
          class: "blue",
          name: "今日报警次数",
          unit: "次",
          value: "",
          click: () => {},
        },
        {
          id: "monthAlarmCallCount",
          src: img8,
          class: "pink",
          name: "本月报警次数",
          unit: "次",
          value: "",
          click: () => {},
        },
        {
          id: "unProcessCount",
          src: img9,
          class: "green",
          name: "未处理报警数 ",
          unit: "个",
          value: "",
          click: () => {},
        },
        {
          id: "handleCount",
          src: img10,
          class: "orang",
          name: "处理中报警数",
          unit: "个",
          value: "",
          click: () => {},
        },
        {
          id: "finishedCount",
          src: img10,
          class: "orang",
          name: "已处理报警数",
          unit: "个",
          value: "",
          click: () => {
            // routePush({
            //   name: 'wisdomPublishAnalyse',
            //   parames: {}
            // });
          },
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getDataAllList();
      this._getAlarmCallTrendStats(this.trendId);
      this._getTerminalCount();
    });
  },
  computed: {
    ...mapGetters(["common", "openPage"]),
    routeName() {
      return this.$route.name;
    },
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
  },
  watch: {
    routeName(val) {},
  },
  methods: {
    // 查看详情
    showView(row) {
      this.$router.push({
        name: "warmDetail",
        query: {
          eventId: row.eventId,
        },
        params: row,
      });
    },
    onSearch(val) {
      this.searchVal = {
        ...val,
        timeBegin: val.time && val.time[0],
        timeEnd: val.time && val.time[1],
      };
      delete this.searchVal.time;
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList() {
      let data = {
        data: {
          ...this.searchVal,
        },
        pageNo: Number(this.page.current), // 查询的分页页码
        pageSize: Number(this.page.pageSize) || Number(10), // 查询的分页页大小, 默认10
        sorting: "",
      };
      getAlarmCallRecordForPage(data).then((res) => {
        if (res.code === "200") {
          const { data, total } = res.data;
          this.page.total = total;
          this.tableData = data;
        }
      });
    },
    onCurrentChange(val) {
      this.page.current = val;
      this.getDataAllList();
    },
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    changeTrend(index) {
      if (this.trendId !== index) {
        this.trendId = index;
        this._getAlarmCallTrendStats(index);
      }
    },
    _getAlarmCallTrendStats(parames) {
      getAlarmCallTrendStats({ dateInterval: parames }).then((res) => {
        if (res.code === "200") {
          this.setUserData(res.data);
        }
      });
    },
    setUserData(items) {
      let xData = [];
      let seriesData = [];
      items.map((item) => {
        xData.push(item.simpleTimeAxis);
        seriesData.push(item.alarmCallCount);
      });
      this.usageOptions.options.xAxis[0].data = xData;
      this.usageOptions.options.series[0].data = seriesData;
    },
    _getTerminalCount() {
      getAlarmCallWorkingStats({}).then((res) => {
        if (res.code === "200") {
          this.items = this.items.map((item) => {
            return {
              ...item,
              value: res.data[item.id] || item.value || 0,
            };
          });
        }
      });
      getAlarmCallStats({}).then((res) => {
        if (res.code === "200") {
          this.items = this.items.map((item) => {
            return {
              ...item,
              value: res.data[item.id] || item.value,
            };
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
#historyWarn {
  .content-view {
    // height: calc(100% - 200px);
    > .el-row {
      display: flex;
      flex-direction: row;
      height: 48%;
      &::after {
        content: "\20";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
        overflow: hidden;
      }
      .el-col {
        min-height: 5.5rem;
        #echartData {
          height: 100%;
          #card {
            height: 100%;
            #echartTable {
              min-height: 6rem;
              height: 90%;
            }
          }
          .charTitle {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            > .flexRow {
              background: #273875;
              border-radius: 5px; /*no*/
              padding: 2px; /*no*/
            }
            span {
              width: auto; /*no*/
              height: auto; /*no*/
              display: flex;
              padding: 3px 20px; /*no*/
              align-items: center;
              justify-content: center;
              font-size: 12px; /*no*/
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 600;
              color: #7383b2;
              cursor: pointer;
              &.is-active {
                background: linear-gradient(277deg, #25a8cb 0%, #58a0ff 100%);
                border-radius: 4px; /*no*/
                font-size: 12px; /*no*/
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #ffffff;
              }
            }
          }
        }
      }
      margin-bottom: 10px; /*no*/
      .staticData {
        height: 100%;
        #card {
          height: 100%;
        }
      }
      #staticData {
        padding: 45px;
        .items {
          margin-bottom: 24px;
          align-items: center;
          > span {
            width: 100px; /*no*/
            font-size: 12px; /*no*/
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: rgba(160, 172, 216, 1);
            margin-right: 15px; /*no*/
          }
          .progress {
            flex: 1;
            height: 14px;
            background: rgba(216, 216, 216, 0.06);
            border-radius: 7px;
            position: relative;
            span {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              background: linear-gradient(
                90deg,
                rgba(255, 116, 151, 0) 0%,
                rgba(255, 56, 123, 1) 100%
              );
              border-radius: 7px;
            }
          }
        }
      }
    }
  }
}
</style>
