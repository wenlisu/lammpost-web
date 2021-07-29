<template>
  <div class="rightTable">
    <partTitle :title="title" />
    <div ref="rightLine" class="rightLine"></div>
    <div class="pieBox">
      <partTitle :title="bottomTitle" />
      <div ref="pieChart" class="pieChart"></div>
    </div>
  </div>
</template>

<script>
import partTitle from "../../components/commonTitle";
import layer from "../images/LED.png";
import moment from "moment";
import * as echarts from "echarts"; // 引入echarts
import { getLedDisplayCountInfo, getLedApplyInfo } from "@/api/wisdomPublish";
export default {
  data() {
    return {
      title: "LED显示屏播放情况分析",
      bottomTitle: "LED显示屏应用场景情况分析",
      rightLine: null,
      pieChart: null,
      displayTimeList: [
        {
          did: "currentDisplay", // 播放总数
          tid: "currentTie", // 播放时长
          name: "当月",
        },
        {
          did: "lastDisplay", // 播放总数
          tid: "lastTime", // 播放时长
          name: "上月",
        },
        {
          did: "lastTwoDisplay", // 播放总数
          tid: "lastTwoTime", // 播放时长
          name: "前月",
        },
        {
          did: "lastThreeDisplay", // 播放总数
          tid: "lastThreeTime", // 播放时长
          name: "3个月前",
        },
        {
          did: "lastFourDisplay", // 播放总数
          tid: "lastFourTime", // 播放时长
          name: "4个月前",
        },
        {
          did: "lastFiveDisplay", // 播放总数
          tid: "lastFiveTime", // 播放时长
          name: "5个月前",
        },
      ],
      regionList: [
        { value: 0, name: "政策宣传", id: 'one' },
        { value: 0, name: "文化传播", id: 'two' },
        { value: 0, name: "公益", id: 'three' },
        { value: 0, name: "应急传媒", id: 'four' },
        { value: 0, name: "交通指引", id: 'five' },
      ],
    };
  },
  components: {
    partTitle,
  },
  mounted() {
    this.$nextTick(() => {
      this.handleInitLineBar();
      this.handleInitPie();
    });
  },
  methods: {
    getLineData() {
      return getLedDisplayCountInfo().then((res) => {
        if (res.code === "200") {
          const { data } = res;
          let month = new Date().getMonth() + 1;
          console.log(month, "this month");
          // 处理近半年信息
          let allData = [];
          this.displayTimeList.forEach((item, index) => {
            let premonth = moment(new Date())
              .subtract(index, "months")
              .format("YYYY-MM");
            console.log(premonth, "pre month", index);
            allData.push({
              timeAxis: premonth,
              disValue: data[item.did],
              timesValue: data[item.tid],
            });
          });
          allData = allData.reverse(); // 倒序日期从前往后
          return allData;
        }
      });
    },
    // 折柱混合
    async handleInitLineBar() {
      this.rightLine = this.$echarts.init(this.$refs.rightLine, "chalk");
      let result = await this.getLineData();
      console.log(result, "result");
      let allData = {
        time: [],
        value1: [],
        value2: [],
      };
      if (result && result.length) {
        result.map((item) => {
          allData.time.push(item.timeAxis);
          allData.value1.push(item.disValue);
          allData.value2.push(item.timesValue);
        });
      } else {
        // 测试数据
        allData.time = [
          "2021-01",
          "2021-02",
          "2021-03",
          "2021-04",
          "2021-05",
          "2021-06",
        ];
        allData.value1 = [120, 132, 101, 134, 90, 230];
        allData.value2 = [220, 182, 191, 234, 290, 330];
      }
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
        },
        legend: {
          itemWidth: 10,
          itemHeight: 4,
          icon: "rect",
          // orient: "vertical",
          left: "center",
          bottom: "0%",
          textStyle: {
            color: "#ffffff",
            fontFamily: "PingFangSC",
            fontWeight: 400,
            fontSize: 12,
          },
          data: [
            {
              name: "播放次数",
            },
            {
              name: "播放时长",
            },
          ],
        },
        xAxis: [
          {
            type: "category",
            data: allData.time,
            axisPointer: {
              type: "shadow",
            },
            axisLabel: {
              color: "rgba(145,163,206,1)",
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "(h)",
            nameTextStyle: {
              color: "#91a3ce",
              align: "center",
              padding: [0, 40, 0, 0],
            },
            nameGap: 20,
            min: 0,
            // max: 250,
            // interval: 50,
            axisLabel: {
              formatter: "{value} ",
              color: "#91a3ce",
              fontFamily: "Helvetica",
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.09)",
              },
            },
            axisLine: {
              show: false,
            },
          },
          {
            type: "value",
            name: "(t)",
            nameTextStyle: {
              color: "#91a3ce",
              align: "center",
              padding: [0, 0, 0, 30],
            },
            nameGap: 20,
            min: 0,
            // max: 25,
            // interval: 50,
            color: "rgba(145,163,206,1)",
            axisLabel: {
              formatter: "{value} ",
              color: "#91a3ce",
              fontFamily: "Helvetica",
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,0.09)",
              },
            },
            axisLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "播放次数",
            type: "line",
            yAxisIndex: 1,
            showSymbol: false,
            itemStyle: {
              normal: {
                color: "rgba(41,255,170,1)",
                lineStyle: {
                  color: "rgba(41,255,170,1)", //改变折线颜色
                },
              },
            },
            data: allData.value1,
          },
          {
            name: "播放时长",
            type: "bar",
            barWidth: 10,
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(40,222,255,1)", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(18,127,230,1)", // 100% 处的颜色
                    },
                  ],
                },
              },
            },
            data: allData.value2,
          },
        ],
      };
      this.rightLine.setOption(option);
      window.addEventListener("resize", () => this.rightLine.resize(), false);
    },
    getPieData() {
      return getLedApplyInfo().then((res) => {
        if (res.code === "200") {
          const { data } = res;
          this.regionList = this.regionList.map(e => {
            return {
              ...e,
              value: data[e.id]? data[e.id]: 0
            }
          })
          return this.regionList;
        }
      });
    },
    async handleInitPie() {
      this.pieChart = this.$echarts.init(this.$refs.pieChart, "chalk");
      let result = await this.getPieData();
      let allData = [];
      if (result && result.length) {
        allData = result.map((item) => {
          return {
            name: item.name,
            value: item.value,
          };
        });
      } else {
        // 测试假数据
        allData = [
          { value: 335, name: "政策宣传" },
          { value: 310, name: "文化传播" },
          { value: 234, name: "公益" },
          { value: 135, name: "应急传媒" },
          { value: 1548, name: "交通指引" },
        ];
      }
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          itemWidth: 10,
          itemHeight: 10,
          icon: "circle",
          orient: "vertical",
          left: "75%",
          top: "40%",
          textStyle: {
            color: "#91A3CE",
            fontFamily: "PingFangSC",
            fontWeight: 400,
            fontSize: 12,
          },
          data: allData.map((e) => e.name),
        },
        graphic: {
          elements: [
            {
              type: "image",
              z: 3,
              style: {
                image: layer,
                width: 86,
                height: 54,
              },
              left: "center",
              top: "46%",
              // position: [150, 100],
            },
          ],
        },
        series: [
          {
            name: "播放情况",
            type: "pie",
            center: ["50%", "55%"],
            radius: ["50%", "64%"],
            clockwise: false,
            avoidLabelOverlap: false,
            color: ["#5B80F9", "#03FBEF", "#26FAB4", "#F6ED1D", "#FF794D"],
            label: {
              show: false,
              position: "center",
            },
            labelLine: {
              show: false,
            },
            data: allData,
          },
        ],
      };
      this.pieChart.setOption(option);
      window.addEventListener("resize", () => this.pieChart.resize(), false);
    },
  },
};
</script>

<style lang="less" scoped>
.rightTable {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 500px;
  height: calc(100% - 10px);
  background: url("../images/right_bg.png") center center no-repeat;
  background-size: 100% 100%;
  padding: 0 20px;
  padding-top: 60px;
  z-index: 11;
  .rightLine {
    width: 100%;
    height: 300px;
  }
  .pieBox {
    margin-top: 25px;
    .pieChart {
      width: 100%;
      height: 300px;
    }
  }
}
</style>