<template>
  <div class="leftTable">
    <ul class="leftList">
      <li v-for="(item, index) in listData" :key="index">
        <i class="listImg">
          <img :src="item.img" alt="" />
        </i>
        <div class="listText">
          <p class="name">{{ item.name }}</p>
          <p class="num">
            {{ item.num }}<span>{{ item.unit }}</span>
          </p>
        </div>
      </li>
    </ul>
    <!-- <div ref="leftChart" class="leftChart"></div> -->
  </div>
</template>

<script>
import list1 from "../images/list1.png";
import list2 from "../images/list2.png";
import list3 from "../images/list3.png";
import list4 from "../images/list4.png";
import list5 from "../images/list5.png";
import * as echarts from "echarts"; // 引入echarts
import { setTimeout } from "timers";
import { getCameraOnlineState } from "@/api/wisdomMonitor";
export default {
  data() {
    return {
      title: "能耗分析排名",
      // dayPower (number, optional): 日用电量 ,
      // monthPower (number, optional): 月用电量 ,
      // totalPower (number, optional): 总用电量
      //  灯杆总数 lampCount; 年用电量 yearPower
      listData: [
        {
          img: list1,
          name: "摄像头总数",
          num: 0,
          unit: "个",
          id: "allCount"
        },
        {
          img: list2,
          name: "在线数",
          num: 0,
          unit: "个",
          id: "onlineCount"
        },
        {
          img: list3,
          name: "离线数",
          num: 0,
          unit: "个",
          id: "offlineCount"
        },
        {
          img: list4,
          name: "今日时间数",
          num: 0,
          unit: "个",
          id: "todayEvents"
        },
        {
          img: list5,
          name: "总事件数",
          num: 0,
          unit: "个",
          id: "alarmCount"
        }
      ],
      leftChart: null
    };
  },
  created() {
    this._getCameraOnlineState();
  },
  mounted() {
    this.$nextTick(() => {
      this.handleInit();
    });
  },
  methods: {
    _getCameraOnlineState() {
      getCameraOnlineState().then(res => {
        if (res.code === "200") {
          this.listData = this.listData.map(item => {
            return {
              ...item,
              num: res.data[item.id] || 0
            };
          });
        }
      });
    },
    handleInit() {
      this.leftChart = this.$echarts.init(this.$refs.leftChart, "chalk");
      /* let option = {
        grid: {
          left: "0%",
          right: "20%"
        },
        xAxis: {
          type: "value",
          show: false
        },
        yAxis: {
          type: "category",
          show: false,
          max: 5,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            align: "right",
            position: "inside" //在上方显示
          }
        },
        series: [
          {
            data: [19325, 23438, 31000, 121594, 134141, 681807],
            type: "bar",
            barGap: "-100%", // 使两组数据重叠
            barWidth: 10,
            barCategoryGap: 20,
            itemStyle: {
              color: function(params) {
                var colorList = [
                  ["#33FFD2", "#274984"],
                  ["#33FFD2", "#274984"],
                  ["#33AAFF", "#274984"],
                  ["#33AAFF", "#274984"]
                ];
                var index = params.dataIndex;
                if (params.dataIndex >= colorList.length) {
                  index = params.dataIndex - colorList.length;
                }
                return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: colorList[index][0]
                  },
                  {
                    offset: 1,
                    color: colorList[index][1]
                  }
                ]);
              },
              normal: {
                label: {
                  show: true, //是否显示
                  position: ["0%", "-170%"], //显示在顶部
                  formatter: function(value) {
                    return value.data.competenceName;
                  },
                  textStyle: {
                    color: "#FFFFFF", //字体颜色
                    fontSize: 14, //字体大小
                    fontFamily: "PingFangSC"
                  }
                }
              }
            }
          },
          {
            name: "",
            type: "bar",
            barWidth: 10,
            showBackground: true,
            barCategoryGap: "80%",
              barCategoryGap: 20,

            backgroundStyle: {
              color: "#274984"
            },
            itemStyle: {
              color: function(params) {
                var colorList = [
                  ["#33FFD2", "#274984"],
                  ["#33FFD2", "#274984"],
                  ["#33AAFF", "#274984"],
                  ["#33AAFF", "#274984"]
                ];
                var index = params.dataIndex;
                if (params.dataIndex >= colorList.length) {
                  index = params.dataIndex - colorList.length;
                }
                return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: colorList[index][0]
                  },
                  {
                    offset: 1,
                    color: colorList[index][1]
                  }
                ]);
              }
            },
            label: {
              // position: 'insideTopLeft',
              position: [500, 0],
              align: "right",
              //   distance:-1,
              show: true,
              fontSize: 14,
              color: "#3AFFDB",
              fontFamily: "DINAlternate",
              fontWeight: 700
            },
            data: [19325, 23438, 31000, 121594, 134141, 681807]
          }
        ]
      }; */
      var dataLine = [50, 66, 33, 25];
      var dataText = ["111", "2222", "3333", "44444"];
      let positionLeft = 0.4,
        max = 100 + 2 * positionLeft;
      let option = {
        grid: [
          {
            left: "0%",
            right: "0%",
            containLabel: true
          }
        ],
        xAxis: [
          {
            max: max,
            show: false
          }
        ],
        yAxis: [
          {
            show: false,
            axisTick: "none",
            axisLine: "none",
            offset: "27",
            axisLabel: {
              textStyle: {
                color: "#000000", //y轴字体颜色
                fontSize: "16"
              }
            },
            data: []
          },

          {
            axisLine: {
              lineStyle: {
                color: "rgba(0,0,0,0)" //y轴线颜色
              }
            },
            data: []
          },
          {
            //设置柱状图右边参数
            show: true,
            data: dataLine,
            axisLabel: {
              textStyle: {
                color: "#3AFFDB",
                fontSize: 14,
                fontFamily: "PingFangSC",
                fontWeight: "bold"
              }
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: "条",
            type: "bar",
            stack: "b",
            yAxisIndex: 0,
            data: dataLine,
            label: {
              normal: {
                show: false,
                position: "right",
                distance: 10,
                textStyle: {
                  color: "#ffffff",
                  fontSize: "16"
                }
              }
            },
            barWidth: 10,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    ["#33FFD2", "#274984"],
                    ["#33AAFF", "#274984"]
                  ];
                  var index = params.dataIndex;
                  if (params.dataIndex >= colorList.length) {
                    index = params.dataIndex - colorList.length;
                  }
                  return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    {
                      offset: 0,
                      color: colorList[index][0]
                    },
                    {
                      offset: 1,
                      color: colorList[index][1]
                    }
                  ]);
                }
              }
            },
            z: 2
          },
          {
            //背景灰框
            name: "白框",
            type: "bar",
            yAxisIndex: 1,
            barGap: "-100%", //设置-100% 则表示灰色柱状图与红色柱状图重合
            data: dataText,
            barWidth: 10,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: function(value) {
                    let div = "中山大道北1街道073杆";
                    return div;
                  },
                  position: ["0%", "-250%"],
                  textStyle: {
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontFamily: "PingFangSC",
                    fontWeight: 600
                  }
                },
                color: "#274984"
              }
            },
            z: 1 // 设置维度越高这表示覆盖低的
          },
          {
            name: "外框",
            type: "bar",
            yAxisIndex: 2,
            barGap: "-100%",
            data: [100, 100, 100, 100],
            barWidth: 10,
            itemStyle: {
              normal: {
                label: {
                  formatter: function(value) {
                    let div = "节能：" + value.data + "度";
                    return div;
                  },
                  show: true,
                  position: ["35%", "-300%"],
                  color: "#9FADE0",
                  backgroundColor: "rgba(18,64,109,0.58)",
                  padding: 4,
                  textAlign: "center",
                  fontSize: 12,
                  fontFamily: "PingFangSC",
                  fontWeight: 400
                },
                color: "#274984"
              }
            },
            z: 0
          }
        ]
      };
      /* setTimeout(option => {
        // 每次向后滚动一个，最后一个从头开始。
        if (option.dataZoom[0].endValue == dataLine.length) {
          option.dataZoom[0].endValue = 3;
          option.dataZoom[0].startValue = 0;
        } else {
          option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
          option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
        }
      }, 2000); */
      this.leftChart.setOption(option);
      window.addEventListener("resize", () => this.leftChart.resize(), false);
    }
  },
  components: {}
};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.leftTable {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 280px;
  height: calc(100% - 10px);
  padding: 0 20px;
  background: url("../images/left_bg.png") center center no-repeat;
  background-size: 100% 100%;
  z-index: 11;
  .leftList {
    width: 100%;
    display: flex;
    flex-direction: column;
    // flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 60px 0 43px 0;
    height: 100%;
    // margin-bottom: 30px;
    li {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 19%;
      // margin-right: 20px;
      // margin-bottom: 23px;
      border-bottom: 1px solid;
      border-image: linear-gradient(
          270deg,
          rgba(9, 103, 156, 0.26),
          rgba(34, 142, 216, 0.69)
        )
        1 1;
      .listImg {
        display: inline-block;
        width: 80px;
        height: 80px;
        margin-bottom: 10px;
        img {
          max-width: 100%;
        }
      }
      .listText {
        margin-left: 10px;
        .name {
          font-size: 14px;
          font-family: PingFangSC;
          font-weight: 600;
          text-align: left;
          color: #ffffff;
          line-height: 20px;
        }
        .num {
          font-size: 26px;
          font-family: PangMenZhengDao;
          text-align: left;
          color: #ffffff;
          line-height: 30px;
          span {
            font-size: 14px;
            font-family: PingFangSC;
          }
        }
      }
      &:nth-child(2n) {
        margin-right: 0;
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
  /*  .leftChart {
    width: 100%;
    height: 300px;
  } */
}
</style>
