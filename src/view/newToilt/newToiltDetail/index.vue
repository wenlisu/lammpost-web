<template>
  <div class="wisdomToiltDetail">
    <el-container>
      <el-header>
        <div class="toiltHeader">
          <img src="../images/header.png" alt="" />
        </div>
        <div class="toiltInfo">
          <div class="currentFlow">
            <div class="flowNum">
              <div class="imgBox">
                <img src="../images/cur_left.gif" alt="" />
              </div>
              <div class="flowText">
                <p>今日客流</p>
                <p class="curIn">{{ curIn }}</p>
              </div>
            </div>
            <div class="flowProgress">
              <div class="pro">
                <span>男</span>
                <el-progress
                  class="left_man"
                  :percentage="malePer"
                  :stroke-width="10"
                ></el-progress>
              </div>
              <div class="pro">
                <span>女</span>
                <el-progress
                  class="left_woman"
                  :percentage="femalePer"
                  :stroke-width="10"
                ></el-progress>
              </div>
            </div>
          </div>
          <div class="centerInfo">
            <div class="left"></div>
            <div class="center">
              <i class="icon"></i>
              <p class="name">{{ toiletName }}</p>
            </div>
            <div class="right"></div>
          </div>
          <div class="currentFlow">
            <div class="flowProgress">
              <div class="pro">
                <span>男</span>
                <el-progress
                  class="right_man"
                  :percentage="allMalePer"
                  :stroke-width="10"
                ></el-progress>
              </div>
              <div class="pro">
                <span>女</span>
                <el-progress
                  class="right_woman"
                  :percentage="allFeMalePer"
                  :stroke-width="10"
                ></el-progress>
              </div>
            </div>
            <div class="flowNum">
              <div class="imgBox">
                <img src="../images/total_right.gif" alt="" />
              </div>
              <div class="flowText">
                <p>累计客流</p>
                <p class="allIn">{{ allIn }}</p>
              </div>
            </div>
          </div>
        </div>
      </el-header>
      <el-container class="container">
        <el-aside width="470px" class="asideLeft">
          <div class="left-1">
            <div class="publicTitle">
              <p class="c-title">公厕七日客流</p>
              <div class="c-img"></div>
            </div>
            <ul class="leftList">
              <li>
                <div class="weekText">
                  <p>当日男客流</p>
                  <p>{{ maleToilt.flowIn }}</p>
                </div>
                <i class="weekImg">
                  <img src="../images/week1.png" alt="" />
                </i>
              </li>
              <li>
                <div class="weekText">
                  <p>当月男客流</p>
                  <p>{{ maleToilt.flowAll }}</p>
                </div>
                <i class="weekImg">
                  <img src="../images/week2.png" alt="" />
                </i>
              </li>
              <li>
                <div class="weekText">
                  <p>当日女客流</p>
                  <p>{{ feMaleToilt.flowIn }}</p>
                </div>
                <i class="weekImg">
                  <img src="../images/week3.png" alt="" />
                </i>
              </li>
              <li>
                <div class="weekText">
                  <p>当月女客流</p>
                  <p>{{ feMaleToilt.flowAll }}</p>
                </div>
                <i class="weekImg">
                  <img src="../images/week4.png" alt="" />
                </i>
              </li>
            </ul>
            <div ref="gentsChart" class="gentsChart"></div>
          </div>
          <!-- <div class="left-2">
            <div class="publicTitle">
              <p class="c-title">监控画面</p>
              <div class="c-img"></div>
              <div class="videoContent">
                <videoAddress
                  :srcUrl="
                    `https://open.ys7.com/ezopen/h5/iframe_se?url=ezopen://RPUENL@open.ys7.com/E63112920/1.live&autoplay=0&audio=1&accessToken=${common.accessToken}&templete=2`
                  "
                />
              </div>
            </div>
          </div> -->
        </el-aside>
        <el-main>
          <div class="toiltKketch">
            <!-- 女厕 -->
            <ul class="topFemal">
              <li
                v-for="item in topFemalData"
                :key="item.deviceId"
                v-if="item.state == 0"
              >
                <img class="toiltIcon" src="../images/toiltIcon.png" alt="" />
              </li>
              <div v-else class="redIcon">
                <img class="redToilt" src="../images/redToilt.png" alt="" />
                <img class="redCircle" src="../images/redCircle.png" alt="" />
                <div class="redTopInfo"></div>
              </div>
            </ul>
            <ul class="bottomFemal">
              <li
                v-for="item in bottomFemalData"
                :key="item.deviceId"
                v-if="item.state == 0"
              >
                <img class="toiltIcon" src="../images/toiltIcon.png" alt="" />
              </li>
              <div v-else class="redIcon">
                <img class="redToilt" src="../images/redToilt.png" alt="" />
                <img class="redCircle" src="../images/redCircle.png" alt="" />
                <!-- <img class="redInfo" src="../images/redBottomInfo.png" alt="" /> -->
                <div class="redBottomInfo"></div>
              </div>
            </ul>
            <!-- 男厕 -->
            <ul class="topMale">
              <li
                v-for="item in topMaleData"
                :key="item.deviceId"
                v-if="item.state == 0"
              >
                <img class="toiltIcon" src="../images/toiltIcon.png" alt="" />
              </li>
              <div v-else class="redIcon">
                <img class="redToilt" src="../images/redToilt.png" alt="" />
                <img class="redCircle" src="../images/redCircle.png" alt="" />
                <div class="redTopInfo"></div>
              </div>
            </ul>
            <ul class="bottomMale">
              <li
                v-for="item in bottomMaleData"
                :key="item.deviceId"
                v-if="item.state == 0"
              >
                <img class="toiltIcon" src="../images/toiltIcon.png" alt="" />
              </li>
              <div v-else class="redIcon">
                <img class="redToilt" src="../images/redToilt.png" alt="" />
                <img class="redCircle" src="../images/redCircle.png" alt="" />
                <div class="redBottomInfo"></div>
              </div>
            </ul>
          </div>
          <div class="toiltTooltip">
            <div class="tooltipBox">
              <div class="tooltipBg">
                <div class="tooltipImg">
                  <img src="../images/tooltip2.png" alt="" />
                </div>
                <div class="tooltipInfo">
                  <p class="tipTitle">空闲中</p>
                  <p class="tip1">{{ allFree }}</p>
                </div>
              </div>
            </div>
            <div class="tooltipBox">
              <div class="tooltipBg">
                <div class="tooltipImg">
                  <img src="../images/tooltip1.png" alt="" />
                </div>
                <div class="tooltipInfo">
                  <p class="tipTitle">使用中</p>
                  <p class="tip1 tip2">{{ allUsed }}</p>
                </div>
              </div>
            </div>
          </div>
        </el-main>
        <el-aside width="470px" class="asideRight">
          <div class="right-1">
            <div class="publicTitle">
              <p class="c-title">当前男厕环境情况</p>
              <div class="c-img"></div>
            </div>
            <div class="toiltChart">
              <div ref="manToilt" class="manToilt"></div>
              <ul class="toiltList">
                <li>
                  <i class="toiltIcon_bg">
                    <img src="../images/t_bg1.png" alt="" />
                  </i>
                  <p class="p1">环境质量</p>
                  <p :class="qualityStatus == 1 ? 'short' : 'excellent'">
                    {{ maleToilt | environmentQuality }}
                    <!-- 优 -->
                  </p>
                </li>
                <li>
                  <i class="toiltIcon_bg">
                    <img src="../images/t_bg2.png" alt="" />
                  </i>
                  <p class="p1">保洁员</p>
                  <p class="p3">肖杰</p>
                </li>
                <li>
                  <i class="toiltIcon_bg">
                    <img src="../images/t_bg3.png" alt="" />
                  </i>
                  <p class="p1">保洁次数</p>
                  <p class="p3">5</p>
                </li>
              </ul>
            </div>
          </div>
          <div class="right-2">
            <div class="publicTitle">
              <p class="c-title">当前女厕环境情况</p>
              <div class="c-img"></div>
            </div>
            <div class="toiltChart">
              <div ref="womanToilt" class="womanToilt"></div>
              <ul class="toiltList">
                <li>
                  <i class="toiltIcon_bg">
                    <img src="../images/t_bg1.png" alt="" />
                  </i>
                  <p class="p1">环境质量</p>
                  <p :class="qualityStatus == 1 ? 'short' : 'excellent'">
                    {{ feMaleToilt | environmentQuality }}
                    <!-- 优 -->
                  </p>
                </li>
                <li>
                  <i class="toiltIcon_bg">
                    <img src="../images/t_bg2.png" alt="" />
                  </i>
                  <p class="p1">保洁员</p>
                  <p class="p3">肖岚</p>
                </li>
                <li>
                  <i class="toiltIcon_bg">
                    <img src="../images/t_bg3.png" alt="" />
                  </i>
                  <p class="p1">保洁次数</p>
                  <p class="p3">5</p>
                </li>
              </ul>
            </div>
          </div>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import * as echarts from 'echarts'; // 引入echarts
// import videoAddress from "@/view/smokeDetector/smokeDetectorMap/components/videoAddress";
import { getAccessToken } from 'api/screen';
import { mapGetters, mapMutations } from 'vuex';
import {
  newDevDataList,
  getQueryHistoryOneWeek,
  getFindByDate
} from 'api/toilt';
// 除法运算
function division (num1, num2) {
  var t1, t2, r1, r2;
  try {
    t1 = num1.toString().split('.')[1].length;
  } catch (e) {
    t1 = 0;
  }
  try {
    t2 = num2.toString().split('.')[1].length;
  } catch (e) {
    t2 = 0;
  }
  r1 = Number(num1.toString().replace('.', ''));
  r2 = Number(num2.toString().replace('.', ''));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}
// 数组拆分成多个数组
function group (array, subGroupLength) {
  let index = 0;
  let newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)));
  }
  return newArray;
}
export default {
  data () {
    return {
      gentsChart: null,
      manToilt: null,
      womanToilt: null,
      code: this.$route.query.code,
      // code: "12345678",
      toiletName: '',
      allMaleFlowAll: 0,
      allFemaleFlowAll: 0,
      allMaleFlowIn: 0,
      allFemaleflowIn: 0,
      curIn: 0, // 今日客流
      allIn: 0, // 累计客流
      malePer: 0,
      femalePer: 0,
      allMalePer: 0,
      allFeMalePer: 0,
      maleToilt: {},
      feMaleToilt: {},
      maleToiltArr: [], // 男厕所环境
      feMaleToiltArr: [], // 女厕所环境
      maleFree: [], // 男厕空闲坑位
      femaleFree: [], // 女厕空闲坑位
      allFree: 0,
      maleUsed: [], // 男厕使用坑位
      femaleUsed: [], // 女厕使用坑位
      allUsed: 0,
      qualityStatus: '', // 1:差；2：优
      weekMaleNum: [], // 一周男厕客流
      weekFeMaleNum: [], // 一周女厕客流
      weekDays: [], // 一周日期
      topFemalData: [],
      bottomFemalData: [],
      bottomMaleData: [],
      topMaleData: []
    };
  },
  mounted () {
    this.$nextTick(() => {
      this.code = this.common.toiltId;
      this._getQueryHistoryOneWeek(this.code);
      this._getDevDataList();
    });
  },
  computed: {
    ...mapGetters(['common', 'openPage'])
    // environmentQuality: function() {
    //   return function(value) {
    //     // let { h2s, nh3 } = value;
    //     let h2s = Number(value.h2s);
    //     let nh3 = Number(value.nh3);
    //     // 环境质量优差计算
    //     // if (h2s && nh3) {
    //     // const h2sMax = division(1.39, h2s); //硫化氢阈值
    //     // const nh3Max = division(0.695, nh3); //氨气阈值
    //     if (h2s >= 1.39 || nh3 >= 0.695) {
    //       this.qualityStatus = 1;
    //       return "差";
    //     } else{
    //       this.qualityStatus = 2;
    //       return "优";
    //     }
    //     // }
    //   };
    // }
  },
  filters: {
    environmentQuality (value) {
      // let { h2s, nh3 } = value;
      let h2s = Number(value.h2s);
      let nh3 = Number(value.nh3);
      // 环境质量优差计算
      // if (h2s && nh3) {
      // const h2sMax = division(1.39, h2s); //硫化氢阈值
      // const nh3Max = division(0.695, nh3); //氨气阈值
      if (h2s >= 1.39 || nh3 >= 0.695) {
        // this.qualityStatus = 1;
        return '差';
      } else {
        // this.qualityStatus = 2;
        return '优';
      }
    }
  },
  components: {},
  methods: {
    ...mapMutations(['common', 'set_common']),
    // 公厕下的设备详情
    _getDevDataList () {
      let data = {
        toiletId: this.code
      };
      newDevDataList(data).then(res => {
        if (res.code == '200') {
          let { male, female, toiletName } = res.data;
          this.maleToilt = male;
          this.feMaleToilt = female;
          this.toiletName = toiletName;
          console.log(male, female, toiletName, '00000');
          for (let k in male) {
            if (k === 'h2s') {
              this.maleToiltArr[0] = male[k];
            } else if (k === 'nh3') {
              this.maleToiltArr[1] = male[k];
            } else if (k === 'humidity') {
              this.maleToiltArr[3] = male[k];
            } else if (k === 'temperature') {
              this.maleToiltArr[2] = male[k];
            }
          }
          for (let j in female) {
            if (j === 'h2s') {
              this.feMaleToiltArr[0] = female[j];
            } else if (j === 'nh3') {
              this.feMaleToiltArr[1] = female[j];
            } else if (j === 'humidity') {
              this.feMaleToiltArr[3] = female[j];
            } else if (j === 'temperature') {
              this.feMaleToiltArr[2] = female[j];
            }
          }
          this.allMaleFlowAll = male.flowAll;
          this.allMaleFlowIn = male.flowIn;
          this.allFemaleFlowAll = female.flowAll;
          this.allFemaleflowIn = female.flowIn;
          // 今日客流
          this.curIn = Number(male.flowIn) + Number(female.flowIn);
          // 百分比
          this.malePer = (Number(male.flowIn) / this.curIn).toFixed(1) * 100;
          this.femalePer =
            (Number(female.flowIn) / this.curIn).toFixed(1) * 100;
          // 累计客流
          this.allIn = Number(male.flowAll) + Number(female.flowAll);
          this.allMalePer =
            (Number(male.flowAll) / this.allIn).toFixed(1) * 100;
          this.allFeMalePer =
            (Number(female.flowAll) / this.allIn).toFixed(1) * 100;
          // 男厕空闲坑位
          this.maleFree = male.pit.filter(e => e.state == 0);
          // 女厕空闲坑位
          this.femaleFree = female.pit.filter(e => e.state == 0);
          // 使用坑位
          // 男厕使用坑位
          this.maleUsed = male.pit.filter(e => e.state == 1);
          // 女厕使用坑位
          this.femaleUsed = female.pit.filter(e => e.state == 1);
          this.allFree = this.maleFree.length + this.femaleFree.length;
          this.allUsed = this.maleUsed.length + this.femaleUsed.length;
          this.handleInit02(this.maleToiltArr);
          this.handleInit03(this.feMaleToiltArr);
          let femalegroupedArray = group(this.feMaleToilt.pit, 4);
          let malegroupedArray = group(this.maleToilt.pit, 4);
          // 女厕
          this.topFemalData = femalegroupedArray[0];
          this.bottomFemalData = femalegroupedArray[1];
          // 男厕
          this.topMaleData = malegroupedArray[0];
          this.bottomMaleData = malegroupedArray[1];
        }
      });
    },
    // 获取七天内公厕客流数据
    _getQueryHistoryOneWeek (code) {
      getQueryHistoryOneWeek(code).then(res => {
        if (res.code == '200') {
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
    // 公厕七日客流
    handleInit01 (weekMaleNum, weekFeMaleNum, weekDays) {
      this.gentsChart = this.$echarts.init(this.$refs.gentsChart, 'chalk');
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          textStyle: {
            align: 'left'
          }
        },
        legend: {
          data: ['男厕', '女厕'],
          right: '0%',
          top: '7%',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#fff',
            fontFamily: 'PingFangSC',
            fontWeight: 400,
            fontSize: 14
          }
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: weekDays,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#266F97', // 更改坐标轴文字颜色
                fontSize: 14 // 更改坐标轴文字大小
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.18)' // 更改坐标轴颜色
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['rgba(255,255,255,0.18)']
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#266F97', // 更改坐标轴文字颜色
                fontSize: 14 // 更改坐标轴文字大小
              }
            }
          }
        ],
        series: [
          {
            name: '男厕',
            type: 'bar',
            barWidth: 5,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#0AA8FF' },
                  { offset: 1, color: 'rgba(36,237,255,0)' }
                ])
              }
            },
            data: weekMaleNum
          },
          {
            name: '女厕',
            type: 'bar',
            barWidth: 5,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#FF80CF' },
                  { offset: 1, color: 'rgba(255,51,187,0.10)' }
                ])
              }
            },
            data: weekFeMaleNum
          }
        ]
      };
      this.gentsChart.setOption(option);
      window.addEventListener('resize', () => this.gentsChart.resize(), false);
    },
    handleInit02 (data) {
      this.manToilt = this.$echarts.init(this.$refs.manToilt, 'chalk');
      let option = {
        backgroundColor: 'transparent',
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(255,237,88,1)'
          },
          {
            offset: 1,
            color: 'rgba(255,91,44,1)'
          }
        ]),
        tooltip: {
          show: false // 弹层数据去掉
        },
        radar: {
          // shape: 'circle',
          radius: '60%',
          name: {
            formatter: param => {
              if (param == '硫化氢') {
                return `{a| ${param}}\n{b| ${data[0]}PPM}`;
              } else if (param == '氨气') {
                return `{a| ${param}}\n{b| ${data[1]}PPM}`;
              } else if (param == '温度') {
                return `{a| ${param}}\n{b| ${data[2]}℃}`;
              } else if (param == '湿度') {
                return `{a| ${param}}\n{b| ${data[3]}%}`;
              }
            },
            rich: {
              a: {
                fontSize: 14,
                color: '#fff',
                fontWeight: 400,
                fontFamily: 'PingFangSC',
                lineHeight: 21
                // padding: [0, 5, 0, 5],
              },
              b: {
                color: '#FFFFFF',
                fontSize: 18,
                fontFamily: 'Helvetica'
                // padding: [0, 0, 0, 5],
              },
              triggerEvent: true
            }
          },
          indicator: [
            { name: '硫化氢', max: 10 },
            { name: '氨气', max: 30 },
            { name: '温度', max: 100 },
            { name: '湿度', max: 100 }
          ],
          splitArea: {
            // 坐标轴在 grid 区域中的分隔区域，默认不显示。
            show: true,
            areaStyle: {
              // 分隔区域的样式设置。
              color: 'rgba(255,255,255,0)' // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
            }
          },
          axisLine: {
            // 指向外圈文本的分隔线样式
            lineStyle: {
              color: 'rgba(255,255,255,0)'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'solid',
              color: 'rgba(36,100,184,1)', // 分隔线颜色
              width: 1 // 分隔线线宽
            }
          }
        },
        series: [
          {
            name: '当前男厕环境情况',
            type: 'radar',
            data: [
              {
                value: data,
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: 'rgba(255,237,88,0.4)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(255,91,44,0.4)'
                      }
                    ])
                  }
                },
                itemStyle: {
                  normal: {
                    borderWidth: 10
                  }
                }
              }
            ]
          }
        ]
      };
      this.manToilt.setOption(option);
      window.addEventListener('resize', () => this.manToilt.resize(), false);
    },
    handleInit03 (data) {
      this.womanToilt = this.$echarts.init(this.$refs.womanToilt, 'chalk');
      let option = {
        backgroundColor: 'transparent',
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(255,44,209,1)'
          },
          {
            offset: 1,
            color: 'rgba(197,88,255,1)'
          }
        ]),
        tooltip: {
          show: false // 弹层数据去掉
        },
        radar: {
          // shape: 'circle',
          radius: '60%',
          name: {
            formatter: param => {
              if (param == '硫化氢') {
                return `{a| ${param}}\n{b| ${data[0]}PPM}`;
              } else if (param == '氨气') {
                return `{a| ${param}}\n{b| ${data[1]}PPM}`;
              } else if (param == '温度') {
                return `{a| ${param}}\n{b| ${data[2]}℃}`;
              } else if (param == '湿度') {
                return `{a| ${param}}\n{b| ${data[3]}%}`;
              }
            },
            rich: {
              a: {
                fontSize: 14,
                color: '#fff',
                fontWeight: 400,
                fontFamily: 'PingFangSC',
                lineHeight: 21
                // padding: [0, 5, 0, 5],
              },
              b: {
                color: '#FFFFFF',
                fontSize: 18,
                fontFamily: 'Helvetica'
                // padding: [0, 0, 0, 5],
              },
              triggerEvent: true
            }
          },
          indicator: [
            { name: '硫化氢', max: 10 },
            { name: '氨气', max: 30 },
            { name: '温度', max: 100 },
            { name: '湿度', max: 100 }
          ],
          splitArea: {
            // 坐标轴在 grid 区域中的分隔区域，默认不显示。
            show: true,
            areaStyle: {
              // 分隔区域的样式设置。
              color: 'rgba(255,255,255,0)' // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
            }
          },
          axisLine: {
            // 指向外圈文本的分隔线样式
            lineStyle: {
              color: 'rgba(255,255,255,0)'
            }
          },
          splitLine: {
            lineStyle: {
              type: 'solid',
              color: 'rgba(36,100,184,1)', // 分隔线颜色
              width: 1 // 分隔线线宽
            }
          }
        },
        series: [
          {
            name: '当前女厕环境情况',
            type: 'radar',
            data: [
              {
                value: data,
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: 'rgba(255,44,209,0.4)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(197,88,255,0.4)'
                      }
                    ])
                  }
                },
                itemStyle: {
                  normal: {
                    borderWidth: 10
                  }
                }
              }
            ]
          }
        ]
      };
      this.womanToilt.setOption(option);
      window.addEventListener('resize', () => this.womanToilt.resize(), false);
    },
    _getAccessToken () {
      getAccessToken().then(res => {
        if (res.code === '200') {
          this.set_common({
            accessToken: res.data
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
/deep/.el-progress {
  width: 160px;
  .el-progress-bar {
    .el-progress-bar__outer {
      background: transparent;
    }
  }
  .el-progress__text {
    font-size: 20px;
    font-family: Helvetica;
    text-align: left;
    color: #ffffff;
  }
}
/deep/.left_man {
  .el-progress-bar {
    .el-progress-bar__outer {
      .el-progress-bar__inner {
        border-radius: 7px !important;
        background: linear-gradient(270deg, #4ce6e3, rgba(33, 51, 143, 0));
      }
    }
  }
}
/deep/.right_man {
  .el-progress-bar {
    .el-progress-bar__outer {
      .el-progress-bar__inner {
        border-radius: 7px !important;
        background: linear-gradient(270deg, #931dff, rgba(33, 51, 143, 0));
      }
    }
  }
}
/deep/.left_woman {
  .el-progress-bar {
    .el-progress-bar__outer {
      .el-progress-bar__inner {
        border-radius: 7px !important;
        background: linear-gradient(270deg, #e6d64c, rgba(33, 51, 143, 0));
      }
    }
  }
}
/deep/.right_woman {
  .el-progress-bar {
    .el-progress-bar__outer {
      .el-progress-bar__inner {
        border-radius: 7px !important;
        background: linear-gradient(270deg, #ff9948, rgba(33, 51, 143, 0));
      }
    }
  }
}
.wisdomToiltDetail {
  width: 100%;
  height: 100%;
  background: url("../images/new_toilt_bg.png") center center no-repeat;
  background-size: 100% 100%;
  /deep/.el-container {
    height: 100%;
  }
  /deep/.container {
    padding: 0 30px;
  }
  /deep/.el-header {
    height: auto !important;
    color: #fff;
    text-align: center;
    .toiltHeader {
      width: 95%;
      height: 70px;
      img {
        max-width: 100%;
      }
    }
    .toiltInfo {
      display: grid;
      grid-template-columns: repeat(3, 33%);
      align-items: center;
      width: 96%;
      height: 172px;
      background: url("../images/toiltInfo.png") center center no-repeat;
      background-size: 100% 100%;
      margin: 0 auto;
      .currentFlow {
        display: flex;
        align-items: center;
        justify-content: space-around;
        .flowNum {
          display: flex;
          align-items: center;
          .imgBox {
            width: 116px;
            height: 100px;
            img {
              max-width: 100%;
            }
          }
          .flowText {
            p {
              &:first-child {
                font-size: 20px;
                font-family: PingFangSC;
                font-weight: 600;
                text-align: left;
                color: #ffffff;
                line-height: 28px;
              }
            }
            .curIn {
              font-size: 32px;
              font-family: PangMenZhengDao; //PangMenZhengDao
              text-align: left;
              color: #45ffdb;
            }
            .allIn {
              font-size: 32px;
              font-family: PangMenZhengDao;
              text-align: left;
              color: #ffc45f;
            }
          }
        }
        .flowProgress {
          .pro {
            display: flex;
            align-items: center;
            width: 200px;
            line-height: 36px;
            span {
              font-size: 20px;
              font-family: PingFangSC;
              font-weight: 400;
              text-align: left;
              color: #ffffff;
              margin-right: 5px;
            }
          }
        }
      }
      .centerInfo {
        display: flex;
        justify-content: space-around;
        align-items: center;
        // width: 740px;
        width: 100%;
        height: 54px;
        /* background: url("../images/toilt_c.gif") center center no-repeat;
        background-size: 100% 100%;
        margin: 0 auto; */
        margin-bottom: 36px;
        .left {
          width: 80px;
          height: 60px;
          background: url("../images/left.gif") center center no-repeat;
          background-size: 100% 100%;
        }
        .right {
          width: 80px;
          height: 60px;
          background: url("../images/right.gif") center center no-repeat;
          background-size: 100% 100%;
        }
        .center {
          display: flex;
          align-items: center;
          justify-content: center;
          .icon {
            display: inline-block;
            width: 60px;
            height: 60px;
            background: url("../images/icon_adress.gif") center center no-repeat;
            background-size: 100% 100%;
          }
          .name {
            font-size: 30px;
            font-family: PingFangSC;
            font-weight: 600;
            text-align: center;
            color: #ffffff;
            text-shadow: 0px 5px 7px 0px #003868;
          }
        }
      }
    }
  }
  .publicTitle {
    .c-title {
      font-size: 28px;
      font-family: YouSheBiaoTiHei;
      text-align: left;
      color: #ffffff;
      line-height: 26px;
      letter-spacing: 1px;
      text-shadow: 0px 2px 4px 0px #1c4696;
      margin-bottom: 5px;
    }
    .c-img {
      width: 100%;
      height: 6px;
      background: url("../images/title_line.png") center center no-repeat;
      background-size: 100% 100%;
    }
    .videoContent {
      height: 220px;
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
  }
  .toiltChart {
    display: flex;
    align-items: center;
    margin-top: 10px;
    .manToilt {
      width: calc(100% - 80px);
      height: 250px;
    }
    .womanToilt {
      width: calc(100% - 80px);
      height: 250px;
    }
    .toiltList {
      width: 80px;
      // height: 250px;
      height: calc(100% - 30px);
      padding: 10px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      background: linear-gradient(
        180deg,
        rgba(2, 118, 168, 0.21),
        rgba(5, 106, 188, 0) 100%
      );
      border-radius: 12px;
      li {
        .toiltIcon_bg {
          display: inline-block;
          width: 40px;
          height: 34px;
          background: url("../images/toilt_icon.gif") center center no-repeat;
          background-size: 100% 100%;
          line-height: 34px;
          text-align: center;
          img {
            max-width: 40%;
          }
        }
        .p1 {
          font-size: 14px;
          font-family: PingFangSC;
          font-weight: 400;
          text-align: center;
          color: #61b1e1;
        }
        .short {
          font-size: 16px;
          font-family: PingFangSC;
          font-weight: 600;
          text-align: center;
          color: #ff8e72;
          line-height: 24px;
        }
        .excellent {
          font-size: 16px;
          font-family: PingFangSC;
          font-weight: 600;
          text-align: center;
          color: #5cffd8;
          line-height: 24px;
        }
        .p3 {
          font-size: 16px;
          font-family: PingFangSC;
          font-weight: 600;
          text-align: center;
          color: #ffffff;
          line-height: 24px;
        }
      }
    }
  }
  /deep/.el-aside {
    color: #fff;
    text-align: center;
    overflow-y: hidden;
    .left-1 {
      width: 100%;
      height: auto;
      background: url("../images/left_1.png") center center no-repeat;
      background-size: 100% 100%;
      margin-bottom: 10px;
      padding: 20px;
      .leftList {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 48%;
          height: 86px;
          padding: 13px 20px;
          margin-top: 20px;
          background: linear-gradient(
            270deg,
            rgba(2, 36, 71, 0.09),
            rgba(5, 109, 184, 0.36) 57%,
            rgba(2, 36, 71, 0.09) 100%
          );
          border: 1px solid;
          border-image: linear-gradient(270deg, #003e57, #51cdff 49%, #002c4f) 1
            1;
          .weekText {
            p {
              &:first-child {
                font-size: 14px;
                font-family: PingFangSC;
                font-weight: 400;
                color: #61b1e1;
                line-height: 20px;
              }
              &:last-child {
                font-size: 22px;
                font-family: PangMenZhengDao;
                text-align: left;
                color: #ffffff;
                line-height: 25px;
                margin-top: 8px;
              }
            }
          }
          .weekImg {
            display: inline-block;
            width: 60px;
            height: 60px;
            img {
              max-width: 100%;
            }
          }
        }
      }
      .gentsChart {
        width: 100%;
        height: 370px;
      }
    }
    /* .left-2 {
      width: 100%;
      height: 280px;
      background: url("../images/left2.png") center center no-repeat;
      background-size: 100% 100%;
      padding: 20px;
    } */
    .right-1 {
      width: 100%;
      height: 330px;
      background: url("../images/right1.png") center center no-repeat;
      background-size: 100% 100%;
      // margin-bottom: 10px;
      padding: 20px;
    }
    .right-2 {
      width: 100%;
      height: 330px;
      background: url("../images/right2.png") center center no-repeat;
      background-size: 100% 100%;
      padding: 20px;
    }
  }

  /deep/.el-main {
    color: #fff;
    text-align: center;
    line-height: 160px;
    position: relative;
    overflow: hidden;
    .toiltKketch {
      position: absolute;
      top: -7%;
      left: 0%;
      width: 100%;
      height: 100%;
      background: url("../images/toiltContainer.png") center center no-repeat;
      background-size: 130% 100%;
      .topFemal {
        width: 25%;
        display: flex;
        justify-content: flex-end;
        position: absolute;
        top: 17%;
        left: 19%;
        transform: skew(-27deg, 11deg);
        li {
          position: relative;
          width: 50px;
          height: 60px;
          background: #45ffc4;
          margin-left: 1px;
          .toiltIcon {
            width: 20px;
            position: absolute;
            top: 30%;
            left: 30%;
            transform: skewX(10deg);
          }
        }
        .redIcon {
          position: relative;
          width: 50px;
          height: 60px;
          margin-left: 1px;
          background: rgba(255, 62, 21, 0.76);
          .redToilt {
            width: 20px;
            position: absolute;
            top: 30%;
            left: 30%;
            transform: skewX(10deg);
          }
          .redCircle {
            position: absolute;
            bottom: 2%;
            left: 20%;
            width: 30px;
          }
          .redTopInfo {
            position: absolute;
            bottom: 35%;
            left: 0%;
            transform: skew(25deg, -10deg);
            width: 130px;
            height: 100px;
            background: url("../images/redTopInfo.png") center center no-repeat;
            background-size: 100% 100%;
          }
        }
      }
      .bottomFemal {
        width: 30%;
        display: flex;
        position: absolute;
        justify-content: flex-end;
        top: 41%;
        left: 5%;
        transform: skew(-26deg, 10deg);
        li {
          position: relative;
          width: 50px;
          height: 60px;
          background: #45ffc4;
          margin-left: 1px;
          .toiltIcon {
            width: 20px;
            position: absolute;
            top: 30%;
            left: 30%;
            transform: skewX(10deg);
          }
        }
        .redIcon {
          position: relative;
          width: 50px;
          height: 60px;
          margin-left: 1px;
          background: rgba(255, 62, 21, 0.76);
          .redToilt {
            width: 20px;
            position: absolute;
            top: 30%;
            left: 30%;
            transform: skewX(10deg);
          }
          .redCircle {
            position: absolute;
            top: 65%;
            left: 20%;
            width: 30px;
          }
          .redBottomInfo {
            position: absolute;
            top: 96%;
            right: 7%;
            transform: skew(25deg, -10deg);
            width: 130px;
            height: 100px;
            background: url("../images/redBottomInfo.png") center center
              no-repeat;
            background-size: 100% 100%;
          }
        }
      }
      .topMale {
        width: 30%;
        display: flex;
        justify-content: flex-start;
        position: absolute;
        top: 38%;
        left: 62%;
        transform: skew(-25deg, 8deg);
        li {
          position: relative;
          width: 50px;
          height: 60px;
          background: #45ffc4;
          margin-right: 1px;
          .toiltIcon {
            width: 20px;
            position: absolute;
            top: 30%;
            left: 30%;
            transform: skewX(10deg);
          }
        }
        .redIcon {
          position: relative;
          width: 50px;
          height: 60px;
          margin-right: 1px;
          background: rgba(255, 62, 21, 0.76);
          .redToilt {
            width: 20px;
            position: absolute;
            top: 30%;
            left: 30%;
            transform: skewX(10deg);
          }
          .redCircle {
            position: absolute;
            top: 2%;
            left: 20%;
            width: 30px;
          }
          .redTopInfo {
            position: absolute;
            bottom: 93%;
            left: 0%;
            transform: skew(25deg, -7deg);
            width: 130px;
            height: 100px;
            background: url("../images/redTopInfo.png") center center no-repeat;
            background-size: 100% 100%;
          }
        }
      }
      .bottomMale {
        width: 30%;
        display: flex;
        position: absolute;
        justify-content: flex-start;
        top: 51%;
        left: 51%;
        transform: skew(-26deg, 10deg);
        li {
          position: relative;
          width: 50px;
          height: 60px;
          background: #45ffc4;
          margin-right: 1px;
          .toiltIcon {
            width: 20px;
            position: absolute;
            top: 30%;
            left: 30%;
            transform: skewX(10deg);
          }
        }
        .redIcon {
          position: relative;
          width: 50px;
          height: 60px;
          margin-right: 1px;
          background: rgba(255, 62, 21, 0.76);
          .redToilt {
            width: 20px;
            position: absolute;
            top: 30%;
            left: 30%;
            transform: skewX(10deg);
          }
          .redCircle {
            position: absolute;
            top: 65%;
            left: 20%;
            width: 30px;
          }
          .redBottomInfo {
            position: absolute;
            top: 96%;
            right: 7%;
            transform: skew(25deg, -10deg);
            width: 130px;
            height: 100px;
            background: url("../images/redBottomInfo.png") center center
              no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
    .toiltTooltip {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 30%;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      .tooltipBox {
        width: 300px;
        height: 130px;
        background: url("../images/tooltip.gif") center center no-repeat;
        background-size: 100% 100%;
        .tooltipBg {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          height: 100%;
          padding-left: 30px;
          background: url("../images/gray_bg.png") center center no-repeat;
          background-size: 100% 100%;
          .tooltipImg {
            width: 80px;
            height: 70px;
            display: flex;
            align-content: center;
            img {
              max-width: 100%;
            }
          }
          .tooltipInfo {
            margin-left: 20px;
            .tipTitle {
              font-size: 20px;
              font-family: PingFangSC, PingFangSC-Semibold;
              font-weight: 600;
              text-align: left;
              color: #ffffff;
              line-height: 28px;
            }
            .tip1 {
              font-size: 32px;
              font-family: PangMenZhengDao;
              text-align: left;
              color: #45ffdb;
              line-height: 37px;
            }
            .tip2 {
              color: #fb7757;
            }
          }
        }
      }
    }
  }
}
</style>
