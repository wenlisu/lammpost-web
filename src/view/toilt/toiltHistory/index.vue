<template>
  <div class="toiltPage">
    <div class="toiltPageHead">
      <p class="toiltPageTitle">
        城市厕所云平台
      </p>
    </div>
    <div class="toiltPageContent">
      <el-row :gutter="22">
        <el-col :span="8">
          <!-- 公厕七日消耗 -->
          <div class="contentItem">
            <div class="title">
              <i class="icon-img">
                <img src="../images/icon_1@2x.png" alt="" />
              </i>
              <span class="title-text">当日能耗情况</span>
            </div>
            <div class="expend-1">
              <div class="line-e1"></div>
              <ul class="ul-e1">
                <li
                  class="li-e1"
                  v-for="(item, index) in expendData"
                  :key="'e' + index"
                >
                  <p :class="item.consumeType == 2 ? 'num-e2' : 'num-e1'">
                    {{ item.num }}
                  </p>
                  <p class="text-e1">{{ item.text }}</p>
                </li>
              </ul>
              <div class="line-e1"></div>
            </div>
            <div class="chart-e1">
              <div id="expendChart" style="height: 240px;"></div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <!-- 公司运营情况 -->
          <div class="contentItem">
            <div class="title">
              <i class="icon-img">
                <img src="../images/icon_2@2x.png" alt="" />
              </i>
              <span class="title-text">公厕运营情况</span>
            </div>
            <div class="run-2">
              <p class="r1">GC00214</p>
              <p class="r2">道路公厕</p>
              <p class="r3">
                <i><img src="../images/location@2x.png" alt=""/></i>
                <span>广东省广州市越秀区北京街道中山五路</span>
              </p>
            </div>
            <div class="run-person">
              <!-- 当前人数 -->
              <div class="per-div">
                <p class="per-title">当前人数</p>
                <div class="per-numShow">
                  <div class="number">5</div>
                  <div class="number">5</div>
                </div>
                <p class="per-text">共有蹲位40，空闲13</p>
                <p class="per-text">运行流畅，请保持卫生</p>
                <!-- 柱状图 -->
                <div class="run-chart">
                  <span>男</span>
                  <div class="bar-chart"></div>
                  <span>14</span>
                </div>
              </div>
              <!-- 当日累计 -->
              <div class="per-div">
                <p class="per-title">当日累计</p>
                <div class="per-numShow">
                  <div class="number">5</div>
                  <div class="number">5</div>
                  <div class="number">5</div>
                </div>
                <p class="per-text stop">设计流量：400/天</p>
                <p class="per-text stop">已经连续3天超出，请进行合理规划</p>
                <!-- 柱状图 -->
                <div class="run-chart">
                  <span>男</span>
                  <div class="bar-chart"></div>
                  <span>14</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <!-- 监控界面 -->
          <div class="contentItem videoContent">
            <videoAddress
              :srcUrl="
                `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://RPUENL@open.ys7.com/E63112920/1.live&autoplay=0&audio=1&accessToken=${common.accessToken}&templete=2`
              "
            />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="22">
        <el-col :span="8">
          <!-- 公厕报警信息 -->
          <div class="contentItem">
            <div class="title">
              <i class="icon-img">
                <img src="../images/icon_4@2x.png" alt="" />
              </i>
              <span class="title-text">公厕报警信息</span>
            </div>
            <div class="totiletMaintain">
              <div class="mainTop">
                <div class="per-div">
                  <p class="per-title">当前人数</p>
                  <div class="per-numShow">
                    <div class="number">5</div>
                    <div class="number">5</div>
                  </div>
                </div>
                <div class="service">
                  <div class="progress">
                    <p class="progressText">已处理</p>
                    <el-progress
                      color="#49B1FA"
                      :percentage="70"
                      :stroke-width="10"
                      :format="format"
                    ></el-progress>
                  </div>
                  <div class="progress untreated">
                    <p class="progressText">未处理</p>
                    <el-progress
                      color="#18E1CB"
                      :percentage="60"
                      :stroke-width="10"
                      :format="format"
                    ></el-progress>
                  </div>
                  <div class="progress waitting">
                    <p class="progressText">待处理</p>
                    <el-progress
                      color="#E9BC07"
                      :percentage="50"
                      :stroke-width="10"
                      :format="format"
                    ></el-progress>
                  </div>
                </div>
              </div>
              <div class="mainBottom">
                <div id="serviceChart" style="height: 250px;"></div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <!-- 公厕卫生情况 -->
          <div class="contentItem">
            <div class="title">
              <i class="icon-img">
                <img src="../images/icon_5@2x.png" alt="" />
              </i>
              <span class="title-text">公厕卫生情况</span>
            </div>
            <div class="expend-1">
              <div class="line-e1"></div>
              <ul class="ul-e1">
                <li
                  class="li-e1"
                  v-for="(item, index) in sanitationData"
                  :key="'e' + index"
                >
                  <p
                    :class="item.consumeType == 2 ? 'num-e2' : 'num-e1'"
                    class="li-e1-p"
                  >
                    {{ item.num }}
                    <span class="symbol">{{ item.symbol }}</span>
                  </p>
                  <p class="text-e1">{{ item.text }}</p>
                </li>
              </ul>
              <div class="line-e1"></div>
            </div>
            <div class="chart-e1">
              <div id="sanitationChart" style="height: 240px;"></div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <!-- 公厕维护信息 -->
          <div class="contentItem">
            <div class="title">
              <i class="icon-img">
                <img src="../images/icon_6@2x.png" alt="" />
              </i>
              <span class="title-text">公厕维护信息</span>
            </div>
            <div class="totiletMaintain">
              <div class="mainTop">
                <div class="per-div">
                  <p class="per-title">当前维护</p>
                  <div class="per-numShow">
                    <div class="number">5</div>
                    <div class="number">5</div>
                  </div>
                </div>
                <div class="service">
                  <div class="progress">
                    <p class="progressText">已处理</p>
                    <el-progress
                      color="#49B1FA"
                      :percentage="70"
                      :stroke-width="10"
                      :format="format"
                    ></el-progress>
                  </div>
                  <div class="progress untreated">
                    <p class="progressText">未处理</p>
                    <el-progress
                      color="#18E1CB"
                      :percentage="60"
                      :stroke-width="10"
                      :format="format"
                    ></el-progress>
                  </div>
                  <div class="progress waitting">
                    <p class="progressText">待处理</p>
                    <el-progress
                      color="#E9BC07"
                      :percentage="50"
                      :stroke-width="10"
                      :format="format"
                    ></el-progress>
                  </div>
                </div>
              </div>
              <div class="mainBottom">
                <div id="maintainChart" style="height: 250px;"></div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts"; // 引入echarts
import videoAddress from "@/view/smokeDetector/smokeDetectorMap/components/videoAddress";
import { getAccessToken } from "api/screen";
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      /* consumeType: 
        1: 水
        2: 电 */
      expendData: [
        {
          consumeType: 1,
          num: 200,
          text: "当日用水量"
        },
        {
          consumeType: 1,
          num: 36245,
          text: "当月累计用水"
        },
        {
          consumeType: 2,
          num: 200,
          text: "当日用电量"
        },
        {
          consumeType: 2,
          num: 5555,
          text: "当月累计用电"
        }
      ],
      sanitationData: [
        {
          consumeType: 1,
          num: 32,
          symbol: "℃",
          text: "当前温度"
        },
        {
          consumeType: 1,
          num: 78,
          symbol: "%",
          text: "当前湿度"
        },
        {
          consumeType: 2,
          num: 0.3,
          symbol: "ug/m³",
          text: "当前氨气浓度"
        },
        {
          consumeType: 2,
          num: 0.05,
          symbol: "ug/m³",
          text: "当前硫化氢浓度"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["common", "openPage"])
  },
  mounted() {
    this.$nextTick(() => {
      this.handleInit01();
      this.handleInit02();
      this.handleInit03();
      this.handleInit04();
      if (!this.common.accessToken) {
        this._getAccessToken();
      }
    });
  },
  methods: {
    format(percentage) {
      return percentage;
    },
    ...mapMutations(["set_common"]),
    _getAccessToken() {
      getAccessToken().then(res => {
        if (res.code === "200") {
          this.set_common({
            accessToken: res.data
          });
        }
      });
    },
    // 公厕七日消耗
    handleInit01() {
      const dom_1 = document.getElementById("expendChart");
      let myChart = echarts.init(dom_1);
      let option = null;
      option = {
        title: {
          text: "",
          subtext: "",
          left: "center",
          align: "right"
        },
        grid: {
          top: 35
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: false,
            label: {
              backgroundColor: "#505765"
            }
          }
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: {
              onZero: false,
              lineStyle: {
                color: "#E4FDFF"
              }
            },
            data: [19, 20, 21, 22, 23, 24, 25]
          }
        ],
        yAxis: [
          {
            name: "(水：吨)",
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#E4FDFF"
              }
            }
          },
          {
            name: "(电：度)",
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#E4FDFF"
              }
            }
          }
        ],
        series: [
          {
            name: "(水：吨)",
            type: "line",
            smooth: false,
            lineStyle: {
              width: 1
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(25, 160, 105, 0.5)"
                  },
                  {
                    offset: 1,
                    color: "rgba(29, 189, 104, 0)"
                  }
                ]) //改变区域颜色
              }
            },
            itemStyle: {
              normal: {
                color: "#1DBD68", //改变折线点的颜色
                lineStyle: {
                  color: "#1DBD68" //改变折线颜色
                }
              }
            },
            emphasis: {
              focus: "series"
            },
            data: [666, 500, 467, 567, 780, 876, 690]
          },
          {
            name: "(电：度)",
            type: "line",
            smooth: false,
            yAxisIndex: 1,
            lineStyle: {
              width: 1
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(220, 217, 71, 0.5)"
                  },
                  {
                    offset: 1,
                    color: "rgba(216, 217, 75, 0)"
                  }
                ]) //改变区域颜色
              }
            },
            itemStyle: {
              normal: {
                color: "#DCD947", //改变折线点的颜色
                lineStyle: {
                  color: "#DCD947" //改变折线颜色
                }
              }
            },
            emphasis: {
              focus: "series"
            },
            data: [333, 666, 777, 888, 999, 368, 673]
          }
        ]
      };
      myChart.setOption(option, true);
      window.onresize = function() {
        myChart.resize();
      };
    },
    // 公厕报警信息
    handleInit02() {
      const dom_2 = document.getElementById("serviceChart");
      let myChart = echarts.init(dom_2);
      let option = null;
      option = {
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "#E4FDFF"
            }
          },
          data: ["0", "2", "4", "6", "8", "10", "12"]
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        yAxis: {
          name: "报警数",
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#E4FDFF"
            }
          }
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(25, 160, 105, 0.5)"
                  },
                  {
                    offset: 1,
                    color: "rgba(29, 189, 104, 0)"
                  }
                ]) //改变区域颜色
              }
            },
            itemStyle: {
              normal: {
                color: "#1DBD68", //改变折线点的颜色
                lineStyle: {
                  color: "#1DBD68" //改变折线颜色
                }
              }
            }
          }
        ]
      };
      myChart.setOption(option, true);
      window.onresize = function() {
        myChart.resize();
      };
    },
    handleInit03() {
      const dom_3 = document.getElementById("maintainChart");
      let myChart = echarts.init(dom_3);
      let option = null;
      option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: [
          "#49B1FA",
          "#18E1CB",
          "#FBF200",
          "#E9BC07",
          "#E93C07",
          "#9707E9"
        ],
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            labelLine: {
              show: false
            },
            label: {
              show: false
            },
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ]
          }
        ]
      };
      myChart.setOption(option, true);
      window.onresize = function() {
        myChart.resize();
      };
    },
    // 公厕卫生情况
    handleInit04() {
      const dom_4 = document.getElementById("sanitationChart");
      let myChart = echarts.init(dom_4);
      let option = null;
      option = {
        title: {
          text: "",
          subtext: "",
          left: "center",
          align: "right"
        },
        grid: {
          top: 35
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            animation: false,
            label: {
              backgroundColor: "#505765"
            }
          }
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: {
              onZero: false,
              lineStyle: {
                color: "#E4FDFF"
              }
            },
            data: [19, 20, 21, 22, 23, 24, 25]
          }
        ],
        yAxis: [
          {
            name: "(温湿)",
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#E4FDFF"
              }
            }
          },
          {
            name: "(浓度)",
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#E4FDFF"
              }
            }
          }
        ],
        series: [
          {
            name: "(温度)",
            type: "line",
            smooth: false,
            lineStyle: {
              width: 1
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(25, 160, 105, 0.5)"
                  },
                  {
                    offset: 1,
                    color: "rgba(29, 189, 104, 0)"
                  }
                ]) //改变区域颜色
              }
            },
            itemStyle: {
              normal: {
                color: "#1DBD68", //改变折线点的颜色
                lineStyle: {
                  color: "#1DBD68" //改变折线颜色
                }
              }
            },
            emphasis: {
              focus: "series"
            },
            data: [666, 500, 467, 567, 780, 876, 690]
          },
          {
            name: "(湿度)",
            type: "line",
            smooth: false,
            yAxisIndex: 1,
            lineStyle: {
              width: 1
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(220, 217, 71, 0.5)"
                  },
                  {
                    offset: 1,
                    color: "rgba(216, 217, 75, 0)"
                  }
                ]) //改变区域颜色
              }
            },
            itemStyle: {
              normal: {
                color: "#DCD947", //改变折线点的颜色
                lineStyle: {
                  color: "#DCD947" //改变折线颜色
                }
              }
            },
            emphasis: {
              focus: "series"
            },
            data: [333, 666, 777, 888, 999, 368, 673]
          }
        ]
      };
      myChart.setOption(option, true);
      window.onresize = function() {
        myChart.resize();
      };
    }
  },
  components: {
    videoAddress
  }
};
</script>

<style lang="less">
.toiltPage {
  height: 100%;
  min-width: 1200px; /*no*/
  background: url("../images/toilt_bg.png") no-repeat;
  background-size: 100% 100%;
  background-position: center;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .toiltPageHead {
    height: 53px;
    width: 100%;
    background: url("../images/title_bg.png") no-repeat;
    background-size: contain;
    background-position: center;
    .toiltPageTitle {
      text-align: center;
      font-size: 30px;
      line-height: 53px;
      font-family: AliHYAiHei-Beta;
      font-weight: 400;
      color: #ffffff;
      // line-height: 74px;
      text-shadow: 0px 1px 15px rgba(37, 37, 37, 0.4);
      -webkit-background-clip: text;
    }
  }
  .toiltPageContent {
    width: 100%;
    box-sizing: border-box;
    height: calc(100% - 53px);
    padding: 0 20px;
    .videoContent {
      height: 100%;
      position: relative;
      overflow: hidden;
      #videoAddress {
        width: auto;
        position: absolute;
        top: -48px; /*no*/
        left: 10px; /*no*/
        right: 10px; /*no*/
        height: calc(100% + 96px); /*no*/
        bottom: -48px; /*no*/
      }
    }
    .contentItem {
      min-height: 407px;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      background: url("../images/item_bg.png") no-repeat;
      background-size: 100% 100%;
      // background-position: center;
      margin-top: 20px;
      padding: 13px;
      .title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 13px;
        .icon-img {
          display: inline-block;
          width: 18px;
          height: 18px;
          margin-right: 3px;
          img {
            max-width: 100%;
          }
        }
        .title-text {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #e1effe;
        }
      }
      .expend-1 {
        .line-e1 {
          position: relative;
          width: 100%;
          height: 1px;
          background: #e1effe;
          opacity: 0.2;
          &::before {
            position: absolute;
            left: 0;
            top: -1px;
            display: inline-block;
            content: "";
            width: 20px;
            height: 2px;
            background: #e1effe;
          }
          &::after {
            position: absolute;
            right: 0;
            top: -1px;
            display: inline-block;
            content: "";
            width: 20px;
            height: 2px;
            background: #e1effe;
          }
        }
        .ul-e1 {
          display: flex;
          justify-content: space-around;
          align-items: center;
          .li-e1 {
            text-align: center;
            margin-top: 20px;
            margin-bottom: 16px;
            .num-e1 {
              font-size: 30px;
              font-family: Arial;
              font-weight: bold;
              margin-bottom: 20px;
              color: #0ad687;
            }
            .num-e2 {
              font-size: 30px;
              font-family: Arial;
              font-weight: bold;
              margin-bottom: 20px;
              color: #e9bc07;
            }
            .text-e1 {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #e4fdff;
            }
            .li-e1-p {
              .symbol {
                font-size: 14px;
                font-family: Arial;
                font-weight: bold;
              }
            }
          }
        }
      }
      .run-2 {
        width: 100%;
        // height: 112px;
        background: url("../images/item_bg2.png") no-repeat;
        background-size: 100% 100%;
        padding: 15px 10px;
        p {
          color: #49b1fa;
          font-weight: 400;
        }
        .r1 {
          font-size: 24px;
          font-family: Arial;
        }
        .r2 {
          font-size: 16px;
          line-height: 32px;
          font-family: Microsoft YaHei;
        }
        .r3 {
          font-size: 18px;
          font-family: Microsoft YaHei;
          i {
            display: inline-block;
            width: 20px;
            height: 20px;
            img {
              max-width: 100%;
            }
          }
        }
      }
      .run-person {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .per-title {
          width: 51%;
          padding: 0 40px;
          position: relative;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #e4fdff;
          margin-bottom: 13px;
          &::before {
            content: "";
            position: absolute;
            left: 0;
            top: 50%;
            display: inline-block;
            width: 32px;
            height: 2px;
            background: linear-gradient(
              90deg,
              rgba(73, 177, 250, 0) 0%,
              #49b1fa 100%
            );
          }
          &::after {
            content: "";
            position: absolute;
            right: 0;
            top: 50%;
            display: inline-block;
            width: 32px;
            height: 2px;
            background: linear-gradient(
              -90deg,
              rgba(73, 177, 250, 0) 0%,
              #49b1fa 100%
            );
          }
        }
        .per-div {
          width: 50%;
          .per-numShow {
            display: flex;
            align-items: center;
            .number {
              width: 50px;
              height: 64px;
              background: url("../images/num_view@2x.png") no-repeat;
              background-size: 100% 100%;
              margin-left: 5px;
              font-size: 60px;
              font-family: DS-Digital;
              font-weight: normal;
              color: #ffffff;
              text-align: center;
              line-height: 64px;
            }
          }
          .per-text {
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #49b1fa;
            line-height: 20px;
            margin-top: 10px;
          }
          .stop {
            color: #f23b22;
          }
          .run-chart {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            color: #49b1fa;
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            margin-top: 25px;
            .bar-chart {
              width: 180px;
              height: 10px;
              background: #49b1fa;
              margin: 0 10px;
            }
          }
        }
      }
      .flank {
        .flank-situation {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          li {
            margin-right: 20px;
            i {
              display: inline-block;
              width: 10px;
              height: 10px;
              border-radius: 50%;
            }
            .fault {
              background: #fe3a20;
            }
            .someone {
              background: #f1c100;
            }
            .free {
              background: #0ad687;
            }
            span {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #f1ffff;
            }
          }
        }
      }
      .flank-men {
        margin-left: 20px;
        .flank-text {
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #f1ffff;
          span {
            font-size: 32px;
            font-family: Arial;
            font-weight: 400;
          }
          .ft1 {
            color: #49b1fa;
          }
          .ft2 {
            color: #f1ffff;
          }
        }
        .flank-icon {
          display: flex;
          flex-wrap: wrap;
          // margin-left: 20px;
          li {
            width: 20px;
            height: 48px;
            margin-right: 26px;
            margin-top: 10px;
            img {
              max-width: 100%;
            }
          }
        }
      }
      .totiletMaintain {
        .mainTop {
          display: flex;
          justify-content: space-around;
          align-items: center;
          .per-div {
            width: 50%;
            .per-title {
              width: 51%;
              padding: 0 40px;
              position: relative;
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #e4fdff;
              margin-bottom: 13px;
              &::before {
                content: "";
                position: absolute;
                left: 0;
                top: 50%;
                display: inline-block;
                width: 32px;
                height: 2px;
                background: linear-gradient(
                  90deg,
                  rgba(73, 177, 250, 0) 0%,
                  #49b1fa 100%
                );
              }
              &::after {
                content: "";
                position: absolute;
                right: 0;
                top: 50%;
                display: inline-block;
                width: 32px;
                height: 2px;
                background: linear-gradient(
                  -90deg,
                  rgba(73, 177, 250, 0) 0%,
                  #49b1fa 100%
                );
              }
            }
            .per-numShow {
              display: flex;
              align-items: center;
              .number {
                width: 50px;
                height: 64px;
                background: url("../images/num_view@2x.png") no-repeat;
                background-size: 100% 100%;
                margin-left: 5px;
                font-size: 60px;
                font-family: DS-Digital;
                font-weight: normal;
                color: #ffffff;
                text-align: center;
                line-height: 64px;
              }
            }
          }
          .service {
            width: 50%;
            .progress {
              width: 100%;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              .progressText {
                font-size: 18px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #49b1fa;
                margin-right: 10px;
              }
              /deep/.el-progress {
                width: 70%;
                .el-progress-bar__outer {
                  border-radius: 0;
                  background-color: transparent;
                  .el-progress-bar__inner {
                    border-radius: 0;
                  }
                }
                .el-progress__text {
                  font-size: 18px !important;
                  font-family: Microsoft YaHei;
                  font-weight: 400;
                  color: #49b1fa;
                }
              }
            }
            .untreated {
              .progressText {
                color: #18e1cb;
              }
              /deep/.el-progress {
                .el-progress__text {
                  color: #18e1cb;
                }
              }
            }
            .waitting {
              .progressText {
                color: #e9bc07;
              }
              /deep/.el-progress {
                .el-progress__text {
                  color: #e9bc07;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>