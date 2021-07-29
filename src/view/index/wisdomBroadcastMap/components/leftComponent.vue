<template>
  <div class="flexColumn leftTable">
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
    <partTitle :title="title" />
    <div ref="leftChart" class="leftChart"></div>
  </div>
</template>

<script>
import list1 from "../images/list1.png";
import list2 from "../images/list2.png";
import list3 from "../images/list3.png";
import list4 from "../images/list4.png";
import list5 from "../images/list5.png";
import list6 from "../images/list6.png";
import partTitle from "../../components/commonTitle";
import * as echarts from "echarts"; // 引入echarts
import { getAudioInformationCount, getAudioPlayCountRank } from "api/brocast";

export default {
  data() {
    return {
      title: "广播器播放次数排名",
      listData: [
        {
          img: list1,
          name: "广播器总数",
          id: "audioDeviceCount",
          num: 7,
          unit: "个",
        },
        {
          img: list2,
          name: "播放中",
          id: "playCount",
          num: 7,
          unit: "个",
        },
        {
          img: list3,
          name: "在线数",
          id: "audioOnlineCount",
          num: 7,
          unit: "个",
        },
        {
          img: list4,
          name: "离线数",
          id: "audioFaultCount",
          num: 0,
          unit: "个",
        },
        {
          img: list5,
          name: "累计播放次数",
          id: "audioPlayTotalCount",
          num: 8900,
          unit: "次",
        },
        {
          img: list6,
          name: "播放任务数",
          id: "audioPlayTasksCount",
          num: 896,
          unit: "个",
        },
      ],
      initChartData: [
        {
          name: "智慧音柱-001",
          value: 1000,
        },
        {
          name: "智慧音柱-002",
          value: 6472,
        },
        {
          name: "智慧音柱-003",
          value: 6473,
        },
        {
          name: "智慧音柱-004",
          value: 6374,
        },
        {
          name: "智慧音柱-005",
          value: 6375,
        },
        {
          name: "智慧音柱-006",
          value: 6376,
        },
      ],
      leftChart: null,
    };
  },
  mounted() {
    this.$nextTick(async () => {
      let data = await this.getChartData();
      this.handleInit(data);
    });
  },
  created() {
    this._getTerminalCount();
  },
  methods: {
    _getTerminalCount() {
      getAudioInformationCount().then((res) => {
        if (res.code === "200") {
          this.listData = this.listData.map((item) => {
            return {
              ...item,
              num: res.data[item.id] || 0,
            };
          });
        }
      });
    },
    getChartData() {
      return getAudioPlayCountRank({ dateInterval: 1 }).then((res) => {
        if (res.code === "200") {
          const { data } = res;
          return data;
        }
      });
    },
    handleInit(chartData) {
      this.leftChart = this.$echarts.init(this.$refs.leftChart, "chalk");
      let data = chartData
        ? chartData.map((e) => {
            return {
              name: e.deviceName,
              value: e.playCount,
            };
          })
        : this.initChartData;
      const getArrByKey = (data, k) => {
        let key = k || "value";
        let res = [];
        if (data) {
          data.forEach(function (t) {
            res.push(t[key]);
          });
        }
        return res;
      };
      let option = {
        grid: {
          top: "4%",
          bottom: "0%",
          right: 0,
          left: 0,
          containLabel: true,
        },
        xAxis: {
          show: false,
        },
        dataZoom: [
          {
            // 第一个 dataZoom 组件
            yAxisIndex: [0, 1],
            // type: 'slider',
            type: 'inside',
            endValue: 6,
            startValue: 0
          },
        ],
        yAxis: [
          {
            triggerEvent: true,
            show: true,
            inverse: true,
            data: getArrByKey(data, "name"),
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
              interval: 0,
              color: "#fff",
              align: "left",
              margin: 80,
              fontSize: 14,
              formatter: function (value, index) {
                return "{title|" + value + "次}";
              },
            },
          },
          {
            show: true,
            inverse: true,
            data: getArrByKey(data, "name"),
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            // 设置柱状图右边参数
            axisLabel: {
              formatter: function (value, index) {
                return `${data[index].value}次`;
              },
              margin: 20,
              textStyle: {
                color: "#ff8153",
                fontSize: 14,
                fontFamily: "PingFangSC",
                fontWeight: "700",
              },
            },
          },
        ],
        series: [
          {
            name: "条",
            type: "bar",
            showBackground: true,
            barBorderRadius: 30,
            yAxisIndex: 0,
            data: data,
            barWidth: 10,
            // barMinWidth: 10,
            backgroundStyle: {
              color: "#274984",
            },
            barCategoryGap: "100%",
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = [
                    ["rgba(255,98,92,1)", "rgba(255,98,92,0)"],
                    ["rgba(255,182,92,1)", "rgba(255,148,92,0)"],
                  ];
                  var index = 0;
                  if (params.dataIndex >= 3) {
                    index = 1;
                  }
                  return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    {
                      offset: 0,
                      color: colorList[index][0],
                    },
                    {
                      offset: 1,
                      color: colorList[index][1],
                    },
                  ]);
                },
              },
            },
            label: {
              normal: {
                color: "#fff",
                show: true,
                position: [0, "-20px"],
                distance: 10,
                textStyle: {
                  fontSize: 14,
                  fontWeight: 600,
                },
                formatter: function (a, b) {
                  return a.name;
                },
              },
            },
          },
        ],
      };
      // setTimeout(option => {
      //   // 每次向后滚动一个，最后一个从头开始。
      //   if (option.dataZoom[0].endValue == data.length) {
      //     option.dataZoom[0].endValue = 3;
      //     option.dataZoom[0].startValue = 0;
      //   } else {
      //     option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
      //     option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
      //   }
      // }, 2000);
      this.leftChart.setOption(option);
      window.addEventListener("resize", () => this.leftChart.resize(), false);
    },
  },
  components: {
    partTitle,
  },
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
  bottom: 10px;
  width: 500px;
  padding: 0 20px;
  background: url("../images/left_bg.png") center center no-repeat;
  background-size: 100% 100%;
  z-index: 11;
  .leftList {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 60px; /*no*/
    // margin-bottom: 30px;
    li {
      display: flex;
      // justify-content: center;
      align-items: center;
      // margin-right: 20px;
      margin-bottom: 30px;
      min-width: 46%;
      .listImg {
        display: inline-block;
        width: 95px;
        height: 95px;
        img {
          max-width: 100%;
        }
      }
      .listText {
        margin-left: 16px;
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
    }
  }
  .leftChart {
    width: 100%;
    display: flex;
    flex: 1;
    height: calc(100% - 500px);
  }
}
</style>
