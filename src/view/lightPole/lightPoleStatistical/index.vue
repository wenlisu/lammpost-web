/* eslint-disable camelcase */
<template>
  <pageMain idName="lightPoleStatistical">
    <info-card :items="items" />
    <div id="lightPoleStatistical-wrap">
      <el-row :gutter="10" class="statisticalRow">
        <el-col :span="24" class="firstRow">
          <el-col :span="12">
            <div class="energy">
              <echartData
                id="energy"
                :userOptions="energyOptions"
                @click="toMonthAnalysis"
              />
            </div>
          </el-col>
          <el-col :span="12">
            <div class="luminance">
              <card title="灯杆照明亮度分析">
                <luminance />
              </card>
            </div>
          </el-col>
        </el-col>
        <el-col :span="24" class="secondRow">
          <div class="usageRate">
            <echartData
              id="usageRate"
              :userOptions="usageOptions"
              @click="toMonthAnalysis"
            />
          </div>
        </el-col>
        <!-- <el-col :span="5" class="timeContainer">
          <div class="timeLine">
            <card title="灯杆故障排名">
              <div slot="labers" class="flexCloumn laberItems labelMore">
                <div
                  class="caret"
                  v-for="(laber, index) in labers"
                  :key="index"
                  @click="tolightPoleList"
                >
                  <span :style="{ background: laber.background }" />
                  {{ laber.name }}
                  <i class="icon el-icon-arrow-right"></i>
                </div>
              </div>
              <el-timeline>
                <el-timeline-item
                  v-for="(activity, index) in activities"
                  :key="index"
                  :icon="activity.icon"
                  :type="activity.type"
                  :color="activity.color"
                  :size="activity.size"
                  :timestamp="activity.timestamp"
                >
                  <div
                    slot="dot"
                    class="flexRow flexCenter dot"
                    :style="{
                      borderColor:
                        colors[parseInt(Math.random() * colors.length)],
                    }"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="flexCloumn content">
                    <div class="timeTitle">
                      {{ activity.terminalName }}
                    </div>
                    <div class="flexCloumn card">
                      <span>累计灯亮时长{{ activity.onTotal }}个小时</span>
                      <span>累计故障时长{{ activity.faultTotal }}个小时</span>
                    </div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </card>
          </div>
        </el-col> -->
      </el-row>
    </div>
  </pageMain>
</template>

<script>
import * as echarts from "echarts"; // 引入echarts
import pageMain from "components/pageMain";
import echartData from "./components/echartData";
import InfoCard from "./components/infoCard.vue";
import card from "./components/card";
import luminance from "./components/luminance.vue";
import // listInstancesByCondition,
"api";
import { routePush } from "@/util/util";
import {
  lampFault,
  lampSaving,
  lampWork,
  getLampEnergyAnalysis,
  generalView,
} from "api/lightPoleStatistical/index";
import { getLampUsageRateList } from "@/api/wisdomLightPole";
export default {
  name: "lightPoleStatistical",
  data() {
    return {
      deviceConfig: {
        LAMP: {
          class: "blue",
          icon: "iconfont icon-dengpao-tianchong",
          device: "照明灯",
        },
        DOOR_ACCESS: {
          class: "orang",
          icon: "iconfont icon-chongdianzhuang",
          device: "门禁",
        },
        CAMERA: {
          class: "cyan",
          icon: "iconfont icon-jiankong",
          device: "摄像头",
        },
        AMBIENT: {
          class: "green",
          icon: "iconfont icon-huanjing",
          device: "环境监测器",
        },
        LED: {
          class: "lightBule",
          icon: "iconfont icon-ledxianshiping",
          device: "LED",
        },
        AUDIO: {
          class: "purple",
          icon: "iconfont icon-xiaofangguangbo",
          device: "广播器",
        },
        CALL: {
          class: "deepOrange",
          icon: "iconfont icon-yingjiguangbo",
          device: "报警器",
        },
        SMOKE_DETECTOR: {
          class: "deepOrange",
          icon: "iconfont icon-yangan1",
          device: "烟感报警器",
        },
        WIFI: {
          class: "painters",
          icon: "iconfont icon-wifi",
          device: "智能WIFI",
        },
        WATER_METER: {
          class: "painters",
          icon: "iconfont icon-zhihuishuibiao",
          device: "智慧水表",
        }
      },
      items: [
        // {
        //   id: "LAMP",
        //   device: "照明灯",
        //   class: "blue",
        //   icon: "iconfont icon-dengpao-tianchong",
        //   name: "灯杆总数",
        //   unit: "个",
        //   normal: "5",
        //   error: "7",
        //   click: () => {},
        // },
        // {
        //   id: "DOOR_ACCESS",
        //   device: "门禁",
        //   // src: img8,
        //   icon: "iconfont icon-chongdianzhuang",
        //   class: "orang",
        //   name: "故障总数",
        //   unit: "个",
        //   normal: "5",
        //   error: "7",
        //   click: () => {},
        // },
        // {
        //   id: "CAMERA",
        //   device: "摄像头",
        //   // src: img9,
        //   icon: "iconfont icon-jiankong",
        //   class: "cyan",
        //   name: "总耗电量 ",
        //   unit: "度",
        //   normal: "5",
        //   error: "7",
        //   click: () => {},
        // },
        // {
        //   id: "AMBIENT",
        //   device: "环境监测器",
        //   // src: img10,
        //   icon: "iconfont icon-huanjing",
        //   class: "green",
        //   name: "节能用电",
        //   unit: "度",
        //   normal: "5",
        //   error: "7",
        //   click: () => {},
        // },
        // {
        //   id: "LED",
        //   device: "LED显示屏",
        //   // src: img10,
        //   icon: "iconfont icon-ledxianshiping",
        //   class: "lightBule",
        //   name: "节能用电",
        //   unit: "度",
        //   normal: "5",
        //   error: "7",
        //   click: () => {},
        // },
        // {
        //   id: "AUDIO",
        //   device: "广播器",
        //   // src: img10,
        //   icon: "iconfont icon-xiaofangguangbo",
        //   class: "purple",
        //   name: "节能用电",
        //   unit: "度",
        //   normal: "5",
        //   error: "7",
        //   click: () => {},
        // },
        // {
        //   id: "CALL",
        //   device: "报警器",
        //   icon: "iconfont icon-yingjiguangbo",
        //   class: "deepOrange",
        //   name: "节能用电",
        //   unit: "度",
        //   normal: "5",
        //   error: "7",
        //   click: () => {},
        // },
        // {
        //   id: "WIFI",
        //   device: "智能WIFI",
        //   icon: "iconfont icon-wifi",
        //   class: "painters",
        //   name: "节能用电",
        //   unit: "度",
        //   normal: "5",
        //   error: "7",
        //   click: () => {},
        // },
      ],
      currentTitleList: [
        {
          name: "lightPoleMap",
          title: "智慧灯杆",
        },
        {
          name: "lightPoleStatistical",
          title: "能耗统计分析",
        },
      ],
      usageOptions: {
        title: "灯杆使用率",
        labers: [
          {
            background: "#4880FF",
            name: "亮灯率",
          },
          // {
          //   background: "rgba(255,196,0,1)",
          //   name: "故障率 ",
          // },
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
            formatter: "{b0}<br />{a0}: {c0}%<br />{a1}: {c1}%",
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
              axisTick: {
                show: false,
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
                show: false,
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
              axisTick: {
                show: false,
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
            // {
            //   name: "故障率",
            //   type: "line",
            //   data: [],
            //   symbol:
            //     "image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzBweCIgaGVpZ2h0PSIzMHB4IiB2aWV3Qm94PSIwIDAgMzAgMzAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYzICg5MjQ0NSkgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+R3JvdXAgQ29weeWkh+S7vTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSLmmbrmhadXaS1GaSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IldpLUZp5L2/55So6K6w5b2VIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTMxLjAwMDAwMCwgLTYzOC4wMDAwMDApIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY0LjAwMDAwMCwgNTU3LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLUNvcHnlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ2Ny4wMDAwMDAsIDgxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtQ29weS0yIiBmaWxsLW9wYWNpdHk9IjAuMSIgZmlsbD0iI0Y1QTYyMyIgY3g9IjE1IiBjeT0iMTUiIHI9IjE1Ij48L2NpcmNsZT4KICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLUNvcHkiIGZpbGwtb3BhY2l0eT0iMC4yIiBmaWxsPSIjRjVBNjIzIiBjeD0iMTUiIGN5PSIxNSIgcj0iMTAiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIGZpbGw9IiNGRkIwMTgiIGN4PSIxNSIgY3k9IjE1IiByPSI1Ij48L2NpcmNsZT4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+",
            //   symbolSize: 30,
            //   lineStyle: {
            //     normal: {
            //       width: 3,
            //       curveness: 0.2,
            //       color: {
            //         type: "linear",
            //         colorStops: [
            //           {
            //             offset: 0,
            //             color: "#FAD961", // 0% 处的颜色
            //           },
            //           {
            //             offset: 1,
            //             color: "#F76B1C", // 100% 处的颜色
            //           },
            //         ],
            //         globalCoord: false, // 缺省为 false
            //       },
            //     },
            //   },
            //   itemStyle: {
            //     normal: {
            //       color: "#FFB018",
            //       borderWidth: 10,
            //       borderColor: "#F5A623",
            //       areaStyle: {
            //         color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            //           {
            //             offset: 1,
            //             color: "rgba(250, 217, 97, 0.21)",
            //           },
            //           {
            //             offset: 0,
            //             color: "rgba(247, 107, 28, 0.09)",
            //           },
            //         ]),
            //       },
            //     },
            //   },
            //   tooltip: {
            //     show: "true",
            //     formatter: "故障率：{c}%",
            //   },
            //   smooth: true,
            //   animationEasing: "cubicInOut",
            //   animationDuration: 1000,
            // },
            {
              name: "亮灯率",
              type: "line",
              data: [],
              yAxisIndex: 1,
              lineStyle: {
                normal: {
                  width: 3,
                  color: {
                    type: "linear",
                    colorStops: [
                      {
                        offset: 0,
                        color: "#48D7FF", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#4880FF", // 100% 处的颜色
                      },
                    ],
                    globalCoord: false, // 缺省为 false
                  },
                },
              },
              itemStyle: {
                normal: {
                  opacity: 0,
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 1,
                        color: "rgba(250, 217, 97, 0.21)",
                      },
                      {
                        offset: 0,
                        color: "rgba(247, 107, 28, 0.09)",
                      },
                    ]),
                  },
                },
              },
              smooth: true,
              animationEasing: "cubicInOut",
              animationDuration: 1000,
            },
          ],
        },
      },
      energyOptions: {
        title: "灯杆能耗分析",
        labers: [
          {
            background: "#09FFC8",
            name: "总耗电",
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
              splitNumber: 6,
              minInterval: 1,
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
              axisTick: {
                show: false,
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
                show: true,
                lineStyle: {
                  type: "solid",
                  color: "#202D55",
                },
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: "#A0ACD8",
                },
              },
              axisTick: {
                show: false,
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
              // 节能
              name: "灯杆能耗",
              type: "line",
              data: [],
              lineStyle: {
                normal: {
                  width: 3,
                  curveness: 0.2,
                  color: {
                    type: "linear",
                    colorStops: [
                      {
                        offset: 0,
                        color: "#61E6FA", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#1CA2F7", // 100% 处的颜色
                      },
                    ],
                    globalCoord: false, // 缺省为 false
                  },
                },
              },
              itemStyle: {
                normal: {
                  opacity: 0,
                  color: "#09FFC8",
                  borderWidth: 10,
                  borderColor: "#09FFC8",
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 1,
                        color: "rgba(97, 121, 250, 0.31)",
                      },
                      {
                        offset: 0,
                        color: "rgba(247, 28, 182, 0.06)",
                      },
                    ]),
                  },
                },
              },
              smooth: true,
              animationEasing: "cubicInOut",
              animationDuration: 1000,
            },
            {
              name: "总耗电",
              type: "line",
              data: [],
              yAxisIndex: 1,
              lineStyle: {
                normal: {
                  width: 3,
                  color: {
                    type: "linear",
                    colorStops: [
                      {
                        offset: 0,
                        color: "#5386FA", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#2D71D8", // 100% 处的颜色
                      },
                    ],
                    globalCoord: false, // 缺省为 false
                  },
                },
              },
              itemStyle: {
                normal: {
                  opacity: 0,
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 1,
                        color: "rgba(97, 121, 250, 0.31)",
                      },
                      {
                        offset: 0,
                        color: "rgba(247, 28, 182, 0.06)",
                      },
                    ]),
                  },
                },
              },
              smooth: true,
              animationEasing: "cubicInOut",
              animationDuration: 1000,
            },
            {
              name: "实际用电",
              type: "line",
              data: [],
              yAxisIndex: 1,
              lineStyle: {
                normal: {
                  width: 3,
                  color: {
                    type: "linear",
                    colorStops: [
                      {
                        offset: 0,
                        color: "#FAD961", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#F76B1C", // 100% 处的颜色
                      },
                    ],
                    globalCoord: false, // 缺省为 false
                  },
                },
              },
              itemStyle: {
                normal: {
                  opacity: 0,
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 1,
                        color: "rgba(250, 217, 97, 0.21)",
                      },
                      {
                        offset: 0,
                        color: "rgba(247, 107, 28, 0.09)",
                      },
                    ]),
                  },
                },
              },
              smooth: true,
              animationEasing: "cubicInOut",
              animationDuration: 1000,
            },
          ],
        },
      },
      luminanceLabers: [
        {
          background: "#4CDB9F",
          name: "节能",
        },
        {
          background: "#4880FF",
          name: "中",
        },
        {
          background: "#EA2E18",
          name: "高",
        },
      ],
      luminanceOptions: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {d}%",
        },
        series: [
          {
            name: "亮度分析",
            type: "pie",
            radius: "65%",
            center: ["50%", "50%"],
            data: [
              {
                value: 33,
                name: "节能",
                itemStyle: {
                  color: "#24ccb8",
                },
                label: {
                  formatter: "{d}%",
                  color: "#fff",
                  fontFamily: "DINAlternate-Bold",
                  fontSize: 20,
                },
                labelLine: {
                  length: 10,
                  lineStyle: {
                    color: "#24ccb8",
                  },
                },
              },
              {
                value: 33,
                name: "中",
                itemStyle: {
                  color: "#4880ff",
                },
                label: {
                  formatter: "{d}%",
                  color: "#fff",
                  fontFamily: "DINAlternate-Bold",
                  fontSize: 20,
                },
                labelLine: {
                  length: 10,
                  lineStyle: {
                    color: "#4880ff",
                  },
                },
              },
              {
                value: 33,
                name: "高",
                itemStyle: {
                  color: "#ff5660",
                },
                label: {
                  formatter: "{d}%",
                  color: "#fff",
                  fontFamily: "DINAlternate-Bold",
                  fontSize: 20,
                },
                labelLine: {
                  length: 10,
                  lineStyle: {
                    color: "#ff5660",
                  },
                },
              },
            ],
          },
        ],
      },
      colors: [
        "#4880FF",
        "#1CD9C0",
        "#D9961C",
        "#D9961C",
        "#A427C1",
        "#7654FF",
        "#2BA68F",
        "#94DD66",
      ],
      activities: [],
      labers: [
        {
          name: "更多",
        },
      ],
    };
  },
  mounted() {
    this._lampWork();
    this._lampSaving();
    this._lampFault();
    this._generalView();
  },
  components: {
    echartData,
    card,
    pageMain,
    InfoCard,
    luminance,
  },
  methods: {
    init() {
      let _this = this;
      var myChart = echarts.init(this.$refs.luminance);
      myChart.setOption(this.luminanceOptions);
      myChart.on("click", function (param) {
        console.log(param); // 这里根据param填写你的跳转逻辑
        _this.toMonthAnalysis(param);
      });
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    _generalView() {
      generalView().then((res) => {
        if (res.code == "200") {
          this.items = res.data.map((item) => {
            return {
              id: item.deviceCategoryNo,
              ...this.deviceConfig[item.deviceCategoryNo],
              normal: item.onlineCount || 0,
              error: item.warnCount || 0,
              click: () => {},
            };
          });
        }
      });
    },
    // 灯杆使用率
    _lampWork() {
      getLampUsageRateList().then((res) => {
        const { data } = res;
        let time = [];
        let faultScale = [];
        let workScale = [];
        data.map((item) => {
          time.push(item.timeAxis);
          faultScale.push(Number(item.offlineRate));
          workScale.push(Number(item.openRate));
        });
        this.usageOptions.options.xAxis[0].data = time;
        this.usageOptions.options.series[0].data = faultScale;
        this.usageOptions.options.series[1].data = workScale;
      });
    },
    // 故障排名
    _lampFault() {
      lampFault().then((res) => {
        const { data } = res;
        // this.activities = data.lampStaticsFaultDto
        this.activities = [
          {
            faultCount: 0,
            faultTotal: 44,
            onTotal: 113,
            terminalName: "照明灯-813",
          },
          {
            faultCount: 0,
            faultTotal: 44,
            onTotal: 113,
            terminalName: "照明灯-813",
          },
          {
            faultCount: 0,
            faultTotal: 44,
            onTotal: 113,
            terminalName: "照明灯-813",
          },
        ];
      });
    },
    // 能耗分析
    _lampSaving() {
      getLampEnergyAnalysis().then((res) => {
        const { data } = res;
        let time = [];
        let savingPower = [];
        data.map((item) => {
          time.push(item.timeAxis);
          savingPower.push(item.powerConsumption);
        });
        this.energyOptions.options.xAxis[0].data = time;
        this.energyOptions.options.series[0].data = savingPower;
      });
    },
    // 跳转月分析
    toMonthAnalysis(parames) {
      // console.log("点击", parames)
      routePush({
        name: "lightPoleMonthAnalysis",
        // parames: parames
      });
    },
    // 跳转到智慧灯杆
    tolightPoleList() {
      routePush({
        name: "lightPoleList",
        // parames: parames
      });
    },
  },
};
</script>

<style lang="less" scoped>
#lightPoleStatistical {
  #lightPoleStatistical-wrap {
    height: calc(100% - 120px);
  }
  .statisticalRow {
    height: 100%;
    .firstRow {
      margin-bottom: 10px;
      .el-col {
        height: 100%;
      }
      .energy {
        height: 100%;
        #echartData {
          height: 100%;
          #card {
            height: 100% !important;
          }
        }
      }
    }
    .firstRow,
    .secondRow {
      height: 48%;
    }
    .secondRow {
      .usageRate {
        height: 100%;
        #echartData {
          height: 100%;
          #card {
            height: 100% !important;
          }
        }
      }
    }
    .luminance {
      height: 100%;
      #card {
        height: 100%;
      }
      .laberItems {
        position: absolute;
        bottom: 20px;
        right: 45px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        // color: rgba(255, 255, 255, 1);
        > div {
          margin-bottom: 8px;
          color: #9fade0;
          &:last-child {
            margin-bottom: 0;
          }
        }

        span {
          display: inline-block;
          width: 14px;
          height: 10px;
          margin-right: 4px;
        }
      }

      #luminance {
        width: 100%;
      }
    }
  }

  .timeContainer {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 3px;
      /*no*/
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(236, 239, 246, 0.2);
      /*no*/
      background: #4a5b8f;
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px rgba(236, 239, 246, 0.2);
      /*no*/
      border-radius: 0;
      background: transparent;
    }
  }

  .labelMore {
    position: absolute;
    // color: #fff;
    right: 0;
    top: 0.133333rem;
    margin-right: 0.106667rem;
    font-size: 0.186667rem;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #a0acd8;
    cursor: pointer;

    .icon {
      left: auto;
      right: 4px;
      position: relative;
    }
  }

  .timeLine {
    min-height: 100%;
    background: rgba(32, 45, 85, 0.49);
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 3px;
      background-color: transparent;
    }

    #card {
      background: transparent;
    }

    > div > ul {
      padding: 0 20px;

      .el-timeline-item {
        .el-timeline-item__tail {
          left: 10px;
          /*no*/
          border-left: 1px solid #556174;
          /*no*/
        }

        .el-timeline-item__dot {
          left: 0px;
          // top: 2.5px;
          /*no*/
        }

        .el-timeline-item__wrapper {
          top: -7px;
          .el-timeline-item__content {
            .content {
              padding: 5px 0 0;

              .timeTitle {
                margin-bottom: 10px;
                font-size: 14px;
                line-height: 20px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: rgba(215, 224, 255, 1);
                line-height: 20px;
                text-shadow: 0px 2px 4px rgba(9, 18, 62, 0.7);
                /*no*/
                position: relative;
                padding-right: 55px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                .timeNumber {
                  position: absolute;
                  right: 0;
                  top: 50%;
                  transform: translateY(-50%);
                  line-height: 18px;
                  /*no*/
                  padding: 1px 9px;
                  background: rgba(238, 82, 41, 1);
                  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5),
                    0px -1px 10px 0px rgba(255, 24, 38, 1);
                  /*no*/
                  border-radius: 13px;
                  font-size: 12px;
                  font-family: HelveticaNeue-Medium, HelveticaNeue;
                  font-weight: 500;
                  color: rgba(255, 255, 255, 1);
                }
              }

              .card {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(159, 173, 224, 1);

                span {
                  position: relative;
                  padding-left: 13px;
                  margin-bottom: 6px;

                  &::before {
                    content: "";
                    position: absolute;
                    top: 50%;
                    margin-top: -3px;
                    left: 0;
                    width: 6px;
                    height: 6px;
                    background: rgba(74, 224, 103, 1);
                  }

                  &:last-child {
                    &::before {
                      background: rgba(239, 125, 51, 1);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    .dot {
      width: 19px;
      /*no*/
      height: 19px;
      /*no*/
      line-height: 19px;
      /*no*/
      border-radius: 50%;
      background: rgba(29, 41, 87, 1);
      border: 2px solid rgba(72, 128, 255, 1);
      /*no*/
      font-size: 12px;
      /*no*/
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
    }
  }
  .el-col-19 {
    .el-col-12:last-child {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      height: 100%;
    }
  }
}
</style>
