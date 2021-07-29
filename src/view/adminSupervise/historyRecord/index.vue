/* eslint-disable camelcase */
<template>
  <div id="superviseHistoryRecord">
    <!-- 故障告警 -->
    <el-row :gutter="10" class="echartRow">
      <el-col :span="24">
        <echartData id="usageRate" :userOptions="usageOptions" isTime>
          <div class="flexCloumn" slot="time">
            <div
              style="textalign: left"
              v-if="currentItem ? currentItem.deviceName : ''"
            >
              {{ currentItem ? currentItem.deviceName : "" }}历史曲线
            </div>
            <div class="flexRow flexCenter" style="margin: 5px 0">
              <div v-if="searchVal.timeBegin">
                {{ searchVal.timeBegin }}~{{ searchVal.timeEnd }}
              </div>
              <div v-else>今日</div>
            </div>
          </div>
        </echartData>
      </el-col>
    </el-row>
    <header-title icon="iconfont icon-shouye" title="历史报警">
      <search-form
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
      />
    </header-title>

    <div class="content-view">
      <div class="Modeltable">
        <page-table
          col-align="center"
          operator-width="60"
          operator
          :data="tableData"
          :cols="tableCols"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          @selection-change="onSelectionChange"
        >
          <template slot-scope="scope" slot="operator">
            <el-button
              type="text"
              size="small"
              title="历史曲线"
              :style="{ marginRight: '10px' }"
              @click.prevent.stop="
                showView({
                  ...scope.row,
                })
              "
              v-if="true || $_hasOperation($options.name, 'detail')"
            >
              <i
                class="iconfont icon-dianji"
                style="fontsize: 20px; color: #2573f1"
              />
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
          </template>
        </page-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as echarts from "echarts"; // 引入echarts
import pageMain from "components/pageMain";
import headerTitle from "components/adminHeaderTitle/headerTitle";
import searchForm from "components/adminSearchForm/searchForm";
import PageTable from "@/components/adminPage-table";
import echartData from "@/view/lightPole/lightPoleStatistical/components/echartData";
import card from "@/view/lightPole/lightPoleStatistical/components/card";
import { cubicInOut } from "@/util/tool";
import { routePush } from "@/util/util";
import img7 from "@/view/index/wisdomWarnMap/images/img7.png";
import img8 from "@/view/index/wisdomWarnMap/images/img8.png";
import img9 from "@/view/index/wisdomWarnMap/images/img9.png";
import img10 from "@/view/index/wisdomWarnMap/images/img10.png";
import {
  getAlarmCallStats,
  getAlarmCallWorkingStats,
  getAlarmCallTrendStats,
  getAlarmCallRecordForPage,
} from "api/wisdomMonitor";
import {
  getAmbientMonitoringHistoryTrendStat,
  getAmbientMonitoringRecord,
} from "api/supervise";
export default {
  name: "superviseHistoryRecord",
  data() {
    return {
      searchVal: {},
      searchItems: [
        {
          type: "dataPicker",
          label: "记录时间",
          labelWidth: "60px",
          props: {
            type: "datetimerange",
            fieldName: "time",
            format: "yyyy-MM-dd HH:mm:ss",
          },
        },
        {
          type: "input",
          label: "设备名称",
          labelWidth: "60px",
          props: {
            fieldName: "deviceName",
          },
        },
      ],
      usageOptions: {
        title: "环境变化趋势分析",
        // labers: [{
        //   background: '#17FFBB',
        //   name: '报警次数'
        // }],
        options: {
          grid: {
            show: true,
            left: "3%",
            right: "4%",
            bottom: "10px",
            containLabel: true,
          },
          tooltip: {
            show: "true",
            trigger: "axis",
            formatter:
              "{b0}<br />{a0}: {c0}℃<br />{a1}: {c1}%<br />{a2}: {c2}分贝<br />{a3}: {c3}ug/m³<br />{a4}: {c4}ug/m³",
          },
          legend: {
            orient: "horizontal",
            itemHeight: 10,
            itemWidth: 10,
            textStyle: { color: "#000", fontSize: 12 },
            top: "0px",
            right: "auto",
            borderRadius: 5,
            data: [
              {
                name: "温度",
                icon: "rect",
                textStyle: {
                  borderRadius: 5,
                },
              },
              {
                name: "湿度",
                icon: "rect",
                textStyle: {
                  borderRadius: 4,
                },
              },
              {
                name: "噪声",
                icon: "rect",
                textStyle: {
                  borderRadius: 4,
                },
              },
              {
                name: "PM2.5",
                icon: "rect",
                textStyle: {
                  borderRadius: 4,
                },
              },
              {
                name: "PM10",
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
                color: "#7E7E7E",
                fontSize: "12",
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#E0E0E0",
                },
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: "#E0E0E0",
                },
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: "", // 左
              axisLabel: {
                formatter: "{value}",
                textStyle: {
                  color: "#7E7E7E",
                  fontSize: "12",
                },
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: "#E0E0E0",
                },
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#E0E0E0",
                },
              },
            },
            {
              type: "value",
              name: "", // 左
              axisLabel: {
                formatter: "{value}",
                textStyle: {
                  color: "#7E7E7E",
                  fontSize: "12",
                },
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: "#E0E0E0",
                },
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#E0E0E0",
                },
              },
            },
          ],
          series: [
            {
              name: "温度",
              type: "line",
              data: [],
              symbol: "circle",
              symbolSize: 3,
              lineStyle: {
                normal: {
                  width: 1,
                  color: "#FF9023",
                },
              },
              itemStyle: {
                normal: {
                  color: "#FF9023",
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 1,
                        color: "rgba(255, 144, 35, 0.3)",
                      },
                      {
                        offset: 0,
                        color: "rgba(255, 144, 35, 0)",
                      },
                    ]),
                  },
                },
              },
              animationEasing: "cubicInOut",
              animationDuration: 1000,
              smooth: true,
            },
            {
              name: "湿度",
              type: "line",
              data: [],
              symbol: "circle",
              symbolSize: 3,
              lineStyle: {
                normal: {
                  width: 1,
                  color: "#4CDC9F",
                },
              },
              itemStyle: {
                normal: {
                  color: "#4CDC9F",
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 1,
                        color: "rgba(76, 220, 159, 0.3)",
                      },
                      {
                        offset: 0,
                        color: "rgba(76, 220, 159, 0)",
                      },
                    ]),
                  },
                },
              },
              animationEasing: "cubicInOut",
              animationDuration: 1000,
              smooth: true,
            },
            {
              name: "噪声",
              type: "line",
              data: [],
              symbol: "circle",
              symbolSize: 3,
              lineStyle: {
                normal: {
                  width: 1,
                  color: "#7F00C0",
                },
              },
              itemStyle: {
                normal: {
                  color: "#7F00C0",
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 1,
                        color: "rgba(127, 0, 192, 0.3)",
                      },
                      {
                        offset: 0,
                        color: "rgba(127, 0, 192, 0)",
                      },
                    ]),
                  },
                },
              },
              animationEasing: "cubicInOut",
              animationDuration: 1000,
              smooth: true,
            },
            {
              name: "PM2.5",
              type: "line",
              data: [],
              symbol: "circle",
              symbolSize: 3,
              lineStyle: {
                normal: {
                  width: 1,
                  color: "#0F72FF",
                },
              },
              itemStyle: {
                normal: {
                  color: "#0F72FF",
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 1,
                        color: "rgba(15, 114, 255, 0.3)",
                      },
                      {
                        offset: 0,
                        color: "rgba(15, 114, 255, 0)",
                      },
                    ]),
                  },
                },
              },
              animationEasing: "cubicInOut",
              animationDuration: 1000,
              smooth: true,
            },
            {
              name: "PM10",
              type: "line",
              data: [],
              symbol: "circle",
              symbolSize: 3,
              lineStyle: {
                normal: {
                  width: 1,
                  color: "#C00000",
                },
              },
              itemStyle: {
                normal: {
                  color: "#C00000",
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 1,
                        color: "rgba(192, 0, 0, 0.3)",
                      },
                      {
                        offset: 0,
                        color: "rgba(192, 0, 0, 0)",
                      },
                    ]),
                  },
                },
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
        { label: "设备名称", prop: "deviceName" },
        { label: "位置", prop: "address", minWidth: "110px" },
        {
          label: "温度(℃)",
          prop: "temperatureValue",
          render: (h, scoped) => {
            return this.getAlarm(
              scoped.row.temperatureValue,
              scoped.row.temperatureAlarm
            );
          },
        },
        {
          label: "湿度(%)",
          prop: "humidityValue",
          render: (h, scoped) => {
            return this.getAlarm(
              scoped.row.humidityValue,
              scoped.row.humidityAlarm
            );
          },
        },
        {
          label: "噪声(分贝)",
          prop: "noiseValue",
          render: (h, scoped) => {
            return this.getAlarm(scoped.row.noiseValue, scoped.row.noiseAlarm);
          },
        },
        {
          label: "PM2.5(ug/m³)",
          prop: "pmValue",
          render: (h, scoped) => {
            return this.getAlarm(scoped.row.pmValue, scoped.row.pmAlarm);
          },
        },
        {
          label: "PM10(ug/m³)",
          prop: "pmTenValue",
          render: (h, scoped) => {
            return this.getAlarm(scoped.row.pmTenValue, scoped.row.pmTenAlarm);
          },
        },
        { label: "记录时间", prop: "createTime", minWidth: "140px" },
      ],
      selectsList: [],
      currentTitleList: [
        {
          name: "faultWarn",
          title: "历史数据",
        },
      ],
      trendId: 6,
      currentItem: {},
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
            routePush({
              name: "wisdomPublishAnalyse",
              parames: {},
            });
          },
        },
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getDataAllList();
      this._getAlarmCallTrendStats({
        dateInterval: 6,
      });
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
  },
  watch: {
    routeName(val) {},
  },
  methods: {
    getAlarm(text, status) {
      const statusType = {
        0: <div style="">{{ text }}</div>,
        1: <div style="color: #FF3C30">{{ text }}</div>,
        2: <div style="color: #FF3C30">{{ text }}</div>,
      };
      return statusType[status] || <div style="">{{ text }}</div>;
    },
    onSearch(val) {
      this.searchVal = {
        ...val,
        timeBegin: val.time && val.time[0],
        timeEnd: val.time && val.time[1],
      };
      delete this.searchVal.time;
      this.currentItem = null;
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
      getAmbientMonitoringRecord(data).then((res) => {
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
    onSelectionChange(args) {
      this.selectsList = args.map((arg) => arg.serialNumber);
    },
    showView(item) {
      this.currentItem = item;
      this._getAlarmCallTrendStats(
        {
          ...this.searchVal,
          serialNumber: item.serialNumber,
          deviceNo: item.deviceNo,
          installAddress: item.installAddress,
          onlineStatus: item.onlineStatus,
          deviceName: item.deviceName,
        },
        true
      );
    },
    _getAlarmCallTrendStats(parames, avg = true) {
      if (!parames.timeBegin) {
        parames.dateInterval = 6;
      }
      getAmbientMonitoringHistoryTrendStat(parames).then((res) => {
        if (res.code === "200") {
          this.setUserData(res.data, avg);
        }
      });
    },
    setUserData(items, avg) {
      let xData = [];
      let seriesData1 = [];
      let seriesData2 = [];
      let seriesData3 = [];
      let seriesData4 = [];
      let seriesData5 = [];
      items.map((item) => {
        xData.push(item.simpleTimeAxis);
        seriesData1.push(
          avg ? item.avgTemperatureValue : item.temperatureValue
        );
        seriesData2.push(avg ? item.avgHumidityValue : item.humidityValue);
        seriesData3.push(avg ? item.avgNoiseValue : item.noiseValue);
        seriesData4.push(avg ? item.avgPmValue : item.pmValue);
        seriesData5.push(avg ? item.avgPmTenValue : item.pmTenValue);
      });
      this.usageOptions.options.xAxis[0].data = xData;
      this.usageOptions.options.series[0].data = seriesData1;
      this.usageOptions.options.series[1].data = seriesData2;
      this.usageOptions.options.series[2].data = seriesData3;
      this.usageOptions.options.series[3].data = seriesData4;
      this.usageOptions.options.series[4].data = seriesData5;
    },
  },
};
</script>

<style lang="less">
#superviseHistoryRecord {
  .echartRow {
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
    }
  }
  > .el-row {
    .title {
      background: #fff;
      padding: 20px; /*no*/
      display: block;
      font-size: 16px; /*no*/
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #393939;
    }
  }
  .content-view {
    > .el-row {
      display: flex;
      flex-direction: row;
      &::after {
        content: "\20";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
        overflow: hidden;
      }
      /deep/.el-col {
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
