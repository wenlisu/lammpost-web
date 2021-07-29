<template>
  <div class="toiltPage">
    <div class="toiltPageHead">
      <p class="toiltPageTitle">
        智慧公厕监控平台
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
              <span class="title-text">公厕七日客流</span>
            </div>
            <div class="expend-1">
              <div class="line-e1"></div>
              <ul class="ul-e1">
                <li class="li-e1">
                  <p class="num-e1">
                    {{ maleToilt.flowIn }}
                  </p>
                  <p class="text-e1">当日男客流</p>
                </li>
                <li class="li-e1">
                  <p class="num-e1">
                    {{ maleToilt.flowAll }}
                  </p>
                  <p class="text-e1">当月男客流</p>
                </li>
                <li class="li-e1">
                  <p class="num-e2">
                    {{ feMaleToilt.flowIn }}
                  </p>
                  <p class="text-e1">当日女客流</p>
                </li>
                <li class="li-e1">
                  <p class="num-e2">
                    {{ feMaleToilt.flowAll }}
                  </p>
                  <p class="text-e1">当月女客流</p>
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
              <!-- <p class="r1">GC00214</p> -->
              <p class="r2">公园公厕</p>
              <p class="r3">
                <i><img src="../images/location@2x.png" alt=""/></i>
                <span>佛山市顺德区永安路(均安镇文化广场)文化驿站</span>
              </p>
            </div>
            <div class="run-person">
              <!-- 当前人数 -->
              <div class="per-div">
                <p class="per-title">今日客流</p>
                <div class="per-numShow">
                  <div
                    class="number"
                    v-for="(i, index) in allFlowIn"
                    :key="index"
                  >
                    {{ i }}
                  </div>
                </div>
                <!-- <p class="per-text">共有蹲位{{maleToilt.pit.length + feMaleToilt.pit.length}}，空闲{{}}</p>
                <p class="per-text">运行流畅，请保持卫生</p> -->
                <!-- 柱状图 -->
                <div class="run-chart" v-if="allMaleFlowIn == 0">
                  <span>男</span>
                  <div class="bar-chart"></div>
                  <span>0</span>
                </div>
                <div class="run-chart" v-if="allMaleFlowIn > 0">
                  <span>男</span>
                  <!-- allMaleFlowIn -->
                  <el-progress
                    :percentage="allMaleFlowIn"
                    :format="format"
                  ></el-progress>
                </div>
                <div class="run-chart female" v-if="allFemaleflowIn == 0">
                  <span>女</span>
                  <div class="bar-chart"></div>
                  <span>0</span>
                </div>
                <div class="run-chart female" v-if="allFemaleflowIn > 0">
                  <span>女</span>
                  <el-progress
                    :percentage="allFemaleflowIn"
                    color="#18E1CB"
                    :format="format"
                  ></el-progress>
                </div>
              </div>
              <!-- 当日累计 -->
              <div class="per-div">
                <p class="per-title">累计客流</p>
                <div class="per-numShow">
                  <div class="number" v-for="(v, idx) in allFlowAll" :key="idx">
                    {{ v }}
                  </div>
                </div>
                <!-- <p class="per-text stop">设计流量：400/天</p>
                <p class="per-text stop">已经连续3天超出，请进行合理规划</p> -->
                <!-- 柱状图 -->
                <div class="run-chart" v-if="allMaleFlowAll == 0">
                  <span>男</span>
                  <div class="bar-chart"></div>
                  <span>0</span>
                </div>
                <div class="run-chart" v-if="allMaleFlowAll > 0">
                  <span>男</span>
                  <!-- allMaleFlowAll -->
                  <el-progress
                    :percentage="allMaleFlowAll"
                    :format="format"
                  ></el-progress>
                </div>
                <div class="run-chart female" v-if="allFemaleFlowAll == 0">
                  <span>女</span>
                  <div class="bar-chart"></div>
                  <span>0</span>
                </div>
                <div class="run-chart female" v-if="allFemaleFlowAll > 0">
                  <span>女</span>
                  <el-progress
                    :percentage="allFemaleFlowAll"
                    :format="format"
                  ></el-progress>
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
          <!-- 当前男厕所环境情况 -->
          <div class="contentItem">
            <div class="title">
              <i class="icon-img">
                <img src="../images/icon_4@2x.png" alt="" />
              </i>
              <span class="title-text">当前男厕环境情况</span>
            </div>
            <div class="gents">
              <div class="gents-left">
                <div class="gents-item">
                  <p>
                    氨气：<span>{{ maleToilt.nh3 }}PPM</span>
                  </p>
                </div>
                <div class="gents-item">
                  <p>
                    硫化氢：<span>{{ maleToilt.h2s }}PPM</span>
                  </p>
                </div>
                <div class="gents-item">
                  <p>
                    湿度：<span>{{ maleToilt.humidity }}%</span>
                  </p>
                </div>
                <div class="gents-item">
                  <p>
                    温度：<span>{{ maleToilt.temperature }}℃</span>
                  </p>
                </div>
              </div>
              <div class="gents-right">
                <div id="gentsChart" style="height: 280px;"></div>
                <p class="gents-status">
                  当前环境质量：<span
                    :class="qualityStatus == 1 ? 'short' : 'excellent'"
                    >{{ environmentQuality(maleToilt) }}</span
                  >，请保洁人员注意打扫
                </p>
                <div class="gents-text">
                  <p>保洁员：<span>江福</span></p>
                  <p>保洁次数：<span>5</span></p>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <!-- 公厕侧位情况 -->
          <div class="contentItem">
            <div class="title">
              <i class="icon-img">
                <img src="../images/icon_5@2x.png" alt="" />
              </i>
              <span class="title-text">公厕侧卫情况</span>
            </div>
            <div class="flank">
              <ul class="flank-situation">
                <div class="kong_toilt">
                  <li class="male">
                    <i>
                      <img src="../images/male_toilt.png" alt="" />
                    </i>
                    <span>空闲：</span>
                    <span>{{ maleFree.length }}</span>
                  </li>
                  <li class="female">
                    <i>
                      <img src="../images/female_toilt.png" alt="" />
                    </i>
                    <span>空闲：</span>
                    <span>{{ femaleFree.length }}</span>
                  </li>
                </div>
                <div class="use_toilt">
                  <li>
                    <i class="fault"></i>
                    <span>使用中</span>
                  </li>
                  <li>
                    <i class="free"></i>
                    <span>空闲</span>
                  </li>
                </div>
              </ul>
            </div>
            <div class="pitContent">
              <i
                class="maleIcon"
                v-for="(item, index) in maleToilt.pit"
                :key="index + 'male'"
                :class="'male' + index"
              >
                <img
                  v-if="item.state == 0"
                  src="../images/kong_male.png"
                  alt=""
                />
                <img
                  v-if="item.state == 1"
                  src="../images/use_male.png"
                  alt=""
                />
              </i>
              <span v-if="feMaleToilt.pit">
                <i
                  class="femaleIcon"
                  v-for="(i, idx) in feMaleToilt.pit.slice(0, 4)"
                  :key="idx + 'female'"
                  :class="'female' + idx"
                >
                  <img
                    v-if="i.state == 0"
                    src="../images/kong_female.png"
                    alt=""
                  />
                  <img
                    v-if="i.state == 1"
                    src="../images/use_male.png"
                    alt=""
                  />
                </i>
                <i
                  class="femaleIcon_r"
                  v-for="(i, idx) in feMaleToilt.pit.slice(4)"
                  :key="4 + idx + 'female'"
                  :class="'female_r' + idx"
                >
                  <img
                    v-if="i.state == 0"
                    src="../images/kong_female_r.png"
                    alt=""
                  />
                  <img
                    v-if="i.state == 1"
                    src="../images/use_female.png"
                    alt=""
                  />
                </i>
              </span>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <!-- 当前女厕环境情况 -->
          <div class="contentItem">
            <div class="title">
              <i class="icon-img">
                <img src="../images/icon_6@2x.png" alt="" />
              </i>
              <span class="title-text">当前女厕环境情况</span>
            </div>
            <div class="gents">
              <div class="gents-left">
                <div class="gents-item">
                  <p>
                    氨气：<span>{{ feMaleToilt.nh3 }}PPM</span>
                  </p>
                </div>
                <div class="gents-item">
                  <p>
                    硫化氢：<span>{{ feMaleToilt.h2s }}PPM</span>
                  </p>
                </div>
                <div class="gents-item">
                  <p>
                    湿度：<span>{{ feMaleToilt.humidity }}%</span>
                  </p>
                </div>
                <div class="gents-item">
                  <p>
                    温度：<span>{{ feMaleToilt.temperature }}℃</span>
                  </p>
                </div>
              </div>
              <div class="gents-right">
                <div id="womenGentsChart" style="height: 280px;"></div>
                <p class="gents-status">
                  当前环境质量：<span
                    :class="qualityStatus == 1 ? 'short' : 'excellent'"
                    >{{ environmentQuality(feMaleToilt) }}</span
                  >，请保洁人员注意打扫
                </p>
                <div class="gents-text">
                  <p>保洁员：<span>林红</span></p>
                  <p>保洁次数：<span>4</span></p>
                </div>
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
import {
  newDevDataList,
  getQueryHistoryOneWeek,
  getFindByDate
} from "api/toilt";
// 除法运算
function division(num1, num2) {
  var t1, t2, r1, r2;
  try {
    t1 = num1.toString().split(".")[1].length;
  } catch (e) {
    t1 = 0;
  }
  try {
    t2 = num2.toString().split(".")[1].length;
  } catch (e) {
    t2 = 0;
  }
  r1 = Number(num1.toString().replace(".", ""));
  r2 = Number(num2.toString().replace(".", ""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}
// 获取当前日期
function getCurrentFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
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
          text: "当日男客流"
        },
        {
          consumeType: 1,
          num: 36245,
          text: "当月男客流"
        },
        {
          consumeType: 2,
          num: 200,
          text: "当日女客流"
        },
        {
          consumeType: 2,
          num: 5555,
          text: "当月女客流"
        }
      ],
      gentsChart: null,
      womenGentsChart: null,
      allMaleFlowAll: 0,
      allFemaleFlowAll: 0,
      allMaleFlowIn: 0,
      allFemaleflowIn: 0,
      allFlowIn: [], //今日客流
      allFlowAll: [], //累计客流
      maleToilt: {},
      feMaleToilt: {},
      maleToiltArr: [], //男厕所环境
      feMaleToiltArr: [], //女厕所环境
      maleFree: [], //男厕空闲坑位
      femaleFree: [], //女厕空闲坑位
      qualityStatus: "", //1:差；2：优
      weekMaleNum: [], //一周男厕客流
      weekFeMaleNum: [], //一周女厕客流
      weekDays: [] //一周日期
    };
  },
  computed: {
    ...mapGetters(["common", "openPage"]),
    environmentQuality: function() {
      return function(value) {
        let { h2s, nh3 } = value;
        // 环境质量优差计算
        if (h2s && nh3) {
          const h2sMax = division(1.39, h2s); //硫化氢阈值
          const nh3Max = division(0.695, nh3); //氨气阈值
          if (h2sMax >= 0.0076 || nh3Max >= 0.028) {
            this.qualityStatus = 1;
            return "差";
          }
          if (h2sMax < 0.0076 && nh3Max < 0.028) {
            this.qualityStatus = 2;
            return "优";
          }
        }
      };
    }
  },
  created() {},
  mounted() {
    this.$nextTick(async () => {
      let code = this.$route.query.code;
      await this._getDevDataList();
      await this._getQueryHistoryOneWeek(code);
      // await this._getFindByDate();
      if (!this.common.accessToken) {
        this._getAccessToken();
      }
    });
  },
  methods: {
    ...mapMutations(["set_common"]),
    drow() {
      // 男
      this.gentsChart = this.$echarts.init(
        document.getElementById("gentsChart")
      );
      // 女
      this.womenGentsChart = this.$echarts.init(
        document.getElementById("womenGentsChart")
      );
      window.addEventListener("resize", () => {
        this.gentsChart.resize();
        this.womenGentsChart.resize();
      });
    },
    _getAccessToken() {
      getAccessToken().then(res => {
        if (res.code === "200") {
          this.set_common({
            accessToken: res.data
          });
        }
      });
    },
    format(percentage) {
      return percentage;
    },
    // 公厕七日消耗
    handleInit01(weekMaleNum, weekFeMaleNum, weekDays) {
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
            data: weekDays
          }
        ],
        yAxis: [
          {
            name: "男厕(人)",
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#E4FDFF"
              }
            }
          },
          {
            name: "女厕(人)",
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
            name: "男厕(人)",
            type: "line",
            smooth: false,
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
            lineStyle: {
              width: 1
            },
            emphasis: {
              focus: "series"
            },
            data: weekMaleNum
          },
          {
            name: "女厕(人)",
            type: "line",
            smooth: false,
            yAxisIndex: 1,
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
            lineStyle: {
              width: 1
            },
            emphasis: {
              focus: "series"
            },
            data: weekFeMaleNum
          }
        ]
      };
      myChart.setOption(option, true);
      window.onresize = function() {
        myChart.resize();
      };
    },
    // 男厕环境情况
    handleInit02(echartData) {
      const dom_2 = document.getElementById("gentsChart");
      let myChart = echarts.init(dom_2);
      let option = null;
      option = {
        title: {
          text: ""
        },
        tooltip: {},
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: "#F1FFFF",
              fontSize: 16
            }
          },
          indicator: [
            { name: "硫化氢" },
            { name: "氨气" },
            { name: "温度" },
            { name: "湿度" }
          ]
        },
        series: [
          {
            name: "当前男厕环境情况",
            type: "radar",
            // areaStyle: {normal: {}},
            data: [
              {
                value: echartData
              }
            ]
          }
        ]
      };
      myChart.setOption(option, true);
      window.onresize = function() {
        myChart.resize();
      };
    },
    handleInit03(echartData) {
      const dom_3 = document.getElementById("womenGentsChart");
      let myChart = echarts.init(dom_3);
      let option = null;
      option = {
        title: {
          text: ""
        },
        tooltip: {},
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: "#F1FFFF",
              fontSize: 16
            }
          },
          indicator: [
            { name: "硫化氢" },
            { name: "氨气" },
            { name: "温度" },
            { name: "湿度" }
          ]
        },
        series: [
          {
            name: "当前女厕环境情况",
            type: "radar",
            // areaStyle: {normal: {}},
            data: [
              {
                value: echartData
              }
            ]
          }
        ]
      };
      myChart.setOption(option, true);
      window.onresize = function() {
        myChart.resize();
      };
    },
    // 公厕下的设备详情
    _getDevDataList() {
      let data = {
        toiletId: this.$route.query.code
      };
      newDevDataList(data).then(res => {
        if (res.code == "200") {
          let { male, female } = res.data;
          this.maleToilt = male;
          this.feMaleToilt = female;
          for (let k in male) {
            if (k === "h2s") {
              this.maleToiltArr[0] = male[k];
            } else if (k === "nh3") {
              this.maleToiltArr[1] = male[k];
            } else if (k === "humidity") {
              this.maleToiltArr[3] = male[k];
            } else if (k === "temperature") {
              this.maleToiltArr[2] = male[k];
            }
          }
          for (let j in female) {
            if (j === "h2s") {
              this.feMaleToiltArr[0] = female[j];
            } else if (j === "nh3") {
              this.feMaleToiltArr[1] = female[j];
            } else if (j === "humidity") {
              this.feMaleToiltArr[3] = female[j];
            } else if (j === "temperature") {
              this.feMaleToiltArr[2] = female[j];
            }
          }
          this.allMaleFlowAll = male.flowAll;
          this.allMaleFlowIn = male.flowIn;
          this.allFemaleFlowAll = female.flowAll;
          this.allFemaleflowIn = female.flowIn;
          // 今日客流
          const curIn = Number(male.flowIn) + Number(female.flowIn);
          // 累计客流
          const allIn = Number(male.flowAll) + Number(female.flowAll);
          //converToArray：将数字转为数组
          const converToArray = number =>
            [...`${number}`].map(el => parseInt(el));
          this.allFlowIn = converToArray(curIn);
          this.allFlowAll = converToArray(allIn);
          // 男厕空闲坑位
          this.maleFree = male.pit.filter(e => e.state == 0);
          // 女厕空闲坑位
          this.femaleFree = female.pit.filter(e => e.state == 0);
          this.handleInit02(this.maleToiltArr);
          this.handleInit03(this.feMaleToiltArr);
        }
      });
    },
    // 获取七天内公厕客流数据
    _getQueryHistoryOneWeek(code) {
      getQueryHistoryOneWeek(code).then(res => {
        if (res.code == "200") {
          this.weekMaleNum = res.data.map(e => {
            return e.flowin4m;
          });
          this.weekFeMaleNum = res.data.map(i => {
            return i.flowin4f;
          });
          this.weekDays = res.data.map(v => {
            return v.date.replace(/2021-/gi, ``);
          });
          this.handleInit01(
            this.weekMaleNum,
            this.weekFeMaleNum,
            this.weekDays
          );
        }
      });
    },
    // 获取指定日期的公厕客流数据
    _getFindByDate() {
      const date = getCurrentFormatDate();
      let data = {
        date
      };
      getFindByDate(data).then(res => {
        console.log(res, "+++");
      });
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
            display: inline-block;
            content: "";
            width: 20px;
            height: 2px;
            background: #e1effe;
          }
          &::after {
            position: absolute;
            right: 0;
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
              margin-bottom: 22px;
              color: #0ad687;
            }
            .num-e2 {
              font-size: 30px;
              font-family: Arial;
              font-weight: bold;
              margin-bottom: 22px;
              color: #e9bc07;
            }
            .text-e1 {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #e4fdff;
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
          margin: 0 auto;
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
          margin-top: 28px;
          .per-numShow {
            display: flex;
            align-items: center;
            justify-content: center;
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
            justify-content: center;
            align-items: center;
            color: #49b1fa;
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            margin-top: 25px;
            .bar-chart {
              width: 10px;
              height: 10px;
              background: #49b1fa;
              margin: 0 10px;
            }
            span {
              margin-right: 10px;
            }
            /deep/.el-progress--line {
              width: 100%;
            }
            /deep/.el-progress-bar__outer {
              height: 10px !important;
              border-radius: 0;
              background-color: transparent !important;
            }
            /deep/.el-progress-bar__inner {
              border-radius: 0;
            }
            /deep/.el-progress__text {
              color: #49b1fa;
              font-size: 18px !important;
            }
          }
          .female {
            span {
              color: #18e1cb;
              margin-right: 10px;
            }
            /deep/.el-progress__text {
              color: #18e1cb;
              font-size: 18px !important;
            }
          }
        }
      }
      .flank {
        .flank-situation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .kong_toilt {
            display: flex;
            align-items: center;
            li {
              i {
                display: inline-block;
                width: 10px;
                height: 24px;
                img {
                  max-width: 100%;
                }
              }
            }
            .male {
              display: flex;
              align-items: center;
              color: #49b1fa;
              span {
                font-size: 16px;
              }
            }
            .female {
              display: flex;
              align-items: center;
              color: #18e1cb;
              margin-left: 20px;
              span {
                font-size: 16px;
              }
            }
          }
          .use_toilt {
            display: flex;
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
      // 男厕
      .gents {
        display: flex;
        justify-content: space-around;
        align-items: center;
        .gents-left {
          display: flex;
          flex-direction: column;
          .gents-item {
            /* width: 50px;
            height: 64px; */
            background: url("../images/gents_bg.png") no-repeat;
            background-size: 100% 100%;
            padding: 10px 16px;
            margin-bottom: 44px;
            p {
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #e4fdff;
              span {
                font-size: 18px;
                font-family: Arial;
                font-weight: 400;
                color: #24e5ea;
              }
            }
          }
        }
        .gents-right {
          // padding-right: 60px;
          .gents-status {
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #49b1fa;
            .short {
              color: #fe3a1f;
              font-size: 24px;
            }
            .excellent {
              color: #0ad687;
              font-size: 24px;
            }
          }
          .gents-text {
            display: flex;
            align-items: center;
            p {
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #49b1fa;
              margin-right: 23px;
              span {
                color: #e4fdff;
              }
            }
          }
        }
      }
      .pitContent {
        position: relative;
        height: 330px;
        background: url("../images/pit.png") no-repeat;
        background-size: 100% 100%;
        // padding: 10px 16px;
        // margin-top: 10px;
        .maleIcon {
          position: absolute;
          left: 140px;
          display: inline-block;
          width: 36px;
          height: 15px;
          img {
            max-width: 100%;
          }
        }
        .femaleIcon {
          position: absolute;
          left: 140px;
          display: inline-block;
          width: 36px;
          height: 15px;
          img {
            max-width: 100%;
          }
        }
        .femaleIcon_r {
          position: absolute;
          right: 140px;
          display: inline-block;
          width: 36px;
          height: 15px;
          img {
            max-width: 100%;
          }
        }
        .male0 {
          top: 10px;
        }
        .male1 {
          top: 44px;
        }
        .male2 {
          top: 80px;
        }
        .male3 {
          top: 114px;
        }
        .female0 {
          bottom: 116px;
        }
        .female1 {
          bottom: 83px;
        }
        .female2 {
          bottom: 47px;
        }
        .female3 {
          bottom: 13px;
        }
        .female_r0 {
          bottom: 97px;
        }
        .female_r1 {
          bottom: 67px;
        }
        .female_r2 {
          bottom: 37px;
        }
        .female_r3 {
          bottom: 11px;
        }
      }
    }
  }
}
</style>